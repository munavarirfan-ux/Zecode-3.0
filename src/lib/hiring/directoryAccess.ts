import type { PreviewRole } from "@/config/previewRole";
import { getEffectivePreviewRole } from "@/lib/onboarding/effectiveRole";
import { getPreviewActorLabel } from "@/lib/hiring/feedbackPermissions";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { getCandidateStage } from "@/lib/hiring/stages";

export function isHiringAdminRole(role: PreviewRole): boolean {
  const effective = getEffectivePreviewRole(role);
  return effective === "superAdmin" || effective === "admin";
}

function actorFirstName(role: PreviewRole): string {
  return getPreviewActorLabel(role).split(" ")[0]?.toLowerCase() ?? "";
}

/** Role-scoped visibility for global candidate directory */
export function candidateVisibleToRole(candidate: HiringCandidate, role: PreviewRole): boolean {
  if (isHiringAdminRole(role)) return true;

  const actor = getPreviewActorLabel(getEffectivePreviewRole(role));
  const effective = getEffectivePreviewRole(role);
  const first = actorFirstName(effective);

  if (effective === "evaluator") {
    const onPanel = candidate.interviews.some((i) =>
      i.interviewers.some((n) => n.toLowerCase().includes(first) || n === actor),
    );
    const hasAssessment = candidate.emails.some((e) => e.type === "Assessment");
    return onPanel || candidate.recruiterOwner === actor || hasAssessment;
  }

  return false;
}

/** Role-scoped visibility for interview job directory */
export function jobVisibleToRole(
  job: HiringJob,
  role: PreviewRole,
  jobCandidates: HiringCandidate[],
): boolean {
  if (isHiringAdminRole(role)) return true;
  return jobCandidates.some((c) => candidateVisibleToRole(c, role));
}

export function countCandidateAssessments(candidate: HiringCandidate): number {
  const fromEmails = candidate.emails.filter((e) => e.type === "Assessment").length;
  if (fromEmails > 0) return fromEmails;
  if (
    candidate.stage === "Screening" &&
    candidate.currentSubstage?.toLowerCase().includes("assessment")
  ) {
    return 1;
  }
  return 0;
}

export function countCandidateInterviews(candidate: HiringCandidate): number {
  return candidate.interviews.length;
}

export type InterviewJobStats = {
  interviewCandidates: number;
  upcomingInterviews: number;
  feedbackPending: number;
  completedInterviews: number;
  rounds: string[];
};

export function getInterviewStatsForJob(
  job: HiringJob,
  candidates: HiringCandidate[],
): InterviewJobStats {
  const interviewCandidates = candidates.filter((c) => getCandidateStage(c) === "Interviews");
  const upcomingInterviews = interviewCandidates.reduce(
    (sum, c) => sum + c.interviews.filter((i) => i.status === "Scheduled").length,
    0,
  );
  const feedbackPending = interviewCandidates.reduce(
    (sum, c) => sum + c.interviews.filter((i) => i.feedbackStatus === "Pending").length,
    0,
  );
  const completedInterviews = interviewCandidates.reduce(
    (sum, c) => sum + c.interviews.filter((i) => i.status === "Completed").length,
    0,
  );
  const interviewStage = job.stages.find((s) => s.id === "interviews");
  const rounds = interviewStage?.substages.map((s) => s.name) ?? [];

  return {
    interviewCandidates: interviewCandidates.length,
    upcomingInterviews: upcomingInterviews || job.interviewsToday,
    feedbackPending: feedbackPending || job.feedbackPending,
    completedInterviews,
    rounds,
  };
}
