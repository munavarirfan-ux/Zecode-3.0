"use client";

import type { PreviewRole } from "@/config/previewRole";
import { ROUTES } from "@/config/routes";
import { getJobsForRole } from "@/lib/hiring/jobsForWorkspace";
import { getAssessmentsForRole } from "@/lib/onboarding/workspaceData";
import { isFreshNewUserWorkspace } from "./workspaceMode";

const TEAM_ACK_KEY = "zecode-nux-team-ack";

export type SetupTaskId = "account" | "job" | "assessment" | "team";

export type SetupTask = {
  id: SetupTaskId;
  label: string;
  hint: string;
  href?: string;
  status: "complete" | "current" | "upcoming";
};

export function markTeamInviteAcknowledged() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(TEAM_ACK_KEY, "1");
    window.dispatchEvent(new Event("zecode-onboarding-updated"));
  } catch {
    /* ignore */
  }
}

function hasTeamInviteAcknowledged(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(TEAM_ACK_KEY) === "1";
  } catch {
    return false;
  }
}

export function getNewUserSetupProgress(role: PreviewRole): {
  tasks: SetupTask[];
  completedCount: number;
  totalCount: number;
  percent: number;
  minutesRemaining: number;
  currentTaskId: SetupTaskId | null;
  contextualHint: string;
} {
  const fresh = isFreshNewUserWorkspace(role);
  const jobs = getJobsForRole(role).filter((j) => j.status !== "Deleted");
  const assessments = getAssessmentsForRole(role);

  const accountDone = true;
  const jobDone = !fresh || jobs.length > 0;
  const assessmentDone = !fresh || assessments.length > 0;
  const teamDone = !fresh || hasTeamInviteAcknowledged();

  const raw = [
    {
      id: "account" as const,
      label: "Create your account",
      hint: "You're signed in and ready to build your workspace.",
      done: accountDone,
    },
    {
      id: "job" as const,
      label: "Create your first job",
      hint: "Start by creating your first hiring workflow.",
      href: `${ROUTES.hiringJobs}?addJob=1`,
      done: jobDone,
    },
    {
      id: "assessment" as const,
      label: "Build an assessment",
      hint: "Assessments help evaluate candidates at scale.",
      href: ROUTES.assessments,
      done: assessmentDone,
    },
    {
      id: "team" as const,
      label: "Invite your team",
      hint: "Bring recruiters and interviewers into your workspace.",
      href: ROUTES.usersRoles,
      done: teamDone,
    },
  ];

  const firstOpenIdx = raw.findIndex((t) => !t.done);
  const tasks: SetupTask[] = raw.map((t, i) => ({
    id: t.id,
    label: t.label,
    hint: t.hint,
    href: t.href,
    status: t.done ? "complete" : i === firstOpenIdx ? "current" : "upcoming",
  }));

  const completedCount = raw.filter((t) => t.done).length;
  const totalCount = raw.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const minutesRemaining = Math.max(3, (totalCount - completedCount) * 3);

  const contextualHint =
    tasks.find((t) => t.status === "current")?.hint ??
    "Your workspace is taking shape — explore modules or load demo data.";

  return {
    tasks,
    completedCount,
    totalCount,
    percent,
    minutesRemaining,
    currentTaskId: firstOpenIdx >= 0 ? raw[firstOpenIdx].id : null,
    contextualHint,
  };
}

export function getNewUserNavOnboardingHints(role: PreviewRole): Set<string> {
  const hints = new Set<string>();
  if (!isFreshNewUserWorkspace(role)) return hints;

  const jobs = getJobsForRole(role).filter((j) => j.status !== "Deleted");
  const assessments = getAssessmentsForRole(role);

  if (jobs.length === 0) hints.add(ROUTES.hiringJobs);
  if (assessments.length === 0) hints.add(ROUTES.assessments);
  if (jobs.length === 0) hints.add(ROUTES.interviews);

  return hints;
}
