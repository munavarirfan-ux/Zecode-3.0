import type { AssessmentScheduleRecord, AssessmentScheduleTab } from "./scheduleTypes";

export type ScheduleSortKey = "expiry" | "invite" | "name" | "score" | "progress";

export interface ScheduleFilterState {
  search: string;
  role: string;
  assessment: string;
  status: string;
  date: string;
  malpractice: string;
  score: string;
  recruiter: string;
}

export const EMPTY_SCHEDULE_FILTERS: ScheduleFilterState = {
  search: "",
  role: "all",
  assessment: "all",
  status: "all",
  date: "all",
  malpractice: "all",
  score: "all",
  recruiter: "all",
};

export function countByScheduleTab(rows: AssessmentScheduleRecord[]): Record<AssessmentScheduleTab, number> {
  const counts: Record<AssessmentScheduleTab, number> = {
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    expired: 0,
    drafts: 0,
  };
  rows.forEach((r) => {
    counts[r.tab]++;
  });
  return counts;
}

export function filterByScheduleTab(rows: AssessmentScheduleRecord[], tab: AssessmentScheduleTab) {
  return rows.filter((r) => r.tab === tab);
}

export function applyScheduleFilters(rows: AssessmentScheduleRecord[], f: ScheduleFilterState) {
  let out = [...rows];
  const q = f.search.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.assessmentName.toLowerCase().includes(q),
    );
  }
  if (f.role !== "all") out = out.filter((r) => r.role === f.role);
  if (f.assessment !== "all") out = out.filter((r) => r.assessmentName === f.assessment);
  if (f.status !== "all") out = out.filter((r) => r.status === f.status);
  if (f.date !== "all") out = out.filter((r) => r.expiryDate.includes(f.date) || r.inviteSentAt.includes(f.date));
  if (f.malpractice === "flagged") out = out.filter((r) => r.malpracticeSignals.length > 0);
  if (f.malpractice === "clean") out = out.filter((r) => r.malpracticeSignals.length === 0);
  if (f.score === "scored") out = out.filter((r) => r.score != null);
  if (f.score === "unscored") out = out.filter((r) => r.score == null);
  if (f.recruiter !== "all") out = out.filter((r) => r.recruiter === f.recruiter);
  return out;
}

export function sortSchedules(rows: AssessmentScheduleRecord[], sort: ScheduleSortKey) {
  const copy = [...rows];
  copy.sort((a, b) => {
    switch (sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "score":
        return (b.score ?? -1) - (a.score ?? -1);
      case "progress":
        return b.progress - a.progress;
      case "invite":
        return b.inviteSentAt.localeCompare(a.inviteSentAt);
      case "expiry":
      default:
        return b.expiryDate.localeCompare(a.expiryDate);
    }
  });
  return copy;
}

export function uniqueScheduleRoles(rows: AssessmentScheduleRecord[]) {
  return Array.from(new Set(rows.map((r) => r.role))).sort();
}

export function uniqueScheduleAssessments(rows: AssessmentScheduleRecord[]) {
  return Array.from(new Set(rows.map((r) => r.assessmentName))).sort();
}

export function uniqueScheduleRecruiters(rows: AssessmentScheduleRecord[]) {
  return Array.from(new Set(rows.map((r) => r.recruiter))).sort();
}

export function uniqueScheduleDates(rows: AssessmentScheduleRecord[]) {
  const dates = new Set<string>();
  rows.forEach((r) => {
    if (r.inviteSentAt !== "—") dates.add(r.inviteSentAt);
    dates.add(r.expiryDate);
  });
  return Array.from(dates).sort();
}
