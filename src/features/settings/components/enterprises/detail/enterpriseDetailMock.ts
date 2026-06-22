import type { EnterpriseListItem } from "../EnterpriseCard";
import type { CreatedEnterprise } from "../../../store/createdEnterprisesStore";
import { zeMock } from "@/features/demo/data/ze.mock";
import { domainToSlug } from "../../../lib/createEnterprise/slugs";

// ── Types ──

export type EnterpriseDetail = {
  name: string;
  domain: string;
  slug: string;
  location: string;
  plan: string;
  status: string;
  joined: string;
  users: number;
  jobs: number;
  candidates: number;
  seats: number;
  industry: string;
  monthlyAssessments: string;
  numberOfEmployees: string;
  baseDomain: string;
  adminName: string;
  adminEmail: string;
  logoUrl: string | null;
  faviconUrl: string | null;
};

export type EnterpriseKpi = {
  label: string;
  value: number;
  subtitle: string;
  icon: "calendar" | "clipboard" | "users" | "check" | "flag";
};

export type EnterpriseUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Inactive";
  lastActive: string;
};

export type ActivityItem = {
  id: string;
  action: string;
  timestamp: string;
  icon: "building" | "user" | "toggle" | "globe" | "upload" | "shield" | "clipboard" | "truck";
};

export type IntegrationItem = {
  name: string;
  connected: boolean;
};

export type WhitelistedDomain = {
  domain: string;
  addedBy: string;
  createdAt: string;
};

export type StorageItem = {
  label: string;
  used: number;
  total: number;
  unit: string;
};

export type HealthItem = {
  label: string;
  status: "Operational" | "Degraded" | "Down";
};

export type UsageLimitItem = {
  label: string;
  current: number;
  limit: number;
};

export type FeatureUsageItem = {
  label: string;
  current: number;
  limit: number;
};

export type PlanBillingInfo = {
  plan: string;
  duration: string;
  seats: number;
  expiryDate: string;
  paymentMethod: string;
  lastFour: string;
};

// ── Deterministic seed from string ──

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seeded(seed: number, min: number, max: number): number {
  return min + (seed % (max - min + 1));
}

// ── Resolution ──

export function resolveEnterprise(
  slug: string,
  created: CreatedEnterprise[],
): EnterpriseDetail | null {
  const fromCreated = created.find((e) => e.slug === slug);
  if (fromCreated) {
    return {
      name: fromCreated.name,
      domain: fromCreated.domain,
      slug: fromCreated.slug,
      location: fromCreated.location,
      plan: fromCreated.plan,
      status: fromCreated.status,
      joined: fromCreated.joinedAt,
      users: fromCreated.seats,
      jobs: 0,
      candidates: 0,
      seats: fromCreated.seats,
      industry: "IT Services",
      monthlyAssessments: "0",
      numberOfEmployees: String(fromCreated.seats),
      baseDomain: `${fromCreated.slug}.zecode.app`,
      adminName: fromCreated.adminName,
      adminEmail: fromCreated.adminEmail,
      logoUrl: null,
      faviconUrl: null,
    };
  }

  const fromMock = zeMock.enterprises.list.find(
    (e) => domainToSlug(e.domain) === slug,
  );
  if (fromMock) {
    return mockToDetail(fromMock);
  }

  return null;
}

function mockToDetail(e: EnterpriseListItem): EnterpriseDetail {
  const slug = domainToSlug(e.domain);
  const h = hashCode(e.name);
  return {
    name: e.name,
    domain: e.domain,
    slug,
    location: e.location,
    plan: e.plan,
    status: e.status,
    joined: e.joined,
    users: e.users,
    jobs: e.jobs,
    candidates: e.candidates,
    seats: seeded(h, e.users, e.users + 50),
    industry: ["IT Services", "Product Company", "Healthcare", "Finance"][h % 4],
    monthlyAssessments: String(seeded(h + 1, 100, 800)),
    numberOfEmployees: String(seeded(h + 2, 50, 500)),
    baseDomain: `${slug}.zecode.app`,
    adminName: ["Marcus Chen", "Ava Patel", "Lina Hoffmann"][h % 3],
    adminEmail: `admin@${e.domain}`,
    logoUrl: null,
    faviconUrl: null,
  };
}

// ── KPIs ──

export function generateKpis(e: EnterpriseDetail): EnterpriseKpi[] {
  const h = hashCode(e.name);
  return [
    { label: "Interviews Scheduled", value: seeded(h, 80, 500), subtitle: "All time", icon: "calendar" },
    { label: "Assessments Conducted", value: seeded(h + 10, 100, 800), subtitle: "All time", icon: "clipboard" },
    { label: "Invited Candidates", value: e.candidates || seeded(h + 20, 50, 400), subtitle: "All time", icon: "users" },
    { label: "Evaluated Candidates", value: seeded(h + 30, 40, 350), subtitle: "All time", icon: "check" },
    { label: "Qualified Candidates", value: seeded(h + 40, 20, 200), subtitle: "All time", icon: "flag" },
  ];
}

// ── Users ──

const MOCK_USERS: Omit<EnterpriseUser, "id">[] = [
  { name: "Marcus Chen", email: "marcus@novatech.com", role: "Super Admin", status: "Active", lastActive: "2 hours ago" },
  { name: "Ava Patel", email: "ava@novatech.com", role: "Admin", status: "Active", lastActive: "5 hours ago" },
  { name: "Noah Singh", email: "noah@novatech.com", role: "Recruiter", status: "Active", lastActive: "1 day ago" },
  { name: "Lina Hoffmann", email: "lina@novatech.com", role: "Hiring Manager", status: "Active", lastActive: "3 hours ago" },
  { name: "Maya Torres", email: "maya@novatech.com", role: "Interviewer", status: "Pending", lastActive: "Never" },
  { name: "James Wright", email: "james@novatech.com", role: "Evaluator", status: "Active", lastActive: "12 hours ago" },
];

export function generateUsers(e: EnterpriseDetail): EnterpriseUser[] {
  const count = e.candidates > 0 ? Math.min(6, Math.max(3, Math.floor(e.users / 15))) : 2;
  return MOCK_USERS.slice(0, count).map((u, i) => ({
    ...u,
    id: `user-${i}`,
    email: u.email.replace("novatech.com", e.domain),
  }));
}

// ── Activity ──

export function generateActivity(e: EnterpriseDetail): ActivityItem[] {
  const base: ActivityItem[] = [
    { id: "a1", action: "Enterprise created", timestamp: e.joined, icon: "building" },
    { id: "a2", action: `${e.adminName || "Admin"} invited as Super Admin`, timestamp: e.joined, icon: "user" },
    { id: "a3", action: "Interviews module enabled", timestamp: e.joined, icon: "toggle" },
    { id: "a4", action: "Assessments module enabled", timestamp: e.joined, icon: "toggle" },
    { id: "a5", action: "Localization settings updated", timestamp: "2026-05-10", icon: "globe" },
    { id: "a6", action: "Question bank imported (124 questions)", timestamp: "2026-05-15", icon: "upload" },
    { id: "a7", action: "Proctoring configuration updated", timestamp: "2026-05-22", icon: "shield" },
    { id: "a8", action: "Assessment drive created", timestamp: "2026-06-01", icon: "clipboard" },
    { id: "a9", action: "Data migration completed", timestamp: "2026-06-08", icon: "truck" },
  ];
  return e.candidates > 0 ? base : base.slice(0, 4);
}

// ── Plan & Billing ──

export function generatePlanBilling(e: EnterpriseDetail): PlanBillingInfo {
  const planMap: Record<string, string> = {
    Enterprise: "Enterprise Pro",
    Growth: "Growth",
    Starter: "Free Trial",
  };
  return {
    plan: planMap[e.plan] || e.plan,
    duration: e.status === "Trial" ? "14-day trial" : "Annual",
    seats: e.seats,
    expiryDate: e.status === "Trial" ? "2026-07-15" : "2027-06-22",
    paymentMethod: e.status === "Trial" ? "None" : "Visa",
    lastFour: e.status === "Trial" ? "—" : "4242",
  };
}

// ── Feature Usage ──

export function generateFeatureUsage(e: EnterpriseDetail): FeatureUsageItem[] {
  const h = hashCode(e.name);
  return [
    { label: "Interviews", current: seeded(h, 40, 400), limit: seeded(h + 100, 500, 1000) },
    { label: "Assessments", current: seeded(h + 1, 30, 300), limit: seeded(h + 101, 400, 500) },
    { label: "Question Pool", current: seeded(h + 2, 200, 900), limit: 2000 },
    { label: "Assessment Drives", current: seeded(h + 3, 2, 15), limit: 20 },
    { label: "Reports", current: seeded(h + 4, 10, 80), limit: 100 },
    { label: "Teams", current: Math.min(e.users, 20), limit: seeded(h + 105, 20, 50) },
  ];
}

// ── Usage Limits ──

export function generateUsageLimits(e: EnterpriseDetail): UsageLimitItem[] {
  const h = hashCode(e.name);
  return [
    { label: "Maximum Jobs", current: e.jobs, limit: seeded(h + 200, 25, 100) },
    { label: "Maximum Interviews", current: seeded(h + 201, 40, 200), limit: seeded(h + 300, 500, 1000) },
    { label: "Maximum Assessments", current: seeded(h + 202, 30, 150), limit: seeded(h + 301, 400, 500) },
    { label: "Maximum Candidates", current: e.candidates, limit: seeded(h + 302, 1000, 5000) },
    { label: "Maximum Team Members", current: e.users, limit: seeded(h + 303, 20, 100) },
    { label: "Maximum Questions", current: seeded(h + 204, 100, 800), limit: 2000 },
  ];
}

// ── Whitelisted Domains ──

export function generateWhitelistedDomains(e: EnterpriseDetail): WhitelistedDomain[] {
  if (e.candidates === 0) return [];
  return [
    { domain: e.domain, addedBy: e.adminName || "Admin", createdAt: e.joined },
    { domain: `careers.${e.domain}`, addedBy: e.adminName || "Admin", createdAt: "2026-03-15" },
  ];
}

// ── Integrations ──

export function generateIntegrations(e: EnterpriseDetail): IntegrationItem[] {
  const isRich = e.candidates > 0;
  return [
    { name: "Google Meet", connected: isRich },
    { name: "Microsoft Teams", connected: false },
    { name: "Slack", connected: isRich },
    { name: "Email", connected: true },
    { name: "SSO", connected: e.plan === "Enterprise" },
  ];
}

// ── Storage ──

export function generateStorage(e: EnterpriseDetail): StorageItem[] {
  const h = hashCode(e.name);
  return [
    { label: "Question Bank", used: seeded(h + 500, 50, 400), total: 500, unit: "MB" },
    { label: "Candidate Documents", used: seeded(h + 501, 100, 800), total: 1000, unit: "MB" },
    { label: "Reports", used: seeded(h + 502, 20, 150), total: 200, unit: "MB" },
    { label: "Attachments", used: seeded(h + 503, 30, 250), total: 500, unit: "MB" },
  ];
}

// ── Health ──

export function generateHealth(): HealthItem[] {
  return [
    { label: "Localization", status: "Operational" },
    { label: "Migration", status: "Operational" },
    { label: "Question Pool", status: "Operational" },
    { label: "Assessment Engine", status: "Operational" },
    { label: "Interview Engine", status: "Operational" },
  ];
}
