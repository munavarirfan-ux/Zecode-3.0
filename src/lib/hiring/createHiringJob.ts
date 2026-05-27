import type { JobAdditionalDetails, JobBasicDetails } from "@/components/hiring/JobFormStepContent";
import { DEFAULT_HIRING_STAGES } from "@/lib/hiring/types";
import type { HiringJob, HiringStage, WorkMode, EmploymentType, JobVisibility, HiringPriority } from "@/lib/hiring/types";
import { normalizeInterviewRoundOrder } from "./customiseHiringProcess";
import {
  interviewRoundsToHiringStageConfigs,
  pipelinePreviewLabelsFromRounds,
  saveJobHiringStageConfigs,
} from "./jobHiringStages";
import type { InterviewRound } from "./interviewRounds";
import { saveInterviewRounds } from "./interviewRounds";
import { persistCreatedJob } from "./persistedJobs";
import { HIRING_JOBS } from "./mockData";

function jobIdTaken(id: string): boolean {
  return HIRING_JOBS.some((j) => j.id === id);
}

function slugifyJobId(title: string): string {
  const base =
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "new-job";
  if (!jobIdTaken(base)) return base;
  let n = 2;
  while (jobIdTaken(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildInterviewSubstages(rounds: InterviewRound[]) {
  return rounds.map((r) => ({ id: r.id, name: r.title.trim() || "Interview round" }));
}

function buildJobStages(interviewSubstages: { id: string; name: string }[]): HiringStage[] {
  return DEFAULT_HIRING_STAGES.map((stage) =>
    stage.id === "interviews" ? { ...stage, substages: interviewSubstages } : { ...stage },
  );
}

export type CreateHiringJobInput = {
  basic: JobBasicDetails;
  additional: JobAdditionalDetails;
  interviewRounds: InterviewRound[];
};

function buildHiringJob(
  input: CreateHiringJobInput,
  status: HiringJob["status"],
): HiringJob {
  const { basic, additional, interviewRounds } = input;
  const title = basic.title.trim() || "Untitled job";
  const id = slugifyJobId(title);
  const normalizedRounds = normalizeInterviewRoundOrder(interviewRounds).map((r) => ({
    ...r,
    title: r.title.trim() || "Interview round",
  }));
  const interviewSubstages = buildInterviewSubstages(normalizedRounds);
  const now = new Date().toISOString();

  const job: HiringJob = {
    id,
    title,
    department: basic.department,
    location: basic.location,
    workMode: basic.workMode as WorkMode,
    employmentType: basic.employmentType as EmploymentType,
    experienceLevel: basic.experienceLevel,
    hiringManager: basic.hiringManager,
    recruiterOwner: basic.recruiterOwner,
    status,
    visibility: additional.visibility as JobVisibility,
    priority: "Normal" as HiringPriority,
    candidateCount: 0,
    careersApplicants: 0,
    referralCount: 0,
    interviewingCount: 0,
    candidatesThisWeek: 0,
    interviewsToday: 0,
    feedbackPending: 0,
    sources: [],
    flowPreview: pipelinePreviewLabelsFromRounds(normalizedRounds),
    stages: buildJobStages(interviewSubstages),
    lastUpdated: now,
    lastUpdatedLabel: "Just now",
    openings: Math.max(1, parseInt(additional.openings, 10) || 1),
    description: additional.description.trim(),
    responsibilities: parseList(additional.responsibilities),
    requiredSkills: parseList(additional.requiredSkills),
    niceToHaveSkills: parseList(additional.niceToHave),
    salaryRange: additional.salaryRange.trim(),
    deadline: additional.deadline || "—",
  };

  return job;
}

function persistNewJob(job: HiringJob, interviewRounds: InterviewRound[]) {
  const normalizedRounds = normalizeInterviewRoundOrder(interviewRounds).map((r) => ({
    ...r,
    title: r.title.trim() || "Interview round",
  }));
  HIRING_JOBS.unshift(job);
  persistCreatedJob(job);
  saveInterviewRounds(job.id, normalizedRounds);
  saveJobHiringStageConfigs(job.id, interviewRoundsToHiringStageConfigs(normalizedRounds));
}

export function createHiringJobDraft(input: CreateHiringJobInput): HiringJob {
  const job = buildHiringJob(input, "Draft");
  persistNewJob(job, input.interviewRounds);
  return job;
}

export function createHiringJob(input: CreateHiringJobInput): HiringJob {
  const job = buildHiringJob(input, "Published");
  persistNewJob(job, input.interviewRounds);
  return job;
}
