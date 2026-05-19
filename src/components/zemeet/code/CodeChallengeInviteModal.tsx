"use client";

import { Code2 } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { cn } from "@/lib/utils";

/** Candidate-side request popup when interviewer sends a code challenge */
export function CodeChallengeInviteModal() {
  const { codeChallenge, acceptCodeChallenge, declineCodeChallenge, session } = useZeMeet();

  if (codeChallenge.status !== "invite_pending" || session.viewerRole !== "candidate") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-[16px] border border-[#2d2d30] bg-[#1e1e1e] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        role="dialog"
        aria-labelledby="code-challenge-request-title"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgb(var(--accent-rgb)/0.18)] text-[rgb(var(--accent-rgb))]">
          <Code2 className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </div>
        <h2
          id="code-challenge-request-title"
          className="mt-4 text-[1.125rem] font-semibold text-[#e8e8e8]"
        >
          Code challenge request
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[#a0a0a0]">
          Your interviewer wants to start a live coding challenge.
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] border border-[#3c3c3c] text-[13px] font-medium text-[#c5c5c5] transition-colors hover:bg-[#2a2a2a]"
            onClick={declineCodeChallenge}
          >
            Reject
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 flex-1 items-center justify-center rounded-[10px] text-[13px] font-semibold",
              "bg-[rgb(var(--accent-rgb))] text-white hover:brightness-110",
            )}
            onClick={acceptCodeChallenge}
          >
            Accept Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
