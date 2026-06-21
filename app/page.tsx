/**
 * 首页（服务端组件）：经数据访问层取题与书格列表，交给客户端编排器。
 */
import { dataSource } from "@/lib/data-source";
import QuizApp from "@/components/QuizApp";

export default async function HomePage() {
  const [questions, total, grids] = await Promise.all([
    dataSource.getQuestions(),
    dataSource.getTotalQuestions(),
    dataSource.getBookGrids(),
  ]);

  const gridList = grids.map((g) => ({ slug: g.slug, name: g.name }));

  return <QuizApp questions={questions} total={total} gridList={gridList} />;
}
