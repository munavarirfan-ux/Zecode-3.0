import { buildQuestionResultsForCandidate } from "./mockAssessmentCandidates";
import { mapWarningToSignal } from "./liveSessionRuntime";
import type { LiveCandidateSession } from "./liveMonitoringTypes";
import type {
  AssessmentCandidateRecord,
  AssessmentQuestionResult,
  CameraSnapshot,
  MalpracticeSignalType,
} from "./types";

function warningsToSignals(warnings: string[]): MalpracticeSignalType[] {
  const signals = warnings.map(mapWarningToSignal);
  return Array.from(new Set(signals));
}

export function liveSessionToCandidateRecord(session: LiveCandidateSession): AssessmentCandidateRecord {
  const signals = warningsToSignals(session.warnings);
  const status =
    session.status === "flagged"
      ? "Malpractice Detected"
      : session.status === "idle"
        ? "Attempted"
        : "Attempted";

  const partialScore = Math.round(session.progressPercent * 0.72);

  return {
    id: session.id,
    assessmentId: session.assessmentId,
    name: session.name,
    email: session.email,
    linkedin: session.linkedin,
    resumeUrl: session.resumeUrl,
    status,
    score: partialScore,
    qualified: null,
    durationMinutes: Math.max(1, session.totalQuestions * 3 - session.remainingMinutes),
    attemptedAt: `Live · Q ${session.currentQuestion}/${session.totalQuestions}`,
    inviteSentAt: "Scheduled via Assessment Drive",
    malpracticeSignals: signals,
    completionPercent: session.progressPercent,
  };
}

export function buildLiveQuestionResults(session: LiveCandidateSession): AssessmentQuestionResult[] {
  const all = buildQuestionResultsForCandidate(session.id, session.assessmentId);
  const completedCount = Math.max(0, session.currentQuestion - 1);

  return all.map((q, i) => {
    if (i < completedCount) return q;
    if (i === completedCount) {
      const partialScore = Math.round(q.maxScore * 0.35);
      return {
        ...q,
        score: partialScore,
        status: "Partial" as const,
        testCasesPassed: q.testCasesPassed ? "In progress" : undefined,
        evaluatorNotes: "Candidate is actively working on this question.",
        aiSummary: "Live — partial submission in progress.",
      };
    }
    return {
      ...q,
      score: 0,
      status: "Skipped" as const,
      testCasesPassed: undefined,
      submittedCode: undefined,
      candidateAnswer: undefined,
      evaluatorNotes: "Not reached yet in live session.",
    };
  });
}

export function buildLiveCameraSnapshots(session: LiveCandidateSession): CameraSnapshot[] {
  const base = session.eventLog.slice(-4).map((e, i) => ({
    id: `live-snap-${session.id}-${i}`,
    capturedAt: e.at,
    label: e.message,
    hasAnomaly:
      e.message.toLowerCase().includes("tab") ||
      e.message.toLowerCase().includes("copy") ||
      e.message.toLowerCase().includes("integrity"),
  }));

  if (base.length === 0) {
    return [{ id: `live-snap-${session.id}-0`, capturedAt: "—", label: "Session start", hasAnomaly: false }];
  }
  return base;
}
