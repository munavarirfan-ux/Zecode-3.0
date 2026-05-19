"use client";

import { ZeMeetCodeChallengeLayout } from "@/components/zemeet/code/ZeMeetCodeChallengeLayout";
import { ZeMeetInterviewerIntelPanel } from "@/components/zemeet/code/ZeMeetInterviewerIntelPanel";
import { ZeMeetControlBar } from "@/components/zemeet/room/ZeMeetControlBar";
import { ZeMeetSidebar } from "@/components/zemeet/room/ZeMeetSidebar";
import { ZeMeetTopBar } from "@/components/zemeet/room/ZeMeetTopBar";
import { ZeMeetVideoStage } from "@/components/zemeet/room/ZeMeetVideoStage";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";

export function ZeMeetRoom({ onLeave }: { onLeave: () => void }) {
  const { codeChallenge } = useZeMeet();
  const codeActive = codeChallenge.status === "active";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ZeMeetTopBar codeChallengeActive={codeActive} />

      {codeActive ? (
        <div className="flex min-h-0 flex-1">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <ZeMeetCodeChallengeLayout />
            <ZeMeetControlBar onLeave={onLeave} codeChallengeMode />
          </div>
          <ZeMeetInterviewerIntelPanel />
          <ZeMeetSidebar />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <ZeMeetVideoStage />
            <ZeMeetControlBar onLeave={onLeave} />
          </div>
          <ZeMeetInterviewerIntelPanel />
          <ZeMeetSidebar />
        </div>
      )}
    </div>
  );
}
