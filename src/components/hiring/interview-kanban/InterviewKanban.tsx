"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cancelCandidateInterview, moveCandidateToStage } from "@/lib/hiring/mockData";
import {
  buildInterviewKanbanCardModel,
  collectInterviewFilterOptions,
  EMPTY_ADVANCED_FILTERS,
  getColumnMetrics,
  matchesAdvancedFilters,
  matchesStatusFilter,
  type InterviewCardAction,
  type InterviewKanbanAdvancedFilters,
  type InterviewKanbanCardModel,
  type InterviewOperationalStatus,
} from "@/lib/hiring/interviewKanbanOps";
import type { InterviewRound } from "@/lib/hiring/interviewRounds";
import { resolveInterviewColumnId, substageForInterviewColumn } from "@/lib/hiring/interviewRounds";
import type { HiringCandidate } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";
import { KanbanMoveConfirmDialog } from "../KanbanMoveConfirmDialog";
import { ScheduleInterviewDialog } from "../schedule-interview/ScheduleInterviewDialog";
import { InterviewCancelConfirmDialog } from "./InterviewCancelConfirmDialog";
import { InterviewKanbanCard } from "./InterviewKanbanCard";
import { InterviewKanbanFilters } from "./InterviewKanbanFilters";

export function InterviewKanban({
  rounds,
  candidates,
  onCardClick,
  onCandidateMoved,
  onRequestFeedback,
}: {
  rounds: InterviewRound[];
  candidates: HiringCandidate[];
  onCardClick?: (candidate: HiringCandidate) => void;
  onCandidateMoved?: () => void;
  onRequestFeedback?: (candidate: HiringCandidate) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<InterviewOperationalStatus | "All">("All");
  const [advanced, setAdvanced] = useState<InterviewKanbanAdvancedFilters>(EMPTY_ADVANCED_FILTERS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    candidate: HiringCandidate;
    toColumn: InterviewRound;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<{
    candidate: HiringCandidate;
    roundTitle: string;
    mode: "schedule" | "reschedule" | "view";
  } | null>(null);
  const [cancelTarget, setCancelTarget] = useState<{
    candidate: HiringCandidate;
    roundTitle: string;
  } | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const columns = rounds;
  const canDrag = columns.length > 1;

  const allModels = useMemo(
    () => candidates.map((c) => buildInterviewKanbanCardModel(c, rounds)),
    [candidates, rounds],
  );

  const filteredModels = useMemo(
    () =>
      allModels.filter(
        (m) =>
          matchesStatusFilter(m.status, statusFilter) && matchesAdvancedFilters(m, advanced),
      ),
    [allModels, statusFilter, advanced],
  );

  const statusCounts = useMemo(() => {
    const base = allModels.filter((m) => matchesAdvancedFilters(m, advanced));
    const counts: Record<InterviewOperationalStatus | "All", number> = {
      All: base.length,
      Scheduled: 0,
      Pending: 0,
      Ongoing: 0,
      Completed: 0,
      "Feedback Pending": 0,
      Cancelled: 0,
    };
    for (const k of Object.keys(counts) as Array<InterviewOperationalStatus | "All">) {
      if (k === "All") continue;
      counts[k] = base.filter((m) => matchesStatusFilter(m.status, k)).length;
    }
    return counts;
  }, [allModels, advanced]);

  const filterOptions = useMemo(() => collectInterviewFilterOptions(candidates), [candidates]);

  const modelsByColumn = useMemo(() => {
    const map = new Map<string, InterviewKanbanCardModel[]>();
    for (const col of columns) map.set(col.id, []);
    for (const m of filteredModels) {
      const list = map.get(m.columnId);
      if (list) list.push(m);
    }
    return map;
  }, [columns, filteredModels]);

  const requestMove = useCallback((candidate: HiringCandidate, toColumn: InterviewRound) => {
    const fromId = resolveInterviewColumnId(candidate, rounds);
    if (fromId === toColumn.id) return;
    setPendingMove({ candidate, toColumn });
  }, [rounds]);

  function handleCardAction(model: InterviewKanbanCardModel, action: InterviewCardAction) {
    if (action === "request-feedback") {
      onRequestFeedback?.(model.candidate);
      if (!onRequestFeedback) onCardClick?.(model.candidate);
      return;
    }
    if (action === "move-next") {
      const currentId = resolveInterviewColumnId(model.candidate, rounds);
      const idx = rounds.findIndex((r) => r.id === currentId);
      const next = rounds[idx + 1];
      if (!next) {
        toast.message("Already at last stage", { description: model.roundTitle });
        return;
      }
      const substage = substageForInterviewColumn(next.id, rounds);
      const result = moveCandidateToStage(model.candidate.id, "Interviews", { substage });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Moved to ${next.title}`);
      onCandidateMoved?.();
      return;
    }

    if (action === "add-note") {
      toast.message("Add internal note", { description: `${model.candidate.name} (demo)` });
      return;
    }

    if (action === "reject") {
      const result = moveCandidateToStage(model.candidate.id, "Rejected");
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Candidate rejected", { description: model.candidate.name });
      onCandidateMoved?.();
      return;
    }

    if (action === "cancel") {
      setCancelTarget({ candidate: model.candidate, roundTitle: model.roundTitle });
      return;
    }

    if (action === "join" && model.primaryInterview?.meetUrl) {
      window.open(model.primaryInterview.meetUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (action === "view" && model.primaryInterview?.meetUrl) {
      window.open(model.primaryInterview.meetUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const mode =
      action === "schedule" ? "schedule" : action === "reschedule" ? "reschedule" : "view";
    setScheduleTarget({
      candidate: model.candidate,
      roundTitle: model.roundTitle,
      mode,
    });
  }

  const confirmCancel = useCallback(() => {
    if (!cancelTarget) return;
    setCancelling(true);
    const result = cancelCandidateInterview(cancelTarget.candidate.id, cancelTarget.roundTitle);
    setCancelling(false);
    setCancelTarget(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Interview cancelled", {
      description: `${cancelTarget.candidate.name} · ${cancelTarget.roundTitle}`,
    });
    onCandidateMoved?.();
  }, [cancelTarget, onCandidateMoved]);

  const confirmMove = useCallback(() => {
    if (!pendingMove) return;
    setConfirming(true);
    const { candidate, toColumn } = pendingMove;
    const substage = substageForInterviewColumn(toColumn.id, rounds);
    const result = moveCandidateToStage(candidate.id, "Interviews", { substage });
    setConfirming(false);
    setPendingMove(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Moved to ${toColumn.title}`);
    onCandidateMoved?.();
  }, [pendingMove, rounds, onCandidateMoved]);

  return (
    <>
      <InterviewKanbanFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        advanced={advanced}
        onAdvancedChange={setAdvanced}
        interviewers={filterOptions.interviewers}
        interviewTypes={filterOptions.types}
        resultCount={filteredModels.length}
        statusCounts={statusCounts}
      />

      <div className="interview-kanban-board">
        <div className="interview-kanban-board-grain" aria-hidden />
        <div className="interview-kanban-track">
          {columns.map((col) => {
            const items = modelsByColumn.get(col.id) ?? [];
            const metrics = getColumnMetrics(items);
            const isDropTarget = dropTargetId === col.id && draggingId !== null;

            return (
              <div
                key={col.id}
                className={cn("interview-kanban-column", isDropTarget && "is-drop-target")}
                onDragOver={
                  canDrag
                    ? (e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        setDropTargetId(col.id);
                      }
                    : undefined
                }
                onDragLeave={
                  canDrag
                    ? () => setDropTargetId((prev) => (prev === col.id ? null : prev))
                    : undefined
                }
                onDrop={
                  canDrag
                    ? (e) => {
                        e.preventDefault();
                        setDropTargetId(null);
                        const candidateId = e.dataTransfer.getData("text/candidate-id");
                        const candidate = candidates.find((c) => c.id === candidateId);
                        if (candidate) requestMove(candidate, col);
                        setDraggingId(null);
                      }
                    : undefined
                }
              >
                <header className="interview-kanban-column-header">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71717A] dark:text-muted">
                    {col.title}
                  </p>
                  <p className="mt-1 text-[12px] font-semibold tabular-nums text-text">
                    {metrics.total} candidate{metrics.total === 1 ? "" : "s"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-[#71717A] dark:text-muted">
                    {metrics.pendingFeedback > 0 ? (
                      <span>{metrics.pendingFeedback} pending feedback</span>
                    ) : null}
                    {metrics.ongoing > 0 ? (
                      <span className="font-medium text-violet-600 dark:text-violet-400">
                        {metrics.ongoing} ongoing
                      </span>
                    ) : null}
                  </div>
                </header>

                <div className="interview-kanban-column-body">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center px-2 py-6 text-center">
                      <p className="text-[11px] leading-relaxed text-muted">
                        No candidates in this round yet.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3 h-8 gap-1.5 rounded-[9px] text-[11px]"
                        onClick={() =>
                          toast.message("Drag a candidate here or move from another round")
                        }
                      >
                        <ArrowRightLeft className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        Move candidate
                      </Button>
                    </div>
                  ) : (
                    items.map((model) => (
                      <InterviewKanbanCard
                        key={model.candidate.id}
                        model={model}
                        draggable={canDrag}
                        isDragging={draggingId === model.candidate.id}
                        onDragStart={() => setDraggingId(model.candidate.id)}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setDropTargetId(null);
                        }}
                        onClick={() => onCardClick?.(model.candidate)}
                        onAction={handleCardAction}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <KanbanMoveConfirmDialog
        open={pendingMove !== null}
        onOpenChange={(open) => {
          if (!open) setPendingMove(null);
        }}
        candidate={pendingMove?.candidate ?? null}
        targetColumnTitle={pendingMove?.toColumn.title ?? ""}
        onConfirm={confirmMove}
        confirming={confirming}
      />

      <ScheduleInterviewDialog
        open={scheduleTarget !== null}
        onOpenChange={(open) => {
          if (!open) setScheduleTarget(null);
        }}
        candidate={scheduleTarget?.candidate ?? null}
        roundTitle={scheduleTarget?.roundTitle ?? ""}
        mode={scheduleTarget?.mode ?? "schedule"}
        onScheduled={() => onCandidateMoved?.()}
      />

      <InterviewCancelConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        candidate={cancelTarget?.candidate ?? null}
        roundTitle={cancelTarget?.roundTitle ?? ""}
        onConfirm={confirmCancel}
        confirming={cancelling}
      />
    </>
  );
}
