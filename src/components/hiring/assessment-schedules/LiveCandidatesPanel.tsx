"use client";

import { Users } from "lucide-react";
import type { SchedulesViewMode } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import type { LiveCandidateSession, LiveMonitorFilter } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { DirectoryViewSwitcher } from "../directories/DirectoryViewSwitcher";
import { hiringCard, hiringTransition } from "../hiringTokens";
import { LiveCandidateCard } from "./LiveCandidateCard";
import { LiveCandidateListRow, LiveCandidateTableHeader } from "./LiveCandidateListRow";
import { LIVE_CANDIDATE_TABLE_MIN_WIDTH } from "./liveCandidateTableLayout";

export function LiveCandidatesPanel({
  candidates,
  filter,
  onFilterChange,
  counts,
  view,
  onViewChange,
  onSelectCandidate,
}: {
  candidates: LiveCandidateSession[];
  filter: LiveMonitorFilter;
  onFilterChange: (f: LiveMonitorFilter) => void;
  counts: { all: number; live: number; idle: number; flagged: number };
  view: SchedulesViewMode;
  onViewChange: (v: SchedulesViewMode) => void;
  onSelectCandidate: (c: LiveCandidateSession) => void;
}) {
  const FILTERS: { id: LiveMonitorFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "live", label: "Live" },
    { id: "idle", label: "Idle" },
    { id: "flagged", label: "Flagged" },
  ];

  return (
    <section className="space-y-3">
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur-sm dark:bg-surface/95",
        )}
      >
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count =
              f.id === "all" ? counts.all : f.id === "live" ? counts.live : f.id === "idle" ? counts.idle : counts.flagged;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFilterChange(f.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[12px] font-medium",
                  hiringTransition,
                  active
                    ? "border-[rgba(var(--accent-rgb),0.25)] bg-[rgba(var(--accent-rgb),0.1)] text-[rgb(var(--accent-rgb))]"
                    : "border-[rgba(15,23,42,0.08)] bg-white text-muted hover:text-text",
                  f.id === "flagged" && !active && "hover:border-red-400/20",
                  f.id === "flagged" && active && "border-red-400/30 bg-red-500/10 text-red-700",
                )}
              >
                {f.label}
                <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <DirectoryViewSwitcher
          value={view}
          onChange={onViewChange}
          options={[
            { value: "grid", label: "Grid", icon: "grid" },
            { value: "list", label: "List", icon: "list" },
          ]}
        />
      </div>

      {candidates.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-[rgba(15,23,42,0.1)] bg-white">
          <LineArtEmptyState illustration="candidates" message="No candidates in this view." size="default" />
        </div>
      ) : view === "grid" ? (
        <div
          className={cn(
            hiringCard,
            "overflow-hidden !rounded-[14px] !p-0",
            "border-[rgba(15,23,42,0.05)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
          )}
        >
          <div className="flex items-center gap-2.5 border-b border-[rgba(15,23,42,0.05)] px-4 py-3 sm:px-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgb(var(--accent-rgb)/0.08)] text-accent">
              <Users className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-text">Candidates</h2>
              <p className="text-[11px] text-muted">{candidates.length} active · click a card for live report</p>
            </div>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 lg:p-5">
            {candidates.map((c) => (
              <LiveCandidateCard key={c.id} candidate={c} onSelect={() => onSelectCandidate(c)} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            hiringCard,
            "overflow-hidden !rounded-[14px] !p-0",
            "border-[rgba(15,23,42,0.05)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
          )}
        >
          <div className="flex items-center gap-2.5 border-b border-[rgba(15,23,42,0.05)] px-4 py-3 sm:px-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgb(var(--accent-rgb)/0.08)] text-accent">
              <Users className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-text">Candidates</h2>
              <p className="text-[11px] text-muted">{candidates.length} active · click a row for live report</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className={LIVE_CANDIDATE_TABLE_MIN_WIDTH}>
              <LiveCandidateTableHeader />
              {candidates.map((c) => (
                <LiveCandidateListRow key={c.id} candidate={c} onSelect={() => onSelectCandidate(c)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
