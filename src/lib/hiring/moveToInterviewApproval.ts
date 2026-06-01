"use client";

import type { PreviewRole } from "@/config/previewRole";
import { moveCandidateToStage } from "@/lib/hiring/mockData";
import type { HiringStageName } from "@/lib/hiring/stages";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MoveToInterviewRequest = {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  requestedBy: string;
  requestedByRole: "admin";
  requestedStage: string;
  requestNote: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
};

export type MoveToInterviewNotificationKind =
  | "move_to_interview_request"
  | "move_to_interview_approved"
  | "move_to_interview_rejected";

export type MoveToInterviewNotification = {
  id: string;
  kind: MoveToInterviewNotificationKind;
  title: string;
  body: string;
  requestId: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  requestedBy: string;
  read: boolean;
  createdAt: string;
  recipientRoles: PreviewRole[];
};

export type MoveToInterviewSnapshot = {
  version: number;
  notifications: MoveToInterviewNotification[];
  unread: number;
};

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

const NOTIF_STORAGE_KEY = "zecode-move-to-interview-notifications";
const REQ_STORAGE_KEY = "zecode-move-to-interview-requests";
const GLOBAL_KEY = "__zecode_move_to_interview_store__";

type MoveToInterviewStore = {
  version: number;
  notifications: MoveToInterviewNotification[];
  requests: MoveToInterviewRequest[];
  listeners: Set<() => void>;
};

const snapshotCache = new Map<PreviewRole, MoveToInterviewSnapshot>();

function getStore(): MoveToInterviewStore {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: MoveToInterviewStore };
  if (!g[GLOBAL_KEY]) {
    const { notifications, requests } = hydrateFromSession();
    g[GLOBAL_KEY] = {
      version: 0,
      notifications,
      requests,
      listeners: new Set(),
    };
  }
  return g[GLOBAL_KEY];
}

function hydrateFromSession(): {
  notifications: MoveToInterviewNotification[];
  requests: MoveToInterviewRequest[];
} {
  if (typeof window === "undefined") return { notifications: [], requests: [] };
  try {
    const rawNotifs = sessionStorage.getItem(NOTIF_STORAGE_KEY);
    const rawReqs = sessionStorage.getItem(REQ_STORAGE_KEY);
    const notifications: MoveToInterviewNotification[] =
      rawNotifs ? (JSON.parse(rawNotifs) as MoveToInterviewNotification[]) : [];
    const requests: MoveToInterviewRequest[] =
      rawReqs ? (JSON.parse(rawReqs) as MoveToInterviewRequest[]) : [];
    return {
      notifications: Array.isArray(notifications) ? notifications : [],
      requests: Array.isArray(requests) ? requests : [],
    };
  } catch {
    return { notifications: [], requests: [] };
  }
}

function persistToSession(store: MoveToInterviewStore) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(store.notifications));
    sessionStorage.setItem(REQ_STORAGE_KEY, JSON.stringify(store.requests));
  } catch {
    /* quota or private mode */
  }
}

function notify() {
  const store = getStore();
  store.version += 1;
  snapshotCache.clear();
  persistToSession(store);
  store.listeners.forEach((l) => l());
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function subscribeMoveToInterviewStore(listener: () => void): () => void {
  const store = getStore();
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

export function getMoveToInterviewSnapshot(role: PreviewRole): MoveToInterviewSnapshot {
  const store = getStore();
  const cached = snapshotCache.get(role);
  if (cached && cached.version === store.version) return cached;

  const notifications = store.notifications.filter((n) => n.recipientRoles.includes(role));
  const snap: MoveToInterviewSnapshot = {
    version: store.version,
    notifications,
    unread: notifications.filter((n) => !n.read).length,
  };
  snapshotCache.set(role, snap);
  return snap;
}

/** Returns the most recent pending request for a given candidate, or undefined. */
export function getMoveToInterviewPendingRequest(
  candidateId: string,
): MoveToInterviewRequest | undefined {
  const store = getStore();
  return store.requests.find(
    (r) => r.candidateId === candidateId && r.status === "pending",
  );
}

/** Returns the most recent request (any status) for a given candidate, or undefined. */
export function getMoveToInterviewLastRequest(
  candidateId: string,
): MoveToInterviewRequest | undefined {
  const store = getStore();
  // requests are stored newest-first (unshift), so find returns the latest
  return store.requests.find((r) => r.candidateId === candidateId);
}

export function getAllMoveToInterviewRequests(): MoveToInterviewRequest[] {
  return [...getStore().requests];
}

// ---------------------------------------------------------------------------
// Create request
// ---------------------------------------------------------------------------

export function createMoveToInterviewRequest(input: {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  requestedBy: string;
  requestedStage: string;
  requestNote: string;
}): MoveToInterviewRequest {
  const store = getStore();

  const request: MoveToInterviewRequest = {
    id: `mti-req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    jobId: input.jobId,
    jobTitle: input.jobTitle,
    requestedBy: input.requestedBy,
    requestedByRole: "admin",
    requestedStage: input.requestedStage,
    requestNote: input.requestNote,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  store.requests.unshift(request);

  // Notify superAdmin
  const notification: MoveToInterviewNotification = {
    id: `mti-notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: "move_to_interview_request",
    title: "Move to Interview request",
    body: `${input.requestedBy} requested to move ${input.candidateName} to the Interview stage (${input.requestedStage}) for ${input.jobTitle}.`,
    requestId: request.id,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    jobTitle: input.jobTitle,
    requestedBy: input.requestedBy,
    read: false,
    createdAt: new Date().toISOString(),
    recipientRoles: ["superAdmin"],
  };

  store.notifications.unshift(notification);
  notify();
  return request;
}

// ---------------------------------------------------------------------------
// Approve request
// ---------------------------------------------------------------------------

export function approveMoveToInterviewRequest(
  requestId: string,
  reviewedBy: string,
): { ok: boolean; error?: string } {
  const store = getStore();
  const request = store.requests.find((r) => r.id === requestId);

  if (!request) return { ok: false, error: "Request not found" };
  if (request.status !== "pending") return { ok: false, error: "Request is no longer pending" };

  // Move the candidate to Interviews stage with the requestedStage as substage
  const moveResult = moveCandidateToStage(request.candidateId, "Interviews" as HiringStageName, {
    substage: request.requestedStage,
  });

  if (!moveResult.ok) return { ok: false, error: moveResult.error };

  request.status = "approved";
  request.reviewedBy = reviewedBy;
  request.reviewedAt = new Date().toISOString();

  // Notify the requesting admin
  const notification: MoveToInterviewNotification = {
    id: `mti-notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: "move_to_interview_approved",
    title: "Move to Interview approved",
    body: `${reviewedBy} approved moving ${request.candidateName} to the Interview stage (${request.requestedStage}) for ${request.jobTitle}.`,
    requestId: request.id,
    candidateId: request.candidateId,
    candidateName: request.candidateName,
    jobTitle: request.jobTitle,
    requestedBy: request.requestedBy,
    read: false,
    createdAt: new Date().toISOString(),
    recipientRoles: ["admin"],
  };

  store.notifications.unshift(notification);
  notify();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Reject request
// ---------------------------------------------------------------------------

export function rejectMoveToInterviewRequest(
  requestId: string,
  reviewedBy: string,
  reason?: string,
): { ok: boolean; error?: string } {
  const store = getStore();
  const request = store.requests.find((r) => r.id === requestId);

  if (!request) return { ok: false, error: "Request not found" };
  if (request.status !== "pending") return { ok: false, error: "Request is no longer pending" };

  request.status = "rejected";
  request.reviewedBy = reviewedBy;
  request.reviewedAt = new Date().toISOString();
  if (reason) request.rejectionReason = reason;

  // Notify the requesting admin
  const notification: MoveToInterviewNotification = {
    id: `mti-notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: "move_to_interview_rejected",
    title: "Move to Interview request rejected",
    body: reason
      ? `Your request to move ${request.candidateName} to Interview stage was rejected: ${reason}`
      : `Your request to move ${request.candidateName} to Interview stage was rejected.`,
    requestId: request.id,
    candidateId: request.candidateId,
    candidateName: request.candidateName,
    jobTitle: request.jobTitle,
    requestedBy: request.requestedBy,
    read: false,
    createdAt: new Date().toISOString(),
    recipientRoles: ["admin"],
  };

  store.notifications.unshift(notification);
  notify();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Mark notification read
// ---------------------------------------------------------------------------

export function markMoveToInterviewNotificationRead(notifId: string): void {
  const store = getStore();
  const notif = store.notifications.find((n) => n.id === notifId);
  if (notif) notif.read = true;
  notify();
}
