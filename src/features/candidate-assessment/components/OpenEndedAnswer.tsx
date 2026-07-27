"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface OpenEndedAnswerProps {
  question: AssessmentQuestion;
}

export function OpenEndedAnswer({ question }: OpenEndedAnswerProps) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0">
        <h2 className="text-lg font-semibold text-text">{question.title}</h2>
        <p className="text-sm text-text-secondary mt-2 whitespace-pre-wrap">
          {question.body}
        </p>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className={cn(
          "mt-5 min-h-0 flex-1 w-full p-4 text-sm rounded-[10px] border",
          "border-[rgba(15,23,42,0.1)] bg-surface text-text",
          "focus:border-accent focus:ring-2 focus:ring-accent/10",
          "outline-none resize-none transition-all"
        )}
      />
    </div>
  );
}
