"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Download, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePoolStore } from "../store/poolStore";

export function BulkActionBar() {
  const selectedIds = usePoolStore((s) => s.selectedIds);
  const clearSelection = usePoolStore((s) => s.clearSelection);
  const bulkSetStatus = usePoolStore((s) => s.bulkSetStatus);
  const bulkDelete = usePoolStore((s) => s.bulkDelete);

  if (selectedIds.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-[120] mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-[16px]",
        "border border-[rgba(15,23,42,0.08)] bg-white/95 px-4 py-3 shadow-[0_12px_40px_-12px_rgba(26,22,38,0.2)] backdrop-blur-xl",
        "animate-in slide-in-from-bottom-4 fade-in duration-200 dark:border-white/[0.1] dark:bg-[#141416]/95",
      )}
      role="region"
      aria-label="Bulk actions"
    >
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-text">
          <span className="tabular-nums font-semibold text-accent">{selectedIds.length}</span> selected
        </span>
        <button
          type="button"
          onClick={clearSelection}
          className="rounded-[8px] p-1 text-muted hover:bg-[rgba(15,23,42,0.04)] hover:text-text"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => bulkSetStatus("published")}
          className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-3 text-[11px] font-medium hover:bg-[rgba(124,58,237,0.06)]"
        >
          <Upload className="h-3.5 w-3.5" />
          Publish
        </button>
        <button
          type="button"
          onClick={() => bulkSetStatus("draft")}
          className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-3 text-[11px] font-medium hover:bg-[rgba(15,23,42,0.04)]"
        >
          Unpublish
        </button>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-3 text-[11px] font-medium hover:bg-[rgba(15,23,42,0.04)]"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-red-200 bg-red-50 px-3 text-[11px] font-medium text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-[130] bg-[rgba(15,23,42,0.4)] backdrop-blur-[6px]" />
            <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[131] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-surface p-6 shadow-xl">
              <AlertDialog.Title className="text-[15px] font-semibold text-text">
                Delete {selectedIds.length} question{selectedIds.length === 1 ? "" : "s"}?
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-2 text-[13px] text-text-secondary/80">
                This cannot be undone. Questions will be removed from the pool.
              </AlertDialog.Description>
              <div className="mt-6 flex justify-end gap-2">
                <AlertDialog.Cancel className="h-9 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-4 text-[13px] font-medium">
                  Cancel
                </AlertDialog.Cancel>
                <AlertDialog.Action
                  onClick={bulkDelete}
                  className="h-9 rounded-[10px] bg-red-600 px-4 text-[13px] font-medium text-white hover:bg-red-700"
                >
                  Delete
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  );
}
