"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import {
  settingsField,
  settingsFieldLabel,
  settingsPanel,
  settingsPrimaryBtn,
  settingsSectionDesc,
  settingsSectionTitle,
} from "@/features/settings/settingsTokens";

export function SettingsClient({
  orgId,
  dataRetentionMonths,
  anonymizedScreening,
  isHr,
}: {
  orgId: string;
  dataRetentionMonths: number | null;
  anonymizedScreening: boolean;
  isHr: boolean;
}) {
  const router = useRouter();
  const [retention, setRetention] = useState(String(dataRetentionMonths ?? ""));
  const [anonymized, setAnonymized] = useState(anonymizedScreening);
  const [saving, setSaving] = useState(false);

  async function saveRetention() {
    setSaving(true);
    try {
      await fetch(`/api/settings/retention`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          months: retention === "" ? null : parseInt(retention, 10),
        }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function saveAnonymized(enabled: boolean) {
    setSaving(true);
    try {
      await fetch(`/api/settings/anonymized`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className={cn(settingsPanel, "p-5")}>
        <h2 className={settingsSectionTitle}>Data retention</h2>
        <p className={cn(settingsSectionDesc, "mt-1")}>
          Auto-delete candidate data after a set period. No cron runs in MVP; UI only.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="space-y-1.5">
            <span className={settingsFieldLabel}>Retention period</span>
            <div className="flex items-center gap-2">
              <input
                id="retention-months"
                type="number"
                min={0}
                placeholder="No auto-delete"
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className={cn(settingsField, "w-32")}
              />
              <span className="text-[12px] text-muted">months</span>
            </div>
          </label>
          <button
            type="button"
            onClick={saveRetention}
            disabled={saving}
            className={settingsPrimaryBtn}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </section>

      {isHr ? (
        <section className={cn(settingsPanel, "p-5")}>
          <h2 className={settingsSectionTitle}>Anonymized screening</h2>
          <p className={cn(settingsSectionDesc, "mt-1")}>
            When enabled, candidate name and email are hidden in the candidates list for HR users.
          </p>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <Switch.Root
              id="anonymized-screening"
              checked={anonymized}
              onCheckedChange={async (next) => {
                setAnonymized(next);
                await saveAnonymized(next);
              }}
              disabled={saving}
              className="relative h-5 w-9 rounded-full bg-[rgba(15,23,42,0.12)] data-[state=checked]:bg-accent"
            >
              <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
            </Switch.Root>
            <span className="text-[13px] font-medium text-text">
              Hide candidate name/email in list
            </span>
          </label>
        </section>
      ) : null}
    </div>
  );
}
