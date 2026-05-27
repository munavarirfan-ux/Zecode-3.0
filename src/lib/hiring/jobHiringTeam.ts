import { HIRING_MANAGERS } from "./mockData";
import { RECRUITERS } from "./recruiters";
import { MOCK_INTERVIEWERS } from "./scheduleInterview";
import type { HiringJob } from "./types";

const STORAGE_PREFIX = "kerohire-hiring-team";

export type JobTeamAssignee = {
  id: string;
  name: string;
  email: string;
  initials: string;
};

export type JobHiringTeamGroups = {
  recruiters: JobTeamAssignee[];
  hiringManagers: JobTeamAssignee[];
  panelMembers: JobTeamAssignee[];
};

export type JobHiringTeamRole = keyof JobHiringTeamGroups;

export type HiringTeamDirectoryEntry = {
  id: string;
  name: string;
  subtitle: string;
  email: string;
  initials: string;
};

const QUICK_SUGGESTION_LIMIT = 4;

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function emailFromName(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, ".");
  return `${slug}@madiva.com`;
}

function assignee(id: string, name: string): JobTeamAssignee {
  return {
    id,
    name,
    email: emailFromName(name),
    initials: initialsFromName(name),
  };
}

function uniqueNames(names: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const n of names) {
    const key = n.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(n.trim());
  }
  return out;
}

/** Default hiring team from job metadata and directory seeds. */
export function getDefaultJobHiringTeamGroups(job: HiringJob): JobHiringTeamGroups {
  const recruiterNames = uniqueNames([
    job.recruiterOwner,
    ...RECRUITERS.filter((r) => r.name !== job.recruiterOwner)
      .slice(0, 2)
      .map((r) => r.name),
  ]).slice(0, 4);

  const hmNames = uniqueNames([
    job.hiringManager,
    ...HIRING_MANAGERS.filter((hm) => hm !== job.hiringManager).slice(0, 1),
  ]).slice(0, 3);

  return {
    recruiters: recruiterNames.map((name, i) => assignee(`rec-${i}-${name}`, name)),
    hiringManagers: hmNames.map((name, i) => assignee(`hm-${i}-${name}`, name)),
    panelMembers: [],
  };
}

export function loadJobHiringTeam(jobId: string): JobHiringTeamGroups | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${jobId}`);
    if (!raw) return null;
    return JSON.parse(raw) as JobHiringTeamGroups;
  } catch {
    return null;
  }
}

export function saveJobHiringTeam(jobId: string, team: JobHiringTeamGroups): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_PREFIX}:${jobId}`, JSON.stringify(team));
}

export function getJobHiringTeamForJob(job: HiringJob): JobHiringTeamGroups {
  const stored = loadJobHiringTeam(job.id);
  if (stored) {
    return cloneJobHiringTeam(stored);
  }
  return getDefaultJobHiringTeamGroups(job);
}

export function cloneJobHiringTeam(team: JobHiringTeamGroups): JobHiringTeamGroups {
  return {
    recruiters: team.recruiters.map((m) => ({ ...m })),
    hiringManagers: team.hiringManagers.map((m) => ({ ...m })),
    panelMembers: team.panelMembers.map((m) => ({ ...m })),
  };
}

export function removeTeamMember(
  team: JobHiringTeamGroups,
  role: JobHiringTeamRole,
  memberId: string,
): JobHiringTeamGroups {
  return {
    ...team,
    [role]: team[role].filter((m) => m.id !== memberId),
  };
}

function isAlreadyOnRole(team: JobHiringTeamGroups, role: JobHiringTeamRole, name: string): boolean {
  const key = name.trim().toLowerCase();
  return team[role].some((m) => m.name.trim().toLowerCase() === key);
}

export function directoryEntryToAssignee(entry: HiringTeamDirectoryEntry): JobTeamAssignee {
  return {
    id: entry.id,
    name: entry.name,
    email: entry.email,
    initials: entry.initials,
  };
}

function recruiterDirectory(): HiringTeamDirectoryEntry[] {
  return RECRUITERS.map((r) => ({
    id: r.id,
    name: r.name,
    subtitle: r.role,
    email: emailFromName(r.name),
    initials: initialsFromName(r.name),
  }));
}

function hiringManagerDirectory(): HiringTeamDirectoryEntry[] {
  return HIRING_MANAGERS.map((name) => ({
    id: `hm-dir-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    subtitle: "Hiring Manager",
    email: emailFromName(name),
    initials: initialsFromName(name),
  }));
}

function panelDirectory(): HiringTeamDirectoryEntry[] {
  return MOCK_INTERVIEWERS.map((p) => ({
    id: `panel-${p.id}`,
    name: p.name,
    subtitle: p.role,
    email: emailFromName(p.name),
    initials: p.initials,
  }));
}

export function getHiringTeamDirectory(role: JobHiringTeamRole): HiringTeamDirectoryEntry[] {
  if (role === "recruiters") return recruiterDirectory();
  if (role === "hiringManagers") return hiringManagerDirectory();
  return panelDirectory();
}

export function getHiringTeamQuickSuggestions(
  role: JobHiringTeamRole,
  job: HiringJob,
  team: JobHiringTeamGroups,
): HiringTeamDirectoryEntry[] {
  const directory = getHiringTeamDirectory(role);
  const priorityNames: string[] =
    role === "recruiters"
      ? [job.recruiterOwner]
      : role === "hiringManagers"
        ? [job.hiringManager]
        : [];

  const picked: HiringTeamDirectoryEntry[] = [];
  const seen = new Set<string>();

  for (const name of priorityNames) {
    const entry = directory.find((d) => d.name.toLowerCase() === name.toLowerCase());
    if (!entry || seen.has(entry.id) || isAlreadyOnRole(team, role, entry.name)) continue;
    seen.add(entry.id);
    picked.push(entry);
  }

  for (const entry of directory) {
    if (picked.length >= QUICK_SUGGESTION_LIMIT) break;
    if (seen.has(entry.id) || isAlreadyOnRole(team, role, entry.name)) continue;
    seen.add(entry.id);
    picked.push(entry);
  }

  return picked;
}

export function searchHiringTeamDirectory(
  role: JobHiringTeamRole,
  query: string,
  team: JobHiringTeamGroups,
): HiringTeamDirectoryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return getHiringTeamDirectory(role).filter((entry) => {
    if (isAlreadyOnRole(team, role, entry.name)) return false;
    return (
      entry.name.toLowerCase().includes(q) ||
      entry.subtitle.toLowerCase().includes(q) ||
      entry.email.toLowerCase().includes(q)
    );
  });
}

export function addTeamMember(
  team: JobHiringTeamGroups,
  role: JobHiringTeamRole,
  member: JobTeamAssignee,
): JobHiringTeamGroups {
  if (isAlreadyOnRole(team, role, member.name)) return team;
  return {
    ...team,
    [role]: [...team[role], member],
  };
}
