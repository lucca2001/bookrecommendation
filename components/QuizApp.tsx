"use client";
/**
 * 单页测评编排器：landing → intro → quiz(20题) → calculating → result
 * 屏幕切换 / 进度条 / 引子叙事节奏 严格对照 docs/demo.html。
 * 题目逐题推进（选择即前进，无"下一题"按钮；滑块题需点确认）。
 * 完成后在浏览器端直接计算结果（纯静态，无需服务端）。
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  BookGrid,
  Question,
  QuizAnswer,
  RecommendResult,
} from "@/types";
import { AXES } from "@/data/axes";
import { BOOKS } from "@/data/books";
import { scoreQuiz } from "@/lib/quiz-scorer";
import { recommend } from "@/lib/recommend";
import QuestionView from "@/components/quiz/QuestionView";
import ResultView from "@/components/result/ResultView";

// GitHub Pages 子路径前缀（构建时注入），用于原生跳转
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Phase = "landing" | "intro" | "quiz" | "result";

interface QuizAppProps {
  questions: Question[];
  total: number;
  gridList: Pick<BookGrid, "slug" | "name">[];
}

const STORY_LINES = [
  { id: "s1", cls: "", lines: ["每个人读书的方式，", "其实大相径庭。"] },
  { id: "s2", cls: "muted", lines: ["有人买书如山倒，书架永远比时间多。"] },
  {
    id: "s3",
    cls: "muted",
    lines: ["有人一本书读八年，", "《存在与时间》第一章已经读了十遍。"],
  },
  { id: "s4", cls: "accent", lines: ["这不是坏习惯。", "这是你的书格。"] },
];

export default function QuizApp({ questions, total, gridList }: QuizAppProps) {
  const [phase, setPhase] = useState<Phase>("landing");
  const [storyVisible, setStoryVisible] = useState<Set<string>>(new Set());
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => {
    if (phase === "quiz") return Math.round((qIndex / total) * 100);
    if (phase === "result") return 0;
    return 0;
  }, [phase, qIndex, total]);

  // 引子叙事：进入 intro 后逐行显示
  useEffect(() => {
    if (phase !== "intro") return;
    setStoryVisible(new Set());
    const ids = [...STORY_LINES.map((s) => s.id), "intro-action"];
    const delays = [200, 900, 1700, 2500, 3200];
    const timers = ids.map((id, i) =>
      setTimeout(() => {
        setStoryVisible((prev) => new Set(prev).add(id));
      }, delays[i])
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const submit = useCallback(
    async (finalAnswers: QuizAnswer[]) => {
      setCalculating(true);
      setError(null);
      try {
        // 浏览器端直接计算：答案 → 向量 → 书格 → 书单（与原 API 完全等价）
        const compute = (): RecommendResult => {
          const userVector = scoreQuiz(questions, finalAnswers);
          return recommend(userVector, BOOKS);
        };
        const [res] = await Promise.all([
          Promise.resolve().then(compute),
          // 至少展示 2.8s 计算动画（对齐 demo.html 节奏）
          new Promise((resolve) => setTimeout(resolve, 2800)),
        ]);
        setResult(res);
        setPhase("result");
      } catch (e) {
        console.error(e);
        setError("分析失败了，请重试一次。");
      } finally {
        setCalculating(false);
      }
    },
    [questions]
  );

  const handleAnswer = useCallback(
    (answer: QuizAnswer) => {
      setAnswers((prev) => {
        const next = [
          ...prev.filter((a) => a.questionId !== answer.questionId),
          answer,
        ];
        if (qIndex + 1 >= total) {
          submit(next);
        } else {
          setQIndex((i) => i + 1);
        }
        return next;
      });
    },
    [qIndex, total, submit]
  );

  const restart = useCallback(() => {
    setAnswers([]);
    setQIndex(0);
    setResult(null);
    setError(null);
    setPhase("landing");
  }, []);

  // ESC 重置
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") restart();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [restart]);

  const currentQuestion = questions[qIndex];

  return (
    <>
      {/* 进度条 */}
      <div
        className="progress-bar-wrap"
        style={{ display: progress > 0 ? "block" : "none" }}
      >
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* 计算遮罩 */}
      <div className={`calculating-overlay${calculating ? " show" : ""}`}>
        <div className="calc-text">正在分析你的书格……</div>
        <div className="calc-axes">
          {AXES.map((ax) => (
            <div className="calc-axis-row" key={ax.key}>
              <span className="calc-axis-label">{ax.name}</span>
              <div className="calc-axis-bar">
                <div
                  className="calc-axis-bar-fill"
                  style={{ width: calculating ? `${40 + ((ax.index * 53) % 55)}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LANDING */}
      <section className={`screen${phase === "landing" ? " active" : ""}`} id="screen-landing">
        <p className="landing-eyebrow">书格测评 · Beta</p>
        <h1 className="landing-title">
          你是哪种<span>书格</span>？
        </h1>
        <p className="landing-subtitle">16种阅读人格，总有一种说的是你</p>
        <button className="btn-primary" onClick={() => setPhase("intro")}>
          开始测试 →
        </button>
        <p className="landing-meta">
          <span>约5分钟</span>·<span>20题</span>·<span>不需要注册</span>
        </p>
      </section>

      {/* INTRO */}
      <section className={`screen${phase === "intro" ? " active" : ""}`} id="screen-intro">
        <div className="story-container">
          {STORY_LINES.map((s) => (
            <div
              key={s.id}
              className={`story-line ${s.cls}${storyVisible.has(s.id) ? " visible" : ""}`}
            >
              {s.lines.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          ))}
          <div className={`intro-action${storyVisible.has("intro-action") ? " visible" : ""}`}>
            <button className="btn-primary" onClick={() => setPhase("quiz")}>
              找到我的书格 →
            </button>
          </div>
        </div>
      </section>

      {/* QUIZ */}
      <section className={`screen${phase === "quiz" ? " active" : ""}`} id="screen-quiz">
        {phase === "quiz" && currentQuestion && (
          <QuestionView
            key={currentQuestion.id}
            question={currentQuestion}
            total={total}
            onAnswer={handleAnswer}
          />
        )}
        {error && <p style={{ color: "#d96b4a", marginTop: 24 }}>{error}</p>}
      </section>

      {/* RESULT */}
      <section className={`screen${phase === "result" ? " active" : ""}`} id="screen-result">
        {phase === "result" && result && (
          <ResultView
            result={result}
            otherGrids={gridList.filter((g) => g.slug !== result.bookgrid.slug).slice(0, 8)}
            onRestart={restart}
            onExplore={(slug) => {
              window.location.href = `${BASE_PATH}/result/${slug}`;
            }}
          />
        )}
      </section>
    </>
  );
}
