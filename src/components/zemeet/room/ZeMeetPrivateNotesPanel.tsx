"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Lock, Pin, StickyNote } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { formatSessionNoteTime } from "@/components/zemeet/feedback/workspace/feedbackWorkspaceTokens";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import type { ZeMeetNoteEntry } from "@/lib/zemeet/types";
import { cn } from "@/lib/utils";

const RULED_LINE_PX = 28;

function ruledSurfaceStyle(isLight: boolean): React.CSSProperties {
  const lineColor = isLight ? "rgba(217, 119, 6, 0.16)" : "rgba(251, 191, 36, 0.12)";
  return {
    backgroundColor: isLight ? "#FFFDF7" : "#14110d",
    backgroundImage: `repeating-linear-gradient(
      transparent,
      transparent ${RULED_LINE_PX - 1}px,
      ${lineColor} ${RULED_LINE_PX - 1}px,
      ${lineColor} ${RULED_LINE_PX}px
    )`,
  };
}

function meetStickyNote(isLight: boolean, selected = false) {
  return cn(
    "pointer-events-auto rounded-sm border px-3 py-2.5 text-left",
    isLight
      ? "border-amber-200/90 bg-[var(--zemeet-sticky-bg)]"
      : "border-amber-700/45 bg-[var(--zemeet-sticky-bg)] shadow-[inset_0_1px_0_rgba(251,191,36,0.06)]",
    selected &&
      (isLight
        ? "ring-2 ring-amber-500/40 ring-offset-2 ring-offset-[var(--zemeet-sticky-bg)]"
        : "ring-2 ring-amber-500/35 ring-offset-2 ring-offset-[var(--zemeet-sticky-bg)]"),
  );
}

function StickyNoteCard({
  note,
  index,
  isLight,
}: {
  note: ZeMeetNoteEntry;
  index: number;
  isLight: boolean;
}) {
  const tilt = index % 3 === 0 ? -1.2 : index % 3 === 1 ? 1.4 : -0.6;

  return (
    <li className="relative" style={{ transform: `rotate(${tilt}deg)` }}>
      <span
        className={cn(
          "absolute -top-2 left-1/2 z-10 h-3 w-9 -translate-x-1/2 rounded-sm shadow-sm",
          isLight ? "bg-amber-200/95" : "bg-amber-700/80",
        )}
        aria-hidden
      />
      <article
        className={cn(
          meetStickyNote(isLight),
          "w-full",
          isLight ? "shadow-[3px_5px_18px_rgba(15,23,42,0.1)]" : "shadow-[3px_6px_20px_rgba(0,0,0,0.35)]",
        )}
      >
        <p
          className={cn(
            "text-[11px] font-semibold tabular-nums",
            isLight ? "text-[#92400E]" : "text-amber-200/90",
          )}
        >
          {formatSessionNoteTime(note)}
          {note.label ? (
            <span
              className={cn(
                "ml-1.5 inline-flex items-center gap-0.5 font-medium normal-case",
                isLight ? "text-[#B45309]" : "text-amber-300/90",
              )}
            >
              <Pin className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
              {note.label}
            </span>
          ) : null}
        </p>
        <p
          className={cn(
            "mt-1.5 whitespace-pre-wrap text-[13px] leading-snug",
            isLight ? "text-[#713F12]" : "text-[var(--zemeet-sticky-text)]",
          )}
        >
          {note.body}
        </p>
      </article>
    </li>
  );
}

export function ZeMeetPrivateNotesPanel() {
  const { notes, addNote } = useZeMeet();
  const t = useZeMeetTokens();
  const isLight = t.isLight;
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const ruledStyle = useMemo(() => ruledSurfaceStyle(isLight), [isLight]);

  const commitSticky = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    addNote(text);
    setDraft("");
    textareaRef.current?.focus();
  }, [addNote, draft]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    if (e.shiftKey) return;
    e.preventDefault();
    commitSticky();
  };

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        isLight ? "bg-[#FFFBEB]" : "bg-[#100e0b]",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b px-4 py-2.5",
          isLight
            ? "border-amber-200/70 bg-[#FEF9C3]/80"
            : "border-amber-900/50 bg-amber-950/35",
        )}
      >
        <StickyNote
          className={cn("h-4 w-4", isLight ? "text-[#B45309]" : "text-amber-400/90")}
          strokeWidth={1.75}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className={cn("text-[13px] font-semibold", isLight ? "text-[#78350F]" : "text-amber-100/95")}>
            Private notes
          </p>
          <p className={cn("text-[10px]", isLight ? "text-[#92400E]/75" : "text-amber-200/55")}>
            Interviewer only · syncs to feedback
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
            isLight
              ? "border-amber-300/60 bg-amber-100/80 text-[#92400E]"
              : "border-amber-800/50 bg-amber-950/50 text-amber-200/80",
          )}
        >
          <Lock className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          Hidden
        </span>
      </div>

      <div
        className={cn(
          "flex shrink-0 flex-col border-b",
          isLight ? "border-amber-200/60" : "border-amber-900/40",
        )}
      >
        <div className="relative min-h-[200px] flex-1 overflow-hidden" style={ruledStyle}>
          <div
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 top-0 w-[3px]",
              isLight ? "bg-red-400/35" : "bg-red-400/25",
            )}
            aria-hidden
          />
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write on the pad… each sticky saves a moment from the interview."
            rows={7}
            className={cn(
              "relative z-[1] block w-full resize-none border-0 bg-transparent",
              "pl-6 pr-4 pt-2",
              "text-[14px] focus:outline-none focus:ring-0",
              isLight
                ? "text-[#422006] placeholder:text-[#92400E]/35"
                : "text-amber-50/90 placeholder:text-amber-200/30",
            )}
            style={{ lineHeight: `${RULED_LINE_PX}px` }}
            aria-label="Ruled note pad"
          />
        </div>
        <p
          className={cn(
            "border-t px-3 py-2 text-[10px]",
            isLight
              ? "border-amber-200/50 bg-[#FEF9C3]/50 text-[#92400E]/55"
              : "border-amber-900/35 bg-amber-950/25 text-amber-200/45",
          )}
        >
          Enter to add sticky · Shift+Enter for new line
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <p
          className={cn(
            "shrink-0 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em]",
            isLight ? "text-[#92400E]/70" : "text-amber-300/45",
          )}
        >
          Session stickies ({notes.length})
        </p>
        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-4 pt-1">
          {notes.length === 0 ? (
            <li className="px-2 py-8 text-center">
              <div
                className={cn(meetStickyNote(isLight), "mx-auto w-[160px] rotate-[2deg] opacity-50")}
                style={{
                  boxShadow: isLight
                    ? "3px 5px 14px rgba(15,23,42,0.08)"
                    : "3px 6px 16px rgba(0,0,0,0.3)",
                }}
              >
                <p
                  className={cn(
                    "text-[11px] font-semibold",
                    isLight ? "text-[#92400E]/70" : "text-amber-200/50",
                  )}
                >
                  No stickies yet
                </p>
                <p
                  className={cn(
                    "mt-1 text-[11px] leading-snug",
                    isLight ? "text-[#92400E]/55" : "text-amber-200/40",
                  )}
                >
                  Type on the ruled pad and press Enter
                </p>
              </div>
            </li>
          ) : (
            notes.map((note, index) => (
              <StickyNoteCard key={note.id} note={note} index={index} isLight={isLight} />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
