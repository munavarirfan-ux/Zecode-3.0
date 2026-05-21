"use client";

import { useEffect } from "react";
import { Pin, StickyNote, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ZeMeetNoteEntry } from "@/lib/zemeet/types";
import { formatSessionNoteTime, heroStickyNote } from "./feedbackWorkspaceTokens";

function BoardStickyCard({ note, index }: { note: ZeMeetNoteEntry; index: number }) {
  const tilts = [-1.5, 1.2, -0.8, 1.6, -1.1, 0.9];
  const tilt = tilts[index % tilts.length];

  return (
    <article
      className="relative w-full transition-transform duration-200"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span
        className="absolute -top-2 left-1/2 z-10 h-3 w-9 -translate-x-1/2 rounded-sm bg-amber-200/95 shadow-sm"
        aria-hidden
      />
      <div className={cn(heroStickyNote(false), "min-h-[88px] w-full shadow-[3px_6px_18px_rgba(15,23,42,0.1)]")}>
        <p className="text-[11px] font-semibold tabular-nums text-[#92400E]">
          {formatSessionNoteTime(note)}
          {note.label ? (
            <span className="ml-1.5 inline-flex items-center gap-0.5 font-medium normal-case text-[#B45309]">
              <Pin className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
              {note.label}
            </span>
          ) : null}
        </p>
        <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-snug text-[#713F12]">{note.body}</p>
      </div>
    </article>
  );
}

export function SessionNotesBoard({
  notes,
  onClose,
}: {
  notes: ZeMeetNoteEntry[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col overflow-hidden rounded-[20px] border border-[rgba(15,23,42,0.08)]",
        "bg-[#FFFBEB] shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)]",
        "max-h-[min(900px,calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))]",
        "lg:w-[380px] lg:max-w-[38vw]",
        "animate-radix-in",
      )}
      role="complementary"
      aria-label="Session notes board"
    >
      <header className="flex shrink-0 items-center gap-2 border-b border-amber-200/70 bg-[#FEF9C3]/90 px-4 py-3.5">
        <StickyNote className="h-4 w-4 text-[#B45309]" strokeWidth={1.75} aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-[#78350F]">Session notes</h2>
          <p className="text-[11px] text-[#92400E]/75">
            {notes.length} {notes.length === 1 ? "sticky" : "stickies"} from the interview · Esc to close
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#92400E]/80 transition-colors hover:bg-amber-200/50 hover:text-[#78350F]"
          aria-label="Close notes board"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {notes.length === 0 ? (
          <p className="py-12 text-center text-[13px] text-[#92400E]/70">No session notes captured.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note, index) => (
              <BoardStickyCard key={note.id} note={note} index={index} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
