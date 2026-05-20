import type { PreviewRole } from "@/config/previewRole";
import { getAllCandidateDirectoryRows } from "@/lib/hiring/candidateDirectory";
import { getAssessmentsForRole } from "@/lib/onboarding/workspaceData";
import { getJobsForRole } from "@/lib/hiring/jobsForWorkspace";
import { getScheduleState } from "@/lib/scheduling/scheduleStore";
import { getSlotsForWorkspace } from "@/lib/scheduling/scheduleForWorkspace";
import { isFreshNewUserWorkspace } from "./workspaceMode";

/** True when a fresh New User has created at least one item in the workspace. */
export function newUserWorkspaceHasData(role: PreviewRole): boolean {
  if (!isFreshNewUserWorkspace(role)) return true;

  const jobs = getJobsForRole(role).filter((j) => j.status !== "Deleted");
  if (jobs.length > 0) return true;
  if (getAssessmentsForRole(role).length > 0) return true;
  if (getAllCandidateDirectoryRows(role).length > 0) return true;
  if (getSlotsForWorkspace(getScheduleState().slots, role).length > 0) return true;

  return false;
}
