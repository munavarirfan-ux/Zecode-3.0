import { dashboardGreeting, loggedInInterviewerPersona, interviewerOpsRows } from "@/features/dashboard/data/dashboard.mock";

/** Resolve the interviewer persona for filtering personal dashboard data. */
export function resolveLoggedInInterviewerName(sessionName?: string | null): string {
  const trimmed = sessionName?.trim();
  if (!trimmed) return loggedInInterviewerPersona;

  const fromOps = interviewerOpsRows.find((r) => r.name.toLowerCase() === trimmed.toLowerCase());
  if (fromOps) return fromOps.name;

  if (trimmed === dashboardGreeting.fallbackName) return loggedInInterviewerPersona;

  return loggedInInterviewerPersona;
}
