import {
  createDefaultSkillSet,
  createNoteEntry,
  getInterviewFeedback,
  type InterviewFeedbackBundle,
  type InterviewerFeedbackData,
} from "@/lib/hiring/interviewFeedback";
import { HIRING_CANDIDATES } from "@/lib/hiring/mockData";
import type { HiringCandidate } from "@/lib/hiring/types";
import type { ZeMeetCodeChallenge, ZeMeetNoteEntry, ZeMeetSession } from "@/lib/zemeet/types";
import { codeChallengeArtifactFromState } from "@/lib/zemeet/sync";

function formatZeMeetNoteTime(note: ZeMeetNoteEntry): string {
  if (note.timestampMs !== undefined) {
    const totalSec = Math.floor(note.timestampMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  try {
    return new Date(note.createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return note.createdAt;
  }
}

export function zemeetNotesToFeedbackNotes(
  notes: ZeMeetNoteEntry[],
  interviewerName: string,
): InterviewerFeedbackData["notes"] {
  return notes.map((note) =>
    createNoteEntry({
      author: interviewerName,
      role: "Interviewer",
      body: note.label ? `[${note.label}] ${note.body}` : note.body,
      phase: "during",
      at: formatZeMeetNoteTime(note),
    }),
  );
}

export function findZeMeetCandidate(candidateId: string): HiringCandidate | undefined {
  return HIRING_CANDIDATES.find((c) => c.id === candidateId);
}

function mergeLiveNotes(
  existing: InterviewerFeedbackData["notes"],
  live: ZeMeetNoteEntry[],
  interviewerName: string,
): InterviewerFeedbackData["notes"] {
  const liveEntries = zemeetNotesToFeedbackNotes(live, interviewerName);
  const existingBodies = new Set(existing.map((n) => `${n.at}|${n.body}`));
  const fresh = liveEntries.filter((n) => !existingBodies.has(`${n.at}|${n.body}`));
  return [...fresh, ...existing];
}

export function buildPostCallFeedbackBundle(
  session: ZeMeetSession,
  liveNotes: ZeMeetNoteEntry[],
  codeChallenge: ZeMeetCodeChallenge,
  elapsedSeconds: number,
): InterviewFeedbackBundle {
  const candidate = findZeMeetCandidate(session.context.candidateId);
  if (!candidate) {
    throw new Error("Candidate not found for feedback");
  }

  const interview =
    candidate.interviews.find((i) => i.id === session.context.interviewId) ??
    candidate.interviews[0];

  const base = getInterviewFeedback(candidate);
  const interviewerName =
    session.participants.find((p) => p.role === "interviewer")?.name ??
    base.interviewer.interviewerName;

  const artifact =
    codeChallenge.status === "completed" || codeChallenge.status === "active"
      ? codeChallengeArtifactFromState(codeChallenge)
      : undefined;

  const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  const skillsForPostCall =
    base.status === "submitted"
      ? base.interviewer.skills
      : createDefaultSkillSet();

  return {
    ...base,
    status: "draft",
    workflowStatus: "in_progress",
    interviewer: {
      ...base.interviewer,
      interviewerName,
      interviewRound: interview?.round ?? base.interviewer.interviewRound,
      interviewDate:
        interview?.scheduledAt?.split("·")[0]?.trim() ?? base.interviewer.interviewDate,
      durationMinutes,
      interviewSessionStatus: "completed",
      recommendation: base.status === "submitted" ? base.interviewer.recommendation : null,
      skills: skillsForPostCall,
      codeChallenge: {
        question: artifact?.problemStatement ?? base.interviewer.codeChallenge.question,
        code: artifact?.candidateCode ?? base.interviewer.codeChallenge.code,
      },
      notes: mergeLiveNotes(base.interviewer.notes, liveNotes, interviewerName),
      additionalInterviewNotes: base.interviewer.additionalInterviewNotes ?? "",
    },
  };
}
