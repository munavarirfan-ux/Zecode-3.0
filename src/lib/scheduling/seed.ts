import { startOfWeek, toDayKey, addDays } from "./week";
import type { ScheduleSlot } from "./types";

function dayOffset(base: Date, offset: number): string {
  return toDayKey(addDays(base, offset));
}

export function buildInitialScheduleSeed(weekStart = startOfWeek(new Date())): {
  slots: ScheduleSlot[];
} {
  const mon = dayOffset(weekStart, 0);
  const tue = dayOffset(weekStart, 1);
  const wed = dayOffset(weekStart, 2);
  const thu = dayOffset(weekStart, 3);
  const fri = dayOffset(weekStart, 4);

  const slots: ScheduleSlot[] = [
    {
      id: "bk-1",
      type: "booked",
      dayKey: tue,
      startMinutes: 10 * 60 + 30,
      endMinutes: 11 * 60 + 30,
      candidateName: "Sarah Jenkins",
      roundName: "Technical Round 2",
      interviewId: "int-sj-1",
    },
    {
      id: "bk-2",
      type: "booked",
      dayKey: tue,
      startMinutes: 14 * 60,
      endMinutes: 14 * 60 + 45,
      candidateName: "Oliver Grant",
      roundName: "Portfolio review",
      interviewId: "int-og-1",
    },
    {
      id: "op-1",
      type: "open",
      dayKey: mon,
      startMinutes: 10 * 60,
      endMinutes: 12 * 60,
    },
    {
      id: "op-2",
      type: "open",
      dayKey: wed,
      startMinutes: 14 * 60,
      endMinutes: 17 * 60,
    },
    {
      id: "bl-1",
      type: "blocked",
      dayKey: tue,
      startMinutes: 16 * 60,
      endMinutes: 17 * 60,
      reason: "Team sync",
    },
    {
      id: "bl-2",
      type: "blocked",
      dayKey: thu,
      startMinutes: 9 * 60,
      endMinutes: 10 * 60,
      reason: "Focus block",
    },
    {
      id: "op-3",
      type: "open",
      dayKey: thu,
      startMinutes: 10 * 60,
      endMinutes: 11 * 60,
    },
    {
      id: "bk-3",
      type: "booked",
      dayKey: thu,
      startMinutes: 15 * 60,
      endMinutes: 16 * 60 + 30,
      candidateName: "Morgen Hill",
      roundName: "System design",
      interviewId: "int-mh-1",
    },
    {
      id: "bk-4",
      type: "booked",
      dayKey: fri,
      startMinutes: 11 * 60,
      endMinutes: 12 * 60,
      candidateName: "Jamie Fox",
      roundName: "Technical Round 1",
      interviewId: "int-jf-1",
    },
    {
      id: "op-4",
      type: "open",
      dayKey: fri,
      startMinutes: 13 * 60,
      endMinutes: 16 * 60,
    },
  ];

  return { slots };
}

export const SEED_SCHEDULE_SLOT_IDS = new Set(
  buildInitialScheduleSeed().slots.map((s) => s.id),
);
