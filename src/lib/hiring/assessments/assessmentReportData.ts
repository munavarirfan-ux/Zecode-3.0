import type {
  AssessmentCandidateRecord,
  AssessmentQuestionResult,
  AssessmentSectionScore,
  CameraSnapshot,
  MalpracticeBreakdown,
} from "./types";
import { buildQuestionResultsForCandidate, DEFAULT_SECTION_SCORES } from "./mockAssessmentCandidates";

export function getMalpracticeBreakdown(
  candidate: AssessmentCandidateRecord,
): MalpracticeBreakdown {
  const signals = candidate.malpracticeSignals;
  return {
    copying: signals.filter((s) => s.toLowerCase().includes("copy")).length,
    leavingTab: signals.filter((s) => s.toLowerCase().includes("tab")).length,
    movementDetection: signals.filter((s) => s.toLowerCase().includes("camera") || s.toLowerCase().includes("face")).length,
  };
}

export function getSectionScores(questions: AssessmentQuestionResult[]): AssessmentSectionScore[] {
  const fromQuestions = ["Coding", "Debug Snippet", "MCQ", "Database", "Open Ended", "Fill in the Blanks"] as const;
  const computed = fromQuestions
    .map((section) => {
      const qs = questions.filter((q) => q.tab === section);
      const score = qs.reduce((s, q) => s + q.score, 0);
      const maxScore = qs.reduce((s, q) => s + q.maxScore, 0);
      return { section, score, maxScore: maxScore || 0 };
    })
    .filter((s) => s.maxScore > 0 || s.score > 0);

  if (computed.length > 0) return computed;

  return DEFAULT_SECTION_SCORES;
}

export function getCameraSnapshots(candidate: AssessmentCandidateRecord): CameraSnapshot[] {
  if (!candidate.attemptedAt) return [];
  const hasAnomaly = candidate.malpracticeSignals.length > 0;
  return [
    { id: "snap-1", capturedAt: "00:04:12", label: "Session start", hasAnomaly: false },
    { id: "snap-2", capturedAt: "00:18:33", label: "Mid assessment", hasAnomaly: hasAnomaly },
    { id: "snap-3", capturedAt: "00:31:08", label: "Coding section", hasAnomaly: false },
    { id: "snap-4", capturedAt: "00:42:51", label: "Tab switch event", hasAnomaly: true },
  ];
}

export function getAssessmentReportBundle(candidateId: string, assessmentId: string) {
  const questions = buildQuestionResultsForCandidate(candidateId, assessmentId);
  return { questions };
}
