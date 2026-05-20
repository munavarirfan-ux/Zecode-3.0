"use client";

import { PremiumEmptyState } from "@/components/onboarding/PremiumEmptyState";
import { cn } from "@/lib/utils";
import type { AssessmentScheduleRecord, AssessmentScheduleTab } from "@/lib/hiring/assessments/scheduleTypes";
import { hiringCard } from "../hiringTokens";
import { AssessmentScheduleRow } from "./AssessmentScheduleRow";

const EMPTY: Record<
  AssessmentScheduleTab,
  { headline: string; subtext: string; cta?: string; illustration: "calendar" | "assessments" | "candidates" }
> = {
  upcoming: {
    headline: "No assessments scheduled yet",
    subtext: "Schedule an assessment to start inviting candidates.",
    cta: "Schedule Assessment",
    illustration: "calendar",
  },
  ongoing: {
    headline: "No live attempts right now",
    subtext: "Candidates actively taking assessments will appear here.",
    illustration: "assessments",
  },
  completed: {
    headline: "No completed attempts",
    subtext: "Submitted and evaluated attempts will show up in this view.",
    illustration: "assessments",
  },
  expired: {
    headline: "No expired schedules",
    subtext: "Expired invitation windows will appear here.",
    illustration: "candidates",
  },
  drafts: {
    headline: "No draft schedules",
    subtext: "Save bulk or single schedules as drafts before sending invites.",
    illustration: "assessments",
  },
};

export function AssessmentScheduleListView({
  tab,
  rows,
  onOpenReport,
  onSchedule,
}: {
  tab: AssessmentScheduleTab;
  rows: AssessmentScheduleRecord[];
  onOpenReport: (row: AssessmentScheduleRecord) => void;
  onSchedule?: () => void;
}) {
  if (rows.length === 0) {
    const e = EMPTY[tab];
    return (
      <PremiumEmptyState
        illustration={e.illustration}
        headline={e.headline}
        subtext={e.subtext}
        ctaLabel={e.cta}
        onCtaClick={e.cta ? onSchedule : undefined}
      />
    );
  }

  return (
    <div className={cn(hiringCard, "overflow-hidden p-0")}>
      <div
        className="hidden border-b border-[rgba(15,23,42,0.06)] bg-[#FAFAFB]/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted lg:grid dark:bg-white/[0.02]"
        style={{
          gridTemplateColumns:
            "minmax(200px,1.1fr) minmax(160px,0.9fr) minmax(140px,0.8fr) auto minmax(100px,0.6fr) minmax(88px,0.5fr) minmax(72px,0.4fr) 40px",
        }}
      >
        <span>Candidate</span>
        <span>Assessment</span>
        <span>Schedule</span>
        <span>Status</span>
        <span>Progress</span>
        <span>Signals</span>
        <span className="text-right">Score</span>
        <span />
      </div>
      <div className="divide-y-0">
        {rows.map((row) => (
          <AssessmentScheduleRow key={row.id} schedule={row} onOpenReport={() => onOpenReport(row)} />
        ))}
      </div>
    </div>
  );
}
