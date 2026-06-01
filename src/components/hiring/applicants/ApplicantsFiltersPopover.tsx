"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CANDIDATE_SOURCES, getCandidateStage } from "@/lib/hiring/stages";
import type { HiringCandidate } from "@/lib/hiring/types";
import { hiringTransition } from "../hiringTokens";

const ALL = "__all__";

export type ApplicantsFilterState = {
  source: string;
  stage: string;
  status: string;
  appliedDate: string;
  owner: string;
  contactStatus: string;
};

export const EMPTY_APPLICANTS_FILTERS: ApplicantsFilterState = {
  source: "",
  stage: "",
  status: "",
  appliedDate: "",
  owner: "",
  contactStatus: "",
};

export function countApplicantFilters(filters: ApplicantsFilterState): number {
  return Object.values(filters).filter(Boolean).length;
}

function uniqueStages(candidates: HiringCandidate[]) {
  const set = new Set<string>();
  for (const c of candidates) {
    set.add(`${getCandidateStage(c)} · ${c.currentSubstage}`);
  }
  return Array.from(set).sort();
}

function uniqueOwners(candidates: HiringCandidate[]) {
  return Array.from(new Set(candidates.map((c) => c.recruiterOwner))).sort();
}

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
  options: readonly { value: string; label: string }[];
  placeholder: string;
}) {
  const selectValue = value || ALL;

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-[#71717A]">{label}</label>
      <Select value={selectValue} onValueChange={(v) => onChange(v === ALL ? "" : v)}>
        <SelectTrigger className="h-8 w-full rounded-[8px] border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] text-[12px] font-medium shadow-none dark:bg-white/[0.03]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{placeholder}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ApplicantsFiltersPopover({
  candidates,
  filters,
  onChange,
}: {
  candidates: HiringCandidate[];
  filters: ApplicantsFilterState;
  onChange: (filters: ApplicantsFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const activeCount = countApplicantFilters(filters);

  const stages = uniqueStages(candidates);
  const owners = uniqueOwners(candidates);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const apply = () => {
    onChange(draft);
    setOpen(false);
  };

  const clear = () => {
    const empty = { ...EMPTY_APPLICANTS_FILTERS };
    setDraft(empty);
    onChange(empty);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "relative h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-sm dark:bg-surface",
            hiringTransition,
            "hover:border-[rgba(15,61,46,0.12)]",
          )}
          aria-label="Filter applicants"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#52525B]" strokeWidth={1.5} />
          {activeCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[9px] font-semibold text-white dark:bg-emerald-500">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 rounded-[12px] p-3">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A1A1AA]">Filters</p>
        <div className="grid gap-2.5">
          <FilterField
            label="Source"
            value={draft.source}
            onChange={(source) => setDraft((d) => ({ ...d, source }))}
            placeholder="All sources"
            options={CANDIDATE_SOURCES.map((s) => ({
              value: s,
              label: s,
            }))}
          />
          <FilterField
            label="Stage"
            value={draft.stage}
            onChange={(stage) => setDraft((d) => ({ ...d, stage }))}
            placeholder="All stages"
            options={stages.map((s) => ({ value: s, label: s }))}
          />
          <FilterField
            label="Status"
            value={draft.status}
            onChange={(status) => setDraft((d) => ({ ...d, status }))}
            placeholder="All statuses"
            options={[
              { value: "Parsed", label: "Parsed" },
              { value: "Reviewed", label: "Reviewed" },
              { value: "Flagged", label: "Flagged" },
            ]}
          />
          <FilterField
            label="Applied date"
            value={draft.appliedDate}
            onChange={(appliedDate) => setDraft((d) => ({ ...d, appliedDate }))}
            placeholder="Any time"
            options={[
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" },
            ]}
          />
          <FilterField
            label="Owner"
            value={draft.owner}
            onChange={(owner) => setDraft((d) => ({ ...d, owner }))}
            placeholder="All owners"
            options={owners.map((o) => ({ value: o, label: o }))}
          />
          <FilterField
            label="Contact status"
            value={draft.contactStatus}
            onChange={(contactStatus) => setDraft((d) => ({ ...d, contactStatus }))}
            placeholder="All candidates"
            options={[
              { value: "needs_contact", label: "Needs Contact" },
              { value: "engaged", label: "Engaged" },
            ]}
          />
        </div>
        <div className="mt-3 flex gap-2 border-t border-[rgba(15,23,42,0.06)] pt-3">
          <Button type="button" variant="outline" size="sm" className="h-8 flex-1 rounded-[8px] text-[12px]" onClick={clear}>
            Clear
          </Button>
          <Button type="button" size="sm" className="h-8 flex-1 rounded-[8px] bg-forest text-[12px] text-white hover:bg-forest/90" onClick={apply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
