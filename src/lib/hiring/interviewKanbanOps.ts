import { enrichInterviewDefaults, getFeedbackCounts } from "./candidateInterviews";
import type { CandidateInterview, HiringCandidate } from "./types";
import type { InterviewRound } from "./interviewRounds";
import { resolveInterviewColumnId } from "./interviewRounds";

export type InterviewOperationalStatus =
  | "Scheduled"
  | "Pending"
  | "Ongoing"
  | "Completed"
  | "Feedback Pending"
  | "Cancelled";

export const INTERVIEW_STATUS_FILTERS: Array<InterviewOperationalStatus | "All"> = [
  "All",
  "Scheduled",
  "Pending",
  "Ongoing",
  "Completed",
  "Feedback Pending",
  "Cancelled",
];

export type InterviewKanbanCardModel = {
  candidate: HiringCandidate;
  roundTitle: string;
  columnId: string;
  status: InterviewOperationalStatus;
  primaryInterview: CandidateInterview | null;
  schedulePreview: string | null;
  leadInterviewer: string | null;
  feedbackLabel: string;
  feedbackTone: "neutral" | "success" | "warning" | "danger";
  isOverdueFeedback: boolean;
  primaryAction: "schedule" | "join" | "view" | "reschedule" | "request-feedback" | "move-next";
};

export type InterviewCardAction =
  | "schedule"
  | "join"
  | "view"
  | "reschedule"
  | "cancel"
  | "request-feedback"
  | "move-next"
  | "add-note"
  | "reject";

export function hasScheduledInterviewActions(status: InterviewOperationalStatus): boolean {
  return status === "Scheduled" || status === "Ongoing";
}

export type InterviewColumnMetrics = {
  total: number;
  pendingFeedback: number;
  ongoing: number;
};

export type InterviewKanbanAdvancedFilters = {
  interviewer: string;
  interviewType: string;
  date: string;
  feedbackStatus: string;
};

export const EMPTY_ADVANCED_FILTERS: InterviewKanbanAdvancedFilters = {
  interviewer: "",
  interviewType: "",
  date: "",
  feedbackStatus: "",
};

/** Shown inline on the compact interview toolbar; remainder go in +N more */
export const INTERVIEW_STATUS_CHIPS_PRIMARY: Array<InterviewOperationalStatus | "All"> = [
  "All",
  "Scheduled",
  "Pending",
  "Ongoing",
];

export const INTERVIEW_STATUS_CHIPS_OVERFLOW: InterviewOperationalStatus[] = [
  "Completed",
  "Feedback Pending",
  "Cancelled",
];

export function countActiveAdvancedFilters(advanced: InterviewKanbanAdvancedFilters): number {
  let count = 0;
  if (advanced.interviewer) count += 1;
  if (advanced.interviewType) count += 1;
  if (advanced.date) count += 1;
  if (advanced.feedbackStatus) count += 1;
  return count;
}

function interviewMatchesRound(interview: CandidateInterview, roundTitle: string): boolean {
  return interview.round.trim().toLowerCase() === roundTitle.trim().toLowerCase();
}

/** Interview record for this kanban column only — never another round's session */
export function getPrimaryInterviewForRound(
  candidate: HiringCandidate,
  roundTitle: string,
): CandidateInterview | null {
  const enriched = candidate.interviews.map(enrichInterviewDefaults);
  const inRound = enriched.filter((i) => interviewMatchesRound(i, roundTitle));
  if (inRound.length === 0) {
    return null;
  }

  const ongoing = inRound.find((i) => i.status === "Scheduled" && isInterviewOngoing(i));
  if (ongoing) return ongoing;

  const scheduled = inRound.find((i) => i.status === "Scheduled");
  if (scheduled) return scheduled;

  const feedbackPending = inRound.find(
    (i) => i.status === "Completed" && i.feedbackStatus === "Pending",
  );
  if (feedbackPending) return feedbackPending;

  const completed = inRound.find((i) => i.status === "Completed");
  if (completed) return completed;

  const cancelled = inRound.find((i) => i.status === "Cancelled");
  if (cancelled) return cancelled;

  return inRound[0] ?? null;
}

/** Demo live session: scheduled today (May 15) in mock copy */
export function isInterviewOngoing(interview: CandidateInterview): boolean {
  if (interview.status !== "Scheduled") return false;
  return /\bMay\s+15\b/i.test(interview.scheduledAt);
}

export function deriveOperationalStatus(
  candidate: HiringCandidate,
  roundTitle: string,
  primaryInterview: CandidateInterview | null,
): InterviewOperationalStatus {
  if (!primaryInterview) return "Pending";

  if (primaryInterview.status === "Cancelled") return "Cancelled";

  if (primaryInterview.status === "Scheduled") {
    if (isInterviewOngoing(primaryInterview)) return "Ongoing";
    return "Scheduled";
  }

  if (primaryInterview.status === "Completed") {
    if (primaryInterview.feedbackStatus === "Pending") return "Feedback Pending";
    return "Completed";
  }

  return "Pending";
}

function buildSchedulePreview(interview: CandidateInterview | null): string | null {
  if (!interview || interview.status === "Cancelled") return null;
  if (!interview.scheduledAt) return null;
  const parts = interview.scheduledAt.split("·").map((p) => p.trim());
  const when = parts[0] ?? interview.scheduledAt;
  const time = parts[1] ?? "";
  const lead = interview.interviewers[0] ?? "—";
  const platform = interview.platform ?? "Video";
  return [when, time, lead, platform].filter(Boolean).join(" · ");
}

function buildFeedbackState(interview: CandidateInterview | null): {
  label: string;
  tone: InterviewKanbanCardModel["feedbackTone"];
  isOverdue: boolean;
} {
  if (!interview) {
    return { label: "No feedback yet", tone: "neutral", isOverdue: false };
  }

  const { submitted, pending, total } = getFeedbackCounts(interview);

  if (interview.status === "Completed" && interview.feedbackStatus === "Pending") {
    const awaiting = interview.interviewers[pending - 1] ?? interview.interviewers[0];
    const overdue =
      Boolean(interview.feedbackRequestedAt) &&
      /d ago|day/i.test(interview.feedbackRequestedAt ?? "");
    return {
      label: awaiting ? `Awaiting ${awaiting}` : "Awaiting feedback",
      tone: overdue ? "danger" : "warning",
      isOverdue: overdue,
    };
  }

  if (submitted > 0 && total > 0) {
    return {
      label: `${submitted}/${total} submitted`,
      tone: submitted >= total ? "success" : "warning",
      isOverdue: false,
    };
  }

  if (interview.status === "Scheduled") {
    return { label: "Pre-interview", tone: "neutral", isOverdue: false };
  }

  return { label: "Feedback submitted", tone: "success", isOverdue: false };
}

function resolvePrimaryAction(
  status: InterviewOperationalStatus,
  interview: CandidateInterview | null,
): InterviewKanbanCardModel["primaryAction"] {
  if (status === "Pending") return "schedule";
  if ((status === "Scheduled" || status === "Ongoing") && interview?.meetUrl) return "join";
  if (status === "Scheduled" || status === "Ongoing") return "view";
  if (status === "Feedback Pending") return "request-feedback";
  if (status === "Completed") return "move-next";
  return "schedule";
}

export function buildInterviewKanbanCardModel(
  candidate: HiringCandidate,
  rounds: InterviewRound[],
): InterviewKanbanCardModel {
  const columnId = resolveInterviewColumnId(candidate, rounds);
  const roundTitle = rounds.find((r) => r.id === columnId)?.title ?? candidate.currentSubstage ?? "Interview";
  const primaryInterview = getPrimaryInterviewForRound(candidate, roundTitle);
  const status = deriveOperationalStatus(candidate, roundTitle, primaryInterview);
  const feedback = buildFeedbackState(primaryInterview);

  return {
    candidate,
    roundTitle,
    columnId,
    status,
    primaryInterview,
    schedulePreview:
      status === "Pending" ? null : buildSchedulePreview(primaryInterview),
    leadInterviewer:
      status === "Pending" ? null : primaryInterview?.interviewers[0] ?? null,
    feedbackLabel: feedback.label,
    feedbackTone: feedback.tone,
    isOverdueFeedback: feedback.isOverdue,
    primaryAction: resolvePrimaryAction(status, primaryInterview),
  };
}

export function getColumnMetrics(
  items: InterviewKanbanCardModel[],
): InterviewColumnMetrics {
  return {
    total: items.length,
    pendingFeedback: items.filter((i) => i.status === "Feedback Pending").length,
    ongoing: items.filter((i) => i.status === "Ongoing").length,
  };
}

export function collectInterviewFilterOptions(candidates: HiringCandidate[]) {
  const interviewers = new Set<string>();
  const types = new Set<string>();

  for (const c of candidates) {
    for (const i of c.interviews) {
      i.interviewers.forEach((n) => interviewers.add(n));
      if (i.interviewType) types.add(i.interviewType);
    }
  }

  return {
    interviewers: Array.from(interviewers).sort(),
    types: Array.from(types).sort(),
  };
}

export function matchesStatusFilter(
  status: InterviewOperationalStatus,
  filter: InterviewOperationalStatus | "All",
): boolean {
  return filter === "All" || status === filter;
}

export function matchesAdvancedFilters(
  model: InterviewKanbanCardModel,
  filters: InterviewKanbanAdvancedFilters,
): boolean {
  if (filters.interviewer && !model.primaryInterview?.interviewers.includes(filters.interviewer)) {
    return false;
  }
  if (filters.interviewType && model.primaryInterview?.interviewType !== filters.interviewType) {
    return false;
  }
  if (filters.feedbackStatus === "submitted" && model.feedbackTone !== "success") return false;
  if (filters.feedbackStatus === "awaiting" && model.status !== "Feedback Pending") return false;
  if (filters.feedbackStatus === "overdue" && !model.isOverdueFeedback) return false;
  if (filters.date === "upcoming" && model.status !== "Scheduled" && model.status !== "Ongoing") {
    return false;
  }
  if (filters.date === "completed" && model.status !== "Completed" && model.status !== "Feedback Pending") {
    return false;
  }
  return true;
}
