"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";
import { formatClosesIn } from "@/lib/hiring/assessments/liveMonitoringData";
import type { LiveAssessmentSummary } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { cn } from "@/lib/utils";
import { assessmentCardMenuContentClass } from "../assessments/assessmentCardMenu";

export function LiveAssessmentListRow({ summary }: { summary: LiveAssessmentSummary }) {
  const router = useRouter();
  const href = ROUTES.scheduleAssessment(summary.assessmentId);
  const open = () => router.push(href);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className={cn(
        "grid cursor-pointer grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_repeat(4,minmax(0,0.55fr))_minmax(0,0.75fr)_auto] items-center gap-2",
        "border-b border-[rgba(15,23,42,0.05)] px-3 py-2.5 text-[12px] hover:bg-[#FAFAFB] dark:hover:bg-white/[0.02]",
      )}
    >
      <span className="min-w-0 font-semibold text-text">{summary.assessmentName}</span>
      <span className="truncate text-muted">{summary.role}</span>
      <span className="tabular-nums text-right font-medium text-text">{summary.liveCount}</span>
      <span className="tabular-nums text-right text-amber-800 dark:text-amber-300">{summary.idleCount}</span>
      <span className="tabular-nums text-right text-red-700 dark:text-red-400">{summary.flaggedCount}</span>
      <span className="text-[11px] font-medium text-[rgb(var(--accent-rgb))]">
        {formatClosesIn(summary.closesInMinutes)}
      </span>
      <span className="inline-flex w-fit items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/[0.08] px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
        <Radio className="h-3 w-3" strokeWidth={2} aria-hidden />
        Live
      </span>
      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-[10px] p-0">
              <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={assessmentCardMenuContentClass}>
            <DropdownMenuItem className="text-[12px]" onSelect={open}>
              Open live monitor
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[12px]"
              onSelect={() => router.push(`${href}?filter=flagged`)}
            >
              View flagged
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
