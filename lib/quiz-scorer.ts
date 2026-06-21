/**
 * Step 1：用户画像向量生成
 * 严格对应 docs/05「三、Step 1」。
 *
 * 流程：
 *   1. 从中性向量(全 50)出发；
 *   2. 累加每道题被选选项 / 滑块位置带来的各轴增量；
 *   3. 截断到 [0,100] 得到用户 10 维向量。
 *
 * 题目 delta 在 data/questions.ts 中以「相对中性 50 的增量」给出，
 * 滑块按位置比例在 leftDelta↔rightDelta 间线性插值。
 */
import type {
  AxisKey,
  AxisVector,
  Question,
  QuizAnswer,
} from "@/types";
import { AXIS_ORDER } from "@/types";
import { neutralVector } from "@/data/axes";

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

/**
 * 把用户作答转换为归一化的 10 维向量（每维 0–100）。
 * @param questions 全量题目（用于按 id 查映射规则）
 * @param answers   用户作答
 */
export function scoreQuiz(
  questions: Question[],
  answers: QuizAnswer[]
): AxisVector {
  const byId = new Map<string, Question>();
  questions.forEach((q) => byId.set(q.id, q));

  // 用对象累加，避免下标错乱
  const acc: Record<AxisKey, number> = {} as Record<AxisKey, number>;
  AXIS_ORDER.forEach((k) => (acc[k] = 50)); // 中性起点

  for (const ans of answers) {
    const q = byId.get(ans.questionId);
    if (!q) continue;

    if (q.type === "slider") {
      const cfg = q.slider;
      if (!cfg) continue;
      const value =
        ans.sliderValue ?? cfg.defaultValue ?? 50;
      acc[cfg.axis] += sliderDelta(value, cfg.leftDelta, cfg.rightDelta);
    } else {
      // choice / image / fun
      const opt = q.options?.find((o) => o.id === ans.optionId);
      if (!opt) continue;
      for (const [axis, delta] of Object.entries(opt.delta)) {
        if (delta == null) continue;
        acc[axis as AxisKey] += delta;
      }
    }
  }

  // 输出按 AXIS_ORDER 排列并截断到 [0,100]
  return AXIS_ORDER.map((k) => clamp(Math.round(acc[k]), 0, 100));
}

/** 便捷封装：直接传入题库默认从 data 读取的场景 */
export { neutralVector };
