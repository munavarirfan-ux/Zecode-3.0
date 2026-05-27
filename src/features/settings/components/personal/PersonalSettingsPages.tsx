"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppearanceSettings } from "@/app/(dashboard)/settings/AppearanceSettings";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";
import { isProfileFieldEditable, previewRoleLabel } from "../../lib/settingsRolePermissions";
import { SettingsCard } from "../SettingsCard";
import { SettingsPageHeader } from "../SettingsPageHeader";
import {
  settingsField,
  settingsFieldLabel,
  settingsPanel,
  settingsPrimaryBtn,
} from "../../settingsTokens";

const LOCKED_FIELD =
  "cursor-not-allowed border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.03)] text-text-secondary/70 dark:bg-white/[0.02]";

export function ProfilePage() {
  const { selectedRole } = useRole();
  const [name, setName] = useState("Irfan Alisha");
  const [bio, setBio] = useState("Head of Talent · NovaTech");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [timezone, setTimezone] = useState("Europe/Berlin");
  const [language, setLanguage] = useState("en");
  const [compactMode, setCompactMode] = useState(false);
  const [landingPage, setLandingPage] = useState("/dashboard");

  const roleLabel = previewRoleLabel(selectedRole);
  const email = "irfan@novatech.io";

  const saveProfile = () => toast.success("Profile updated");

  return (
    <div className="space-y-4">
      <SettingsPageHeader
        scope="personal"
        scopeLabel="Personal · only visible to you"
        title="My Profile"
        description="Your identity and preferences."
        action={
          <button type="button" className={settingsPrimaryBtn} onClick={saveProfile}>
            Save changes
          </button>
        }
      />

      <SettingsCard title="Personal info" description="How you appear across Ze[code].">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-dashed border-[rgb(var(--accent-rgb)/0.25)] bg-[rgb(var(--accent-rgb)/0.06)] text-[11px] font-semibold text-accent">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              "Photo"
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={!isProfileFieldEditable("avatar")}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setAvatarUrl(URL.createObjectURL(f));
              }}
            />
          </label>
          <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className={settingsFieldLabel}>Full name</span>
              <input
                className={settingsField}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isProfileFieldEditable("name")}
              />
            </label>
            <label className="space-y-1.5">
              <span className={settingsFieldLabel}>Role</span>
              <input className={cn(settingsField, LOCKED_FIELD)} value={roleLabel} readOnly aria-readonly />
              <p className="text-[10px] text-muted">Assigned by your workspace admin</p>
            </label>
            <label className="space-y-1.5">
              <span className={settingsFieldLabel}>Work email</span>
              <input className={cn(settingsField, LOCKED_FIELD)} value={email} readOnly aria-readonly />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className={settingsFieldLabel}>Bio</span>
              <textarea
                className={cn(settingsField, "min-h-[72px] resize-y py-2")}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </label>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Preferences" description="Locale and workspace defaults for your account.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Language</span>
            <select className={settingsField} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Timezone</span>
            <select className={settingsField} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              <option value="Europe/Berlin">Europe/Berlin</option>
              <option value="America/New_York">America/New_York</option>
              <option value="UTC">UTC</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-4 sm:col-span-2">
            <span className="text-[13px] font-medium text-text">Compact mode</span>
            <input type="checkbox" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} className="h-4 w-4 accent-accent" />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={settingsFieldLabel}>Default landing page</span>
            <select className={settingsField} value={landingPage} onChange={(e) => setLandingPage(e.target.value)}>
              <option value="/dashboard">Dashboard</option>
              <option value="/hiring/jobs">Jobs</option>
              <option value="/interviews">Interviews</option>
              <option value="/assessments">Assessments</option>
            </select>
          </label>
        </div>
      </SettingsCard>
    </div>
  );
}

export function AppearancePage() {
  return (
    <div className="space-y-4">
      <SettingsPageHeader
        scope="personal"
        scopeLabel="Personal · only visible to you"
        title="Theme & Appearance"
        description="Choose theme mode and accent color. Changes apply only to your account on this device."
      />
      <AppearanceSettings />
    </div>
  );
}

export function NotificationsPage() {
  const prefs = [
    { id: "interviews", label: "Interview reminders", on: true },
    { id: "assessments", label: "Assessment completions", on: true },
    { id: "mentions", label: "Team mentions", on: false },
    { id: "digest", label: "Weekly hiring digest", on: true },
  ];
  return (
    <div className="space-y-4">
      <SettingsPageHeader
        scope="personal"
        scopeLabel="Personal · only visible to you"
        title="Notifications"
        description="Control email and in-app alerts for your hiring workflow."
      />
      <div className={cn(settingsPanel, "divide-y divide-[rgba(15,23,42,0.06)] dark:divide-white/[0.06]")}>
        {prefs.map((p) => (
          <label
            key={p.id}
            className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
          >
            <span className="text-[13px] font-medium text-text">{p.label}</span>
            <input type="checkbox" defaultChecked={p.on} className="h-4 w-4 accent-accent" />
          </label>
        ))}
      </div>
    </div>
  );
}

