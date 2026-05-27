"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  cancelCandidateInterview,
  moveCandidateToStage,
  rejectCandidateAtRound,
} from "@/lib/hiring/mockData";
import {
  buildInterviewKanbanCardModel,
  collectInterviewFilterOptions,
  EMPTY_ADVANCED_FILTERS,
  INTERVIEW_STATUS_FILTERS,
  getColumnMetrics,
  mapPrimaryActionToInterviewAction,
  matchesAdvancedFilters,
  matchesStatusFilter,
  type InterviewCardAction,
  type InterviewKanbanAdvancedFilters,
  type InterviewKanbanCardModel,
  type InterviewOperationalStatus,
} from "@/lib/hiring/interviewKanbanOps";
import type { KanbanMenuAction } from "@/lib/hiring/stage-actions";
import { updateCandidateVerdict } from "@/lib/hiring/mockData";
import type { CandidateVerdict } from "@/lib/hiring/types";
import type { InterviewRound } from "@/lib/hiring/interviewRounds";
import { resolveInterviewColumnId, substageForInterviewColumn } from "@/lib/hiring/interviewRounds";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { KanbanMoveConfirmDialog } from "../KanbanMoveConfirmDialog";
import { ScheduleInterviewDialog } from "../schedule-interview/ScheduleInterviewDialog";
import { InterviewCancelConfirmDialog } from "./InterviewCancelConfirmDialog";
import { CandidateCard } from "../candidate-card/CandidateCard";
import { KanbanBulkActionBar } from "../kanban/KanbanBulkActionBar";
import { KanbanBulkTagsDialog } from "../kanban/KanbanBulkTagsDialog";
import { KanbanColumnSelectAll } from "../kanban/KanbanColumnSelectAll";
import { useKanbanBulkSelection } from "../kanban/useKanbanBulkSelection";
import {
  InterviewKanbanToolbar,
  type InterviewRoundOption,
} from "./InterviewKanbanToolbar";

export function InterviewKanban({
  rounds,
  candidates,
  canManageRounds = false,
  roundOptions,
  onAddRound,
  onDeleteRound,
  onCardClick,
  onCandidateMoved,
  onRequestFeedback,
  onOpenEmails,
  job,
  enableBulkSelect = true,
}: {
  rounds: InterviewRound[];
  candidates: HiringCandidate[];
  canManageRounds?: boolean;
  roundOptions: InterviewRoundOption[];
  onAddRound: (title: string) => void;
  onDeleteRound: (roundId: string) => void;
  onCardClick?: (candidate: HiringCandidate) => void;
  onCandidateMoved?: () => void;
  onRequestFeedback?: (candidate: HiringCandidate) => void;
  onOpenEmails?: (candidate: HiringCandidate) => void;
  job?: HiringJob;
  enableBulkSelect?: boolean;
}) {
  const [statusFilter, setStatusFilter] = useState<InterviewOperationalStatus | "All">("All");
  const [advanced, setAdvanced] = useState<InterviewKanbanAdvancedFilters>(EMPTY_ADVANCED_FILTERS);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const columns = useMemo(
    () => (activeRoundId ? rounds.filter((r) => r.id === activeRoundId) : rounds),
    [rounds, activeRoundId],
  );
  const canDrag = rounds.length > 1 && !activeRoundId;

  const {
    bulkEnabled,
    selectedIds,
    selectedCandidates,
    bulkTagsOpen,
    setBulkTagsOpen,
    toggleSelected,
    clearSelection,
    toggleSelectAllInColumn,
    handleBulkAction,
    bulkDisabledActions,
  } = useKanbanBulkSelection({
    candidates,
    enabled: enableBulkSelect,
    job,
    allowMoveToInterview: false,
    onCandidateMoved,
    onOpenEmails,
  });

  const allModels = useMemo(
    () => candidates.map((c) => buildInterviewKanbanCardModel(c, rounds)),
    [candidates, rounds],
  );

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allModels.filter((m) => {
      if (!matchesStatusFilter(m.status, statusFilter)) return false;
      if (!matchesAdvancedFilters(m, advanced)) return false;
      if (activeRoundId && m.columnId !== activeRoundId) return false;
      if (q && !m.candidate.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allModels, statusFilter, advanced, activeRoundId, searchQuery]);

  const statusCounts = useMemo(() => {
    const base = allModels.filter((m) => {
      if (!matchesAdvancedFilters(m, advanced)) return false;
      if (activeRoundId && m.columnId !== activeRoundId) return false;
      return true;
    });
    const counts = Object.fromEntries(
      INTERVIEW_STATUS_FILTERS.map((f) => [f, 0]),
    ) as Record<InterviewOperationalStatus | "All", number>;
    counts.All = base.length;
    for (const k of Object.keys(counts) as Array<InterviewOperationalStatus | "All">) {
      if (k === "All") continue;
      counts[k] = base.filter((m) => matchesStatusFilter(m.status, k)).length;
    }
    return counts;
  }, [allModels, advanced, activeRoundId]);

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

  const handleVerdictChange = useCallback(
    (candidateId: string, verdict: CandidateVerdict, reason?: string) => {
      const result = updateCandidateVerdict(candidateId, verdict, reason);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onCandidateMoved?.();
    },
    [onCandidateMoved],
  );

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
      const result = rejectCandidateAtRound(model.candidate.id, model.roundTitle);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Rejected at this round", {
        description: `${model.candidate.name} · ${model.roundTitle}`,
      });
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

  function runInterviewMenuAction(action: KanbanMenuAction, model: InterviewKanbanCardModel) {
    switch (action) {
      case "viewProfile":
        onCardClick?.(model.candidate);
        break;
      case "schedule":
        handleCardAction(model, "schedule");
        break;
      case "moveNext":
        handleCardAction(model, "move-next");
        break;
      case "requestFeedback":
        handleCardAction(model, "request-feedback");
        break;
      case "sendEmail":
        onCardClick?.(model.candidate);
        break;
      case "addNote":
        handleCardAction(model, "add-note");
        break;
      case "reschedule":
        handleCardAction(model, "reschedule");
        break;
      case "cancelInterview":
        handleCardAction(model, "cancel");
        break;
      case "reject":
        handleCardAction(model, "reject");
        break;
      default:
        break;
    }
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
      <InterviewKanbanToolbar
        rounds={rounds}
        roundOptions={roundOptions}
        activeRoundId={activeRoundId}
        onActiveRoundChange={setActiveRoundId}
        canManageRounds={canManageRounds}
        onAddRound={onAddRound}
        onDeleteRound={onDeleteRound}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusCounts={statusCounts}
        advanced={advanced}
        onAdvancedChange={setAdvanced}
        interviewers={filterOptions.interviewers}
        interviewTypes={filterOptions.types}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onClearAllFilters={() => {
          setStatusFilter("All");
          setAdvanced(EMPTY_ADVANCED_FILTERS);
          setSearchQuery("");
        }}
      />

      <div className="interview-kanban-board-area--tall">
      <div className={cn("interview-kanban-board", bulkEnabled && "pb-14")}>
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
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71717A] dark:text-muted">
                      {col.title}
                    </p>
                    {bulkEnabled ? (
                      <KanbanColumnSelectAll
                        columnCandidateIds={items.map((m) => m.candidate.id)}
                        selectedIds={selectedIds}
                        onToggle={toggleSelectAllInColumn}
                      />
                    ) : null}
                  </div>
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
                    <LineArtEmptyState
                      illustration="kanban"
                      message="No candidates in this round yet."
                      size="sm"
                      className="px-2"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 rounded-[9px] text-[11px]"
                        onClick={() =>
                          toast.message("Drag a candidate here or move from another round")
                        }
                      >
                        <ArrowRightLeft className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        Move candidate
                      </Button>
                    </LineArtEmptyState>
                  ) : (
                    items.map((model) => (
                      <CandidateCard
                        key={model.candidate.id}
                        candidate={model.candidate}
                        pipelineStage="Interviews"
                        interviewStatus={model.status}
                        compact
                        draggable={canDrag && selectedIds.size === 0}
                        selectable={bulkEnabled}
                        selected={selectedIds.has(model.candidate.id)}
                        selectionActive={selectedIds.size > 0}
                        onSelectedChange={(on) => toggleSelected(model.candidate.id, on)}
                        isDragging={draggingId === model.candidate.id}
                        onDragStart={() => setDraggingId(model.candidate.id)}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setDropTargetId(null);
                        }}
                        onCardClick={() => onCardClick?.(model.candidate)}
                        onPrimaryAction={(action) =>
                          handleCardAction(
                            model,
                            mapPrimaryActionToInterviewAction(action, model),
                          )
                        }
                        onMenuAction={(action) => runInterviewMenuAction(action, model)}
                        onVerdictChange={(verdict, reason) =>
                          handleVerdictChange(model.candidate.id, verdict, reason)
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
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

      {job ? (
        <KanbanBulkTagsDialog
          open={bulkTagsOpen}
          onOpenChange={setBulkTagsOpen}
          candidates={selectedCandidates}
          job={job}
          onSaved={() => {
            clearSelection();
            onCandidateMoved?.();
          }}
        />
      ) : null}

      {bulkEnabled ? (
        <KanbanBulkActionBar
          count={selectedIds.size}
          onClear={clearSelection}
          onAction={handleBulkAction}
          disabledActions={bulkDisabledActions}
        />
      ) : null}
    </>
  );
}
