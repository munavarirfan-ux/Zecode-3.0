"use client";

import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Clock,
  LayoutDashboard,
  MoreHorizontal,
  Radio,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";
import { formatClosesIn } from "@/lib/hiring/assessments/liveMonitoringData";
import type { LiveAssessmentSummary } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { cn } from "@/lib/utils";
import { hiringCard, hiringTransition } from "../hiringTokens";

const LIVE_ACCENT =
  "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-emerald-500 before:shadow-[2px_0_12px_rgba(16,185,129,0.35)] before:content-['']";

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

function PrimaryLiveMetric({ count }: { count: number }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-forest/12 bg-gradient-to-br from-forest/[0.08] to-forest/[0.04] px-3 py-2.5",
        "dark:border-emerald-500/15 dark:from-emerald-500/12 dark:to-emerald-500/5",
      )}
    >
      <p className="text-[1.625rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-[#0F3D2E] dark:text-emerald-300">
        {count}
      </p>
      <p className="mt-1 text-[11px] font-semibold tracking-tight text-forest/85 dark:text-emerald-400/90">
        Candidates live
      </p>
    </div>
  );
}

function SecondaryMetricChip({
  value,
  label,
  tone = "neutral",
}: {
  value: number;
  label: string;
  tone?: "neutral" | "flagged" | "idle";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px]",
        tone === "flagged"
          ? "border-red-400/20 bg-red-500/[0.06] text-red-800 dark:text-red-300"
          : tone === "idle"
            ? "border-amber-400/20 bg-amber-500/[0.06] text-amber-900 dark:text-amber-200"
            : "border-transparent bg-[rgba(15,23,42,0.03)] text-muted/90 dark:bg-white/[0.04]",
      )}
    >
      <span className="font-medium tabular-nums">{value}</span>
      <span className={tone === "neutral" ? "text-text-secondary/55" : "opacity-80"}>{label}</span>
    </span>
  );
}

function isCardAction(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-live-assessment-card-action]"));
}

const menuContentClass = cn(
  "z-[100] w-[220px] min-w-0 max-h-none overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
  "dark:border-white/[0.08] dark:bg-surface",
);

export function LiveAssessmentCard({ summary }: { summary: LiveAssessmentSummary }) {
  const router = useRouter();
  const monitorHref = ROUTES.scheduleAssessment(summary.assessmentId);
  const closesLabel = formatClosesIn(summary.closesInMinutes);

  const openMonitor = () => router.push(monitorHref);

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isCardAction(e.target)) return;
    openMonitor();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (isCardAction(e.target)) return;
    e.preventDefault();
    openMonitor();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`Open live monitor for ${summary.assessmentName}`}
      className={cn(
        hiringCard,
        "group relative flex h-full flex-col overflow-hidden cursor-pointer",
        "hover:-translate-y-1",
        "hover:border-[rgba(15,61,46,0.14)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06),0_24px_48px_-16px_rgba(15,61,46,0.16),0_0_0_1px_rgba(15,61,46,0.1)]",
        "dark:hover:border-emerald-500/20 dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.18),0_24px_48px_-16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(167,243,208,0.12)]",
        hiringTransition,
        LIVE_ACCENT,
        "outline-none focus-visible:ring-2 focus-visible:ring-forest/25 focus-visible:ring-offset-2",
      )}
    >
      <ArrowUpRight
        className={cn(
          "pointer-events-none absolute right-4 top-4 z-[1] h-4 w-4 text-forest/0",
          hiringTransition,
          "group-hover:text-forest/60",
        )}
        strokeWidth={2}
        aria-hidden
      />

      <div className="relative z-[1] flex flex-1 flex-col gap-3 p-4 sm:p-[1.125rem]">
        <div className="space-y-1.5 pr-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.03em] text-text transition-colors duration-[180ms] group-hover:text-forest">
              {summary.assessmentName}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/12 bg-emerald-500/[0.07] px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.03em] text-emerald-800/90 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90">
              <Radio className="h-3 w-3" strokeWidth={2} aria-hidden />
              Live
            </span>
          </div>
          <p className="text-[12px] font-medium text-text-secondary/70">{summary.role}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <MetaChip accent>Live window</MetaChip>
          <MetaChip>
            <Clock className="mr-1 inline h-3 w-3 opacity-70" strokeWidth={1.75} aria-hidden />
            Closes in {closesLabel}
          </MetaChip>
        </div>

        <div className="space-y-2">
          <PrimaryLiveMetric count={summary.liveCount} />
          <div className="flex flex-wrap gap-1.5">
            <SecondaryMetricChip value={summary.flaggedCount} label="Flagged" tone="flagged" />
            <SecondaryMetricChip value={summary.idleCount} label="Idle" tone="idle" />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[rgba(15,23,42,0.05)] pt-3 dark:border-white/[0.05]">
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-[11px] font-medium leading-snug text-text-secondary/85">
              {summary.liveCount} candidate{summary.liveCount === 1 ? "" : "s"} taking this exam
            </p>
            {summary.flaggedCount > 0 ? (
              <p className="text-[11px] leading-snug text-red-700/85 dark:text-red-400/90">
                {summary.flaggedCount} flagged — needs attention
              </p>
            ) : (
              <p className="text-[11px] leading-snug text-muted/75">Window closes in {closesLabel}</p>
            )}
          </div>

          <div
            data-live-assessment-card-action
            className="relative z-[2] shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className={cn(
                    "h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-sm",
                    hiringTransition,
                    "hover:border-[rgba(15,61,46,0.12)] hover:bg-white dark:bg-surface",
                  )}
                  aria-label="Assessment actions"
                >
                  <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={4}
                collisionPadding={12}
                avoidCollisions={false}
                className={menuContentClass}
              >
                <DropdownMenuItem
                  onSelect={openMonitor}
                  className={cn(
                    "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0",
                    "text-[12px] font-medium text-text/90",
                    "outline-none transition-colors duration-150 ease-out",
                    "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
                    "dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]",
                  )}
                >
                  <LayoutDashboard className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
                  Open live monitor
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push(`${monitorHref}?filter=flagged`)}
                  className={cn(
                    "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0",
                    "text-[12px] font-medium text-text/90",
                    "outline-none transition-colors duration-150 ease-out",
                    "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
                    "dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]",
                  )}
                >
                  <Users className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
                  View flagged
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  );
}
