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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { AssessmentTab } from "@/lib/hiring/assessments/types";
import type {
  AssessmentsFilterState,
  AssessmentsSortKey,
  AssessmentsViewMode,
} from "@/lib/hiring/assessments/assessmentFilters";
import { DirectoryViewSwitcher } from "../directories/DirectoryViewSwitcher";
import { hiringTransition } from "../hiringTokens";
import { AssessmentsFiltersPopover } from "./AssessmentsFiltersPopover";

const TABS: { id: AssessmentTab; label: string }[] = [
  { id: "active", label: "Active Assessments" },
  { id: "drafts", label: "Draft Assessments" },
  { id: "completed", label: "Completed Assessments" },
];

const SORT_OPTIONS: { value: AssessmentsSortKey; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "newest", label: "Newest" },
  { value: "invited", label: "Most invited" },
  { value: "qualified", label: "Most qualified" },
];

export function AssessmentsToolbar({
  tab,
  onTabChange,
  tabCounts,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  roles,
  creators,
  dates,
  view,
  onViewChange,
}: {
  tab: AssessmentTab;
  onTabChange: (tab: AssessmentTab) => void;
  tabCounts: Record<AssessmentTab, number>;
  filters: AssessmentsFilterState;
  onFiltersChange: (f: AssessmentsFilterState) => void;
  sort: AssessmentsSortKey;
  onSortChange: (sort: AssessmentsSortKey) => void;
  roles: string[];
  creators: string[];
  dates: string[];
  view: AssessmentsViewMode;
  onViewChange: (v: AssessmentsViewMode) => void;
}) {
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Recently updated";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] border border-[rgba(15,23,42,0.06)]",
        "bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm dark:bg-surface/95",
      )}
    >
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as AssessmentTab)} className="min-w-0">
        <TabsList className="h-10 w-full min-h-10 max-h-10 border-b border-[rgba(15,23,42,0.06)] px-1 dark:border-white/[0.08]">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="gap-1.5 px-4 [&[data-state=active]_span]:font-semibold [&[data-state=active]_span]:text-accent"
            >
              {t.label}
              <span className="tabular-nums text-[11px] font-medium text-muted/70">{tabCounts[t.id]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2 px-2.5 py-2">
        <AssessmentsFiltersPopover
          filters={filters}
          onApply={onFiltersChange}
          roles={roles}
          creators={creators}
          dates={dates}
        />

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
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
              Sort by
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sort} onValueChange={(v) => onSortChange(v as AssessmentsSortKey)}>
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto">
          <DirectoryViewSwitcher
            value={view}
            onChange={onViewChange}
            options={[
              { value: "grid", label: "Grid", icon: "grid" },
              { value: "list", label: "List", icon: "list" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
