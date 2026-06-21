"use client";
/**
 * /result/[slug] 的独立结果页外壳：复用 ResultView，套上 #screen-result 容器。
 */
import type { BookGrid, RecommendResult } from "@/types";
import ResultView from "@/components/result/ResultView";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface Props {
  result: RecommendResult;
  otherGrids: Pick<BookGrid, "slug" | "name">[];
}

export default function ResultStandalone({ result, otherGrids }: Props) {
  return (
    <section className="screen active" id="screen-result">
      <ResultView
        result={result}
        otherGrids={otherGrids}
        onRestart={() => {
          window.location.href = `${BASE_PATH}/`;
        }}
        onExplore={(slug) => {
          window.location.href = `${BASE_PATH}/result/${slug}`;
        }}
      />
    </section>
  );
}
