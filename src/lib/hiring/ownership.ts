import type { PreviewRole } from "@/config/previewRole";
import type { KanbanViewMode } from "./types";
import type { HiringCandidate } from "./types";
import type { PrimaryActionId, KanbanMenuAction } from "./stage-actions";
import { isHiringAdminRole } from "./directoryAccess";
import { getRecruiterById, DEFAULT_HIRING_TEAM_ID, getTeamRecruiterIds } from "./recruiters";
import { enrichCandidateOwnership } from "./candidateOwnership";

/** Applicants stats kanban — ownership + transfer on shared Applicants column only */
export type KanbanOwnershipBoard = "applicants-stats";

export type OwnershipAction =
  | PrimaryActionId
  | KanbanMenuAction
  | "dragMove"
  | "shortlist";

const CLAIMING_ACTIONS = new Set<string>([
  "moveToInterview",
  "moveNext",
  "reopen",
  "reject",
  "setVerdictHire",
  "setVerdictNoHire",
  "setVerdictNeutral",
  "dragMove",
  "shortlist",
  "sendOffer",
  "onboarding",
]);

const NON_OWNER_ALLOWED = new Set<string>([
  "view",
  "viewProfile",
  "review",
  "sendEmail",
  "schedule",
  "reschedule",
  "addNote",
  "requestFeedback",
]);

export function getDefaultKanbanViewMode(role: PreviewRole): KanbanViewMode {
  if (role === "superAdmin") return "all";
  if (role === "admin") return "team";
  return "mine";
}

export function isOwnershipClaimingAction(action: OwnershipAction): boolean {
  return CLAIMING_ACTIONS.has(action);
}

export function canUserActOn(
  userId: string,
  candidate: HiringCandidate,
  action: OwnershipAction,
  options?: { isAdmin?: boolean },
): boolean {
  if (options?.isAdmin) return true;
  if (NON_OWNER_ALLOWED.has(action)) return true;
  if (!isOwnershipClaimingAction(action)) return true;

  const c = enrichCandidateOwnership(candidate);
  const ownerId = c.ownerId ?? "";
  if (!ownerId) return true;
  return ownerId === userId;
}

export function getCandidateOwner(candidate: HiringCandidate) {
  const c = enrichCandidateOwnership(candidate);
  const owner = getRecruiterById(c.ownerId ?? "");
  return {
    ownerId: c.ownerId ?? "",
    ownerName: c.ownerName ?? c.recruiterOwner,
    ownerAvatarUrl: c.ownerAvatarUrl ?? owner?.avatarUrl,
  };
}

export function candidateVisibleInViewMode(
  candidate: HiringCandidate,
  viewMode: KanbanViewMode,
  currentUserId: string,
  teamId = DEFAULT_HIRING_TEAM_ID,
): boolean {
  const c = enrichCandidateOwnership(candidate);
  if (viewMode === "all") return true;
  if (viewMode === "mine") return c.ownerId === currentUserId;
  const teamIds = new Set(getTeamRecruiterIds(teamId));
  return teamIds.has(c.ownerId ?? "");
}

export function userIsHiringAdmin(role: PreviewRole): boolean {
  return isHiringAdminRole(role);
}
