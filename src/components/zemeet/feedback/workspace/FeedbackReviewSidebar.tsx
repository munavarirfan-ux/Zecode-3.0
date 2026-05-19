"use client";

import { cn } from "@/lib/utils";
import {
  averageSkillRating,
  deriveRatingInsights,
  type InterviewerFeedbackData,
} from "@/lib/hiring/interviewFeedback";
import { getStoredCodeChallengeArtifact } from "@/lib/zemeet/sync";
import { InterviewDetailsCollapsible } from "./InterviewDetailsCollapsible";
import { RecommendationSegmented } from "./RecommendationSegmented";
import { feedbackCardShell, railLabel, wsText } from "./feedbackWorkspaceTokens";

export function FeedbackReviewSidebar({
  data,
  onChange,
  interviewId,
  completionPercent,
}: {
  data: InterviewerFeedbackData;
  onChange: (next: InterviewerFeedbackData) => void;
  interviewId: string;
  completionPercent: number;
}) {
  const avg = averageSkillRating(data.skills);
  const insights = deriveRatingInsights(avg, data.recommendation);
  const artifact = getStoredCodeChallengeArtifact(interviewId);

  return (
    <aside className="w-full lg:sticky lg:top-0 lg:self-start">
      <div className={cn(feedbackCardShell(), "space-y-7")}>
        <section>
          <p className={railLabel}>Overall rating</p>
          <div className="mt-2 flex items-end gap-3">
            <p className="text-[3rem] font-semibold leading-none tracking-[-0.06em] text-[#18181B]">
              {avg > 0 ? avg.toFixed(1) : "—"}
            </p>
            <div className="mb-2 min-w-0 flex-1">
              <div
                className="h-1 overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)]"
                role="progressbar"
                aria-valuenow={completionPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Evaluation completion"
              >
                <div
                  className="h-full rounded-full bg-[rgb(var(--accent-rgb))] transition-[width] duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className={cn("mt-1.5 text-[11px]", wsText("muted"))}>
                {completionPercent}% · {insights.label}
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className={railLabel}>Hiring recommendation</p>
          <div className="mt-3">
            <RecommendationSegmented
              value={data.recommendation}
              onChange={(recommendation) => onChange({ ...data, recommendation })}
            />
          </div>
        </section>

        <InterviewDetailsCollapsible data={data} codeChallenge={artifact} />
      </div>
    </aside>
  );
}
