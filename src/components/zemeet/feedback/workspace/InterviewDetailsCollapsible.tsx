"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewerFeedbackData } from "@/lib/hiring/interviewFeedback";
import type { ZeMeetCodeChallengeArtifact } from "@/lib/zemeet/types";
import { expandLink, wsText } from "./feedbackWorkspaceTokens";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className={cn("text-[11px]", wsText("muted"))}>{label}</span>
      <span className={cn("text-right text-[11px] font-medium", wsText("body"))}>{value}</span>
    </div>
  );
}

export function InterviewDetailsCollapsible({
  data,
  codeChallenge,
}: {
  data: InterviewerFeedbackData;
  codeChallenge?: ZeMeetCodeChallengeArtifact | null;
}) {
  const [open, setOpen] = useState(false);
  const passed = codeChallenge?.testResults.filter((t) => t.passed === true).length ?? 0;
  const total = codeChallenge?.testResults.length ?? 0;

  return (
    <div className="border-t border-[rgba(15,23,42,0.06)] pt-6">
      <button
        type="button"
        className={cn("inline-flex w-full items-center justify-between gap-2", expandLink)}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>View interview details</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
          strokeWidth={2}
        />
      </button>

      {open ? (
        <div className="mt-3 space-y-0.5 rounded-xl bg-[rgba(15,23,42,0.03)] px-4 py-3">
          <DetailRow label="Interviewer" value={data.interviewerName} />
          <DetailRow label="Round" value={data.interviewRound} />
          <DetailRow label="Duration" value={`${data.durationMinutes} min`} />
          <DetailRow label="Date" value={data.interviewDate} />
          <DetailRow label="Type" value={data.interviewType} />
          {codeChallenge ? (
            <>
              <div className="my-2 h-px bg-[rgba(15,23,42,0.05)]" />
              <DetailRow label="Challenge" value={codeChallenge.questionTitle} />
              {total > 0 ? (
                <DetailRow label="Tests" value={`${passed}/${total} passed`} />
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
