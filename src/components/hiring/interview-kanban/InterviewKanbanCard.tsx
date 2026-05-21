"use client";

import { useRef } from "react";
import {
  Calendar,
  ChevronDown,
  GripVertical,
  MessageSquarePlus,
  MoveRight,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  hasScheduledInterviewActions,
  type InterviewCardAction,
  type InterviewKanbanCardModel,
} from "@/lib/hiring/interviewKanbanOps";
import { cn } from "@/lib/utils";
import { InterviewStatusChip } from "./InterviewStatusChip";

const ACTION_LABELS = {
  schedule: "Schedule Interview",
  join: "Join interview",
  view: "View Schedule",
  reschedule: "Reschedule",
  cancel: "Cancel interview",
  "request-feedback": "Request feedback",
  "move-next": "Move to next stage",
  "add-note": "Add internal note",
  reject: "Reject candidate",
} as const;

const menuItemClass =
  "flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 text-[12px] font-medium outline-none";

export function InterviewKanbanCard({
  model,
  draggable,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick,
  onAction,
}: {
  model: InterviewKanbanCardModel;
  draggable: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onClick: () => void;
  onAction?: (model: InterviewKanbanCardModel, action: InterviewCardAction) => void;
}) {
  const { candidate, status, roundTitle } = model;
  const suppressClickRef = useRef(false);
  const showScheduledActions = hasScheduledInterviewActions(status);

  function triggerAction(action: InterviewCardAction) {
    if (onAction) {
      onAction(model, action);
      return;
    }
    toast.message(ACTION_LABELS[action], { description: `${candidate.name} · ${roundTitle}` });
  }

  function handleAction(e: React.MouseEvent, action: InterviewCardAction) {
    e.stopPropagation();
    triggerAction(action);
  }

  return (
    <article
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/candidate-id", candidate.id);
        e.dataTransfer.effectAllowed = "move";
        suppressClickRef.current = true;
        onDragStart();
      }}
      onDragEnd={() => {
        onDragEnd();
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (suppressClickRef.current) return;
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative rounded-[12px] border border-[rgba(15,23,42,0.07)] bg-white/90 p-3 text-left backdrop-blur-sm",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_-10px_rgba(15,23,42,0.1)]",
        "transition-[border-color,box-shadow,transform] duration-200 ease-out",
        "hover:-translate-y-px hover:border-[rgb(var(--accent-rgb)/0.18)]",
        "hover:shadow-[0_2px_8px_rgba(15,23,42,0.05),0_16px_32px_-12px_rgba(15,23,42,0.12),0_0_0_1px_rgb(var(--accent-rgb)/0.06)]",
        "dark:border-white/[0.08] dark:bg-[rgb(var(--surface-rgb)/0.92)]",
        "dark:hover:border-[rgb(var(--accent-rgb)/0.22)]",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDragging &&
          "z-10 scale-[1.01] border-[rgb(var(--accent-rgb)/0.25)] opacity-95 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.2),0_0_0_2px_rgb(var(--accent-rgb)/0.12)]",
      )}
      aria-label={`${candidate.name}, ${status}, ${roundTitle}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[12px] opacity-[0.9] [background-image:linear-gradient(135deg,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.35)_38%,rgba(255,255,255,0.75)_100%)] dark:opacity-[0.22] dark:[background-image:linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_38%,rgba(255,255,255,0.05)_100%)]"
        aria-hidden
      />
      <div className="flex items-start gap-2">
        {draggable ? (
          <GripVertical
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-70"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
        <div className="relative min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-text">
                {candidate.name}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">{candidate.source}</p>
            </div>
            <InterviewStatusChip status={status} />
          </div>

          {showScheduledActions ? (
            <div className="flex w-full pt-0.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => handleAction(e, model.primaryAction === "join" ? "join" : "view")}
                className={cn(
                  "inline-flex h-8 min-w-0 flex-1 items-center justify-center rounded-l-[9px] border px-2 text-[11px] font-semibold",
                  "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.25)]",
                  // Theme-driven primary surface (works for purple/orange/blue)
                  "border-[rgb(var(--accent-rgb)/0.22)] bg-[rgb(var(--accent-rgb)/0.12)] text-[rgb(var(--accent-rgb))]",
                  "hover:bg-[rgb(var(--accent-rgb)/0.16)]",
                )}
              >
                {ACTION_LABELS[model.primaryAction === "join" ? "join" : "view"]}
              </button>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="More interview actions"
                    className={cn(
                      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-r-[9px] border border-l-[rgb(var(--accent-rgb)/0.18)]",
                      "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.25)]",
                      "border-[rgb(var(--accent-rgb)/0.22)] bg-[rgb(var(--accent-rgb)/0.12)] text-[rgb(var(--accent-rgb))]",
                      "hover:bg-[rgb(var(--accent-rgb)/0.16)]",
                    )}
                  >
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className={cn(
                    "z-[210] w-56 rounded-[12px] border border-[rgba(15,23,42,0.08)]",
                    "bg-white/75 p-1 shadow-[0_16px_48px_-18px_rgba(15,23,42,0.35)] backdrop-blur-md",
                    "dark:border-white/[0.10] dark:bg-surface/70",
                  )}
                >
                  <DropdownMenuItem
                    className={cn(menuItemClass, "hover:bg-[rgba(59,130,246,0.10)]")}
                    onSelect={() => triggerAction("reschedule")}
                  >
                    <Calendar className="h-3.5 w-3.5 opacity-75" strokeWidth={2} aria-hidden />
                    Reschedule interview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(menuItemClass, "hover:bg-red-500/10 text-red-700 dark:text-red-300")}
                    onSelect={() => triggerAction("cancel")}
                  >
                    <UserX className="h-3.5 w-3.5 opacity-75" strokeWidth={2} aria-hidden />
                    Cancel interview
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex w-full gap-2 pt-0.5">
              <Button
                type="button"
                size="sm"
                variant="default"
                className={cn(
                  "h-8 w-full rounded-[9px] text-[11px] font-semibold",
                  // Theme-driven primary CTA with subtle glow
                  "shadow-[0_8px_20px_-10px_rgb(var(--accent-rgb)/0.55),0_0_0_1px_rgb(var(--accent-rgb)/0.12)]",
                )}
                onClick={(e) => handleAction(e, model.primaryAction as any)}
              >
                {ACTION_LABELS[model.primaryAction]}
              </Button>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 shrink-0 rounded-[9px] px-0"
                    aria-label="Candidate actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className={cn(
                    "z-[210] w-56 rounded-[12px] border border-[rgba(15,23,42,0.08)]",
                    "bg-white/75 p-1 shadow-[0_16px_48px_-18px_rgba(15,23,42,0.35)] backdrop-blur-md",
                    "dark:border-white/[0.10] dark:bg-surface/70",
                  )}
                >
                  <DropdownMenuItem
                    className={cn(menuItemClass, "hover:bg-[rgb(var(--accent-rgb)/0.10)]")}
                    onSelect={() => triggerAction("move-next")}
                  >
                    <MoveRight className="h-3.5 w-3.5 opacity-75" strokeWidth={2} aria-hidden />
                    Move to next stage
                  </DropdownMenuItem>
                  {status !== "Pending" ? (
                    <DropdownMenuItem
                      className={cn(menuItemClass, "hover:bg-[rgba(59,130,246,0.10)]")}
                      onSelect={() => triggerAction("reschedule")}
                    >
                      <Calendar className="h-3.5 w-3.5 opacity-75" strokeWidth={2} aria-hidden />
                      Reschedule interview
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem
                    className={cn(menuItemClass, "hover:bg-[rgba(15,23,42,0.04)]")}
                    onSelect={() => triggerAction("add-note")}
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5 opacity-75" strokeWidth={2} aria-hidden />
                    Add internal note
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(menuItemClass, "hover:bg-red-500/10 text-red-700 dark:text-red-300")}
                    onSelect={() => triggerAction("reject")}
                  >
                    <UserX className="h-3.5 w-3.5 opacity-75" strokeWidth={2} aria-hidden />
                    Reject candidate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
