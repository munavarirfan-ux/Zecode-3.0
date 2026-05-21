"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  LayoutGrid,
  MessageSquare,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/RoleContext";
import { CandidateReportDialog } from "@/components/hiring/applicants/CandidateReportDialog";
import { HeroMetricsCollapsible } from "@/components/hiring/HeroMetricsCollapsible";
import { HiringHeroSelectableKpiCard } from "@/components/hiring/HiringHeroSelectableKpiCard";
import { HiringPageHero } from "@/components/hiring/HiringPageHero";
import { hiringCanvas, hiringCard } from "@/components/hiring/hiringTokens";
import { dashboardIntelligenceBorder } from "@/components/dashboard/dashboardTokens";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import {
  buildInterviewerAssignedInterviews,
  countByFilter,
  filterInterviewerInterviews,
  getNextInterviewToday,
  type InterviewerAssignedInterviewRow,
  type InterviewerInterviewFilter,
} from "@/lib/hiring/interviewerInterviews";
import { getJobById } from "@/lib/hiring/mockData";
import { submitRescheduleRequest } from "@/lib/hiring/rescheduleRequests";
import { InterviewerInterviewListRow } from "./InterviewerInterviewListRow";
import { RequestRescheduleDialog } from "./RequestRescheduleDialog";
import { InterviewerTodaySchedulePanel } from "./InterviewerTodaySchedulePanel";

const FILTERS: {
  id: InterviewerInterviewFilter;
  label: string;
  subtitle: string;
  icon: typeof LayoutGrid;
}[] = [
  { id: "all", label: "All", subtitle: "Assigned to you", icon: LayoutGrid },
  { id: "today", label: "Today", subtitle: "On your calendar", icon: Calendar },
  { id: "upcoming", label: "Upcoming", subtitle: "Scheduled ahead", icon: Clock },
  { id: "ongoing", label: "Ongoing", subtitle: "In progress now", icon: Radio },
  { id: "completed", label: "Completed", subtitle: "Panels finished", icon: CheckCircle2 },
  { id: "feedback-pending", label: "Feedback pending", subtitle: "Awaiting your review", icon: MessageSquare },
  { id: "reschedule-requested", label: "Reschedule requested", subtitle: "Needs coordination", icon: CalendarClock },
];

export function InterviewerInterviewsWorkspace() {
  const { selectedRole } = useRole();
  const { data: session } = useSession();
  const [filter, setFilter] = useState<InterviewerInterviewFilter>("all");
  const [reportCandidateId, setReportCandidateId] = useState<string | null>(null);
  const [rescheduleRow, setRescheduleRow] = useState<InterviewerAssignedInterviewRow | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const allRows = useMemo(
    () => buildInterviewerAssignedInterviews(selectedRole, session?.user?.name),
    [selectedRole, session?.user?.name, refreshKey],
  );

  const counts = useMemo(() => countByFilter(allRows), [allRows]);
  const filtered = useMemo(
    () => filterInterviewerInterviews(allRows, filter, ""),
    [allRows, filter],
  );
  const nextToday = useMemo(() => getNextInterviewToday(allRows), [allRows]);

  const reportRow = reportCandidateId
    ? allRows.find((r) => r.candidateId === reportCandidateId) ?? null
    : null;
  const reportAssignment = reportRow
    ? {
        round: reportRow.round,
        scheduledAt: reportRow.scheduledAt,
        status:
          reportRow.interviewStatus === "Completed"
            ? ("Completed" as const)
            : reportRow.interviewStatus === "Ongoing"
              ? ("Scheduled" as const)
              : ("Scheduled" as const),
      }
    : undefined;
  const reportCandidate = reportRow?.candidate ?? null;
  const reportJob = reportRow ? getJobById(reportRow.jobId) : undefined;

  function handleRescheduleSubmit(payload: {
    reason: string;
    preferredDates: string;
    preferredTimes: string;
    notifyTeam: boolean;
  }) {
    if (!rescheduleRow) return;
    submitRescheduleRequest({
      interviewRowId: rescheduleRow.id,
      reason: payload.reason,
      preferredDates: payload.preferredDates || undefined,
      preferredTimes: payload.preferredTimes || undefined,
      notifyTeam: payload.notifyTeam,
      requestedAt: new Date().toISOString(),
    });
    setRefreshKey((k) => k + 1);
    toast.success("Reschedule request submitted to Admin.", {
      description: `${rescheduleRow.candidate.name} · ${rescheduleRow.round}`,
    });
    setRescheduleRow(null);
  }

  return (
    <div className={hiringCanvas}>
      <div className="relative w-full min-w-0 space-y-6 pb-14">
        <HiringPageHero
          title="My interviews"
          subtitle="Manage your assigned interviews and upcoming schedules."
          collapsedMeta="Manage your assigned interviews and upcoming schedules."
          aria-label="My interviews"
          heroCollapseStorageKey="interviewer-interviews"
        >
          <HeroMetricsCollapsible
            id="interviewer-interviews-hero-metrics"
            withBorder={false}
            storageKey="interviewer-interviews-hero-metrics-collapsed"
            gridClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7"
          >
            {FILTERS.map((f) => {
              const count =
                f.id === "all"
                  ? allRows.length
                  : f.id === "today"
                    ? counts.today
                    : f.id === "upcoming"
                      ? counts.upcoming
                      : f.id === "ongoing"
                        ? counts.ongoing
                        : f.id === "completed"
                          ? counts.completed
                          : f.id === "feedback-pending"
                            ? counts.feedbackPending
                            : counts.rescheduleRequested;
              return (
                <HiringHeroSelectableKpiCard
                  key={f.id}
                  label={f.label}
                  value={count}
                  subtitle={f.subtitle}
                  icon={f.icon}
                  active={filter === f.id}
                  onSelect={() => setFilter(f.id)}
                />
              );
            })}
          </HeroMetricsCollapsible>
        </HiringPageHero>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-4">
            {filtered.length === 0 ? (
              <div
                className={cn(
                  hiringCard,
                  dashboardIntelligenceBorder,
                  "border-dashed px-6 py-16 text-center",
                )}
              >
                <p className="text-[15px] font-semibold text-text">No interviews assigned this week.</p>
                <p className="mt-2 text-[12px] text-text-secondary">
                  When panels are assigned to you, they appear here for prep, conduct, and feedback.
                </p>
                <Button asChild className="mt-5 h-9 rounded-[10px] bg-accent text-white hover:bg-accent-hover">
                  <Link href={ROUTES.mySchedule}>
                    <Calendar className="mr-1.5 h-4 w-4" strokeWidth={1.75} aria-hidden />
                    View upcoming schedule
                  </Link>
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  hiringCard,
                  dashboardIntelligenceBorder,
                  "divide-y divide-[rgba(15,23,42,0.05)] overflow-hidden rounded-[14px]",
                )}
              >
                {filtered.map((row) => (
                  <InterviewerInterviewListRow
                    key={row.id}
                    row={row}
                    onViewCandidate={() => setReportCandidateId(row.candidateId)}
                    onRequestReschedule={() => setRescheduleRow(row)}
                    onSubmitFeedback={() => setReportCandidateId(row.candidateId)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full shrink-0 lg:w-[280px]">
            <InterviewerTodaySchedulePanel nextInterview={nextToday} />
          </div>
        </div>
      </div>

      {reportJob ? (
        <CandidateReportDialog
          candidate={reportCandidate}
          job={reportJob}
          reportContext="job"
          focusRound={reportRow?.round}
          interviewerAssignment={reportAssignment}
          open={reportCandidate !== null}
          onOpenChange={(open) => !open && setReportCandidateId(null)}
          initialTab="overview"
        />
      ) : null}

      <RequestRescheduleDialog
        open={rescheduleRow !== null}
        onOpenChange={(open) => !open && setRescheduleRow(null)}
        row={rescheduleRow}
        onSubmit={handleRescheduleSubmit}
      />
    </div>
  );
}
