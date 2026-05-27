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
  { id: "interviews", name: "Interviews", description: "Schedule and run live interviews.", category: "Core" },
  { id: "assessments", name: "Assessments", description: "Create and deliver technical assessments.", category: "Core" },
  {
    id: "manage-teams",
    name: "Manage Teams",
    description: "Invite members and manage workspace teams.",
    category: "Admin",
    warningWhenOff: "Team invitations will not be available for this enterprise.",
  },
  { id: "theme-configuration", name: "Theme Configuration", description: "Customize workspace theme and accents.", category: "Platform" },
  {
    id: "interview-platform",
    name: "Interview Platform",
    description: "Video interview rooms and collaboration tools.",
    category: "Interviews",
    dependsOn: ["interviews"],
    disabledWhen: ["interviews"],
  },
  {
    id: "assessment-platform",
    name: "Assessment Platform",
    description: "Candidate assessment delivery environment.",
    category: "Assessments",
    dependsOn: ["assessments"],
    disabledWhen: ["assessments"],
  },
  {
    id: "assessment-edit",
    name: "Assessment Edit",
    description: "Edit assessment content and structure.",
    category: "Assessments",
    disabledWhen: ["assessments"],
  },
  {
    id: "assessment-delete",
    name: "Assessment Delete",
    description: "Archive or delete assessments.",
    category: "Assessments",
    disabledWhen: ["assessments"],
  },
  {
    id: "assessment-share-report",
    name: "Assessment Share Report",
    description: "Share assessment reports with stakeholders.",
    category: "Assessments",
    disabledWhen: ["assessments"],
  },
  {
    id: "create-assessment",
    name: "Create Assessment",
    description: "Build new assessments from templates.",
    category: "Assessments",
    disabledWhen: ["assessments"],
  },
  { id: "question-pool", name: "Question Pool", description: "Central library of reusable questions.", category: "Platform" },
  { id: "candidate-directory", name: "Candidate Directory", description: "Search and manage candidate profiles.", category: "Core" },
  { id: "reports", name: "Reports", description: "Hiring analytics and exportable reports.", category: "Platform" },
  { id: "settings", name: "Settings", description: "Enterprise-level configuration access.", category: "Admin" },
  {
    id: "assessment-drive",
    name: "Assessment Drive",
    description: "Bulk assessment campaigns and drives.",
    category: "Assessments",
    disabledWhen: ["assessments"],
  },
  { id: "live-monitoring", name: "Live Monitoring", description: "Real-time session monitoring dashboards.", category: "Platform" },
  { id: "proctoring", name: "Proctoring", description: "Integrity monitoring during assessments.", category: "Assessments" },
  { id: "white-labelling", name: "White Labelling", description: "Custom branding on candidate-facing surfaces.", category: "Platform" },
  { id: "import-questions", name: "Import Questions", description: "Import questions from external sources.", category: "Platform" },
  {
    id: "end-interview",
    name: "End Interview",
    description: "End interviews manually or by policy.",
    category: "Interviews",
    disabledWhen: ["interviews"],
  },
  {
    id: "auto-submit-interview",
    name: "Auto Submit Interview",
    description: "Automatically submit interviews after timeout.",
    category: "Interviews",
    disabledWhen: ["interviews"],
  },
];

const ASSESSMENT_CHILDREN: FeatureId[] = [
  "assessment-platform",
  "assessment-edit",
  "assessment-delete",
  "assessment-share-report",
  "create-assessment",
  "assessment-drive",
];

const INTERVIEW_CHILDREN: FeatureId[] = ["interview-platform", "end-interview", "auto-submit-interview"];

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
      return `Requires ${parentName} to be enabled.`;
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
    if (featureId === "assessments") {
      for (const id of ASSESSMENT_CHILDREN) next[id] = false;
    }
    if (featureId === "interviews") {
      for (const id of INTERVIEW_CHILDREN) next[id] = false;
    }
  }

  if (enabled) {
    for (const def of ENTERPRISE_FEATURES) {
      if (def.disabledWhen?.some((p) => !next[p])) next[def.id] = false;
    }
  }

  return next;
}

export function enabledFeatureCount(features: Record<FeatureId, boolean>): number {
  return ENTERPRISE_FEATURES.filter((f) => features[f.id]).length;
}
