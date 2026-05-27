"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ASSESSMENT_CANDIDATES_UPDATED_EVENT,
  filterAndSortCandidates,
  getCandidatesForAssessment,
  type CandidateSortKey,
} from "@/lib/hiring/assessments/assessmentCandidates";
import { hiringCard, hiringTransition } from "../hiringTokens";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { AssessmentCandidateRow } from "./AssessmentCandidateRow";

const TH =
  "px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted";

export function AssessmentCandidateDirectory({
  assessmentId,
  onOpenReport,
}: {
  assessmentId: string;
  onOpenReport: (candidate: import("@/lib/hiring/assessments/types").AssessmentCandidateRecord) => void;
}) {
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [scoreMin, setScoreMin] = useState("");
  const [completion, setCompletion] = useState("all");
  const [malpracticeOnly, setMalpracticeOnly] = useState(false);
  const [sort, setSort] = useState<CandidateSortKey>("date-desc");

  useEffect(() => {
    const h = () => setRefresh((n) => n + 1);
    window.addEventListener(ASSESSMENT_CANDIDATES_UPDATED_EVENT, h);
    return () => window.removeEventListener(ASSESSMENT_CANDIDATES_UPDATED_EVENT, h);
  }, []);

  const rows = useMemo(() => {
    const all = getCandidatesForAssessment(assessmentId);
    return filterAndSortCandidates(all, {
      search,
      status,
      scoreMin: scoreMin ? Number(scoreMin) : null,
      malpracticeOnly,
      completion,
      sort,
    });
  }, [assessmentId, search, status, scoreMin, malpracticeOnly, completion, sort, refresh]);

  return (
    <section
      className={cn(
        hiringCard,
        "overflow-hidden border-[rgb(var(--accent-rgb)/0.08)]",
        "shadow-[0_1px_2px_rgba(15,23,42,0.03),0_16px_48px_-28px_rgba(var(--accent-rgb),0.12)]",
      )}
      aria-label="Live candidate workspace"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(15,23,42,0.05)] px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgb(var(--accent-rgb)/0.08)] text-accent">
            <Users className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-text">Candidates</h2>
            <p className="text-[11px] text-muted">
              {rows.length} in workspace · click a row to open report
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.015)] px-4 py-2.5 sm:px-5">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate"
            className="h-8 rounded-[9px] border-[rgba(15,23,42,0.06)] bg-white pl-8 text-[12px]"
          />
        </div>
        <FilterSelect value={status} onChange={setStatus} label="Status">
          <option value="all">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Attempted">Attempted</option>
          <option value="Qualified">Qualified</option>
          <option value="Not Qualified">Not qualified</option>
          <option value="Malpractice Detected">Malpractice</option>
        </FilterSelect>
        <FilterSelect value={scoreMin} onChange={setScoreMin} label="Score">
          <option value="">Any score</option>
          <option value="70">70%+</option>
          <option value="85">85%+</option>
        </FilterSelect>
        <FilterSelect value={completion} onChange={setCompletion} label="Completion">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </FilterSelect>
        <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[9px] border border-[rgba(15,23,42,0.06)] bg-white px-2.5 text-[11px] font-medium text-muted">
          <input
            type="checkbox"
            checked={malpracticeOnly}
            onChange={(e) => setMalpracticeOnly(e.target.checked)}
            className="rounded"
          />
          Signals
        </label>
        <FilterSelect value={sort} onChange={(v) => setSort(v as CandidateSortKey)} label="Sort">
          <option value="score-desc">Score ↓</option>
          <option value="date-desc">Recent</option>
          <option value="name-asc">Name A–Z</option>
        </FilterSelect>
      </div>

      <div className="overflow-x-auto">
        <table className={cn("w-full min-w-[720px] border-collapse text-left", hiringTransition)}>
          <thead>
            <tr className="border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] dark:bg-white/[0.02]">
              <th className={cn(TH, "pl-4")}>Candidate</th>
              <th className={cn(TH, "hidden sm:table-cell")}>Status</th>
              <th className={cn(TH, "hidden md:table-cell")}>Attempted</th>
              <th className={cn(TH, "hidden lg:table-cell")}>Duration</th>
              <th className={cn(TH, "hidden xl:table-cell")}>Malpractice</th>
              <th className={cn(TH, "text-right")}>Score</th>
              <th className={cn(TH, "w-[88px]")} aria-label="Links" />
              <th className={cn(TH, "w-12 pr-4")} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-0">
                  <LineArtEmptyState
                    illustration="filters"
                    message="No candidates match your filters."
                    size="compact"
                  />
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <AssessmentCandidateRow key={c.id} candidate={c} onOpenReport={() => onOpenReport(c)} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-8 rounded-[9px] border border-[rgba(15,23,42,0.06)] bg-white px-2 text-[11px] font-medium text-text-secondary dark:bg-surface"
    >
      {children}
    </select>
  );
}
