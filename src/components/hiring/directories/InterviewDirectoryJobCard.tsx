"use client";

import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import type { InterviewDirectoryJob } from "@/lib/hiring/candidateDirectory";
import { hiringCard, hiringTransition } from "../hiringTokens";
import { StatusBadge } from "../StatusBadge";

function Metric({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  tone?: "neutral" | "primary" | "attention" | "success";
}) {
  const toneClass =
    tone === "attention"
      ? "border-[rgba(234,88,12,0.20)] bg-gradient-to-br from-[rgba(234,88,12,0.13)] to-[rgba(234,88,12,0.06)] text-[#9A3412] dark:text-[#FDBA74]"
      : tone === "primary"
        ? "border-[rgb(var(--accent-rgb)/0.24)] bg-gradient-to-br from-[rgb(var(--accent-rgb)/0.14)] to-[rgb(var(--accent-rgb)/0.06)] text-[rgb(var(--accent-rgb))]"
        : tone === "success"
          ? "border-[rgba(15,61,46,0.20)] bg-gradient-to-br from-[rgba(15,61,46,0.12)] to-[rgba(15,61,46,0.05)] text-forest"
          : "border-[rgba(15,23,42,0.06)] bg-gradient-to-br from-white/[0.7] to-[#F8FAFC] text-text-secondary/85 dark:border-white/[0.06] dark:from-white/[0.04] dark:to-white/[0.02]";

  return (
    <div
      className={cn(
        "rounded-[14px] border px-3 py-2.5 backdrop-blur-[10px]",
        "shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]",
        "transition-[transform,box-shadow,border-color] duration-[180ms] ease-out",
        "group-hover:shadow-[0_12px_28px_-22px_rgba(15,23,42,0.35)]",
        toneClass,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-medium opacity-80">
          <Icon className="h-3.5 w-3.5 opacity-80" strokeWidth={1.9} aria-hidden />
          <span className="truncate">{label}</span>
        </div>
      </div>
      <p className="mt-1 text-[1.05rem] font-semibold tabular-nums tracking-[-0.03em] text-text">
        {value}
      </p>
    </div>
  );
}

function PipelinePills({ rounds }: { rounds: string[] }) {
  if (!rounds.length) return null;
  const shown = rounds.slice(0, 4);
  const overflow = rounds.length - shown.length;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((r, idx) => (
        <div key={`${r}-${idx}`} className="flex items-center gap-1.5">
          <span className="rounded-full border border-[rgba(15,23,42,0.06)] bg-white/[0.6] px-2 py-1 text-[10px] font-medium text-text-secondary/85 backdrop-blur dark:border-white/[0.06] dark:bg-white/[0.03]">
            {r}
          </span>
          {idx < shown.length - 1 ? (
            <span className="text-[10px] font-medium text-muted/60" aria-hidden>
              →
            </span>
          ) : null}
        </div>
      ))}
      {overflow > 0 ? (
        <span className="ml-0.5 text-[10px] font-medium text-muted/70">+{overflow}</span>
      ) : null}
    </div>
  );
}

export function InterviewDirectoryJobCard({ job }: { job: InterviewDirectoryJob }) {
  const router = useRouter();
  const href = `${ROUTES.interviewsWorkflow(job.id)}?mode=interview&tab=interviews`;
  const { stats } = job;

  return (
    <article
      className={cn(
        hiringCard,
        "group relative flex h-full flex-col overflow-hidden",
        hiringTransition,
        "hover:-translate-y-0.5 hover:border-[rgb(var(--accent-rgb)/0.16)]",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_40%_0%,rgba(255,255,255,0.85),transparent_60%)] opacity-70 dark:opacity-15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -inset-20 bg-[radial-gradient(circle_at_55%_15%,rgba(var(--accent-rgb),0.16),transparent_48%)] opacity-0 transition-opacity duration-[220ms] ease-out group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.02),transparent_45%,rgba(var(--accent-rgb),0.05))] opacity-0 transition-opacity duration-[220ms] ease-out group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[1.0625rem] font-semibold leading-snug tracking-[-0.03em] text-text">
                {job.title}
              </h3>
              <p className="mt-1 text-[12px] font-medium text-text-secondary/70">
                {job.department}
                <span className="mx-1.5 text-muted/30">·</span>
                {job.location}
              </p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(15,23,42,0.06)] bg-white/[0.55] px-2.5 py-1 text-[11px] font-medium text-text-secondary/80 backdrop-blur dark:border-white/[0.06] dark:bg-white/[0.03]">
              <Clock className="h-3.5 w-3.5 opacity-70" strokeWidth={1.9} aria-hidden />
              <span className="tabular-nums font-semibold text-text">{job.interviewsToday}</span>
              today
            </span>
            {stats.feedbackPending > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(234,88,12,0.20)] bg-[rgba(234,88,12,0.10)] px-2.5 py-1 text-[11px] font-semibold text-[#9A3412] dark:text-[#FDBA74]">
                <Sparkles className="h-3.5 w-3.5 opacity-90" strokeWidth={2} aria-hidden />
                <span className="tabular-nums">{stats.feedbackPending}</span>
                needs feedback
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Metric label="In interview" value={stats.interviewCandidates} icon={Users} tone="primary" />
          <Metric label="Upcoming" value={stats.upcomingInterviews} icon={Calendar} tone="neutral" />
          <Metric
            label="Feedback pending"
            value={stats.feedbackPending}
            icon={MessageSquare}
            tone={stats.feedbackPending > 0 ? "attention" : "neutral"}
          />
          <Metric
            label="Completed"
            value={stats.completedInterviews}
            icon={CheckCircle2}
            tone={stats.completedInterviews > 0 ? "success" : "neutral"}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted/65">
            Pipeline
          </p>
          <PipelinePills rounds={stats.rounds} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[rgba(15,23,42,0.05)] pt-3 dark:border-white/[0.06]">
          <div className="text-[11px] font-medium text-text-secondary/60">
            {stats.feedbackPending > 0 ? (
              <span className="text-[#9A3412] dark:text-[#FDBA74]">
                {stats.feedbackPending} feedback request{stats.feedbackPending === 1 ? "" : "s"} pending
              </span>
            ) : (
              <span>Pipeline healthy</span>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            className={cn(
              "h-9 rounded-[13px] px-4 text-[12px] font-semibold",
              "bg-accent text-white",
              "hover:-translate-y-px hover:bg-accent-hover",
              "active:translate-y-0",
              "focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.35)] focus-visible:ring-offset-2",
            )}
            onClick={() => router.push(href)}
          >
            Open workflow
            <ArrowUpRight
              className="ml-1 h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Button>
        </div>
      </div>
    </article>
  );
}
