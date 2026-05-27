"use client";

import type { ReactNode } from "react";
import { ENTERPRISE_FEATURES } from "../../../../lib/createEnterprise/features";
import { totalLimit } from "../../../../lib/createEnterprise/defaults";
import type { CreateEnterpriseFormState } from "../../../../lib/createEnterprise/types";
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

export function ReviewStep({
  form,
  inModal,
}: {
  form: CreateEnterpriseFormState;
  inModal?: boolean;
}) {
  const { details, features, config } = form;
  const enabled = ENTERPRISE_FEATURES.filter((f) => features[f.id]);

  return (
    <div className={inModal ? "space-y-3" : "space-y-4"}>
      <SummarySection title="Enterprise details" inModal={inModal}>
        <Row label="Organisation" value={details.organisationName} />
        <Row label="Domain" value={details.domainName} />
        <Row label="Base domain" value={details.defaultBaseDomain} />
        <Row label="Nature of business" value={details.natureOfBusiness} />
        <Row label="Location" value={details.location} />
        <Row label="Employees" value={details.numberOfEmployees || "—"} />
        <Row
          label="Monthly assessments"
          value={details.monthlyAssessments || "—"}
        />
      </SummarySection>

      <SummarySection title="SPOC details" inModal={inModal}>
        <Row label="Name" value={details.spocName} />
        <Row label="Email" value={details.spocEmail} />
        <Row
          label="Mobile"
          value={
            details.spocPhone
              ? `${details.spocPhoneCountry} ${details.spocPhone}`
              : "—"
          }
        />
      </SummarySection>

      <SummarySection title="Enabled features" inModal={inModal}>
        {enabled.length === 0 ? (
          <p className="text-[13px] text-muted sm:col-span-2">No features enabled.</p>
        ) : (
          enabled.map((f) => (
            <div key={f.id} className="sm:col-span-2">
              <p className="text-[13px] font-medium text-text">{f.name}</p>
              <p className="text-[11px] text-muted">{f.category}</p>
            </div>
          ))
        )}
      </SummarySection>

      {(features.assessments || features.interviews) && (
        <SummarySection title="Feature limits" inModal={inModal}>
          {features.assessments ? (
            <>
              <Row
                label="Assessment limit"
                value={String(totalLimit(config.assessments))}
              />
              <Row
                label="Assessment plan"
                value={config.assessments.planType}
              />
            </>
          ) : null}
          {features.interviews ? (
            <>
              <Row label="Interview limit" value={String(totalLimit(config.interviews))} />
              <Row label="Interview plan" value={config.interviews.planType} />
            </>
          ) : null}
        </SummarySection>
      )}

      <SummarySection title="Branding preview" inModal={inModal}>
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
    </div>
  );
}
