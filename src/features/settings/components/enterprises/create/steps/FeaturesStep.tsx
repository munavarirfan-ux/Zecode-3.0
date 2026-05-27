"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  applyFeatureToggle,
  ENTERPRISE_FEATURES,
  getFeatureDependencyWarning,
  isFeatureToggleDisabled,
} from "../../../../lib/createEnterprise/features";
import type { FeatureId } from "../../../../lib/createEnterprise/types";
import { settingsAccentBgActive, settingsPanel } from "../../../../settingsTokens";
import { formInputClass, FormSectionCard } from "../CreateEnterpriseFormPrimitives";

type FeatureFilter = "all" | "enabled" | "disabled";

export function FeaturesStep({
  features,
  onChange,
  inModal,
}: {
  features: Record<FeatureId, boolean>;
  onChange: (next: Record<FeatureId, boolean>) => void;
  inModal?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FeatureFilter>("all");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ENTERPRISE_FEATURES.filter((f) => {
      if (filter === "enabled" && !features[f.id]) return false;
      if (filter === "disabled" && features[f.id]) return false;
      if (q && !f.name.toLowerCase().includes(q) && !f.description.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [features, filter, search]);

  const inner = (
    <>
      {!inModal ? (
        <p className="text-[12px] leading-relaxed text-text-secondary/75">
          Enable or disable modules for this workspace. Dependent features lock when parents are off.
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search feature"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(formInputClass, "pl-9")}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "enabled", "disabled"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium capitalize transition-colors duration-[180ms]",
                filter === id
                  ? cn(settingsAccentBgActive, "text-accent")
                  : "text-muted hover:bg-[rgba(15,23,42,0.04)]",
              )}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div className={cn(settingsPanel, "mt-4 overflow-hidden p-0")}>
        <div className="hidden grid-cols-[1fr_7rem_5rem_4rem] gap-3 border-b border-[rgba(15,23,42,0.06)] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted sm:grid dark:border-white/[0.06]">
          <span>Feature</span>
          <span>Category</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <ul className="divide-y divide-[rgba(15,23,42,0.06)] dark:divide-white/[0.06]">
          {rows.length === 0 ? (
            <li className="px-4 py-8 text-center text-[13px] text-muted">No features match your search.</li>
          ) : (
            rows.map((feature) => {
              const enabled = features[feature.id];
              const disabled = isFeatureToggleDisabled(feature.id, features);
              const warning = getFeatureDependencyWarning(feature.id, features);
              return (
                <li
                  key={feature.id}
                  className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_7rem_5rem_4rem] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-text">{feature.name}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary/80">
                      {feature.description}
                    </p>
                    {warning ? (
                      <p className="mt-1.5 flex items-start gap-1 text-[10px] text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                        {warning}
                      </p>
                    ) : null}
                  </div>
                  <span className="text-[11px] font-medium text-muted sm:text-[12px]">{feature.category}</span>
                  <span
                    className={cn(
                      "inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      enabled
                        ? "bg-[rgb(var(--accent-rgb)/0.12)] text-accent"
                        : "bg-[rgba(15,23,42,0.06)] text-muted",
                    )}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </span>
                  <div className="flex justify-start sm:justify-end">
                    <Switch
                      checked={enabled}
                      disabled={disabled}
                      onCheckedChange={(checked) =>
                        onChange(applyFeatureToggle(feature.id, checked, features))
                      }
                      className="data-[state=checked]:border-accent/30 data-[state=checked]:bg-accent"
                    />
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </>
  );

  if (inModal) return <div className="space-y-4">{inner}</div>;

  return (
    <FormSectionCard
      title="Enterprise features"
      description="Enable or disable modules for this workspace. Dependent features lock when parents are off."
    >
      {inner}
    </FormSectionCard>
  );
}
