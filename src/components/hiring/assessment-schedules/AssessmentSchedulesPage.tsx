"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  applyScheduleFilters,
  countByScheduleTab,
  EMPTY_SCHEDULE_FILTERS,
  filterByScheduleTab,
  sortSchedules,
  uniqueScheduleAssessments,
  uniqueScheduleDates,
  uniqueScheduleRecruiters,
  uniqueScheduleRoles,
  type ScheduleFilterState,
  type ScheduleSortKey,
} from "@/lib/hiring/assessments/scheduleFilters";
import {
  buildCalendarEvents,
  computeHeroMetrics,
  computeScheduleInsights,
} from "@/lib/hiring/assessments/mockAssessmentSchedules";
import {
  ASSESSMENT_SCHEDULES_UPDATED_EVENT,
  getAllSchedules,
  getLiveAttempts,
  getScheduleById,
  scheduleToCandidateRecord,
} from "@/lib/hiring/assessments/scheduleStore";
import type {
  AssessmentScheduleRecord,
  AssessmentScheduleTab,
  ScheduleCalendarEvent,
  ScheduleViewMode,
} from "@/lib/hiring/assessments/scheduleTypes";
import { getAssessmentById } from "@/lib/hiring/assessments/assessmentStore";
import type { AssessmentCandidateRecord, AssessmentRecord } from "@/lib/hiring/assessments/types";
import { DirectoryViewSwitcher } from "../directories/DirectoryViewSwitcher";
import { hiringCanvas } from "../hiringTokens";
import { AssessmentCandidateReportDialog } from "../assessments/AssessmentCandidateReportDialog";
import { AssessmentSchedulesHero } from "./AssessmentSchedulesHero";
import { AssessmentSchedulesInsightStrip } from "./AssessmentSchedulesInsightStrip";
import { AssessmentSchedulesTabs } from "./AssessmentSchedulesTabs";
import { AssessmentScheduleFiltersBar } from "./AssessmentScheduleFiltersBar";
import { AssessmentScheduleListView } from "./AssessmentScheduleListView";
import { AssessmentScheduleCalendarView } from "./AssessmentScheduleCalendarView";
import { AssessmentScheduleCalendarDrawer } from "./AssessmentScheduleCalendarDrawer";
import { LiveAttemptsPanel } from "./LiveAttemptsPanel";
import { ScheduleAssessmentDialog } from "./ScheduleAssessmentDialog";
import { BulkScheduleDialog } from "./BulkScheduleDialog";

export function AssessmentSchedulesPage() {
  const [refresh, setRefresh] = useState(0);
  const [tab, setTab] = useState<AssessmentScheduleTab>("upcoming");
  const [view, setView] = useState<ScheduleViewMode>("list");
  const [filters, setFilters] = useState<ScheduleFilterState>(EMPTY_SCHEDULE_FILTERS);
  const [sort, setSort] = useState<ScheduleSortKey>("expiry");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState<ScheduleCalendarEvent | null>(null);
  const [reportCandidate, setReportCandidate] = useState<AssessmentCandidateRecord | null>(null);
  const [reportAssessment, setReportAssessment] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    const h = () => setRefresh((n) => n + 1);
    window.addEventListener(ASSESSMENT_SCHEDULES_UPDATED_EVENT, h);
    return () => window.removeEventListener(ASSESSMENT_SCHEDULES_UPDATED_EVENT, h);
  }, []);

  const all = useMemo(() => getAllSchedules(), [refresh]);
  const liveAttempts = useMemo(() => getLiveAttempts(), [refresh]);
  const tabCounts = useMemo(() => countByScheduleTab(all), [all]);
  const heroMetrics = useMemo(() => computeHeroMetrics(all), [all]);
  const insights = useMemo(() => computeScheduleInsights(all), [all]);
  const calendarEvents = useMemo(() => buildCalendarEvents(all), [all]);

  const filtered = useMemo(() => {
    const byTab = filterByScheduleTab(all, tab);
    const byFilters = applyScheduleFilters(byTab, filters);
    return sortSchedules(byFilters, sort);
  }, [all, tab, filters, sort]);

  const roles = useMemo(() => uniqueScheduleRoles(all), [all]);
  const assessments = useMemo(() => uniqueScheduleAssessments(all), [all]);
  const recruiters = useMemo(() => uniqueScheduleRecruiters(all), [all]);
  const dates = useMemo(() => uniqueScheduleDates(all), [all]);

  const showLivePanel = tab === "ongoing" || tab === "upcoming";

  function openReportForSchedule(schedule: AssessmentScheduleRecord) {
    const assessment = getAssessmentById(schedule.assessmentId);
    const candidate = scheduleToCandidateRecord(schedule);
    if (!assessment || !candidate) {
      toast.error("Could not open report for this schedule");
      return;
    }
    setReportAssessment(assessment);
    setReportCandidate(candidate);
  }

  function openReportByScheduleId(scheduleId: string) {
    const schedule = getScheduleById(scheduleId);
    if (schedule) openReportForSchedule(schedule);
  }

  return (
    <div className={hiringCanvas}>
      <div className="mx-auto max-w-shell space-y-5 pb-12 sm:space-y-6">
        <AssessmentSchedulesHero
          metrics={heroMetrics}
          onSchedule={() => setScheduleOpen(true)}
          onBulkSchedule={() => setBulkOpen(true)}
          onExport={() => toast.message("Export schedules (demo)")}
        />

        <AssessmentSchedulesInsightStrip insights={insights} />

        <div className="space-y-3">
          <AssessmentSchedulesTabs tab={tab} onTabChange={setTab} tabCounts={tabCounts} />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <DirectoryViewSwitcher
              value={view}
              onChange={setView}
              options={[
                { value: "list", label: "List View", icon: "list" },
                { value: "calendar", label: "Calendar View", icon: "grid" },
              ]}
            />
          </div>

          {showLivePanel ? (
            <LiveAttemptsPanel attempts={liveAttempts} onViewReport={openReportByScheduleId} />
          ) : null}

          {view === "list" ? (
            <div className="space-y-3">
              <AssessmentScheduleFiltersBar
                filters={filters}
                onFiltersChange={setFilters}
                sort={sort}
                onSortChange={setSort}
                roles={roles}
                assessments={assessments}
                recruiters={recruiters}
                dates={dates}
              />
              <div className="animate-in fade-in-0 duration-300">
                <AssessmentScheduleListView
                  tab={tab}
                  rows={filtered}
                  onOpenReport={openReportForSchedule}
                  onSchedule={tab === "upcoming" ? () => setScheduleOpen(true) : undefined}
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in-0 duration-300">
              <AssessmentScheduleCalendarView
                events={calendarEvents}
                onSelectEvent={(evt) => {
                  setCalendarEvent(evt);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <ScheduleAssessmentDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        onScheduled={() => setRefresh((n) => n + 1)}
      />
      <BulkScheduleDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        onScheduled={() => setRefresh((n) => n + 1)}
      />
      <AssessmentScheduleCalendarDrawer
        event={calendarEvent}
        open={calendarEvent != null}
        onOpenChange={(o) => !o && setCalendarEvent(null)}
        onViewReport={() => {
          if (calendarEvent) openReportForSchedule(calendarEvent.schedule);
          setCalendarEvent(null);
        }}
        onExtendTime={() => toast.message("Extend time (demo)")}
      />
      {reportAssessment && reportCandidate ? (
        <AssessmentCandidateReportDialog
          open
          onOpenChange={(o) => {
            if (!o) {
              setReportCandidate(null);
              setReportAssessment(null);
            }
          }}
          assessment={reportAssessment}
          candidate={reportCandidate}
        />
      ) : null}
    </div>
  );
}
