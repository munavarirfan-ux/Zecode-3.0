"use client";

import { ScheduleInterviewDialog } from "../schedule-interview/ScheduleInterviewDialog";
import { InterviewCancelConfirmDialog } from "../interview-kanban/InterviewCancelConfirmDialog";
import type { HiringCandidate } from "@/lib/hiring/types";
import type { ScheduleTarget } from "./useCandidateInterviewScheduling";

export function CandidateReportInterviewDialogs({
  candidate,
  scheduleTarget,
  cancelTarget,
  cancelling,
  onScheduleOpenChange,
  onCancelOpenChange,
  onScheduled,
  onConfirmCancel,
}: {
  candidate: HiringCandidate | null;
  scheduleTarget: ScheduleTarget | null;
  cancelTarget: { roundTitle: string } | null;
  cancelling: boolean;
  onScheduleOpenChange: (open: boolean) => void;
  onCancelOpenChange: (open: boolean) => void;
  onScheduled: (updated: HiringCandidate) => void;
  onConfirmCancel: () => void;
}) {
  return (
    <>
      <ScheduleInterviewDialog
        open={scheduleTarget !== null}
        onOpenChange={onScheduleOpenChange}
        candidate={candidate}
        roundTitle={scheduleTarget?.roundTitle ?? ""}
        mode={scheduleTarget?.mode ?? "schedule"}
        onScheduled={onScheduled}
      />
      <InterviewCancelConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={onCancelOpenChange}
        candidate={candidate}
        roundTitle={cancelTarget?.roundTitle ?? ""}
        onConfirm={onConfirmCancel}
        confirming={cancelling}
      />
    </>
  );
}
