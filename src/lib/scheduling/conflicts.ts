import { rangesOverlap } from "./time";
import type { ScheduleSlot } from "./types";

export function slotsOverlapOnDay(
  slots: ScheduleSlot[],
  dayKey: string,
  start: number,
  end: number,
  excludeId?: string,
): ScheduleSlot | null {
  for (const s of slots) {
    if (s.id === excludeId || s.dayKey !== dayKey) continue;
    if (rangesOverlap(start, end, s.startMinutes, s.endMinutes)) return s;
  }
  return null;
}

export function canDeleteSlot(slot: ScheduleSlot): { ok: true } | { ok: false; reason: string } {
  if (slot.type === "booked") {
    return {
      ok: false,
      reason: "This slot has a confirmed interview. Cancel the interview first — you can't remove it silently.",
    };
  }
  return { ok: true };
}

export function validateNewOpenOrBlock(
  slots: ScheduleSlot[],
  dayKey: string,
  start: number,
  end: number,
  type: "open" | "blocked",
  excludeId?: string,
): { ok: true } | { ok: false; conflict: ScheduleSlot; message: string } {
  const hit = slotsOverlapOnDay(slots, dayKey, start, end, excludeId);
  if (!hit) return { ok: true };
  if (hit.type === "booked") {
    return {
      ok: false,
      conflict: hit,
      message: `Overlaps confirmed interview with ${hit.candidateName} (${hit.roundName}).`,
    };
  }
  if (type === "open" && (hit.type === "blocked" || hit.type === "open")) {
    return {
      ok: false,
      conflict: hit,
      message:
        hit.type === "blocked"
          ? "Overlaps a blocked period. Adjust time or remove the block first."
          : "Overlaps another open slot. Merge or adjust the time range.",
    };
  }
  if (type === "blocked" && (hit.type === "open" || hit.type === "blocked")) {
    return {
      ok: false,
      conflict: hit,
      message: hit.type === "open" ? "Overlaps open availability — remove or shrink the open slot first." : "Overlaps existing block.",
    };
  }
  return { ok: true };
}
