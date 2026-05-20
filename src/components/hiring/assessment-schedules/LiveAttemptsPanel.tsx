"use client";

import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LiveAssessmentAttempt } from "@/lib/hiring/assessments/scheduleTypes";
import { hiringCard } from "../hiringTokens";
import { LiveAttemptCard } from "./LiveAttemptCard";

export function LiveAttemptsPanel({
  attempts,
  onViewReport,
  className,
}: {
  attempts: LiveAssessmentAttempt[];
  onViewReport: (scheduleId: string) => void;
  className?: string;
}) {
  if (attempts.length === 0) return null;

  return (
    <section className={cn(hiringCard, "p-4 sm:p-5", className)}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(var(--accent-rgb),0.12)] bg-[rgba(var(--accent-rgb),0.06)]">
          <Radio className="h-4 w-4 text-[rgb(var(--accent-rgb))]" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-text">Live assessment monitoring</h2>
          <p className="text-[12px] text-muted">Real-time operational view of active attempts</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
          {attempts.length} live
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {attempts.map((a) => (
          <LiveAttemptCard key={a.id} attempt={a} onViewReport={() => onViewReport(a.scheduleId)} />
        ))}
      </div>
    </section>
  );
}
