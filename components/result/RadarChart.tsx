"use client";
/**
 * 阅读基因图谱（纯 SVG 雷达图）
 * 几何参数与 docs/demo.html drawRadar() 完全一致：cx=140 cy=140 R=108。
 * 10 个轴使用 data/axes.ts 的 radarLabel，数值取用户向量。
 */
import type { AxisVector } from "@/types";
import { AXES } from "@/data/axes";

interface RadarChartProps {
  vector: AxisVector;
}

const CX = 140;
const CY = 140;
const R = 108;

export default function RadarChart({ vector }: RadarChartProps) {
  const n = AXES.length;
  const angleOf = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, r: number): [number, number] => {
    const a = angleOf(i);
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  };
  const ptStr = (i: number, r: number) => {
    const [x, y] = pt(i, r);
    return `${x},${y}`;
  };

  const bgPolys = [0.33, 0.66, 1.0].map((frac) =>
    AXES.map((_, i) => ptStr(i, R * frac)).join(" ")
  );
  const dataPoints = AXES.map((_, i) => ptStr(i, (R * vector[i]) / 100)).join(" ");

  return (
    <svg id="radar-svg" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
      {bgPolys.map((points, idx) => (
        <polygon key={`bg-${idx}`} className="radar-bg-polygon" points={points} />
      ))}
      {AXES.map((_, i) => {
        const [x, y] = pt(i, R);
        return (
          <line
            key={`axis-${i}`}
            className="radar-axis-line"
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
          />
        );
      })}
      <polygon className="radar-data-polygon" points={dataPoints} />
      {AXES.map((_, i) => {
        const [x, y] = pt(i, (R * vector[i]) / 100);
        return <circle key={`dot-${i}`} className="radar-dot" cx={x} cy={y} r={3} />;
      })}
      {AXES.map((ax, i) => {
        const [lx, ly] = pt(i, R + 18);
        const [vx, vy] = pt(i, (R * vector[i]) / 100 - 14);
        const anchor = lx < CX - 5 ? "end" : lx > CX + 5 ? "start" : "middle";
        return (
          <g key={`label-${i}`}>
            <text className="radar-label" x={lx} y={ly + 4} textAnchor={anchor}>
              {ax.radarLabel}
            </text>
            <text className="radar-label-val" x={vx} y={vy + 3} textAnchor="middle">
              {vector[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
