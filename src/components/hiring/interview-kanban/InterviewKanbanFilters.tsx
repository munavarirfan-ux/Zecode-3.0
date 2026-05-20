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
import {
  EMPTY_ADVANCED_FILTERS,
  INTERVIEW_STATUS_FILTERS,
  type InterviewKanbanAdvancedFilters,
  type InterviewOperationalStatus,
} from "@/lib/hiring/interviewKanbanOps";
import { cn } from "@/lib/utils";

export function InterviewKanbanFilters({
  statusFilter,
  onStatusFilterChange,
  advanced,
  onAdvancedChange,
  interviewers,
  interviewTypes,
  resultCount,
  statusCounts,
}: {
  statusFilter: InterviewOperationalStatus | "All";
  onStatusFilterChange: (v: InterviewOperationalStatus | "All") => void;
  advanced: InterviewKanbanAdvancedFilters;
  onAdvancedChange: (v: InterviewKanbanAdvancedFilters) => void;
  interviewers: string[];
  interviewTypes: string[];
  resultCount: number;
  statusCounts: Record<InterviewOperationalStatus | "All", number>;
}) {
  const hasAdvanced =
    advanced.interviewer ||
    advanced.interviewType ||
    advanced.date ||
    advanced.feedbackStatus;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] text-text-secondary/70">
          <span className="font-semibold tabular-nums text-text">{resultCount}</span> candidates in
          pipeline
        </p>
        {hasAdvanced ? (
          <button
            type="button"
            className="text-[11px] font-medium text-forest hover:text-forest/80"
            onClick={() => onAdvancedChange(EMPTY_ADVANCED_FILTERS)}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "flex gap-1 overflow-x-auto px-0.5 pb-0.5",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        role="tablist"
        aria-label="Interview status filters"
      >
        {INTERVIEW_STATUS_FILTERS.map((f) => {
          const active = statusFilter === f;
          const count = statusCounts[f] ?? 0;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onStatusFilterChange(f)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                active
                  ? "border-forest/25 bg-forest/10 text-forest"
                  : "border-[rgba(15,23,42,0.08)] bg-white/80 text-[#71717A] hover:border-[rgba(15,23,42,0.12)] hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-muted",
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <span>{f}</span>
                <span className={cn("tabular-nums text-[10px] font-semibold", active ? "text-forest/90" : "text-muted/80")}>
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="px-0.5">
        <div
          className={cn(
            "flex flex-wrap items-center gap-2.5 rounded-[14px] border border-[rgba(15,23,42,0.06)]",
            "bg-[rgba(15,23,42,0.02)] p-1.5",
            "dark:border-white/[0.06] dark:bg-white/[0.03]",
          )}
          aria-label="Advanced interview filters"
        >
          <FilterDropdown
            label="Interviewer"
            value={advanced.interviewer || "All"}
            options={["All", ...interviewers]}
            onChange={(v) => onAdvancedChange({ ...advanced, interviewer: v === "All" ? "" : v })}
          />
          <FilterDropdown
            label="Type"
            value={advanced.interviewType || "All"}
            options={["All", ...interviewTypes]}
            onChange={(v) => onAdvancedChange({ ...advanced, interviewType: v === "All" ? "" : v })}
          />
          <FilterDropdown
            label="Date"
            value={advanced.date || "All"}
            options={["All", "upcoming", "completed"]}
            labels={{ upcoming: "Upcoming", completed: "Completed" }}
            onChange={(v) => onAdvancedChange({ ...advanced, date: v === "All" ? "" : v })}
          />
          <FilterDropdown
            label="Feedback"
            value={advanced.feedbackStatus || "All"}
            options={["All", "awaiting", "submitted", "overdue"]}
            labels={{
              awaiting: "Awaiting",
              submitted: "Submitted",
              overdue: "Overdue",
            }}
            onChange={(v) => onAdvancedChange({ ...advanced, feedbackStatus: v === "All" ? "" : v })}
          />
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  onChange: (v: string) => void;
}) {
  const display = labels?.[value] ?? value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 rounded-[9px] border-[rgba(15,23,42,0.08)] px-2.5 text-[11px] font-medium shadow-none"
        >
          <span className="text-muted/80">{label}:</span>
          <span>{display}</span>
          <ChevronDown className="h-3 w-3 opacity-60" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt} value={opt} className="text-xs">
              {labels?.[opt] ?? opt}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
