import type { PreviewRole } from "@/config/previewRole";
import { shouldShowDemoWorkspaceData } from "@/lib/onboarding/workspaceMode";
import { getAllJobs } from "./mockData";
import { mergePersistedJobs } from "./persistedJobs";
import type { HiringJob } from "./types";

/** Demo / non–New User roles see full seed data; fresh New User sees only jobs they create. */
export function getJobsForRole(role: PreviewRole): HiringJob[] {
  if (shouldShowDemoWorkspaceData(role)) {
    return getAllJobs();
  }
  return mergePersistedJobs([]);
}
