import type { PreviewRole } from "@/config/previewRole";

export type DashboardHeroLayout = "design" | "workspace" | "evaluator" | "curator";

export type DashboardHeroKpi = {
  id: string;
  label: string;
  value: string;
  caption: string;
  trend?: string;
  trendUp?: boolean;
};

export type DashboardHeroWorkspaceSummary = {
  brandLine: string;
  region: string;
  activeTeams: string;
  hiringHealth: string;
};

export type DashboardHeroBlock = {
  layout: DashboardHeroLayout;
  topLabel: string;
  subheading: string;
  kpis: DashboardHeroKpi[];
  chips: string[];
  workspaceSummary?: DashboardHeroWorkspaceSummary;
};

export function resolveOrgDisplayName(organizationName: string | null | undefined): string {
  return organizationName?.trim() || "NovaTech";
}

function designHeroBlock(): DashboardHeroBlock {
  return {
    layout: "design",
    topLabel: "",
    subheading: "You have 4 interviews today and 12 feedback items pending review.",
    kpis: [
      { id: "interviewsToday", label: "Interviews today", value: "15", caption: "Scheduled panels", trend: "+3 today", trendUp: true },
      { id: "feedbackDue", label: "Feedback due", value: "10", caption: "Write-ups owed", trend: "3 overdue", trendUp: false },
      { id: "assessmentsProgress", label: "In progress", value: "42", caption: "Active assessments", trend: "+8 this week", trendUp: true },
      { id: "offers", label: "Offers sent", value: "09", caption: "Awaiting response", trend: "2 expiring", trendUp: false },
    ],
    chips: [],
  };
}

export function getDashboardHeroBlock(role: PreviewRole, _organizationName: string | null | undefined): DashboardHeroBlock {
  if (role === "superAdmin" || role === "admin") {
    return designHeroBlock();
  }

  if (role === "evaluator") {
    return {
      layout: "evaluator",
      topLabel: "EVALUATOR WORKSPACE",
      subheading:
        "Your interview panels and assessment queue — today's sessions, feedback you owe, and reviews in flight.",
      kpis: [
        { id: "today", label: "Interviews today", value: "3", caption: "Scheduled with you", trend: "Next 45m", trendUp: true },
        { id: "feedback", label: "Feedback due", value: "5", caption: "Write-ups outstanding", trend: "2 overdue", trendUp: false },
        { id: "ongoing", label: "Ongoing reviews", value: "28", caption: "Active assessments", trend: "12 due this week", trendUp: true },
        {
          id: "timeSpent",
          label: "Time spent this week",
          value: "8h 15m",
          caption: "Interview time",
          trend: "4 sessions",
          trendUp: true,
        },
      ],
      chips: [
        "Next panel in 45m",
        "2 candidates awaiting scorecard",
        "5 high-priority reviews due today",
        "Calibration window Thu 4pm",
      ],
    };
  }

  if (role === "curator") {
    return {
      layout: "curator",
      topLabel: "CONTENT INTELLIGENCE",
      subheading: "Question library health — creation velocity, reuse, and quality signals at a glance.",
      kpis: [
        { id: "created", label: "New this week", value: "42", caption: "Questions authored", trend: "+12 vs prior", trendUp: true },
        { id: "reuse", label: "Reuse rate", value: "68%", caption: "Live assessments", trend: "+4 pts", trendUp: true },
        { id: "lowQ", label: "Low quality", value: "37", caption: "Flagged for review", trend: "8 new flags", trendUp: false },
        { id: "archived", label: "Archived", value: "214", caption: "Retired from library", trend: "+18 quarter", trendUp: true },
      ],
      chips: ["12 drafts pending publish", "3 tracks need coverage", "Peer review queue: 8 items"],
    };
  }

  if (role === "newUser") {
    return {
      layout: "workspace",
      topLabel: "NEW USER",
      subheading: "Welcome — complete your profile and wait for workspace access from your administrator.",
      kpis: [
        { id: "setup", label: "Setup progress", value: "40%", caption: "Onboarding checklist", trend: "3 steps left", trendUp: false },
        { id: "access", label: "Modules unlocked", value: "1", caption: "Dashboard & settings", trend: "Role pending", trendUp: false },
      ],
      chips: ["Complete profile in Settings", "Review welcome guide", "Request access from admin"],
      workspaceSummary: {
        brandLine: "Ze[hub]",
        region: "Global",
        activeTeams: "—",
        hiringHealth: "Setup in progress",
      },
    };
  }

  return designHeroBlock();
}
