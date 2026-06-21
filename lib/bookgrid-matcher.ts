/**
 * Step 2：书格匹配（加权欧氏距离最近邻）
 * 严格对应 docs/05「四、Step 2」。
 *
 * 在 16 种书格原型向量中，找到与用户向量加权欧氏距离最小的一个。
 * 权重来自 data/axes.ts 的 AXIS_WEIGHTS（按 AXIS_ORDER 排列）。
 */
import type { AxisVector, BookGrid } from "@/types";
import { AXIS_WEIGHTS } from "@/data/axes";
import { BOOKGRIDS } from "@/data/bookgrids";

/** 加权欧氏距离：sqrt( Σ wᵢ·(aᵢ-bᵢ)² ) */
export function weightedEuclidean(
  a: AxisVector,
  b: AxisVector,
  weights: number[] = AXIS_WEIGHTS
): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    const w = weights[i] ?? 1;
    sum += w * d * d;
  }
  return Math.sqrt(sum);
}

export interface BookGridMatch {
  bookgrid: BookGrid;
  distance: number;
}

/** 返回与用户向量最近的书格（含距离），默认在全部 16 种书格里找。 */
export function matchBookGrid(
  userVector: AxisVector,
  grids: BookGrid[] = BOOKGRIDS
): BookGridMatch {
  let best: BookGridMatch | null = null;
  for (const grid of grids) {
    const distance = weightedEuclidean(userVector, grid.prototypeVector);
    if (best === null || distance < best.distance) {
      best = { bookgrid: grid, distance };
    }
  }
  // 书格数据非空，best 必定存在
  return best!;
}

/** 调试用：返回按距离升序排列的全部书格匹配结果。 */
export function rankBookGrids(
  userVector: AxisVector,
  grids: BookGrid[] = BOOKGRIDS
): BookGridMatch[] {
  return grids
    .map((grid) => ({
      bookgrid: grid,
      distance: weightedEuclidean(userVector, grid.prototypeVector),
    }))
    .sort((x, y) => x.distance - y.distance);
}
