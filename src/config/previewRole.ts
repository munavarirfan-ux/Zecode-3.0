/** Staging-only dummy “View as” role (no auth, no API). */

export type PreviewRole = "superAdmin" | "admin" | "curator" | "evaluator" | "newUser";

export const PREVIEW_ROLE_OPTIONS: { value: PreviewRole; label: string }[] = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "curator", label: "Curator" },
  { value: "evaluator", label: "Evaluator" },
  { value: "newUser", label: "New User" },
];
