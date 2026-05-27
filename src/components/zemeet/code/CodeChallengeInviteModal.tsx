"use client";

import { Code2 } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";

/** Candidate-side request popup when interviewer sends a code challenge */
export function CodeChallengeInviteModal() {
  const { codeChallenge, acceptCodeChallenge, declineCodeChallenge, session } = useZeMeet();

  if (codeChallenge.status !== "invite_pending" || session.viewerRole !== "candidate") {
    return null;
  }

  const interviewer = session.participants.find((p) => p.role === "interviewer");

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/60 p-6 backdrop-blur-sm sm:items-center">
      <div
        className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#202124] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        role="dialog"
        aria-labelledby="code-challenge-request-title"
      >
        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15">
          <Code2 className="h-5 w-5 text-violet-400" strokeWidth={1.5} aria-hidden />
        </div>

        {/* Text */}
        <h2
          id="code-challenge-request-title"
          className="mt-4 text-[1.0625rem] font-semibold text-[#e8eaed]"
        >
          Code challenge request
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#9aa0a6]">
          {interviewer ? (
            <>
              <span className="font-medium text-[#e8eaed]">{interviewer.name}</span> wants to start
              a live coding challenge.
            </>
          ) : (
            "Your interviewer wants to start a live coding challenge."
          )}
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] text-[13px] font-medium text-[#9aa0a6] transition-colors hover:bg-white/[0.08] hover:text-[#e8eaed]"
            onClick={declineCodeChallenge}
          >
            Decline
          </button>
          <button
            type="button"
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#1a73e8] text-[13px] font-semibold text-white transition-colors hover:bg-[#1557b0]"
            onClick={acceptCodeChallenge}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
