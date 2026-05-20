"use client";

import { cn } from "@/lib/utils";
import type { ScheduleAttemptStatus } from "@/lib/hiring/assessments/scheduleTypes";

const STYLES: Record<ScheduleAttemptStatus, string> = {
  "Not Started":
    "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] text-[#52525B] dark:bg-white/[0.06] dark:text-text-secondary",
  Started: "border-violet-400/25 bg-violet-500/[0.08] text-violet-800 dark:text-violet-200",
  Ongoing: "border-amber-400/25 bg-amber-500/[0.1] text-amber-900 dark:text-amber-200",
  Submitted: "border-sky-400/25 bg-sky-500/[0.08] text-sky-900 dark:text-sky-200",
  Evaluated: "border-emerald-400/25 bg-emerald-500/[0.1] text-emerald-900 dark:text-emerald-200",
  Expired: "border-red-400/25 bg-red-500/[0.08] text-red-800 dark:text-red-200",
};

export function ScheduleStatusPill({ status }: { status: ScheduleAttemptStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-[-0.01em]",
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
