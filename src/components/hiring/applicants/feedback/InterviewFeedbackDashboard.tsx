"use client";

import {
  getInterviewFeedback,
  getPendingInterviewers,
  resolveWorkflowStatus,
  WORKFLOW_STATUS_LABELS,
} from "@/lib/hiring/interviewFeedback";
import type { HiringCandidate } from "@/lib/hiring/types";
import { FeedbackStatusBadge } from "./FeedbackStatusBadge";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { dashboardRowSurface } from "@/components/dashboard/dashboardTokens";

export function InterviewFeedbackDashboard({ candidate }: { candidate: HiringCandidate }) {
  const bundle = getInterviewFeedback(candidate);
  const status = resolveWorkflowStatus(bundle);
  const pending = getPendingInterviewers(bundle);

  return (
    <div className="space-y-3">
      {candidate.interviews.length === 0 ? (
        <LineArtEmptyState illustration="interviews" message="No interviews scheduled." size="compact" />
      ) : (
        candidate.interviews.map((interview) => (
          <article key={interview.id} className={dashboardRowSurface}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-semibold text-[#18181B]">{interview.round}</p>
                <p className="mt-0.5 text-[12px] text-[#71717A]">{interview.scheduledAt}</p>
              </div>
              <FeedbackStatusBadge bundle={bundle} />
            </div>

            <dl className="mt-3 grid gap-2 border-t border-[rgba(15,23,42,0.06)] pt-3 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#71717A]">
                  Feedback status
                </dt>
                <dd className="mt-0.5 text-[13px] font-medium text-[#18181B]">
                  {WORKFLOW_STATUS_LABELS[status]}
                </dd>
              </div>
              {bundle.requestedBy ? (
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#71717A]">
                    Requested by
                  </dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-[#18181B]">{bundle.requestedBy}</dd>
                </div>
              ) : null}
              {bundle.submittedBy ? (
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#71717A]">
                    Submitted by
                  </dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-[#18181B]">{bundle.submittedBy}</dd>
                </div>
              ) : null}
              {bundle.submittedAt ? (
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#71717A]">
                    Submitted
                  </dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-[#18181B]">
                    {new Date(bundle.submittedAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
              ) : null}
              {pending.length > 0 ? (
                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#71717A]">
                    Pending interviewers
                  </dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-[#18181B]">{pending.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        ))
      )}
    </div>
  );
}
