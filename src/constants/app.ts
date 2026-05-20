/** Product and workspace branding */
export const APP_NAME = "Ze[hub]";
export const MODULE_HIRE = "ze[hire]";
export const MODULE_CODE = "ze[code]";
export const APP_TAGLINE = "Hiring operations platform";
export const COMPANY_NAME = "Zessta Software Services";

export const APP_DESCRIPTION =
  "Hiring operations, assessments, and interview intelligence for enterprise teams.";

/** Demo auth (re-seed after changing domain) */
export const DEMO_PASSWORD = "demo123";

export const DEMO_USERS = {
  superAdmin: "superadmin@zecode.io",
  admin: "admin@zecode.io",
  hr: "hr@zecode.io",
  manager: "manager@zecode.io",
} as const;

/** localStorage keys (legacy kerohire.* keys are migrated on read) */
export const STORAGE_KEYS = {
  theme: "zecode.theme",
  primary: "zecode.primary",
  sidebarCollapsed: "ze.sidebar.collapsed",
} as const;

export const LEGACY_STORAGE_KEYS = {
  theme: "kerohire.theme",
  primary: "kerohire.primary",
  navbar: "kerohire.navbar",
  navbarText: "kerohire.navbarText",
} as const;
