import type { PreviewRole } from "@/config/previewRole";
import { getAssessmentsForRole } from "@/lib/onboarding/workspaceData";
import { getJobsForRole } from "@/lib/hiring/jobsForWorkspace";

export type GuidanceHint = {
  id: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function getWorkspaceGuidance(role: PreviewRole): GuidanceHint | null {
  const jobs = getJobsForRole(role).filter((j) => j.status !== "Deleted");
  const assessments = getAssessmentsForRole(role);

  if (jobs.length === 0) {
    return {
      id: "first-job",
      title: "Start with a job",
      body: "Create your first job to organize candidates, interviews, and assessments in one workflow.",
      ctaLabel: "Create job",
      ctaHref: "/hiring/jobs?addJob=1",
    };
  }

  const hasInterviewActivity = jobs.some((j) => j.interviewingCount > 0 || j.interviewsToday > 0);
  if (!hasInterviewActivity) {
    return {
      id: "schedule-interviews",
      title: "Ready for interviews?",
      body: "You have jobs live — schedule interviews to start collaborative evaluation.",
      ctaLabel: "View interviews",
      ctaHref: "/interviews",
    };
  }

  const feedbackPending = jobs.reduce((s, j) => s + j.feedbackPending, 0);
  if (feedbackPending > 0) {
    return {
      id: "feedback-due",
      title: "Feedback is waiting",
      body: `${feedbackPending} interview feedback item${feedbackPending === 1 ? "" : "s"} need attention to keep hiring moving.`,
      ctaLabel: "Review feedback",
      ctaHref: "/dashboard",
    };
  }

  if (assessments.length === 0) {
    return {
      id: "first-assessment",
      title: "Add technical evaluation",
      body: "Publish an assessment to evaluate skills at scale alongside your interview pipeline.",
      ctaLabel: "Create assessment",
      ctaHref: "/assessments",
    };
  }

  return null;
}
