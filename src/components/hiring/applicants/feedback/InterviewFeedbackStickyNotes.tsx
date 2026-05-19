"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ZeMeetNoteEntry } from "@/lib/zemeet/types";

function formatNoteTime(note: ZeMeetNoteEntry): string {
  if (note.timestampMs !== undefined) {
    const totalSec = Math.floor(note.timestampMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  try {
    return new Date(note.createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function InterviewFeedbackStickyNotes({
  notes,
  onInsert,
  className,
}: {
  notes: ZeMeetNoteEntry[];
  onInsert: (note: ZeMeetNoteEntry) => void;
  className?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col lg:w-[300px] xl:w-[320px]",
        className,
      )}
      aria-label="Interview notes"
    >
      <div className="sticky top-0 flex max-h-[calc(100dvh-8rem)] flex-col rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#FFFBEB]/90 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-amber-900/30 dark:bg-amber-950/20">
        <div className="shrink-0 border-b border-amber-200/60 px-4 py-3 dark:border-amber-900/40">
          <h3 className="text-[13px] font-semibold text-[#78350F] dark:text-amber-100">
            Interview Notes
          </h3>
          <p className="mt-0.5 text-[11px] text-[#92400E]/80 dark:text-amber-200/70">
            Read-only · visible to interviewer & admin
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {notes.length === 0 ? (
            <p className="px-1 py-6 text-center text-[12px] text-[#A16207]/80">
              No notes captured during this session.
            </p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => {
                const selected = selectedId === note.id;
                return (
                  <li key={note.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(note.id)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2.5 text-left shadow-sm transition-colors",
                        "border-amber-200/80 bg-[#FEF9C3] hover:bg-[#FEF08A]/80",
                        "dark:border-amber-800/50 dark:bg-amber-950/40 dark:hover:bg-amber-900/30",
                        selected &&
                          "ring-2 ring-amber-500/40 ring-offset-1 ring-offset-[#FFFBEB] dark:ring-offset-amber-950",
                      )}
                    >
                      <p className="text-[11px] font-semibold tabular-nums text-[#92400E] dark:text-amber-300">
                        {formatNoteTime(note)}
                        {note.label ? (
                          <span className="ml-2 inline-flex items-center gap-0.5 font-medium normal-case text-[#B45309]">
                            <Pin className="h-3 w-3" strokeWidth={2} aria-hidden />
                            {note.label}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-[12px] leading-snug text-[#713F12] dark:text-amber-100/90">
                        {note.body}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-amber-200/60 p-3 dark:border-amber-900/40">
          <button
            type="button"
            disabled={!selectedId}
            onClick={() => {
              const note = notes.find((n) => n.id === selectedId);
              if (note) onInsert(note);
            }}
            className={cn(
              "h-9 w-full rounded-[9px] text-[12px] font-semibold transition-colors",
              selectedId
                ? "bg-[#D97706] text-white hover:bg-[#B45309]"
                : "cursor-not-allowed bg-amber-100 text-amber-400 dark:bg-amber-900/30 dark:text-amber-700",
            )}
          >
            Insert into feedback
          </button>
        </div>
      </div>
    </aside>
  );
}
