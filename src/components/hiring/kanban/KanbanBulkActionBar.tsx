"use client";

import {
  ArrowRight,
  Mail,
  Tag,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type KanbanBulkActionId =
  | "moveToInterview"
  | "sendEmail"
  | "hire"
  | "noHire"
  | "addTags";

type ActionDef = {
  id: KanbanBulkActionId;
  label: string;
  icon: typeof Mail;
  className?: string;
  variant?: "default" | "outline";
};

const ACTIONS: ActionDef[] = [
  { id: "moveToInterview", label: "Move to Interview", icon: ArrowRight, variant: "default" },
  { id: "sendEmail", label: "Send email", icon: Mail, variant: "outline" },
  {
    id: "hire",
    label: "Hire",
    icon: ThumbsUp,
    variant: "outline",
    className:
      "border-emerald-500/35 text-emerald-600 hover:bg-emerald-500/[0.08] hover:text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:bg-emerald-400/10",
  },
  {
    id: "noHire",
    label: "No hire",
    icon: ThumbsDown,
    variant: "outline",
    className:
      "border-red-500/35 text-red-600 hover:bg-red-500/[0.08] hover:text-red-700 dark:border-red-400/30 dark:text-red-400 dark:hover:bg-red-400/10",
  },
  { id: "addTags", label: "Add tags", icon: Tag, variant: "outline" },
];

export function KanbanBulkActionBar({
  count,
  onClear,
  onAction,
  disabledActions = {},
}: {
  count: number;
  onClear: () => void;
  onAction: (action: KanbanBulkActionId) => void;
  disabledActions?: Partial<Record<KanbanBulkActionId, string | boolean>>;
}) {
  const hasSelection = count > 0;
  if (!hasSelection) return null;

  return (
    <div
      className={cn(
        "pointer-events-auto fixed bottom-6 left-1/2 z-[100] flex max-w-[min(100vw-2rem,56rem)] -translate-x-1/2",
        "items-center gap-2 rounded-[12px] border border-border-subtle bg-surface px-3 py-2",
        "shadow-[0_12px_40px_-12px_rgba(15,23,42,0.2)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]",
      )}
      role="toolbar"
      aria-label="Bulk candidate actions"
    >
      <p className="shrink-0 pl-1 text-xs font-semibold tabular-nums text-text">
        {count} selected
      </p>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 shrink-0 gap-1 px-2 text-xs text-muted"
        onClick={onClear}
      >
        <X className="h-3 w-3" strokeWidth={2} />
        Clear
      </Button>

      <span className="h-5 w-px shrink-0 bg-border-subtle" aria-hidden />

      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        {ACTIONS.map(({ id, label, icon: Icon, variant, className }) => {
          const disabledReason = disabledActions[id];
          const disabled = !!disabledReason || !hasSelection;
          return (
            <Button
              key={id}
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 rounded-[8px] px-2.5 text-[11px] font-medium",
                variant === "default" &&
                  "border-transparent bg-accent text-white hover:bg-[rgb(var(--accent-hover-rgb))]",
                className,
              )}
              disabled={disabled}
              title={
                !hasSelection
                  ? "Select candidates first"
                  : typeof disabledReason === "string"
                    ? disabledReason
                    : undefined
              }
              onClick={() => onAction(id)}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
