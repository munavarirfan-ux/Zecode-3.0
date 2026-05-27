import type { PreviewRole } from "@/config/previewRole";
import { getEffectivePreviewRole } from "@/lib/onboarding/effectiveRole";

/** Workspace roles used in Teams & Members (includes preview roles + hiring roles). */
export type WorkspaceMemberRole =
  | "superAdmin"
  | "admin"
  | "recruiter"
  | "interviewer"
  | "evaluator"
  | "curator"
  | "viewer";

export const WORKSPACE_MEMBER_ROLES: { id: WorkspaceMemberRole; label: string }[] = [
  { id: "superAdmin", label: "Super Admin" },
  { id: "admin", label: "Admin" },
  { id: "recruiter", label: "Recruiter" },
  { id: "interviewer", label: "Interviewer" },
  { id: "evaluator", label: "Evaluator" },
  { id: "curator", label: "Curator" },
  { id: "viewer", label: "Viewer" },
];

export type PermissionArea =
  | "jobs"
  | "candidates"
  | "interviews"
  | "assessments"
  | "questionPool"
  | "settings"
  | "migration"
  | "localization"
  | "teams"
  | "enterprises"
  | "reports"
  | "scheduling";

const PERMISSION_LABELS: Record<PermissionArea, string> = {
  jobs: "Jobs",
  candidates: "Candidates",
  interviews: "Interviews",
  assessments: "Assessments",
  questionPool: "Question Pool",
  settings: "Settings",
  migration: "Migration",
  localization: "Localization",
  teams: "Team management",
  enterprises: "All enterprises",
  reports: "Reports",
  scheduling: "Scheduling",
};

const ROLE_PERMISSIONS: Record<WorkspaceMemberRole, PermissionArea[]> = {
  superAdmin: [
    "jobs",
    "candidates",
    "interviews",
    "assessments",
    "questionPool",
    "settings",
    "migration",
    "localization",
    "teams",
    "enterprises",
    "reports",
    "scheduling",
  ],
  admin: [
    "jobs",
    "candidates",
    "interviews",
    "assessments",
    "questionPool",
    "settings",
    "teams",
    "reports",
    "scheduling",
  ],
  recruiter: ["jobs", "candidates", "interviews", "assessments", "scheduling"],
  interviewer: ["interviews", "candidates", "reports"],
  evaluator: ["assessments", "candidates", "reports"],
  curator: ["questionPool", "assessments"],
  viewer: ["jobs", "candidates", "interviews", "assessments", "reports"],
};

const ALL_AREAS = Object.keys(PERMISSION_LABELS) as PermissionArea[];

export function getRolePermissionPreview(role: WorkspaceMemberRole) {
  const allowed = new Set(ROLE_PERMISSIONS[role]);
  return ALL_AREAS.map((area) => ({
    area,
    label: PERMISSION_LABELS[area],
    allowed: allowed.has(area),
  }));
}

export function previewRoleLabel(role: PreviewRole): string {
  const effective = getEffectivePreviewRole(role);
  const match = WORKSPACE_MEMBER_ROLES.find((r) => r.id === effective);
  return match?.label ?? effective;
}

export function canPreviewRoleAccessSettings(role: PreviewRole): boolean {
  const effective = getEffectivePreviewRole(role);
  return effective === "superAdmin" || effective === "admin";
}

export function canPreviewRoleAccessPlatformSettings(role: PreviewRole): boolean {
  return getEffectivePreviewRole(role) === "superAdmin";
}

/** Profile: role and email are never editable in settings UI. */
export function isProfileFieldEditable(field: "name" | "email" | "role" | "avatar" | "bio" | "timezone" | "language" | "password"): boolean {
  if (field === "email" || field === "role") return false;
  return true;
}
