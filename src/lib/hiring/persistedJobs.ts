import type { HiringJob, JobStatus } from "./types";

const CREATED_JOBS_KEY = "kerohire-created-jobs";
const JOB_OVERRIDES_KEY = "kerohire-job-overrides";
export const JOBS_UPDATED_EVENT = "kerohire:jobs-updated";

type JobOverride = {
  id: string;
  status?: JobStatus;
  /** When deleted, keep a timestamp for auditing/sorting in the UI later */
  deletedAt?: string;
};

function readOverrides(): JobOverride[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JOB_OVERRIDES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JobOverride[];
  } catch {
    return [];
  }
}

function writeOverrides(next: JobOverride[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOB_OVERRIDES_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(JOBS_UPDATED_EVENT));
}

export function persistJobOverride(patch: JobOverride): void {
  if (typeof window === "undefined") return;
  const list = readOverrides();
  const next = [patch, ...list.filter((o) => o.id !== patch.id)];
  writeOverrides(next);
}

export function markJobDeleted(jobId: string): void {
  persistJobOverride({ id: jobId, status: "Deleted", deletedAt: new Date().toISOString() });
}

export function persistCreatedJob(job: HiringJob): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CREATED_JOBS_KEY);
    const list: HiringJob[] = raw ? JSON.parse(raw) : [];
    const next = [job, ...list.filter((j) => j.id !== job.id)];
    localStorage.setItem(CREATED_JOBS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(JOBS_UPDATED_EVENT));
  } catch {
    /* ignore */
  }
}

export function mergePersistedJobs(jobs: HiringJob[]): HiringJob[] {
  if (typeof window === "undefined") return jobs;
  try {
    const raw = localStorage.getItem(CREATED_JOBS_KEY);
    const extra: HiringJob[] = raw ? (JSON.parse(raw) as HiringJob[]) : [];
    const overrides = readOverrides();
    const overridesById = new Map(overrides.map((o) => [o.id, o] as const));

    const merged = [...jobs];
    const ids = new Set(jobs.map((j) => j.id));
    for (const j of extra) if (!ids.has(j.id)) merged.push(j);

    return merged.map((j) => {
      const o = overridesById.get(j.id);
      if (!o) return j;
      return {
        ...j,
        status: o.status ?? j.status,
      };
    });
  } catch {
    return jobs;
  }
}
