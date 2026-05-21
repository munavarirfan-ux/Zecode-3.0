import type { PreviewRole } from "@/config/previewRole";
import type { NavGroupConfig } from "@/config/navTypes";
import { MODULE_CODE, MODULE_HIRE } from "@/constants/app";
import { ROUTES } from "@/config/routes";
import { getEffectivePreviewRole } from "@/lib/onboarding/effectiveRole";

/** Role-driven navigation — sidebar reads from this config only. */
const OVERVIEW: NavGroupConfig = {
  label: "Dashboard",
  items: [{ href: ROUTES.dashboard, label: "Overview", icon: "layoutDashboard" }],
};

const HIRING_DESIGN: NavGroupConfig = {
  label: MODULE_HIRE,
  items: [
    { href: ROUTES.hiringJobs, label: "Jobs", icon: "briefcase" },
    { href: ROUTES.interviews, label: "Interviews", icon: "mic2" },
    { href: ROUTES.candidates, label: "Candidates", icon: "users" },
    { href: ROUTES.mySchedule, label: "My schedule", icon: "calendar" },
  ],
};

const EVALUATION_DESIGN: NavGroupConfig = {
  label: MODULE_CODE,
  items: [
    { href: ROUTES.assessments, label: "Assessments", icon: "graduationCap" },
    { href: ROUTES.schedules, label: "Assessment Drive", icon: "calendar" },
    { href: ROUTES.questionPool, label: "Question Pool", icon: "databaseZap" },
  ],
};

const INSIGHTS_REPORTS: NavGroupConfig = {
  label: "Insights",
  items: [{ href: ROUTES.reports, label: "Reports", icon: "fileText" }],
};

const SYSTEM: NavGroupConfig = {
  label: "System",
  items: [{ href: ROUTES.settings, label: "Settings", icon: "settings" }],
};

const INTERVIEW_OPS: NavGroupConfig = {
  label: MODULE_HIRE,
  items: [
    { href: ROUTES.interviews, label: "Interviews", icon: "mic2" },
    { href: ROUTES.mySchedule, label: "My schedule", icon: "calendar" },
  ],
};

const CURATOR_CONTENT: NavGroupConfig = {
  label: "Content",
  items: [
    { href: ROUTES.questionPool, label: "Question Pool", icon: "databaseZap" },
    { href: ROUTES.assessments, label: "Assessments", icon: "graduationCap" },
  ],
};

const ASSESSMENT_OPS: NavGroupConfig = {
  label: MODULE_CODE,
  items: [{ href: ROUTES.assessments, label: "Assessments", icon: "graduationCap" }],
};

export const navigationByRole: Record<PreviewRole, NavGroupConfig[]> = {
  superAdmin: [OVERVIEW, HIRING_DESIGN, EVALUATION_DESIGN, INSIGHTS_REPORTS, SYSTEM],
  admin: [OVERVIEW, HIRING_DESIGN, EVALUATION_DESIGN, INSIGHTS_REPORTS, SYSTEM],
  curator: [OVERVIEW, CURATOR_CONTENT, INSIGHTS_REPORTS, SYSTEM],
  evaluator: [OVERVIEW, INTERVIEW_OPS, ASSESSMENT_OPS, INSIGHTS_REPORTS, SYSTEM],
  newUser: [OVERVIEW, HIRING_DESIGN, EVALUATION_DESIGN, INSIGHTS_REPORTS, SYSTEM],
};

export function getNavigationForRole(role: PreviewRole): NavGroupConfig[] {
  const effective = getEffectivePreviewRole(role);
  return navigationByRole[effective] ?? navigationByRole.admin;
}
