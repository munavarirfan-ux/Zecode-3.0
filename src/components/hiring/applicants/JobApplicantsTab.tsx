"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCandidatesForJob } from "@/lib/hiring/mockData";
import { getCandidateStage, type HiringStageName } from "@/lib/hiring/stages";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { ApplicantRowCard } from "./ApplicantRowCard";
import { CandidateReportDialog } from "./CandidateReportDialog";
import {
  ApplicantsFiltersPopover,
  EMPTY_APPLICANTS_FILTERS,
  type ApplicantsFilterState,
} from "./ApplicantsFiltersPopover";
import { normalizeSource } from "@/lib/hiring/stages";
import { cn } from "@/lib/utils";
import { DirectoryPagination } from "../directories/DirectoryPagination";
import { hiringCard } from "../hiringTokens";

export const APPLICANTS_PAGE_SIZE = 25;

type SortKey = "newest" | "oldest";

function matchesAppliedDate(appliedAt: string, filter: string): boolean {
  if (!filter) return true;
  const applied = new Date(appliedAt);
  const now = new Date("2026-05-15");
  const days = filter === "7d" ? 7 : 30;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return applied >= cutoff;
}

function applyFilters(list: HiringCandidate[], filters: ApplicantsFilterState): HiringCandidate[] {
  let result = [...list];
  if (filters.source) {
    result = result.filter((c) => normalizeSource(c.source as string) === filters.source);
  }
  if (filters.stage) {
    result = result.filter(
      (c) => `${getCandidateStage(c)} · ${c.currentSubstage}` === filters.stage,
    );
  }
  if (filters.status) result = result.filter((c) => c.resumeStatus === filters.status);
  if (filters.appliedDate) result = result.filter((c) => matchesAppliedDate(c.appliedAt, filters.appliedDate));
  if (filters.owner) result = result.filter((c) => c.recruiterOwner === filters.owner);
  return result;
}

export function JobApplicantsTab({
  job,
  candidates,
  stageFilter,
  variant = "directory",
  emptyMessage,
  onCandidatesChange,
  openCandidateId,
  onOpenCandidateHandled,
}: {
  job: HiringJob;
  candidates: HiringCandidate[];
  stageFilter?: HiringStageName;
  /** Full job candidate list (default) vs stage-scoped list */
  variant?: "directory" | "list";
  emptyMessage?: string;
  onCandidatesChange?: () => void;
  openCandidateId?: string | null;
  onOpenCandidateHandled?: () => void;
}) {
  const isDirectory = variant === "directory" && !stageFilter;
  const defaultEmptyMessage = isDirectory
    ? "No candidates for this job yet."
    : "No applicants match your filters.";
  const resolvedEmptyMessage = emptyMessage ?? defaultEmptyMessage;
  const [filters, setFilters] = useState<ApplicantsFilterState>(EMPTY_APPLICANTS_FILTERS);
  const [sort, setSort] = useState<SortKey>("newest");
  const [selected, setSelected] = useState<HiringCandidate | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportTab, setReportTab] = useState("overview");
  const [page, setPage] = useState(1);
  const [applicants, setApplicants] = useState<HiringCandidate[]>(candidates);

  useEffect(() => {
    setApplicants(candidates);
  }, [candidates]);

  const refreshApplicants = useCallback(() => {
    const fresh = getCandidatesForJob(job.id);
    const filtered = stageFilter
      ? fresh.filter((c) => getCandidateStage(c) === stageFilter)
      : fresh;
    setApplicants(filtered);
    onCandidatesChange?.();
  }, [job.id, stageFilter, onCandidatesChange]);

  const filtered = useMemo(() => {
    let list = applyFilters(applicants, filters);
    list.sort((a, b) => {
      const cmp = a.appliedAt.localeCompare(b.appliedAt);
      return sort === "newest" ? -cmp : cmp;
    });
    return list;
  }, [applicants, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / APPLICANTS_PAGE_SIZE));

  const paginatedApplicants = useMemo(() => {
    const start = (page - 1) * APPLICANTS_PAGE_SIZE;
    return filtered.slice(start, start + APPLICANTS_PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openReport = (c: HiringCandidate, tab = "overview") => {
    setSelected(c);
    setReportTab(tab);
    setReportOpen(true);
  };

  useEffect(() => {
    if (!openCandidateId) return;
    const match = applicants.find((c) => c.id === openCandidateId);
    if (match) {
      openReport(match);
      onOpenCandidateHandled?.();
    }
  }, [openCandidateId, applicants, onOpenCandidateHandled]);

  return (
    <div className="space-y-4">
      {isDirectory ? (
        <div className="mb-1">
          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
            Candidate directory
          </h2>
          <p className="mt-0.5 text-[13px] text-[#71717A]">
            Everyone who has applied to {job.title}. Filter by stage, source, or owner.
          </p>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-[#71717A]">
          <span className="text-[1.25rem] font-semibold tabular-nums tracking-[-0.03em] text-[#18181B] dark:text-text">
            {filtered.length}
          </span>
          <span className="ml-1.5 font-medium text-[#52525B]">
            {filtered.length === 1 ? "candidate" : "candidates"}
          </span>
          {filtered.length !== applicants.length ? (
            <span className="ml-1 text-[#A1A1AA]">· {applicants.length} total</span>
          ) : null}
        </p>
        <div className="flex items-center gap-2">
          <ApplicantsFiltersPopover candidates={applicants} filters={filters} onChange={setFilters} />
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-8 w-[9.5rem] rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white text-[12px] font-medium shadow-sm dark:bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest applied</SelectItem>
              <SelectItem value="oldest">Oldest applied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-[20px] border border-[rgba(15,23,42,0.04)] bg-surface/98 px-5 py-12 text-center text-[13px] text-[#71717A]">
          {resolvedEmptyMessage}
        </p>
      ) : (
        <div
          className={cn(
            hiringCard,
            "overflow-hidden !rounded-[14px] !p-0",
            "border-[rgba(15,23,42,0.05)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
          )}
        >
          <ul className="divide-y divide-[rgba(15,23,42,0.05)] px-1 py-1 sm:px-1.5" role="list">
            {paginatedApplicants.map((c) => (
              <li key={c.id} className="py-1.5 first:pt-2 last:pb-2">
                <ApplicantRowCard
                  candidate={c}
                  onOpenReport={() => openReport(c)}
                  onOpenResume={() => openReport(c, "resume")}
                  onStageChanged={refreshApplicants}
                />
              </li>
            ))}
          </ul>
          <DirectoryPagination
            page={page}
            totalPages={totalPages}
            totalCount={filtered.length}
            pageSize={APPLICANTS_PAGE_SIZE}
            onPageChange={setPage}
            itemLabel="applicants"
          />
        </div>
      )}

      <CandidateReportDialog
        candidate={selected}
        job={job}
        reportContext="job"
        open={reportOpen}
        initialTab={reportTab}
        onOpenChange={(open) => {
          setReportOpen(open);
          if (!open) {
            setSelected(null);
            setReportTab("overview");
          }
        }}
        onApplicantMoved={() => {
          refreshApplicants();
          setReportOpen(false);
          setSelected(null);
          setReportTab("overview");
        }}
        onCandidateUpdated={(updated) => {
          setApplicants((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          setSelected(updated);
          refreshApplicants();
        }}
      />
    </div>
  );
}
