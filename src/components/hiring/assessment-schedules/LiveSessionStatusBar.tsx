"use client";

import { Radio, RefreshCw } from "lucide-react";
import { formatClosesIn } from "@/lib/hiring/assessments/liveMonitoringData";
import type { LiveCandidateSession } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { cn } from "@/lib/utils";

export function LiveSessionStatusBar({
  session,
  lastUpdated,
}: {
  session: LiveCandidateSession;
  lastUpdated: Date;
}) {
  const updatedLabel = lastUpdated.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-emerald-500/18",
        "bg-gradient-to-r from-emerald-500/[0.07] to-transparent px-4 py-3",
      )}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <Radio className="h-3 w-3" strokeWidth={2} aria-hidden />
          Live session
        </span>
        <span className="text-[12px] font-medium text-text">
          Question {session.currentQuestion} of {session.totalQuestions}
        </span>
        <span className="text-[12px] text-muted">·</span>
        <span className="text-[12px] font-medium tabular-nums text-text">
          {formatClosesIn(session.remainingMinutes)} remaining
        </span>
        <span className="text-[12px] text-muted">·</span>
        <span className="text-[12px] tabular-nums text-text-secondary">{session.progressPercent}% complete</span>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted">
        <RefreshCw className="h-3 w-3 animate-spin [animation-duration:3s]" strokeWidth={2} aria-hidden />
        Updated {updatedLabel}
      </span>
    </div>
  );
}
