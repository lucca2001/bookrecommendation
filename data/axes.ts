/**
 * 10 个测评维度轴定义与权重
 * 严格对应 docs/03（维度体系）与 docs/05（轴权重表）。
 * 雷达图短标签参考 docs/demo.html。
 */
import type { AxisDef, AxisKey, AxisVector, AxisScores } from "@/types";
import { AXIS_ORDER } from "@/types";

/** 10 轴完整定义（顺序与 AXIS_ORDER 一致，index 0–9） */
export const AXES: AxisDef[] = [
  { key: "drive",     index: 0, name: "阅读驱动力", left: "探索未知", right: "情感共鸣", weight: 1.5, radarLabel: "驱动" },
  { key: "thinking",  index: 1, name: "思维偏好",   left: "系统逻辑", right: "感性联想", weight: 1.2, radarLabel: "思维" },
  { key: "depth",     index: 2, name: "阅读深度",   left: "沉浸精读", right: "广泛涉猎", weight: 1.3, radarLabel: "深度" },
  { key: "purpose",   index: 3, name: "内容取向",   left: "现实指向", right: "精神逃逸", weight: 1.4, radarLabel: "取向" },
  { key: "time",      index: 4, name: "时空偏好",   left: "当下现代", right: "历史纵深", weight: 1.0, radarLabel: "时空" },
  { key: "culture",   index: 5, name: "文化圈层",   left: "本土东方", right: "西方视野", weight: 1.0, radarLabel: "文化" },
  { key: "tone",      index: 6, name: "叙事口味",   left: "严肃深刻", right: "轻盈有趣", weight: 1.2, radarLabel: "口味" },
  { key: "worldview", index: 7, name: "世界观取向", left: "批判解构", right: "建构向上", weight: 1.1, radarLabel: "世界观" },
  { key: "pace",      index: 8, name: "阅读节奏",   left: "规律持续", right: "随性爆发", weight: 0.8, radarLabel: "节奏" },
  { key: "social",    index: 9, name: "社交倾向",   left: "独自消化", right: "强烈分享欲", weight: 0.7, radarLabel: "社交" },
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
