"use client";

import {
  Camera,
  Maximize2,
  Monitor,
  Timer,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LiveAssessmentAttempt } from "@/lib/hiring/assessments/scheduleTypes";
import { toast } from "sonner";
import { hiringTransition } from "../hiringTokens";

export function LiveAttemptCard({
  attempt,
  onViewReport,
}: {
  attempt: LiveAssessmentAttempt;
  onViewReport: () => void;
}) {
  const WifiStatusIcon = attempt.internetStability === "Stable" ? Wifi : WifiOff;
  const wifiTone =
    attempt.internetStability === "Stable"
      ? "text-emerald-600"
      : attempt.internetStability === "Unstable"
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div
      className={cn(
        "rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white p-4",
        "shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:border-[rgba(var(--accent-rgb),0.15)] hover:shadow-md",
        "dark:border-white/[0.06] dark:bg-surface",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold tracking-[-0.02em] text-text">{attempt.candidateName}</p>
          <p className="truncate text-[12px] text-muted">{attempt.assessmentName}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
          Live
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] text-text-secondary">
        <span className="font-medium text-muted">Question · </span>
        {attempt.currentQuestion}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 rounded-[8px] bg-[#FAFAFB] px-2 py-1.5 dark:bg-white/[0.03]">
          <Timer className="h-3 w-3 text-[rgb(var(--accent-rgb))]" strokeWidth={1.75} />
          <span className="font-semibold tabular-nums text-text">{attempt.remainingMinutes}m left</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-[8px] bg-[#FAFAFB] px-2 py-1.5 dark:bg-white/[0.03]">
          <WifiStatusIcon className={cn("h-3 w-3", wifiTone)} strokeWidth={1.75} />
          {attempt.internetStability}
        </div>
        <div className="flex items-center gap-1.5 rounded-[8px] bg-[#FAFAFB] px-2 py-1.5 dark:bg-white/[0.03]">
          <Monitor className="h-3 w-3 text-muted" strokeWidth={1.75} />
          {attempt.tabSwitchCount} tab switches
        </div>
        <div className="flex items-center gap-1.5 rounded-[8px] bg-[#FAFAFB] px-2 py-1.5 dark:bg-white/[0.03]">
          <Camera className="h-3 w-3 text-muted" strokeWidth={1.75} />
          Camera {attempt.cameraStatus}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-[11px] text-muted">
        <Maximize2 className="h-3 w-3" strokeWidth={1.75} />
        Fullscreen {attempt.fullscreen ? "on" : "off"}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Send warning", "Extend time", "Pause", "Terminate", "Snapshots"].map((action) => (
          <Button
            key={action}
            type="button"
            variant="outline"
            size="sm"
            className={cn("h-7 rounded-[8px] px-2 text-[10px] font-medium", hiringTransition)}
            onClick={() => toast.message(`${action} (demo)`)}
          >
            {action}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          className="ml-auto h-7 rounded-[8px] bg-accent px-2.5 text-[10px] text-white hover:bg-accent-hover"
          onClick={onViewReport}
        >
          View report
        </Button>
      </div>
    </div>
  );
}
