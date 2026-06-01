"use client";

import { useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { KanbanViewMode } from "@/lib/hiring/types";
import { CANDIDATE_SOURCES } from "@/lib/hiring/stages";
import {
  saveKanbanViewMode,
  type KanbanOwnershipFilters,
  type KanbanSortKey,
  type KanbanEngagementFilter,
  type KanbanStageAgeFilter,
  type KanbanContactFilter,
} from "@/lib/hiring/kanbanOwnership";
import { KanbanViewSelector } from "./KanbanViewSelector";
import { cn } from "@/lib/utils";

const toolbarTriggerClass =
  "h-8 border-border-subtle bg-surface text-xs font-medium text-text shadow-none hover:bg-surface-2 dark:border-border-subtle";

const SORT_OPTIONS: { value: KanbanSortKey; label: string }[] = [
  { value: "newest", label: "Newest applied" },
  { value: "oldest", label: "Oldest applied" },
  { value: "mostEngaged", label: "Most engaged" },
  { value: "recentlyActive", label: "Recently active" },
  { value: "nameAsc", label: "A–Z by name" },
];

export function KanbanOwnershipToolbar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  contactCounts,
}: {
  filters: KanbanOwnershipFilters;
  onFiltersChange: (next: KanbanOwnershipFilters) => void;
  viewMode: KanbanViewMode;
  onViewModeChange: (mode: KanbanViewMode) => void;
  contactCounts?: { needsContact: number; engaged: number };
}) {
  useEffect(() => {
    saveKanbanViewMode(viewMode);
  }, [viewMode]);

  const activeFilterCount =
    filters.sources.length +
    (filters.engagement ? 1 : 0) +
    (filters.stageAge ? 1 : 0) +
    (filters.contactFilter ? 1 : 0);

  const contactOptions: { value: KanbanContactFilter; label: string; count?: number }[] = [
    { value: "", label: "All" },
    { value: "needs_contact", label: "Needs Contact", count: contactCounts?.needsContact },
    { value: "engaged", label: "Engaged", count: contactCounts?.engaged },
  ];

  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex shrink-0 items-center gap-2">
        <KanbanViewSelector value={viewMode} onValueChange={onViewModeChange} />
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {/* Quick contact status pills */}
        <div className="flex items-center gap-1 rounded-[10px] border border-border-subtle bg-surface p-0.5">
          {contactOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFiltersChange({ ...filters, contactFilter: opt.value })}
              className={cn(
                "inline-flex h-6 items-center gap-1 rounded-[7px] px-2 text-[11px] font-medium transition-colors",
                filters.contactFilter === opt.value
                  ? "bg-white shadow-sm text-text dark:bg-surface-2"
                  : "text-text-secondary hover:text-text",
              )}
            >
              {opt.label}
              {opt.count !== undefined && opt.count > 0 ? (
                <span className="tabular-nums opacity-60">{opt.count}</span>
              ) : null}
            </button>
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("h-8 gap-1.5 rounded-[9px] px-2.5", toolbarTriggerClass)}
            >
              <Filter className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
              Filters
              {activeFilterCount > 0 ? (
                <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[rgba(15,23,42,0.06)] px-1 text-[10px] font-semibold tabular-nums text-text-secondary dark:bg-white/[0.08]">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[280px] space-y-4">
            {/* Contact Status */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-text">Contact status</Label>
              <div className="space-y-1.5">
                {contactOptions.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactFilter"
                        value={opt.value}
                        checked={filters.contactFilter === opt.value}
                        onChange={() => onFiltersChange({ ...filters, contactFilter: opt.value })}
                        className="accent-[rgb(var(--accent-rgb))]"
                      />
                      {opt.label}
                    </div>
                    {opt.count !== undefined ? (
                      <span className="tabular-nums text-muted">{opt.count}</span>
                    ) : null}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-text">Source</Label>
              <div className="mt-2 max-h-[140px] space-y-1.5 overflow-y-auto">
                {CANDIDATE_SOURCES.map((src) => (
                  <label key={src} className="flex cursor-pointer items-center gap-2 text-xs">
                    <Checkbox
                      checked={filters.sources.includes(src)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...filters.sources, src]
                          : filters.sources.filter((s) => s !== src);
                        onFiltersChange({ ...filters, sources: next });
                      }}
                    />
                    {src}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-text">Engagement</Label>
              <Select
                value={filters.engagement || "any"}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    engagement: (v === "any" ? "" : v) as KanbanEngagementFilter,
                  })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="onlyMe">Only me</SelectItem>
                  <SelectItem value="multiple">Multiple recruiters</SelectItem>
                  <SelectItem value="none">No one yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-text">Stage age</Label>
              <Select
                value={filters.stageAge || "any"}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    stageAge: (v === "any" ? "" : v) as KanbanStageAgeFilter,
                  })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="lt3">&lt; 3 days</SelectItem>
                  <SelectItem value="3to7">3–7 days</SelectItem>
                  <SelectItem value="gt7">&gt; 7 days (stuck)</SelectItem>
                  <SelectItem value="gt14">&gt; 14 days (very stuck)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-full text-xs"
              onClick={() =>
                onFiltersChange({ ...filters, sources: [], engagement: "", stageAge: "", contactFilter: "" })
              }
            >
              Clear filters
            </Button>
          </PopoverContent>
        </Popover>

        <Select
          value={filters.sort}
          onValueChange={(v) => onFiltersChange({ ...filters, sort: v as KanbanSortKey })}
        >
          <SelectTrigger
            className={cn(
              "h-8 w-auto min-w-[min(148px,40vw)] rounded-[9px] px-2.5",
              toolbarTriggerClass,
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
