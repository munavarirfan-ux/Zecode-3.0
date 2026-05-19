import {
  hireRecommendationToInterviewResult,
  saveInterviewFeedback,
  saveInterviewFeedbackDraft,
  type HireRecommendation,
  type InterviewFeedbackBundle,
} from "@/lib/hiring/interviewFeedback";
import { HIRING_CANDIDATES } from "@/lib/hiring/mockData";
import type { ZeMeetCodeChallenge, ZeMeetCodeChallengeArtifact, ZeMeetSessionArtifact } from "./types";

const challengeArtifacts = new Map<string, ZeMeetCodeChallengeArtifact>();

export function codeChallengeArtifactFromState(
  challenge: ZeMeetCodeChallenge,
): ZeMeetCodeChallengeArtifact {
  return {
    questionTitle: challenge.problemTitle,
    problemStatement: challenge.problemStatement,
    candidateCode: challenge.candidateCode,
    language: challenge.language,
    testResults: challenge.testCases,
    consoleOutput: challenge.consoleOutput,
    durationSeconds: challenge.challengeElapsedSeconds || challenge.durationSeconds || 0,
    startedAt: challenge.startedAt,
    endedAt: challenge.endedAt,
    interviewerNotes: challenge.interviewerNotes,
    interviewerObservations: challenge.interviewerObservations,
    finalStatus: challenge.finalStatus,
  };
}

export function getStoredCodeChallengeArtifact(
  interviewId: string,
): ZeMeetCodeChallengeArtifact | undefined {
  return challengeArtifacts.get(interviewId);
}

export function storeCodeChallengeArtifact(
  interviewId: string,
  artifact: ZeMeetCodeChallengeArtifact,
): void {
  challengeArtifacts.set(interviewId, artifact);
}

/**
 * Post-session sync into Candidate Report (mock in-memory).
 * Production: POST /api/hiring/candidates/:id/interviews/:id/artifacts
 */
export function syncZeMeetArtifactToCandidateReport(artifact: ZeMeetSessionArtifact): boolean {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === artifact.candidateId);
  if (!candidate) return false;

  const idx = candidate.interviews.findIndex((i) => i.id === artifact.interviewId);
  if (idx < 0) return false;

  const interview = candidate.interviews[idx];

  if (artifact.codeChallenge) {
    challengeArtifacts.set(artifact.interviewId, artifact.codeChallenge);
  }

  candidate.interviews[idx] = {
    ...interview,
    hasNotes: artifact.notes.length > 0 || interview.hasNotes,
    hasCodeChallenge: Boolean(artifact.codeChallenge) || interview.hasCodeChallenge,
    hasRecording: Boolean(artifact.recordingUrl) || interview.hasRecording,
    status: interview.status === "Scheduled" ? "Completed" : interview.status,
  };

  candidate.timeline = [
    {
      id: `t-zemeet-${Date.now()}`,
      label: "ZeMeet session completed",
      detail: artifact.codeChallenge
        ? `${artifact.durationSeconds}s · code challenge & notes synced to report`
        : `${artifact.durationSeconds}s · notes & artifacts synced to report`,
      at: "Just now",
    },
    ...candidate.timeline,
  ];

  return true;
}

export function submitZeMeetInterviewFeedback(input: {
  candidateId: string;
  interviewId: string;
  bundle: InterviewFeedbackBundle;
  actorName: string;
  artifact?: ZeMeetSessionArtifact;
}): InterviewFeedbackBundle {
  const { candidateId, interviewId, bundle, actorName, artifact } = input;

  if (artifact) {
    syncZeMeetArtifactToCandidateReport(artifact);
  }

  const saved = saveInterviewFeedback(candidateId, bundle, "submitted", actorName);

  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return saved;

  const idx = candidate.interviews.findIndex((i) => i.id === interviewId);
  if (idx < 0) return saved;

  const interview = candidate.interviews[idx];
  const result = hireRecommendationToInterviewResult(
    saved.interviewer.recommendation as HireRecommendation | null,
  );

  candidate.interviews[idx] = {
    ...interview,
    feedbackStatus: "Submitted",
    status: interview.status === "Scheduled" ? "Completed" : interview.status,
    result: result ?? interview.result,
    hasNotes: saved.interviewer.notes.length > 0 || interview.hasNotes,
    hasCodeChallenge:
      Boolean(artifact?.codeChallenge) || Boolean(saved.interviewer.codeChallenge.code) || interview.hasCodeChallenge,
    hasRecording: Boolean(artifact?.recordingUrl) || interview.hasRecording,
  };

  candidate.timeline = [
    {
      id: `t-feedback-${Date.now()}`,
      label: "Feedback submitted",
      detail: `Feedback submitted by ${actorName} after ZeMeet interview`,
      at: "Just now",
    },
    ...candidate.timeline,
  ];

  return saved;
}

export function saveZeMeetInterviewFeedbackDraft(input: {
  candidateId: string;
  bundle: InterviewFeedbackBundle;
  actorName: string;
}): InterviewFeedbackBundle {
  return saveInterviewFeedbackDraft(input.candidateId, input.bundle, input.actorName);
}
