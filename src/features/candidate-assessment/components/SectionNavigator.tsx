"use client";

import React from "react";
import { PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type {
  AssessmentSection,
  AssessmentQuestion,
} from "@/features/candidate-assessment/types";

interface SectionNavigatorProps {
  sections: AssessmentSection[];
  currentSectionId: string;
  currentQuestionId: string | null;
  markedForReview?: Set<string>;
  onSelectSection: (sectionId: string) => void;
  onSelectQuestion: (questionId: string) => void;
  onSubmitAssessment: () => void;
  onCollapse?: () => void;
}

type PillState = "current" | "review" | "completed" | "unanswered";

function getPillState(
  question: AssessmentQuestion,
  isCurrent: boolean,
  markedForReview?: Set<string>,
): PillState {
  if (isCurrent) return "current";
  if (markedForReview?.has(question.id)) return "review";
  if (question.status === "marked-for-review") return "review";
  if (question.status === "answered") return "completed";
  return "unanswered";
}

const pillStyles: Record<PillState, string> = {
  current:
    "bg-accent text-white border-accent shadow-sm",
  review:
    "bg-[#FEF3C7] text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  completed:
    "bg-[#DCFCE7] text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  unanswered:
    "bg-[rgba(15,23,42,0.04)] text-text-secondary border-[rgba(15,23,42,0.1)] dark:bg-white/[0.05] dark:text-muted dark:border-white/[0.1]",
};

const pillHover: Record<PillState, string> = {
  current: "",
  review: "hover:bg-[#FDE68A] hover:border-amber-400",
  completed: "hover:bg-[#BBF7D0] hover:border-emerald-400",
  unanswered:
    "hover:bg-[rgba(15,23,42,0.07)] hover:border-[rgba(15,23,42,0.18)] dark:hover:bg-white/[0.08]",
};

export function SectionNavigator({
  sections,
  currentSectionId,
  currentQuestionId,
  markedForReview,
  onSelectSection,
  onSelectQuestion,
  onSubmitAssessment,
  onCollapse,
}: SectionNavigatorProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Table of contents header */}
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          Table of Contents
        </p>
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"
            aria-label="Collapse table of contents"
            title="Collapse"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Sections list */}
      <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        {sections.map((section, idx) => {
          const isActive = section.id === currentSectionId;
          const answeredCount = section.questions.filter(
            (q) => q.status === "answered",
          ).length;

          return (
            <div key={section.id}>
              {/* Section row */}
              <button
                onClick={() => onSelectSection(section.id)}
                className={cn(
                  "group relative flex w-full items-start gap-3 rounded-[10px] px-3 py-2.5 text-left transition-all duration-150",
                  isActive
                    ? "bg-accent/[0.05] dark:bg-accent/[0.08]"
                    : "hover:bg-[rgba(15,23,42,0.02)] dark:hover:bg-white/[0.02]",
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-full bg-accent" />
                )}

                {/* Section number */}
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-bold",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "bg-[rgba(15,23,42,0.04)] text-text-secondary dark:bg-white/[0.06]",
                  )}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Section info */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-[12px] font-medium leading-tight",
                      isActive ? "text-text" : "text-text-secondary",
                    )}
                  >
                    {section.label}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {answeredCount} / {section.questionCount} completed
                  </p>
                </div>
              </button>

              {/* Question pills — only for active section */}
              {isActive && (
                <div className="flex flex-wrap gap-1.5 px-3 pb-2 pl-12 pt-1">
                  {section.questions.map((question) => {
                    const isCurrent = question.id === currentQuestionId;
                    const state = getPillState(question, isCurrent, markedForReview);

                    return (
                      <button
                        key={question.id}
                        onClick={() => onSelectQuestion(question.id)}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-[6px] border text-[11px] font-semibold transition-all duration-[180ms] ease-out",
                          pillStyles[state],
                          !isCurrent && pillHover[state],
                        )}
                      >
                        {question.number}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom: legend + submit */}
      <div className="border-t border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-[6px] w-[6px] rounded-full bg-emerald-500" />
            <span className="text-[9px] text-muted">Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-[6px] w-[6px] rounded-full bg-amber-500" />
            <span className="text-[9px] text-muted">Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-[6px] w-[6px] rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-[9px] text-muted">Pending</span>
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          className="w-full text-[12px]"
          onClick={onSubmitAssessment}
        >
          Submit assessment
        </Button>
      </div>
    </div>
  );
}
