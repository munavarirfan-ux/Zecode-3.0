import {
  APPLICANTS_STATS_COLUMNS,
  HIRE_OFFERS_KANBAN_COLUMNS,
} from "./stages";
import type { HiringJob } from "./types";
import {
  DEFAULT_INTERVIEW_ROUNDS,
  getInterviewRounds,
  saveInterviewRounds,
  slugifyInterviewRoundId,
  type InterviewRound,
} from "./interviewRounds";

const LEGACY_STORAGE_PREFIX = "kerohire-custom-process";

/** Fixed steps shown under Applicants stats (not editable). */
export const FIXED_APPLICANTS_STATS_STEPS = APPLICANTS_STATS_COLUMNS.map((col) => ({
  id: col.id,
  name: col.title,
}));

/** Fixed steps shown under Hire and Offer (not editable). */
export const FIXED_HIRE_OFFER_STEPS = HIRE_OFFERS_KANBAN_COLUMNS.map((col) => ({
  id: col.id,
  name: col.title,
}));

/** Default interview rounds for Staff Product Designer customise dialog. */
export const STAFF_DESIGNER_INTERVIEW_ROUNDS: InterviewRound[] = [
  { id: "tr-1", title: "TR 1" },
  { id: "tr-2", title: "TR 2" },
  { id: "final-technical", title: "Final Technical Round" },
  { id: "final-cultural", title: "Final Cultural Fit" },
];

function defaultInterviewRoundsForJob(job: HiringJob): InterviewRound[] {
  if (job.id === "staff-product-designer") {
    return STAFF_DESIGNER_INTERVIEW_ROUNDS.map((r) => ({ ...r }));
  }

  const interviewStage = job.stages.find((s) => s.id === "interviews");
  if (interviewStage?.substages.length) {
    return interviewStage.substages.map((sub) => ({
      id: sub.id,
      title: sub.name,
    }));
  }

  return getInterviewRounds(job.id);
}

function loadLegacyInterviewRounds(jobId: string): InterviewRound[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${LEGACY_STORAGE_PREFIX}:${jobId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id: string; name: string; substages: { id: string; name: string }[] }[];
    const interviews = parsed.find((s) => s.id === "interviews");
    if (!interviews?.substages.length) return null;
    return interviews.substages.map((sub) => ({ id: sub.id, title: sub.name }));
  } catch {
    return null;
  }
}

function hasStoredInterviewRounds(jobId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`kerohire-interview-rounds:${jobId}`) != null;
}

/** Interview rounds for the customise dialog (only editable section). */
export function getEditableInterviewRounds(job: HiringJob): InterviewRound[] {
  if (hasStoredInterviewRounds(job.id)) {
    return getInterviewRounds(job.id);
  }

  const legacy = loadLegacyInterviewRounds(job.id);
  if (legacy?.length) return legacy;

  return defaultInterviewRoundsForJob(job);
}

export function saveEditableInterviewRounds(jobId: string, rounds: InterviewRound[]): void {
  saveInterviewRounds(jobId, rounds);
}

export function createInterviewRoundId(title: string, existing: InterviewRound[]): string {
  const ids = new Set(existing.map((r) => r.id));
  return slugifyInterviewRoundId(title, ids);
}

export function cloneInterviewRounds(rounds: InterviewRound[]): InterviewRound[] {
  return rounds.map((r) => ({ ...r }));
}

/** Default interview rounds when creating a new job in the wizard. */
export function createDefaultInterviewRoundsForNewJob(): InterviewRound[] {
  return DEFAULT_INTERVIEW_ROUNDS.map((r) => ({ ...r }));
}

export function normalizeInterviewRounds(rounds: InterviewRound[]): InterviewRound[] {
  return normalizeInterviewRoundOrder(rounds).map((r) => ({
    ...r,
    title: r.title.trim() || "Interview round",
  }));
}

export function areInterviewRoundsValid(rounds: InterviewRound[]): boolean {
  if (rounds.length < 1) return false;
  const titles = rounds.map((r) => r.title.trim());
  if (titles.some((t) => !t)) return false;
  return new Set(titles.map((t) => t.toLowerCase())).size === titles.length;
}

/** HR round stays last; matched by id or common titles. */
export function isHrInterviewRound(round: InterviewRound): boolean {
  if (round.id === "hr-round") return true;
  const title = round.title.trim().toLowerCase();
  return title === "hr round" || title === "hr" || title.startsWith("hr round");
}

export function partitionInterviewRounds(rounds: InterviewRound[]): {
  movable: InterviewRound[];
  hr: InterviewRound | null;
} {
  const hrIndex = rounds.findIndex(isHrInterviewRound);
  if (hrIndex === -1) return { movable: [...rounds], hr: null };
  return {
    movable: rounds.filter((_, index) => index !== hrIndex),
    hr: rounds[hrIndex] ?? null,
  };
}

export function mergeInterviewRounds(
  movable: InterviewRound[],
  hr: InterviewRound | null,
): InterviewRound[] {
  return hr ? [...movable, hr] : [...movable];
}

/** Ensures HR round is last when present. */
export function normalizeInterviewRoundOrder(rounds: InterviewRound[]): InterviewRound[] {
  const { movable, hr } = partitionInterviewRounds(rounds);
  return mergeInterviewRounds(movable, hr);
}

export function insertInterviewRoundBeforeHr(
  rounds: InterviewRound[],
  newRound: InterviewRound,
): InterviewRound[] {
  const { movable, hr } = partitionInterviewRounds(rounds);
  return mergeInterviewRounds([...movable, newRound], hr);
}

export function reorderMovableInterviewRounds(
  rounds: InterviewRound[],
  activeId: string,
  overId: string,
): InterviewRound[] {
  if (activeId === overId) return rounds;
  const { movable, hr } = partitionInterviewRounds(rounds);
  const from = movable.findIndex((r) => r.id === activeId);
  const to = movable.findIndex((r) => r.id === overId);
  if (from === -1 || to === -1) return rounds;
  const next = [...movable];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return mergeInterviewRounds(next, hr);
}
