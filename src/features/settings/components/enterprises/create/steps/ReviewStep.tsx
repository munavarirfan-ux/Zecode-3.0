"use client";

import type { ReactNode } from "react";
import { ENTERPRISE_FEATURES } from "../../../../lib/createEnterprise/features";
import type { CreateEnterpriseFormState, FeatureCategory } from "../../../../lib/createEnterprise/types";
import { settingsPanel, settingsSectionTitle } from "../../../../settingsTokens";
import { cn } from "@/lib/utils";

function SummarySection({
  title,
  children,
  inModal,
}: {
  title: string;
  children: ReactNode;
  inModal?: boolean;
}) {
  return (
    <section
      className={cn(
        inModal
          ? "rounded-[14px] border border-[rgba(15,23,42,0.06)] p-4 dark:border-white/[0.06]"
          : settingsPanel,
        !inModal && "p-5",
      )}
    >
      <h3 className={settingsSectionTitle}>{title}</h3>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[11px] font-medium text-muted">{label}</dt>
      <dd className="text-[13px] font-medium text-text">{value || "—"}</dd>
    </>
  );
}

function FeaturePill({ name }: { name: string }) {
  return (
    <span className="inline-flex rounded-full bg-[rgb(var(--accent-rgb)/0.10)] px-2.5 py-0.5 text-[11px] font-medium text-accent">
      {name}
    </span>
  );
}

export function ReviewStep({
  form,
  inModal,
}: {
  form: CreateEnterpriseFormState;
  inModal?: boolean;
}) {
  const { details, features, config } = form;
  const enabled = ENTERPRISE_FEATURES.filter((f) => features[f.id]);

  const grouped = enabled.reduce<Record<FeatureCategory, string[]>>(
    (acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category].push(f.name);
      return acc;
    },
    {} as Record<FeatureCategory, string[]>,
  );

  const categoryOrder: FeatureCategory[] = ["Core", "Interview", "Assessment", "Enterprise"];

  return (
    <div className={inModal ? "space-y-3" : "space-y-4"}>
      {/* Enterprise Details */}
      <SummarySection title="Enterprise Details" inModal={inModal}>
        <Row label="Organisation Name" value={details.organisationName} />
        <Row label="Domain Name" value={details.domainName} />
        <Row label="Default Base Domain" value={details.defaultBaseDomain} />
        <Row label="Nature of Business" value={details.natureOfBusiness} />
        <Row label="Monthly average assessments" value={details.monthlyAssessments || "—"} />
        <Row label="Number of Employees" value={details.numberOfEmployees || "—"} />
        <Row label="Location" value={details.location} />
      </SummarySection>

      {/* SPOC Details */}
      <SummarySection title="SPOC Details" inModal={inModal}>
        <Row label="SPOC Name" value={details.spocName} />
        <Row label="SPOC Email ID" value={details.spocEmail} />
        <Row
          label="SPOC Mobile No"
          value={
            details.spocPhone
              ? `${details.spocPhoneCountry} ${details.spocPhone}`
              : "—"
          }
        />
      </SummarySection>

      {/* Branding Assets */}
      <SummarySection title="Branding Assets" inModal={inModal}>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          {details.logoUrl ? (
            <img src={details.logoUrl} alt="" className="h-10 max-w-[140px] object-contain" />
          ) : (
            <span className="text-[12px] text-muted">No logo uploaded</span>
          )}
          {details.faviconUrl ? (
            <div className="flex items-center gap-2 rounded-md border border-[rgba(15,23,42,0.08)] px-2 py-1">
              <img src={details.faviconUrl} alt="" className="h-5 w-5 object-contain" />
              <span className="text-[11px] text-muted">Favicon</span>
            </div>
          ) : (
            <span className="text-[12px] text-muted">No favicon</span>
          )}
        </div>
      </SummarySection>

      {/* Enabled Features */}
      <section
        className={cn(
          inModal
            ? "rounded-[14px] border border-[rgba(15,23,42,0.06)] p-4 dark:border-white/[0.06]"
            : settingsPanel,
          !inModal && "p-5",
        )}
      >
        <h3 className={settingsSectionTitle}>Enabled Features</h3>
        {enabled.length === 0 ? (
          <p className="mt-3 text-[13px] text-muted">No features enabled.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {categoryOrder.map((cat) => {
              const names = grouped[cat];
              if (!names?.length) return null;
              return (
                <div key={cat}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">{cat}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {names.map((n) => (
                      <FeaturePill key={n} name={n} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature Configuration */}
      <SummarySection title="Feature Configuration" inModal={inModal}>
        {features.jobs && (
          <>
            <Row label="Max active jobs" value={String(config.jobs.maxActiveJobs)} />
            <Row label="Default job visibility" value={config.jobs.defaultJobVisibility} />
          </>
        )}
        {features.interviews && (
          <>
            <Row label="Monthly interviews" value={String(config.interviews.monthlyLimit)} />
            <Row label="Default interview duration" value={`${config.interviews.defaultDuration} min`} />
          </>
        )}
        {features.assessments && (
          <>
            <Row label="Monthly assessments" value={String(config.assessments.monthlyLimit)} />
            <Row label="Qualifying percentage" value={`${config.assessments.qualifyingPercentage}%`} />
          </>
        )}
        {features["candidate-directory"] && (
          <Row label="Max candidates" value={String(config.candidateDirectory.maxCandidates)} />
        )}
        {features["manage-teams"] && (
          <Row label="Max team members" value={String(config.teams.maxTeamMembers)} />
        )}
        {features["question-pool"] && (
          <Row label="Max questions" value={String(config.questionPool.maxQuestions)} />
        )}
        {features["assessment-drive"] && (
          <Row label="Max drives/month" value={String(config.assessmentDrive.maxDrivesPerMonth)} />
        )}
      </SummarySection>

      {/* Security / Access Summary */}
      <SummarySection title="Security / Access Summary" inModal={inModal}>
        <Row
          label="Proctoring"
          value={
            features.proctoring
              ? [
                  config.proctoring.cameraMonitoring && "Camera",
                  config.proctoring.tabSwitchDetection && "Tab switch",
                  config.proctoring.copyDetection && "Copy",
                  config.proctoring.movementDetection && "Movement",
                ]
                  .filter(Boolean)
                  .join(", ") || "All disabled"
              : "Not enabled"
          }
        />
        <Row
          label="Allowed roles"
          value={
            features["manage-teams"]
              ? config.teams.allowedRoles.join(", ")
              : "Not configured"
          }
        />
        <Row
          label="White labelling"
          value={features["white-labelling"] ? "Enabled" : "Disabled"}
        />
        <Row
          label="Migration tools"
          value={
            features.migration && config.platformSettings.enableMigrationTools
              ? "Enabled"
              : "Disabled"
          }
        />
      </SummarySection>
    </div>
  );
}
