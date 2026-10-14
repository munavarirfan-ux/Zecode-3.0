"use client";

import { useMemo } from "react";
import { HeroInterviewStickyNotes } from "@/components/zemeet/feedback/workspace/HeroInterviewStickyNotes";
import type { ZeMeetNoteEntry } from "@/lib/zemeet/types";

/** Demo-friendly session timestamps for sticky note headers */
function bulletsToSessionNotes(bullets: string[]): ZeMeetNoteEntry[] {
  const base = new Date(2026, 4, 20, 14, 10);
  return bullets.map((body, index) => {
    const at = new Date(base.getTime() + index * 4 * 60 * 1000);
    return {
      id: `session-note-${index}`,
      body,
      createdAt: at.toISOString(),
    };
  });
}

export function InterviewerHeroInterviewNotes({
  bullets,
  capturedRound: _capturedRound,
  positionClassName = "absolute bottom-4 right-14 z-20 sm:bottom-5 sm:right-16 lg:right-20",
}: {
  bullets: string[];
  capturedRound: string | null;
  positionClassName?: string;
}) {
  const notes = useMemo(() => bulletsToSessionNotes(bullets), [bullets]);

  return (
    <HeroInterviewStickyNotes
      notes={notes}
      readOnly
      positionClassName={positionClassName}
    />
  );
}
