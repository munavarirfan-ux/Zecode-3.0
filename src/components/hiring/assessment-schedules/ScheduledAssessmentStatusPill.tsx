"use client";

import { cn } from "@/lib/utils";
import { statusPillClass } from "@/lib/hiring/assessments/scheduledAssessmentsData";
import type { ScheduledAssessmentStatus } from "@/lib/hiring/assessments/scheduledAssessmentTypes";

export function ScheduledAssessmentStatusPill({ status }: { status: ScheduledAssessmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.02em]",
        statusPillClass(status),
      )}
    >
      {status}
    </span>
  );
}
