"use client";

import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionTitle } from "../../../settingsTokens";
import { ENTERPRISE_FEATURES } from "../../../lib/createEnterprise/features";
import type { FeatureId, FeatureCategory } from "../../../lib/createEnterprise/types";

const CATEGORY_GROUPS: { label: string; categories: FeatureCategory[] }[] = [
  { label: "Hiring", categories: ["Core", "Interview"] },
  { label: "Assessment", categories: ["Assessment"] },
  { label: "Enterprise", categories: ["Enterprise"] },
];

function FeaturePill({ name, enabled }: { name: string; enabled: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em]",
        enabled
          ? "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-800/85 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90"
          : "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] text-muted/60 dark:border-white/[0.06] dark:bg-white/[0.03]",
      )}
    >
      {name}
    </span>
  );
}

export function EnabledFeaturesCard({ features }: { features: Record<FeatureId, boolean> }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <h3 className={settingsSectionTitle}>Enabled Features</h3>

      <div className="mt-4 space-y-4">
        {CATEGORY_GROUPS.map((group) => {
          const groupFeatures = ENTERPRISE_FEATURES.filter((f) =>
            group.categories.includes(f.category),
          );
          if (groupFeatures.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60">
                {group.label}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {groupFeatures.map((f) => (
                  <FeaturePill key={f.id} name={f.name} enabled={features[f.id]} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
