"use client";
/**
 * 单题渲染器：根据 question.type 渲染 5 种题型
 *   choice — 二选一卡片（点击即选并自动前进）
 *   taste  — 文本品味题：两段不同文风的文字，点选更吸引你的那一段（点击即选并自动前进）
 *   fun    — 单选列表（点击即选并自动前进）
 *   slider — 滑块 + 确认按钮（需手动确认）
 *   books  — 最近读过的三本书：三个文本框 + 确认（可留空）
 * 选择后通过 onAnswer 回调上报，由父组件推进。
 */
import { useState } from "react";
import type { Question, QuizAnswer } from "@/types";

interface QuestionViewProps {
  question: Question;
  total: number;
  onAnswer: (answer: QuizAnswer) => void;
}

export default function QuestionView({ question, total, onAnswer }: QuestionViewProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(
    question.slider?.defaultValue ?? 50
  );
  const [bookInputs, setBookInputs] = useState<string[]>(["", "", ""]);

  const pickOption = (optionId: string) => {
    if (selected) return; // 防止重复点击
    setSelected(optionId);
    // 给一点选中反馈再前进
    setTimeout(() => onAnswer({ questionId: question.id, optionId }), 420);
  };

  const confirmSlider = () => {
    onAnswer({ questionId: question.id, sliderValue });
  };

  const confirmBooks = () => {
    const books = bookInputs.map((b) => b.trim()).filter((b) => b.length > 0);
    onAnswer({ questionId: question.id, books });
  };

  // 题干支持 \n 换行
  const questionLines = question.text.split("\n");

  return (
    <>
      <p className="quiz-meta">
        第 {question.orderIndex} 题 / {total}
      </p>

      {/* 题型小引子（可选） */}
      {question.intro && <p className="quiz-intro">{question.intro}</p>}

      <h2 className="quiz-question">
        {questionLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < questionLines.length - 1 && <br />}
          </span>
        ))}
      </h2>

      {/* choice 二选一 */}
      {question.type === "choice" && (
        <div className="choice-grid">
          {question.options?.map((opt) => (
            <div
              key={opt.id}
              className={`choice-card${selected === opt.id ? " selected" : ""}`}
              onClick={() => pickOption(opt.id)}
            >
              <p>{opt.label}</p>
              {opt.hint && <p className="choice-hint">{opt.hint}</p>}
            </div>
          ))}
        </div>
      )}

      {/* taste 文本品味：两段文字 */}
      {question.type === "taste" && (
        <div className="taste-grid">
          {question.options?.map((opt) => (
            <div
              key={opt.id}
              className={`taste-card${selected === opt.id ? " selected" : ""}`}
              onClick={() => pickOption(opt.id)}
            >
              <p className="taste-passage">{opt.label}</p>
              <div className="taste-foot">
                {opt.hint && <span className="taste-hint">{opt.hint}</span>}
                {opt.source && <span className="taste-source">{opt.source}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* fun 单选列表 */}
      {question.type === "fun" && (
        <div className="option-list">
          {question.options?.map((opt) => (
            <div
              key={opt.id}
              className={`option-item${selected === opt.id ? " selected" : ""}`}
              onClick={() => pickOption(opt.id)}
            >
              <div className="option-dot" />
              <p>{opt.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* slider 滑块 */}
      {question.type === "slider" && question.slider && (
        <div className="slider-wrap">
          <div className="slider-labels">
            <span>{question.slider.leftLabel}</span>
            <span>{question.slider.rightLabel}</span>
          </div>
          <input
            className="slider-input"
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
          />
          <button className="btn-primary slider-confirm" onClick={confirmSlider}>
            确定 →
          </button>
        </div>
      )}

      {/* books 最近读过的三本书 */}
      {question.type === "books" && (
        <div className="books-wrap">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              className="books-input"
              type="text"
              placeholder={`第 ${i + 1} 本（可留空）`}
              value={bookInputs[i]}
              onChange={(e) =>
                setBookInputs((prev) => {
                  const next = [...prev];
                  next[i] = e.target.value;
                  return next;
                })
              }
            />
          ))}
          <button className="btn-primary slider-confirm" onClick={confirmBooks}>
            填好了 →
          </button>
        </div>
      )}
    </>
  );
}
