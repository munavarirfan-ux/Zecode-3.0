"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScheduleCalendarEvent } from "@/lib/hiring/assessments/scheduleTypes";
import { hiringCard, hiringTransition } from "../hiringTokens";

const KIND_STYLES: Record<ScheduleCalendarEvent["kind"], string> = {
  scheduled: "border-violet-400/30 bg-violet-500/15 text-violet-900",
  ongoing: "border-amber-400/30 bg-amber-500/15 text-amber-900",
  completed: "border-emerald-400/30 bg-emerald-500/15 text-emerald-900",
  expired: "border-red-400/30 bg-red-500/15 text-red-900",
  malpractice: "border-orange-400/35 bg-orange-500/15 text-orange-900",
};

const WEEK_START = new Date(2026, 4, 18);

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatDay(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function AssessmentScheduleCalendarView({
  events,
  onSelectEvent,
}: {
  events: ScheduleCalendarEvent[];
  onSelectEvent: (event: ScheduleCalendarEvent) => void;
}) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDays = useMemo(() => {
    const start = addDays(WEEK_START, weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(start, i);
      return { date: isoDate(d), label: formatDay(d) };
    });
  }, [weekOffset]);

  const weekLabel = `${weekDays[0]?.label} – ${weekDays[6]?.label}`;

  const byDay = useMemo(() => {
    const map = new Map<string, ScheduleCalendarEvent[]>();
    weekDays.forEach((d) => map.set(d.date, []));
    events.forEach((e) => {
      if (map.has(e.date)) map.get(e.date)!.push(e);
    });
    return map;
  }, [events, weekDays]);

  return (
    <div className={cn(hiringCard, "overflow-hidden")}>
      <div className="flex items-center justify-between border-b border-[rgba(15,23,42,0.06)] px-4 py-3">
        <Button type="button" variant="outline" size="sm" className="h-8 w-8 rounded-[9px] p-0" onClick={() => setWeekOffset((w) => w - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-[13px] font-semibold tracking-[-0.02em] text-text">{weekLabel}</p>
        <Button type="button" variant="outline" size="sm" className="h-8 w-8 rounded-[9px] p-0" onClick={() => setWeekOffset((w) => w + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 border-b border-[rgba(15,23,42,0.06)] bg-[#FAFAFB]/80 px-3 py-2 dark:bg-white/[0.02]">
        {(
          [
            { label: "Scheduled", dot: "bg-violet-500" },
            { label: "Ongoing", dot: "bg-amber-500" },
            { label: "Completed", dot: "bg-emerald-500" },
            { label: "Expired", dot: "bg-red-500" },
            { label: "Malpractice", dot: "bg-orange-500" },
          ] as const
        ).map(({ label, dot }) => (
          <span key={label} className="flex items-center gap-1 text-[10px] font-medium text-muted">
            <span className={cn("h-2 w-2 rounded-full", dot)} />
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 divide-x divide-[rgba(15,23,42,0.05)] dark:divide-white/[0.05]">
        {weekDays.map((day) => (
          <div key={day.date} className="min-h-[320px] p-2">
            <p className="mb-2 text-center text-[11px] font-semibold text-text-secondary">{day.label.split(",")[0]}</p>
            <p className="mb-2 text-center text-[10px] tabular-nums text-muted">{day.label.split(" ").slice(1).join(" ")}</p>
            <div className="space-y-1.5">
              {(byDay.get(day.date) ?? []).map((evt) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => onSelectEvent(evt)}
                  className={cn(
                    "w-full rounded-[8px] border px-2 py-1.5 text-left text-[10px] font-medium leading-snug",
                    hiringTransition,
                    "hover:scale-[1.02] hover:shadow-sm active:scale-[0.99]",
                    KIND_STYLES[evt.kind],
                  )}
                >
                  <span className="block truncate font-semibold">{evt.title}</span>
                  <span className="block truncate opacity-80">{evt.subtitle}</span>
                  <span className="mt-0.5 block tabular-nums opacity-70">
                    {evt.startHour}:00 · {evt.durationHours}h
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
