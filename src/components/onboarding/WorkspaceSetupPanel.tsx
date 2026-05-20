"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";
import {
  getNewUserSetupProgress,
  markTeamInviteAcknowledged,
  type SetupTask,
} from "@/lib/onboarding/newUserSetupProgress";
import { cn } from "@/lib/utils";
import { nuxSetupPanel } from "./newUserOnboardingTokens";

function SetupTaskRow({ task, compact }: { task: SetupTask; compact?: boolean }) {
  const isComplete = task.status === "complete";
  const isCurrent = task.status === "current";

  const inner = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[10px] border transition-colors",
          compact ? "h-7 w-7 rounded-[10px]" : "h-9 w-9 rounded-[12px]",
          isComplete &&
            "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400",
          isCurrent && "nux-glow-pulse border-[rgb(var(--accent-rgb)/0.35)] bg-accent/10 text-accent",
          !isComplete &&
            !isCurrent &&
            "border-[rgba(15,23,42,0.06)] bg-black/[0.02] text-muted dark:border-white/[0.06] dark:bg-white/[0.03]",
        )}
      >
        {isComplete ? (
          <Check className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} strokeWidth={2.5} />
        ) : isCurrent ? (
          <ArrowRight className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} strokeWidth={2} />
        ) : (
          <span className="h-2 w-2 rounded-full bg-muted/40" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            compact ? "text-[13px] font-semibold tracking-[-0.02em]" : "text-[14px] font-semibold tracking-[-0.02em]",
            isComplete ? "text-muted line-through decoration-muted/40" : "text-text",
          )}
        >
          {task.label}
        </p>
        {isCurrent && !compact ? (
          <p className="mt-0.5 text-[12px] text-text-secondary/75">{task.hint}</p>
        ) : null}
      </div>
      {isCurrent && task.href && !compact ? (
        <ArrowRight className="h-4 w-4 shrink-0 text-accent opacity-70 transition-transform group-hover:translate-x-0.5" />
      ) : null}
    </>
  );

  const rowClass = cn(
    "group flex w-full items-center gap-2.5 rounded-[12px] text-left transition-colors",
    compact ? "px-2 py-1" : "gap-3 rounded-[14px] px-3 py-2.5",
    isCurrent && "bg-[rgb(var(--accent-rgb)/0.05)]",
    isComplete && "opacity-70",
    task.href && !isComplete && "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]",
  );

  if (task.href && !isComplete) {
    return (
      <Link
        href={task.href}
        className={rowClass}
        onClick={() => {
          if (task.id === "team") markTeamInviteAcknowledged();
        }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={rowClass} aria-current={isCurrent ? "step" : undefined}>
      {inner}
    </div>
  );
}

export function WorkspaceSetupPanel({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { selectedRole } = useRole();
  const workspaceRefresh = useWorkspaceRefresh();
  const progress = useMemo(
    () => getNewUserSetupProgress(selectedRole),
    [selectedRole, workspaceRefresh],
  );

  return (
    <section
      className={cn(
        nuxSetupPanel,
        "nux-fade-up",
        compact ? "h-fit p-2.5 sm:p-3" : "p-5 sm:p-6",
        className,
      )}
      aria-label="Workspace setup"
      style={{ animationDelay: "0.15s" }}
    >
      <div className={cn("flex items-center justify-between gap-2", compact ? "gap-2" : "flex-wrap items-end gap-3")}>
        <div className="min-w-0">
          <h2
            className={cn(
              "font-semibold tracking-[-0.03em] text-text",
              compact ? "text-[15px] leading-tight" : "text-[1.125rem]",
            )}
          >
            Set up your workspace
          </h2>
          <p
            className={cn(
              "text-text-secondary/80",
              compact ? "mt-0.5 text-[11px] leading-tight sm:text-[12px]" : "mt-1 text-[13px]",
            )}
          >
            {progress.completedCount} of {progress.totalCount} complete · ~
            {progress.minutesRemaining} min left
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 font-semibold tabular-nums text-accent",
            compact ? "text-[12px]" : "text-[12px]",
          )}
        >
          {progress.percent}%
        </span>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-full bg-black/[0.05] dark:bg-white/[0.08]",
          compact ? "mt-2 h-1" : "mt-4 h-1.5",
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            progress.percent === 100
              ? "bg-emerald-500/80"
              : "nux-shimmer-bar bg-accent/80",
          )}
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <div className={cn(compact ? "mt-1.5 space-y-0" : "mt-4 space-y-1")}>
        {progress.tasks.map((task) => (
          <SetupTaskRow key={task.id} task={task} compact={compact} />
        ))}
      </div>
    </section>
  );
}
