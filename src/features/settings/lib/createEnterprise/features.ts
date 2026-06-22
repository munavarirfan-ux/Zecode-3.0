import type { FeatureCategory, FeatureId } from "./types";

export type EnterpriseFeatureDef = {
  id: FeatureId;
  name: string;
  description: string;
  category: FeatureCategory;
  dependsOn?: FeatureId[];
  disabledWhen?: FeatureId[];
  warningWhenOff?: string;
};

export const ENTERPRISE_FEATURES: EnterpriseFeatureDef[] = [
  // ── Core ──
  { id: "jobs", name: "Jobs", description: "Create, publish, and manage job postings.", category: "Core" },
  { id: "candidate-directory", name: "Candidate Directory", description: "Search and manage candidate profiles.", category: "Core" },
  { id: "interviews", name: "Interviews", description: "Schedule, conduct, and manage interview workflows.", category: "Core" },
  { id: "assessments", name: "Assessments", description: "Create and deliver technical assessments.", category: "Core" },
  { id: "assessment-drive", name: "Assessment Drive", description: "Bulk assessment campaigns and drives.", category: "Core", disabledWhen: ["assessments"] },
  { id: "question-pool", name: "Question Pool", description: "Central library of reusable questions.", category: "Core" },
  { id: "reports", name: "Reports", description: "Hiring analytics and exportable reports.", category: "Core" },
  { id: "settings", name: "Settings", description: "Enterprise-level configuration access.", category: "Core" },

  // ── Interview ──
  { id: "interview-scheduling", name: "Interview Scheduling", description: "Schedule and coordinate interview panels.", category: "Interview", disabledWhen: ["interviews"] },
  { id: "google-meet-integration", name: "Google Meet Integration", description: "Auto-generate Google Meet links for interviews.", category: "Interview", disabledWhen: ["interviews"] },
  { id: "zemeet-workspace", name: "ze[meet] Interview Workspace", description: "Video interview rooms and collaboration tools.", category: "Interview", disabledWhen: ["interviews"] },
  { id: "code-challenge", name: "Code Challenge", description: "Live coding challenges during interviews.", category: "Interview", disabledWhen: ["interviews"] },
  { id: "private-notes", name: "Private Notes", description: "Interviewer-only private notes during sessions.", category: "Interview", disabledWhen: ["interviews"] },
  { id: "interview-feedback", name: "Interview Feedback", description: "Structured feedback forms after interviews.", category: "Interview", disabledWhen: ["interviews"] },
  { id: "end-interview", name: "End Interview", description: "End interviews manually or by policy.", category: "Interview", disabledWhen: ["interviews"] },
  { id: "auto-submit-interview", name: "Auto Submit Feedback", description: "Automatically submit feedback after timeout.", category: "Interview", disabledWhen: ["interviews"] },

  // ── Assessment ──
  { id: "create-assessment", name: "Create Assessment", description: "Build new assessments from templates.", category: "Assessment", disabledWhen: ["assessments"] },
  { id: "assessment-edit", name: "Edit Assessment", description: "Edit assessment content and structure.", category: "Assessment", disabledWhen: ["assessments"] },
  { id: "assessment-delete", name: "Delete Assessment", description: "Archive or delete assessments.", category: "Assessment", disabledWhen: ["assessments"] },
  { id: "assessment-share-report", name: "Share Assessment Report", description: "Share assessment reports with stakeholders.", category: "Assessment", disabledWhen: ["assessments"] },
  { id: "live-monitoring", name: "Live Assessment Monitoring", description: "Real-time session monitoring dashboards.", category: "Assessment", disabledWhen: ["assessments"] },
  { id: "proctoring", name: "Proctoring", description: "Integrity monitoring during assessments.", category: "Assessment", disabledWhen: ["assessments"] },
  { id: "import-questions", name: "Import Questions", description: "Import questions from external sources.", category: "Assessment", disabledWhen: ["assessments", "question-pool"] },

  // ── Enterprise ──
  { id: "manage-teams", name: "Manage Teams", description: "Invite members and manage workspace teams.", category: "Enterprise", disabledWhen: ["settings"], warningWhenOff: "Team invitations will not be available for this enterprise." },
  { id: "theme-configuration", name: "Theme Configuration", description: "Customize workspace theme and accents.", category: "Enterprise", disabledWhen: ["settings"] },
  { id: "white-labelling", name: "White Labelling", description: "Custom branding on candidate-facing surfaces.", category: "Enterprise", disabledWhen: ["settings"] },
  { id: "localization", name: "Localization", description: "Multi-language and regional formatting support.", category: "Enterprise", disabledWhen: ["settings"] },
  { id: "migration", name: "Migration", description: "Data import and migration tools.", category: "Enterprise", disabledWhen: ["settings"] },
];

const INTERVIEW_CHILDREN: FeatureId[] = [
  "interview-scheduling",
  "google-meet-integration",
  "zemeet-workspace",
  "code-challenge",
  "private-notes",
  "interview-feedback",
  "end-interview",
  "auto-submit-interview",
];

const ASSESSMENT_CHILDREN: FeatureId[] = [
  "assessment-drive",
  "create-assessment",
  "assessment-edit",
  "assessment-delete",
  "assessment-share-report",
  "live-monitoring",
  "proctoring",
  "import-questions",
];

const SETTINGS_CHILDREN: FeatureId[] = [
  "manage-teams",
  "theme-configuration",
  "white-labelling",
  "localization",
  "migration",
];

export function isFeatureToggleDisabled(
  featureId: FeatureId,
  features: Record<FeatureId, boolean>,
): boolean {
  const def = ENTERPRISE_FEATURES.find((f) => f.id === featureId);
  if (!def?.disabledWhen?.length) return false;
  return def.disabledWhen.some((parent) => !features[parent]);
}

export function getFeatureDependencyWarning(
  featureId: FeatureId,
  features: Record<FeatureId, boolean>,
): string | null {
  const def = ENTERPRISE_FEATURES.find((f) => f.id === featureId);
  if (def?.warningWhenOff && !features[featureId]) return def.warningWhenOff;
  if (isFeatureToggleDisabled(featureId, features)) {
    const parent = def?.disabledWhen?.find((p) => !features[p]);
    if (parent) {
      const parentName = ENTERPRISE_FEATURES.find((f) => f.id === parent)?.name ?? parent;
      return `Disabled because ${parentName} is turned off.`;
    }
  }
  return null;
}

export function applyFeatureToggle(
  featureId: FeatureId,
  enabled: boolean,
  features: Record<FeatureId, boolean>,
): Record<FeatureId, boolean> {
  const next = { ...features, [featureId]: enabled };

  if (!enabled) {
    if (featureId === "interviews") {
      for (const id of INTERVIEW_CHILDREN) next[id] = false;
    }
    if (featureId === "assessments") {
      for (const id of ASSESSMENT_CHILDREN) next[id] = false;
    }
    if (featureId === "question-pool") {
      next["import-questions"] = false;
    }
    if (featureId === "settings") {
      for (const id of SETTINGS_CHILDREN) next[id] = false;
    }
  }

  return next;
}

export function enabledFeatureCount(features: Record<FeatureId, boolean>): number {
  return ENTERPRISE_FEATURES.filter((f) => features[f.id]).length;
}

export const CORE_FEATURE_IDS: FeatureId[] = ENTERPRISE_FEATURES
  .filter((f) => f.category === "Core")
  .map((f) => f.id);
