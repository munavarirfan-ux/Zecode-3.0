"use client";

import { getLiveAssessmentSummaries } from "@/lib/hiring/assessments/liveMonitoringData";
import { cn } from "@/lib/utils";
import { hiringCard } from "../hiringTokens";
import { LiveAssessmentCard } from "./LiveAssessmentCard";
import { LiveAssessmentListRow } from "./LiveAssessmentListRow";
import type { SchedulesViewMode } from "@/lib/hiring/assessments/scheduledAssessmentTypes";

export function LiveAssessmentsTab({ view }: { view: SchedulesViewMode }) {
  const assessments = getLiveAssessmentSummaries();

  if (assessments.length === 0) {
    return (
      <p className="rounded-[16px] border border-dashed border-[rgba(15,23,42,0.1)] bg-white px-6 py-12 text-center text-[13px] text-muted">
        No assessments are live right now.
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
          {assessments.map((summary) => (
            <LiveAssessmentCard key={summary.assessmentId} summary={summary} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(hiringCard, "overflow-hidden rounded-[14px]")}>
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_repeat(4,minmax(0,0.55fr))_minmax(0,0.75fr)_auto] gap-2 border-b bg-[#FAFAFB] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted dark:bg-white/[0.03]">
        <span>Assessment</span>
        <span>Role</span>
        <span className="text-right">Live</span>
        <span className="text-right">Idle</span>
        <span className="text-right">Flagged</span>
        <span>Window closes</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>
      {assessments.map((summary) => (
        <LiveAssessmentListRow key={summary.assessmentId} summary={summary} />
      ))}
    </div>
  );
}
