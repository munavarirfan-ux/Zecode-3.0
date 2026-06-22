"use client";

import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionTitle } from "../../../settingsTokens";
import type { FeatureUsageItem } from "./enterpriseDetailMock";

function UsageBar({ item }: { item: FeatureUsageItem }) {
  const pct = Math.min(100, Math.round((item.current / item.limit) * 100));
  const isHigh = pct >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-medium text-text">{item.label}</span>
        <span className="text-[12px] tabular-nums text-muted">
          {item.current.toLocaleString()} / {item.limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isHigh ? "bg-amber-500" : "bg-accent",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function FeatureUsageCard({ items }: { items: FeatureUsageItem[] }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <h3 className={settingsSectionTitle}>Feature Usage</h3>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <UsageBar key={item.label} item={item} />
        ))}
      </div>
    </section>
  );
}
