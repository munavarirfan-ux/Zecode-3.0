import type { PreviewRole } from "@/config/previewRole";
import { getEffectivePreviewRole } from "@/lib/onboarding/effectiveRole";
import type { SettingsNavItem, SettingsScope } from "./settingsTypes";

export function isPlatformSuperAdmin(role: PreviewRole): boolean {
  return getEffectivePreviewRole(role) === "superAdmin";
}

export function isEnterpriseAdmin(role: PreviewRole): boolean {
  const effective = getEffectivePreviewRole(role);
  return effective === "superAdmin" || effective === "admin";
}

export function canAccessSettingsItem(role: PreviewRole, item: SettingsNavItem): boolean {
  const effective = getEffectivePreviewRole(role);
  return item.roles.includes(effective);
}

export function canAccessScope(role: PreviewRole, scope: SettingsScope): boolean {
  if (scope === "platform") return isPlatformSuperAdmin(role);
  if (scope === "enterprise") return isEnterpriseAdmin(role);
  return true;
}
