"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  MoreHorizontal,
  Pause,
  Timer,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { statusLabel } from "@/lib/hiring/assessments/liveMonitoringData";
import type { LiveCandidateSession, LiveCandidateStatus } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { cn } from "@/lib/utils";
import { hiringCard, hiringTransition } from "../hiringTokens";
import {
  AssessmentCardMenuItem,
  AssessmentCardMenuSeparator,
  assessmentCardMenuContentClass,
} from "../assessments/assessmentCardMenu";

const STATUS_ACCENT: Record<LiveCandidateStatus, string> = {
  live: "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-emerald-500 before:shadow-[2px_0_12px_rgba(16,185,129,0.35)] before:content-['']",
  idle: "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-amber-500 before:shadow-[2px_0_12px_rgba(245,158,11,0.3)] before:content-['']",
  flagged:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-red-500 before:shadow-[2px_0_12px_rgba(239,68,68,0.35)] before:content-['']",
};

const STATUS_BADGE: Record<LiveCandidateStatus, string> = {
  live: "border-emerald-500/12 bg-emerald-500/[0.07] text-emerald-800/90 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90",
  idle: "border-amber-500/14 bg-amber-500/[0.08] text-amber-900/80 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300/90",
  flagged: "border-red-500/12 bg-red-500/[0.07] text-red-800/85 dark:border-red-400/15 dark:bg-red-400/10 dark:text-red-300/90",
};

function MetaChip({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-tight",
        hiringTransition,
        accent
          ? "border-accent/15 bg-accent/[0.08] text-accent"
          : "border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.02)] text-text-secondary/75 dark:border-white/[0.06] dark:bg-white/[0.03]",
      )}
    >
      {children}
    </span>
  );
}

function PrimaryTimeMetric({ minutes }: { minutes: number }) {
  const flaggedStyle = minutes <= 15;
  return (
    <div
      className={cn(
        "rounded-[12px] border px-3 py-2.5",
        flaggedStyle
          ? "border-red-400/20 bg-gradient-to-br from-red-500/[0.08] to-red-500/[0.03]"
          : "border-forest/12 bg-gradient-to-br from-forest/[0.08] to-forest/[0.04] dark:border-emerald-500/15 dark:from-emerald-500/12 dark:to-emerald-500/5",
      )}
    >
      <p
        className={cn(
          "text-[1.625rem] font-semibold tabular-nums leading-none tracking-[-0.04em]",
          flaggedStyle ? "text-red-800 dark:text-red-300" : "text-[#0F3D2E] dark:text-emerald-300",
        )}
      >
        {minutes}
      </p>
      <p
        className={cn(
          "mt-1 text-[11px] font-semibold tracking-tight",
          flaggedStyle ? "text-red-700/85 dark:text-red-400/90" : "text-forest/85 dark:text-emerald-400/90",
        )}
      >
        Minutes remaining
      </p>
    </div>
  );
}

function SecondaryMetricChip({ value, label }: { value: number | string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-transparent bg-[rgba(15,23,42,0.03)] px-2 py-1 text-[11px] text-muted/90 dark:bg-white/[0.04]">
      <span className="font-medium tabular-nums text-text-secondary/90">{value}</span>
      <span className="text-text-secondary/55">{label}</span>
    </span>
  );
}

function isCardAction(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-live-candidate-card-action]"));
}

function runAction(label: string) {
  toast.message(`${label} (demo)`);
}

export function LiveCandidateCard({
  candidate,
  onSelect,
}: {
  candidate: LiveCandidateSession;
  onSelect: () => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isCardAction(e.target)) return;
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (isCardAction(e.target)) return;
    e.preventDefault();
    onSelect();
  };

  const context = {
    primary: `Question ${candidate.currentQuestion} of ${candidate.totalQuestions} · ${candidate.progressPercent}% complete`,
    secondary:
      candidate.warnings.length > 0
        ? candidate.warnings[0]
        : candidate.status === "idle"
          ? "No recent activity"
          : "No warning signals",
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`View ${candidate.name} session`}
      className={cn(
        hiringCard,
        "group relative flex h-full flex-col overflow-hidden cursor-pointer",
        "hover:-translate-y-1",
        "hover:border-[rgba(15,61,46,0.14)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06),0_24px_48px_-16px_rgba(15,61,46,0.16),0_0_0_1px_rgba(15,61,46,0.1)]",
        "dark:hover:border-emerald-500/20 dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.18),0_24px_48px_-16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(167,243,208,0.12)]",
        hiringTransition,
        STATUS_ACCENT[candidate.status],
        "outline-none focus-visible:ring-2 focus-visible:ring-forest/25 focus-visible:ring-offset-2",
      )}
    >
      <ArrowUpRight
        className={cn(
          "pointer-events-none absolute right-4 top-4 z-[1] h-4 w-4 text-forest/0",
          hiringTransition,
          "group-hover:text-forest/60",
          candidate.status === "flagged" && "group-hover:text-red-600/50",
        )}
        strokeWidth={2}
        aria-hidden
      />

      <div className="relative z-[1] flex flex-1 flex-col gap-3 p-4 sm:p-[1.125rem]">
        <div className="space-y-1.5 pr-6">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.03em] text-text transition-colors duration-[180ms]",
                candidate.status === "flagged"
                  ? "group-hover:text-red-700"
                  : "group-hover:text-forest",
              )}
            >
              {candidate.name}
            </h3>
            <span
              className={cn(
                "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.03em]",
                STATUS_BADGE[candidate.status],
              )}
            >
              {statusLabel(candidate.status)}
            </span>
          </div>
          <p className="truncate text-[12px] font-medium text-text-secondary/70">{candidate.email}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <MetaChip>
            Q {candidate.currentQuestion}/{candidate.totalQuestions}
          </MetaChip>
          <MetaChip>{candidate.progressPercent}% done</MetaChip>
          {candidate.warnings.length > 0 ? (
            <MetaChip accent>
              <AlertTriangle className="mr-0.5 h-3 w-3" strokeWidth={2} aria-hidden />
              {candidate.warnings.length} signal{candidate.warnings.length === 1 ? "" : "s"}
            </MetaChip>
          ) : null}
        </div>

        <div className="space-y-2">
          <PrimaryTimeMetric minutes={candidate.remainingMinutes} />
          <div className="flex flex-wrap gap-1.5">
            <SecondaryMetricChip
              value={`${candidate.currentQuestion}/${candidate.totalQuestions}`}
              label="Progress"
            />
            {candidate.warnings.length > 0 ? (
              <SecondaryMetricChip value={candidate.warnings.length} label="Warnings" />
            ) : (
              <SecondaryMetricChip value="—" label="Warnings" />
            )}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[rgba(15,23,42,0.05)] pt-3 dark:border-white/[0.05]">
          <div className="min-w-0 flex-1 space-y-0.5">
            <p
              className={cn(
                "text-[11px] font-medium leading-snug",
                candidate.warnings.length > 0 ? "text-red-700/90 dark:text-red-400/90" : "text-text-secondary/85",
              )}
            >
              {context.primary}
            </p>
            <p className="line-clamp-1 text-[11px] leading-snug text-muted/75">{context.secondary}</p>
          </div>

          <div
            data-live-candidate-card-action
            className="relative z-[2] shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-sm",
                    hiringTransition,
                    "hover:border-[rgba(15,61,46,0.12)] hover:bg-white dark:bg-surface",
                  )}
                  aria-label="Candidate actions"
                >
                  <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={4}
                collisionPadding={12}
                className={assessmentCardMenuContentClass}
              >
                <AssessmentCardMenuItem icon={ArrowUpRight} label="View details" onSelect={onSelect} />
                <AssessmentCardMenuSeparator />
                <AssessmentCardMenuItem
                  icon={AlertTriangle}
                  label="Warn candidate"
                  onSelect={() => runAction(`Warn ${candidate.name}`)}
                />
                <AssessmentCardMenuItem
                  icon={Timer}
                  label="Extend time"
                  onSelect={() => runAction(`Extend time for ${candidate.name}`)}
                />
                <AssessmentCardMenuItem
                  icon={Pause}
                  label="Pause session"
                  onSelect={() => runAction(`Pause ${candidate.name}`)}
                />
                <AssessmentCardMenuSeparator />
                <AssessmentCardMenuItem
                  icon={XCircle}
                  label="Terminate"
                  destructive
                  onSelect={() => runAction(`Terminate ${candidate.name}`)}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  );
}
