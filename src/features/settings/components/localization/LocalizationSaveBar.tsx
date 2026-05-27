"use client";

import { cn } from "@/lib/utils";

export function LocalizationSaveBar({
  changeCount,
  onDiscard,
  onSave,
}: {
  changeCount: number;
  onDiscard: () => void;
  onSave: () => void;
}) {
  if (changeCount === 0) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[100] flex h-14 items-center justify-between gap-4 border-t border-[rgba(15,23,42,0.08)]",
        "bg-white/95 px-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#141416]/95",
        "sm:px-6 lg:left-[var(--sidebar-px,0px)]",
      )}
    >
      <span className="text-[12px] font-medium text-text-secondary/85">
        {changeCount} unsaved {changeCount === 1 ? "change" : "changes"}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDiscard}
          className="h-9 rounded-[10px] px-3 text-[12px] font-medium text-text-secondary/85 hover:bg-[rgba(15,23,42,0.04)]"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          className="h-9 rounded-[10px] bg-accent px-5 text-[12px] font-semibold text-white hover:bg-accent-hover"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
