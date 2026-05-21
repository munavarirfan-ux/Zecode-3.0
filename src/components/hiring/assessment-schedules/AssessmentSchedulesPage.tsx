"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getLiveAssessmentSummaries,
  getLiveMonitoringOverviewStats,
} from "@/lib/hiring/assessments/liveMonitoringData";
import {
  getScheduledAssessments,
  SCHEDULED_ASSESSMENTS_UPDATED_EVENT,
} from "@/lib/hiring/assessments/scheduledAssessmentsData";
import type {
  AssessmentSchedulesTab,
  SchedulesViewMode,
} from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { hiringCanvas } from "../hiringTokens";
import { AssessmentSchedulesHero } from "./AssessmentSchedulesHero";
import { AssessmentSchedulesToolbar } from "./AssessmentSchedulesToolbar";
import { LiveAssessmentsTab } from "./LiveAssessmentsTab";
import { ScheduledAssessmentsTab } from "./ScheduledAssessmentsTab";
import { ScheduleAssessmentDialog } from "./ScheduleAssessmentDialog";

export function AssessmentSchedulesPage() {
  const [tab, setTab] = useState<AssessmentSchedulesTab>("live");
  const [liveView, setLiveView] = useState<SchedulesViewMode>("grid");
  const [scheduledView, setScheduledView] = useState<SchedulesViewMode>("grid");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const onUpdate = () => setRefresh((n) => n + 1);
    window.addEventListener(SCHEDULED_ASSESSMENTS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(SCHEDULED_ASSESSMENTS_UPDATED_EVENT, onUpdate);
  }, []);

  const liveCount = getLiveAssessmentSummaries().length;
  const scheduledRows = useMemo(() => getScheduledAssessments(), [refresh]);
  const heroStats = useMemo(() => getLiveMonitoringOverviewStats(), [refresh]);

  const activeView = tab === "live" ? liveView : scheduledView;
  const setActiveView = tab === "live" ? setLiveView : setScheduledView;

  return (
    <div className={hiringCanvas}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(15,61,46,0.04),transparent)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(167,243,208,0.035),transparent)]"
        aria-hidden
      />
      <div className="relative w-full min-w-0 space-y-5 pb-12">
        <AssessmentSchedulesHero
          stats={heroStats}
          scheduledCount={scheduledRows.length}
          onSchedule={() => setScheduleOpen(true)}
        />

        <AssessmentSchedulesToolbar
          tab={tab}
          onTabChange={setTab}
          liveCount={liveCount}
          scheduledCount={scheduledRows.length}
          view={activeView}
          onViewChange={setActiveView}
        />

        {tab === "live" ? (
          <LiveAssessmentsTab view={liveView} />
        ) : (
          <ScheduledAssessmentsTab rows={scheduledRows} view={scheduledView} />
        )}

        <ScheduleAssessmentDialog
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          onScheduled={() => {
            setRefresh((n) => n + 1);
            setTab("scheduled");
          }}
        />
      </div>
    </div>
  );
}
