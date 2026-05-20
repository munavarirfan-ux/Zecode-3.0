"use client";

import { Lock } from "lucide-react";
import { RECOMMENDATION_OPTIONS } from "@/lib/hiring/interviewFeedback";
import type { PriorRoundFeedbackView } from "@/lib/hiring/interviewerReportContext";
import { cn } from "@/lib/utils";

function recommendationLabel(value: PriorRoundFeedbackView["recommendation"]) {
  if (!value) return "—";
  return RECOMMENDATION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function PriorRoundFeedbackPanel({ rounds }: { rounds: PriorRoundFeedbackView[] }) {
  if (rounds.length === 0) return null;

  return (
    <section className="mb-5 space-y-3">
      <div>
        <h3 className="text-[13px] font-semibold tracking-[-0.02em] text-text">Earlier round context</h3>
        <p className="mt-0.5 text-[11px] text-muted">
          Read-only evaluations from completed rounds before yours.
        </p>
      </div>

      <div className="space-y-2.5">
        {rounds.map((round) => (
          <article
            key={round.round}
            className={cn(
              "rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-3.5 py-3",
              "dark:border-white/[0.06] dark:bg-white/[0.02]",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[12px] font-semibold text-text">{round.round}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {round.interviewerName} · {round.interviewDate}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-2 py-0.5 text-[10px] font-medium text-muted">
                <Lock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                Read-only
              </span>
            </div>

            <p className="mt-2 text-[11px] font-medium text-[#52525B]">
              Recommendation:{" "}
              <span className="text-text">{recommendationLabel(round.recommendation)}</span>
            </p>

            {round.summary ? (
              <p className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">{round.summary}</p>
            ) : null}

            {round.skillHighlights.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {round.skillHighlights.map((line) => (
                  <li key={line} className="text-[11px] text-text-secondary">
                    · {line}
                  </li>
                ))}
              </ul>
            ) : null}

            {round.notes.length > 0 ? (
              <div className="mt-2.5 rounded-[10px] border border-amber-200/60 bg-[#FFFBEB]/80 px-2.5 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#92400E]">Notes</p>
                <ul className="mt-1 space-y-0.5">
                  {round.notes.map((n) => (
                    <li key={n.id} className="text-[11px] text-[#713F12]">
                      {n.body}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
