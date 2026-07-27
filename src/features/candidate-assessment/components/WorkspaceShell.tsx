"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssessmentData } from "@/features/candidate-assessment/types";
import { SectionNavigator } from "./SectionNavigator";

interface WorkspaceShellProps {
  assessment: AssessmentData;
  currentSectionId: string;
  currentQuestionId: string | null;
  timeRemaining: number;
  markedForReview?: Set<string>;
  onSelectSection: (sectionId: string) => void;
  onSelectQuestion: (questionId: string) => void;
  onSubmitAssessment: () => void;
  children: React.ReactNode;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function WorkspaceShell({
  assessment,
  currentSectionId,
  currentQuestionId,
  timeRemaining,
  markedForReview,
  onSelectSection,
  onSelectQuestion,
  onSubmitAssessment,
  children,
}: WorkspaceShellProps) {
  const timerClasses = cn(
    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tabular-nums border transition-colors",
    timeRemaining <= 120
      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40"
      : timeRemaining <= 600
        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40"
        : "bg-[rgba(15,23,42,0.03)] text-text border-[rgba(15,23,42,0.08)] dark:bg-white/[0.04] dark:border-white/[0.08]",
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-[#0E0E11]">
      {/* Compact top header */}
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-[rgba(15,23,42,0.06)] bg-white px-4 dark:border-white/[0.06] dark:bg-[#0E0E11]">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-[12px] font-semibold text-text-secondary">
            Ze<span className="text-accent">[</span>code<span className="text-accent">]</span>
          </span>
          <span className="hidden text-[11px] text-muted sm:block">
            {assessment.candidateName} · {assessment.title}
          </span>
        </div>

        <div className={timerClasses}>
          <Clock className="h-3 w-3" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </header>

      {/* Body: sidebar + full-width workspace */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="hidden w-[260px] shrink-0 overflow-y-auto border-r border-[rgba(15,23,42,0.06)] bg-[#FAFAFA] md:block dark:border-white/[0.06] dark:bg-[#0C0C0F]">
          <SectionNavigator
            sections={assessment.sections}
            currentSectionId={currentSectionId}
            currentQuestionId={currentQuestionId}
            markedForReview={markedForReview}
            onSelectSection={onSelectSection}
            onSelectQuestion={onSelectQuestion}
            onSubmitAssessment={onSubmitAssessment}
          />
        </aside>

        {/* Main workspace — fills remaining space, no scroll */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-[#0E0E11]">
          {children}
        </main>
      </div>
    </div>
  );
}
