"use client";

import { useSyncExternalStore } from "react";

export type RescheduleRequestRecord = {
  interviewRowId: string;
  reason: string;
  preferredDates?: string;
  preferredTimes?: string;
  notifyTeam: boolean;
  requestedAt: string;
};

let store: Record<string, RescheduleRequestRecord> = {};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function submitRescheduleRequest(record: RescheduleRequestRecord) {
  store = { ...store, [record.interviewRowId]: record };
  emit();
}

export function getRescheduleRequest(interviewRowId: string): RescheduleRequestRecord | undefined {
  return store[interviewRowId];
}

export function hasRescheduleRequest(interviewRowId: string): boolean {
  return Boolean(store[interviewRowId]);
}

export function useRescheduleRequests(): Record<string, RescheduleRequestRecord> {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => store,
    () => store,
  );
}

/** Demo seed — one pending request visible on load */
const SEED_ROW_ID = "c-sarah-jenkins-int-mi-1";

export function seedRescheduleRequests() {
  if (store[SEED_ROW_ID]) return;
  store = {
    ...store,
    [SEED_ROW_ID]: {
      interviewRowId: SEED_ROW_ID,
      reason: "Calendar overlap with another panel.",
      preferredDates: "May 18 or May 19",
      preferredTimes: "Morning CET",
      notifyTeam: true,
      requestedAt: new Date().toISOString(),
    },
  };
}

if (typeof window !== "undefined") {
  seedRescheduleRequests();
}
