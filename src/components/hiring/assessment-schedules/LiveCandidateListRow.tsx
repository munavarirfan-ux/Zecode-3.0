"use client";

import { AlertTriangle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { statusLabel } from "@/lib/hiring/assessments/liveMonitoringData";
import type { LiveCandidateSession, LiveCandidateStatus } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { cn } from "@/lib/utils";
import { hiringTransition } from "../hiringTokens";
import { assessmentCardMenuContentClass } from "../assessments/assessmentCardMenu";
import { LIVE_CANDIDATE_TABLE_GRID, LIVE_CANDIDATE_TABLE_HEADERS } from "./liveCandidateTableLayout";

const STATUS_PILL: Record<
  LiveCandidateStatus,
  { emoji: string; className: string }
> = {
  live: {
    emoji: "🟢",
    className:
      "border-emerald-500/14 bg-emerald-500/[0.08] text-emerald-800/90 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90",
  },
  idle: {
    emoji: "🟡",
    className:
      "border-amber-500/14 bg-amber-500/[0.08] text-amber-900/80 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300/90",
  },
  flagged: {
    emoji: "🔴",
    className:
      "border-red-500/12 bg-red-500/[0.07] text-red-800/85 dark:border-red-400/15 dark:bg-red-400/10 dark:text-red-300/90",
  },
};

function ThinProgressBar({
  value,
  variant = "accent",
  className,
}: {
  value: number;
  variant?: "accent" | "violet";
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const fill =
    variant === "violet"
      ? "bg-[linear-gradient(90deg,#8B5CF6,#A78BFA)]"
      : "bg-[linear-gradient(90deg,rgb(var(--accent-rgb)),rgb(var(--hero-gradient-to-rgb)))]";

  return (
    <div
      className={cn("h-1 w-full overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.08]", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn("h-full rounded-full transition-all duration-300", fill)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function LiveStatusPill({ status }: { status: LiveCandidateStatus }) {
  const { emoji, className } = STATUS_PILL[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em] whitespace-nowrap",
        className,
      )}
    >
      <span aria-hidden>{emoji}</span>
      {statusLabel(status)}
    </span>
  );
}

function SignalsStack({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return <span className="text-[12px] text-muted/45">—</span>;
  }

  return (
    <ul className="flex max-w-full flex-col gap-0.5">
      {warnings.slice(0, 2).map((w) => (
        <li
          key={w}
          className="flex min-w-0 items-start gap-1 text-[11px] font-medium leading-snug text-red-700/90 dark:text-red-400/90"
        >
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 opacity-80" strokeWidth={2} aria-hidden />
          <span className="truncate">{w}</span>
        </li>
      ))}
      {warnings.length > 2 ? (
        <li className="text-[10px] font-medium text-muted">+{warnings.length - 2} more</li>
      ) : null}
    </ul>
  );
}

const rowShell = cn(
  LIVE_CANDIDATE_TABLE_GRID,
  "min-h-[4.25rem] cursor-pointer border-b border-[rgba(15,23,42,0.05)] px-4 py-3.5",
  hiringTransition,
  "hover:bg-[rgba(var(--accent-rgb),0.03)] dark:hover:bg-white/[0.02]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgba(var(--accent-rgb),0.2)]",
);

export function LiveCandidateTableHeader() {
  return (
    <div
      className={cn(
        LIVE_CANDIDATE_TABLE_GRID,
        "border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] px-4 py-2.5",
      )}
    >
      {LIVE_CANDIDATE_TABLE_HEADERS.map((label, i) => (
          <span
            key={label}
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.1em] text-muted",
              i === 6 && "text-right",
            )}
          >
            {label}
          </span>
        ),
      )}
    </div>
  );
}

export function LiveCandidateListRow({
  candidate,
  onSelect,
}: {
  candidate: LiveCandidateSession;
  onSelect: () => void;
}) {
  const initials = candidate.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const questionPct = Math.round((candidate.currentQuestion / Math.max(candidate.totalQuestions, 1)) * 100);
  const timeUrgent = candidate.remainingMinutes <= 15;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`View live report for ${candidate.name}`}
      className={rowShell}
    >
      {/* Candidate — 32% */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border text-[11px] font-semibold",
            "border-[rgba(15,23,42,0.06)] bg-white text-[#3F3F46] shadow-sm",
            "dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-text-secondary",
          )}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text">{candidate.name}</p>
          <p className="truncate text-[12px] text-muted">{candidate.email}</p>
        </div>
      </div>

      {/* Status — 10% */}
      <div className="flex items-center">
        <LiveStatusPill status={candidate.status} />
      </div>

      {/* Question Progress — 16% */}
      <div className="min-w-0 space-y-1.5 pr-1">
        <p className="text-[12px] font-semibold tabular-nums tracking-tight text-text">
          <span>{candidate.currentQuestion}</span>
          <span className="mx-1 font-normal text-muted/70">/</span>
          <span className="text-text-secondary">{candidate.totalQuestions}</span>
        </p>
        <ThinProgressBar value={questionPct} />
      </div>

      {/* Completion — 12% */}
      <div className="min-w-0 space-y-1.5 pr-1">
        <p className="text-[12px] font-semibold tabular-nums text-text">{candidate.progressPercent}%</p>
        <ThinProgressBar value={candidate.progressPercent} variant="violet" />
      </div>

      {/* Time Left — 12% */}
      <div className="flex items-center">
        <span
          className={cn(
            "text-[15px] font-bold tabular-nums tracking-[-0.03em]",
            timeUrgent ? "text-red-700 dark:text-red-400" : "text-text",
          )}
        >
          {candidate.remainingMinutes}m
        </span>
      </div>

      {/* Signals — 12% */}
      <div className="min-w-0 overflow-hidden">
        <SignalsStack warnings={candidate.warnings} />
      </div>

      {/* Actions — 6% */}
      <div
        className="flex items-center justify-end"
        data-live-candidate-row-action
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 shrink-0 rounded-[10px] p-0 hover:bg-[rgba(15,23,42,0.04)]"
              aria-label={`Actions for ${candidate.name}`}
            >
              <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={assessmentCardMenuContentClass}>
            <DropdownMenuItem className="text-[12px]" onSelect={onSelect}>
              Open live report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
