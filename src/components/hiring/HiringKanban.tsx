"use client";

import { useCallback, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { moveCandidateToStage } from "@/lib/hiring/mockData";
import {
  getCandidateStage,
  isApplicantsStatsShortlisted,
  substageForKanbanColumn,
  type HiringStageName,
} from "@/lib/hiring/stages";
import { MoveToInterviewDialog } from "./applicants/MoveToInterviewDialog";
import { cn } from "@/lib/utils";
import type { HiringCandidate } from "@/lib/hiring/types";
import { KanbanMoveConfirmDialog } from "./KanbanMoveConfirmDialog";
import {
  kanbanBoardGrain,
  kanbanBoardShell,
  kanbanBoardTrack,
  kanbanCard,
  kanbanCardDragging,
  kanbanColumnBody,
  kanbanColumnHeader,
  kanbanColumnShell,
  kanbanColumnShellDrop,
} from "./hiringTokens";

export type KanbanColumnDef = {
  id: string;
  title: string;
};

function resolveColumnId(
  candidate: HiringCandidate,
  columns: KanbanColumnDef[],
  columnResolver?: (candidate: HiringCandidate) => string,
): string {
  if (columnResolver) return columnResolver(candidate);
  return candidate.kanbanColumn ?? columns[0]?.id ?? "";
}

export function HiringKanban({
  columns,
  candidates,
  pipelineStage,
  columnResolver,
  resolveSubstage,
  onCardClick,
  onCandidateMoved,
  enableDragDrop = true,
  jobId,
  showMoveToInterview = false,
}: {
  columns: KanbanColumnDef[];
  candidates: HiringCandidate[];
  pipelineStage: HiringStageName;
  columnResolver?: (candidate: HiringCandidate) => string;
  /** Custom substage label when moving cards (e.g. dynamic interview rounds) */
  resolveSubstage?: (columnId: string, columnTitle: string) => string;
  onCardClick?: (candidate: HiringCandidate) => void;
  onCandidateMoved?: () => void;
  enableDragDrop?: boolean;
  jobId?: string;
  showMoveToInterview?: boolean;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    candidate: HiringCandidate;
    fromColumnId: string;
    toColumn: KanbanColumnDef;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [moveToInterviewCandidate, setMoveToInterviewCandidate] = useState<HiringCandidate | null>(
    null,
  );

  const canDrag = enableDragDrop && columns.length > 1;
  const canShowMoveToInterview = showMoveToInterview && Boolean(jobId);

  const requestMove = useCallback(
    (candidate: HiringCandidate, toColumn: KanbanColumnDef) => {
      const fromColumnId = resolveColumnId(candidate, columns, columnResolver);
      if (fromColumnId === toColumn.id) return;
      setPendingMove({ candidate, fromColumnId, toColumn });
    },
    [columns, columnResolver],
  );

  const confirmMove = useCallback(() => {
    if (!pendingMove) return;
    setConfirming(true);
    const { candidate, toColumn } = pendingMove;
    const substage =
      resolveSubstage?.(toColumn.id, toColumn.title) ??
      substageForKanbanColumn(toColumn.id, pipelineStage);
    const result = moveCandidateToStage(candidate.id, pipelineStage, { substage });
    setConfirming(false);
    setPendingMove(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Moved to ${toColumn.title}`);
    onCandidateMoved?.();
  }, [pendingMove, pipelineStage, resolveSubstage, onCandidateMoved]);

  return (
    <>
      <div className={kanbanBoardShell}>
        <div className={kanbanBoardGrain} aria-hidden />
        <div className={kanbanBoardTrack}>
        {columns.map((col) => {
          const items = candidates.filter((c) => resolveColumnId(c, columns, columnResolver) === col.id);
          const isDropTarget = dropTargetId === col.id && draggingId !== null;

          return (
            <div
              key={col.id}
              className={cn(kanbanColumnShell, isDropTarget && kanbanColumnShellDrop)}
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
                  ? () => {
                      setDropTargetId((prev) => (prev === col.id ? null : prev));
                    }
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
              <div className={kanbanColumnHeader}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71717A] dark:text-muted">
                  {col.title}
                </p>
                <p className="text-[11px] tabular-nums text-[#52525B] dark:text-text-secondary">{items.length}</p>
              </div>
              <div className={kanbanColumnBody}>
                {items.length === 0 ? (
                  <p className="px-2 py-4 text-center text-[11px] text-muted">
                    {canDrag ? "Drop candidates here" : "No candidates"}
                  </p>
                ) : (
                  items.map((c) => (
                    <KanbanCandidateCard
                      key={c.id}
                      candidate={c}
                      draggable={canDrag}
                      isDragging={draggingId === c.id}
                      onDragStart={() => setDraggingId(c.id)}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setDropTargetId(null);
                      }}
                      onClick={() => onCardClick?.(c)}
                      showMoveToInterview={
                        canShowMoveToInterview && isApplicantsStatsShortlisted(c)
                      }
                      onMoveToInterview={() => setMoveToInterviewCandidate(c)}
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

      {jobId ? (
        <MoveToInterviewDialog
          open={moveToInterviewCandidate !== null}
          onOpenChange={(open) => {
            if (!open) setMoveToInterviewCandidate(null);
          }}
          candidate={moveToInterviewCandidate}
          jobId={jobId}
          onMoved={onCandidateMoved}
        />
      ) : null}
    </>
  );
}

function KanbanCandidateCard({
  candidate,
  draggable,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick,
  showMoveToInterview = false,
  onMoveToInterview,
}: {
  candidate: HiringCandidate;
  draggable: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onClick: () => void;
  showMoveToInterview?: boolean;
  onMoveToInterview?: () => void;
}) {
  const stage = getCandidateStage(candidate);
  const suppressClickRef = useRef(false);

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/candidate-id", candidate.id);
        e.dataTransfer.effectAllowed = "move";
        suppressClickRef.current = true;
        onDragStart();
      }}
      onDragEnd={() => {
        onDragEnd();
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (suppressClickRef.current) return;
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        kanbanCard,
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDragging && kanbanCardDragging,
      )}
      aria-label={`View ${candidate.name}, ${stage}`}
    >
      <div className={cn("flex flex-col", showMoveToInterview && "min-h-[120px]")}>
        <div className="flex items-start gap-2">
          {draggable ? (
          <GripVertical
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text">{candidate.name}</p>
          <p className="mt-0.5 text-[11px] text-muted">{candidate.source}</p>
        </div>
        </div>
        {showMoveToInterview ? (
          <div className="mt-auto flex justify-center pt-3">
            <Button
              type="button"
              size="sm"
              className="h-8 w-full max-w-[200px] rounded-[8px] bg-accent px-3 text-[11px] font-medium text-white hover:bg-[rgb(var(--accent-hover-rgb))] focus-visible:ring-accent/30"
              onClick={(e) => {
                e.stopPropagation();
                onMoveToInterview?.();
              }}
            >
              Move to Interview
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
