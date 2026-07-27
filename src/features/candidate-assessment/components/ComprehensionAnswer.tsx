"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface ComprehensionAnswerProps {
  question: AssessmentQuestion;
}

export function ComprehensionAnswer({ question }: ComprehensionAnswerProps) {
  const subQuestions = question.subQuestions || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string[]>>(new Map());

  const currentSubQuestion = subQuestions[activeIndex];

  const handleSelect = (subQuestionId: string, optionId: string, answerType: "single" | "multiple") => {
    setAnswers((prev) => {
      const next = new Map(prev);
      if (answerType === "multiple") {
        const current = next.get(subQuestionId) || [];
        if (current.includes(optionId)) {
          next.set(subQuestionId, current.filter((id) => id !== optionId));
        } else {
          next.set(subQuestionId, [...current, optionId]);
        }
      } else {
        next.set(subQuestionId, [optionId]);
      }
      return next;
    });
  };

  const isSelected = (subQuestionId: string, optionId: string) => {
    return answers.get(subQuestionId)?.includes(optionId) || false;
  };

  return (
    <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[2fr_3fr]">
      {/* Left panel - Passage */}
      <div className="border-r border-border p-5 overflow-y-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Passage
        </span>
        <p className="text-sm text-text leading-relaxed mt-2 whitespace-pre-wrap">
          {question.passage}
        </p>
      </div>

      {/* Right panel - Questions */}
      <div className="overflow-y-auto p-5">
        {/* Sub-question navigator */}
        <div className="flex items-center gap-2">
          {subQuestions.map((sq, index) => (
            <button
              key={sq.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-8 h-8 rounded-full text-sm font-medium transition-all",
                index === activeIndex
                  ? "bg-accent text-white"
                  : "bg-[rgba(15,23,42,0.05)] text-text hover:bg-[rgba(15,23,42,0.1)]"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current sub-question */}
        {currentSubQuestion && (
          <div className="mt-4">
            <p className="text-sm font-medium text-text">
              {currentSubQuestion.body}
            </p>

            <div className="space-y-2 mt-4">
              {currentSubQuestion.options.map((option) => {
                const active = isSelected(currentSubQuestion.id, option.id);
                const isMultiple = currentSubQuestion.answerType === "multiple";

                return (
                  <div
                    key={option.id}
                    onClick={() =>
                      handleSelect(
                        currentSubQuestion.id,
                        option.id,
                        currentSubQuestion.answerType
                      )
                    }
                    className={cn(
                      "border rounded-[10px] p-3.5 flex items-start gap-3 cursor-pointer transition-all",
                      active
                        ? "border-accent/30 bg-accent/[0.04]"
                        : "hover:border-[rgba(15,23,42,0.12)] hover:bg-[rgba(15,23,42,0.02)]"
                    )}
                  >
                    {/* Radio/Checkbox indicator */}
                    <div className="flex-shrink-0 mt-0.5">
                      {isMultiple ? (
                        <div
                          className={cn(
                            "w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-all",
                            active
                              ? "border-accent bg-accent"
                              : "border-[rgba(15,23,42,0.15)]"
                          )}
                        >
                          {active && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              className="text-white"
                            >
                              <path
                                d="M2.5 6L5 8.5L9.5 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            active
                              ? "border-accent bg-accent"
                              : "border-[rgba(15,23,42,0.15)]"
                          )}
                        >
                          {active && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Option letter */}
                    <span className="font-medium text-sm text-text">
                      {option.letter}
                    </span>

                    {/* Option text */}
                    <span className="text-sm text-text">{option.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
