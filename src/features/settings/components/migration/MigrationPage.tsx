"use client";

import { format } from "date-fns";
import { Download, FileText, Search, Upload } from "lucide-react";
import { HeroActionButton } from "@/components/hiring/HeroActionButton";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { settingsAccentBgHover, settingsPanel } from "../../settingsTokens";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { isPlatformSuperAdmin } from "../../settingsAccess";
import { MIGRATION_HISTORY } from "../../mock/migrationData";
import type { MigrationHistoryItem, MigrationRunStatus } from "../../settingsTypes";
import { SettingsGate } from "../SettingsGate";
import { SettingsPageHeader } from "../SettingsPageHeader";
import { MigrationLogsDrawer } from "./MigrationLogsDrawer";
import { MigrationRunPill } from "./MigrationStatusPill";

const STATUS_FILTERS: { id: MigrationRunStatus | "all"; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "success", label: "Success" },
  { id: "failed", label: "Failed" },
  { id: "running", label: "Running" },
  { id: "queued", label: "Queued" },
];

const SOURCE_FILTERS = ["All", "Platform", "HackerRank", "CodeSignal", "LeetCode", "Mettl", "CSV Import"];

export function MigrationPage() {
  const { selectedRole } = useRole();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MigrationRunStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [logsItem, setLogsItem] = useState<MigrationHistoryItem | null>(null);
  const allowed = isPlatformSuperAdmin(selectedRole);

  const filteredHistory = useMemo(() => {
    if (!allowed) return [];
    return MIGRATION_HISTORY.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (sourceFilter !== "All" && item.source !== sourceFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.executedBy.toLowerCase().includes(q)) {
          return false;
        }
      }
      const executed = new Date(item.executedAt).getTime();
      if (dateFrom && executed < new Date(dateFrom).getTime()) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (executed > end.getTime()) return false;
      }
      return true;
    });
  }, [search, statusFilter, sourceFilter, dateFrom, dateTo, allowed]);

  if (!allowed) {
    return <SettingsGate title="Migration is restricted to Super Admins" />;
  }

  return (
    <div className="space-y-4">
      <SettingsPageHeader
        scope="platform"
        scopeLabel="Platform · Super Admin only"
        title="Migration"
        description="Review migration runs, scripts, imports, and platform transfer history."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <HeroActionButton type="button" onClick={() => toast.message("Import migration package")}>
              <Upload className="h-3.5 w-3.5" />
              Import
            </HeroActionButton>
            <HeroActionButton type="button" onClick={() => toast.message("Export migration report")}>
              <Download className="h-3.5 w-3.5" />
              Export
            </HeroActionButton>
          </div>
        }
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-text">Migration history</h2>
            <p className="mt-0.5 text-[12px] text-muted">Scripts, imports, and platform transfers</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search migration name…"
              className="h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 pl-9 pr-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-accent/20 dark:bg-white/[0.04]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-8 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-2 text-[12px] dark:bg-white/[0.04]"
          >
            {SOURCE_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "Source · All" : s}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as MigrationRunStatus | "all")}
            className="h-8 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-2 text-[12px] dark:bg-white/[0.04]"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="h-8 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-2 text-[12px] dark:bg-white/[0.04]"
            aria-label="From date"
          />
          <input
            type="date"
            className="h-8 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-2 text-[12px] dark:bg-white/[0.04]"
            aria-label="To date"
          />
        </div>

        <div className="space-y-2">
          {filteredHistory.length === 0 ? (
            <div className={cn(settingsPanel, "p-8 text-center text-[13px] text-muted")}>
              No migrations match your filters.
            </div>
          ) : (
            filteredHistory.map((item) => (
              <MigrationHistoryRow
                key={item.id}
                item={item}
                onViewLogs={() => setLogsItem(item)}
              />
            ))
          )}
        </div>
      </section>

      <MigrationLogsDrawer
        item={logsItem}
        open={Boolean(logsItem)}
        onOpenChange={(o) => {
          if (!o) setLogsItem(null);
        }}
      />
    </div>
  );
}

function MigrationHistoryRow({
  item,
  onViewLogs,
}: {
  item: MigrationHistoryItem;
  onViewLogs: () => void;
}) {
  const executedOn = format(new Date(item.executedAt), "dd/MM/yyyy · h:mm a");
  return (
    <article
      className={cn(
        settingsPanel,
        "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <MigrationRunPill status={item.status} />
          <span className="text-[11px] text-muted">{item.source}</span>
        </div>
        <h3 className="mt-1.5 truncate text-[14px] font-semibold text-text">{item.name}</h3>
        <p className="mt-1 text-[12px] text-text-secondary/80">
          {executedOn} · Affected records: {item.affectedRecords} · Executed by: {item.executedBy}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onViewLogs}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-3 text-[12px] font-medium",
            settingsAccentBgHover,
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          View logs
        </button>
        <button
          type="button"
          onClick={() => toast.success(`Report downloaded · ${item.name}`)}
          className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-3 text-[12px] font-medium hover:bg-[rgba(15,23,42,0.04)]"
        >
          <Download className="h-3.5 w-3.5" />
          Report
        </button>
      </div>
    </article>
  );
}

