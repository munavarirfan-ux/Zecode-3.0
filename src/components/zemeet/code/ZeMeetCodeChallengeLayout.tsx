"use client";

import { ZeMeetCodeChallengeWorkspace } from "@/components/zemeet/code/ZeMeetCodeChallengeWorkspace";
import { ZeMeetVideoStrip } from "@/components/zemeet/room/ZeMeetVideoStrip";

/** Full in-meet code challenge workspace — replaces video stage while active */
export function ZeMeetCodeChallengeLayout() {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <ZeMeetVideoStrip />
      <ZeMeetCodeChallengeWorkspace />
    </div>
  );
}
