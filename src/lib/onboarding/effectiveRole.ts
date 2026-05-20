import type { PreviewRole } from "@/config/previewRole";

/** New User preview uses Super Admin capabilities after onboarding. */
export function getEffectivePreviewRole(role: PreviewRole): PreviewRole {
  return role === "newUser" ? "superAdmin" : role;
}

export function isNewUserPreview(role: PreviewRole): boolean {
  return role === "newUser";
}
