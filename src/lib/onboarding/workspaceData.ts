import type { PreviewRole } from "@/config/previewRole";
import { getAllAssessments } from "@/lib/hiring/assessments/assessmentStore";
import { SEED_ASSESSMENT_IDS } from "@/lib/hiring/assessments/seedIds";
import { getJobsForRole } from "@/lib/hiring/jobsForWorkspace";
import type { AssessmentRecord } from "@/lib/hiring/assessments/types";
import type { HiringJob } from "@/lib/hiring/types";
import { shouldShowDemoWorkspaceData } from "./workspaceMode";

export { getJobsForRole } from "@/lib/hiring/jobsForWorkspace";
export {
  shouldShowDemoWorkspaceData,
  isFreshNewUserWorkspace,
  enableDemoWorkspace,
} from "./workspaceMode";

export function getAssessmentsForRole(role: PreviewRole): AssessmentRecord[] {
  const all = getAllAssessments();
  if (shouldShowDemoWorkspaceData(role)) return all;
  return all.filter((a) => !SEED_ASSESSMENT_IDS.has(a.id));
}

export function getWorkspaceJobs(role: PreviewRole): HiringJob[] {
  return getJobsForRole(role);
}
