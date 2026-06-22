"use client";

import { Briefcase, Calendar, ChevronRight, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidateDirectoryRow } from "@/lib/hiring/candidateDirectory";
import { getCandidateStage, normalizeSource } from "@/lib/hiring/stages";
import { hiringCard, hiringTransition } from "../hiringTokens";
import {
  CandidateAvatar,
  CandidateStagePill,
  MetricChip,
} from "./candidateDirectoryUi";
import { CandidateDirectoryPagination } from "./CandidateDirectoryPagination";

/** Shared column template — header + rows use identical grid */
const LIST_ROW_GRID = cn(
  "grid items-center gap-x-3 px-3",
  "grid-cols-[minmax(200px,1.4fr)_minmax(120px,1fr)_5.5rem_6.5rem_6.5rem_minmax(72px,5rem)_minmax(80px,5.5rem)_1.75rem]",
);

const LIST_TABLE_MIN_WIDTH = "min-w-[52rem]";

const HEADER_LABEL = "text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/70";

function ListHeaderCell({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}) {
  return (
    <span
      className={cn(
        HEADER_LABEL,
        align === "end" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </span>
  );
}

function CandidateListHeader() {
  return (
    <header
      className={cn(
        LIST_ROW_GRID,
        "hidden border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] py-2 md:grid",
        "dark:border-white/[0.06] dark:bg-white/[0.02]",
      )}
    >
      <ListHeaderCell className="text-[rgb(0,0,0)]">Candidate</ListHeaderCell>
      <ListHeaderCell className="text-[rgba(0,0,0,0.7)]">Current job</ListHeaderCell>
      <ListHeaderCell className="text-[rgba(0,0,0,0.7)]">Stage</ListHeaderCell>
      <ListHeaderCell className="text-[rgba(0,0,0,0.7)]">Assessments</ListHeaderCell>
      <ListHeaderCell className="text-[rgba(0,0,0,0.7)]">Interviews</ListHeaderCell>
      <ListHeaderCell className="text-[rgba(0,0,0,0.7)]">Source</ListHeaderCell>
      <ListHeaderCell className="text-[rgba(0,0,0,0.7)]">Owner</ListHeaderCell>
      <span className="sr-only">Open</span>
    </header>
  );
}

function CandidateInboxRow({
  row,
  onClick,
}: {
  row: CandidateDirectoryRow;
  onClick: () => void;
}) {
  const stage = getCandidateStage(row);

  return (
    <>
      {/* Mobile — compact stack */}
      <article
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        className={cn(
          "group flex cursor-pointer items-center gap-2.5 border-b border-[rgba(15,23,42,0.05)] px-3 py-2 md:hidden",
          hiringTransition,
          "hover:bg-[rgba(15,61,46,0.04)] dark:hover:bg-emerald-500/[0.04]",
        )}
      >
        <CandidateAvatar name={row.name} className="h-9 w-9 text-[10px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight tracking-[-0.02em] text-text">
            {row.name}
          </p>
          <p className="truncate text-[11px] text-text-secondary/75">{row.email}</p>
          <p className="truncate text-[10px] text-text-secondary/50">{row.phone}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <CandidateStagePill stage={stage} className="!px-2 !py-0 !text-[9px]" />
            <span className="truncate text-[10px] text-text-secondary/60">{row.jobTitle}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary/30 group-hover:text-text-secondary/70" />
      </article>

      {/* Desktop — aligned grid */}
      <article
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        className={cn(
          LIST_ROW_GRID,
          "group hidden cursor-pointer border-b border-[rgba(15,23,42,0.05)] py-2 last:border-b-0 md:grid",
          hiringTransition,
          "hover:bg-[rgba(15,61,46,0.04)] dark:hover:bg-emerald-500/[0.04]",
          "focus-visible:outline-none focus-visible:bg-[rgba(15,61,46,0.05)]",
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <CandidateAvatar name={row.name} className="h-9 w-9 shrink-0 text-[10px]" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight tracking-[-0.02em] text-text">
              {row.name}
            </p>
            <p className="truncate text-[11px] leading-snug text-text-secondary/75">{row.email}</p>
            <p className="truncate text-[10px] leading-snug text-text-secondary/50">{row.phone}</p>
          </div>
        </div>

        <p className="min-w-0 truncate text-[11px] font-medium text-text">{row.jobTitle}</p>

        <div className="flex justify-start">
          <CandidateStagePill stage={stage} className="!px-2 !py-0 !text-[9px]" />
        </div>

        <div className="flex justify-start">
          <MetricChip
            count={row.assessmentCount}
            label="Assess."
            tone="sky"
            icon={ClipboardCheck}
          />
        </div>

        <div className="flex justify-start">
          <MetricChip count={row.interviewCount} label="Intrv." tone="orange" icon={Calendar} />
        </div>

        <p className="min-w-0 truncate text-[10px] text-text-secondary/65">
          {normalizeSource(row.source)}
        </p>

        <p className="min-w-0 truncate text-[10px] font-medium text-text-secondary/75">
          {row.recruiterOwner}
        </p>

        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center justify-self-end rounded-full text-text-secondary/30",
            hiringTransition,
            "group-hover:bg-[rgba(15,23,42,0.04)] group-hover:text-text-secondary/70",
          )}
          aria-hidden
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </article>
    </>
  );
}

export function CandidateDirectoryListView({
  rows,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: {
  rows: CandidateDirectoryRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (row: CandidateDirectoryRow) => void;
}) {
  return (
    <div
      className={cn(
        hiringCard,
        "!rounded-[14px] overflow-hidden !p-0",
        "border-[rgba(15,23,42,0.05)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
      )}
    >
      <div className="overflow-x-auto">
        <div className={LIST_TABLE_MIN_WIDTH}>
          <CandidateListHeader />
          <div role="list" aria-label="Candidates">
            {rows.map((row) => (
              <CandidateInboxRow key={row.id} row={row} onClick={() => onRowClick(row)} />
            ))}
          </div>
        </div>
      </div>

      <CandidateDirectoryPagination
        page={page}
        totalItems={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

export function CandidateDirectoryGridView({
  rows,
  onCardClick,
}: {
  rows: CandidateDirectoryRow[];
  onCardClick: (row: CandidateDirectoryRow) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => {
        const stage = getCandidateStage(row);
        return (
          <button
            key={row.id}
            type="button"
            onClick={() => onCardClick(row)}
            className={cn(
              hiringCard,
              "group flex w-full flex-col gap-3 p-4 text-left",
              hiringTransition,
              "hover:-translate-y-0.5 hover:border-[rgba(15,61,46,0.14)]",
            )}
          >
            <div className="flex items-start gap-3">
              <CandidateAvatar name={row.name} className="h-10 w-10 text-[11px]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold tracking-[-0.02em] text-text group-hover:text-forest">
                  {row.name}
                </p>
                <p className="truncate text-[11px] text-text-secondary/70">{row.email}</p>
                <p className="truncate text-[10px] text-text-secondary/50">{row.phone}</p>
                <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-text-secondary/65">
                  <Briefcase className="h-3 w-3 shrink-0 opacity-45" strokeWidth={1.5} />
                  {row.jobTitle}
                </p>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-text-secondary/25 group-hover:text-forest/60"
                strokeWidth={1.75}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <CandidateStagePill stage={stage} />
              <MetricChip count={row.assessmentCount} label="Assess." tone="sky" icon={ClipboardCheck} />
              <MetricChip count={row.interviewCount} label="Intrv." tone="orange" icon={Calendar} />
            </div>

            <p className="border-t border-[rgba(15,23,42,0.05)] pt-2.5 text-[10px] text-text-secondary/65 dark:border-white/[0.05]">
              {normalizeSource(row.source)} · {row.recruiterOwner}
            </p>
          </button>
        );
      })}
    </div>
  );
}
