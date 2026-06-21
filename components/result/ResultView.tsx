"use client";
/**
 * 结果展示：书格揭晓 + 描述 + 雷达图 + 特征 + 书单 + 操作 + 探索其他书格
 * 结构与样式严格对照 docs/demo.html 的 #screen-result。
 */
import { useState } from "react";
import type { BookGrid, RecommendResult } from "@/types";
import RadarChart from "@/components/result/RadarChart";

interface ResultViewProps {
  result: RecommendResult;
  /** 其他书格（用于"探索其他书格"），可选 */
  otherGrids?: Pick<BookGrid, "slug" | "name">[];
  /** 点击重新测试 */
  onRestart?: () => void;
  /** 点击探索某书格 */
  onExplore?: (slug: string) => void;
}

export default function ResultView({
  result,
  otherGrids = [],
  onRestart,
  onExplore,
}: ResultViewProps) {
  const { bookgrid, userVector, recommendations } = result;
  const [copyLabel, setCopyLabel] = useState("复制我的书格");

  const copyBookgrid = () => {
    const text = `我的书格是「${bookgrid.name}」\n${bookgrid.shareTagline}\n测测你的书格 →`;
    const done = () => {
      setCopyLabel("已复制！✓");
      setTimeout(() => setCopyLabel("复制我的书格"), 2000);
    };
    try {
      navigator.clipboard.writeText(text).then(done, () => alert(text));
    } catch {
      alert(text);
    }
  };

  return (
    <div className="result-inner">
      <p className="result-label">你的书格是</p>
      <h2 className="result-name">「{bookgrid.name}」</h2>

      <div className="result-desc">
        {bookgrid.description.map((para, i) => (
          <p
            key={i}
            className={i === bookgrid.description.length - 1 ? "muted" : undefined}
          >
            {para}
          </p>
        ))}
      </div>

      <div className="result-columns">
        <div className="radar-section">
          <h3>阅读基因图谱</h3>
          <RadarChart vector={userVector} />
        </div>
        <div className="traits-section">
          <h3>你的书格特征</h3>
          <div className="traits-list">
            {bookgrid.traits.map((t, i) => (
              <div className="trait-item" key={i}>
                <span className="trait-icon">✦</span>
                <p>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="books-section">
        <h3>为你精选的书</h3>
        <div className="book-cards">
          {recommendations.map((rec) => (
            <div
              key={rec.book.bookId}
              className={`book-card${rec.isSurprise ? " surprise" : ""}`}
            >
              {rec.isSurprise && <div className="book-tag">💡 你可能没想到</div>}
              <span className="book-title">《{rec.book.title}》</span>
              <span className="book-author">
                {rec.book.author}
                {rec.book.translator ? ` / ${rec.book.translator} 译` : ""}
              </span>
              <span className="book-meta">
                {rec.book.categoryDisplay} · 豆瓣 {rec.book.doubanScore}
              </span>
              <p className="book-reason">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={copyBookgrid}>
          {copyLabel}
        </button>
        {onRestart && (
          <button className="btn-secondary" onClick={onRestart}>
            重新测试
          </button>
        )}
      </div>

      {otherGrids.length > 0 && (
        <div className="explore-section">
          <h3>探索其他书格</h3>
          <div className="explore-grid">
            {otherGrids.map((g) => (
              <div
                key={g.slug}
                className="explore-chip"
                onClick={() => onExplore?.(g.slug)}
              >
                {g.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
