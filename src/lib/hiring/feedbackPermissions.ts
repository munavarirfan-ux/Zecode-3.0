import type { PreviewRole } from "@/config/previewRole";
import type { InterviewFeedbackBundle } from "./interviewFeedback";

/** Evaluator (panel + assessment reviewer) may submit interviewer feedback. */
export function canSubmitInterviewerFeedback(role: PreviewRole): boolean {
  return role === "evaluator";
}

/** Admin and Super Admin request feedback — they cannot submit interviewer evaluations. */
export function canRequestFeedback(role: PreviewRole): boolean {
  return role === "superAdmin" || role === "admin";
}

/** Admin and Super Admin can schedule interviews from the candidate report. */
export function canScheduleInterview(role: PreviewRole): boolean {
  return role === "superAdmin" || role === "admin";
}

/** Recruiter feedback editable by Admin, Super Admin, and Curator (recruiter owner persona). */
export function canEditRecruiterFeedback(role: PreviewRole): boolean {
  return role === "superAdmin" || role === "admin" || role === "curator";
}

export function isInterviewerFeedbackReadOnly(role: PreviewRole): boolean {
  return canRequestFeedback(role);
}

/** Admins view interviewer feedback read-only and may only add admin comments. */
export function isAdminFeedbackView(role: PreviewRole): boolean {
  return canRequestFeedback(role);
}

export function canEditOwnSubmittedFeedback(
  role: PreviewRole,
  bundle: InterviewFeedbackBundle,
  actorName: string,
): boolean {
  if (!canSubmitInterviewerFeedback(role)) return false;
  if (bundle.status !== "submitted") return true;
  const submitter = bundle.submittedBy?.toLowerCase() ?? "";
  return submitter === actorName.toLowerCase() || submitter === "";
}

export function getPreviewActorLabel(role: PreviewRole): string {
  const map: Record<PreviewRole, string> = {
    superAdmin: "Marcus Chen",
    admin: "Alex Rivera",
    curator: "Jordan Lee",
    evaluator: "Irfan Hassan",
    newUser: "New User",
  };
  return map[role];
}
