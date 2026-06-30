"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { hiringTransition } from "@/components/hiring/hiringTokens";

export function AutosaveBar({
  dirty,
  lastSavedAt,
  onSaveDraft,
  showBack,
  onBack,
  primaryLabel,
  onPrimary,
  primaryVariant = "continue",
  onPreview,
}: {
  dirty: boolean;
  lastSavedAt: Date | null;
  onSaveDraft: () => void;
  showBack?: boolean;
  onBack?: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryVariant?: "continue" | "publish";
  onPreview?: () => void;
}) {
  const savedLabel = lastSavedAt
    ? `Saved ${formatDistanceToNow(lastSavedAt, { addSuffix: true })}`
    : dirty
      ? "Unsaved changes"
      : "Not saved yet";

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[100] flex h-14 items-center justify-between gap-4 border-t border-[rgba(15,23,42,0.08)]",
        "bg-white/95 px-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#141416]/95",
        "sm:px-6 lg:left-[var(--sidebar-px,0px)]",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            dirty ? "animate-pulse bg-amber-400" : "bg-emerald-500",
          )}
          aria-hidden
        />
        <span className="truncate text-[12px] font-medium text-text-secondary/85">{savedLabel}</span>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "h-9 rounded-[10px] px-3 text-[12px] font-medium text-text-secondary/85",
              "hover:bg-[rgba(15,23,42,0.04)] dark:hover:bg-white/[0.04]",
              hiringTransition,
            )}
          >
            Back
          </button>
        ) : null}
        {onPreview ? (
          <button
            type="button"
            onClick={onPreview}
            className={cn(
              "h-9 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-4 text-[12px] font-medium",
              "hover:bg-[rgba(15,23,42,0.03)] dark:border-white/[0.08]",
              hiringTransition,
            )}
          >
            Preview
          </button>
        ) : null}
        <button
          type="button"
          onClick={onSaveDraft}
          className="h-9 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-4 text-[12px] font-medium hover:bg-[rgba(15,23,42,0.03)]"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onPrimary}
          className={cn(
            "h-9 rounded-[10px] px-5 text-[12px] font-semibold text-white",
            hiringTransition,
            primaryVariant === "publish"
              ? "bg-accent shadow-[0_2px_10px_rgb(var(--accent-rgb)/0.3)] hover:bg-accent-hover"
              : "bg-accent hover:bg-accent-hover",
          )}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
