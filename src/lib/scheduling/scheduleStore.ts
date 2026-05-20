"use client";

import { useSyncExternalStore } from "react";
import { canDeleteSlot, validateNewOpenOrBlock } from "./conflicts";
import { buildInitialScheduleSeed } from "./seed";
import { snapMinutes } from "./time";
import { getWeekColumns } from "./week";
import type { AddSlotDraft, ScheduleSlot } from "./types";

type ScheduleState = {
  slots: ScheduleSlot[];
  timezone: string;
};

let state: ScheduleState = {
  ...buildInitialScheduleSeed(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Calcutta",
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function setState(next: Partial<ScheduleState>) {
  state = { ...state, ...next };
  emit();
}

export function getScheduleState(): ScheduleState {
  return state;
}

export function useScheduleStore(): ScheduleState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function slotsForWeek(weekStart: Date): ScheduleSlot[] {
  const keys = new Set(getWeekColumns(weekStart).map((c) => c.dayKey));
  return state.slots.filter((s) => keys.has(s.dayKey)).sort((a, b) => a.startMinutes - b.startMinutes);
}

export function weekSummary(weekStart: Date) {
  const weekSlots = slotsForWeek(weekStart);
  const booked = weekSlots.filter((s) => s.type === "booked").length;
  const openHours = weekSlots
    .filter((s) => s.type === "open")
    .reduce((acc, s) => acc + (s.endMinutes - s.startMinutes) / 60, 0);
  return { booked, openHours: Math.round(openHours * 10) / 10 };
}

/** Create a single open availability slot */
export function addOpenSlot(draft: AddSlotDraft): { ok: true } | { ok: false; error: string } {
  const start = snapMinutes(draft.startMinutes);
  const end = snapMinutes(draft.endMinutes);
  if (end <= start) return { ok: false, error: "End time must be after start time." };

  const check = validateNewOpenOrBlock(state.slots, draft.dayKey, start, end, "open");
  if (!check.ok) return { ok: false, error: check.message };

  setState({
    slots: [
      ...state.slots,
      {
        id: uid("op"),
        type: "open",
        dayKey: draft.dayKey,
        startMinutes: start,
        endMinutes: end,
      },
    ],
  });
  return { ok: true };
}

export function deleteSlot(id: string): { ok: true } | { ok: false; error: string } {
  const slot = state.slots.find((s) => s.id === id);
  if (!slot) return { ok: false, error: "Slot not found" };
  const del = canDeleteSlot(slot);
  if (!del.ok) return { ok: false, error: del.reason };
  setState({ slots: state.slots.filter((s) => s.id !== id) });
  return { ok: true };
}

export function cancelBookedInterview(id: string): void {
  setState({ slots: state.slots.filter((s) => s.id !== id) });
}

export function resetScheduleDemo() {
  state = { ...buildInitialScheduleSeed(), timezone: state.timezone };
  emit();
}
