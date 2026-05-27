"use client";

import type { PreviewRole } from "@/config/previewRole";

export type TransferNotificationKind =
  | "transfer_request"
  | "transfer_approved"
  | "transfer_rejected"
  | "ownership_transfer_request"
  | "ownership_transfer_approved"
  | "ownership_transfer_declined";

export type TransferNotification = {
  id: string;
  kind: TransferNotificationKind;
  title: string;
  body: string;
  transferRequestId: string;
  candidateId: string;
  candidateName: string;
  fromJobTitle: string;
  toJobTitle: string;
  requestedBy: string;
  read: boolean;
  createdAt: string;
  recipientRoles: PreviewRole[];
};

export type TransferNotificationsSnapshot = {
  version: number;
  notifications: TransferNotification[];
  unread: number;
};

const STORAGE_KEY = "zecode-transfer-notifications";
const GLOBAL_KEY = "__zecode_transfer_notifications_store__";

type NotificationStore = {
  version: number;
  items: TransferNotification[];
  listeners: Set<() => void>;
};

const snapshotCache = new Map<PreviewRole, TransferNotificationsSnapshot>();

function getStore(): NotificationStore {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: NotificationStore };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { version: 0, items: hydrateFromSession(), listeners: new Set() };
  }
  return g[GLOBAL_KEY];
}

function hydrateFromSession(): TransferNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TransferNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistToSession(items: TransferNotification[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota or private mode */
  }
}

function notify() {
  const store = getStore();
  store.version += 1;
  snapshotCache.clear();
  persistToSession(store.items);
  store.listeners.forEach((l) => l());
}

export function subscribeTransferNotifications(listener: () => void): () => void {
  const store = getStore();
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

export function getTransferNotificationsSnapshot(role: PreviewRole): TransferNotificationsSnapshot {
  const store = getStore();
  const cached = snapshotCache.get(role);
  if (cached && cached.version === store.version) return cached;

  const notifications = store.items.filter((n) => n.recipientRoles.includes(role));
  const snap: TransferNotificationsSnapshot = {
    version: store.version,
    notifications,
    unread: notifications.filter((n) => !n.read).length,
  };
  snapshotCache.set(role, snap);
  return snap;
}

export function markTransferNotificationRead(id: string) {
  const store = getStore();
  const item = store.items.find((n) => n.id === id);
  if (item) item.read = true;
  notify();
}

export function addTransferRequestNotification(input: {
  transferRequestId: string;
  candidateId: string;
  candidateName: string;
  fromJobTitle: string;
  toJobTitle: string;
  requestedBy: string;
}): TransferNotification {
  const entry: TransferNotification = {
    id: `tn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: "transfer_request",
    title: "Transfer request",
    body: `${input.requestedBy} requested to move ${input.candidateName} from ${input.fromJobTitle} to ${input.toJobTitle}.`,
    transferRequestId: input.transferRequestId,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    fromJobTitle: input.fromJobTitle,
    toJobTitle: input.toJobTitle,
    requestedBy: input.requestedBy,
    read: false,
    createdAt: new Date().toISOString(),
    recipientRoles: ["superAdmin"],
  };
  getStore().items.unshift(entry);
  notify();
  return entry;
}

export function addTransferResolvedNotification(input: {
  transferRequestId: string;
  candidateId: string;
  candidateName: string;
  fromJobTitle: string;
  toJobTitle: string;
  approved: boolean;
  resolvedBy: string;
  requestedBy: string;
}): TransferNotification {
  const entry: TransferNotification = {
    id: `tn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: input.approved ? "transfer_approved" : "transfer_rejected",
    title: input.approved ? "Transfer approved" : "Transfer request rejected",
    body: input.approved
      ? `${input.candidateName} was moved to ${input.toJobTitle}.`
      : `Your transfer request for ${input.candidateName} was rejected.`,
    transferRequestId: input.transferRequestId,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    fromJobTitle: input.fromJobTitle,
    toJobTitle: input.toJobTitle,
    requestedBy: input.requestedBy,
    read: false,
    createdAt: new Date().toISOString(),
    recipientRoles: ["admin"],
  };
  getStore().items.unshift(entry);
  notify();
  return entry;
}

export type TransferEmailPayload = {
  to: string;
  subject: string;
  body: string;
};

/** Kanban ownership — notify current owner (typically Super Admin persona) */
export function addOwnershipTransferRequestNotification(input: {
  transferRequestId: string;
  candidateId: string;
  candidateName: string;
  requestedBy: string;
  ownerName: string;
  targetStage: string;
  targetSubstage?: string;
  reason: string;
  priority?: boolean;
}): TransferNotification {
  const entry: TransferNotification = {
    id: `tn-own-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: "ownership_transfer_request",
    title: "Ownership transfer request",
    body: `${input.requestedBy} requested to shortlist ${input.candidateName} (owned by ${input.ownerName}).`,
    transferRequestId: input.transferRequestId,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    fromJobTitle: input.targetStage,
    toJobTitle: input.targetSubstage ?? "Shortlisted",
    requestedBy: input.requestedBy,
    read: false,
    createdAt: new Date().toISOString(),
    recipientRoles: ["superAdmin"],
  };
  getStore().items.unshift(entry);
  notify();
  return entry;
}

export function addOwnershipTransferResolvedNotification(input: {
  transferRequestId: string;
  candidateId: string;
  candidateName: string;
  requestedBy: string;
  approved: boolean;
  targetStage: string;
  targetSubstage?: string;
}): TransferNotification {
  const entry: TransferNotification = {
    id: `tn-own-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: input.approved ? "ownership_transfer_approved" : "ownership_transfer_declined",
    title: input.approved ? "Transfer approved" : "Transfer declined",
    body: input.approved
      ? `${input.candidateName} was moved to ${input.targetSubstage ?? "Shortlisted"}.`
      : `Your request to shortlist ${input.candidateName} was declined.`,
    transferRequestId: input.transferRequestId,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    fromJobTitle: input.targetStage,
    toJobTitle: input.targetSubstage ?? "Shortlisted",
    requestedBy: input.requestedBy,
    read: false,
    createdAt: new Date().toISOString(),
    recipientRoles: ["admin", "curator", "evaluator"],
  };
  getStore().items.unshift(entry);
  notify();
  return entry;
}

export async function sendTransferNotificationEmail(payload: TransferEmailPayload): Promise<{ ok: boolean }> {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[Ze[code] transfer email mock]", payload);
  }
  await new Promise((r) => setTimeout(r, 350));
  return { ok: true };
}
