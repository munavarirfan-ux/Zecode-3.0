"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useLiveMonitoringSessions } from "@/hooks/useLiveMonitoringSessions";
import {
  countByStatus,
  filterLiveCandidates,
  getLiveAssessmentSummary,
} from "@/lib/hiring/assessments/liveMonitoringData";
import type { LiveCandidateSession, LiveMonitorFilter } from "@/lib/hiring/assessments/liveMonitoringTypes";
import type { SchedulesViewMode } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { hiringCanvas } from "../hiringTokens";
import { LiveAssessmentCandidateReportDialog } from "./LiveAssessmentCandidateReportDialog";
import { LiveAssessmentMonitorHero } from "./LiveAssessmentMonitorHero";
import { LiveCandidatesPanel } from "./LiveCandidatesPanel";

const FILTER_PARAM_VALUES = new Set<LiveMonitorFilter>(["all", "live", "idle", "flagged"]);

function initialFilterFromSearch(params: URLSearchParams | null): LiveMonitorFilter {
  const raw = params?.get("filter");
  if (raw && FILTER_PARAM_VALUES.has(raw as LiveMonitorFilter)) {
    return raw as LiveMonitorFilter;
  }
  return "all";
}

export function LiveAssessmentMonitorPage({ assessmentId }: { assessmentId: string }) {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<LiveMonitorFilter>(() =>
    initialFilterFromSearch(searchParams),
  );
  const [view, setView] = useState<SchedulesViewMode>("grid");
  const [reportCandidateId, setReportCandidateId] = useState<string | null>(null);

  const { candidates: allCandidates } = useLiveMonitoringSessions(assessmentId);
  const summary = getLiveAssessmentSummary(assessmentId);
  const counts = useMemo(() => countByStatus(allCandidates), [allCandidates]);
  const filtered = useMemo(() => filterLiveCandidates(allCandidates, filter), [allCandidates, filter]);

  const openReport = (c: LiveCandidateSession) => setReportCandidateId(c.id);

  if (!summary) {
    return (
      <div className={hiringCanvas}>
        <div className="w-full min-w-0 py-16 text-center">
          <p className="text-[15px] font-semibold text-text">Assessment not found</p>
          <Link href={ROUTES.schedules} className="mt-3 inline-block text-[13px] font-medium text-accent">
            Back to Assessment Drive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={hiringCanvas}>
      <div className="w-full min-w-0 space-y-5 pb-12">
        <LiveAssessmentMonitorHero summary={summary} counts={counts} />

        <LiveCandidatesPanel
          candidates={filtered}
          filter={filter}
          onFilterChange={setFilter}
          counts={counts}
          view={view}
          onViewChange={setView}
          onSelectCandidate={openReport}
        />
      </div>

      <LiveAssessmentCandidateReportDialog
        open={reportCandidateId != null}
        onOpenChange={(o) => !o && setReportCandidateId(null)}
        assessmentId={assessmentId}
        candidateId={reportCandidateId}
      />
    </div>
  );
}
