"use client";

import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionTitle } from "../../../settingsTokens";
import type { UsageLimitItem } from "./enterpriseDetailMock";

function LimitRow({ item }: { item: UsageLimitItem }) {
  const pct = Math.min(100, Math.round((item.current / item.limit) * 100));
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="min-w-0 flex-1 text-[12px] font-medium text-text">{item.label}</span>
      <div className="flex w-[100px] items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]">
          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="w-[80px] text-right text-[11px] tabular-nums text-muted">
        {item.current.toLocaleString()} / {item.limit.toLocaleString()}
      </span>
    </div>
  );
}

export function UsageLimitsCard({ items }: { items: UsageLimitItem[] }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <h3 className={settingsSectionTitle}>Limits</h3>
      <div className="mt-3 divide-y divide-[rgba(15,23,42,0.04)] dark:divide-white/[0.04]">
        {items.map((item) => (
          <LimitRow key={item.label} item={item} />
        ))}
      </div>
    </section>
  );
}
