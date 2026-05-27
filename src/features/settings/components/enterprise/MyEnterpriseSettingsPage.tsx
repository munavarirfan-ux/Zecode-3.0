"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { isEnterpriseAdmin } from "../../settingsAccess";
import {
  DEFAULT_ENTERPRISE_SETTINGS,
  isSlugAvailable,
  validateEnterpriseSlug,
  type EnterpriseBrandingState,
} from "../../mock/enterpriseSettingsMock";
import { getTakenEnterpriseSlugs } from "../../lib/createEnterprise/slugs";
import { SettingsCard } from "../SettingsCard";
import { SettingsGate } from "../SettingsGate";
import { SettingsPageHeader } from "../SettingsPageHeader";
import { SettingsUploadZone } from "../shared/SettingsUploadZone";
import { LocalizationSaveBar } from "../localization/LocalizationSaveBar";
import { settingsField, settingsFieldLabel } from "../../settingsTokens";

export function MyEnterpriseSettingsPage() {
  const { selectedRole } = useRole();
  const [form, setForm] = useState<EnterpriseBrandingState>(DEFAULT_ENTERPRISE_SETTINGS);
  const [baseline, setBaseline] = useState(DEFAULT_ENTERPRISE_SETTINGS);

  const patch = (next: Partial<EnterpriseBrandingState>) => setForm((f) => ({ ...f, ...next }));

  const slugError = useMemo(() => validateEnterpriseSlug(form.slug), [form.slug]);
  const slugOk =
    !slugError &&
    isSlugAvailable(
      form.slug,
      getTakenEnterpriseSlugs().filter((s) => s !== baseline.slug),
    );

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);

  if (!isEnterpriseAdmin(selectedRole)) {
    return <SettingsGate title="Enterprise settings require an admin role" />;
  }

  const save = () => {
    setBaseline(structuredClone(form));
    toast.success("Enterprise settings saved");
  };

  const discard = () => {
    setForm(structuredClone(baseline));
    toast.message("Changes discarded");
  };

  return (
    <div className={cn("space-y-4", dirty && "pb-20")}>
      <SettingsPageHeader
        scope="enterprise"
        scopeLabel="Enterprise · admins only"
        title="My Enterprise"
        description="Manage enterprise branding, identity, and workspace defaults."
      />

      <SettingsCard title="Enterprise identity" description="Public workspace profile and contact details.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className={settingsFieldLabel}>Enterprise name</span>
            <input className={settingsField} value={form.name} onChange={(e) => patch({ name: e.target.value })} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={settingsFieldLabel}>Enterprise slug</span>
            <input
              className={cn(settingsField, slugError && "border-red-400/50")}
              value={form.slug}
              onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
            />
            <p className="text-[11px] text-muted">
              zecode.live/{form.slug || "slug"}
              {slugOk ? <span className="ml-2 text-emerald-600">Available</span> : null}
              {slugError ? <span className="ml-2 text-red-600">{slugError}</span> : null}
            </p>
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Website URL</span>
            <input className={settingsField} value={form.website} onChange={(e) => patch({ website: e.target.value })} />
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Industry</span>
            <input className={settingsField} value={form.industry} onChange={(e) => patch({ industry: e.target.value })} />
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Company size</span>
            <select className={settingsField} value={form.companySize} onChange={(e) => patch({ companySize: e.target.value })}>
              {["1–10", "11–50", "51–200", "201–500", "500+"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Support email</span>
            <input type="email" className={settingsField} value={form.supportEmail} onChange={(e) => patch({ supportEmail: e.target.value })} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={settingsFieldLabel}>Headquarters location</span>
            <input className={settingsField} value={form.headquarters} onChange={(e) => patch({ headquarters: e.target.value })} />
          </label>
        </div>
      </SettingsCard>

      <SettingsCard title="Branding" description="Upload your workspace logo.">
        <SettingsUploadZone
          label="Logo"
          hint="PNG or SVG · max 2MB"
          accept=".png,.svg,image/png,image/svg+xml"
          preview={
            form.logoUrl ? (
              <img src={form.logoUrl} alt="" className="h-10 max-w-[140px] object-contain" />
            ) : null
          }
          onFile={(_, url) => patch({ logoUrl: url })}
        />
      </SettingsCard>

      <SettingsCard title="Workspace defaults" description="Default behavior for interviews, assessments, and visibility.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Default timezone</span>
            <select className={settingsField} value={form.timezone} onChange={(e) => patch({ timezone: e.target.value })}>
              <option value="Europe/Berlin">Europe/Berlin</option>
              <option value="America/New_York">America/New_York</option>
              <option value="UTC">UTC</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Date format</span>
            <select className={settingsField} value={form.dateFormat} onChange={(e) => patch({ dateFormat: e.target.value })}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Language</span>
            <select className={settingsField} value={form.language} onChange={(e) => patch({ language: e.target.value })}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Default interview duration (min)</span>
            <input type="number" className={settingsField} value={form.defaultInterviewDuration} onChange={(e) => patch({ defaultInterviewDuration: Number(e.target.value) })} />
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Assessment expiry (days)</span>
            <input type="number" className={settingsField} value={form.assessmentExpiryDays} onChange={(e) => patch({ assessmentExpiryDays: Number(e.target.value) })} />
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Default candidate visibility</span>
            <select
              className={settingsField}
              value={form.defaultCandidateVisibility}
              onChange={(e) => patch({ defaultCandidateVisibility: e.target.value as EnterpriseBrandingState["defaultCandidateVisibility"] })}
            >
              <option value="team">Team</option>
              <option value="enterprise">Enterprise</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>
      </SettingsCard>

      <SettingsCard title="Danger zone" description="Irreversible enterprise actions." danger>
        <p className="text-[13px] text-text-secondary/85">Deleting an enterprise removes all jobs, candidates, and interview history.</p>
        <button type="button" className="mt-4 rounded-[10px] border border-red-400/40 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => toast.error("Contact platform support to delete an enterprise")}>
          Delete enterprise
        </button>
      </SettingsCard>

      <LocalizationSaveBar changeCount={dirty ? 1 : 0} onDiscard={discard} onSave={save} />
    </div>
  );
}
