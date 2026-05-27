"use client";

import { useState } from "react";
import {
  ChevronDown,
  Filter,
  Layers,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  countActiveAdvancedFilters,
  EMPTY_ADVANCED_FILTERS,
  INTERVIEW_STATUS_FILTERS,
  type InterviewKanbanAdvancedFilters,
  type InterviewOperationalStatus,
} from "@/lib/hiring/interviewKanbanOps";
import type { InterviewRound } from "@/lib/hiring/interviewRounds";
import { cn } from "@/lib/utils";

export type InterviewRoundOption = {
  id: string;
  title: string;
  count: number;
};

function countBadge(count: number) {
  return (
    <span className="ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgba(15,23,42,0.06)] px-1.5 text-[10px] font-semibold tabular-nums text-text-secondary dark:bg-white/[0.08]">
      {count}
    </span>
  );
}

/** Radix-style soft outline for toolbar triggers (matches search field) */
const toolbarTriggerClass =
  "border-border-subtle bg-surface shadow-none hover:bg-surface-2 dark:border-border-subtle dark:hover:bg-white/[0.04]";

const toolbarTriggerActiveClass =
  "border-[rgb(var(--accent-rgb)/0.22)] bg-[rgb(var(--accent-soft-rgb)/0.55)] hover:bg-[rgb(var(--accent-soft-rgb)/0.72)] dark:border-[rgb(var(--accent-rgb)/0.28)]";

export function InterviewKanbanToolbar({
  rounds,
  roundOptions,
  activeRoundId,
  onActiveRoundChange,
  canManageRounds,
  onAddRound,
  onDeleteRound,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  advanced,
  onAdvancedChange,
  interviewers,
  interviewTypes,
  searchQuery,
  onSearchQueryChange,
  onClearAllFilters,
}: {
  rounds: InterviewRound[];
  roundOptions: InterviewRoundOption[];
  activeRoundId: string | null;
  onActiveRoundChange: (roundId: string | null) => void;
  canManageRounds: boolean;
  onAddRound: (title: string) => void;
  onDeleteRound: (roundId: string) => void;
  statusFilter: InterviewOperationalStatus | "All";
  onStatusFilterChange: (v: InterviewOperationalStatus | "All") => void;
  statusCounts: Record<InterviewOperationalStatus | "All", number>;
  advanced: InterviewKanbanAdvancedFilters;
  onAdvancedChange: (v: InterviewKanbanAdvancedFilters) => void;
  interviewers: string[];
  interviewTypes: string[];
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onClearAllFilters?: () => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftAdvanced, setDraftAdvanced] = useState(advanced);
  const [showAddRoundForm, setShowAddRoundForm] = useState(false);
  const [newRoundTitle, setNewRoundTitle] = useState("");

  const activeFilterCount = countActiveAdvancedFilters(advanced);
  const hasActiveFilters =
    statusFilter !== "All" || activeFilterCount > 0 || searchQuery.trim().length > 0;
  const totalCount = statusCounts.All ?? 0;

  const activeRound = activeRoundId ? rounds.find((r) => r.id === activeRoundId) : null;
  const activeRoundCount =
    activeRound != null
      ? (roundOptions.find((o) => o.id === activeRound.id)?.count ?? 0)
      : totalCount;

  const roundTriggerLabel = activeRound?.title ?? "All rounds";

  function applyFilters() {
    onAdvancedChange(draftAdvanced);
    setFiltersOpen(false);
  }

  function clearAdvancedFilters() {
    onAdvancedChange(EMPTY_ADVANCED_FILTERS);
    setDraftAdvanced(EMPTY_ADVANCED_FILTERS);
    setFiltersOpen(false);
  }

  function clearAll() {
    onStatusFilterChange("All");
    clearAdvancedFilters();
    onSearchQueryChange("");
    onClearAllFilters?.();
  }

  function submitNewRound() {
    const trimmed = newRoundTitle.trim();
    if (!trimmed) {
      toast.error("Enter a round name");
      return;
    }
    if (rounds.some((r) => r.title.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("A round with this name already exists");
      return;
    }
    onAddRound(trimmed);
    setNewRoundTitle("");
    setShowAddRoundForm(false);
    toast.success(`Added ${trimmed}`);
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[rgba(15,23,42,0.06)] py-2 dark:border-white/[0.06]">
      <div className="flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-8 gap-1 rounded-[9px] px-2.5 text-xs", toolbarTriggerClass)}>
              <Layers className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
              <span className="max-w-[140px] truncate font-medium">{roundTriggerLabel}</span>
              {countBadge(activeRoundCount)}
              <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
              Interview rounds
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={activeRoundId ?? "all"}
              onValueChange={(v) => onActiveRoundChange(v === "all" ? null : v)}
            >
              <DropdownMenuRadioItem value="all" className="text-xs">
                <span className="flex flex-1 items-center justify-between gap-2">
                  All rounds
                  {countBadge(totalCount)}
                </span>
              </DropdownMenuRadioItem>
              {roundOptions.map((round) => (
                <DropdownMenuRadioItem key={round.id} value={round.id} className="text-xs">
                  <span className="flex flex-1 items-center justify-between gap-2">
                    {round.title}
                    {countBadge(round.count)}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {canManageRounds ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs"
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowAddRoundForm((v) => !v);
                  }}
                >
                  <Plus className="mr-2 h-3.5 w-3.5" strokeWidth={2} />
                  Add round
                </DropdownMenuItem>
                {showAddRoundForm ? (
                  <div
                    className="space-y-2 px-2 py-2"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={newRoundTitle}
                      onChange={(e) => setNewRoundTitle(e.target.value)}
                      placeholder="Round name"
                      className="h-8 text-xs"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          submitNewRound();
                        }
                      }}
                    />
                    <Button size="sm" className="h-8 w-full text-xs" onClick={submitNewRound}>
                      Add round
                    </Button>
                  </div>
                ) : null}
                {rounds.length > 0 ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
                      Manage rounds
                    </DropdownMenuLabel>
                    {rounds.map((round) => (
                      <DropdownMenuItem
                        key={round.id}
                        className="text-xs text-destructive focus:text-destructive"
                        onSelect={() => onDeleteRound(round.id)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
                        Delete {round.title}
                      </DropdownMenuItem>
                    ))}
                  </>
                ) : null}
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-w-0 flex-1 px-2">
        {hasActiveFilters ? (
          <p className="truncate text-[11px] text-[#71717A] dark:text-muted">
            {statusFilter !== "All" ? (
              <span className="font-medium text-forest">{statusFilter}</span>
            ) : (
              "Filtered"
            )}
            {activeRound ? ` · ${activeRound.title}` : ""}
            {" · "}
            <span className="tabular-nums">{statusCounts[statusFilter] ?? statusCounts.All}</span> shown
          </p>
        ) : (
          <p className="truncate text-[11px] text-[#A1A1AA]">
            Filter by status within each round — rejections stay in their round column
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1 rounded-[9px] px-2.5 text-xs",
                toolbarTriggerClass,
                statusFilter !== "All" && toolbarTriggerActiveClass,
              )}
            >
              <span className="text-[#71717A]">Status:</span>
              <span className="max-w-[120px] truncate font-medium text-text">{statusFilter}</span>
              {statusFilter !== "All" ? countBadge(statusCounts[statusFilter] ?? 0) : null}
              <ChevronDown className="h-3 w-3 opacity-50" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[min(320px,50vh)] w-56 overflow-y-auto">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
              Interview status
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(v) => onStatusFilterChange(v as InterviewOperationalStatus | "All")}
            >
              {INTERVIEW_STATUS_FILTERS.map((f) => (
                <DropdownMenuRadioItem key={f} value={f} className="text-xs">
                  <span className="flex flex-1 items-center justify-between gap-2">
                    {f}
                    {countBadge(statusCounts[f] ?? 0)}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover
          open={filtersOpen}
          onOpenChange={(open) => {
            setFiltersOpen(open);
            if (open) setDraftAdvanced(advanced);
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 rounded-[9px] px-2.5 text-xs", toolbarTriggerClass)}>
              <Filter className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
              Filters
              {activeFilterCount > 0 ? countBadge(activeFilterCount) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 space-y-3 p-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wide text-muted">Interviewer</Label>
              <Select
                value={draftAdvanced.interviewer || "all"}
                onValueChange={(v) =>
                  setDraftAdvanced({ ...draftAdvanced, interviewer: v === "all" ? "" : v })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {interviewers.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wide text-muted">Type</Label>
              <Select
                value={draftAdvanced.interviewType || "all"}
                onValueChange={(v) =>
                  setDraftAdvanced({ ...draftAdvanced, interviewType: v === "all" ? "" : v })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {interviewTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wide text-muted">Date</Label>
              <Select
                value={draftAdvanced.date || "all"}
                onValueChange={(v) => setDraftAdvanced({ ...draftAdvanced, date: v === "all" ? "" : v })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wide text-muted">Feedback</Label>
              <Select
                value={draftAdvanced.feedbackStatus || "all"}
                onValueChange={(v) =>
                  setDraftAdvanced({ ...draftAdvanced, feedbackStatus: v === "all" ? "" : v })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="awaiting">Awaiting</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between border-t border-[rgba(15,23,42,0.06)] pt-2 dark:border-white/[0.06]">
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearAdvancedFilters}>
                Clear
              </Button>
              <Button size="sm" className="h-8 text-xs" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearAll}>
            Clear filters
          </Button>
        ) : null}

        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" strokeWidth={1.75} />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search"
            className={cn("h-8 w-[120px] rounded-[9px] border-border-subtle pl-8 text-xs shadow-none lg:w-[160px]", toolbarTriggerClass)}
            aria-label="Search candidates"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 sm:hidden"
              aria-label="More toolbar actions"
            >
              <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search candidates"
                className="h-8 pl-8 text-xs"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
