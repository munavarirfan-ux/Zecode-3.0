"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  AutoSubmitInterviewConfig,
  CountPlanConfig,
  EndInterviewConfig,
  FeatureConfigState,
  ImportQuestionsConfig,
  LimitPlanConfig,
  PlanType,
  ProctoringConfig,
  WhiteLabellingConfig,
} from "../../../../lib/createEnterprise/types";
import { totalLimit } from "../../../../lib/createEnterprise/defaults";
import {
  settingsAccentBgHover,
  settingsFieldLabel,
  settingsSecondaryBtn,
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

function PlanSelect({
  value,
  onChange,
  options = ["Standard", "Professional", "Custom"] as PlanType[],
}: {
  value: PlanType;
  onChange: (v: PlanType) => void;
  options?: PlanType[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className={settingsFieldLabel}>Plan Type</span>
      <select className={formInputClass} value={value} onChange={(e) => onChange(e.target.value as PlanType)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
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

function LimitPlanFields({
  config,
  onChange,
  totalLabel,
  addLabel,
}: {
  config: LimitPlanConfig;
  onChange: (patch: Partial<LimitPlanConfig>) => void;
  totalLabel: string;
  addLabel: string;
}) {
  const total = totalLimit(config);
  return (
    <>
      <PlanSelect value={config.planType} onChange={(planType) => onChange({ planType })} />
      <label className="block space-y-1.5">
        <span className={settingsFieldLabel}>Candidates Included</span>
        <input
          type="number"
          min={0}
          className={formInputClass}
          value={config.candidatesIncluded}
          onChange={(e) => onChange({ candidatesIncluded: Math.max(0, Number(e.target.value) || 0) })}
        />
      </label>
      <label className="block space-y-1.5">
        <span className={settingsFieldLabel}>Additionally Added</span>
        <input
          type="number"
          min={0}
          className={formInputClass}
          value={config.additionallyAdded}
          onChange={(e) => onChange({ additionallyAdded: Math.max(0, Number(e.target.value) || 0) })}
        />
      </label>
      <div className="rounded-[10px] bg-[rgba(15,23,42,0.04)] px-3 py-2 dark:bg-white/[0.04]">
        <p className="text-[10px] font-medium text-muted">{totalLabel}</p>
        <p className="text-[15px] font-semibold tabular-nums text-text">{total}</p>
      </div>
      <button
        type="button"
        className={cn(settingsSecondaryBtn, "w-full justify-center")}
        onClick={() => onChange({ additionallyAdded: config.additionallyAdded + 25 })}
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </>
  );
}

export function AssessmentsConfigCard({
  config,
  onChange,
}: {
  config: LimitPlanConfig;
  onChange: (patch: Partial<LimitPlanConfig>) => void;
}) {
  return (
    <ConfigCard title="Assessments" description="Candidate limits and plan tier for assessments.">
      <LimitPlanFields
        config={config}
        onChange={onChange}
        totalLabel="Total Assessment Limit"
        addLabel="Add candidates"
      />
    </ConfigCard>
  );
}

export function InterviewsConfigCard({
  config,
  onChange,
}: {
  config: LimitPlanConfig;
  onChange: (patch: Partial<LimitPlanConfig>) => void;
}) {
  return (
    <ConfigCard title="Interviews" description="Interview capacity and plan tier.">
      <LimitPlanFields
        config={config}
        onChange={onChange}
        totalLabel="Total Interview Limit"
        addLabel="Add interview count"
      />
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
    <ConfigCard title="Proctoring" description="Integrity monitoring options.">
      <PlanSelect value={config.planType} onChange={(planType) => onChange({ planType })} options={["Standard", "Custom"]} />
      <ToggleRow label="Enable camera monitoring" checked={config.cameraMonitoring} onChange={(v) => onChange({ cameraMonitoring: v })} />
      <ToggleRow label="Enable tab switch detection" checked={config.tabSwitchDetection} onChange={(v) => onChange({ tabSwitchDetection: v })} />
      <ToggleRow label="Enable copy detection" checked={config.copyDetection} onChange={(v) => onChange({ copyDetection: v })} />
      <ToggleRow label="Enable movement detection" checked={config.movementDetection} onChange={(v) => onChange({ movementDetection: v })} />
    </ConfigCard>
  );
}

export function WhiteLabellingConfigCard({
  config,
  onChange,
}: {
  config: WhiteLabellingConfig;
  onChange: (patch: Partial<WhiteLabellingConfig>) => void;
}) {
  return (
    <ConfigCard title="White Labelling" description="Branding controls on candidate surfaces.">
      <PlanSelect value={config.planType} onChange={(planType) => onChange({ planType })} options={["Standard", "Custom"]} />
      <ToggleRow label="Enable white labelling" checked={config.enabled} onChange={(v) => onChange({ enabled: v })} />
      <ToggleRow label="Custom logo allowed" checked={config.customLogo} onChange={(v) => onChange({ customLogo: v })} />
      <ToggleRow label="Custom favicon allowed" checked={config.customFavicon} onChange={(v) => onChange({ customFavicon: v })} />
      <ToggleRow label="Custom theme allowed" checked={config.customTheme} onChange={(v) => onChange({ customTheme: v })} />
    </ConfigCard>
  );
}

export function ImportQuestionsConfigCard({
  config,
  onChange,
}: {
  config: ImportQuestionsConfig;
  onChange: (patch: Partial<ImportQuestionsConfig>) => void;
}) {
  const setSource = (key: keyof ImportQuestionsConfig["sources"], v: boolean) =>
    onChange({ sources: { ...config.sources, [key]: v } });

  return (
    <ConfigCard title="Import Questions" description="Allowed external import sources.">
      <PlanSelect value={config.planType} onChange={(planType) => onChange({ planType })} options={["Standard", "Custom"]} />
      <p className={settingsFieldLabel}>Allowed import sources</p>
      {(
        [
          ["csv", "CSV"],
          ["hackerRank", "HackerRank"],
          ["codeSignal", "CodeSignal"],
          ["mettl", "Mettl"],
          ["customApi", "Custom API"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="flex items-center gap-2 text-[12px] text-text">
          <input
            type="checkbox"
            checked={config.sources[key]}
            onChange={(e) => setSource(key, e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          {label}
        </label>
      ))}
    </ConfigCard>
  );
}

export function CountPlanCard({
  title,
  description,
  config,
  onChange,
  monthlyLabel,
  concurrentLabel,
}: {
  title: string;
  description: string;
  config: CountPlanConfig;
  onChange: (patch: Partial<CountPlanConfig>) => void;
  monthlyLabel: string;
  concurrentLabel: string;
}) {
  return (
    <ConfigCard title={title} description={description}>
      <PlanSelect value={config.planType} onChange={(planType) => onChange({ planType })} options={["Standard", "Custom"]} />
      <label className="block space-y-1.5">
        <span className={settingsFieldLabel}>{monthlyLabel}</span>
        <input
          type="number"
          min={0}
          className={formInputClass}
          value={config.monthlyCount}
          onChange={(e) => onChange({ monthlyCount: Math.max(0, Number(e.target.value) || 0) })}
        />
      </label>
      <label className="block space-y-1.5">
        <span className={settingsFieldLabel}>{concurrentLabel}</span>
        <input
          type="number"
          min={0}
          className={formInputClass}
          value={config.maxConcurrent}
          onChange={(e) => onChange({ maxConcurrent: Math.max(0, Number(e.target.value) || 0) })}
        />
      </label>
    </ConfigCard>
  );
}

export function EndInterviewConfigCard({
  config,
  onChange,
}: {
  config: EndInterviewConfig;
  onChange: (patch: Partial<EndInterviewConfig>) => void;
}) {
  return (
    <ConfigCard title="End Interview" description="Who can end an interview session.">
      <PlanSelect value={config.planType} onChange={(planType) => onChange({ planType })} options={["Standard", "Custom"]} />
      <ToggleRow label="Allow interviewer to end interview" checked={config.interviewerCanEnd} onChange={(v) => onChange({ interviewerCanEnd: v })} />
      <ToggleRow label="Allow admin forced end" checked={config.adminForcedEnd} onChange={(v) => onChange({ adminForcedEnd: v })} />
    </ConfigCard>
  );
}

export function AutoSubmitInterviewConfigCard({
  config,
  onChange,
}: {
  config: AutoSubmitInterviewConfig;
  onChange: (patch: Partial<AutoSubmitInterviewConfig>) => void;
}) {
  return (
    <ConfigCard title="Auto Submit Interview" description="Automatic submission after inactivity.">
      <PlanSelect value={config.planType} onChange={(planType) => onChange({ planType })} options={["Standard", "Custom"]} />
      <label className="block space-y-1.5">
        <span className={settingsFieldLabel}>Auto submit time for interviewer (minutes)</span>
        <input
          type="number"
          min={1}
          className={formInputClass}
          value={config.autoSubmitMinutes}
          onChange={(e) => onChange({ autoSubmitMinutes: Math.max(1, Number(e.target.value) || 1) })}
        />
      </label>
    </ConfigCard>
  );
}

export type ConfigPatch = Partial<FeatureConfigState>;

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
