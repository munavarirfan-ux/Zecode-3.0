import { getCandidateEditProfile } from "@/lib/hiring/candidateProfile";
import {
  createSkillEntry,
  getInterviewFeedback,
  type InterviewFeedbackBundle,
} from "@/lib/hiring/interviewFeedback";
import {
  getHiringOverviewStats,
  HIRING_CANDIDATES,
  HIRING_JOBS,
} from "@/lib/hiring/mockData";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { resolveZeMeetSession } from "@/lib/zemeet/session";
import type { ZeMeetInterviewContext, ZeMeetNoteEntry, ZeMeetSession } from "@/lib/zemeet/types";
import { dashboardKpisByRole } from "@/config/dashboardByRole";

export const ZEMEET_ROOM_ID = "zm-c-sarah-jenkins-design-review";

export const mockJob: HiringJob =
  HIRING_JOBS.find((j) => j.id === "staff-product-designer") ?? HIRING_JOBS[0]!;

export const mockCandidate: HiringCandidate =
  HIRING_CANDIDATES.find((c) => c.id === "c-sarah-jenkins") ?? HIRING_CANDIDATES[0]!;

export const mockHiringOverview = getHiringOverviewStats(HIRING_JOBS);

export const mockDashboardKpis = dashboardKpisByRole.admin;

export function mockZeMeetSession(
  viewerRole: ZeMeetSession["viewerRole"] = "interviewer",
): ZeMeetSession {
  const session = resolveZeMeetSession(ZEMEET_ROOM_ID, viewerRole);
  if (!session) throw new Error(`Storybook: no ZeMeet session for ${ZEMEET_ROOM_ID}`);
  return session;
}

export const mockInterviewContext: ZeMeetInterviewContext = mockZeMeetSession().context;

export function mockFeedbackBundle(): InterviewFeedbackBundle {
  return getInterviewFeedback(mockCandidate);
}

export const mockInterviewerData = () => mockFeedbackBundle().interviewer;

export const mockSkillEntries = () => [
  createSkillEntry("Systems thinking", {
    rating: 4,
    quickSignals: ["Structured", "Tradeoffs"],
    summary: "Strong decomposition of the design review prompt.",
  }),
  createSkillEntry("Communication", {
    rating: 3,
    strengths: ["Clear narrative"],
    concerns: ["Needs sharper metrics framing"],
  }),
  createSkillEntry("Visual craft", { rating: 5, quickSignals: ["Polished", "Consistent"] }),
];

export const mockSessionNotes: ZeMeetNoteEntry[] = [
  {
    id: "n-1",
    body: "Strong systems thinking on the prompt.",
    createdAt: new Date().toISOString(),
    label: "Strength",
    timestampMs: 8 * 60 * 1000,
  },
  {
    id: "n-2",
    body: "Clarify success metrics earlier next time.",
    createdAt: new Date().toISOString(),
    label: "Watch",
    timestampMs: 22 * 60 * 1000,
  },
];

export const mockCandidateProfile = getCandidateEditProfile(mockCandidate);
