"use client";

import React, { useState } from "react";
import { PanelLeftOpen } from "lucide-react";
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

/* ------------------------------------------------------------------ */
/*  Assessment timer — premium floating pill                           */
/* ------------------------------------------------------------------ */

function toHMS(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  return {
    hh: String(Math.floor(s / 3600)).padStart(2, "0"),
    mm: String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    ss: String(s % 60).padStart(2, "0"),
  };
}

const TIMER_TIER = {
  green: {
    digit: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/50",
    bg: "bg-emerald-50/80 dark:bg-emerald-500/10",
    glow: "16,185,129",
  },
  amber: {
    digit: "text-amber-500 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-700/50",
    bg: "bg-amber-50/80 dark:bg-amber-500/10",
    glow: "245,158,11",
  },
  orange: {
    digit: "text-orange-500 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-700/50",
    bg: "bg-orange-50/80 dark:bg-orange-500/10",
    glow: "249,115,22",
  },
  red: {
    digit: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-700/50",
    bg: "bg-red-50/80 dark:bg-red-500/10",
    glow: "239,68,68",
  },
} as const;

function TimerUnit({
  value,
  label,
  color,
  animate,
}: {
  value: string;
  label: string;
  color: string;
  animate?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {animate ? (
        <span key={value} className={cn("ze-timer-flip text-[18px] font-bold leading-none", color)}>
          {value}
        </span>
      ) : (
        <span className={cn("text-[18px] font-bold leading-none", color)}>{value}</span>
      )}
      <span className="mt-0.5 text-[7px] font-medium uppercase tracking-[0.1em] text-muted">
        {label}
      </span>
    </div>
  );
}

function AssessmentTimer({ remaining, total }: { remaining: number; total: number }) {
  const { hh, mm, ss } = toHMS(remaining);
  const pct = total > 0 ? remaining / total : 0;
  const tierKey = pct > 0.5 ? "green" : pct > 0.2 ? "amber" : pct > 0.1 ? "orange" : "red";
  const tier = TIMER_TIER[tierKey];
  const lastMinute = remaining <= 60 && remaining > 0;

  return (
    <div
      role="timer"
      aria-label={`Time remaining ${hh} hours ${mm} minutes ${ss} seconds`}
      className={cn(
        "flex h-[52px] w-[196px] flex-col items-center justify-center rounded-xl border backdrop-blur-md",
        "shadow-[0_8px_22px_-12px_rgba(15,23,42,0.25)]",
        tier.bg,
        tier.border,
        lastMinute && "ze-timer-pulse",
      )}
      style={
        lastMinute
          ? { boxShadow: `0 0 0 1px rgba(${tier.glow},0.5), 0 0 18px 2px rgba(${tier.glow},0.3)` }
          : undefined
      }
    >
      <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-muted">
        Time Remaining
      </span>
      <div className="mt-0.5 flex items-start gap-1 font-mono tabular-nums">
        <TimerUnit value={hh} label="Hours" color={tier.digit} />
        <span className={cn("text-[16px] font-bold leading-none", tier.digit)}>:</span>
        <TimerUnit value={mm} label="Minutes" color={tier.digit} />
        <span className={cn("text-[16px] font-bold leading-none", tier.digit)}>:</span>
        <TimerUnit value={ss} label="Seconds" color={tier.digit} animate />
      </div>
    </div>
  );
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
  const [tocCollapsed, setTocCollapsed] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-[#0E0E11]">
      {/* Top header — timer is the centered focal point */}
      <header className="relative flex h-[60px] shrink-0 items-center justify-between border-b border-[rgba(15,23,42,0.06)] bg-white px-4 dark:border-white/[0.06] dark:bg-[#0E0E11]">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-[12px] font-semibold text-text-secondary">
            Ze<span className="text-accent">[</span>code<span className="text-accent">]</span>
          </span>
          <span className="hidden text-[11px] text-muted lg:block">
            {assessment.candidateName} · {assessment.title}
          </span>
        </div>

        {/* Centered timer — absolute so it stays centered regardless of side content */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <AssessmentTimer remaining={timeRemaining} total={assessment.duration * 60} />
        </div>

        {/* Right spacer keeps the flex layout balanced */}
        <div className="w-[1px]" aria-hidden />
      </header>

      {/* Body: sidebar + full-width workspace */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left sidebar */}
        {tocCollapsed ? (
          <aside className="hidden w-12 shrink-0 flex-col items-center gap-3 border-r border-[rgba(15,23,42,0.06)] bg-[#FAFAFA] py-4 md:flex dark:border-white/[0.06] dark:bg-[#0C0C0F]">
            <button
              type="button"
              onClick={() => setTocCollapsed(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"
              aria-label="Expand table of contents"
              title="Expand table of contents"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted"
              style={{ writingMode: "vertical-rl" }}
            >
              Table of Contents
            </span>
          </aside>
        ) : (
          <aside className="hidden w-[260px] shrink-0 overflow-y-auto border-r border-[rgba(15,23,42,0.06)] bg-[#FAFAFA] md:block dark:border-white/[0.06] dark:bg-[#0C0C0F]">
            <SectionNavigator
              sections={assessment.sections}
              currentSectionId={currentSectionId}
              currentQuestionId={currentQuestionId}
              markedForReview={markedForReview}
              candidateName={assessment.candidateName}
              onSelectSection={onSelectSection}
              onSelectQuestion={onSelectQuestion}
              onSubmitAssessment={onSubmitAssessment}
              onCollapse={() => setTocCollapsed(true)}
            />
          </aside>
        )}

        {/* Main workspace — fills remaining space, no scroll */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-[#0E0E11]">
          {children}
        </main>
      </div>
    </div>
  );
}
