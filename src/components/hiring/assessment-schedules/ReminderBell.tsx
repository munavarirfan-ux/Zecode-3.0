"use client";

import { Bell, BellOff, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReminderLevel } from "@/lib/hiring/assessments/scheduleTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ReminderBell({
  level,
  remindersSent,
  lastReminderAt,
}: {
  level: ReminderLevel;
  remindersSent: number;
  lastReminderAt: string | null;
}) {
  const Icon = level === "muted" ? BellOff : level === "escalated" ? BellRing : Bell;
  const label =
    remindersSent > 0
      ? `Reminder sent ${remindersSent}x${lastReminderAt ? ` · Last ${lastReminderAt}` : ""}`
      : "No reminders sent";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full border",
            level === "escalated"
              ? "border-violet-400/30 bg-violet-500/10 text-violet-700"
              : level === "active"
                ? "border-amber-400/25 bg-amber-500/10 text-amber-700"
                : "border-[rgba(15,23,42,0.06)] bg-white text-muted",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[11px]">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
