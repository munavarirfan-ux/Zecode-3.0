import { ROUTES } from "@/config/routes";
import type { SettingsNavGroup } from "./settingsTypes";

export const SETTINGS_NAV_GROUPS: SettingsNavGroup[] = [
  {
    id: "platform",
    label: "Platform",
    items: [
      {
        id: "enterprises",
        label: "All Enterprises",
        href: ROUTES.settingsEnterprises,
        scope: "platform",
        scopeLabel: "Platform · Super Admin only",
        roles: ["superAdmin"],
      },
      {
        id: "localization",
        label: "Localization",
        href: ROUTES.settingsLocalization,
        scope: "platform",
        scopeLabel: "Platform · Super Admin only",
        roles: ["superAdmin"],
      },
      {
        id: "migration",
        label: "Migration",
        href: ROUTES.settingsMigration,
        scope: "platform",
        scopeLabel: "Platform · Super Admin only",
        roles: ["superAdmin"],
      },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    items: [
      {
        id: "my-enterprise",
        label: "My Enterprise",
        href: ROUTES.settingsMyEnterprise,
        scope: "enterprise",
        scopeLabel: "Enterprise · admins only",
        roles: ["superAdmin", "admin"],
      },
      {
        id: "teams",
        label: "Teams & Members",
        href: ROUTES.settingsTeams,
        scope: "enterprise",
        scopeLabel: "Enterprise · admins only",
        roles: ["superAdmin", "admin"],
      },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    items: [
      {
        id: "profile",
        label: "My Profile",
        href: ROUTES.settingsMyProfile,
        scope: "personal",
        scopeLabel: "Personal · only visible to you",
        roles: ["superAdmin", "admin", "curator", "evaluator", "newUser"],
      },
      {
        id: "appearance",
        label: "Theme & Appearance",
        href: ROUTES.settingsAppearance,
        scope: "personal",
        scopeLabel: "Personal · only visible to you",
        roles: ["superAdmin", "admin", "curator", "evaluator", "newUser"],
      },
      {
        id: "notifications",
        label: "Notifications",
        href: ROUTES.settingsNotifications,
        scope: "personal",
        scopeLabel: "Personal · only visible to you",
        roles: ["superAdmin", "admin", "curator", "evaluator", "newUser"],
      },
    ],
  },
];

export function findSettingsNavItem(pathname: string) {
  for (const group of SETTINGS_NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item;
      }
    }
  }
  if (pathname === ROUTES.settingsMyEnterprise || pathname.startsWith(`${ROUTES.settingsMyEnterprise}/`)) {
    return SETTINGS_NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === "my-enterprise") ?? null;
  }
  if (pathname === ROUTES.settingsMyProfile || pathname.startsWith(`${ROUTES.settingsMyProfile}/`)) {
    return SETTINGS_NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === "profile") ?? null;
  }
  if (pathname === ROUTES.settingsAudit || pathname.startsWith(`${ROUTES.settingsAudit}/`)) {
    return {
      id: "audit",
      label: "Audit log",
      href: ROUTES.settingsAudit,
      scope: "enterprise" as const,
      scopeLabel: "Enterprise · admins only",
      roles: ["superAdmin", "admin"],
    };
  }
  return null;
}
