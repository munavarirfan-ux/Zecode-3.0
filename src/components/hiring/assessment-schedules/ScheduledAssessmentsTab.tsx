"use client";

import type { ScheduledAssessmentRecord } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import type { SchedulesViewMode } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { cn } from "@/lib/utils";
import { hiringCard } from "../hiringTokens";
import { ScheduledAssessmentCard } from "./ScheduledAssessmentCard";
import { ScheduledAssessmentListRow } from "./ScheduledAssessmentListRow";

export function ScheduledAssessmentsTab({
  rows,
  view,
}: {
  rows: ScheduledAssessmentRecord[];
  view: SchedulesViewMode;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-[16px] border border-dashed border-[rgba(15,23,42,0.1)] bg-white px-6 py-12 text-center text-[13px] text-muted">
        No scheduled assessments yet. Use Schedule Assessment to create one.
      </p>
    );
  }

  if (view === "grid") {
    return (
      <div
        className={cn(
          hiringCard,
          "overflow-hidden !rounded-[14px] !p-0",
          "border-[rgba(15,23,42,0.05)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
        )}
      >
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 lg:p-5">
          {rows.map((record) => (
            <ScheduledAssessmentCard key={record.id} record={record} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(hiringCard, "overflow-hidden rounded-[14px]")}>
      <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)_minmax(0,0.7fr)_minmax(0,0.65fr)_minmax(0,0.55fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,0.7fr)_auto] gap-2 border-b bg-[#FAFAFB] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted dark:bg-white/[0.03]">
        <span>Assessment</span>
        <span>Role</span>
        <span>Scheduled date</span>
        <span>Scheduled time</span>
        <span className="text-right">Candidates</span>
        <span>Instruction email</span>
        <span>Reminder status</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>
      {rows.map((record) => (
        <ScheduledAssessmentListRow key={record.id} record={record} />
      ))}
    </div>
  );
}
