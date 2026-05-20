"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getHiringOverviewStats } from "@/lib/hiring/mockData";
import { getJobsForRole } from "@/lib/hiring/jobsForWorkspace";
import {
  applyJobsFilters,
  countJobsByStatusTab,
  filterJobsByStatusTab,
  sortJobsList,
  type JobsSortKey,
  type JobsStatusTab,
} from "@/lib/hiring/jobDirectoryFilters";
import { useRole } from "@/context/RoleContext";
import { isFreshNewUserWorkspace } from "@/lib/onboarding/workspaceMode";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";
import { AddJobDialog } from "./AddJobDialog";
import { JobsOperationalHero } from "./JobsOperationalHero";
import { EMPTY_JOBS_FILTERS, type JobsFilterState } from "./JobsFiltersPopover";
import { JOBS_UPDATED_EVENT } from "@/lib/hiring/persistedJobs";
import {
  JobDirectoryGridView,
  JobDirectoryListView,
  JOBS_PAGE_SIZE,
} from "./jobs/JobDirectoryViews";
import { JobsDirectoryToolbar } from "./jobs/JobsDirectoryToolbar";
import { hiringCanvas } from "./hiringTokens";
import { PremiumEmptyState } from "@/components/onboarding/PremiumEmptyState";
import { NewUserModuleEmptyState } from "@/components/onboarding/NewUserModuleEmptyState";
import { SmartGuidanceBanner } from "@/components/onboarding/SmartGuidanceBanner";
import { EMPTY_STATE_PRESETS } from "@/lib/onboarding/emptyStatePresets";

const EMPTY_STATS = {
  activeJobs: 0,
  candidatesInPipeline: 0,
  interviewsToday: 0,
  offersPending: 0,
  candidatesThisWeek: 0,
  insights: {
    candidates: "Add a job to begin",
    interviews: "No interviews yet",
    offers: "No offers yet",
  },
};

export function JobsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedRole } = useRole();
  const addJobButtonRef = useRef<HTMLButtonElement>(null);
  const emptyAddJobButtonRef = useRef<HTMLButtonElement>(null);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [addJobReturnSource, setAddJobReturnSource] = useState<"hero" | "empty">("hero");
  const [statusTab, setStatusTab] = useState<JobsStatusTab>("all");
  const [filters, setFilters] = useState<JobsFilterState>(EMPTY_JOBS_FILTERS);
  const [sort, setSort] = useState<JobsSortKey>("updated");
  const [view, setView] = useState<"list" | "grid">("grid");
  const [page, setPage] = useState(1);
  const [jobsRefresh, setJobsRefresh] = useState(0);
  const workspaceRefresh = useWorkspaceRefresh();

  const freshNewUser = useMemo(
    () => isFreshNewUserWorkspace(selectedRole),
    [selectedRole, workspaceRefresh],
  );

  const allJobs = useMemo(
    () => getJobsForRole(selectedRole),
    [selectedRole, jobsRefresh, workspaceRefresh],
  );
  const statusCounts = useMemo(() => countJobsByStatusTab(allJobs), [allJobs]);

  useEffect(() => {
    if (searchParams.get("addJob") === "1") {
      setAddJobOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = () => setJobsRefresh((n) => n + 1);
    window.addEventListener(JOBS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(JOBS_UPDATED_EVENT, handler);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [statusTab, filters, sort, view]);

  function handleAddJobOpenChange(open: boolean) {
    setAddJobOpen(open);
    if (!open && searchParams.get("addJob") === "1") {
      router.replace("/hiring/jobs", { scroll: false });
    }
  }

  const filtered = useMemo(() => {
    const byTab = filterJobsByStatusTab(allJobs, statusTab);
    const byFilters = applyJobsFilters(byTab, filters);
    return sortJobsList(byFilters, sort);
  }, [allJobs, statusTab, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * JOBS_PAGE_SIZE;
    return filtered.slice(start, start + JOBS_PAGE_SIZE);
  }, [filtered, page]);

  const activeJobs = useMemo(
    () => allJobs.filter((j) => j.status !== "Deleted"),
    [allJobs],
  );

  /** New User sees tabs/filters only after their first real (non-deleted) job exists. */
  const newUserHasPostedJob = activeJobs.length > 0;

  const overviewStats = useMemo(
    () => (activeJobs.length > 0 ? getHiringOverviewStats(filtered) : EMPTY_STATS),
    [activeJobs.length, filtered],
  );

  const showNewUserHeroEmpty = freshNewUser && !newUserHasPostedJob;
  const showNewUserPipelineEmpty = freshNewUser && !newUserHasPostedJob;
  const showJobsToolbar = !freshNewUser || newUserHasPostedJob;

  const openCreateJob = () => {
    setAddJobReturnSource("empty");
    setAddJobOpen(true);
  };

  return (
    <div className={hiringCanvas}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(15,61,46,0.04),transparent)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(167,243,208,0.035),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-shell space-y-5 pb-12">
        {showNewUserPipelineEmpty ? (
          <NewUserModuleEmptyState module="jobs" onPrimaryAction={openCreateJob} />
        ) : (
        <>
        <JobsOperationalHero
          stats={overviewStats}
          onAddJob={() => {
            setAddJobReturnSource("hero");
            setAddJobOpen(true);
          }}
          addJobButtonRef={addJobButtonRef}
        />

        <SmartGuidanceBanner className="mb-1" />

        {showJobsToolbar ? (
          <JobsDirectoryToolbar
            statusTab={statusTab}
            onStatusTabChange={setStatusTab}
            statusCounts={statusCounts}
            filters={filters}
            onFiltersChange={setFilters}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
          />
        ) : null}

        <section>
          {filtered.length > 0 ? (
            view === "list" ? (
              <JobDirectoryListView
                jobs={paginatedJobs}
                totalCount={filtered.length}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            ) : (
              <JobDirectoryGridView
                jobs={paginatedJobs}
                totalCount={filtered.length}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )
          ) : activeJobs.length === 0 ? (
            <PremiumEmptyState
              {...EMPTY_STATE_PRESETS.jobs}
              ctaLabel="+ Create Job"
              onCtaClick={openCreateJob}
            />
          ) : (
            <PremiumEmptyState
              {...EMPTY_STATE_PRESETS.jobsFiltered}
              ctaLabel="Add New Job"
              onCtaClick={openCreateJob}
            />
          )}
        </section>
        </>
        )}
      </div>

      <AddJobDialog
        open={addJobOpen}
        onOpenChange={handleAddJobOpenChange}
        onCreated={() => setJobsRefresh((n) => n + 1)}
        returnFocusRef={addJobReturnSource === "hero" ? addJobButtonRef : emptyAddJobButtonRef}
      />
    </div>
  );
}
