import type { WeekdayKey } from "./types";

const WEEKDAY_LABELS: WeekdayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function startOfWeek(date: Date, weekStartsOnMonday = true): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = weekStartsOnMonday ? (day === 0 ? -6 : 1 - day) : -day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function weekdayFromDate(date: Date): WeekdayKey {
  const js = date.getDay();
  const map: WeekdayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return map[js];
}

export function formatWeekRange(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  const startStr = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startStr} – ${endStr}`;
}

export function isSameWeek(a: Date, b: Date): boolean {
  return toDayKey(startOfWeek(a)) === toDayKey(startOfWeek(b));
}

export function isToday(dayKey: string): boolean {
  return toDayKey(new Date()) === dayKey;
}

export type WeekDayColumn = {
  dayKey: string;
  weekday: WeekdayKey;
  dateNum: number;
  label: string;
};

export function getWeekColumns(weekStart: Date): WeekDayColumn[] {
  return WEEKDAY_LABELS.map((weekday, i) => {
    const d = addDays(weekStart, i);
    return {
      dayKey: toDayKey(d),
      weekday,
      dateNum: d.getDate(),
      label: weekday,
    };
  });
}

export function defaultRepeatUntil(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return toDayKey(d);
}
