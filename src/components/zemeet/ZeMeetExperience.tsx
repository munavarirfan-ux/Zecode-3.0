"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CodeChallengeEndConfirmDialog } from "@/components/zemeet/code/CodeChallengeEndConfirmDialog";
import { CodeChallengeInviteModal } from "@/components/zemeet/code/CodeChallengeInviteModal";
import { CodeChallengeSendConfirmDialog } from "@/components/zemeet/code/CodeChallengeSendConfirmDialog";
import { ZeMeetEndInterviewDialog } from "@/components/zemeet/feedback/ZeMeetEndInterviewDialog";
import { ZeMeetPostInterviewFeedback } from "@/components/zemeet/feedback/ZeMeetPostInterviewFeedback";
import { ZeMeetLobby } from "@/components/zemeet/lobby/ZeMeetLobby";
import { ZeMeetRoom } from "@/components/zemeet/room/ZeMeetRoom";
import { ZeMeetProvider, useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { cn } from "@/lib/utils";
import type { ZeMeetSession } from "@/lib/zemeet/types";

function ZeMeetEndedScreen() {
  const { session, theme } = useZeMeet();
  const isLight = theme === "light";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">
        ze[meet]
      </p>
      <h1 className={cn("mt-2 text-[1.5rem] font-semibold", isLight ? "text-[#18181B]" : "text-[#e8eaed]")}>
        Session ended
      </h1>
      <p className={cn("mt-2 max-w-sm text-[14px]", isLight ? "text-[#6B7280]" : "text-[#9aa0a6]")}>
        Interview artifacts have been synced to the candidate report in ze[hire].
      </p>
      <a
        href={`/hiring/jobs/${session.context.jobId}`}
        className={cn(
          "mt-8 inline-flex h-11 items-center rounded-[12px] px-5 text-[14px] font-medium",
          isLight
            ? "bg-[#18181B] text-white hover:bg-[#27272A]"
            : "bg-white/10 text-white hover:bg-white/15",
        )}
      >
        Back to job workspace
      </a>
    </div>
  );
}

function ZeMeetFlow() {
  const { phase, setPhase, session } = useZeMeet();
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";

  const handleLeaveRequest = useCallback(() => {
    if (session.viewerRole === "candidate") {
      setPhase("ended");
      toast.success("You left the interview");
      return;
    }
    setEndConfirmOpen(true);
  }, [session.viewerRole, setPhase]);

  const handleEndConfirm = useCallback(() => {
    setEndConfirmOpen(false);
    setPhase("feedback");
  }, [setPhase]);

  if (phase === "ended") {
    return <ZeMeetEndedScreen />;
  }

  if (phase === "feedback" && isInterviewer) {
    return <ZeMeetPostInterviewFeedback onComplete={() => setPhase("ended")} />;
  }

  return (
    <>
      {phase === "lobby" ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ZeMeetLobby />
        </div>
      ) : null}
      {phase === "live" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ZeMeetRoom onLeave={handleLeaveRequest} />
        </div>
      ) : null}
      <CodeChallengeSendConfirmDialog />
      <CodeChallengeEndConfirmDialog />
      <CodeChallengeInviteModal />
      <ZeMeetEndInterviewDialog
        open={endConfirmOpen}
        onOpenChange={setEndConfirmOpen}
        onConfirm={handleEndConfirm}
      />
    </>
  );
}

export function ZeMeetExperience({ session }: { session: ZeMeetSession }) {
  const searchParams = useSearchParams();
  const skipLobby = searchParams.get("join") === "1";

  return (
    <ZeMeetProvider session={session}>
      <ZeMeetExperienceInner skipLobby={skipLobby} />
    </ZeMeetProvider>
  );
}

function ZeMeetExperienceInner({ skipLobby }: { skipLobby: boolean }) {
  const { phase, startSession, theme, setTheme } = useZeMeet();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    if (skipLobby && phase === "lobby") startSession();
  }, [skipLobby, phase, startSession]);

  const isLight = theme === "light";

  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden",
        isLight
          ? "bg-[#F8F9FB] text-[#18181B]"
          : "bg-[#202124] text-[#e8eaed]",
      )}
    >
      <ZeMeetFlow />
    </div>
  );
}
