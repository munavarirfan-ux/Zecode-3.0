"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  JOBS_STATUS_TABS,
  type JobsSortKey,
  type JobsStatusTab,
} from "@/lib/hiring/jobDirectoryFilters";
import { JobsFiltersPopover, type JobsFilterState } from "../JobsFiltersPopover";
import { DirectoryViewSwitcher } from "../directories/DirectoryViewSwitcher";
import { hiringTransition } from "../hiringTokens";

const SORT_OPTIONS: { value: JobsSortKey; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "candidates", label: "Most candidates" },
  { value: "newest", label: "Newest" },
  { value: "priority", label: "Hiring priority" },
];

export function JobsDirectoryToolbar({
  statusTab,
  onStatusTabChange,
  statusCounts,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: {
  statusTab: JobsStatusTab;
  onStatusTabChange: (tab: JobsStatusTab) => void;
  statusCounts: Record<JobsStatusTab, number>;
  filters: JobsFilterState;
  onFiltersChange: (filters: JobsFilterState) => void;
  sort: JobsSortKey;
  onSortChange: (sort: JobsSortKey) => void;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}) {
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Recently updated";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[14px] border border-[rgba(15,23,42,0.06)]",
        "bg-white/90 px-2.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between",
        "dark:bg-surface/95",
      )}
    >
      <div className="flex min-w-0 flex-wrap gap-1.5">
        {JOBS_STATUS_TABS.map((tab) => {
          const active = statusTab === tab.id;
          const count = statusCounts[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusTabChange(tab.id)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium",
                hiringTransition,
                active
                  ? "border-forest/25 bg-forest/[0.08] text-forest dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "border-[rgba(15,23,42,0.06)] bg-white/90 text-text-secondary/75 hover:border-[rgba(15,23,42,0.1)] hover:text-text dark:bg-white/[0.04]",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "tabular-nums text-[10px]",
                  active ? "text-forest/80 dark:text-emerald-400/90" : "text-muted/60",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <JobsFiltersPopover filters={filters} onApply={onFiltersChange} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1.5 rounded-[10px] border-[rgba(15,23,42,0.06)] px-2.5 text-[11px] font-medium shadow-none",
                hiringTransition,
              )}
            >
              <span className="text-text-secondary/60">Sort</span>
              <span className="text-text">{sortLabel}</span>
              <ChevronDown className="h-3 w-3 text-muted/70" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
              Sort by
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sort} onValueChange={(v) => onSortChange(v as JobsSortKey)}>
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DirectoryViewSwitcher
          value={view}
          onChange={onViewChange}
          options={[
            { value: "list", label: "List", icon: "list" },
            { value: "grid", label: "Grid", icon: "grid" },
          ]}
        />
      </div>
    </div>
  );
}
