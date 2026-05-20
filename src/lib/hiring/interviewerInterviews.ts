import type { PreviewRole } from "@/config/previewRole";
import { resolveLoggedInInterviewerName } from "@/lib/dashboard/interviewerContext";
import { myAssignedInterviewsAll } from "@/features/dashboard/data/dashboard.mock";
import { getPreviewActorLabel } from "@/lib/hiring/feedbackPermissions";
import { hasRescheduleRequest } from "@/lib/hiring/rescheduleRequests";
import { getAllJobs, getCandidatesForJob } from "@/lib/hiring/mockData";
import type { CandidateInterview, HiringCandidate, HiringJob } from "@/lib/hiring/types";

export type InterviewerInterviewStatus =
  | "Upcoming"
  | "Ongoing"
  | "Completed"
  | "Cancelled"
  | "Reschedule Requested";

export type InterviewerFeedbackStatus = "Pending" | "Submitted" | "Overdue";

export type InterviewerInterviewFilter =
  | "all"
  | "today"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "feedback-pending"
  | "reschedule-requested";

export type InterviewerAssignedInterviewRow = {
  id: string;
  candidateId: string;
  candidate: HiringCandidate;
  jobId: string;
  jobRole: string;
  round: string;
  scheduledAt: string;
  interviewType: string;
  interviewStatus: InterviewerInterviewStatus;
  feedbackStatus: InterviewerFeedbackStatus;
  meetUrl?: string;
  roomId?: string;
  isToday: boolean;
};

/** Demo: interviews marked live for the interviewer workspace */
const ONGOING_ROW_IDS = new Set(["c-sarah-jenkins-int-mi-1"]);

type SupplementalInterviewOverride = Partial<
  Pick<
    CandidateInterview,
    | "status"
    | "feedbackStatus"
    | "feedbackRequestedAt"
    | "scheduledAt"
    | "result"
    | "overallRating"
    | "feedbackSubmittedCount"
  >
>;

/** Demo states for My Interviews supplemental rows (keyed by `mi-*` id) */
const SUPPLEMENTAL_INTERVIEW_OVERRIDES: Record<string, SupplementalInterviewOverride> = {
  "mi-1": {
    status: "Completed",
    feedbackStatus: "Submitted",
    result: "Hire",
    scheduledAt: "Today · 10:30 CET",
    feedbackSubmittedCount: 1,
  },
  "mi-4": {
    status: "Completed",
    feedbackStatus: "Pending",
    feedbackRequestedAt: "2 days",
    scheduledAt: "May 14 · 11:00 CET",
  },
  "mi-6": {
    status: "Completed",
    feedbackStatus: "Pending",
    feedbackRequestedAt: "1 day",
    scheduledAt: "Mon · 16:00 CET",
    result: "Lean Hire",
  },
  "mi-7": {
    status: "Completed",
    feedbackStatus: "Overdue",
    feedbackRequestedAt: "3 days",
    scheduledAt: "Tue · 11:30 CET",
  },
  "mi-8": {
    status: "Completed",
    feedbackStatus: "Pending",
    feedbackRequestedAt: "6 hours",
    scheduledAt: "Wed · 14:00 GMT",
    result: "Hire",
  },
  "mi-9": {
    status: "Completed",
    feedbackStatus: "Submitted",
    result: "Strong Hire",
    scheduledAt: "Thu · 10:00 GMT",
    overallRating: 4.5,
    feedbackSubmittedCount: 1,
  },
  "mi-10": {
    status: "Completed",
    feedbackStatus: "Pending",
    feedbackRequestedAt: "12 hours",
    scheduledAt: "Fri · 09:00 CET",
  },
};

const JOB_ID_ALIASES: Record<string, string> = {
  "job-spd-1": "staff-product-designer",
  "job-spd-2": "staff-product-designer",
  "job-sbe-1": "principal-platform-engineer",
  "job-sba-1": "data-analyst-hiring-insights",
  "job-pm-1": "senior-talent-partner",
};

function interviewerActorNames(role: PreviewRole, sessionName?: string | null): string[] {
  const set = new Set<string>();
  set.add(resolveLoggedInInterviewerName(sessionName));
  if (role === "evaluator") set.add(getPreviewActorLabel(role));
  return [...set];
}

export function interviewerOnPanel(interviewers: string[], actorNames: string[]): boolean {
  return interviewers.some((name) =>
    actorNames.some((actor) => {
      const a = actor.toLowerCase();
      const n = name.toLowerCase();
      const first = a.split(/\s+/)[0] ?? "";
      return n === a || n.includes(first) || a.includes(n.split(/\s+/)[0] ?? "");
    }),
  );
}

function mapFeedbackStatus(interview: CandidateInterview): InterviewerFeedbackStatus {
  if (interview.feedbackStatus === "Submitted") return "Submitted";
  if (interview.status === "Completed" && interview.feedbackStatus === "Pending") {
    if (interview.feedbackRequestedAt?.includes("d") || interview.feedbackRequestedAt?.includes("day")) {
      return "Overdue";
    }
    return "Pending";
  }
  if (interview.feedbackStatus === "Pending") return "Pending";
  return "Pending";
}

function mapInterviewStatus(
  rowId: string,
  interview: CandidateInterview,
  rescheduleRequested: boolean,
): InterviewerInterviewStatus {
  if (rescheduleRequested) return "Reschedule Requested";
  if (interview.status === "Cancelled") return "Cancelled";
  if (interview.status === "Completed") return "Completed";
  if (ONGOING_ROW_IDS.has(rowId)) return "Ongoing";
  if (interview.status === "Scheduled") return "Upcoming";
  return "Upcoming";
}

function isScheduledToday(scheduledAt: string): boolean {
  const s = scheduledAt.toLowerCase();
  return s.includes("today") || s.includes("may 20");
}

function rowFromInterview(
  candidate: HiringCandidate,
  job: HiringJob,
  interview: CandidateInterview,
  actorNames: string[],
): InterviewerAssignedInterviewRow | null {
  if (!interviewerOnPanel(interview.interviewers, actorNames)) return null;
  const id = `${candidate.id}-${interview.id}`;
  const rescheduleRequested = hasRescheduleRequest(id);
  return {
    id,
    candidateId: candidate.id,
    candidate,
    jobId: job.id,
    jobRole: job.title,
    round: interview.round,
    scheduledAt: interview.scheduledAt,
    interviewType: interview.interviewType ?? interview.platform ?? "Video",
    interviewStatus: mapInterviewStatus(id, interview, rescheduleRequested),
    feedbackStatus: mapFeedbackStatus(interview),
    meetUrl: interview.meetUrl,
    roomId: interview.roomId,
    isToday: isScheduledToday(interview.scheduledAt),
  };
}

function supplementalRows(role: PreviewRole, actorNames: string[]): InterviewerAssignedInterviewRow[] {
  const jobs = getAllJobs();
  const jobById = new Map(jobs.map((j) => [j.id, j]));
  const out: InterviewerAssignedInterviewRow[] = [];

  for (const item of myAssignedInterviewsAll) {
    if (role !== "evaluator" && !interviewerOnPanel([item.interviewerName], actorNames)) continue;

    const resolvedJobId = JOB_ID_ALIASES[item.jobId] ?? item.jobId;
    const job = jobById.get(resolvedJobId);
    if (!job) continue;

    const candidate = getCandidatesForJob(resolvedJobId).find(
      (c) => c.name.toLowerCase() === item.candidateName.toLowerCase(),
    );
    if (!candidate) continue;

    const interviewId = `int-${item.id}`;
    const interview: CandidateInterview = {
      id: interviewId,
      round: item.round,
      interviewers: [item.interviewerName],
      scheduledAt:
        item.dateLabel === "Today"
          ? `Today · ${item.timeLabel} ${item.timezone}`
          : `${item.dateLabel} · ${item.timeLabel} ${item.timezone}`,
      status: "Scheduled",
      feedbackStatus: "Pending",
      interviewType: "Video",
      durationMinutes: item.durationMin,
      platform: "ZeMeet",
      roomId: item.roomId,
      meetUrl: `/meet/${item.roomId}`,
    };

    const override = SUPPLEMENTAL_INTERVIEW_OVERRIDES[item.id];
    if (override) Object.assign(interview, override);

    const row = rowFromInterview(candidate, job, interview, actorNames);
    if (row) out.push(row);
  }

  return out;
}

export function buildInterviewerAssignedInterviews(
  role: PreviewRole,
  sessionName?: string | null,
): InterviewerAssignedInterviewRow[] {
  const actorNames = interviewerActorNames(role, sessionName);
  const byId = new Map<string, InterviewerAssignedInterviewRow>();

  for (const job of getAllJobs()) {
    const candidates = getCandidatesForJob(job.id);
    for (const candidate of candidates) {
      for (const interview of candidate.interviews) {
        const row = rowFromInterview(candidate, job, interview, actorNames);
        if (row) byId.set(row.id, row);
      }
    }
  }

  for (const row of supplementalRows(role, actorNames)) {
    if (!byId.has(row.id)) byId.set(row.id, row);
  }

  return [...byId.values()].sort((a, b) => {
    const order = (s: InterviewerInterviewStatus) => {
      if (s === "Ongoing") return 0;
      if (s === "Upcoming") return 1;
      if (s === "Reschedule Requested") return 2;
      if (s === "Completed") return 3;
      return 4;
    };
    const d = order(a.interviewStatus) - order(b.interviewStatus);
    if (d !== 0) return d;
    return a.candidate.name.localeCompare(b.candidate.name);
  });
}

export function filterInterviewerInterviews(
  rows: InterviewerAssignedInterviewRow[],
  filter: InterviewerInterviewFilter,
  query: string,
): InterviewerAssignedInterviewRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((row) => {
    if (filter === "today" && !row.isToday) return false;
    if (filter === "upcoming" && row.interviewStatus !== "Upcoming") return false;
    if (filter === "ongoing" && row.interviewStatus !== "Ongoing") return false;
    if (filter === "completed" && row.interviewStatus !== "Completed") return false;
    if (filter === "feedback-pending") {
      if (row.feedbackStatus !== "Pending" && row.feedbackStatus !== "Overdue") return false;
      if (row.interviewStatus !== "Completed") return false;
    }
    if (filter === "reschedule-requested" && row.interviewStatus !== "Reschedule Requested") {
      return false;
    }
    if (q) {
      const hay = [row.candidate.name, row.jobRole, row.round, row.scheduledAt, row.interviewType]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function countByFilter(rows: InterviewerAssignedInterviewRow[]) {
  return {
    today: rows.filter((r) => r.isToday).length,
    upcoming: rows.filter((r) => r.interviewStatus === "Upcoming").length,
    ongoing: rows.filter((r) => r.interviewStatus === "Ongoing").length,
    completed: rows.filter((r) => r.interviewStatus === "Completed").length,
    feedbackPending: rows.filter(
      (r) =>
        r.interviewStatus === "Completed" &&
        (r.feedbackStatus === "Pending" || r.feedbackStatus === "Overdue"),
    ).length,
    rescheduleRequested: rows.filter((r) => r.interviewStatus === "Reschedule Requested").length,
  };
}

export function getNextInterviewToday(
  rows: InterviewerAssignedInterviewRow[],
): InterviewerAssignedInterviewRow | null {
  const pool = rows.filter(
    (r) =>
      (r.isToday || r.interviewStatus === "Ongoing" || r.interviewStatus === "Upcoming") &&
      r.interviewStatus !== "Reschedule Requested" &&
      r.interviewStatus !== "Cancelled",
  );
  const ongoing = pool.find((r) => r.interviewStatus === "Ongoing");
  if (ongoing) return ongoing;
  return pool.find((r) => r.isToday) ?? pool[0] ?? null;
}

function interviewForRow(row: InterviewerAssignedInterviewRow) {
  return row.candidate.interviews.find((i) => i.round === row.round);
}

/** Demo heuristic: scheduled within the current calendar week in mock data. */
export function isInterviewScheduledThisWeek(scheduledAt: string): boolean {
  const s = scheduledAt.toLowerCase();
  if (s.includes("today")) return true;
  if (/\b(mon|tue|wed|thu|fri|sat|sun)\b/.test(s)) return true;
  if (/\bmay\s+(1[4-9]|20)\b/.test(s)) return true;
  return false;
}

export function computeInterviewTimeSpentMinutesThisWeek(
  rows: InterviewerAssignedInterviewRow[],
): number {
  return rows.reduce((sum, row) => {
    if (row.interviewStatus !== "Completed" && row.interviewStatus !== "Ongoing") return sum;
    if (!isInterviewScheduledThisWeek(row.scheduledAt)) return sum;
    const interview = interviewForRow(row);
    return sum + (interview?.durationMinutes ?? 45);
  }, 0);
}

export function formatInterviewDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function countInterviewsTimeSpentThisWeek(rows: InterviewerAssignedInterviewRow[]): number {
  return rows.filter(
    (row) =>
      (row.interviewStatus === "Completed" || row.interviewStatus === "Ongoing") &&
      isInterviewScheduledThisWeek(row.scheduledAt),
  ).length;
}
