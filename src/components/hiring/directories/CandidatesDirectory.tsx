"use client";

import { useEffect, useMemo, useState } from "react";
import { useRole } from "@/context/RoleContext";
import {
  EMPTY_CANDIDATE_DIRECTORY_FILTERS,
  filterCandidateDirectoryRows,
  getAllCandidateDirectoryRows,
  getCandidateDirectoryFilterOptions,
} from "@/lib/hiring/candidateDirectory";
import { getCandidateDirectoryStats } from "@/lib/hiring/candidateDirectoryStats";
import { cn } from "@/lib/utils";
import { CandidateReportDialog } from "../applicants/CandidateReportDialog";
import { hiringCanvas, hiringCard } from "../hiringTokens";
import { CandidateDirectoryFiltersBar } from "./CandidateDirectoryFilters";
import { CandidateDirectoryGridView, CandidateDirectoryListView } from "./CandidateDirectoryViews";
import {
  CANDIDATES_PAGE_SIZE,
  CandidateDirectoryPagination,
} from "./CandidateDirectoryPagination";
import { CandidatesDirectoryHero } from "./CandidatesDirectoryHero";
import { PremiumEmptyState } from "@/components/onboarding/PremiumEmptyState";
import { NewUserModuleEmptyState } from "@/components/onboarding/NewUserModuleEmptyState";
import { EMPTY_STATE_PRESETS } from "@/lib/onboarding/emptyStatePresets";
import { isFreshNewUserWorkspace } from "@/lib/onboarding/workspaceMode";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";
import { ROUTES } from "@/config/routes";
import type { CandidateDirectoryRow } from "@/lib/hiring/candidateDirectory";

export function CandidatesDirectory() {
  const { selectedRole } = useRole();
  const workspaceRefresh = useWorkspaceRefresh();
  const [view, setView] = useState<"list" | "grid">("list");
  const [filters, setFilters] = useState(EMPTY_CANDIDATE_DIRECTORY_FILTERS);
  const [page, setPage] = useState(1);
  const [reportRow, setReportRow] = useState<CandidateDirectoryRow | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const freshNewUser = useMemo(
    () => isFreshNewUserWorkspace(selectedRole),
    [selectedRole, workspaceRefresh],
  );

  const allRows = useMemo(
    () => getAllCandidateDirectoryRows(selectedRole),
    [selectedRole, workspaceRefresh],
  );

  const showNewUserEmpty = freshNewUser && allRows.length === 0;
  const filterOptions = useMemo(() => getCandidateDirectoryFilterOptions(allRows), [allRows]);
  const rows = useMemo(
    () => filterCandidateDirectoryRows(allRows, filters),
    [allRows, filters],
  );
  const stats = useMemo(() => getCandidateDirectoryStats(allRows), [allRows]);

  const totalPages = Math.max(1, Math.ceil(rows.length / CANDIDATES_PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [filters, view]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * CANDIDATES_PAGE_SIZE;
    return rows.slice(start, start + CANDIDATES_PAGE_SIZE);
  }, [rows, page]);

  const openReport = (row: CandidateDirectoryRow) => {
    setReportRow(row);
    setReportOpen(true);
  };

  return (
    <div className={hiringCanvas}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(15,61,46,0.04),transparent)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(167,243,208,0.035),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-shell space-y-4 pb-10">
        {showNewUserEmpty ? (
          <NewUserModuleEmptyState module="candidates" />
        ) : (
        <>
        <CandidatesDirectoryHero stats={stats} />

        <CandidateDirectoryFiltersBar
          filters={filters}
          onChange={setFilters}
          options={filterOptions}
          view={view}
          onViewChange={setView}
        />

        <section>
          {rows.length > 0 ? (
            view === "grid" ? (
              <div className="space-y-3">
                <CandidateDirectoryGridView rows={paginatedRows} onCardClick={openReport} />
                <div className={cn(hiringCard, "overflow-hidden !rounded-[14px] !p-0")}>
                  <CandidateDirectoryPagination
                    page={page}
                    totalPages={totalPages}
                    totalCount={rows.length}
                    pageSize={CANDIDATES_PAGE_SIZE}
                    onPageChange={setPage}
                  />
                </div>
              </div>
            ) : (
              <CandidateDirectoryListView
                rows={paginatedRows}
                totalCount={rows.length}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onRowClick={openReport}
              />
            )
          ) : allRows.length === 0 ? (
            <PremiumEmptyState
              {...EMPTY_STATE_PRESETS.candidates}
              ctaLabel="Add Candidate"
              ctaHref={`${ROUTES.hiringJobs}?addJob=1`}
            />
          ) : (
            <PremiumEmptyState
              illustration="candidates"
              headline="No candidates match"
              subtext="Adjust filters or search to explore your hiring pipeline."
            />
          )}
        </section>
        </>
        )}
      </div>

      {reportRow ? (
        <CandidateReportDialog
          candidate={reportRow}
          job={reportRow.job}
          open={reportOpen}
          onOpenChange={setReportOpen}
          reportContext="directory"
        />
      ) : null}
    </div>
  );
}
