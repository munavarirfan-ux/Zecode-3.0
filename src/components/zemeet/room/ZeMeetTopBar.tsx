"use client";

import { Circle, Radio, Video, Wifi } from "lucide-react";
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
  const { session, elapsedSeconds, isRecording } = useZeMeet();
  const { context } = session;
  const t = useZeMeetTokens();

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";

  return (
    <header className={t.topBar}>
      {/* Left — Google Meet branding + interview info */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            t.isLight ? "bg-[#1A73E8]/12" : "bg-[#1A73E8]/20",
          )}
        >
          <Video className="h-4 w-4 text-[#1A73E8]" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn("text-[13px] font-semibold", t.isLight ? "text-[#18181B]" : "text-white/95")}>
              Google Meet
            </p>
            {codeChallengeActive ? (
              <span className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                t.isLight
                  ? "border-violet-200 bg-violet-50 text-violet-700"
                  : "border-violet-500/25 bg-violet-500/10 text-violet-300",
              )}>
                Code share
              </span>
            ) : null}
          </div>
          <p className={cn(t.meta, "truncate text-[11px]")}>
            {context.jobTitle} · {context.roundTitle} · {context.candidateName}
          </p>
        </div>
      </div>

      {/* Right — controls + status badges */}
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        {isInterviewer ? (
          <ZeMeetShareJoinLink roomId={context.roomId} candidateName={context.candidateName} />
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

        {/* ze[meet] intelligence badge */}
        <span
          className={cn(
            "hidden items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] sm:inline-flex",
            t.isLight
              ? "border-violet-200/80 bg-violet-50/80 text-violet-600"
              : "border-violet-500/20 bg-violet-500/8 text-violet-400",
          )}
        >
          ze[meet]
        </span>
      </div>
    </header>
  );
}
