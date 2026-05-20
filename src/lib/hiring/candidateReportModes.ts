import {
  countCandidateAssessments,
  countCandidateInterviews,
} from "@/lib/hiring/directoryAccess";
import { getCandidateStage } from "@/lib/hiring/stages";
import type { HiringCandidate } from "@/lib/hiring/types";

export type CandidateReportShellMode = "overview" | "assessment" | "interview";

/** Where the report was opened — controls which shells and tabs are available */
export type CandidateReportContext = "directory" | "job" | "assessment";

export type CandidateReportAvailability = {
  assessmentCount: number;
  interviewCount: number;
  hasAssessment: boolean;
  hasInterview: boolean;
  shellModes: CandidateReportShellMode[];
  defaultShellMode: CandidateReportShellMode;
  /** True only for global directory when candidate has both assessment and interview records */
  showSwitcher: boolean;
};

function countFlags(candidate: HiringCandidate) {
  const assessmentCount = countCandidateAssessments(candidate);
  const interviewCount = countCandidateInterviews(candidate);
  const hasAssessment = assessmentCount > 0;
  const hasInterview =
    interviewCount > 0 || getCandidateStage(candidate) === "Interviews";
  return { assessmentCount, interviewCount, hasAssessment, hasInterview };
}

/** Global Candidate Directory — only place that may unify both workflows */
function getDirectoryReportModes(
  candidate: HiringCandidate,
  flags: ReturnType<typeof countFlags>,
): CandidateReportAvailability {
  const { assessmentCount, interviewCount, hasAssessment, hasInterview } = flags;
  const shellModes: CandidateReportShellMode[] = [];

  if (hasAssessment && hasInterview) {
    shellModes.push("overview", "assessment", "interview");
  } else if (hasAssessment) {
    shellModes.push("assessment");
  } else if (hasInterview) {
    shellModes.push("interview");
  } else {
    shellModes.push("overview");
  }

  return {
    assessmentCount,
    interviewCount,
    hasAssessment,
    hasInterview,
    shellModes,
    defaultShellMode: shellModes[0] ?? "overview",
    showSwitcher: hasAssessment && hasInterview,
  };
}

/** Job workspace / applicants — hiring & interview context only */
function getJobReportModes(flags: ReturnType<typeof countFlags>): CandidateReportAvailability {
  return {
    ...flags,
    shellModes: ["interview"],
    defaultShellMode: "interview",
    showSwitcher: false,
  };
}

/** Assessment workflow — assessment context only */
function getAssessmentReportModes(flags: ReturnType<typeof countFlags>): CandidateReportAvailability {
  return {
    ...flags,
    shellModes: ["assessment"],
    defaultShellMode: "assessment",
    showSwitcher: false,
  };
}

export function getCandidateReportModes(
  candidate: HiringCandidate,
  context: CandidateReportContext = "job",
): CandidateReportAvailability {
  const flags = countFlags(candidate);
  if (context === "directory") return getDirectoryReportModes(candidate, flags);
  if (context === "assessment") return getAssessmentReportModes(flags);
  return getJobReportModes(flags);
}

/** @deprecated Use getCandidateReportModes(candidate, context) */
export function getCandidateReportAvailability(
  candidate: HiringCandidate,
): CandidateReportAvailability {
  return getCandidateReportModes(candidate, "directory");
}

export function shellModeToInitialTab(mode: CandidateReportShellMode): string {
  if (mode === "assessment") return "assessment";
  if (mode === "interview") return "overview";
  return "overview";
}

export const SHELL_MODE_LABELS: Record<CandidateReportShellMode, string> = {
  overview: "Candidate Overview",
  assessment: "Assessment Report",
  interview: "Interview Report",
};

export function normalizeReportTab(
  tab: string,
  allowedTabIds: readonly string[],
): string {
  const mapped = tab === "resume" ? "profile" : tab;
  if (allowedTabIds.includes(mapped)) return mapped;
  return allowedTabIds[0] ?? "overview";
}
