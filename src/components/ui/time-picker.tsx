"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
type Period = "AM" | "PM";

function formatMinute(mm: number): string {
  if (Number.isNaN(mm)) return "00";
  const clamped = Math.min(59, Math.max(0, Math.round(mm)));
  return String(clamped).padStart(2, "0");
}

export function parseTime24(value: string): { hour: string; minute: string; period: Period } | null {
  if (!value) return null;
  const [hh, mm] = value.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  const period: Period = hh >= 12 ? "PM" : "AM";
  let hour12 = hh % 12;
  if (hour12 === 0) hour12 = 12;
  return {
    hour: String(hour12),
    minute: formatMinute(mm),
    period,
  };
}

export function toTime24(hour12: string, minute: string, period: Period): string {
  const h = Number(hour12);
  const m = Number(minute);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  let hh: number;
  if (period === "AM") {
    hh = h === 12 ? 0 : h;
  } else {
    hh = h === 12 ? 12 : h + 12;
  }
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** 24h `HH:mm` → locale display e.g. "10:30 AM" */
export function formatTime12h(time24: string): string {
  if (!time24) return "";
  const parts = parseTime24(time24);
  if (!parts) return time24;
  return `${parts.hour}:${parts.minute} ${parts.period}`;
}

const segmentTriggerClass =
  "h-9 flex-1 justify-center gap-1 rounded-[10px] border-[rgba(15,23,42,0.08)] bg-surface px-2 text-[13px] font-medium tabular-nums shadow-sm hover:bg-surface focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.35)] focus:ring-offset-0 [&>span]:w-full [&>span]:text-center";

const selectContentClass = "z-[260] min-w-[4.5rem]";
const minuteSelectContentClass = cn(selectContentClass, "max-h-[220px]");

export type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
};

export function TimePicker({
  value,
  onChange,
  disabled,
  placeholder = "Select time",
  className,
  id,
}: TimePickerProps) {
  const parsed = parseTime24(value);
  const [hour, setHour] = React.useState(parsed?.hour ?? "");
  const [minute, setMinute] = React.useState(parsed?.minute ?? "");
  const [period, setPeriod] = React.useState<Period>(parsed?.period ?? "AM");

  React.useEffect(() => {
    const next = parseTime24(value);
    if (next) {
      setHour(next.hour);
      setMinute(next.minute);
      setPeriod(next.period);
    } else if (!value) {
      setHour("");
      setMinute("");
      setPeriod("AM");
    }
  }, [value]);

  const emit = React.useCallback(
    (h: string, m: string, p: Period) => {
      if (!h || !m) {
        onChange("");
        return;
      }
      onChange(toTime24(h, m, p));
    },
    [onChange],
  );

  return (
    <div
      id={id}
      role="group"
      aria-label={placeholder}
      className={cn("flex w-full items-stretch gap-2", disabled && "pointer-events-none opacity-50", className)}
    >
      <Select
        value={hour || undefined}
        onValueChange={(h) => {
          setHour(h);
          emit(h, minute, period);
        }}
        disabled={disabled}
      >
        <SelectTrigger className={segmentTriggerClass} aria-label="Hour">
          <SelectValue placeholder="Hr" />
        </SelectTrigger>
        <SelectContent className={selectContentClass} position="popper">
          {HOURS.map((h) => (
            <SelectItem key={h} value={h} className="justify-center py-2 text-[13px] tabular-nums">
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={minute || undefined}
        onValueChange={(m) => {
          setMinute(m);
          emit(hour, m, period);
        }}
        disabled={disabled}
      >
        <SelectTrigger className={segmentTriggerClass} aria-label="Minute">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className={minuteSelectContentClass} position="popper">
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m} className="justify-center py-2 text-[13px] tabular-nums">
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div
        className="flex h-9 flex-1 shrink-0 overflow-hidden rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-surface p-0.5 shadow-sm"
        role="group"
        aria-label="AM or PM"
      >
        {(["AM", "PM"] as const).map((p) => {
          const active = period === p;
          return (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => {
                setPeriod(p);
                emit(hour, minute, p);
              }}
              className={cn(
                "flex flex-1 items-center justify-center rounded-[8px] text-[12px] font-semibold tracking-wide transition-colors duration-[180ms] ease-out",
                active
                  ? "bg-[rgb(var(--accent-rgb))] text-white shadow-sm"
                  : "text-muted hover:text-text",
              )}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
