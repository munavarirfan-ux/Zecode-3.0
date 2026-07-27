"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface FillBlankAnswerProps {
  question: AssessmentQuestion;
}

export function FillBlankAnswer({ question }: FillBlankAnswerProps) {
  const blanks = question.blanks || [];
  const [values, setValues] = useState<string[]>(blanks.map(() => ""));

  const handleChange = (index: number, value: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0">
        <h2 className="text-lg font-semibold text-text">{question.title}</h2>
        <p className="text-sm text-text-secondary mt-2 whitespace-pre-wrap">
          {question.body}
        </p>
      </div>

      <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto">
        {blanks.map((blank, index) => (
          <div key={blank.id}>
            <label className="text-xs text-muted mb-1 block">
              {blank.label}
            </label>
            <input
              type="text"
              value={values[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              className={cn(
                "h-10 w-full rounded-[10px] border px-3 text-sm",
                "border-[rgba(15,23,42,0.1)] bg-surface text-text",
                "focus:border-accent focus:ring-2 focus:ring-accent/10",
                "outline-none transition-all"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
