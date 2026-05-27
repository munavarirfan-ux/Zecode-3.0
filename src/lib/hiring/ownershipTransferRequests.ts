import type { HiringStageName } from "./stages";
import { HIRING_CANDIDATES, moveCandidateToStage } from "./mockData";
import type { HiringCandidate, OwnershipTransferRequest, OwnershipTransferStatus } from "./types";
import { enrichCandidateOwnership } from "./candidateOwnership";
import { getRecruiterById } from "./recruiters";
import {
  addOwnershipTransferRequestNotification,
  addOwnershipTransferResolvedNotification,
} from "./transferNotifications";

export function getOwnershipTransferRequest(
  requestId: string,
): OwnershipTransferRequest | undefined {
  return OWNERSHIP_TRANSFER_STORE.find((r) => r.id === requestId);
}

const OWNERSHIP_TRANSFER_STORE: OwnershipTransferRequest[] = [];
const NOTIFICATION_LISTENERS = new Set<() => void>();

function notifyListeners() {
  NOTIFICATION_LISTENERS.forEach((fn) => fn());
}

export function subscribeOwnershipTransferNotifications(listener: () => void): () => void {
  NOTIFICATION_LISTENERS.add(listener);
  return () => NOTIFICATION_LISTENERS.delete(listener);
}

export function getOwnershipTransferRequestsForRecruiter(
  recruiterId: string,
): OwnershipTransferRequest[] {
  return OWNERSHIP_TRANSFER_STORE.filter(
    (r) => r.fromRecruiterId === recruiterId && r.status === "pending",
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPendingOwnershipTransferForCandidate(
  candidateId: string,
): OwnershipTransferRequest | undefined {
  return OWNERSHIP_TRANSFER_STORE.find(
    (r) => r.candidateId === candidateId && r.status === "pending",
  );
}

export function createOwnershipTransferRequest(input: {
  candidate: HiringCandidate;
  fromRecruiterId: string;
  fromRecruiterName: string;
  toRecruiterId: string;
  toRecruiterName: string;
  reason: string;
  targetStage: HiringStageName;
  targetSubstage?: string;
  priority?: boolean;
}): { ok: true; request: OwnershipTransferRequest } | { ok: false; error: string } {
  const existing = getPendingOwnershipTransferForCandidate(input.candidate.id);
  if (existing) {
    return {
      ok: false,
      error: `Transfer already requested by ${existing.toRecruiterName}`,
    };
  }

  const request: OwnershipTransferRequest = {
    id: `otr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    candidateId: input.candidate.id,
    candidateName: input.candidate.name,
    fromRecruiterId: input.fromRecruiterId,
    fromRecruiterName: input.fromRecruiterName,
    toRecruiterId: input.toRecruiterId,
    toRecruiterName: input.toRecruiterName,
    reason: input.reason,
    targetStage: input.targetStage,
    targetSubstage: input.targetSubstage,
    priority: input.priority,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  OWNERSHIP_TRANSFER_STORE.unshift(request);
  addOwnershipTransferRequestNotification({
    transferRequestId: request.id,
    candidateId: request.candidateId,
    candidateName: request.candidateName,
    requestedBy: request.toRecruiterName,
    ownerName: request.fromRecruiterName,
    targetStage: request.targetStage,
    targetSubstage: request.targetSubstage,
    reason: request.reason,
    priority: request.priority,
  });
  notifyListeners();
  return { ok: true, request };
}

export function respondToOwnershipTransferRequest(
  requestId: string,
  status: Extract<OwnershipTransferStatus, "approved" | "declined" | "discussing">,
  responseNote?: string,
): { ok: true; request: OwnershipTransferRequest } | { ok: false; error: string } {
  const idx = OWNERSHIP_TRANSFER_STORE.findIndex((r) => r.id === requestId);
  if (idx < 0) return { ok: false, error: "Request not found" };
  const req = OWNERSHIP_TRANSFER_STORE[idx]!;
  if (req.status !== "pending" && req.status !== "discussing") {
    return { ok: false, error: "Request already closed" };
  }

  req.status = status;
  req.respondedAt = new Date().toISOString();
  req.responseNote = responseNote;

  if (status === "approved") {
    const move = moveCandidateToStage(req.candidateId, req.targetStage, {
      substage: req.targetSubstage,
    });
    if (!move.ok) {
      req.status = "pending";
      delete req.respondedAt;
      delete req.responseNote;
      return { ok: false, error: move.error };
    }
    reassignCandidateOwner(req.candidateId, req.toRecruiterId, req.toRecruiterName);
  }

  if (status === "approved" || status === "declined") {
    addOwnershipTransferResolvedNotification({
      transferRequestId: req.id,
      candidateId: req.candidateId,
      candidateName: req.candidateName,
      requestedBy: req.toRecruiterName,
      approved: status === "approved",
      targetStage: req.targetStage,
      targetSubstage: req.targetSubstage,
    });
  }

  notifyListeners();
  return { ok: true, request: req };
}

function reassignCandidateOwner(
  candidateId: string,
  newOwnerId: string,
  newOwnerName: string,
): void {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return;

  const profile = getRecruiterById(newOwnerId);
  candidate.ownerId = newOwnerId;
  candidate.ownerName = newOwnerName;
  candidate.recruiterOwner = newOwnerName;
  candidate.ownerAvatarUrl = profile?.avatarUrl;

  const now = new Date().toISOString();
  const existing = candidate.engagedBy?.find((e) => e.recruiterId === newOwnerId);
  if (existing) {
    existing.lastEngagedAt = now;
    existing.engagementType = "voted";
  } else {
    candidate.engagedBy = [
      ...(candidate.engagedBy ?? []),
      {
        recruiterId: newOwnerId,
        recruiterName: newOwnerName,
        recruiterAvatarUrl: profile?.avatarUrl,
        firstEngagedAt: now,
        lastEngagedAt: now,
        engagementType: "voted",
      },
    ];
  }
}

export function recordEngagement(
  candidateId: string,
  recruiterId: string,
  recruiterName: string,
  engagementType: import("./types").EngagementType,
  claimOwnership = false,
): void {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return;

  enrichCandidateOwnership(candidate);
  const now = new Date().toISOString();
  const profile = getRecruiterById(recruiterId);

  let record = candidate.engagedBy?.find((e) => e.recruiterId === recruiterId);
  if (record) {
    record.lastEngagedAt = now;
    record.engagementType = engagementType;
  } else {
    candidate.engagedBy = [
      ...(candidate.engagedBy ?? []),
      {
        recruiterId,
        recruiterName,
        recruiterAvatarUrl: profile?.avatarUrl,
        firstEngagedAt: now,
        lastEngagedAt: now,
        engagementType,
      },
    ];
  }

  if (claimOwnership && !candidate.ownerId) {
    candidate.ownerId = recruiterId;
    candidate.ownerName = recruiterName;
    candidate.recruiterOwner = recruiterName;
    candidate.ownerAvatarUrl = profile?.avatarUrl;
  }
}
