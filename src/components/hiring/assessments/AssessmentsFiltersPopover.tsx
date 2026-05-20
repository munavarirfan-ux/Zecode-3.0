"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AssessmentLifecycleStatus } from "@/lib/hiring/assessments/types";
import {
  countActiveAssessmentFilters,
  EMPTY_ASSESSMENTS_FILTERS,
  type AssessmentsFilterState,
} from "@/lib/hiring/assessments/assessmentFilters";
import { hiringTransition } from "../hiringTokens";

const ALL = "__all__";

const STATUSES: AssessmentLifecycleStatus[] = ["Ongoing", "Completed", "Draft"];

function FilterField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  const selectValue = value || ALL;

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-text-secondary/80">{label}</label>
      <Select value={selectValue} onValueChange={(v) => onChange(v === ALL ? "" : v)}>
        <SelectTrigger className="h-9 w-full rounded-[10px] border-[rgba(15,23,42,0.06)] bg-surface text-xs font-medium shadow-none focus:ring-forest/12">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{placeholder}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function AssessmentsFiltersPopover({
  filters,
  onApply,
  roles,
  creators,
  dates,
}: {
  filters: AssessmentsFilterState;
  onApply: (next: AssessmentsFilterState) => void;
  roles: string[];
  creators: string[];
  dates: string[];
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AssessmentsFilterState>(filters);
  const activeCount = countActiveAssessmentFilters(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const setDraftField = <K extends keyof AssessmentsFilterState>(key: K, value: AssessmentsFilterState[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const handleClear = () => {
    setDraft(EMPTY_ASSESSMENTS_FILTERS);
    onApply(EMPTY_ASSESSMENTS_FILTERS);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            "h-9 gap-2 rounded-[11px] border-[rgba(15,23,42,0.06)] px-3 text-xs font-medium shadow-none",
            hiringTransition,
            activeCount > 0 && "border-forest/25 bg-forest/[0.04] text-forest",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.5} />
          Filters
          {activeCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1.5 text-[10px] font-semibold tabular-nums text-white">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[min(100vw-2rem,22rem)] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="border-b border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
          <p className="text-sm font-semibold tracking-tight text-text">Filter assessments</p>
          <p className="mt-0.5 text-[11px] text-text-secondary/75">Refine by role, status, and creator</p>
        </div>
        <div className="grid max-h-[min(60vh,360px)] gap-3 overflow-y-auto p-4">
          <FilterField
            label="Date"
            value={draft.date}
            onChange={(v) => setDraftField("date", v)}
            options={dates}
            placeholder="All dates"
          />
          <FilterField
            label="Role"
            value={draft.role}
            onChange={(v) => setDraftField("role", v)}
            options={roles}
            placeholder="All roles"
          />
          <FilterField
            label="Status"
            value={draft.status}
            onChange={(v) => setDraftField("status", v)}
            options={STATUSES}
            placeholder="All statuses"
          />
          <FilterField
            label="Created by"
            value={draft.createdBy}
            onChange={(v) => setDraftField("createdBy", v)}
            options={creators}
            placeholder="All creators"
          />
        </div>
        <div className="flex gap-2 border-t border-[rgba(15,23,42,0.06)] p-3 dark:border-white/[0.06]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 flex-1 rounded-[10px] text-xs font-medium"
            onClick={handleClear}
          >
            Clear all
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 flex-1 rounded-[10px] bg-forest text-xs font-medium text-white hover:bg-forest/92"
            onClick={handleApply}
          >
            Apply filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
