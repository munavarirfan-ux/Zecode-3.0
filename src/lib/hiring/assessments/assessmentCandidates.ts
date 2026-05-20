"use client";

import type { AssessmentCandidateRecord, AssessmentQuestionResult } from "./types";
import {
  buildQuestionResultsForCandidate,
  SEED_ASSESSMENT_CANDIDATES,
} from "./mockAssessmentCandidates";

const candidateStore = new Map<string, AssessmentCandidateRecord>(
  SEED_ASSESSMENT_CANDIDATES.map((c) => [c.id, c]),
);

export const ASSESSMENT_CANDIDATES_UPDATED_EVENT = "zecode-assessment-candidates-updated";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ASSESSMENT_CANDIDATES_UPDATED_EVENT));
  }
}

export function getCandidatesForAssessment(assessmentId: string): AssessmentCandidateRecord[] {
  return Array.from(candidateStore.values())
    .filter((c) => c.assessmentId === assessmentId)
    .sort((a, b) => b.inviteSentAt.localeCompare(a.inviteSentAt));
}

export function getAssessmentCandidateById(id: string): AssessmentCandidateRecord | undefined {
  return candidateStore.get(id);
}

export function getAssessmentCandidateStats(assessmentId: string) {
  const rows = getCandidatesForAssessment(assessmentId);
  return {
    invited: rows.length,
    attempted: rows.filter((r) => r.attemptedAt != null).length,
    qualified: rows.filter((r) => r.status === "Qualified").length,
    notQualified: rows.filter((r) => r.status === "Not Qualified").length,
    pending: rows.filter((r) => r.status === "Pending").length,
    malpractice: rows.filter((r) => r.malpracticeSignals.length > 0 || r.status === "Malpractice Detected").length,
  };
}

export type CandidateSortKey = "score-desc" | "score-asc" | "date-desc" | "date-asc" | "name-asc";

export function filterAndSortCandidates(
  rows: AssessmentCandidateRecord[],
  opts: {
    search: string;
    status: string;
    scoreMin: number | null;
    malpracticeOnly: boolean;
    completion: string;
    sort: CandidateSortKey;
  },
): AssessmentCandidateRecord[] {
  let out = [...rows];
  const q = opts.search.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q),
    );
  }
  if (opts.status && opts.status !== "all") {
    out = out.filter((r) => r.status === opts.status);
  }
  if (opts.scoreMin != null && !Number.isNaN(opts.scoreMin)) {
    const min = opts.scoreMin;
    out = out.filter((r) => r.score != null && r.score >= min);
  }
  if (opts.malpracticeOnly) {
    out = out.filter((r) => r.malpracticeSignals.length > 0);
  }
  if (opts.completion === "completed") {
    out = out.filter((r) => r.attemptedAt);
  } else if (opts.completion === "incomplete") {
    out = out.filter((r) => !r.attemptedAt);
  }

  out.sort((a, b) => {
    switch (opts.sort) {
      case "score-desc":
        return (b.score ?? -1) - (a.score ?? -1);
      case "score-asc":
        return (a.score ?? 101) - (b.score ?? 101);
      case "date-asc":
        return a.inviteSentAt.localeCompare(b.inviteSentAt);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "date-desc":
      default:
        return b.inviteSentAt.localeCompare(a.inviteSentAt);
    }
  });
  return out;
}

export function addAssessmentCandidate(
  assessmentId: string,
  input: { name: string; email: string; linkedin?: string; notes?: string },
): AssessmentCandidateRecord {
  const id = `ac-${assessmentId}-${Date.now()}`;
  const record: AssessmentCandidateRecord = {
    id,
    assessmentId,
    name: input.name,
    email: input.email,
    linkedin: input.linkedin,
    status: "Pending",
    score: null,
    qualified: null,
    durationMinutes: null,
    attemptedAt: null,
    inviteSentAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    malpracticeSignals: [],
    completionPercent: 0,
  };
  candidateStore.set(id, record);
  notify();
  return record;
}

export function getQuestionResultsForCandidate(
  candidateId: string,
  assessmentId: string,
): AssessmentQuestionResult[] {
  return buildQuestionResultsForCandidate(candidateId, assessmentId);
}
