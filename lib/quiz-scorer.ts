/**
 * Step 1：用户画像向量生成（6 维重构版）
 *
 * 流程：
 *   1. 从中性向量(全 50)出发；
 *   2. 累加每道题被选选项 / 滑块位置带来的各轴增量；
 *   3. 「最近读过的三本书」(books 题) 参与计算：把用户输入的书名与书库
 *      模糊匹配，命中的书目向量与用户向量按权重融合；未命中则只作氛围、
 *      不影响向量。
 *   4. 截断到 [0,100] 得到用户 6 维向量。
 *
 * 题目 delta 在 data/questions.ts 中以「相对中性 50 的增量」给出，
 * 滑块按位置比例在 leftDelta↔rightDelta 间线性插值。
 */
import type {
  AxisKey,
  AxisVector,
  Book,
  Question,
  QuizAnswer,
} from "@/types";
import { AXIS_ORDER } from "@/types";
import { neutralVector } from "@/data/axes";
import { BOOKS } from "@/data/books";

/** 每一本成功匹配的「最近读过的书」对用户向量的拉拽权重（0–1） */
const BOOKS_PULL_PER_HIT = 0.12;

/** 将一个 0–100 的滑块位置映射为该轴的增量（线性插值） */
function sliderDelta(
  value: number,
  leftDelta: number,
  rightDelta: number
): number {
  const t = clamp(value, 0, 100) / 100;
  return leftDelta + (rightDelta - leftDelta) * t;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** 规整书名：去空白、去常见书名号/括号，转小写，便于模糊比对 */
function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/[《》〈〉「」『』()()【】\[\]\s·.,，。、:：;；!！?？"'""'']/g, "")
    .trim();
}

/**
 * 把一条用户输入的书名模糊匹配到书库中的某本书。
 * 规则：规整后双向包含即视为命中（兼顾「百年孤独」↔「百年孤独（精装版）」）。
 */
function fuzzyMatchBook(input: string, books: Book[]): Book | null {
  const q = normalizeTitle(input);
  if (q.length < 2) return null;
  let best: Book | null = null;
  let bestLen = Infinity;
  for (const b of books) {
    const t = normalizeTitle(b.title);
    if (!t) continue;
    if (t === q || t.includes(q) || q.includes(t)) {
      // 命中多本时，取标题最短(最贴合)的那本
      if (t.length < bestLen) {
        best = b;
        bestLen = t.length;
      }
    }
  }
  return best;
}

/**
 * 把用户作答转换为归一化的 6 维向量（每维 0–100）。
 * @param questions 全量题目（用于按 id 查映射规则）
 * @param answers   用户作答
 * @param books     书库（默认全量 BOOKS，便于测试注入）
 */
export function scoreQuiz(
  questions: Question[],
  answers: QuizAnswer[],
  books: Book[] = BOOKS
): AxisVector {
  const byId = new Map<string, Question>();
  questions.forEach((q) => byId.set(q.id, q));

  // 用对象累加，避免下标错乱
  const acc: Record<AxisKey, number> = {} as Record<AxisKey, number>;
  AXIS_ORDER.forEach((k) => (acc[k] = 50)); // 中性起点

  // 收集 books 题命中的书目向量，留待选项累加完成后再融合
  const matchedVectors: AxisVector[] = [];

  for (const ans of answers) {
    const q = byId.get(ans.questionId);
    if (!q) continue;

    if (q.type === "slider") {
      const cfg = q.slider;
      if (!cfg) continue;
      const value = ans.sliderValue ?? cfg.defaultValue ?? 50;
      acc[cfg.axis] += sliderDelta(value, cfg.leftDelta, cfg.rightDelta);
    } else if (q.type === "books") {
      // 「最近读过的三本书」：模糊匹配 → 收集命中书目向量
      const titles = ans.books ?? [];
      for (const raw of titles) {
        if (!raw || !raw.trim()) continue;
        const hit = fuzzyMatchBook(raw, books);
        if (hit) matchedVectors.push(hit.axisVector);
      }
    } else {
      // choice / taste / fun —— 统一按「选中某个选项」处理
      const opt = q.options?.find((o) => o.id === ans.optionId);
      if (!opt) continue;
      for (const [axis, delta] of Object.entries(opt.delta)) {
        if (delta == null) continue;
        acc[axis as AxisKey] += delta;
      }
    }
  }

  // 先把选项累加结果截断为基础用户向量
  let vector: AxisVector = AXIS_ORDER.map((k) => clamp(acc[k], 0, 100));

  // 融合「最近读过的书」：每命中一本，向其向量拉拽一点
  for (const bv of matchedVectors) {
    vector = vector.map((v, i) =>
      v + (bv[i] - v) * BOOKS_PULL_PER_HIT
    );
  }

  return vector.map((v) => clamp(Math.round(v), 0, 100));
}

/** 便捷封装：直接传入题库默认从 data 读取的场景 */
export { neutralVector };
