"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { updateCandidateVerdict } from "@/lib/hiring/mockData";
import { applicantsStatsColumnId } from "@/lib/hiring/stages";
import {
  canUserActOn,
  getCandidateOwner,
  type OwnershipAction,
} from "@/lib/hiring/ownership";
import { recordEngagement } from "@/lib/hiring/ownershipTransferRequests";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import type { KanbanBulkActionId } from "./KanbanBulkActionBar";

export type KanbanBulkSelectionOptions = {
  candidates: HiringCandidate[];
  enabled?: boolean;
  job?: HiringJob;
  jobId?: string;
  allowMoveToInterview?: boolean;
  onCandidateMoved?: () => void;
  onOpenEmails?: (candidate: HiringCandidate) => void;
  onMoveToInterview?: (candidates: HiringCandidate[]) => void;
  /** Applicants stats ownership */
  ownershipUserId?: string;
  ownershipUserName?: string;
  ownershipBypass?: boolean;
  ownershipAppliesTo?: (candidate: HiringCandidate) => boolean;
  isApplicantsStatsBoard?: boolean;
};

export function useKanbanBulkSelection({
  candidates,
  enabled = true,
  job,
  jobId,
  allowMoveToInterview = false,
  onCandidateMoved,
  onOpenEmails,
  onMoveToInterview,
  ownershipUserId = "",
  ownershipUserName = "",
  ownershipBypass = false,
  ownershipAppliesTo = () => false,
  isApplicantsStatsBoard = false,
}: KanbanBulkSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [bulkTagsOpen, setBulkTagsOpen] = useState(false);

  const bulkEnabled = enabled;

  const selectedCandidates = useMemo(
    () => candidates.filter((c) => selectedIds.has(c.id)),
    [candidates, selectedIds],
  );

  const toggleSelected = useCallback((id: string, on: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const toggleSelectAllInColumn = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = ids.length > 0 && ids.every((id) => next.has(id));
      if (allSelected) {
        for (const id of ids) next.delete(id);
      } else {
        for (const id of ids) next.add(id);
      }
      return next;
    });
  }, []);

  const checkOwnership = useCallback(
    (candidate: HiringCandidate, action: OwnershipAction): boolean => {
      if (!ownershipAppliesTo(candidate)) return true;
      return canUserActOn(ownershipUserId, candidate, action, {
        isAdmin: ownershipBypass,
      });
    },
    [ownershipAppliesTo, ownershipUserId, ownershipBypass],
  );

  const eligibleForMoveToInterview = useMemo(() => {
    if (!allowMoveToInterview || !jobId) return [];
    return selectedCandidates.filter((c) => {
      if (isApplicantsStatsBoard && applicantsStatsColumnId(c) !== "shortlisted") return false;
      if (isApplicantsStatsBoard && applicantsStatsColumnId(c) === "shortlisted") {
        const { ownerId } = getCandidateOwner(c);
        if (ownerId !== ownershipUserId && !ownershipBypass) return false;
      }
      return checkOwnership(c, "moveToInterview");
    });
  }, [
    selectedCandidates,
    allowMoveToInterview,
    jobId,
    isApplicantsStatsBoard,
    ownershipUserId,
    ownershipBypass,
    checkOwnership,
  ]);

  const handleBulkAction = useCallback(
    (action: KanbanBulkActionId) => {
      if (selectedCandidates.length === 0) return;

      switch (action) {
        case "moveToInterview": {
          if (eligibleForMoveToInterview.length === 0) {
            toast.error(
              isApplicantsStatsBoard
                ? "Only your shortlisted candidates can move to interview"
                : "No selected candidates can move to interview",
            );
            return;
          }
          onMoveToInterview?.(eligibleForMoveToInterview);
          break;
        }
        case "sendEmail": {
          const eligible = selectedCandidates.filter((c) => checkOwnership(c, "sendEmail"));
          if (eligible.length === 0) {
            toast.error("No selected candidates available for email");
            return;
          }
          for (const c of eligible) {
            if (ownershipAppliesTo(c))
              recordEngagement(c.id, ownershipUserId, ownershipUserName, "emailed", true);
          }
          if (eligible.length === 1) {
            onOpenEmails?.(eligible[0]);
          } else {
            toast.success(`Email queued for ${eligible.length} candidates`, {
              description: "Demo: bulk send opens the first candidate's inbox.",
            });
            onOpenEmails?.(eligible[0]);
          }
          clearSelection();
          break;
        }
        case "hire": {
          const eligible = selectedCandidates.filter((c) => checkOwnership(c, "setVerdictHire"));
          if (eligible.length === 0) {
            toast.error("You can't mark hire on the selected candidates");
            return;
          }
          let ok = 0;
          for (const c of eligible) {
            const result = updateCandidateVerdict(c.id, "hire");
            if (result.ok) {
              ok += 1;
              if (ownershipAppliesTo(c))
                recordEngagement(c.id, ownershipUserId, ownershipUserName, "voted", true);
            }
          }
          if (ok > 0) {
            toast.success(`Marked ${ok} as hire`);
            onCandidateMoved?.();
          }
          clearSelection();
          break;
        }
        case "noHire": {
          const eligible = selectedCandidates.filter((c) =>
            checkOwnership(c, "setVerdictNoHire"),
          );
          if (eligible.length === 0) {
            toast.error("You can't mark no hire on the selected candidates");
            return;
          }
          let ok = 0;
          for (const c of eligible) {
            const result = updateCandidateVerdict(c.id, "no_hire");
            if (result.ok) {
              ok += 1;
              if (ownershipAppliesTo(c))
                recordEngagement(c.id, ownershipUserId, ownershipUserName, "voted", true);
            }
          }
          if (ok > 0) {
            toast.success(`Marked ${ok} as no hire`);
            onCandidateMoved?.();
          }
          clearSelection();
          break;
        }
        case "addTags": {
          if (!job) {
            toast.error("Job context required to add tags");
            return;
          }
          setBulkTagsOpen(true);
          break;
        }
        default:
          break;
      }
    },
    [
      selectedCandidates,
      eligibleForMoveToInterview,
      isApplicantsStatsBoard,
      checkOwnership,
      ownershipAppliesTo,
      ownershipUserId,
      ownershipUserName,
      onOpenEmails,
      onCandidateMoved,
      onMoveToInterview,
      clearSelection,
      job,
    ],
  );

  const bulkDisabledActions = useMemo((): Partial<Record<KanbanBulkActionId, string>> => {
    const disabled: Partial<Record<KanbanBulkActionId, string>> = {};
    if (!allowMoveToInterview || !jobId) {
      disabled.moveToInterview = "Move to interview not available";
    } else if (eligibleForMoveToInterview.length === 0 && selectedCandidates.length > 0) {
      disabled.moveToInterview = isApplicantsStatsBoard
        ? "Select shortlisted candidates you own"
        : "No eligible candidates";
    }
    if (!job) disabled.addTags = "Tags require job context";
    return disabled;
  }, [
    allowMoveToInterview,
    jobId,
    eligibleForMoveToInterview.length,
    selectedCandidates.length,
    isApplicantsStatsBoard,
    job,
  ]);

  return {
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
  };
}
