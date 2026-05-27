"use client";

import * as Popover from "@radix-ui/react-popover";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { radixContent, radixSurface } from "@/lib/radix-motion";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import {
  EMPTY_ENTERPRISE_FILTERS,
  ENTERPRISE_PLANS,
  type EnterpriseFilters,
} from "../../lib/enterpriseDirectoryFilters";
import { settingsField, settingsFieldLabel } from "../../settingsTokens";

function FilterFields({
  filters,
  onChange,
}: {
  filters: EnterpriseFilters;
  onChange: (filters: EnterpriseFilters) => void;
}) {
  return (
    <div className="grid gap-3">
      <label className="block space-y-1.5">
        <span className={settingsFieldLabel}>Search</span>
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Name, domain, location…"
          className={settingsField}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={settingsFieldLabel}>Plan</span>
        <select
          value={filters.plan}
          onChange={(e) => onChange({ ...filters, plan: e.target.value })}
          className={settingsField}
        >
          <option value="">All plans</option>
          {ENTERPRISE_PLANS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <span className={settingsFieldLabel}>Joined date</span>
        <label className="block space-y-1">
          <span className="text-[10px] text-muted">From</span>
          <input
            type="date"
            value={filters.joinedFrom}
            onChange={(e) => onChange({ ...filters, joinedFrom: e.target.value })}
            className={settingsField}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] text-muted">To</span>
          <input
            type="date"
            value={filters.joinedTo}
            onChange={(e) => onChange({ ...filters, joinedTo: e.target.value })}
            className={settingsField}
          />
        </label>
      </div>
    </div>
  );
}

export function EnterprisesFiltersPopover({
  filters,
  onApply,
  activeFilterCount,
}: {
  filters: EnterpriseFilters;
  onApply: (filters: EnterpriseFilters) => void;
  activeFilterCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<EnterpriseFilters>(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const apply = () => {
    onApply(draft);
    setOpen(false);
  };

  const clear = () => {
    setDraft(EMPTY_ENTERPRISE_FILTERS);
    onApply(EMPTY_ENTERPRISE_FILTERS);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Filter enterprises"
          aria-expanded={open}
          className={cn(
            "relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(15,23,42,0.08)]",
            "bg-white/90 text-text-secondary/85 shadow-none",
            "hover:border-[rgb(var(--accent-rgb)/0.25)] hover:bg-[rgb(var(--accent-rgb)/0.05)] hover:text-text",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.25)]",
            hiringTransition,
            activeFilterCount > 0 && "border-[rgb(var(--accent-rgb)/0.3)] bg-[rgb(var(--accent-rgb)/0.08)] text-accent",
          )}
        >
          <Filter className="h-4 w-4" strokeWidth={1.75} />
          {activeFilterCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold tabular-nums text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-[140] w-[min(100vw-2rem,18rem)] overflow-hidden p-0 outline-none",
            radixSurface,
            radixContent,
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="border-b border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
            <p className="text-sm font-semibold tracking-tight text-text">Filters</p>
            <p className="mt-0.5 text-[11px] text-text-secondary/75">Plan, joined date, and search</p>
          </div>
          <div className="max-h-[min(60vh,320px)] overflow-y-auto p-4">
            <FilterFields filters={draft} onChange={setDraft} />
          </div>
          <div className="flex gap-2 border-t border-[rgba(15,23,42,0.06)] p-3 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={clear}
              className="h-9 flex-1 rounded-[10px] border border-[rgba(15,23,42,0.08)] text-[12px] font-medium text-text-secondary/85 hover:bg-[rgba(15,23,42,0.03)]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={apply}
              className="h-9 flex-1 rounded-[10px] bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover"
            >
              Apply
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
