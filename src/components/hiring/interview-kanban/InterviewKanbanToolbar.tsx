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
  INTERVIEW_STATUS_CHIPS_OVERFLOW,
  INTERVIEW_STATUS_CHIPS_PRIMARY,
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

const chipBase =
  "inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold transition-colors";

function StatusChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        chipBase,
        active
          ? "border-forest/25 bg-forest/10 text-forest"
          : "border-[rgba(15,23,42,0.08)] bg-white/90 text-[#71717A] hover:border-[rgba(15,23,42,0.12)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-muted",
      )}
    >
      <span>{label}</span>
      <span className={cn("tabular-nums opacity-60", active && "text-forest/90")}>{count}</span>
    </button>
  );
}

function countBadge(count: number) {
  return (
    <span className="ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgba(15,23,42,0.06)] px-1.5 text-[10px] font-semibold tabular-nums text-text-secondary dark:bg-white/[0.08]">
      {count}
    </span>
  );
}

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
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftAdvanced, setDraftAdvanced] = useState(advanced);
  const [showAddRoundForm, setShowAddRoundForm] = useState(false);
  const [newRoundTitle, setNewRoundTitle] = useState("");
  const overflowActive = INTERVIEW_STATUS_CHIPS_OVERFLOW.includes(
    statusFilter as InterviewOperationalStatus,
  );

  const activeFilterCount = countActiveAdvancedFilters(advanced);
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

  function clearFilters() {
    onAdvancedChange(EMPTY_ADVANCED_FILTERS);
    setDraftAdvanced(EMPTY_ADVANCED_FILTERS);
    setFiltersOpen(false);
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
            <Button variant="outline" size="sm" className="h-8 gap-1 rounded-[9px] px-2.5 text-xs shadow-none">
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

      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1 overflow-x-auto",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        role="tablist"
        aria-label="Interview status filters"
      >
        {INTERVIEW_STATUS_CHIPS_PRIMARY.map((f) => (
          <StatusChip
            key={f}
            label={f}
            count={statusCounts[f] ?? 0}
            active={statusFilter === f}
            onClick={() => onStatusFilterChange(f)}
          />
        ))}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 shrink-0 gap-1 px-2 text-xs",
                  overflowActive && "bg-forest/10 text-forest",
                )}
              >
                +{INTERVIEW_STATUS_CHIPS_OVERFLOW.length} more
                <ChevronDown className="h-3 w-3 opacity-60" strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {INTERVIEW_STATUS_CHIPS_OVERFLOW.map((f) => (
                <DropdownMenuItem
                  key={f}
                  className="flex items-center justify-between text-xs"
                  onSelect={() => onStatusFilterChange(f)}
                >
                  {f}
                  {countBadge(statusCounts[f] ?? 0)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Popover
          open={filtersOpen}
          onOpenChange={(open) => {
            setFiltersOpen(open);
            if (open) setDraftAdvanced(advanced);
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-[9px] px-2.5 text-xs shadow-none">
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
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearFilters}>
                Clear
              </Button>
              <Button size="sm" className="h-8 text-xs" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" strokeWidth={1.75} />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search"
            className="h-8 w-[120px] rounded-[9px] pl-8 text-xs lg:w-[160px]"
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
