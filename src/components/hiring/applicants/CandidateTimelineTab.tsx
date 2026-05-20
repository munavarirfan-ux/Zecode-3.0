"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GitBranch,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  Star,
  UserRound,
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HiringCandidate } from "@/lib/hiring/types";
import {
  ACTIVITY_FILTERS,
  buildCandidateActivities,
  filterActivities,
  getNextExpectedAction,
  groupActivitiesByDate,
  type ActivityFilterId,
  type CandidateActivityItem,
  type CandidateActivityKind,
} from "@/lib/hiring/candidateActivity";
import { cn } from "@/lib/utils";
import { dashboardPanelInteractive } from "@/components/dashboard/dashboardTokens";

const KIND_CONFIG: Record<
  CandidateActivityKind,
  { icon: LucideIcon; accent: string; tint: string }
> = {
  applied: {
    icon: Send,
    accent: "border-l-violet-500",
    tint: "bg-violet-50/60 dark:bg-violet-500/[0.08]",
  },
  resume_parsed: {
    icon: FileText,
    accent: "border-l-sky-500",
    tint: "bg-sky-50/50 dark:bg-sky-500/[0.08]",
  },
  stage_changed: {
    icon: GitBranch,
    accent: "border-l-indigo-500",
    tint: "bg-indigo-50/50 dark:bg-indigo-500/[0.08]",
  },
  interview_scheduled: {
    icon: Video,
    accent: "border-l-blue-500",
    tint: "bg-blue-50/50 dark:bg-blue-500/[0.08]",
  },
  interview_rescheduled: {
    icon: Calendar,
    accent: "border-l-blue-400",
    tint: "bg-blue-50/40 dark:bg-blue-500/[0.06]",
  },
  feedback_requested: {
    icon: MessageSquare,
    accent: "border-l-amber-500",
    tint: "bg-amber-50/60 dark:bg-amber-500/[0.08]",
  },
  feedback_submitted: {
    icon: CheckCircle2,
    accent: "border-l-emerald-500",
    tint: "bg-emerald-50/60 dark:bg-emerald-500/[0.08]",
  },
  notes_added: {
    icon: FileText,
    accent: "border-l-stone-500",
    tint: "bg-stone-50/60 dark:bg-white/[0.04]",
  },
  email_sent: {
    icon: Mail,
    accent: "border-l-cyan-500",
    tint: "bg-cyan-50/50 dark:bg-cyan-500/[0.08]",
  },
  candidate_moved: {
    icon: ArrowRight,
    accent: "border-l-indigo-500",
    tint: "bg-indigo-50/50 dark:bg-indigo-500/[0.08]",
  },
  transfer_request: {
    icon: UserRound,
    accent: "border-l-orange-500",
    tint: "bg-orange-50/50 dark:bg-orange-500/[0.08]",
  },
  transfer_resolved: {
    icon: CheckCircle2,
    accent: "border-l-teal-500",
    tint: "bg-teal-50/50 dark:bg-teal-500/[0.08]",
  },
  offer_sent: {
    icon: Sparkles,
    accent: "border-l-fuchsia-500",
    tint: "bg-fuchsia-50/50 dark:bg-fuchsia-500/[0.08]",
  },
  rejected: {
    icon: Ban,
    accent: "border-l-red-500",
    tint: "bg-red-50/50 dark:bg-red-500/[0.08]",
  },
  hired: {
    icon: Star,
    accent: "border-l-emerald-600",
    tint: "bg-emerald-50/70 dark:bg-emerald-500/[0.1]",
  },
};

function NextActionCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div
      className={cn(
        dashboardPanelInteractive,
        "border-l-[3px] border-l-amber-500 bg-gradient-to-r from-amber-50/80 to-white p-4 dark:from-amber-500/[0.1] dark:to-surface",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-amber-100/80 dark:bg-amber-500/15">
          <Clock className="h-4 w-4 text-amber-700 dark:text-amber-300" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-amber-800/80 dark:text-amber-300/90">
            Next expected action
          </p>
          <p className="mt-1 text-[14px] font-semibold leading-snug text-[#18181B] dark:text-text">
            {title}
          </p>
          <p className="mt-0.5 text-[12px] text-[#71717A] dark:text-text-muted">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({
  item,
  isLast,
}: {
  item: CandidateActivityItem;
  isLast: boolean;
}) {
  const config = KIND_CONFIG[item.kind];
  const Icon = config.icon;

  return (
    <li className="relative flex gap-3 pb-1">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:bg-surface",
          )}
        >
          <Icon className="h-3.5 w-3.5 text-[#71717A] dark:text-text-muted" strokeWidth={1.5} />
        </div>
        {!isLast ? (
          <span className="mt-1 w-px flex-1 min-h-[12px] bg-[rgba(15,23,42,0.1)] dark:bg-white/[0.1]" aria-hidden />
        ) : null}
      </div>

      <article
        className={cn(
          "mb-4 min-w-0 flex-1 rounded-[11px] border border-[rgba(15,23,42,0.06)] border-l-[3px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-[rgba(15,23,42,0.1)] dark:border-white/[0.06]",
          config.accent,
          config.tint,
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-[13px] font-semibold text-[#18181B] dark:text-text">{item.title}</p>
          <time className="shrink-0 text-[11px] tabular-nums text-[#A1A1AA]">{item.at}</time>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-[#52525B] dark:text-text-muted">
          {item.description}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-[#52525B] dark:bg-white/[0.06] dark:text-text-muted">
            <UserRound className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            {item.actor}
          </span>
        </div>
        {item.meta?.length ? (
          <dl className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-[rgba(15,23,42,0.06)] pt-2.5 dark:border-white/[0.06]">
            {item.meta.map((m) => (
              <div key={m.label} className="flex gap-1.5 text-[11px]">
                <dt className="text-[#A1A1AA]">{m.label}</dt>
                <dd className="font-medium text-[#52525B] dark:text-text-muted">{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </article>
    </li>
  );
}

function TimelineEmpty({ filter }: { filter: ActivityFilterId }) {
  const label = ACTIVITY_FILTERS.find((f) => f.id === filter)?.label ?? "activity";
  return (
    <div
      className={cn(
        dashboardPanelInteractive,
        "flex flex-col items-center justify-center px-6 py-12 text-center",
      )}
    >
      <Clock className="mb-3 h-8 w-8 text-[#D4D4D8]" strokeWidth={1.5} aria-hidden />
      <p className="text-[14px] font-medium text-[#18181B] dark:text-text">No {label.toLowerCase()} yet</p>
      <p className="mt-1 max-w-xs text-[12px] text-[#71717A] dark:text-text-muted">
        Try another filter or check back as the candidate progresses.
      </p>
    </div>
  );
}

export function CandidateTimelineTab({ candidate }: { candidate: HiringCandidate }) {
  const [filter, setFilter] = useState<ActivityFilterId>("all");

  const allActivities = useMemo(() => buildCandidateActivities(candidate), [candidate]);
  const filtered = useMemo(
    () => filterActivities(allActivities, filter),
    [allActivities, filter],
  );
  const groups = useMemo(() => groupActivitiesByDate(filtered), [filtered]);
  const nextAction = useMemo(() => getNextExpectedAction(candidate), [candidate]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold tracking-[-0.03em] text-[#18181B] dark:text-text">
            Candidate Timeline
          </h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[#71717A] dark:text-text-muted">
            Track every hiring activity, stage movement, interview update, feedback submission,
            recruiter interaction, and system event for this candidate.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as ActivityFilterId)}>
            <SelectTrigger className="h-9 w-[160px] rounded-[9px] text-[12px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_FILTERS.map((f) => (
                <SelectItem key={f.id} value={f.id} className="text-[12px]">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {nextAction ? <NextActionCard title={nextAction.title} detail={nextAction.detail} /> : null}

      {groups.length === 0 ? (
        <TimelineEmpty filter={filter} />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.label}>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A1A1AA]">
                {group.label}
              </h3>
              <ol className="relative">
                {group.items.map((item, index) => (
                  <ActivityCard
                    key={item.id}
                    item={item}
                    isLast={index === group.items.length - 1}
                  />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
