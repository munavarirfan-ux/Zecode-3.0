export type EnterpriseBrandingState = {
  name: string;
  slug: string;
  website: string;
  industry: string;
  companySize: string;
  supportEmail: string;
  headquarters: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  coverUrl: string | null;
  loginBackgroundUrl: string | null;
  primaryColor: string;
  accentColor: string;
  sidebarTheme: "light" | "dark" | "gradient";
  timezone: string;
  dateFormat: string;
  language: string;
  defaultInterviewDuration: number;
  assessmentExpiryDays: number;
  defaultCandidateVisibility: "team" | "enterprise" | "private";
  enforce2fa: boolean;
  ssoEnabled: boolean;
  sessionTimeoutMin: number;
  ipRestrictions: string;
  passwordPolicy: "standard" | "strict";
};

export const DEFAULT_ENTERPRISE_SETTINGS: EnterpriseBrandingState = {
  name: "NovaTech Solutions",
  slug: "novatech",
  website: "https://novatech.io",
  industry: "Technology",
  companySize: "201–500",
  supportEmail: "support@novatech.io",
  headquarters: "Berlin, Germany",
  logoUrl: null,
  faviconUrl: null,
  coverUrl: null,
  loginBackgroundUrl: null,
  primaryColor: "#7C3AED",
  accentColor: "#EC4899",
  sidebarTheme: "light",
  timezone: "Europe/Berlin",
  dateFormat: "DD/MM/YYYY",
  language: "en",
  defaultInterviewDuration: 60,
  assessmentExpiryDays: 7,
  defaultCandidateVisibility: "team",
  enforce2fa: false,
  ssoEnabled: true,
  sessionTimeoutMin: 480,
  ipRestrictions: "",
  passwordPolicy: "standard",
};

export const RESERVED_SLUGS = ["admin", "api", "app", "www", "login", "settings"];

export function validateEnterpriseSlug(slug: string): string | null {
  const s = slug.trim().toLowerCase();
  if (!s) return "Slug is required";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) return "Use lowercase letters, numbers, and hyphens only";
  if (RESERVED_SLUGS.includes(s)) return "This slug is reserved";
  if (s.length < 3) return "Slug must be at least 3 characters";
  return null;
}

export function isSlugAvailable(slug: string, taken: string[]): boolean {
  const s = slug.trim().toLowerCase();
  return !taken.filter((t) => t !== DEFAULT_ENTERPRISE_SETTINGS.slug).includes(s);
}
