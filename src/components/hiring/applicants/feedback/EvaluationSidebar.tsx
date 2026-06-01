"use client";

import { Minus, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  computeFeedbackCompletion,
  RECOMMENDATION_OPTIONS,
  type HireRecommendation,
  type InterviewerFeedbackData,
} from "@/lib/hiring/interviewFeedback";
import {
  CompletionProgress,
  MetaRow,
  RecommendationPills,
  SidebarCard,
} from "./FeedbackUi";

// ── Large recommendation display ──────────────────────────────

const REC_STYLES: Record<
  HireRecommendation,
  { bg: string; border: string; text: string; icon: string }
> = {
  strong_no_hire: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200/80 dark:border-red-700/40",
    text: "text-red-700 dark:text-red-400",
    icon: "Strongly not recommended",
  },
  no_hire: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200/80 dark:border-orange-700/40",
    text: "text-orange-700 dark:text-orange-400",
    icon: "Not recommended to proceed",
  },
  lean_hire: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200/80 dark:border-amber-700/40",
    text: "text-amber-700 dark:text-amber-400",
    icon: "Decision unclear — needs discussion",
  },
  hire: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200/80 dark:border-emerald-700/40",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: "Recommended to proceed",
  },
  strong_hire: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200/80 dark:border-green-700/40",
    text: "text-green-700 dark:text-green-400",
    icon: "Highly recommended to proceed",
  },
};

function LargeRecIcon({
  type,
  className,
}: {
  type: (typeof RECOMMENDATION_OPTIONS)[number]["icon"];
  className?: string;
}) {
  const sz = cn("h-11 w-11 shrink-0", className);
  if (type === "dbl_up")
    return (
      <span className="flex gap-0.5">
        <ThumbsUp className={sz} strokeWidth={1.5} />
        <ThumbsUp className={sz} strokeWidth={1.5} />
      </span>
    );
  if (type === "up") return <ThumbsUp className={sz} strokeWidth={1.5} />;
  if (type === "neutral") return <Minus className={sz} strokeWidth={1.5} />;
  if (type === "down") return <ThumbsDown className={sz} strokeWidth={1.5} />;
  return (
    <span className="flex gap-0.5">
      <ThumbsDown className={sz} strokeWidth={1.5} />
      <ThumbsDown className={sz} strokeWidth={1.5} />
    </span>
  );
}

function HiringRecommendationDisplay({
  value,
  submittedBy,
}: {
  value: HireRecommendation | null;
  submittedBy?: string;
}) {
  if (!value) {
    return (
      <div className="rounded-[12px] border border-dashed border-[rgba(15,23,42,0.1)] px-4 py-6 text-center dark:border-white/[0.08]">
        <p className="text-[13px] text-[#71717A]">No recommendation yet</p>
      </div>
    );
  }
  const opt = RECOMMENDATION_OPTIONS.find((o) => o.value === value);
  const style = REC_STYLES[value];
  if (!opt) return null;

  return (
    <div
      className={cn(
        "rounded-[14px] border px-4 pb-5 pt-5 text-center",
        style.bg,
        style.border,
      )}
    >
      <div className={cn("flex justify-center", style.text)}>
        <LargeRecIcon type={opt.icon} />
      </div>
      <p className={cn("mt-3 text-[21px] font-bold tracking-[-0.03em]", style.text)}>
        {opt.label}
      </p>
      <p className={cn("mt-1 text-[12px] font-medium opacity-70", style.text)}>
        {style.icon}
      </p>
      {submittedBy ? (
        <p className="mt-3 text-[11px] text-[#9CA3AF] dark:text-muted">
          Submitted by {submittedBy}
        </p>
      ) : null}
    </div>
  );
}

export function EvaluationSidebar({
  data,
  onChange,
  readOnly,
}: {
  data: InterviewerFeedbackData;
  onChange: (next: InterviewerFeedbackData) => void;
  readOnly?: boolean;
}) {
  const completion = computeFeedbackCompletion(data);

  return (
    <aside className="sticky top-0 flex w-full shrink-0 flex-col gap-2.5 self-start lg:w-[280px]">
      <SidebarCard title="Interview details">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.08)] bg-[#F4F4F5] text-[13px] font-semibold text-[#52525B]">
            {data.interviewerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || <User className="h-4 w-4" strokeWidth={1.5} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[#18181B] dark:text-text">{data.interviewerName}</p>
            <p className="text-[11px] text-[#71717A]">{data.interviewerRole}</p>
          </div>
        </div>
        <dl className="mt-3 space-y-1.5 border-t border-[rgba(15,23,42,0.06)] pt-3">
          <MetaRow label="Round" value={data.interviewRound} />
          <MetaRow label="Type" value={data.interviewType} />
          <MetaRow label="Date" value={data.interviewDate} />
          <MetaRow label="Duration" value={`${data.durationMinutes} min`} />
        </dl>
      </SidebarCard>

      <SidebarCard
        title="Hiring recommendation"
        className="ring-1 ring-[rgba(15,23,42,0.06)] dark:ring-white/[0.06]"
      >
        {readOnly ? (
          <HiringRecommendationDisplay
            value={data.recommendation}
            submittedBy={data.interviewerName || undefined}
          />
        ) : (
          <>
            {data.recommendation ? (
              <div className="mb-3">
                <HiringRecommendationDisplay value={data.recommendation} />
              </div>
            ) : null}
            <RecommendationPills
              value={data.recommendation}
              onChange={(recommendation) => onChange({ ...data, recommendation })}
              compact
            />
          </>
        )}
      </SidebarCard>

      <SidebarCard>
        <CompletionProgress value={completion} />
      </SidebarCard>
    </aside>
  );
}
