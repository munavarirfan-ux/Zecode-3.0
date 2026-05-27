"use client";

import { cn } from "@/lib/utils";
import type { InterviewOperationalStatus } from "@/lib/hiring/interviewKanbanOps";

const STATUS_STYLES: Record<
  InterviewOperationalStatus,
  { bg: string; text: string; border: string }
> = {
  Scheduled: {
    bg: "bg-blue-500/[0.08] dark:bg-blue-400/10",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-500/15 dark:border-blue-400/20",
  },
  Pending: {
    bg: "bg-orange-500/[0.08] dark:bg-orange-400/10",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-500/15 dark:border-orange-400/20",
  },
  Ongoing: {
    bg: "bg-violet-500/[0.1] dark:bg-violet-400/12",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-500/18 dark:border-violet-400/22",
  },
  Completed: {
    bg: "bg-emerald-500/[0.08] dark:bg-emerald-400/10",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-500/15 dark:border-emerald-400/20",
  },
  "Feedback Pending": {
    bg: "bg-amber-500/[0.1] dark:bg-amber-400/12",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-500/18 dark:border-amber-400/22",
  },
  Rescheduled: {
    bg: "bg-amber-500/[0.12] dark:bg-amber-400/14",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-500/22 dark:border-amber-400/26",
  },
  Rejected: {
    bg: "bg-red-500/[0.1] dark:bg-red-400/12",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-500/18 dark:border-red-400/22",
  },
  "No Show": {
    bg: "bg-zinc-500/[0.1] dark:bg-zinc-400/12",
    text: "text-zinc-600 dark:text-zinc-300",
    border: "border-zinc-400/20 dark:border-zinc-500/25",
  },
  Cancelled: {
    bg: "bg-red-500/[0.06] dark:bg-red-400/08",
    text: "text-red-600/90 dark:text-red-300/90",
    border: "border-red-500/12 dark:border-red-400/16",
  },
  Qualified: {
    bg: "bg-emerald-500/[0.12] dark:bg-emerald-400/14",
    text: "text-emerald-800 dark:text-emerald-200",
    border: "border-emerald-500/20 dark:border-emerald-400/24",
  },
  "Moved to Next Stage": {
    bg: "bg-sky-500/[0.08] dark:bg-sky-400/10",
    text: "text-sky-800 dark:text-sky-200",
    border: "border-sky-500/15 dark:border-sky-400/20",
  },
};

export function InterviewStatusChip({ status }: { status: InterviewOperationalStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex max-w-[9.5rem] items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none",
        s.bg,
        s.text,
        s.border,
      )}
      title={status}
    >
      {status === "Ongoing" ? (
        <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500/60 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
        </span>
      ) : null}
      <span className="truncate">{status}</span>
    </span>
  );
}
