import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
export type { JobHiringTeamGroups, JobTeamAssignee } from "@/lib/hiring/jobHiringTeam";
export { getDefaultJobHiringTeamGroups as getJobHiringTeamGroups } from "@/lib/hiring/jobHiringTeam";

const SCREENING_COLUMNS = new Set([
  "resume-review",
  "recruiter-screening",
  "hm-review",
  "shortlisted",
]);

const INTERVIEW_COLUMNS = new Set([
  "portfolio",
  "assignment",
  "design-review",
  "culture",
  "tech-1",
  "tech-2",
  "hr-round",
  "system-design",
]);

const OFFER_COLUMNS = new Set(["offer-draft", "offer-sent", "offer-accepted", "offer-declined"]);

export type JobWorkspaceMetrics = {
  totalApplicants: number;
  screening: number;
  interviews: number;
  offers: number;
  hired: number;
};

export type PipelineStageSnapshot = {
  id: string;
  label: string;
  count: number;
};

export type HiringTeamMember = {
  id: string;
  name: string;
  role: string;
  timezone: string;
  workload: string;
  initials: string;
};

function stageBucket(c: HiringCandidate): "applicants" | "screening" | "interviews" | "offers" | "hired" {
  if (c.kanbanColumn === "hired") return "hired";
  if (c.kanbanColumn && OFFER_COLUMNS.has(c.kanbanColumn)) return "offers";
  if (c.kanbanColumn && INTERVIEW_COLUMNS.has(c.kanbanColumn)) return "interviews";
  if (c.kanbanColumn && SCREENING_COLUMNS.has(c.kanbanColumn)) return "screening";
  if (c.currentStage === "Hire & Offers") return "offers";
  if (c.currentStage === "Interviews") return "interviews";
  if (c.currentStage === "Screening") return "screening";
  return "applicants";
}

export function getJobWorkspaceMetrics(
  job: HiringJob,
  candidates: HiringCandidate[],
): JobWorkspaceMetrics {
  const buckets = { applicants: 0, screening: 0, interviews: 0, offers: 0, hired: 0 };
  for (const c of candidates) {
    buckets[stageBucket(c)] += 1;
  }

  const hasPipeline = candidates.length > 0;
  return {
    totalApplicants: hasPipeline ? candidates.length : job.candidateCount,
    screening: hasPipeline ? buckets.screening : Math.max(3, Math.round(job.candidateCount * 0.35)),
    interviews: hasPipeline ? buckets.interviews : job.interviewingCount,
    offers: hasPipeline ? buckets.offers : Math.max(1, Math.round(job.candidateCount * 0.08)),
    hired: hasPipeline ? buckets.hired : 0,
  };
}

export function getPipelineSnapshot(candidates: HiringCandidate[]): PipelineStageSnapshot[] {
  const metrics = getJobWorkspaceMetrics({ candidateCount: candidates.length } as HiringJob, candidates);
  return [
    { id: "applicants", label: "Directory", count: metrics.totalApplicants },
    { id: "screening", label: "Screening", count: metrics.screening },
    { id: "interviews", label: "Interviews", count: metrics.interviews },
    { id: "offers", label: "Offer", count: metrics.offers },
  ];
}

export function getHiringTeam(job: HiringJob): HiringTeamMember[] {
  return [
    {
      id: "hm",
      name: job.hiringManager,
      role: "Hiring Manager",
      timezone: "CET · Berlin",
      workload: "6 active roles",
      initials: initialsFromName(job.hiringManager),
    },
    {
      id: "rec",
      name: job.recruiterOwner,
      role: "Recruiter",
      timezone: "GMT · London",
      workload: "12 active candidates",
      initials: initialsFromName(job.recruiterOwner),
    },
    {
      id: "coord",
      name: "Priya Nair",
      role: "Coordinator",
      timezone: "IST · Bangalore",
      workload: "4 interviews this week",
      initials: "PN",
    },
  ];
}

export function getRoleExpectations(job: HiringJob): string[] {
  return [
    `Operate at ${job.experienceLevel.toLowerCase()} level with measurable product outcomes`,
    "Partner with engineering and research on structured discovery",
    "Maintain design quality bar across recruiter-facing workflows",
  ];
}

export function getActiveHiringStage(job: HiringJob, candidates: HiringCandidate[]): string {
  if (candidates.some((c) => stageBucket(c) === "interviews")) return "Interviews in progress";
  if (candidates.some((c) => stageBucket(c) === "offers")) return "Offer stage";
  if (candidates.some((c) => stageBucket(c) === "screening")) return "Screening";
  return job.flowPreview[job.flowPreview.length - 1] ?? "Applicants";
}
