import type { PreviewRole } from "@/config/previewRole";

export type DashboardWidgetId =
  | "interviewVolume"
  | "assessmentQuality"
  | "scheduleUtilization"
  | "hiringFunnel"
  | "interviewOutcomes";

export type InterviewsPanelMode = "enterprise" | "interviewer";
export type AssessmentsPanelMode = "enterprise" | "curator" | "evaluator";
export type FeedbackDuePanelMode = "enterprise" | "interviewer";
export type SchedulesPanelMode = "enterprise" | "interviewer";

export const dashboardWidgetsByRole: Record<PreviewRole, DashboardWidgetId[]> = {
  superAdmin: ["interviewVolume", "assessmentQuality", "scheduleUtilization", "hiringFunnel", "interviewOutcomes"],
  admin: ["interviewVolume", "assessmentQuality", "scheduleUtilization", "hiringFunnel", "interviewOutcomes"],
  curator: ["assessmentQuality"],
  evaluator: ["interviewVolume", "scheduleUtilization", "interviewOutcomes", "assessmentQuality"],
  newUser: [],
};

export function getDashboardWidgetsForRole(role: PreviewRole): DashboardWidgetId[] {
  return dashboardWidgetsByRole[role] ?? dashboardWidgetsByRole.admin;
}

export function interviewsPanelMode(role: PreviewRole): InterviewsPanelMode {
  return role === "evaluator" ? "interviewer" : "enterprise";
}

export function assessmentsPanelMode(role: PreviewRole): AssessmentsPanelMode {
  if (role === "curator") return "curator";
  if (role === "evaluator") return "evaluator";
  return "enterprise";
}

export function feedbackDuePanelMode(role: PreviewRole): FeedbackDuePanelMode {
  return role === "evaluator" ? "interviewer" : "enterprise";
}
