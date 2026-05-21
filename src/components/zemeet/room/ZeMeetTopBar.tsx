"use client";

import { Circle, FileText, Linkedin, Radio, Wifi } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { ZeMeetShareJoinLink } from "@/components/zemeet/room/ZeMeetShareJoinLink";
import { ZeMeetThemeToggle } from "@/components/zemeet/ZeMeetThemeToggle";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ZeMeetTopBar({ codeChallengeActive }: { codeChallengeActive?: boolean }) {
  const { session, elapsedSeconds, isRecording, interviewerIntelPanel, toggleInterviewerIntel } =
    useZeMeet();
  const { context } = session;
  const t = useZeMeetTokens();

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";

  const intelBtn = cn(
    "inline-flex h-8 items-center gap-1.5 rounded-[9px] border px-2.5 text-[12px] font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    t.isLight
      ? "border-[rgba(15,23,42,0.1)] bg-white text-[#3F3F46] hover:bg-[#FAFAFB] focus-visible:ring-forest/25"
      : "border-white/12 bg-white/[0.06] text-white/85 hover:bg-white/10 focus-visible:ring-white/25",
  );

  const intelBtnActive = cn(
    intelBtn,
    t.isLight
      ? "border-forest/25 bg-forest/10 text-forest"
      : "border-white/20 bg-white/12 text-white",
  );

  return (
    <header className={t.topBar}>
      <div className="min-w-0">
        <p className={t.label}>{codeChallengeActive ? "ZeMeet · Code share" : "ZeMeet"}</p>
        <p className={cn(t.title, "truncate text-[14px]")}>
          {context.jobTitle} · {context.roundTitle}
        </p>
        <p className={cn(t.meta, "truncate")}>{context.candidateName}</p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        {isInterviewer ? (
          <div className="flex items-center gap-1.5">
            <ZeMeetShareJoinLink roomId={context.roomId} candidateName={context.candidateName} />
            <button
              type="button"
              className={interviewerIntelPanel === "resume" ? intelBtnActive : intelBtn}
              aria-pressed={interviewerIntelPanel === "resume"}
              onClick={() => toggleInterviewerIntel("resume")}
            >
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              <span className="hidden sm:inline">Resume</span>
            </button>
            <button
              type="button"
              className={interviewerIntelPanel === "linkedin" ? intelBtnActive : intelBtn}
              aria-pressed={interviewerIntelPanel === "linkedin"}
              onClick={() => toggleInterviewerIntel("linkedin")}
            >
              <Linkedin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              <span className="hidden sm:inline">LinkedIn</span>
            </button>
          </div>
        ) : null}

        <ZeMeetThemeToggle compact />
        <span
          className={cn(
            "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:inline-flex",
            t.isLight
              ? "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] text-[#52525B]"
              : "border-white/10 bg-white/[0.04] text-white/70",
          )}
        >
          <Wifi className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.5} />
          Excellent
        </span>
        <span
          className={cn(
            "tabular-nums rounded-full border px-3 py-1 text-[12px] font-semibold",
            t.isLight
              ? "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] text-[#18181B]"
              : "border-white/10 bg-white/[0.04] text-white/90",
          )}
        >
          {formatElapsed(elapsedSeconds)}
        </span>
        {isRecording ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-1 text-[11px] font-semibold text-red-600 dark:text-red-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/60" />
              <Circle className="relative h-2 w-2 fill-red-400 text-red-400" />
            </span>
            REC
          </span>
        ) : null}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium",
            t.isLight
              ? "border-violet-200 bg-violet-50 text-violet-700"
              : "border-violet-500/25 bg-violet-500/10 text-violet-300",
          )}
        >
          <Radio className="h-3 w-3" strokeWidth={2} />
          Live
        </span>
      </div>
    </header>
  );
}
