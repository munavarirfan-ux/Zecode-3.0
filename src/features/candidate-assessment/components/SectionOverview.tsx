"use client";

import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AssessmentSection, QuestionStatus } from "../types";

interface SectionOverviewProps {
  section: AssessmentSection;
  onSelectQuestion: (questionId: string) => void;
  sections?: AssessmentSection[];
  currentSectionIndex?: number;
  onNavigateSection?: (sectionId: string) => void;
}

const STATUS_CONFIG: Record<
  QuestionStatus,
  { label: string; dot: string; text: string }
> = {
  answered: {
    label: "Answered",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  unanswered: {
    label: "Not attempted",
    dot: "bg-gray-300 dark:bg-gray-600",
    text: "text-text-secondary",
  },
  "marked-for-review": {
    label: "Marked for review",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
};

export function SectionOverview({
  section,
  onSelectQuestion,
  sections,
  currentSectionIndex,
  onNavigateSection,
}: SectionOverviewProps) {
  const sectionNum = currentSectionIndex !== undefined ? currentSectionIndex + 1 : 1;
  const totalSections = sections?.length || 1;
  const estimatedMinutes = Math.max(2, section.questionCount * 3);
  const answeredCount = section.questions.filter(
    (q) => q.status === "answered",
  ).length;
  const remainingCount = section.questionCount - answeredCount;

  const hasPrevSection =
    sections && currentSectionIndex !== undefined && currentSectionIndex > 0;
  const hasNextSection =
    sections &&
    currentSectionIndex !== undefined &&
    currentSectionIndex < sections.length - 1;

  return (
    <div className="flex h-full flex-col overflow-hidden px-8 py-6 lg:px-10 lg:py-8">
      {/* Section header */}
      <div className="shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent/70">
          Section {String(sectionNum).padStart(2, "0")}
        </p>
        <h1 className="mt-2 text-[1.5rem] font-bold tracking-[-0.02em] text-text">
          {section.label}
        </h1>
        <p className="mt-1.5 text-[13px] text-muted">
          {section.questionCount} questions · {section.weightage}% weightage ·
          approximately {estimatedMinutes} minutes
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
          Choose the best answer for each question. You may return to unanswered
          questions before submitting this section.
        </p>

        {/* Thin divider */}
        <div className="mt-4 h-px bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]" />
      </div>

      {/* Progress strip */}
      <div className="mt-4 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-text-secondary">
            Progress{" "}
            <span className="font-semibold text-text">
              {answeredCount} of {section.questionCount}
            </span>{" "}
            answered
          </span>
          <span className="text-[11px] text-muted">
            {remainingCount} remaining
          </span>
        </div>
        <div className="mt-2 h-[5px] w-full overflow-hidden rounded-full bg-[rgba(15,23,42,0.04)] dark:bg-white/[0.04]">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{
              width:
                answeredCount > 0
                  ? `${(answeredCount / section.questionCount) * 100}%`
                  : "0%",
            }}
          />
        </div>
      </div>

      {/* Question rows — scrollable area */}
      <div className="mt-4 min-h-0 flex-1 divide-y divide-[rgba(15,23,42,0.05)] overflow-y-auto border-y border-[rgba(15,23,42,0.05)] dark:divide-white/[0.04] dark:border-white/[0.04]">
        {section.questions.map((q) => {
          const status = STATUS_CONFIG[q.status];
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(q.id)}
              className="group flex w-full items-center gap-5 py-4 text-left transition-colors duration-150 hover:bg-accent/[0.02] dark:hover:bg-accent/[0.03]"
            >
              {/* Question number */}
              <span className="w-8 shrink-0 text-[18px] font-bold tabular-nums text-[rgba(15,23,42,0.15)] transition-colors duration-150 group-hover:text-accent dark:text-white/[0.1]">
                {String(q.number).padStart(2, "0")}
              </span>

              {/* Title and metadata */}
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-text">
                  {q.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] capitalize text-muted">
                    {q.type === "fill-blank"
                      ? "Fill in the blank"
                      : q.type === "open-ended"
                        ? "Open ended"
                        : q.type === "mcq"
                          ? "Multiple choice"
                          : q.type}
                  </span>
                  <span className="text-[11px] text-muted">·</span>
                  <span className={cn("flex items-center gap-1.5 text-[11px]", status.text)}>
                    <span className={cn("h-[5px] w-[5px] rounded-full", status.dot)} />
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-4 w-4 shrink-0 text-[rgba(15,23,42,0.15)] transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent dark:text-white/[0.1]" />
            </button>
          );
        })}
      </div>

      {/* Bottom navigation */}
      {sections && onNavigateSection && (
        <div className="mt-4 flex shrink-0 items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasPrevSection}
            onClick={() => {
              if (hasPrevSection && currentSectionIndex !== undefined) {
                onNavigateSection(sections[currentSectionIndex - 1].id);
              }
            }}
            className="gap-1.5 text-[12px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous section
          </Button>

          <span className="text-[11px] text-muted">
            Section {sectionNum} of {totalSections}
          </span>

          <Button
            variant="ghost"
            size="sm"
            disabled={!hasNextSection}
            onClick={() => {
              if (hasNextSection && currentSectionIndex !== undefined) {
                onNavigateSection(sections[currentSectionIndex + 1].id);
              }
            }}
            className="gap-1.5 text-[12px]"
          >
            Next section
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Page indicator */}
      <div className="mt-3 shrink-0 text-center">
        <span className="text-[9px] uppercase tracking-[0.1em] text-[rgba(15,23,42,0.12)] dark:text-white/[0.06]">
          Page {sectionNum}
        </span>
      </div>
    </div>
  );
}
