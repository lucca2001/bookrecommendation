/**
 * /result/[slug]：按书格 slug 展示该书格的画像与代表书单。
 * 用于"探索其他书格"与分享落地。以书格原型向量代表该书格生成推荐。
 */
import { notFound } from "next/navigation";
import { dataSource } from "@/lib/data-source";
import { recommend } from "@/lib/recommend";
import ResultStandalone from "@/components/result/ResultStandalone";

export async function generateStaticParams() {
  const grids = await dataSource.getBookGrids();
  return grids.map((g) => ({ slug: g.slug }));
}

export default async function BookGridResultPage({
  params,
}: {
  params: { slug: string };
}) {
  const grid = await dataSource.getBookGridBySlug(params.slug);
  if (!grid) notFound();

  const books = await dataSource.getBooks();
  const result = recommend(grid.prototypeVector, books);
  // 强制书格为当前 slug（原型向量理论上自匹配，这里兜底保证一致）
  result.bookgrid = grid;

  const grids = await dataSource.getBookGrids();
  const others = grids
    .filter((g) => g.slug !== grid.slug)
    .map((g) => ({ slug: g.slug, name: g.name }))
    .slice(0, 8);

  return <ResultStandalone result={result} otherGrids={others} />;
}
