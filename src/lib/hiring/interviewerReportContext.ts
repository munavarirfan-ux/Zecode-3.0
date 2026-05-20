import type { PreviewRole } from "@/config/previewRole";
import { resolveLoggedInInterviewerName } from "@/lib/dashboard/interviewerContext";
import { getPreviewActorLabel } from "@/lib/hiring/feedbackPermissions";
import { getInterviewFeedback, type FeedbackNoteEntry, type HireRecommendation, type InterviewFeedbackBundle } from "@/lib/hiring/interviewFeedback";
import { interviewerOnPanel } from "@/lib/hiring/interviewerInterviews";
import type { CandidateInterview, HiringCandidate } from "@/lib/hiring/types";

const CANONICAL_ROUND_ORDER = [
  "Resume Review",
  "Recruiter Screening",
  "Recruiter Screen",
  "Portfolio Review",
  "Design Review",
  "Technical Round 1",
  "Technical Round 2",
  "System Design",
  "HR Round",
  "Culture",
  "Final Round",
] as const;

/** Demo session notes captured live during completed interviews */
const DEMO_SESSION_NOTES: Record<string, { round: string; bullets: string[] }> = {
  "c-alex-chen": {
    round: "Technical Round 1",
    bullets: [
      "Strong async communication",
      "Good system thinking",
      "Needs deeper architecture depth",
    ],
  },
  "c-sarah-jenkins": {
    round: "Technical Round 2",
    bullets: [
      "Strong communication",
      "Good UX process clarity",
      "Needs stronger data storytelling",
    ],
  },
  "c-oliver-grant": {
    round: "Portfolio review",
    bullets: [
      "Clear narrative across case studies",
      "Strong data-dense layouts",
      "Wants more end-to-end ownership examples",
    ],
  },
  "c-james-okafor": {
    round: "Recruiter Screening",
    bullets: [
      "Articulate leadership examples",
      "Solid design-system depth",
      "Follow up on stakeholder conflict story",
    ],
  },
  "c-emma-larsen": {
    round: "Design Review",
    bullets: [
      "Fresh perspective on onboarding",
      "Research synthesis could be tighter",
      "High collaboration energy",
    ],
  },
};

export type PriorRoundFeedbackView = {
  round: string;
  interviewerName: string;
  interviewDate: string;
  recommendation: HireRecommendation | null;
  summary: string;
  skillHighlights: string[];
  notes: FeedbackNoteEntry[];
};

export type InterviewerReportContext = {
  actorNames: string[];
  assignedInterview: CandidateInterview | null;
  assignedRound: string | null;
  scheduledLabel: string | null;
  isAssignedCompleted: boolean;
  showFeedbackTab: boolean;
  sessionNoteBullets: string[];
  sessionNotesRound: string | null;
  priorRoundFeedback: PriorRoundFeedbackView[];
  feedbackBundle: InterviewFeedbackBundle;
};

export function isInterviewerReportRole(role: PreviewRole): boolean {
  return role === "evaluator";
}

export function roundSortIndex(round: string): number {
  const normalized = round.trim().toLowerCase();
  const idx = CANONICAL_ROUND_ORDER.findIndex((r) => r.toLowerCase() === normalized);
  if (idx >= 0) return idx;
  const match = round.match(/round\s*(\d+)/i);
  if (match) return 100 + parseInt(match[1], 10);
  return 500;
}

function interviewerActorNames(role: PreviewRole, sessionName?: string | null): string[] {
  const names = new Set<string>();
  names.add(resolveLoggedInInterviewerName(sessionName));
  if (role === "evaluator") names.add(getPreviewActorLabel(role));
  return Array.from(names);
}

export function resolveAssignedInterview(
  candidate: HiringCandidate,
  actorNames: string[],
  focusRound?: string,
): CandidateInterview | null {
  const onPanel = (i: CandidateInterview) => interviewerOnPanel(i.interviewers, actorNames);

  if (focusRound) {
    const focused = candidate.interviews.find(
      (i) => onPanel(i) && i.round.toLowerCase() === focusRound.toLowerCase(),
    );
    if (focused) return focused;
  }

  const assigned = candidate.interviews.filter(onPanel);
  if (assigned.length === 0) return null;

  const scheduled = assigned.find((i) => i.status === "Scheduled");
  if (scheduled) return scheduled;

  const completed = assigned
    .filter((i) => i.status === "Completed")
    .sort((a, b) => roundSortIndex(b.round) - roundSortIndex(a.round));
  if (completed[0]) return completed[0];

  return assigned.sort((a, b) => roundSortIndex(b.round) - roundSortIndex(a.round))[0] ?? null;
}

function mapResultToRecommendation(result?: string): HireRecommendation | null {
  if (!result) return null;
  const r = result.toLowerCase();
  if (r.includes("strong")) return "strong_hire";
  if (r.includes("no")) return "no_hire";
  if (r.includes("hire")) return "hire";
  return "lean_hire";
}

function snapshotFromInterview(
  candidate: HiringCandidate,
  interview: CandidateInterview,
): PriorRoundFeedbackView {
  const bundle = getInterviewFeedback(candidate);
  const bundleMatches =
    bundle.interviewer.interviewRound.toLowerCase() === interview.round.toLowerCase();

  const skillHighlights = bundleMatches
    ? bundle.interviewer.skills
        .filter((s) => s.rating >= 4 && s.summary)
        .slice(0, 3)
        .map((s) => `${s.title}: ${s.summary}`)
    : [];

  const notes = bundleMatches
    ? bundle.interviewer.notes.filter((n) => n.phase === "during" || n.phase === "after")
    : [];

  return {
    round: interview.round,
    interviewerName: interview.interviewers[0] ?? "Interviewer",
    interviewDate: interview.scheduledAt?.split("·")[0]?.trim() ?? "—",
    recommendation: bundleMatches
      ? bundle.interviewer.recommendation
      : mapResultToRecommendation(interview.result),
    summary: bundleMatches
      ? bundle.interviewer.skills.find((s) => s.summary)?.summary ??
        bundle.interviewer.additionalInterviewNotes
      : interview.result
        ? `Panel outcome: ${interview.result}`
        : "Prior round evaluation on file.",
    skillHighlights,
    notes,
  };
}

export function getPriorRoundFeedbackViews(
  candidate: HiringCandidate,
  assignedRound: string | null,
): PriorRoundFeedbackView[] {
  if (!assignedRound) return [];
  const assignedIdx = roundSortIndex(assignedRound);

  return candidate.interviews
    .filter(
      (i) =>
        i.status === "Completed" &&
        (i.feedbackStatus === "Submitted" || Boolean(i.result)) &&
        roundSortIndex(i.round) < assignedIdx,
    )
    .sort((a, b) => roundSortIndex(a.round) - roundSortIndex(b.round))
    .map((i) => snapshotFromInterview(candidate, i));
}

export function getSessionNoteBullets(
  candidate: HiringCandidate,
  bundle: InterviewFeedbackBundle,
  assignedRound: string | null,
  isCompleted: boolean,
): { bullets: string[]; capturedRound: string | null } {
  if (!isCompleted) return { bullets: [], capturedRound: null };

  const fromBundle = bundle.interviewer.notes
    .filter((n) => n.phase === "during")
    .map((n) => n.body.trim())
    .filter(Boolean);

  if (fromBundle.length > 0) {
    return {
      bullets: fromBundle,
      capturedRound: bundle.interviewer.interviewRound ?? assignedRound,
    };
  }

  const demo = DEMO_SESSION_NOTES[candidate.id];
  if (demo) {
    return { bullets: demo.bullets, capturedRound: demo.round };
  }

  return { bullets: [], capturedRound: assignedRound };
}

export type InterviewerAssignmentOverride = {
  round: string;
  scheduledAt: string;
  status: CandidateInterview["status"];
  interviewers?: string[];
};

export function buildInterviewerReportContext(
  candidate: HiringCandidate,
  role: PreviewRole,
  sessionName?: string | null,
  focusRound?: string,
  assignment?: InterviewerAssignmentOverride,
): InterviewerReportContext | null {
  if (!isInterviewerReportRole(role)) return null;

  const actorNames = interviewerActorNames(role, sessionName);
  const resolved = resolveAssignedInterview(candidate, actorNames, focusRound);
  const assignedInterview: CandidateInterview | null = assignment
    ? {
        id: "assigned-focus",
        round: assignment.round,
        scheduledAt: assignment.scheduledAt,
        status: assignment.status,
        interviewers: assignment.interviewers ?? actorNames,
        feedbackStatus: assignment.status === "Completed" ? "Submitted" : "Pending",
      }
    : resolved;
  const assignedRound = assignedInterview?.round ?? focusRound ?? null;
  const isAssignedCompleted = assignedInterview?.status === "Completed";
  const showFeedbackTab = isAssignedCompleted;

  const feedbackBundle = getInterviewFeedback(candidate);
  const { bullets, capturedRound } = getSessionNoteBullets(
    candidate,
    feedbackBundle,
    assignedRound,
    isAssignedCompleted,
  );

  return {
    actorNames,
    assignedInterview,
    assignedRound,
    scheduledLabel: assignedInterview?.scheduledAt ?? null,
    isAssignedCompleted,
    showFeedbackTab,
    sessionNoteBullets: bullets,
    sessionNotesRound: capturedRound,
    priorRoundFeedback: getPriorRoundFeedbackViews(candidate, assignedRound),
    feedbackBundle,
  };
}

export function interviewerVisibleTabIds(ctx: InterviewerReportContext | null): string[] {
  if (!ctx) return [];
  const tabs = ["overview", "profile", "interviews"];
  if (ctx.showFeedbackTab) tabs.push("feedback");
  return tabs;
}
