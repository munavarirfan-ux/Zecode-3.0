"use client";

import { cn } from "@/lib/utils";
import { computeUnifiedStatus } from "@/lib/hiring/candidate-status";
import type { CandidateVerdict } from "@/lib/hiring/types";
import type { InterviewOperationalStatus } from "@/lib/hiring/interviewKanbanOps";
import type { CandidateCardStage } from "@/lib/hiring/stage-actions";

export function CandidateStatusLine({
  cardStage,
  verdict = "pending",
  interviewStatus,
  showLabel = true,
  compact = false,
}: {
  cardStage: CandidateCardStage;
  verdict?: CandidateVerdict;
  interviewStatus?: InterviewOperationalStatus;
  /** Hide "Status:" on narrow viewports */
  showLabel?: boolean;
  /** Kanban card — tighter, no status prefix */
  compact?: boolean;
}) {
  const status = computeUnifiedStatus(cardStage, verdict, interviewStatus);
  const Icon = status.icon;

  return (
    <div className={cn("flex min-w-0 flex-1 items-center", compact ? "gap-1 text-[10px]" : "gap-1.5 text-xs")}>
      {showLabel && !compact ? (
        <span className="hidden shrink-0 text-muted sm:inline">Status:</span>
      ) : null}
      <Icon
        className={cn("shrink-0", status.iconColor, compact ? "h-2.5 w-2.5" : "h-3 w-3")}
        strokeWidth={1.75}
        aria-hidden
      />
      <span className={cn("truncate font-medium", status.textColor)}>{status.label}</span>
    </div>
  );
}
