"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { cancelCandidateInterview } from "@/lib/hiring/mockData";
import {
  getInterviewRounds,
  resolveInterviewColumnId,
  substageForInterviewColumn,
} from "@/lib/hiring/interviewRounds";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";

export type ScheduleDialogMode = "schedule" | "reschedule" | "view";

export type ScheduleTarget = {
  roundTitle: string;
  mode: ScheduleDialogMode;
};

export function getDefaultScheduleRoundTitle(candidate: HiringCandidate, jobId: string): string {
  const rounds = getInterviewRounds(jobId);
  const columnId = resolveInterviewColumnId(candidate, rounds);
  return substageForInterviewColumn(columnId, rounds);
}

export function useCandidateInterviewScheduling({
  candidate,
  job,
  onCandidateUpdated,
}: {
  candidate: HiringCandidate | null;
  job: HiringJob;
  onCandidateUpdated?: (candidate: HiringCandidate) => void;
}) {
  const [scheduleTarget, setScheduleTarget] = useState<ScheduleTarget | null>(null);
  const [cancelTarget, setCancelTarget] = useState<{ roundTitle: string } | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const defaultRoundTitle = useMemo(
    () => (candidate ? getDefaultScheduleRoundTitle(candidate, job.id) : ""),
    [candidate, job.id],
  );

  const openSchedule = useCallback(
    (roundTitle?: string) => {
      setScheduleTarget({
        roundTitle: roundTitle ?? defaultRoundTitle,
        mode: "schedule",
      });
    },
    [defaultRoundTitle],
  );

  const openReschedule = useCallback((roundTitle: string) => {
    setScheduleTarget({ roundTitle, mode: "reschedule" });
  }, []);

  const openViewSchedule = useCallback((roundTitle: string, meetUrl?: string) => {
    if (meetUrl) {
      window.open(meetUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setScheduleTarget({ roundTitle, mode: "view" });
  }, []);

  const openCancel = useCallback((roundTitle: string) => {
    setCancelTarget({ roundTitle });
  }, []);

  const confirmCancel = useCallback(() => {
    if (!candidate || !cancelTarget) return;
    setCancelling(true);
    const { roundTitle } = cancelTarget;
    const result = cancelCandidateInterview(candidate.id, roundTitle);
    setCancelling(false);
    setCancelTarget(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Interview cancelled", {
      description: `${candidate.name} · ${roundTitle}`,
    });
    onCandidateUpdated?.(result.candidate);
  }, [candidate, cancelTarget, onCandidateUpdated]);

  const handleScheduled = useCallback(
    (updated: HiringCandidate) => {
      onCandidateUpdated?.(updated);
    },
    [onCandidateUpdated],
  );

  return {
    defaultRoundTitle,
    scheduleTarget,
    cancelTarget,
    cancelling,
    openSchedule,
    openReschedule,
    openViewSchedule,
    openCancel,
    confirmCancel,
    handleScheduled,
    closeSchedule: () => setScheduleTarget(null),
    closeCancel: () => setCancelTarget(null),
  };
}

export type CandidateInterviewFlowActions = {
  canSchedule: boolean;
  openSchedule: (roundTitle?: string) => void;
  openReschedule: (roundTitle: string) => void;
  openCancel: (roundTitle: string) => void;
  openViewSchedule: (roundTitle: string, meetUrl?: string) => void;
};
