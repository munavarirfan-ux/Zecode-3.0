"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRole } from "@/context/RoleContext";
import {
  canManageInterviewRounds,
  createInterviewRound,
  getInterviewRounds,
  resolveInterviewColumnId,
  saveInterviewRounds,
  type InterviewRound,
} from "@/lib/hiring/interviewRounds";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { InterviewKanban } from "./interview-kanban/InterviewKanban";

export function InterviewKanbanBoard({
  job,
  jobId,
  candidates,
  onCardClick,
  onCandidateMoved,
  onScheduleCandidate,
  onRequestFeedback,
}: {
  job: HiringJob;
  jobId: string;
  candidates: HiringCandidate[];
  onCardClick?: (candidate: HiringCandidate) => void;
  onCandidateMoved?: () => void;
  onScheduleCandidate?: (candidate: HiringCandidate) => void;
  onRequestFeedback?: (candidate: HiringCandidate) => void;
}) {
  const { selectedRole } = useRole();
  const canManage = canManageInterviewRounds(selectedRole);
  const [rounds, setRounds] = useState<InterviewRound[]>(() => getInterviewRounds(jobId));

  useEffect(() => {
    setRounds(getInterviewRounds(jobId));
  }, [jobId]);

  useEffect(() => {
    saveInterviewRounds(jobId, rounds);
  }, [jobId, rounds]);

  const columnResolver = useCallback(
    (candidate: HiringCandidate) => resolveInterviewColumnId(candidate, rounds),
    [rounds],
  );

  function handleAddRound(title: string) {
    const round = createInterviewRound(title, rounds);
    setRounds((prev) => [...prev, round]);
  }

  function handleDeleteRound(round: InterviewRound) {
    if (rounds.length <= 1) {
      toast.error("At least one interview round is required");
      return;
    }
    const count = candidates.filter((c) => columnResolver(c) === round.id).length;
    if (count > 0) {
      toast.error(`Move ${count} candidate${count === 1 ? "" : "s"} out of this round before deleting`);
      return;
    }
    setRounds((prev) => prev.filter((r) => r.id !== round.id));
    toast.success(`Removed ${round.title}`);
  }

  const roundOptions = useMemo(
    () =>
      rounds.map((round) => ({
        id: round.id,
        title: round.title,
        count: candidates.filter((c) => columnResolver(c) === round.id).length,
      })),
    [rounds, candidates, columnResolver],
  );

  const handleSchedule = onScheduleCandidate ?? onCardClick;
  const handleFeedback = onRequestFeedback ?? onCardClick;

  return (
    <InterviewKanban
      rounds={rounds}
      candidates={candidates}
      canManageRounds={canManage}
      roundOptions={roundOptions}
      onAddRound={handleAddRound}
      onDeleteRound={(id) => {
        const round = rounds.find((r) => r.id === id);
        if (round) handleDeleteRound(round);
      }}
      onCardClick={onCardClick}
      onCandidateMoved={onCandidateMoved}
      onRequestFeedback={(c) => handleFeedback?.(c)}
      onScheduleCandidate={handleSchedule}
    />
  );
}
