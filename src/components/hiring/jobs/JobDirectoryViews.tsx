"use client";

import { useRouter } from "next/navigation";
import { Briefcase, ChevronRight, MapPin } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { HiringJob } from "@/lib/hiring/types";
import { JobCard } from "../JobCard";
import { StatusBadge } from "../StatusBadge";
import { hiringCard, hiringTransition } from "../hiringTokens";
import { PaginationControls } from "../directories/DirectoryPagination";

export const JOBS_PAGE_SIZE = 25;

const LIST_ROW_GRID = cn(
  "grid items-center gap-x-3 px-3",
  "grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_5.5rem_4.5rem_4.5rem_1.75rem]",
);

const HEADER_LABEL = "text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/70";

function JobListHeader() {
  return (
    <header
      className={cn(
        LIST_ROW_GRID,
        "hidden border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] py-2 md:grid",
      )}
    >
      <span className={HEADER_LABEL}>Job</span>
      <span className={HEADER_LABEL}>Location</span>
      <span className={HEADER_LABEL}>Status</span>
      <span className={cn(HEADER_LABEL, "text-right")}>Candidates</span>
      <span className={cn(HEADER_LABEL, "text-right")}>Interviewing</span>
      <span className="sr-only">Open</span>
    </header>
  );
}

function JobListRow({ job }: { job: HiringJob }) {
  const router = useRouter();
  const href = ROUTES.hiringJob(job.id);

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={() => router.push(href)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(href);
          }
        }}
        className={cn(
          "group flex cursor-pointer items-center gap-2.5 border-b border-[rgba(15,23,42,0.05)] px-3 py-2.5 md:hidden",
          hiringTransition,
          "hover:bg-[rgba(15,61,46,0.04)]",
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)]">
          <Briefcase className="h-4 w-4 text-forest/70" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-text">{job.title}</p>
          <p className="truncate text-[11px] text-text-secondary/70">
            {job.department} · {job.location}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <StatusBadge status={job.status} />
            <span className="text-[10px] tabular-nums text-text-secondary/60">
              {job.candidateCount} candidates
            </span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary/30" />
      </article>

      <article
        role="button"
        tabIndex={0}
        onClick={() => router.push(href)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(href);
          }
        }}
        className={cn(
          LIST_ROW_GRID,
          "group hidden cursor-pointer border-b border-[rgba(15,23,42,0.05)] py-2.5 last:border-b-0 md:grid",
          hiringTransition,
          "hover:bg-[rgba(15,61,46,0.04)]",
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text group-hover:text-forest">
            {job.title}
          </p>
          <p className="truncate text-[11px] text-text-secondary/70">{job.department}</p>
        </div>

        <p className="flex min-w-0 items-center gap-1 truncate text-[11px] text-text-secondary/75">
          <MapPin className="h-3 w-3 shrink-0 opacity-45" strokeWidth={1.5} />
          {job.location}
        </p>

        <StatusBadge status={job.status} />

        <p className="text-right text-[12px] font-semibold tabular-nums text-text">
          {job.candidateCount}
        </p>

        <p className="text-right text-[12px] font-medium tabular-nums text-text-secondary/80">
          {job.interviewingCount}
        </p>

        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center justify-self-end rounded-full text-text-secondary/30",
            "group-hover:bg-[rgba(15,23,42,0.04)] group-hover:text-text-secondary/70",
          )}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </article>
    </>
  );
}

export function JobDirectoryListView({
  jobs,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  jobs: HiringJob[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  return (
    <div
      className={cn(
        hiringCard,
        "overflow-hidden !rounded-[14px] !p-0",
        "border-[rgba(15,23,42,0.05)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
      )}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[40rem]">
          <JobListHeader />
          <div role="list" aria-label="Jobs">
            {jobs.map((job) => (
              <JobListRow key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>

      <PaginationControls
        totalItems={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        entityLabel="jobs"
      />
    </div>
  );
}

export function JobDirectoryGridView({
  jobs,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  jobs: HiringJob[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  return (
    <div
      className={cn(
        hiringCard,
        "overflow-hidden !rounded-[14px] !p-0",
        "border-[rgba(15,23,42,0.05)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
      )}
    >
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 lg:p-5">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      <PaginationControls
        totalItems={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        entityLabel="jobs"
      />
    </div>
  );
}
