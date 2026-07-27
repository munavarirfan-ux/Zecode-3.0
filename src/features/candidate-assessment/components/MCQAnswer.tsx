"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface MCQAnswerProps {
  question: AssessmentQuestion;
}

export function MCQAnswer({ question }: MCQAnswerProps) {
  const isMultiple = question.answerType === "multiple";
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (optionId: string) => {
    if (isMultiple) {
      setSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelected([optionId]);
    }
  };

  const isSelected = (optionId: string) => selected.includes(optionId);

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0">
        <h2 className="text-[1.4rem] font-bold tracking-[-0.01em] text-text lg:text-[1.55rem]">
          {question.title}
        </h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-text-secondary">
          {question.body}
        </p>
        {isMultiple && (
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted">
            Select all that apply
          </p>
        )}
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col justify-start gap-3 overflow-y-auto">
        <div className="w-full max-w-[1000px] space-y-3">
          {question.options?.map((option) => {
            const active = isSelected(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-[10px] border px-4 py-3.5 text-left transition-all duration-150",
                  active
                    ? "border-accent/40 bg-accent/[0.04] shadow-[0_0_0_1px_rgba(113,0,189,0.08)]"
                    : "border-[rgba(15,23,42,0.08)] hover:border-[rgba(15,23,42,0.16)] hover:bg-[rgba(15,23,42,0.015)] dark:border-white/[0.08] dark:hover:border-white/[0.14]",
                )}
              >
                {/* Radio/Checkbox */}
                <div className="shrink-0">
                  {isMultiple ? (
                    <div
                      className={cn(
                        "flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border-[1.5px] transition-all",
                        active
                          ? "border-accent bg-accent"
                          : "border-[rgba(15,23,42,0.22)] dark:border-white/[0.22]",
                      )}
                    >
                      {active && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="text-white">
                          <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] transition-all",
                        active
                          ? "border-accent bg-accent"
                          : "border-[rgba(15,23,42,0.22)] dark:border-white/[0.22]",
                      )}
                    >
                      {active && <div className="h-[7px] w-[7px] rounded-full bg-white" />}
                    </div>
                  )}
                </div>

                {/* Option letter */}
                <span
                  className={cn(
                    "shrink-0 text-[13px] font-semibold",
                    active ? "text-accent" : "text-text-secondary/70",
                  )}
                >
                  {option.letter}.
                </span>

                {/* Option text */}
                <span className={cn("text-[14px] leading-snug", active ? "text-text font-medium" : "text-text")}>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
