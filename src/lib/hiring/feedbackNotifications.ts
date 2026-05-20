"use client";

import type { PreviewRole } from "@/config/previewRole";

export type FeedbackNotification = {
  id: string;
  title: string;
  body: string;
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  round: string;
  requestedBy: string;
  assigneeName: string;
  ctaLabel: string;
  read: boolean;
  createdAt: string;
  recipientRoles: PreviewRole[];
};

export type FeedbackNotificationsSnapshot = {
  version: number;
  notifications: FeedbackNotification[];
  unread: number;
};

const STORAGE_KEY = "zecode-feedback-notifications";
const GLOBAL_KEY = "__zecode_feedback_notifications_store__";

type NotificationStore = {
  version: number;
  items: FeedbackNotification[];
  listeners: Set<() => void>;
};

const snapshotCache = new Map<PreviewRole, FeedbackNotificationsSnapshot>();

function getStore(): NotificationStore {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: NotificationStore };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { version: 0, items: hydrateFromSession(), listeners: new Set() };
  }
  return g[GLOBAL_KEY];
}

function hydrateFromSession(): FeedbackNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FeedbackNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistToSession(items: FeedbackNotification[]) {
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

export function subscribeFeedbackNotifications(listener: () => void): () => void {
  const store = getStore();
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

export function getFeedbackNotifications(): FeedbackNotification[] {
  return [...getStore().items];
}

/** Stable snapshot for useSyncExternalStore — avoids infinite re-renders. */
export function getNotificationsSnapshot(role: PreviewRole): FeedbackNotificationsSnapshot {
  const store = getStore();
  const cached = snapshotCache.get(role);
  if (cached && cached.version === store.version) return cached;

  const notifications = store.items.filter((n) => n.recipientRoles.includes(role));
  const snap: FeedbackNotificationsSnapshot = {
    version: store.version,
    notifications,
    unread: notifications.filter((n) => !n.read).length,
  };
  snapshotCache.set(role, snap);
  return snap;
}

export function markFeedbackNotificationRead(id: string) {
  const store = getStore();
  const item = store.items.find((n) => n.id === id);
  if (item) item.read = true;
  notify();
}

export function addFeedbackRequestNotification(input: {
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  round: string;
  requestedBy: string;
  assigneeName: string;
}): FeedbackNotification {
  const entry: FeedbackNotification = {
    id: `fn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: "Feedback request received",
    body: `Please submit interview feedback for ${input.candidateName}.`,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    roleTitle: input.roleTitle,
    round: input.round,
    requestedBy: input.requestedBy,
    assigneeName: input.assigneeName,
    ctaLabel: "Open Feedback",
    read: false,
    createdAt: new Date().toISOString(),
    recipientRoles: ["evaluator"],
  };
  getStore().items.unshift(entry);
  notify();
  return entry;
}

export type FeedbackEmailPayload = {
  to: string;
  subject: string;
  candidateName: string;
  roleTitle: string;
  round: string;
  interviewDate: string;
  requestedBy: string;
};

export async function sendFeedbackRequestEmail(payload: FeedbackEmailPayload): Promise<{ ok: boolean }> {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[Ze[code] email mock]", payload);
  }
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true };
}
