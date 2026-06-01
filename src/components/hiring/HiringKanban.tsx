"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { rejectCandidate } from "@/lib/hiring/candidateProfile";
import {
  moveCandidateToStage,
  updateCandidateVerdict,
} from "@/lib/hiring/mockData";
import {
  applicantsStatsColumnId,
  substageForKanbanColumn,
  type HiringStageName,
} from "@/lib/hiring/stages";
import type { KanbanOwnershipBoard } from "@/lib/hiring/ownership";
import { isCandidateInApplicantsOwnershipScope } from "@/lib/hiring/kanbanOwnership";
import type {
  CandidateVerdict,
  HiringCandidate,
  HiringJob,
} from "@/lib/hiring/types";
import type { KanbanMenuAction, PrimaryActionId } from "@/lib/hiring/stage-actions";
import {
  canUserActOn,
  getCandidateOwner,
  isOwnershipClaimingAction,
  type OwnershipAction,
} from "@/lib/hiring/ownership";
import type { PreviewRole } from "@/config/previewRole";
import {
  createOwnershipTransferRequest,
  getPendingOwnershipTransferForCandidate,
  recordEngagement,
} from "@/lib/hiring/ownershipTransferRequests";
import { MoveToInterviewDialog } from "./applicants/MoveToInterviewDialog";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { KanbanMoveConfirmDialog } from "./KanbanMoveConfirmDialog";
import { CandidateCard } from "./candidate-card/CandidateCard";
import { CollisionDialog } from "./kanban/CollisionDialog";
import { TransferRequestModal } from "./kanban/TransferRequestModal";
import { KanbanBulkActionBar } from "./kanban/KanbanBulkActionBar";
import { KanbanBulkTagsDialog } from "./kanban/KanbanBulkTagsDialog";
import { KanbanColumnHeader } from "./kanban/KanbanColumnHeader";
import { useKanbanBulkSelection } from "./kanban/useKanbanBulkSelection";
import {
  getMoveToInterviewPendingRequest,
  subscribeMoveToInterviewStore,
} from "@/lib/hiring/moveToInterviewApproval";
import { RequestMoveToInterviewDialog } from "./kanban/RequestMoveToInterviewDialog";
import {
  kanbanBoardGrain,
  kanbanBoardShell,
  kanbanBoardTrack,
  kanbanColumnBody,
  kanbanColumnShell,
  kanbanColumnShellDrop,
} from "./hiringTokens";

export type KanbanColumnDef = {
  id: string;
  title: string;
};

export type KanbanOwnershipContext = {
  currentUserId: string;
  currentUserName: string;
  previewRole: PreviewRole;
  /** When set, ownership + transfer apply on Applicants (shared pool) column */
  board: KanbanOwnershipBoard;
};

function resolveColumnId(
  candidate: HiringCandidate,
  columns: KanbanColumnDef[],
  columnResolver?: (candidate: HiringCandidate) => string,
): string {
  if (columnResolver) return columnResolver(candidate);
  return candidate.kanbanColumn ?? columns[0]?.id ?? "";
}

type UndoSnapshot = {
  candidateId: string;
  stage: HiringStageName;
  substage: string;
  kanbanColumn?: string;
};

export function HiringKanban({
  columns,
  candidates,
  pipelineStage,
  columnResolver,
  resolveSubstage,
  onCardClick,
  onCandidateMoved,
  onOpenEmails,
  enableDragDrop = true,
  jobId,
  allowMoveToInterview = true,
  ownership,
  job,
  enableBulkSelect = true,
}: {
  columns: KanbanColumnDef[];
  candidates: HiringCandidate[];
  pipelineStage: HiringStageName;
  columnResolver?: (candidate: HiringCandidate) => string;
  resolveSubstage?: (columnId: string, columnTitle: string) => string;
  onCardClick?: (candidate: HiringCandidate) => void;
  onCandidateMoved?: () => void;
  onOpenEmails?: (candidate: HiringCandidate) => void;
  enableDragDrop?: boolean;
  jobId?: string;
  allowMoveToInterview?: boolean;
  ownership?: KanbanOwnershipContext;
  job?: HiringJob;
  enableBulkSelect?: boolean;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    candidate: HiringCandidate;
    fromColumnId: string;
    toColumn: KanbanColumnDef;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [moveToInterviewCandidates, setMoveToInterviewCandidates] = useState<HiringCandidate[]>([]);
  const [collisionCandidate, setCollisionCandidate] = useState<HiringCandidate | null>(null);
  const [transferCandidate, setTransferCandidate] = useState<HiringCandidate | null>(null);
  const [transferSubmitting, setTransferSubmitting] = useState(false);
  const [mtiRequestCandidate, setMtiRequestCandidate] = useState<HiringCandidate | null>(null);
  const [mtiVersion, setMtiVersion] = useState(0);
  useEffect(() => {
    return subscribeMoveToInterviewStore(() => setMtiVersion((n) => n + 1));
  }, []);
  const undoRef = useRef<UndoSnapshot | null>(null);

  const canDrag = enableDragDrop && columns.length > 1;
  /** Only Super Admin bypasses ownership; Admin still sees collision + transfer flow */
  const bypassOwnership = ownership?.previewRole === "superAdmin";
  const userId = ownership?.currentUserId ?? "";
  const userName = ownership?.currentUserName ?? "";
  const isApplicantsStatsBoard = ownership?.board === "applicants-stats";

  const ownershipAppliesTo = useCallback(
    (candidate: HiringCandidate): boolean => {
      if (!ownership || !isApplicantsStatsBoard) return false;
      if (pipelineStage !== "Screening") return false;
      return isCandidateInApplicantsOwnershipScope(candidate);
    },
    [ownership, isApplicantsStatsBoard, pipelineStage],
  );

  const showEngagedByOnCard = useCallback(
    (candidate: HiringCandidate): boolean => {
      if (!isApplicantsStatsBoard) return false;
      const col = applicantsStatsColumnId(candidate);
      return col === "applied" || col === "shortlisted";
    },
    [isApplicantsStatsBoard],
  );

  const checkOwnership = useCallback(
    (candidate: HiringCandidate, action: OwnershipAction): boolean => {
      if (!ownershipAppliesTo(candidate)) return true;
      return canUserActOn(userId, candidate, action, { isAdmin: bypassOwnership });
    },
    [ownershipAppliesTo, userId, bypassOwnership],
  );

  const openCollisionIfBlocked = useCallback(
    (candidate: HiringCandidate, action: OwnershipAction): boolean => {
      if (!ownershipAppliesTo(candidate)) return false;
      if (checkOwnership(candidate, action)) return false;
      setCollisionCandidate(candidate);
      return true;
    },
    [ownershipAppliesTo, checkOwnership],
  );

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
    jobId,
    allowMoveToInterview,
    onCandidateMoved,
    onOpenEmails,
    onMoveToInterview: setMoveToInterviewCandidates,
    ownershipUserId: userId,
    ownershipUserName: userName,
    ownershipBypass: bypassOwnership,
    ownershipAppliesTo,
    isApplicantsStatsBoard,
  });

  const showMoveToast = useCallback(
    (name: string, columnTitle: string, snapshot: UndoSnapshot) => {
      toast.success(`Moved ${name} to ${columnTitle}`, {
        duration: 5000,
        action: {
          label: "Undo",
          onClick: () => {
            const result = moveCandidateToStage(snapshot.candidateId, snapshot.stage, {
              substage: snapshot.substage,
            });
            if (!result.ok) toast.error(result.error);
            else {
              toast.message("Move undone");
              onCandidateMoved?.();
            }
          },
        },
      });
      setHighlightId(snapshot.candidateId);
      window.setTimeout(() => setHighlightId(null), 500);
    },
    [onCandidateMoved],
  );

  const executeMove = useCallback(
    (candidate: HiringCandidate, toColumn: KanbanColumnDef) => {
      const substage =
        resolveSubstage?.(toColumn.id, toColumn.title) ??
        substageForKanbanColumn(toColumn.id, pipelineStage);

      const snapshot: UndoSnapshot = {
        candidateId: candidate.id,
        stage: pipelineStage,
        substage: candidate.currentSubstage,
        kanbanColumn: candidate.kanbanColumn,
      };
      undoRef.current = snapshot;

      const result = moveCandidateToStage(candidate.id, pipelineStage, { substage });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      if (ownershipAppliesTo(candidate)) {
        recordEngagement(candidate.id, userId, userName, "voted", true);
      }

      showMoveToast(candidate.name, toColumn.title, snapshot);
      onCandidateMoved?.();
    },
    [
      pipelineStage,
      resolveSubstage,
      ownershipAppliesTo,
      userId,
      userName,
      showMoveToast,
      onCandidateMoved,
    ],
  );

  const requestMove = useCallback(
    (candidate: HiringCandidate, toColumn: KanbanColumnDef) => {
      const fromColumnId = resolveColumnId(candidate, columns, columnResolver);
      if (fromColumnId === toColumn.id) return;
      if (openCollisionIfBlocked(candidate, "dragMove")) return;
      setPendingMove({ candidate, fromColumnId, toColumn });
    },
    [columns, columnResolver, openCollisionIfBlocked],
  );

  const confirmMove = useCallback(() => {
    if (!pendingMove) return;
    setConfirming(true);
    const { candidate, toColumn } = pendingMove;
    executeMove(candidate, toColumn);
    setConfirming(false);
    setPendingMove(null);
  }, [pendingMove, executeMove]);

  const handleVerdictChange = useCallback(
    (candidateId: string, verdict: CandidateVerdict, reason?: string) => {
      const candidate = candidates.find((c) => c.id === candidateId);
      if (candidate && openCollisionIfBlocked(candidate, "setVerdictHire")) return;

      const result = updateCandidateVerdict(candidateId, verdict, reason);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (candidate && ownershipAppliesTo(candidate)) {
        recordEngagement(candidateId, userId, userName, "voted", true);
      }
      onCandidateMoved?.();
    },
    [candidates, openCollisionIfBlocked, ownershipAppliesTo, userId, userName, onCandidateMoved],
  );

  const handlePrimaryAction = useCallback(
    (action: PrimaryActionId, candidate: HiringCandidate) => {
      if (
        isApplicantsStatsBoard &&
        action === "moveToInterview" &&
        applicantsStatsColumnId(candidate) === "shortlisted"
      ) {
        const { ownerId: oid, ownerName: oname } = getCandidateOwner(candidate);
        if (oid !== userId && !bypassOwnership) {
          toast.error(`${candidate.name} is on ${oname}'s shortlist. Request transfer from the Applicants column.`);
          return;
        }
      }

      if (isOwnershipClaimingAction(action) && openCollisionIfBlocked(candidate, action)) {
        return;
      }

      switch (action) {
        case "review":
        case "view":
          onCardClick?.(candidate);
          break;
        case "moveToInterview":
          if (!allowMoveToInterview) {
            toast.error("You don't have permission to move candidates to interview");
            break;
          }
          // Admin must request SA approval; SA can move directly
          if (ownership?.previewRole === "admin") {
            setMtiRequestCandidate(candidate);
            break;
          }
          if (jobId) setMoveToInterviewCandidates([candidate]);
          else toast.message("Move to Interview", { description: candidate.name });
          break;
        case "schedule":
          if (ownershipAppliesTo(candidate))
            recordEngagement(candidate.id, userId, userName, "scheduled", true);
          toast.message("Schedule Interview", { description: candidate.name });
          onCardClick?.(candidate);
          break;
        case "requestFeedback":
          toast.message("Request Feedback", { description: candidate.name });
          break;
        case "sendOffer":
          toast.message("Send offer", { description: candidate.name });
          break;
        case "viewOffer":
        case "viewSignedOffer":
        case "viewProfile":
          onCardClick?.(candidate);
          break;
        case "onboarding":
          toast.message("Onboarding", { description: candidate.name });
          break;
        case "moveNext":
          toast.message("Move to next stage", { description: candidate.name });
          break;
        case "reopen": {
          const result = moveCandidateToStage(candidate.id, "Screening", { substage: "Applied" });
          if (!result.ok) toast.error(result.error);
          else {
            showMoveToast(candidate.name, "Applied", {
              candidateId: candidate.id,
              stage: pipelineStage,
              substage: candidate.currentSubstage,
            });
            onCandidateMoved?.();
          }
          break;
        }
        default:
          onCardClick?.(candidate);
      }
    },
    [
      openCollisionIfBlocked,
      allowMoveToInterview,
      jobId,
      onCardClick,
      isApplicantsStatsBoard,
      bypassOwnership,
      ownershipAppliesTo,
      userId,
      userName,
      pipelineStage,
      showMoveToast,
      onCandidateMoved,
    ],
  );

  const handleMenuAction = useCallback(
    (action: KanbanMenuAction, candidate: HiringCandidate) => {
      const ownershipAction: OwnershipAction =
        action === "reject"
          ? "reject"
          : action.startsWith("setVerdict")
            ? "setVerdictHire"
            : action;

      if (
        isOwnershipClaimingAction(ownershipAction) &&
        openCollisionIfBlocked(candidate, ownershipAction)
      ) {
        return;
      }

      switch (action) {
        case "viewProfile":
          onCardClick?.(candidate);
          break;
        case "moveToInterview":
          if (!allowMoveToInterview) {
            toast.error("You don't have permission to move candidates to interview");
            break;
          }
          if (jobId) setMoveToInterviewCandidates([candidate]);
          break;
        case "schedule":
          if (ownershipAppliesTo(candidate))
            recordEngagement(candidate.id, userId, userName, "scheduled", true);
          toast.message("Schedule Interview", { description: candidate.name });
          onCardClick?.(candidate);
          break;
        case "sendEmail":
          if (ownershipAppliesTo(candidate))
            recordEngagement(candidate.id, userId, userName, "emailed", true);
          onOpenEmails?.(candidate);
          break;
        case "requestFeedback":
          toast.message("Request Feedback", { description: candidate.name });
          break;
        case "moveNext":
          toast.message("Move to next stage", { description: candidate.name });
          break;
        case "addNote":
          if (ownershipAppliesTo(candidate))
            recordEngagement(candidate.id, userId, userName, "commented", true);
          toast.message("Add note", { description: `${candidate.name} (demo)` });
          break;
        case "reject": {
          const updated = rejectCandidate(candidate.id);
          if (!updated) toast.error("Could not reject candidate");
          else {
            toast.success(`${candidate.name} rejected`);
            onCandidateMoved?.();
          }
          break;
        }
        default:
          break;
      }
    },
    [
      openCollisionIfBlocked,
      allowMoveToInterview,
      jobId,
      onCardClick,
      onCandidateMoved,
      onOpenEmails,
      ownershipAppliesTo,
      userId,
      userName,
    ],
  );

  const submitTransfer = useCallback(
    (payload: {
      reason: string;
      targetStage: HiringStageName;
      targetSubstage: string;
      priority: boolean;
    }) => {
      if (!transferCandidate || !ownershipAppliesTo(transferCandidate)) return;
      setTransferSubmitting(true);
      const { ownerId, ownerName } = getCandidateOwner(transferCandidate);
      const result = createOwnershipTransferRequest({
        candidate: transferCandidate,
        fromRecruiterId: ownerId,
        fromRecruiterName: ownerName,
        toRecruiterId: userId,
        toRecruiterName: userName,
        reason: payload.reason,
        targetStage: payload.targetStage,
        targetSubstage: payload.targetSubstage,
        priority: payload.priority,
      });
      setTransferSubmitting(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setTransferCandidate(null);
      toast.success("Transfer request sent", {
        description: `${ownerName} will be notified.`,
      });
    },
    [transferCandidate, ownershipAppliesTo, userId, userName],
  );

  return (
    <>
      <div className={cn(kanbanBoardShell, bulkEnabled && "pb-14")}>
        <div className={kanbanBoardGrain} aria-hidden />
        <div className={kanbanBoardTrack}>
          {columns.map((col) => {
            const items = candidates.filter(
              (c) => resolveColumnId(c, columns, columnResolver) === col.id,
            );
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
                <KanbanColumnHeader
                  title={col.title}
                  count={items.length}
                  bulkEnabled={bulkEnabled}
                  columnCandidateIds={items.map((c) => c.id)}
                  selectedIds={selectedIds}
                  onToggleSelectAllInColumn={toggleSelectAllInColumn}
                />
                <div className={kanbanColumnBody}>
                  {items.length === 0 ? (
                    <LineArtEmptyState
                      illustration="kanban"
                      message={canDrag ? "Drop candidates here" : "No candidates"}
                      size="sm"
                      className="px-1"
                    />
                  ) : (
                    items.map((c) => {
                      const owner = getCandidateOwner(c);
                      const inApplicantsPool = ownershipAppliesTo(c);
                      const inShortlisted =
                        isApplicantsStatsBoard &&
                        applicantsStatsColumnId(c) === "shortlisted";
                      const showEngaged = showEngagedByOnCard(c);
                      const isOwner =
                        bypassOwnership || owner.ownerId === userId;
                      // Suppress engagement chip on shortlisted cards the current user owns
                      // (in Mine view all shortlisted are owned → all chips hidden;
                      //  in All view only own cards are suppressed, others show "Engaged by X")
                      const suppressEngagement =
                        inShortlisted && !bypassOwnership && owner.ownerId === userId;
                      const canDragCard =
                        canDrag &&
                        (!isApplicantsStatsBoard ||
                          inApplicantsPool ||
                          isOwner);
                      const pendingTransfer = inApplicantsPool
                        ? getPendingOwnershipTransferForCandidate(c.id)
                        : undefined;
                      const pendingMoveApproval = inShortlisted
                        ? getMoveToInterviewPendingRequest(c.id)
                        : null;
                      // mtiVersion forces re-render when requests change
                      void mtiVersion;
                      const blockedOnShortlisted =
                        inShortlisted && !isOwner && !bypassOwnership;
                      return (
                        <CandidateCard
                          key={c.id}
                          candidate={c}
                          pipelineStage={pipelineStage}
                          compact
                          draggable={canDragCard && selectedIds.size === 0}
                          isDragging={draggingId === c.id}
                          highlight={highlightId === c.id}
                          actionDisabled={!!pendingTransfer || !!pendingMoveApproval || blockedOnShortlisted}
                          actionDisabledHint={
                            pendingMoveApproval
                              ? "Waiting for Super Admin approval"
                              : blockedOnShortlisted
                                ? `Shortlisted by ${owner.ownerName}`
                                : inApplicantsPool && !isOwner
                                  ? `Managed by ${owner.ownerName} — request transfer to shortlist`
                                  : pendingTransfer
                                    ? `Transfer pending from ${pendingTransfer.toRecruiterName}`
                                    : undefined
                          }
                          onDragStart={() => setDraggingId(c.id)}
                          onDragEnd={() => {
                            setDraggingId(null);
                            setDropTargetId(null);
                          }}
                          onCardClick={() => onCardClick?.(c)}
                          onPrimaryAction={handlePrimaryAction}
                          onMenuAction={handleMenuAction}
                          onVerdictChange={(verdict, reason) =>
                            handleVerdictChange(c.id, verdict, reason)
                          }
                          onOpenEmails={onOpenEmails}
                          showEngagedBy={showEngaged}
                          suppressEngagementChip={suppressEngagement}
                          pendingMoveApproval={!!pendingMoveApproval}
                          showVerdictPicker={!isApplicantsStatsBoard}
                          showStatusLine={!isApplicantsStatsBoard}
                          selectable={bulkEnabled}
                          selected={selectedIds.has(c.id)}
                          selectionActive={selectedIds.size > 0}
                          onSelectedChange={(on) => toggleSelected(c.id, on)}
                        />
                      );
                    })
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

      {isApplicantsStatsBoard ? (
        <>
          <CollisionDialog
            open={collisionCandidate !== null}
            onOpenChange={(open) => {
              if (!open) setCollisionCandidate(null);
            }}
            candidate={collisionCandidate}
            onRequestTransfer={() => {
              if (collisionCandidate) {
                const pending = getPendingOwnershipTransferForCandidate(collisionCandidate.id);
                if (pending) {
                  toast.error(`Transfer already requested by ${pending.toRecruiterName}`);
                  return;
                }
                setTransferCandidate(collisionCandidate);
              }
            }}
            onViewProfile={() => {
              if (collisionCandidate) onCardClick?.(collisionCandidate);
            }}
          />
          <TransferRequestModal
            open={transferCandidate !== null}
            onOpenChange={(open) => {
              if (!open) setTransferCandidate(null);
            }}
            candidate={transferCandidate}
            onSubmit={submitTransfer}
            submitting={transferSubmitting}
          />
        </>
      ) : null}

      <RequestMoveToInterviewDialog
        open={mtiRequestCandidate !== null}
        onOpenChange={(open) => { if (!open) setMtiRequestCandidate(null); }}
        candidate={mtiRequestCandidate}
        job={job ?? ({ id: jobId ?? "", title: "Open Role" } as any)}
        requestedBy={userName}
        onSubmitted={() => {
          setMtiRequestCandidate(null);
          setMtiVersion((n) => n + 1);
        }}
      />

      {jobId ? (
        <MoveToInterviewDialog
          open={moveToInterviewCandidates.length > 0}
          onOpenChange={(open) => {
            if (!open) setMoveToInterviewCandidates([]);
          }}
          candidates={moveToInterviewCandidates}
          jobId={jobId}
          onMoved={() => {
            clearSelection();
            onCandidateMoved?.();
          }}
        />
      ) : null}

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
