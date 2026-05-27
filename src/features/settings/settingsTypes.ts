import type { PreviewRole } from "@/config/previewRole";

export type SettingsScope = "platform" | "enterprise" | "personal";

export type SettingsNavItem = {
  id: string;
  label: string;
  href: string;
  scope: SettingsScope;
  scopeLabel: string;
  roles: PreviewRole[];
};

export type SettingsNavGroup = {
  id: SettingsScope;
  label: string;
  items: SettingsNavItem[];
};

export type MigrationConnectionStatus = "connected" | "not_connected" | "failed" | "in_progress";

export type MigrationRunStatus = "success" | "failed" | "running" | "queued";

export type MigrationSource = {
  id: string;
  name: string;
  description: string;
  status: MigrationConnectionStatus;
  lastSync?: string;
  icon: "hackerrank" | "codesignal" | "leetcode" | "mettl" | "csv" | "api";
};

export type MigrationHistoryItem = {
  id: string;
  name: string;
  source: string;
  executedAt: string;
  status: MigrationRunStatus;
  affectedRecords: number;
  executedBy: string;
  duration?: string;
  logOutput?: string;
  errors?: string[];
};

export type LocalizationCategory =
  | "sidebar"
  | "dashboard"
  | "jobs"
  | "interviews"
  | "assessments"
  | "question-pool"
  | "candidates"
  | "enterprises"
  | "settings"
  | "login";

export type LocalizationEntry = {
  key: string;
  label: string;
  value: string;
  defaultValue: string;
  helper?: string;
};

export type LocalizationFilter = "all" | "modified" | "missing" | "completed";
