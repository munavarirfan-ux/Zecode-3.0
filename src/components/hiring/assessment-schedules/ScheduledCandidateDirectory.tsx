"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ScheduledAssessmentCandidate } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { removeScheduledCandidate } from "@/lib/hiring/assessments/scheduledAssessmentsData";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { hiringCard, hiringTransition } from "../hiringTokens";
import { ScheduledCandidateRow } from "./ScheduledCandidateRow";

const TH =
  "px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-muted";

export function ScheduledCandidateDirectory({
  scheduleId,
  candidates,
  shareLink,
  onRefresh,
}: {
  scheduleId: string;
  candidates: ScheduledAssessmentCandidate[];
  shareLink: string;
  onRefresh: () => void;
}) {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [candidates, search]);

  return (
    <section
      className={cn(
        hiringCard,
        "overflow-hidden border-[rgb(var(--accent-rgb)/0.08)]",
        "shadow-[0_1px_2px_rgba(15,23,42,0.03),0_16px_48px_-28px_rgba(var(--accent-rgb),0.12)]",
      )}
      aria-label="Invited candidates"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(15,23,42,0.05)] px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgb(var(--accent-rgb)/0.08)] text-accent">
            <Users className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-text">Invited candidates</h2>
            <p className="text-[11px] text-muted">{rows.length} in this schedule</p>
          </div>
        </div>
      </div>

      <div className="border-b border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.015)] px-4 py-2.5 sm:px-5">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate"
            className="h-8 rounded-[9px] border-[rgba(15,23,42,0.06)] bg-white pl-8 text-[12px]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={cn("w-full min-w-[960px] border-collapse text-left", hiringTransition)}>
          <thead>
            <tr className="border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] dark:bg-white/[0.02]">
              <th className={cn(TH, "pl-4")}>Candidate name</th>
              <th className={TH}>Email</th>
              <th className={TH}>Invite status</th>
              <th className={TH}>Instruction mail</th>
              <th className={TH}>Reminder status</th>
              <th className={TH}>Assessment status</th>
              <th className={TH}>Attempted date</th>
              <th className={cn(TH, "text-right")}>Score</th>
              <th className={cn(TH, "w-12")} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-0">
                  <LineArtEmptyState
                    illustration="search"
                    message="No candidates match your search."
                    size="compact"
                  />
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <ScheduledCandidateRow
                  key={c.id}
                  candidate={c}
                  shareLink={shareLink}
                  onRemove={() => {
                    removeScheduledCandidate(scheduleId, c.id);
                    onRefresh();
                    toast.success("Candidate removed");
                  }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
