import type { PreviewRole } from "@/config/previewRole";
import { HIRING_CANDIDATES, getJobById } from "@/lib/hiring/mockData";
import { getJobsForRole } from "@/lib/hiring/jobsForWorkspace";
import { enrichCandidate, getCandidateStage } from "@/lib/hiring/stages";
import {
  candidateVisibleToRole,
  countCandidateAssessments,
  countCandidateInterviews,
  getInterviewStatsForJob,
  isHiringAdminRole,
  jobVisibleToRole,
  type InterviewJobStats,
} from "@/lib/hiring/directoryAccess";
import type { HiringCandidate, HiringJob, JobStatus } from "@/lib/hiring/types";

const ACTIVE_JOB_STATUSES = new Set<JobStatus>(["Published", "Internal", "External"]);

export type CandidateDirectoryRow = HiringCandidate & {
  job: HiringJob;
  jobTitle: string;
  assessmentCount: number;
  interviewCount: number;
};

export type InterviewDirectoryJob = HiringJob & {
  stats: InterviewJobStats;
};

export type CandidateDirectoryFilters = {
  jobId: string;
  stage: string;
  interviewStatus: string;
  source: string;
  owner: string;
  minAssessments: string;
  minInterviews: string;
  appliedAfter: string;
  query: string;
};

export const EMPTY_CANDIDATE_DIRECTORY_FILTERS: CandidateDirectoryFilters = {
  jobId: "",
  stage: "",
  interviewStatus: "",
  source: "",
  owner: "",
  minAssessments: "",
  minInterviews: "",
  appliedAfter: "",
  query: "",
};

export function getAllCandidateDirectoryRows(role: PreviewRole): CandidateDirectoryRow[] {
  const jobs = getJobsForRole(role);
  const jobIds = new Set(jobs.map((j) => j.id));
  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  return HIRING_CANDIDATES.map((c) => enrichCandidate(c))
    .filter((c) => jobIds.has(c.jobId))
    .filter((c) => candidateVisibleToRole(c, role))
    .map((c) => {
      const job = jobMap.get(c.jobId) ?? getJobById(c.jobId);
      if (!job) return null;
      return {
        ...c,
        job,
        jobTitle: job.title,
        assessmentCount: countCandidateAssessments(c),
        interviewCount: countCandidateInterviews(c),
      };
    })
    .filter((r): r is CandidateDirectoryRow => r !== null);
}

export function getInterviewDirectoryJobs(role: PreviewRole): InterviewDirectoryJob[] {
  const jobs = getJobsForRole(role).filter((j) => ACTIVE_JOB_STATUSES.has(j.status));

  return jobs
    .map((job) => {
      const candidates = HIRING_CANDIDATES.filter((c) => c.jobId === job.id).map(enrichCandidate);
      if (!jobVisibleToRole(job, role, candidates)) return null;

      const stats = getInterviewStatsForJob(job, candidates);
      const hasInterviewActivity =
        stats.interviewCandidates > 0 || job.interviewingCount > 0 || stats.rounds.length > 0;
      if (!hasInterviewActivity && !isHiringAdminRole(role)) return null;

      return { ...job, stats };
    })
    .filter((j): j is InterviewDirectoryJob => j !== null)
    .sort((a, b) => b.stats.interviewCandidates - a.stats.interviewCandidates);
}

export function filterCandidateDirectoryRows(
  rows: CandidateDirectoryRow[],
  filters: CandidateDirectoryFilters,
): CandidateDirectoryRow[] {
  const q = filters.query.trim().toLowerCase();

  return rows.filter((row) => {
    if (filters.jobId && row.jobId !== filters.jobId) return false;
    if (filters.stage && getCandidateStage(row) !== filters.stage) return false;
    if (filters.source && String(row.source) !== filters.source) return false;
    if (filters.owner && row.recruiterOwner !== filters.owner) return false;

    if (filters.minAssessments) {
      const min = parseInt(filters.minAssessments, 10);
      if (!Number.isNaN(min) && row.assessmentCount < min) return false;
    }
    if (filters.minInterviews) {
      const min = parseInt(filters.minInterviews, 10);
      if (!Number.isNaN(min) && row.interviewCount < min) return false;
    }

    if (filters.interviewStatus) {
      const hasStatus = row.interviews.some((i) => {
        const s = filters.interviewStatus.toLowerCase();
        if (s === "pending" && i.status === "Scheduled") return true;
        if (s === "scheduled" && i.status === "Scheduled") return true;
        if (s === "ongoing") return false;
        if (s === "completed" && i.status === "Completed") return true;
        if (s === "cancelled" && i.status === "Cancelled") return true;
        return false;
      });
      if (!hasStatus && row.interviewCount === 0) return false;
    }

    if (filters.appliedAfter) {
      const applied = Date.parse(row.appliedAt);
      const after = Date.parse(filters.appliedAfter);
      if (!Number.isNaN(applied) && !Number.isNaN(after) && applied < after) return false;
    }

    if (q) {
      const hay = [
        row.name,
        row.email,
        row.phone,
        row.jobTitle,
        row.skills.join(" "),
        row.recruiterOwner,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });
}

export function getCandidateDirectoryFilterOptions(rows: CandidateDirectoryRow[]) {
  const jobs = new Map<string, string>();
  const stages = new Set<string>();
  const sources = new Set<string>();
  const owners = new Set<string>();

  for (const row of rows) {
    jobs.set(row.jobId, row.jobTitle);
    stages.add(getCandidateStage(row));
    sources.add(String(row.source));
    owners.add(row.recruiterOwner);
  }

  return {
    jobs: Array.from(jobs.entries())
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title)),
    stages: Array.from(stages).sort(),
    sources: Array.from(sources).sort(),
    owners: Array.from(owners).sort(),
  };
}
