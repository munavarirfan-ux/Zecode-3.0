"use client";

import { Plus, MoreHorizontal, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import { settingsPanel, settingsSectionTitle, settingsPrimaryBtn, settingsSecondaryBtn } from "../../../settingsTokens";
import type { WhitelistedDomain, IntegrationItem, StorageItem, HealthItem } from "./enterpriseDetailMock";

// ── Whitelisted Domains ──

export function WhitelistedDomainsCard({ domains }: { domains: WhitelistedDomain[] }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <div className="flex items-center justify-between gap-4">
        <h3 className={settingsSectionTitle}>Whitelisted Domains</h3>
        <button
          type="button"
          className={cn(settingsPrimaryBtn, "h-8 px-3 text-[12px]")}
          onClick={() => toast.message("Add domain")}
        >
          <Plus className="h-3 w-3" strokeWidth={2} />
          Add Domain
        </button>
      </div>

      {domains.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted">No domains added yet</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]">
                <th className="pb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60">Domain</th>
                <th className="hidden pb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60 sm:table-cell">Added By</th>
                <th className="hidden pb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60 md:table-cell">Created</th>
                <th className="pb-2 text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(15,23,42,0.04)] dark:divide-white/[0.04]">
              {domains.map((d) => (
                <tr key={d.domain} className="group">
                  <td className="py-2.5 pr-3 text-[12px] font-medium text-text">{d.domain}</td>
                  <td className="hidden py-2.5 pr-3 text-[12px] text-muted sm:table-cell">{d.addedBy}</td>
                  <td className="hidden py-2.5 pr-3 text-[11px] text-muted md:table-cell">
                    {new Date(d.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-[8px]",
                        hiringTransition,
                        "opacity-0 hover:bg-[rgba(15,23,42,0.04)] group-hover:opacity-100 dark:hover:bg-white/[0.04]",
                      )}
                      onClick={() => toast.message(`Remove ${d.domain}`)}
                      aria-label={`Remove ${d.domain}`}
                    >
                      <MoreHorizontal className="h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ── Integrations ──

export function IntegrationsCard({ integrations }: { integrations: IntegrationItem[] }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <h3 className={settingsSectionTitle}>Connected Integrations</h3>
      <div className="mt-4 space-y-2">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.01)] px-3 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.02]"
          >
            <span className="text-[12px] font-medium text-text">{item.name}</span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em]",
                  item.connected
                    ? "border-emerald-500/12 bg-emerald-500/[0.07] text-emerald-800/85 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90"
                    : "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] text-muted/60 dark:border-white/[0.06] dark:bg-white/[0.03]",
                )}
              >
                {item.connected ? "Connected" : "Not Connected"}
              </span>
              <button
                type="button"
                className={cn(settingsSecondaryBtn, "h-7 px-2 text-[11px]")}
                onClick={() => toast.message(`Manage ${item.name}`)}
              >
                <Settings2 className="h-3 w-3" strokeWidth={1.75} />
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Storage ──

export function StorageCard({ items }: { items: StorageItem[] }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <h3 className={settingsSectionTitle}>Storage Usage</h3>
      <div className="mt-4 space-y-4">
        {items.map((item) => {
          const pct = Math.min(100, Math.round((item.used / item.total) * 100));
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-medium text-text">{item.label}</span>
                <span className="text-[11px] tabular-nums text-muted">
                  {item.used} / {item.total} {item.unit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]">
                <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Health ──

export function HealthStatusCard({ items }: { items: HealthItem[] }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <h3 className={settingsSectionTitle}>System Health</h3>
      <div className="mt-4 space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  item.status === "Operational" && "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
                  item.status === "Degraded" && "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
                  item.status === "Down" && "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]",
                )}
              />
              <span className="text-[12px] font-medium text-text">{item.label}</span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">{item.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
