"use client";

import {
  Calendar,
  Clock,
  ClipboardCheck,
  User,
  Video,
} from "lucide-react";
import { HiringHeroDecor } from "@/components/hiring/HiringHeroDecor";
import { cn } from "@/lib/utils";
import type { ZeMeetInterviewContext } from "@/lib/zemeet/types";
import type { ZeMeetNoteEntry } from "@/lib/zemeet/types";
import { HeroInterviewStickyNotes } from "./HeroInterviewStickyNotes";
import {
  hiringHeroReportStripRow,
  hiringHeroStripActions,
  hiringHeroStripMetaLine,
  hiringHeroStripTitle,
} from "@/components/hiring/hiringTokens";
import { feedbackHeroShell, statusDot } from "./feedbackWorkspaceTokens";

const heroGlassMeta =
  "inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-md [&_svg]:text-white";

const reportAvatar =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.16] bg-white/[0.1] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:h-14 sm:w-14 sm:text-base";

const heroStatChip = cn(
  "inline-flex flex-col items-end rounded-[14px] border border-white/[0.18] bg-white/[0.1] px-3.5 py-2 backdrop-blur-md",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
);

function candidateInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function FeedbackReviewHeader({
  context,
  interviewerName,
  durationMinutes,
  saveState,
  completionPercent,
  sessionNotes,
  onOpenNotesBoard,
  notesBoardOpen,
}: {
  context: ZeMeetInterviewContext;
  interviewerName: string;
  durationMinutes: number;
  saveState: "idle" | "saving" | "saved";
  completionPercent: number;
  sessionNotes: ZeMeetNoteEntry[];
  onOpenNotesBoard?: () => void;
  notesBoardOpen?: boolean;
}) {
  const dateLine = context.scheduledAt.split("·")[0]?.trim() || context.scheduledAt;
  const initials = candidateInitials(context.candidateName);

  return (
    <header
      className={cn(
        feedbackHeroShell,
        sessionNotes.length > 0 && "pb-28 sm:pb-10 lg:pb-9",
      )}
    >
      <HiringHeroDecor />

      <div className={cn(hiringHeroReportStripRow, "relative w-full")}>
        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
          <div className={reportAvatar}>{initials}</div>
          <div className="min-w-0 space-y-2">
              <h2 className={hiringHeroStripTitle}>{context.candidateName}</h2>
              <p className={hiringHeroStripMetaLine}>{context.jobTitle}</p>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className={heroGlassMeta}>
                    <ClipboardCheck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {context.roundTitle}
                  </span>
                  <span className={heroGlassMeta}>
                    <Clock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {durationMinutes} min
                  </span>
                  <span className={heroGlassMeta}>
                    <Video className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {context.interviewType}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={heroGlassMeta}>
                    <Calendar className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {dateLine}
                  </span>
                  <span className={heroGlassMeta}>
                    <User className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {interviewerName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={hiringHeroStripActions}>
            <div className={heroStatChip}>
              <span className="text-[1.375rem] font-semibold tabular-nums leading-none text-white">
                {completionPercent}%
              </span>
              <span className="mt-0.5 text-[11px] font-medium text-white/55">complete</span>
            </div>
            <div className={cn(heroStatChip, "min-w-[7.5rem] items-start sm:items-end")}>
              <div className="flex items-center gap-2">
                <span className={statusDot(saveState)} aria-hidden />
                <span className="text-[13px] font-medium text-white/90">
                  {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Autosave"}
                </span>
              </div>
              <span className="mt-0.5 text-[11px] text-white/50">Draft sync</span>
            </div>
          </div>
        </div>

      <HeroInterviewStickyNotes
        notes={sessionNotes}
        onOpenBoard={onOpenNotesBoard}
        boardOpen={notesBoardOpen}
      />
    </header>
  );
}
