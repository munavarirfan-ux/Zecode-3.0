"use client";

import { cn } from "@/lib/utils";
import { SettingsUploadZone } from "../../../shared/SettingsUploadZone";
import type { CreateEnterpriseFieldErrors, EnterpriseDetailsForm, NatureOfBusiness } from "../../../../lib/createEnterprise/types";
import {
  FormField,
  FormSectionCard,
  formInputClass,
  StepSection,
} from "../CreateEnterpriseFormPrimitives";

const NATURE_OPTIONS: NatureOfBusiness[] = [
  "IT Services",
  "Product Company",
  "Consulting",
  "Education",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Other",
];

const PHONE_COUNTRIES = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+971", label: "UAE (+971)" },
];

function FaviconTabPreview({ url }: { url: string | null }) {
  return (
    <div className="rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[#F4F4F5] p-2.5 dark:bg-white/[0.04]">
      <p className="text-[10px] font-medium text-muted">Browser tab preview</p>
      <div className="mt-2 flex h-8 max-w-[10rem] items-center gap-1.5 rounded-md border border-[rgba(15,23,42,0.08)] bg-white px-2 dark:bg-[#18181B]">
        {url ? (
          <img src={url} alt="" className="h-4 w-4 rounded object-contain" />
        ) : (
          <span className="flex h-4 w-4 items-center justify-center rounded bg-accent/15 text-[9px] font-bold text-accent">
            Z
          </span>
        )}
        <span className="truncate text-[10px] text-muted">Ze[code]</span>
      </div>
    </div>
  );
}

function SectionWrap({
  inModal,
  title,
  description,
  children,
}: {
  inModal?: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  if (inModal) {
    return (
      <StepSection title={title} description={description}>
        {children}
      </StepSection>
    );
  }
  return (
    <FormSectionCard title={title} description={description}>
      {children}
    </FormSectionCard>
  );
}

export function EnterpriseDetailsStep({
  details,
  errors,
  onChange,
  inModal,
}: {
  details: EnterpriseDetailsForm;
  errors: CreateEnterpriseFieldErrors;
  onChange: (patch: Partial<EnterpriseDetailsForm>) => void;
  inModal?: boolean;
}) {
  const patch = onChange;

  return (
    <div className={inModal ? "space-y-6" : "space-y-4"}>
      <SectionWrap
        inModal={inModal}
        title="Organization details"
        description="Core workspace identity and scale."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Organisation Name" required error={errors.organisationName} className="sm:col-span-2">
            <input
              className={cn(formInputClass, errors.organisationName && "border-red-400/50")}
              placeholder="Enter company name"
              value={details.organisationName}
              onChange={(e) => patch({ organisationName: e.target.value })}
            />
          </FormField>
          <FormField label="Domain Name" required error={errors.domainName}>
            <input
              className={cn(formInputClass, errors.domainName && "border-red-400/50")}
              placeholder="Enter domain name"
              value={details.domainName}
              onChange={(e) => patch({ domainName: e.target.value })}
            />
          </FormField>
          <FormField label="Default Base Domain" required error={errors.defaultBaseDomain}>
            <input
              className={cn(formInputClass, errors.defaultBaseDomain && "border-red-400/50")}
              placeholder="Enter default base domain"
              value={details.defaultBaseDomain}
              onChange={(e) => patch({ defaultBaseDomain: e.target.value })}
            />
          </FormField>
          <FormField label="Nature of Business" required error={errors.natureOfBusiness}>
            <select
              className={cn(formInputClass, errors.natureOfBusiness && "border-red-400/50")}
              value={details.natureOfBusiness}
              onChange={(e) => patch({ natureOfBusiness: e.target.value as NatureOfBusiness })}
            >
              <option value="">Select industry</option>
              {NATURE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Monthly average assessments conducted" error={errors.monthlyAssessments}>
            <input
              type="number"
              min={0}
              className={formInputClass}
              value={details.monthlyAssessments}
              onChange={(e) => patch({ monthlyAssessments: e.target.value })}
            />
          </FormField>
          <FormField label="Number of Employees" error={errors.numberOfEmployees}>
            <input
              type="number"
              min={0}
              className={formInputClass}
              value={details.numberOfEmployees}
              onChange={(e) => patch({ numberOfEmployees: e.target.value })}
            />
          </FormField>
          <FormField label="Location" required error={errors.location} className="sm:col-span-2">
            <input
              className={cn(formInputClass, errors.location && "border-red-400/50")}
              placeholder="City, country"
              value={details.location}
              onChange={(e) => patch({ location: e.target.value })}
            />
          </FormField>
        </div>
      </SectionWrap>

      <SectionWrap
        inModal={inModal}
        title="SPOC details"
        description="Single point of contact for this enterprise."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="SPOC Name" required error={errors.spocName} className="sm:col-span-2">
            <input
              className={cn(formInputClass, errors.spocName && "border-red-400/50")}
              placeholder="Enter SPOC name"
              value={details.spocName}
              onChange={(e) => patch({ spocName: e.target.value })}
            />
          </FormField>
          <FormField label="SPOC Email ID" required error={errors.spocEmail} className="sm:col-span-2">
            <input
              type="email"
              className={cn(formInputClass, errors.spocEmail && "border-red-400/50")}
              placeholder="Enter valid email"
              value={details.spocEmail}
              onChange={(e) => patch({ spocEmail: e.target.value })}
            />
          </FormField>
          <FormField label="SPOC Mobile No" error={errors.spocPhone} className="sm:col-span-2">
            <div className="flex gap-2">
              <select
                className={cn(formInputClass, "w-[9.5rem] shrink-0")}
                value={details.spocPhoneCountry}
                onChange={(e) => patch({ spocPhoneCountry: e.target.value })}
              >
                {PHONE_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                className={cn(formInputClass, "min-w-0 flex-1", errors.spocPhone && "border-red-400/50")}
                placeholder="Mobile number"
                value={details.spocPhone}
                onChange={(e) => patch({ spocPhone: e.target.value.replace(/[^\d\s]/g, "") })}
              />
            </div>
          </FormField>
        </div>
      </SectionWrap>

      <SectionWrap
        inModal={inModal}
        title="Brand assets"
        description="Logo and favicon for the workspace."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <SettingsUploadZone
            label="Enterprise Logo"
            hint="PNG, SVG, or JPG · max 2MB"
            accept=".png,.svg,.jpg,.jpeg,image/png,image/svg+xml,image/jpeg"
            preview={
              details.logoUrl ? (
                <img src={details.logoUrl} alt="" className="h-10 max-w-[160px] object-contain" />
              ) : null
            }
            onFile={(_, url) => patch({ logoUrl: url })}
          />
          <div className="space-y-3">
            <SettingsUploadZone
              label="Favicon"
              hint="PNG, SVG, JPG, or ICO"
              accept=".png,.svg,.jpg,.jpeg,.ico,image/png,image/svg+xml,image/jpeg,image/x-icon"
              preview={
                details.faviconUrl ? (
                  <img src={details.faviconUrl} alt="" className="h-8 w-8 object-contain" />
                ) : null
              }
              onFile={(_, url) => patch({ faviconUrl: url })}
            />
            <FaviconTabPreview url={details.faviconUrl} />
          </div>
        </div>
      </SectionWrap>
    </div>
  );
}
