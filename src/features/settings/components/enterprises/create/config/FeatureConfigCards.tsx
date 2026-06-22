"use client";

import type { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  AssessmentConfig,
  AssessmentDriveConfig,
  BrandingConfig,
  CandidateDirectoryConfig,
  FeatureConfigState,
  GoogleMeetConfig,
  InterviewsConfig,
  JobsConfig,
  PlatformSettingsConfig,
  ProctoringConfig,
  QuestionPoolConfig,
  ReportsConfig,
  TeamsConfig,
  ZemeetConfig,
} from "../../../../lib/createEnterprise/types";
import {
  settingsFieldLabel,
  settingsSectionDesc,
  settingsSectionTitle,
} from "../../../../settingsTokens";
import { formInputClass } from "../CreateEnterpriseFormPrimitives";

function ConfigCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="flex h-full flex-col rounded-[14px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <h3 className={settingsSectionTitle}>{title}</h3>
      <p className={cn(settingsSectionDesc, "mt-1")}>{description}</p>
      <div className="mt-4 flex flex-1 flex-col gap-3">{children}</div>
    </article>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(15,23,42,0.06)] px-3 py-2 dark:border-white/[0.06]">
      <span className="text-[12px] font-medium text-text">{label}</span>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:border-accent/30 data-[state=checked]:bg-accent"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={settingsFieldLabel}>{label}</span>
      <input
        type="number"
        min={min}
        className={formInputClass}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || min))}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className={settingsFieldLabel}>{label}</span>
      <select
        className={formInputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block space-y-1.5">
      <span className={settingsFieldLabel}>{label}</span>
      <input type="text" readOnly className={cn(formInputClass, "cursor-default opacity-70")} value={value} />
    </label>
  );
}

// ── Config Cards ──

export function JobsConfigCard({
  config,
  onChange,
}: {
  config: JobsConfig;
  onChange: (patch: Partial<JobsConfig>) => void;
}) {
  return (
    <ConfigCard title="Jobs Configuration" description="Limits and defaults for job postings.">
      <NumberField label="Max active jobs" value={config.maxActiveJobs} onChange={(v) => onChange({ maxActiveJobs: v })} min={1} />
      <SelectField
        label="Default job visibility"
        value={config.defaultJobVisibility}
        onChange={(v) => onChange({ defaultJobVisibility: v as JobsConfig["defaultJobVisibility"] })}
        options={[
          { value: "Public", label: "Public" },
          { value: "Private", label: "Private" },
          { value: "Internal", label: "Internal" },
        ]}
      />
      <ToggleRow label="Require approval before publishing" checked={config.requireApproval} onChange={(v) => onChange({ requireApproval: v })} />
    </ConfigCard>
  );
}

export function CandidateDirectoryConfigCard({
  config,
  onChange,
}: {
  config: CandidateDirectoryConfig;
  onChange: (patch: Partial<CandidateDirectoryConfig>) => void;
}) {
  return (
    <ConfigCard title="Candidate Directory Configuration" description="Candidate visibility and limits.">
      <NumberField label="Max candidates" value={config.maxCandidates} onChange={(v) => onChange({ maxCandidates: v })} min={1} />
      <SelectField
        label="Candidate visibility"
        value={config.candidateVisibility}
        onChange={(v) => onChange({ candidateVisibility: v as CandidateDirectoryConfig["candidateVisibility"] })}
        options={[
          { value: "All team", label: "All team" },
          { value: "Assigned users only", label: "Assigned users only" },
        ]}
      />
      <ToggleRow label="Allow duplicate candidates" checked={config.allowDuplicates} onChange={(v) => onChange({ allowDuplicates: v })} />
    </ConfigCard>
  );
}

export function InterviewsConfigCard({
  config,
  onChange,
}: {
  config: InterviewsConfig;
  onChange: (patch: Partial<InterviewsConfig>) => void;
}) {
  return (
    <ConfigCard title="Interviews Configuration" description="Interview scheduling and limits.">
      <NumberField label="Monthly interview limit" value={config.monthlyLimit} onChange={(v) => onChange({ monthlyLimit: v })} min={1} />
      <SelectField
        label="Default interview duration"
        value={String(config.defaultDuration)}
        onChange={(v) => onChange({ defaultDuration: Number(v) as InterviewsConfig["defaultDuration"] })}
        options={[
          { value: "30", label: "30 minutes" },
          { value: "45", label: "45 minutes" },
          { value: "60", label: "60 minutes" },
          { value: "90", label: "90 minutes" },
        ]}
      />
      <ToggleRow label="Allow reschedule requests" checked={config.allowReschedule} onChange={(v) => onChange({ allowReschedule: v })} />
      <ToggleRow label="Require Super Admin approval to move to interview" checked={config.requireApproval} onChange={(v) => onChange({ requireApproval: v })} />
    </ConfigCard>
  );
}

export function GoogleMeetConfigCard({
  config,
  onChange,
}: {
  config: GoogleMeetConfig;
  onChange: (patch: Partial<GoogleMeetConfig>) => void;
}) {
  return (
    <ConfigCard title="Google Meet Integration" description="Meeting link configuration.">
      <ToggleRow label="Auto-generate Google Meet link" checked={config.autoGenerateLink} onChange={(v) => onChange({ autoGenerateLink: v })} />
      <ReadOnlyField label="Default meeting provider" value="Google Meet" />
    </ConfigCard>
  );
}

export function ZemeetConfigCard({
  config,
  onChange,
}: {
  config: ZemeetConfig;
  onChange: (patch: Partial<ZemeetConfig>) => void;
}) {
  return (
    <ConfigCard title="ze[meet] Interview Workspace" description="Interview workspace tools.">
      <ToggleRow label="Enable code challenge button" checked={config.enableCodeChallenge} onChange={(v) => onChange({ enableCodeChallenge: v })} />
      <ToggleRow label="Enable resume button" checked={config.enableResume} onChange={(v) => onChange({ enableResume: v })} />
      <ToggleRow label="Enable LinkedIn button" checked={config.enableLinkedIn} onChange={(v) => onChange({ enableLinkedIn: v })} />
      <ToggleRow label="Enable private notes" checked={config.enablePrivateNotes} onChange={(v) => onChange({ enablePrivateNotes: v })} />
    </ConfigCard>
  );
}

export function AssessmentsConfigCard({
  config,
  onChange,
}: {
  config: AssessmentConfig;
  onChange: (patch: Partial<AssessmentConfig>) => void;
}) {
  return (
    <ConfigCard title="Assessment Configuration" description="Assessment limits and defaults.">
      <NumberField label="Monthly assessment limit" value={config.monthlyLimit} onChange={(v) => onChange({ monthlyLimit: v })} min={1} />
      <NumberField label="Default assessment duration (minutes)" value={config.defaultDuration} onChange={(v) => onChange({ defaultDuration: v })} min={1} />
      <NumberField label="Default assessment validity (days)" value={config.defaultValidityDays} onChange={(v) => onChange({ defaultValidityDays: v })} min={1} />
      <NumberField label="Qualifying percentage" value={config.qualifyingPercentage} onChange={(v) => onChange({ qualifyingPercentage: Math.min(100, v) })} min={0} />
    </ConfigCard>
  );
}

export function AssessmentDriveConfigCard({
  config,
  onChange,
}: {
  config: AssessmentDriveConfig;
  onChange: (patch: Partial<AssessmentDriveConfig>) => void;
}) {
  return (
    <ConfigCard title="Assessment Drive Configuration" description="Bulk assessment drive settings.">
      <NumberField label="Max scheduled drives per month" value={config.maxDrivesPerMonth} onChange={(v) => onChange({ maxDrivesPerMonth: v })} min={1} />
      <NumberField label="Max candidates per drive" value={config.maxCandidatesPerDrive} onChange={(v) => onChange({ maxCandidatesPerDrive: v })} min={1} />
      <ToggleRow label="Enable live monitoring" checked={config.enableLiveMonitoring} onChange={(v) => onChange({ enableLiveMonitoring: v })} />
    </ConfigCard>
  );
}

export function ProctoringConfigCard({
  config,
  onChange,
}: {
  config: ProctoringConfig;
  onChange: (patch: Partial<ProctoringConfig>) => void;
}) {
  return (
    <ConfigCard title="Proctoring Configuration" description="Integrity monitoring options.">
      <ToggleRow label="Camera monitoring" checked={config.cameraMonitoring} onChange={(v) => onChange({ cameraMonitoring: v })} />
      <ToggleRow label="Tab switch detection" checked={config.tabSwitchDetection} onChange={(v) => onChange({ tabSwitchDetection: v })} />
      <ToggleRow label="Copy detection" checked={config.copyDetection} onChange={(v) => onChange({ copyDetection: v })} />
      <ToggleRow label="Movement detection" checked={config.movementDetection} onChange={(v) => onChange({ movementDetection: v })} />
    </ConfigCard>
  );
}

export function QuestionPoolConfigCard({
  config,
  onChange,
}: {
  config: QuestionPoolConfig;
  onChange: (patch: Partial<QuestionPoolConfig>) => void;
}) {
  return (
    <ConfigCard title="Question Pool Configuration" description="Question library settings.">
      <NumberField label="Max questions" value={config.maxQuestions} onChange={(v) => onChange({ maxQuestions: v })} min={1} />
      <ToggleRow label="Allow custom questions" checked={config.allowCustomQuestions} onChange={(v) => onChange({ allowCustomQuestions: v })} />
      <ToggleRow label="Allow import questions" checked={config.allowImportQuestions} onChange={(v) => onChange({ allowImportQuestions: v })} />
    </ConfigCard>
  );
}

export function ReportsConfigCard({
  config,
  onChange,
}: {
  config: ReportsConfig;
  onChange: (patch: Partial<ReportsConfig>) => void;
}) {
  return (
    <ConfigCard title="Reports Configuration" description="Reporting and export options.">
      <ToggleRow label="Enable export reports" checked={config.enableExportReports} onChange={(v) => onChange({ enableExportReports: v })} />
      <ToggleRow label="Enable candidate report sharing" checked={config.enableCandidateReportSharing} onChange={(v) => onChange({ enableCandidateReportSharing: v })} />
    </ConfigCard>
  );
}

const ALL_ROLES = [
  "Super Admin",
  "Admin",
  "Recruiter",
  "Hiring Manager",
  "Interviewer",
  "Evaluator",
  "Curator",
  "Viewer",
];

export function TeamsConfigCard({
  config,
  onChange,
}: {
  config: TeamsConfig;
  onChange: (patch: Partial<TeamsConfig>) => void;
}) {
  const toggleRole = (role: string) => {
    const roles = config.allowedRoles.includes(role)
      ? config.allowedRoles.filter((r) => r !== role)
      : [...config.allowedRoles, role];
    onChange({ allowedRoles: roles });
  };

  return (
    <ConfigCard title="Teams Configuration" description="Team size and role access.">
      <NumberField label="Max team members" value={config.maxTeamMembers} onChange={(v) => onChange({ maxTeamMembers: v })} min={1} />
      <div className="space-y-1.5">
        <span className={settingsFieldLabel}>Allowed roles</span>
        <div className="flex flex-wrap gap-1.5">
          {ALL_ROLES.map((role) => {
            const active = config.allowedRoles.includes(role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-accent/30 bg-[rgb(var(--accent-rgb)/0.12)] text-accent"
                    : "border-[rgba(15,23,42,0.08)] bg-white text-muted hover:bg-[rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:bg-white/[0.04]",
                )}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>
    </ConfigCard>
  );
}

export function BrandingConfigCard({
  config,
  onChange,
}: {
  config: BrandingConfig;
  onChange: (patch: Partial<BrandingConfig>) => void;
}) {
  return (
    <ConfigCard title="Branding Configuration" description="Logo, favicon, and theme controls.">
      <ToggleRow label="Allow logo upload" checked={config.allowLogoUpload} onChange={(v) => onChange({ allowLogoUpload: v })} />
      <ToggleRow label="Allow favicon upload" checked={config.allowFaviconUpload} onChange={(v) => onChange({ allowFaviconUpload: v })} />
      <ToggleRow label="Allow custom theme colors" checked={config.allowCustomThemeColors} onChange={(v) => onChange({ allowCustomThemeColors: v })} />
    </ConfigCard>
  );
}

export function PlatformSettingsConfigCard({
  config,
  onChange,
}: {
  config: PlatformSettingsConfig;
  onChange: (patch: Partial<PlatformSettingsConfig>) => void;
}) {
  return (
    <ConfigCard title="Platform Settings Configuration" description="Localization and migration tools.">
      <ToggleRow label="Enable localization" checked={config.enableLocalization} onChange={(v) => onChange({ enableLocalization: v })} />
      <ToggleRow label="Enable migration tools" checked={config.enableMigrationTools} onChange={(v) => onChange({ enableMigrationTools: v })} />
    </ConfigCard>
  );
}

export function patchConfig(
  config: FeatureConfigState,
  key: keyof FeatureConfigState,
  patch: Partial<FeatureConfigState[typeof key]>,
): FeatureConfigState {
  return {
    ...config,
    [key]: { ...config[key], ...patch },
  };
}
