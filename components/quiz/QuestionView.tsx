"use client";
/**
 * 单题渲染器：根据 question.type 渲染 4 种题型
 *   choice — 二选一卡片（点击即选并自动前进）
 *   fun    — 单选列表（点击即选并自动前进）
 *   image  — 封面直觉 2×2（点击即选并自动前进）
 *   slider — 滑块 + 确认按钮（需手动确认，因无"下一题"按钮约定）
 * 选择后通过 onAnswer 回调上报，由父组件推进。
 */
import { useState } from "react";
import type { Question, QuizAnswer } from "@/types";

interface QuestionViewProps {
  question: Question;
  onAnswer: (answer: QuizAnswer) => void;
}

const IMAGE_COVER_CLASS = ["image-cover-a", "image-cover-b", "image-cover-c", "image-cover-d"];

export default function QuestionView({ question, onAnswer }: QuestionViewProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(
    question.slider?.defaultValue ?? 50
  );

  const pickOption = (optionId: string) => {
    if (selected) return; // 防止重复点击
    setSelected(optionId);
    // 给一点选中反馈再前进
    setTimeout(() => onAnswer({ questionId: question.id, optionId }), 420);
  };

  const confirmSlider = () => {
    onAnswer({ questionId: question.id, sliderValue });
  };

  // 题干支持 \n 换行
  const questionLines = question.text.split("\n");

  return (
    <>
      <p className="quiz-meta">
        第 {question.orderIndex} 题 / 20
      </p>
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

      {/* image 封面直觉 */}
      {question.type === "image" && (
        <div className="image-grid">
          {question.options?.map((opt, i) => (
            <div
              key={opt.id}
              className={`image-card${selected === opt.id ? " selected" : ""}`}
              onClick={() => pickOption(opt.id)}
            >
              <div className={`image-cover ${IMAGE_COVER_CLASS[i % 4]}`}>书</div>
              <div className="image-caption">
                <p>{opt.label}</p>
                {opt.hint && <p className="choice-hint">{opt.hint}</p>}
              </div>
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
    </>
  );
}
