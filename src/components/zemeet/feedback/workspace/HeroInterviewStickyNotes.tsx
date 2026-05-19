"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ZeMeetNoteEntry } from "@/lib/zemeet/types";
import { formatSessionNoteTime, heroStickyNote } from "./feedbackWorkspaceTokens";

const STICKY_OFFSETS = [
  { rotate: -2.5, x: 0, y: 0 },
  { rotate: 2.2, x: -10, y: -8 },
  { rotate: -1.2, x: -18, y: -14 },
  { rotate: 1.8, x: -26, y: -20 },
] as const;

const MAX_VISIBLE = 4;

export function HeroInterviewStickyNotes({
  notes,
  onInsert,
}: {
  notes: ZeMeetNoteEntry[];
  onInsert?: (note: ZeMeetNoteEntry) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visible = notes.slice(0, MAX_VISIBLE);
  const overflow = notes.length - visible.length;
  const stackHeight = 56 + Math.max(0, visible.length - 1) * 36;

  if (notes.length === 0) {
    return (
      <div
        className="pointer-events-none absolute bottom-4 right-4 z-20 sm:bottom-5 sm:right-6 lg:right-8"
        aria-hidden
      >
        <div
          className={cn(heroStickyNote(false), "w-[148px] rotate-[2deg] opacity-40")}
          style={{ boxShadow: "4px 6px 18px rgba(15,23,42,0.12)" }}
        >
          <p className="text-[10px] font-semibold tabular-nums text-[#92400E]/70">—</p>
          <p className="mt-1 text-[11px] leading-snug text-[#92400E]/60">No session notes</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute bottom-3 right-3 z-20 sm:bottom-4 sm:right-5 lg:right-7"
      aria-label="Interview notes from session"
    >
      <div className="relative w-[200px]" style={{ height: stackHeight }}>
        {visible.map((note, index) => {
          const offset = STICKY_OFFSETS[index % STICKY_OFFSETS.length];
          const selected = selectedId === note.id;

          return (
            <button
              key={note.id}
              type="button"
              onClick={() => {
                if (onInsert && selected) {
                  onInsert(note);
                  setSelectedId(null);
                } else {
                  setSelectedId(note.id);
                }
              }}
              className={cn(
                heroStickyNote(selected),
                "absolute bottom-0 right-0 w-[168px]",
                "origin-bottom-right transition-[transform,box-shadow] duration-200",
              )}
              style={{
                transform: `rotate(${offset.rotate}deg) translate(${offset.x}px, ${offset.y}px)`,
                zIndex: 10 + index,
                boxShadow: selected
                  ? "6px 10px 28px rgba(15,23,42,0.18), 0 0 0 2px rgba(217,119,6,0.35)"
                  : "4px 8px 22px rgba(15,23,42,0.14), 2px 2px 0 rgba(15,23,42,0.04)",
              }}
              aria-pressed={selected}
            >
              <span
                className="absolute -top-2 left-1/2 h-3 w-8 -translate-x-1/2 rounded-sm bg-amber-200/90 shadow-sm"
                aria-hidden
              />
              <p className="text-[11px] font-semibold tabular-nums text-[#92400E]">
                {formatSessionNoteTime(note)}
                {note.label ? (
                  <Pin className="ml-1 inline h-2.5 w-2.5" strokeWidth={2} aria-hidden />
                ) : null}
              </p>
              <p className="mt-1 line-clamp-3 text-left text-[12px] leading-snug text-[#713F12]">
                {note.body}
              </p>
              {selected && onInsert ? (
                <span className="mt-2 block text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
                  Tap again to insert
                </span>
              ) : null}
            </button>
          );
        })}

        {overflow > 0 ? (
          <span
            className={cn(
              "absolute bottom-1 right-0 z-40",
              "rounded-full border border-amber-300/80 bg-[#FEF9C3] px-2 py-0.5",
              "text-[10px] font-semibold text-[#92400E] shadow-sm",
            )}
            style={{ transform: "rotate(3deg)" }}
          >
            +{overflow} more
          </span>
        ) : null}
      </div>
    </div>
  );
}
