"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface QuestionShellProps {
  question: AssessmentQuestion;
  sectionLabel: string;
  questionIndex: number;
  totalInSection: number;
  isMarkedForReview: boolean;
  onToggleReview: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  children: React.ReactNode;
}

export function QuestionShell({
  question,
  sectionLabel,
  questionIndex,
  totalInSection,
  isMarkedForReview,
  onToggleReview,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  children,
}: QuestionShellProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-[rgba(15,23,42,0.05)] px-6 py-2 dark:border-white/[0.04] lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-text">
            Question {questionIndex} of {totalInSection}
          </span>
          <span className="h-3 w-px bg-[rgba(15,23,42,0.1)] dark:bg-white/[0.1]" />
          <span className="text-[11px] text-muted">{sectionLabel}</span>
        </div>

        <button
          type="button"
          onClick={onToggleReview}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
            isMarkedForReview
              ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
              : "border-[rgba(15,23,42,0.08)] text-text-secondary hover:border-amber-200 hover:bg-amber-50/50 dark:border-white/[0.08] dark:hover:border-amber-800 dark:hover:bg-amber-900/10",
          )}
        >
          <Bookmark className={cn("h-3 w-3", isMarkedForReview && "fill-current")} />
          {isMarkedForReview ? "Marked" : "Mark for review"}
        </button>
      </div>

      {/* Question content — fills available space */}
      <div className="min-h-0 flex-1 overflow-hidden px-6 py-6 lg:px-8 lg:py-8">
        {children}
      </div>

      {/* Bottom action bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-[rgba(15,23,42,0.06)] px-6 py-2.5 dark:border-white/[0.06] lg:px-8">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious}
          onClick={onPrevious}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <span className="text-[11px] tabular-nums text-muted">
          {questionIndex} / {totalInSection}
        </span>

        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          className="gap-1"
        >
          {hasNext ? "Next" : "Finish section"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
