"use client";

import { AlertTriangle, CheckCircle2, Clock, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleInsight } from "@/lib/hiring/assessments/scheduleTypes";

const ICONS = {
  default: Clock,
  warning: AlertTriangle,
  success: CheckCircle2,
  danger: Flag,
} as const;

const TONES = {
  default: "border-[rgba(15,23,42,0.06)] bg-white/90 text-[#3F3F46]",
  warning: "border-amber-400/20 bg-amber-500/[0.06] text-amber-900",
  success: "border-emerald-400/20 bg-emerald-500/[0.06] text-emerald-900",
  danger: "border-violet-400/20 bg-violet-500/[0.06] text-violet-900",
};

export function AssessmentSchedulesInsightStrip({ insights }: { insights: ScheduleInsight[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
      {insights.map((insight) => {
        const Icon = ICONS[insight.tone];
        return (
          <div
            key={insight.id}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-[12px] border px-3 py-2 text-[12px] font-medium backdrop-blur-sm",
              "transition-all duration-200 hover:shadow-sm",
              TONES[insight.tone],
              "dark:bg-surface/80",
            )}
          >
            <Icon className="h-3.5 w-3.5 opacity-70" strokeWidth={1.75} />
            {insight.label}
          </div>
        );
      })}
    </div>
  );
}
