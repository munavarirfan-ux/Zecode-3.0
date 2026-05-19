"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarPlus,
  Code2,
  FileText,
  Mic,
  Star,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/RoleContext";
import type { CandidateInterview, HiringCandidate, HiringJob } from "@/lib/hiring/types";
import {
  enrichInterviewDefaults,
  formatFeedbackRequestedLabel,
  getFeedbackCounts,
  groupCandidateInterviews,
} from "@/lib/hiring/candidateInterviews";
import { canRequestFeedback, getPreviewActorLabel } from "@/lib/hiring/feedbackPermissions";
import type { CandidateInterviewFlowActions } from "./useCandidateInterviewScheduling";
import {
  getInterviewFeedback,
  submitFeedbackRequest,
  type InterviewFeedbackBundle,
} from "@/lib/hiring/interviewFeedback";
import { cn } from "@/lib/utils";
import { RequestFeedbackModal } from "./feedback/RequestFeedbackModal";
import { dashboardPanelInteractive } from "@/components/dashboard/dashboardTokens";

const STATUS_STYLES = {
  Scheduled: "border-blue-200/80 bg-blue-50/90 text-blue-800 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300",
  Completed:
    "border-emerald-200/80 bg-emerald-50/90 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
  Cancelled: "border-red-200/80 bg-red-50/90 text-red-800 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300",
  "Pending feedback":
    "border-amber-200/80 bg-amber-50/90 text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200",
} as const;

function InterviewerChips({ names }: { names: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {names.map((name) => (
        <span
          key={name}
          className="inline-flex items-center rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-2 py-0.5 text-[11px] font-medium text-[#52525B] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-text-muted"
        >
          {name.split(" ")[0]}
        </span>
      ))}
    </div>
  );
}

function ArtifactPills({ interview }: { interview: CandidateInterview }) {
  const pills: { label: string; icon: typeof FileText }[] = [];
  if (interview.hasNotes) pills.push({ label: "Notes", icon: FileText });
  if (interview.hasRecording) pills.push({ label: "Recording", icon: Mic });
  if (interview.hasCodeChallenge) pills.push({ label: "Code challenge", icon: Code2 });
  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {pills.map(({ label, icon: Icon }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 rounded-md bg-[#F4F4F5] px-1.5 py-0.5 text-[10px] font-medium text-[#71717A] dark:bg-white/[0.05] dark:text-text-muted"
        >
          <Icon className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          {label}
        </span>
      ))}
    </div>
  );
}

function UpcomingInterviewCard({
  interview,
  bundle,
  canRequest,
  canSchedule,
  feedbackRequestedLabel,
  onRequestFeedback,
  onOpen,
  onReschedule,
  onCancel,
}: {
  interview: CandidateInterview;
  bundle: InterviewFeedbackBundle;
  canRequest: boolean;
  canSchedule: boolean;
  feedbackRequestedLabel: string | null;
  onRequestFeedback: () => void;
  onOpen: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  return (
    <article
      className={cn(
        dashboardPanelInteractive,
        "group p-4 transition-[border-color,box-shadow] duration-150 hover:border-[rgba(15,23,42,0.1)] hover:shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[15px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
            {interview.round}
          </h4>
          <p className="mt-1 text-[13px] text-[#52525B] dark:text-text-muted">{interview.scheduledAt}</p>
          <p className="mt-0.5 text-[12px] text-[#71717A]">
            {interview.durationMinutes} min · {interview.platform}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
            STATUS_STYLES.Scheduled,
          )}
        >
          Scheduled
        </span>
      </div>

      <div className="mt-4 space-y-3 border-t border-[rgba(15,23,42,0.06)] pt-4 dark:border-white/[0.06]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#A1A1AA]">Interviewers</p>
          <div className="mt-1.5">
            <InterviewerChips names={interview.interviewers} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#71717A]">
          <Video className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          {interview.interviewType}
        </div>
        <ArtifactPills interview={interview} />
      </div>

      {feedbackRequestedLabel || interview.feedbackRequestedAt ? (
        <p className="mt-3 text-[12px] font-medium text-blue-700 dark:text-blue-300">
          {interview.feedbackRequestedAt ?? feedbackRequestedLabel}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" className="h-8 rounded-[9px] px-3 text-[12px]" onClick={onOpen}>
          {interview.meetUrl ? "Join meeting" : "View schedule"}
        </Button>
        {canSchedule ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-[9px] px-3 text-[12px]"
              onClick={onReschedule}
            >
              Reschedule
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-[9px] px-3 text-[12px] text-red-600 hover:text-red-700 dark:text-red-400"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </>
        ) : null}
        {canRequest && bundle.status !== "submitted" ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-[9px] px-3 text-[12px]"
            onClick={onRequestFeedback}
          >
            Request feedback
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function CompletedInterviewCard({
  interview,
  canRequest,
  feedbackRequestedLabel,
  onRequestFeedback,
  onOpenFeedback,
  onViewNotes,
}: {
  interview: CandidateInterview;
  canRequest: boolean;
  feedbackRequestedLabel: string | null;
  onRequestFeedback: () => void;
  onOpenFeedback: () => void;
  onViewNotes: () => void;
}) {
  const { submitted, pending } = getFeedbackCounts(interview);
  const pendingFeedback = interview.feedbackStatus === "Pending" || pending > 0;

  return (
    <article
      className={cn(
        dashboardPanelInteractive,
        "group p-4 transition-[border-color,box-shadow] duration-150 hover:border-[rgba(15,23,42,0.1)] hover:shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[15px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
            {interview.round}
          </h4>
          <p className="mt-1 text-[12px] text-[#71717A]">Completed · {interview.scheduledAt.split("·")[0]?.trim()}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
            pendingFeedback ? STATUS_STYLES["Pending feedback"] : STATUS_STYLES.Completed,
          )}
        >
          {pendingFeedback ? "Pending feedback" : "Completed"}
        </span>
      </div>

      <div className="mt-4 grid gap-4 border-t border-[rgba(15,23,42,0.06)] pt-4 sm:grid-cols-2 dark:border-white/[0.06]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#A1A1AA]">Interviewers</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {interview.interviewers.map((name) => (
              <span key={name} className="text-[12px] font-medium text-[#52525B] dark:text-text-muted">
                {name}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#A1A1AA]">Feedback</p>
          <p className="mt-1 text-[13px] font-medium text-[#18181B] dark:text-text">
            <span className="text-emerald-700 dark:text-emerald-400">{submitted} Submitted</span>
            {pending > 0 ? (
              <>
                <span className="mx-1.5 text-[#D4D4D8]">·</span>
                <span className="text-amber-700 dark:text-amber-300">{pending} Pending</span>
              </>
            ) : null}
          </p>
        </div>
        {interview.result ? (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#A1A1AA]">Recommendation</p>
            <p className="mt-1 text-[13px] font-semibold text-[#18181B] dark:text-text">{interview.result}</p>
          </div>
        ) : null}
        {interview.overallRating != null ? (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#A1A1AA]">Overall rating</p>
            <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-[#18181B] dark:text-text">
              {interview.overallRating}
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <ArtifactPills interview={interview} />
      </div>

      {(feedbackRequestedLabel || interview.feedbackRequestedAt) && pendingFeedback ? (
        <p className="mt-3 text-[12px] font-medium text-blue-700 dark:text-blue-300">
          {interview.feedbackRequestedAt ?? feedbackRequestedLabel}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" className="h-8 rounded-[9px] px-3 text-[12px]" onClick={onOpenFeedback}>
          Open feedback
        </Button>
        {interview.hasNotes ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-[9px] px-3 text-[12px]"
            onClick={onViewNotes}
          >
            View notes
          </Button>
        ) : null}
        {canRequest && pendingFeedback ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-[9px] px-3 text-[12px]"
            onClick={onRequestFeedback}
          >
            Request feedback
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function InterviewsEmptyState({
  canSchedule,
  onSchedule,
}: {
  canSchedule: boolean;
  onSchedule: () => void;
}) {
  return (
    <div
      className={cn(
        dashboardPanelInteractive,
        "flex flex-col items-center justify-center px-6 py-14 text-center",
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5] dark:bg-white/[0.06]">
        <Calendar className="h-6 w-6 text-[#A1A1AA]" strokeWidth={1.5} aria-hidden />
      </div>
      <p className="text-[15px] font-semibold text-[#18181B] dark:text-text">No interviews scheduled yet</p>
      <p className="mt-1 max-w-sm text-[13px] text-[#71717A] dark:text-text-muted">
        {canSchedule
          ? "Schedule the first conversation to start tracking this candidate's interview journey."
          : "No interviews have been scheduled for this candidate yet."}
      </p>
      {canSchedule ? (
        <Button type="button" size="sm" className="mt-5 h-9 gap-1.5 rounded-[9px] px-4" onClick={onSchedule}>
          <CalendarPlus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Schedule first interview
        </Button>
      ) : null}
    </div>
  );
}

export function CandidateInterviewsTab({
  candidate,
  job,
  onOpenFeedback,
  interviewFlows,
}: {
  candidate: HiringCandidate;
  job: HiringJob;
  onOpenFeedback?: () => void;
  interviewFlows: CandidateInterviewFlowActions;
}) {
  const { selectedRole } = useRole();
  const canRequest = canRequestFeedback(selectedRole);
  const { canSchedule, openSchedule, openReschedule, openCancel, openViewSchedule } = interviewFlows;
  const actorName = getPreviewActorLabel(selectedRole);

  const [bundle, setBundle] = useState(() => getInterviewFeedback(candidate));
  const [requestOpen, setRequestOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const interviews = useMemo(
    () => candidate.interviews.map(enrichInterviewDefaults),
    [candidate.interviews],
  );
  const { upcoming, completed, cancelled } = useMemo(() => groupCandidateInterviews(interviews), [interviews]);
  const feedbackRequestedLabel = formatFeedbackRequestedLabel(bundle.requestedAt);

  const handleRequestFeedback = async (input: { message: string; sendEmail: boolean }) => {
    setRequesting(true);
    try {
      const saved = submitFeedbackRequest(candidate.id, bundle, {
        actorName,
        message: input.message,
        sendEmail: input.sendEmail,
        candidate,
        jobTitle: job.title,
      });
      setBundle(saved);
      setRequestOpen(false);
      toast.success(
        input.sendEmail
          ? "Feedback request sent · notifications and email dispatched"
          : "Feedback request sent · interviewers notified in-app",
      );
    } catch {
      toast.error("Could not send feedback request");
    } finally {
      setRequesting(false);
    }
  };

  if (interviews.length === 0) {
    return (
      <InterviewsEmptyState canSchedule={canSchedule} onSchedule={() => openSchedule()} />
    );
  }

  return (
    <div className="space-y-5">
      {upcoming.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
              Upcoming interviews
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[#A1A1AA]">{upcoming.length} scheduled</span>
              {canSchedule ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 rounded-[8px] px-2.5 text-[11px]"
                  onClick={() => openSchedule()}
                >
                  <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                  Schedule
                </Button>
              ) : null}
            </div>
          </div>
          <div className="space-y-3">
            {upcoming.map((interview) => (
              <UpcomingInterviewCard
                key={interview.id}
                interview={interview}
                bundle={bundle}
                canRequest={canRequest}
                canSchedule={canSchedule}
                feedbackRequestedLabel={feedbackRequestedLabel}
                onRequestFeedback={() => setRequestOpen(true)}
                onOpen={() => openViewSchedule(interview.round, interview.meetUrl)}
                onReschedule={() => openReschedule(interview.round)}
                onCancel={() => openCancel(interview.round)}
              />
            ))}
          </div>
        </section>
      ) : canSchedule ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
              Upcoming interviews
            </h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 gap-1 rounded-[8px] px-2.5 text-[11px]"
              onClick={() => openSchedule()}
            >
              <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Schedule interview
            </Button>
          </div>
          <p className="text-[13px] text-[#71717A] dark:text-text-muted">No upcoming interviews scheduled.</p>
        </section>
      ) : null}

      {completed.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
              Completed interviews
            </h3>
            <span className="text-[11px] font-medium text-[#A1A1AA]">{completed.length} done</span>
          </div>
          <div className="space-y-3">
            {completed.map((interview) => (
              <CompletedInterviewCard
                key={interview.id}
                interview={interview}
                canRequest={canRequest}
                feedbackRequestedLabel={feedbackRequestedLabel}
                onRequestFeedback={() => setRequestOpen(true)}
                onOpenFeedback={() => onOpenFeedback?.()}
                onViewNotes={() => onOpenFeedback?.()}
              />
            ))}
          </div>
        </section>
      ) : null}

      {cancelled.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-[13px] font-semibold text-[#71717A]">Cancelled</h3>
          {cancelled.map((interview) => (
            <article
              key={interview.id}
              className={cn(dashboardPanelInteractive, "p-4 opacity-75")}
            >
              <p className="text-[14px] font-medium text-[#52525B]">{interview.round}</p>
              <p className="mt-1 text-[12px] text-[#A1A1AA]">{interview.scheduledAt}</p>
            </article>
          ))}
        </section>
      ) : null}

      <RequestFeedbackModal
        open={requestOpen}
        onOpenChange={setRequestOpen}
        candidate={candidate}
        interviewer={bundle.interviewer}
        jobTitle={job.title}
        sending={requesting}
        onSend={handleRequestFeedback}
      />
    </div>
  );
}
