"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import type { InterviewOperationalStatus } from "@/lib/hiring/interviewKanbanOps";
import { getInterviewCardVisualClass } from "@/lib/hiring/interviewKanbanOps";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import type { InterviewListRow } from "@/lib/hiring/interviewListData";
import { CandidateStatusLine } from "../candidate-card/CandidateStatusLine";
import { resolveCandidateCardStage } from "@/lib/hiring/stage-actions";
import { hiringCard, hiringTransition } from "../hiringTokens";

export type InterviewListRowWithStatus = InterviewListRow & {
  interviewStatus: InterviewOperationalStatus;
};

export function InterviewCandidatesListView({
  rows,
  onOpenReport,
  onSchedule,
  onRequestFeedback,
}: {
  rows: InterviewListRowWithStatus[];
  job: HiringJob;
  onOpenReport: (candidate: HiringCandidate) => void;
  onSchedule: (candidate: HiringCandidate) => void;
  onRequestFeedback: (candidate: HiringCandidate) => void;
}) {
  return (
    <div className={cn(hiringCard, "overflow-hidden")}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/80">
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Interviewer</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Feedback</th>
              <th className="px-4 py-3">Round</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-0">
                  <LineArtEmptyState
                    illustration="filters"
                    message="No candidates match the current filters."
                    size="compact"
                  />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-[rgba(15,23,42,0.04)]",
                    hiringTransition,
                    "hover:bg-[rgba(15,61,46,0.03)]",
                    getInterviewCardVisualClass(row.interviewStatus),
                    row.interviewStatus === "Rejected" && "opacity-90",
                  )}
                >
                  <td className="px-4 py-3 font-medium text-text">{row.candidate.name}</td>
                  <td className="px-4 py-3 text-text-secondary/80">{row.email}</td>
                  <td className="px-4 py-3">{row.interviewer}</td>
                  <td className="px-4 py-3">{row.role}</td>
                  <td className="px-4 py-3 text-text-secondary/80">{row.scheduledDate}</td>
                  <td className="px-4 py-3">
                    <CandidateStatusLine
                      cardStage={resolveCandidateCardStage(row.candidate, "Interviews")}
                      verdict={row.candidate.verdict}
                      interviewStatus={row.interviewStatus}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-text-secondary/80">{row.feedbackStatus}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">{row.round}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 rounded-[9px] px-0">
                          <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 rounded-[10px] p-1">
                        <DropdownMenuItem onSelect={() => onOpenReport(row.candidate)}>
                          Open Candidate Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onSchedule(row.candidate)}>
                          Schedule / Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onRequestFeedback(row.candidate)}>
                          Request Feedback
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
