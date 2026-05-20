"use client";

import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { ScheduleFilterState, ScheduleSortKey } from "@/lib/hiring/assessments/scheduleFilters";
import { hiringTransition } from "../hiringTokens";

const SORT_OPTIONS: { value: ScheduleSortKey; label: string }[] = [
  { value: "expiry", label: "Expiry date" },
  { value: "invite", label: "Invite sent" },
  { value: "name", label: "Candidate name" },
  { value: "progress", label: "Progress" },
  { value: "score", label: "Score" },
];

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const display = options.find((o) => o.value === value)?.label ?? label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1 rounded-[10px] border-[rgba(15,23,42,0.06)] px-2.5 text-[11px] font-medium shadow-none",
            hiringTransition,
          )}
        >
          <span className="text-text-secondary/60">{label}</span>
          <span className="max-w-[88px] truncate text-text">{display}</span>
          <ChevronDown className="h-3 w-3 text-muted/70" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64 w-48 overflow-auto">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value} className="text-[12px]">
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AssessmentScheduleFiltersBar({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  roles,
  assessments,
  recruiters,
  dates,
}: {
  filters: ScheduleFilterState;
  onFiltersChange: (f: ScheduleFilterState) => void;
  sort: ScheduleSortKey;
  onSortChange: (s: ScheduleSortKey) => void;
  roles: string[];
  assessments: string[];
  recruiters: string[];
  dates: string[];
}) {
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Expiry date";
  const patch = (p: Partial<ScheduleFilterState>) => onFiltersChange({ ...filters, ...p });

  const all = (items: string[]) => [{ value: "all", label: "All" }, ...items.map((i) => ({ value: i, label: i }))];

  return (
    <div
      className={cn(
        "sticky top-[52px] z-10 flex flex-wrap items-center gap-2 rounded-[14px] border border-[rgba(15,23,42,0.06)]",
        "bg-white/95 px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-md dark:bg-surface/95",
      )}
    >
      <div className="relative min-w-[180px] flex-1 sm:max-w-[240px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
        <Input
          value={filters.search}
          onChange={(e) => patch({ search: e.target.value })}
          placeholder="Search candidate"
          className="h-8 rounded-[10px] border-[rgba(15,23,42,0.06)] pl-8 text-[12px]"
        />
      </div>
      <FilterSelect label="Role" value={filters.role} options={all(roles)} onChange={(v) => patch({ role: v })} />
      <FilterSelect
        label="Assessment"
        value={filters.assessment}
        options={all(assessments)}
        onChange={(v) => patch({ assessment: v })}
      />
      <FilterSelect
        label="Status"
        value={filters.status}
        options={[
          { value: "all", label: "All" },
          { value: "Not Started", label: "Not Started" },
          { value: "Started", label: "Started" },
          { value: "Ongoing", label: "Ongoing" },
          { value: "Submitted", label: "Submitted" },
          { value: "Evaluated", label: "Evaluated" },
          { value: "Expired", label: "Expired" },
        ]}
        onChange={(v) => patch({ status: v })}
      />
      <FilterSelect label="Date" value={filters.date} options={all(dates)} onChange={(v) => patch({ date: v })} />
      <FilterSelect
        label="Malpractice"
        value={filters.malpractice}
        options={[
          { value: "all", label: "All" },
          { value: "flagged", label: "Flagged" },
          { value: "clean", label: "Clean" },
        ]}
        onChange={(v) => patch({ malpractice: v })}
      />
      <FilterSelect
        label="Score"
        value={filters.score}
        options={[
          { value: "all", label: "All" },
          { value: "scored", label: "Scored" },
          { value: "unscored", label: "Unscored" },
        ]}
        onChange={(v) => patch({ score: v })}
      />
      <FilterSelect
        label="Recruiter"
        value={filters.recruiter}
        options={all(recruiters)}
        onChange={(v) => patch({ recruiter: v })}
      />
      <div className="ml-auto">
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
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
              Sort by
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sort} onValueChange={(v) => onSortChange(v as ScheduleSortKey)}>
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
