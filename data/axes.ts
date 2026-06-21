/**
 * 6 个测评维度轴定义与权重（6 维重构版）
 * 雷达图为正六边形，short label 取每个轴的 radarLabel。
 */
import type { AxisDef, AxisKey, AxisVector, AxisScores } from "@/types";
import { AXIS_ORDER } from "@/types";

/** 6 轴完整定义（顺序与 AXIS_ORDER 一致，index 0–5） */
export const AXES: AxisDef[] = [
  { key: "drive",   index: 0, name: "阅读驱动", left: "消遣愉悦", right: "求知成长", weight: 1.3, radarLabel: "驱动" },
  { key: "mind",    index: 1, name: "思辨姿态", left: "沉浸感受", right: "抽离分析", weight: 1.2, radarLabel: "思辨" },
  { key: "horizon", index: 2, name: "视野所向", left: "现实当下", right: "远方历史", weight: 1.1, radarLabel: "视野" },
  { key: "texture", index: 3, name: "文本口味", left: "轻盈清澈", right: "厚重幽深", weight: 1.2, radarLabel: "口味" },
  { key: "tempo",   index: 4, name: "阅读节奏", left: "疾读如流", right: "慢嚼如品", weight: 0.9, radarLabel: "节奏" },
  { key: "stance",  index: 5, name: "阅读姿态", left: "独处私语", right: "分享共鸣", weight: 0.8, radarLabel: "姿态" },
];

/** 按 AXIS_ORDER 排列的权重数组，供加权欧氏距离直接使用 */
export const AXIS_WEIGHTS: number[] = AXIS_ORDER.map(
  (key) => AXES.find((a) => a.key === key)!.weight
);

/** key → AxisDef 快查表 */
export const AXIS_BY_KEY: Record<AxisKey, AxisDef> = AXES.reduce(
  (acc, a) => {
    acc[a.key] = a;
    return acc;
  },
  {} as Record<AxisKey, AxisDef>
);

/** AxisScores(对象) → AxisVector(数组)，遵循 AXIS_ORDER */
export function scoresToVector(scores: AxisScores): AxisVector {
  return AXIS_ORDER.map((key) => scores[key]);
}

/** AxisVector(数组) → AxisScores(对象) */
export function vectorToScores(vec: AxisVector): AxisScores {
  const out = {} as AxisScores;
  AXIS_ORDER.forEach((key, i) => {
    out[key] = vec[i];
  });
  return out;
}

/** 生成全 50 分（中性）的初始向量 */
export function neutralVector(): AxisVector {
  return AXIS_ORDER.map(() => 50);
}
