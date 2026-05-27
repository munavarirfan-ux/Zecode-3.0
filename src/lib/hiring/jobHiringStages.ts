import { isHrInterviewRound } from "./customiseHiringProcess";
import type { InterviewRound } from "./interviewRounds";
import { getInterviewRounds, slugifyInterviewRoundId } from "./interviewRounds";

export const JOB_INTERVIEW_TYPES = [
  "Video Interview",
  "Technical Interview",
  "HR Interview",
  "Portfolio Review",
  "Code Challenge",
  "Assignment",
  "Panel Interview",
  "Custom",
] as const;

export type JobInterviewType = (typeof JOB_INTERVIEW_TYPES)[number];

export const JOB_EVALUATION_TYPES = [
  "Feedback Form",
  "Code Challenge",
  "Notes Only",
  "Portfolio Evaluation",
  "Mixed Evaluation",
] as const;

export type JobEvaluationType = (typeof JOB_EVALUATION_TYPES)[number];

export type JobHiringStageConfig = {
  id: string;
  stageName: string;
  interviewType: JobInterviewType;
  durationMinutes: number;
  interviewerNames: string[];
  evaluationType: JobEvaluationType;
  notes: string;
};

const STAGE_STORAGE_PREFIX = "kerohire-hiring-stage-config";

function stageUid(): string {
  return `stage-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createDefaultHiringStages(): JobHiringStageConfig[] {
  return [
    {
      id: stageUid(),
      stageName: "Screening",
      interviewType: "Video Interview",
      durationMinutes: 30,
      interviewerNames: [],
      evaluationType: "Feedback Form",
      notes: "",
    },
    {
      id: stageUid(),
      stageName: "Technical Round",
      interviewType: "Technical Interview",
      durationMinutes: 60,
      interviewerNames: [],
      evaluationType: "Mixed Evaluation",
      notes: "",
    },
    {
      id: stageUid(),
      stageName: "Final Interview",
      interviewType: "Panel Interview",
      durationMinutes: 45,
      interviewerNames: [],
      evaluationType: "Feedback Form",
      notes: "",
    },
  ];
}

export function createEmptyHiringStage(): JobHiringStageConfig {
  return {
    id: stageUid(),
    stageName: "",
    interviewType: "Video Interview",
    durationMinutes: 45,
    interviewerNames: [],
    evaluationType: "Feedback Form",
    notes: "",
  };
}

export function interviewRoundsToHiringStageConfigs(rounds: InterviewRound[]): JobHiringStageConfig[] {
  return rounds.map((round) => ({
    id: round.id,
    stageName: round.title.trim() || "Interview round",
    interviewType: "Video Interview",
    durationMinutes: 45,
    interviewerNames: [],
    evaluationType: "Feedback Form",
    notes: "",
  }));
}

export function pipelinePreviewLabelsFromRounds(rounds: InterviewRound[]): string[] {
  const names = rounds.map((r) => r.title.trim()).filter(Boolean);
  return ["Applied", "Screening", ...names, "Hired"];
}

export function hiringStagesToInterviewRounds(stages: JobHiringStageConfig[]): InterviewRound[] {
  const existingIds = new Set<string>();
  return stages.map((s) => {
    const title = s.stageName.trim() || "Interview round";
    const id = slugifyInterviewRoundId(title, existingIds);
    existingIds.add(id);
    return { id, title };
  });
}

export function saveJobHiringStageConfigs(jobId: string, stages: JobHiringStageConfig[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STAGE_STORAGE_PREFIX}:${jobId}`, JSON.stringify(stages));
}

const NON_INTERVIEW_STAGE_NAMES = new Set([
  "screening",
  "applied",
  "shortlisted",
  "new application",
  "resume review",
]);

export function isHrInterviewStage(stage: JobHiringStageConfig): boolean {
  if (isHrInterviewRound({ id: stage.id, title: stage.stageName })) return true;
  return stage.interviewType === "HR Interview";
}

/** Interview stages available when moving from Applicant Stats (excludes HR round). */
export function getMovableInterviewStagesForJob(jobId: string): JobHiringStageConfig[] {
  return getInterviewStagesForJob(jobId).filter((stage) => !isHrInterviewStage(stage));
}

/** Interview stages configured for a job (hiring-stage configs, else interview rounds). */
export function getInterviewStagesForJob(jobId: string): JobHiringStageConfig[] {
  const stored = getJobHiringStageConfigs(jobId);
  if (stored?.length) {
    const filtered = stored.filter((s) => {
      const name = s.stageName.trim().toLowerCase();
      return name.length > 0 && !NON_INTERVIEW_STAGE_NAMES.has(name);
    });
    if (filtered.length > 0) return filtered;
  }
  return getInterviewRounds(jobId).map((round) => ({
    id: round.id,
    stageName: round.title,
    interviewType: "Video Interview" as JobInterviewType,
    durationMinutes: 45,
    interviewerNames: [],
    evaluationType: "Feedback Form" as JobEvaluationType,
    notes: "",
  }));
}

export function resolveInterviewRoundForStage(
  jobId: string,
  stage: JobHiringStageConfig,
): InterviewRound {
  const rounds = getInterviewRounds(jobId);
  const byTitle = rounds.find((r) => r.title === stage.stageName.trim());
  if (byTitle) return byTitle;
  const existingIds = new Set(rounds.map((r) => r.id));
  return {
    id: slugifyInterviewRoundId(stage.stageName, existingIds),
    title: stage.stageName.trim() || "Interview round",
  };
}

export function getJobHiringStageConfigs(jobId: string): JobHiringStageConfig[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STAGE_STORAGE_PREFIX}:${jobId}`);
    if (!raw) return null;
    return JSON.parse(raw) as JobHiringStageConfig[];
  } catch {
    return null;
  }
}

export function pipelinePreviewLabels(stages: JobHiringStageConfig[]): string[] {
  const names = stages.map((s) => s.stageName.trim()).filter(Boolean);
  return ["Applied", "Screening", ...names, "Hired"];
}
