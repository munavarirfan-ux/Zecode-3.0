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
import { DirectoryViewSwitcher } from "@/components/hiring/directories/DirectoryViewSwitcher";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import { cn } from "@/lib/utils";
import {
  ENTERPRISE_ACCESS_TABS,
  ENTERPRISE_SORT_OPTIONS,
  type EnterpriseAccessTab,
  type EnterpriseFilters,
  type EnterpriseSortKey,
  type EnterpriseViewMode,
} from "../../lib/enterpriseDirectoryFilters";
import { EnterprisesFiltersPopover } from "./EnterprisesFiltersPopover";

export function EnterprisesDirectoryToolbar({
  accessTab,
  onAccessTabChange,
  tabCounts,
  sort,
  onSortChange,
  view,
  onViewChange,
  filters,
  onFiltersChange,
  activeFilterCount,
}: {
  accessTab: EnterpriseAccessTab;
  onAccessTabChange: (tab: EnterpriseAccessTab) => void;
  tabCounts: Record<EnterpriseAccessTab, number>;
  sort: EnterpriseSortKey;
  onSortChange: (sort: EnterpriseSortKey) => void;
  view: EnterpriseViewMode;
  onViewChange: (view: EnterpriseViewMode) => void;
  filters: EnterpriseFilters;
  onFiltersChange: (filters: EnterpriseFilters) => void;
  activeFilterCount: number;
}) {
  const sortLabel = ENTERPRISE_SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Joined · newest";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] border border-[rgba(15,23,42,0.06)]",
        "bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm dark:bg-surface/95",
      )}
    >
      <div className="flex h-10 min-h-10 items-stretch">
        <Tabs
          value={accessTab}
          onValueChange={(v) => onAccessTabChange(v as EnterpriseAccessTab)}
          className="flex min-w-0 flex-1"
        >
          <TabsList
            size="compact"
            className="h-full min-h-0 max-h-none flex-1 justify-start gap-0 overflow-x-auto border-0 bg-transparent px-1"
          >
            {ENTERPRISE_ACCESS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                size="compact"
                className={cn(
                  "gap-1.5 [&[data-state=active]_span]:font-semibold [&[data-state=active]_span]:text-accent",
                  hiringTransition,
                )}
              >
                {tab.label}
                <span className="tabular-nums text-[11px] font-medium text-muted/70">
                  {tabCounts[tab.id]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div
          className={cn(
            "flex shrink-0 items-center gap-2 border-l border-[rgba(15,23,42,0.06)] px-2.5",
            "dark:border-white/[0.08]",
          )}
        >
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
                <span className="max-w-[7rem] truncate text-text sm:max-w-none">{sortLabel}</span>
                <ChevronDown className="h-3 w-3 shrink-0 text-muted/70" strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(v) => onSortChange(v as EnterpriseSortKey)}
              >
                {ENTERPRISE_SORT_OPTIONS.map((opt) => (
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

          <EnterprisesFiltersPopover
            filters={filters}
            onApply={onFiltersChange}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>
    </div>
  );
}
