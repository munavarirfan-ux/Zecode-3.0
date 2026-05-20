import { buildInterviewKanbanCardModel } from "@/lib/hiring/interviewKanbanOps";
import { getInterviewRounds, type InterviewRound } from "@/lib/hiring/interviewRounds";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";

export type InterviewListFeedbackStatus =
  | "Not Requested"
  | "Requested"
  | "Pending"
  | "Submitted"
  | "Overdue";

export type InterviewListInterviewStatus =
  | "Pending"
  | "Scheduled"
  | "Ongoing"
  | "Completed"
  | "Cancelled";

export type InterviewListRow = {
  id: string;
  candidate: HiringCandidate;
  email: string;
  interviewer: string;
  role: string;
  scheduledDate: string;
  interviewStatus: InterviewListInterviewStatus;
  feedbackStatus: InterviewListFeedbackStatus;
  round: string;
};

export type InterviewListFilters = {
  round: string;
  interviewer: string;
  scheduledDate: string;
  interviewStatus: string;
  feedbackStatus: string;
  query: string;
};

export const EMPTY_INTERVIEW_LIST_FILTERS: InterviewListFilters = {
  round: "",
  interviewer: "",
  scheduledDate: "",
  interviewStatus: "",
  feedbackStatus: "",
  query: "",
};

function mapInterviewStatus(
  status: ReturnType<typeof buildInterviewKanbanCardModel>["status"],
): InterviewListInterviewStatus {
  if (status === "Scheduled") return "Scheduled";
  if (status === "Ongoing") return "Ongoing";
  if (status === "Completed") return "Completed";
  if (status === "Cancelled") return "Cancelled";
  if (status === "Feedback Pending") return "Completed";
  return "Pending";
}

function mapFeedbackStatus(
  model: ReturnType<typeof buildInterviewKanbanCardModel>,
): InterviewListFeedbackStatus {
  if (model.isOverdueFeedback) return "Overdue";
  if (model.feedbackLabel === "Submitted") return "Submitted";
  if (model.feedbackLabel === "Pending") return "Pending";
  if (model.feedbackLabel.toLowerCase().includes("requested")) return "Requested";
  if (model.status === "Pending") return "Not Requested";
  return "Not Requested";
}

export function buildInterviewListRows(
  job: HiringJob,
  candidates: HiringCandidate[],
  rounds: InterviewRound[] = getInterviewRounds(job.id),
): InterviewListRow[] {
  const rows: InterviewListRow[] = [];

  for (const candidate of candidates) {
    const model = buildInterviewKanbanCardModel(candidate, rounds);
    const primary = model.primaryInterview;

    rows.push({
      id: `${candidate.id}-${primary?.id ?? "pending"}`,
      candidate,
      email: candidate.email,
      interviewer: model.leadInterviewer ?? primary?.interviewers[0] ?? "—",
      role: job.title,
      scheduledDate: primary?.scheduledAt ?? model.schedulePreview ?? "Not scheduled",
      interviewStatus: mapInterviewStatus(model.status),
      feedbackStatus: mapFeedbackStatus(model),
      round: model.roundTitle,
    });
  }

  return rows.sort((a, b) => a.candidate.name.localeCompare(b.candidate.name));
}

export function filterInterviewListRows(
  rows: InterviewListRow[],
  filters: InterviewListFilters,
): InterviewListRow[] {
  const q = filters.query.trim().toLowerCase();

  return rows.filter((row) => {
    if (filters.round && row.round !== filters.round) return false;
    if (filters.interviewer && !row.interviewer.toLowerCase().includes(filters.interviewer.toLowerCase())) {
      return false;
    }
    if (filters.scheduledDate && !row.scheduledDate.includes(filters.scheduledDate)) return false;
    if (filters.interviewStatus && row.interviewStatus !== filters.interviewStatus) return false;
    if (filters.feedbackStatus && row.feedbackStatus !== filters.feedbackStatus) return false;
    if (q) {
      const hay = [row.candidate.name, row.email, row.interviewer, row.round, row.role]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function getInterviewListFilterOptions(rows: InterviewListRow[]) {
  const rounds = new Set<string>();
  const interviewers = new Set<string>();
  for (const row of rows) {
    rounds.add(row.round);
    if (row.interviewer !== "—") interviewers.add(row.interviewer);
  }
  return {
    rounds: Array.from(rounds).sort(),
    interviewers: Array.from(interviewers).sort(),
  };
}
