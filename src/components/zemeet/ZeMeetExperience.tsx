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
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import type { ZeMeetSession } from "@/lib/zemeet/types";
import { cn } from "@/lib/utils";

function ZeMeetEndedScreen() {
  const { session } = useZeMeet();
  const t = useZeMeetTokens();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className={t.label}>ZeMeet</p>
      <h1 className={cn(t.heading, "mt-2 text-[1.5rem]")}>Session ended</h1>
      <p className={cn(t.meta, "mt-2 max-w-sm text-[14px]")}>
        Interview artifacts have been synced to the candidate report in Ze[code] Hiring Intelligence.
      </p>
      <a
        href={`/hiring/jobs/${session.context.jobId}`}
        className={cn(
          "mt-8 inline-flex h-11 items-center rounded-[12px] px-5 text-[14px] font-medium",
          t.isLight
            ? "bg-[rgba(15,23,42,0.06)] text-[#18181B] hover:bg-[rgba(15,23,42,0.1)]"
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
  const { phase, startSession, theme } = useZeMeet();
  const t = useZeMeetTokens();

  useEffect(() => {
    if (skipLobby && phase === "lobby") startSession();
  }, [skipLobby, phase, startSession]);

  return (
    <div className={cn(t.shell, "flex h-dvh flex-col overflow-hidden")} data-zemeet-theme={theme}>
      <div className={t.grain} aria-hidden />
      <ZeMeetFlow />
    </div>
  );
}
