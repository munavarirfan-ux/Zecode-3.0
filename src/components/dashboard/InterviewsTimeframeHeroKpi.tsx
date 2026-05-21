"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hiringHeroGlassKpi } from "@/components/hiring/hiringTokens";
import type { PreviewRole } from "@/config/previewRole";
import {
  buildEvaluatorInterviewTimeframeStats,
  getOrgInterviewTimeframeStats,
  INTERVIEW_TIMEFRAME_OPTIONS,
  persistInterviewTimeframe,
  readStoredInterviewTimeframe,
  type InterviewTimeframe,
} from "@/lib/dashboard/interviewTimeframeKpi";
import { buildInterviewerAssignedInterviews } from "@/lib/hiring/interviewerInterviews";
import { cn } from "@/lib/utils";

type InterviewsTimeframeHeroKpiProps = {
  role: PreviewRole;
  sessionName?: string | null;
};

export function InterviewsTimeframeHeroKpi({ role, sessionName }: InterviewsTimeframeHeroKpiProps) {
  const [timeframe, setTimeframe] = useState<InterviewTimeframe>("today");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeframe(readStoredInterviewTimeframe());
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (role === "evaluator") {
      const rows = buildInterviewerAssignedInterviews(role, sessionName);
      return buildEvaluatorInterviewTimeframeStats(rows);
    }
    return getOrgInterviewTimeframeStats();
  }, [role, sessionName]);

  const active = stats[timeframe];
  const activeLabel = INTERVIEW_TIMEFRAME_OPTIONS.find((o) => o.value === timeframe)?.label ?? "Today";

  const onTimeframeChange = (value: string) => {
    const next = value as InterviewTimeframe;
    setTimeframe(next);
    persistInterviewTimeframe(next);
  };

  return (
    <li className={cn(hiringHeroGlassKpi, "min-w-0")}>
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/[0.06] blur-2xl opacity-60"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.16] bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <Calendar className="h-[18px] w-[18px] text-white/90" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="text-[12px] font-semibold tracking-[-0.01em] text-white/90">Interviews</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className={cn(
              "inline-flex h-6 shrink-0 items-center gap-0.5 rounded-md border border-white/[0.18] bg-white/[0.08] px-1.5",
              "text-[10px] font-medium text-white/85 transition-colors hover:border-white/[0.28] hover:bg-white/[0.12]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-0",
            )}
            aria-label="Interview timeframe"
          >
            <span suppressHydrationWarning>{mounted ? activeLabel : "Today"}</span>
            <ChevronDown className="h-3 w-3 opacity-70" strokeWidth={2} aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[8.5rem]">
            <DropdownMenuRadioGroup value={timeframe} onValueChange={onTimeframeChange}>
              {INTERVIEW_TIMEFRAME_OPTIONS.map(({ value, label }) => (
                <DropdownMenuRadioItem key={value} value={value} className="text-[12px]">
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p
        className="relative mt-5 text-[2.25rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-white sm:text-[2.375rem]"
        suppressHydrationWarning
      >
        {mounted ? active.count : stats.today.count}
      </p>
      <p className="relative mt-3 text-[11px] leading-snug text-white/55" suppressHydrationWarning>
        {mounted ? active.subStat : stats.today.subStat}
      </p>
    </li>
  );
}
