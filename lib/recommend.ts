/**
 * Step 3–5：精准推荐 + 适度意外推荐 + 排序去重
 * 严格对应 docs/05「五~七」。
 *
 *   Step 3 精准：余弦相似度 Top 候选 → 过滤低置信度 → 品类去重选 2–3 本
 *   Step 4 意外：在用户向量的模糊轴(35<v<65)上偏移 ±25，找高分(≥8.0)且未重复的书 1–2 本
 *   Step 5 输出：精准在前、意外在后，去重，最终 3–5 本
 */
import type {
  AxisVector,
  Book,
  BookGrid,
  Recommendation,
  RecommendResult,
} from "@/types";
import { AXIS_ORDER } from "@/types";
import { AXES } from "@/data/axes";
import { BOOKS } from "@/data/books";
import { matchBookGrid } from "@/lib/bookgrid-matcher";

// ---- 调参常量（来自 docs/05）----
const MIN_CONFIDENCE = 0.75; // 精准候选最低标注置信度
const PRECISE_TOPK = 20; // 精准候选池大小
const PRECISE_PICK = 3; // 精准最终最多本数
const SURPRISE_SCORE = 8.0; // 意外推荐最低豆瓣分
const SURPRISE_PICK = 2; // 意外最多本数
const AMBIGUOUS_LO = 35;
const AMBIGUOUS_HI = 65;
const SHIFT = 25; // 偏移分值
const MAX_TOTAL = 5; // 最终最多本数

/** 余弦相似度 */
export function cosineSimilarity(a: AxisVector, b: AxisVector): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

interface Scored {
  book: Book;
  similarity: number;
}

function cosineSearch(
  vector: AxisVector,
  books: Book[],
  topK: number
): Scored[] {
  return books
    .map((book) => ({ book, similarity: cosineSimilarity(vector, book.axisVector) }))
    .sort((x, y) => y.similarity - x.similarity)
    .slice(0, topK);
}

/** 找出用户向量上区分度最低（最模糊）的轴下标，按「越接近 50 越靠前」排序 */
function ambiguousAxes(vector: AxisVector): number[] {
  return vector
    .map((v, i) => ({ i, v }))
    .filter((x) => x.v > AMBIGUOUS_LO && x.v < AMBIGUOUS_HI)
    .sort((a, b) => Math.abs(a.v - 50) - Math.abs(b.v - 50))
    .map((x) => x.i);
}

/** 生成精准推荐理由（结合该书最突出的轴语义） */
function preciseReason(book: Book, grid: BookGrid): string {
  const axis = dominantAxis(book.axisVector);
  const side = book.axisVector[axis.index] >= 50 ? axis.right : axis.left;
  return `和你「${grid.name}」的气质对味——${side}这一面，它拿捏得正好。`;
}

/** 生成意外推荐理由（点名模糊轴） */
function surpriseReason(book: Book, axisIdx: number): string {
  const axis = AXES[axisIdx];
  return `你在「${axis.name}」上的倾向其实没那么定——这本也许会让你意外地上头。`;
}

/** 取向量中偏离 50 最远的轴（最能代表这本书的特质） */
function dominantAxis(vector: AxisVector) {
  let bestIdx = 0;
  let bestDev = -1;
  vector.forEach((v, i) => {
    const dev = Math.abs(v - 50);
    if (dev > bestDev) {
      bestDev = dev;
      bestIdx = i;
    }
  });
  return AXES[bestIdx];
}

/**
 * 推荐主入口：给定用户向量，产出书格 + 推荐书单。
 * @param userVector 用户 6 维向量
 * @param books      书库（默认全量 BOOKS，便于测试注入）
 */
export function recommend(
  userVector: AxisVector,
  books: Book[] = BOOKS
): RecommendResult {
  const { bookgrid } = matchBookGrid(userVector);

  // ---- Step 3 精准 ----
  const preciseCandidates = cosineSearch(
    userVector,
    books.filter((b) => b.annotationConfidence > MIN_CONFIDENCE),
    PRECISE_TOPK
  );

  const picked: Recommendation[] = [];
  const usedIds = new Set<string>();
  const usedCategories = new Set<string>();

  // 相似度最高 1 本必选
  for (const cand of preciseCandidates) {
    if (picked.length >= PRECISE_PICK) break;
    const cat = cand.book.categoryDisplay;
    // 第 1 本无条件选，之后避免品类重复
    if (picked.length > 0 && usedCategories.has(cat)) continue;
    picked.push({
      book: cand.book,
      isSurprise: false,
      reason: preciseReason(cand.book, bookgrid),
      similarity: cand.similarity,
    });
    usedIds.add(cand.book.bookId);
    usedCategories.add(cat);
  }

  // 精准不足 2 本时，放宽品类去重补齐
  if (picked.length < 2) {
    for (const cand of preciseCandidates) {
      if (picked.length >= 2) break;
      if (usedIds.has(cand.book.bookId)) continue;
      picked.push({
        book: cand.book,
        isSurprise: false,
        reason: preciseReason(cand.book, bookgrid),
        similarity: cand.similarity,
      });
      usedIds.add(cand.book.bookId);
      usedCategories.add(cand.book.categoryDisplay);
    }
  }

  // ---- Step 4 意外 ----
  const surprises: Recommendation[] = [];
  const axes = ambiguousAxes(userVector).slice(0, 2);
  for (const axisIdx of axes) {
    if (surprises.length >= SURPRISE_PICK) break;
    for (const dir of [SHIFT, -SHIFT]) {
      const shifted = userVector.slice();
      shifted[axisIdx] = Math.max(0, Math.min(100, shifted[axisIdx] + dir));
      const found = cosineSearch(shifted, books, 10).find(
        (s) =>
          !usedIds.has(s.book.bookId) &&
          s.book.doubanScore >= SURPRISE_SCORE
      );
      if (found) {
        surprises.push({
          book: found.book,
          isSurprise: true,
          reason: surpriseReason(found.book, axisIdx),
          similarity: found.similarity,
        });
        usedIds.add(found.book.bookId);
        break; // 该轴取到一本即可
      }
    }
  }

  // ---- Step 5 合并输出（精准在前，意外在后，最多 5 本，至少尽量 3 本）----
  const recommendations = [...picked, ...surprises.slice(0, SURPRISE_PICK)].slice(
    0,
    MAX_TOTAL
  );

  return { bookgrid, userVector, recommendations };
}

export { AXIS_ORDER };
