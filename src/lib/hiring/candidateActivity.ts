import { getInterviewFeedback, resolveWorkflowStatus } from "./interviewFeedback";
import { normalizeSource } from "./stages";
import type { HiringCandidate } from "./types";

export type CandidateActivityKind =
  | "applied"
  | "resume_parsed"
  | "stage_changed"
  | "interview_scheduled"
  | "interview_rescheduled"
  | "feedback_requested"
  | "feedback_submitted"
  | "notes_added"
  | "email_sent"
  | "candidate_moved"
  | "transfer_request"
  | "transfer_resolved"
  | "offer_sent"
  | "rejected"
  | "hired";

export type CandidateActivityItem = {
  id: string;
  kind: CandidateActivityKind;
  title: string;
  description: string;
  actor: string;
  at: string;
  sortKey: number;
  meta?: { label: string; value: string }[];
};

export type ActivityFilterId = "all" | "interviews" | "feedback" | "emails" | "stages" | "system";

export const ACTIVITY_FILTERS: { id: ActivityFilterId; label: string }[] = [
  { id: "all", label: "All activity" },
  { id: "interviews", label: "Interviews" },
  { id: "feedback", label: "Feedback" },
  { id: "emails", label: "Emails" },
  { id: "stages", label: "Stage changes" },
  { id: "system", label: "System" },
];

const DEMO_YEAR = 2026;

function parseActivityDate(raw: string): number {
  const iso = Date.parse(raw);
  if (!Number.isNaN(iso)) return iso;

  const m = raw.match(/(\w+)\s+(\d{1,2})(?:,?\s*(\d{1,2}):(\d{2}))?/i);
  if (m) {
    const months: Record<string, number> = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    const month = months[m[1].slice(0, 3).toLowerCase()] ?? 4;
    const day = Number(m[2]);
    const hour = m[3] ? Number(m[3]) : 12;
    const minute = m[4] ? Number(m[4]) : 0;
    return new Date(DEMO_YEAR, month, day, hour, minute).getTime();
  }

  return Date.now();
}

function formatDisplayTime(sortKey: number): string {
  return new Date(sortKey).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function inferKindFromLabel(label: string): CandidateActivityKind {
  const l = label.toLowerCase();
  if (l.includes("applied")) return "applied";
  if (l.includes("offer")) return "offer_sent";
  if (l.includes("reject")) return "rejected";
  if (l.includes("hire") && !l.includes("offer")) return "hired";
  if (l.includes("feedback") && l.includes("submit")) return "feedback_submitted";
  if (l.includes("feedback")) return "feedback_requested";
  if (l.includes("reschedul")) return "interview_rescheduled";
  if (l.includes("interview") && l.includes("schedul")) return "interview_scheduled";
  if (l.includes("interview")) return "interview_scheduled";
  if (l.includes("email")) return "email_sent";
  if (l.includes("note")) return "notes_added";
  if (l.includes("resume") || l.includes("parsed")) return "resume_parsed";
  if (l.includes("transfer request submitted")) return "transfer_request";
  if (l.includes("transfer approved") || l.includes("transfer request rejected")) return "transfer_resolved";
  if (l.includes("applicant moved")) return "candidate_moved";
  if (l.includes("screen") || l.includes("stage") || l.includes("moved")) return "stage_changed";
  return "stage_changed";
}

function mapFeedbackActivityType(type: string, label: string): CandidateActivityKind {
  if (type === "feedback_requested") return "feedback_requested";
  if (type === "feedback_submitted") return "feedback_submitted";
  if (type === "email_sent") return "email_sent";
  if (type === "draft_saved") return "notes_added";
  return inferKindFromLabel(label);
}

function push(items: CandidateActivityItem[], item: Omit<CandidateActivityItem, "sortKey" | "at"> & { atRaw: string }) {
  const sortKey = parseActivityDate(item.atRaw);
  items.push({
    ...item,
    sortKey,
    at: formatDisplayTime(sortKey),
  });
}

export function buildCandidateActivities(candidate: HiringCandidate): CandidateActivityItem[] {
  const items: CandidateActivityItem[] = [];

  push(items, {
    id: `act-applied-${candidate.id}`,
    kind: "applied",
    title: "Candidate applied",
    description: `Application received via ${normalizeSource(String(candidate.source))}`,
    actor: candidate.name,
    atRaw: candidate.appliedAt,
    meta: [{ label: "Role", value: candidate.currentSubstage || candidate.currentStage }],
  });

  if (candidate.resumeStatus === "Parsed" || candidate.resumeStatus === "Reviewed") {
    push(items, {
      id: `act-resume-${candidate.id}`,
      kind: "resume_parsed",
      title: "Resume parsed",
      description: `Resume ${candidate.resumeStatus.toLowerCase()} · ready for recruiter review`,
      actor: "Ze[hub] Intelligence",
      atRaw: candidate.resumeUploadedAt || candidate.appliedAt,
    });
  }

  for (const event of candidate.timeline) {
    push(items, {
      id: event.id,
      kind: inferKindFromLabel(event.label),
      title: event.label,
      description: event.detail,
      actor: candidate.recruiterOwner || "Hiring team",
      atRaw: event.at,
    });
  }

  for (const email of candidate.emails) {
    push(items, {
      id: `act-email-${email.id}`,
      kind: "email_sent",
      title: email.subject,
      description: `${email.type} · ${email.preview.replace(/…$/, "")}`,
      actor: email.sender,
      atRaw: email.timestamp,
      meta: [{ label: "Channel", value: "Email" }],
    });
  }

  for (const interview of candidate.interviews) {
    if (interview.status === "Scheduled") {
      push(items, {
        id: `act-int-sched-${interview.id}`,
        kind: "interview_scheduled",
        title: `${interview.round} scheduled`,
        description: `${interview.scheduledAt} · ${interview.interviewers.join(", ")}`,
        actor: candidate.recruiterOwner,
        atRaw: interview.scheduledAt,
        meta: [
          { label: "Platform", value: interview.platform ?? "Google Meet" },
          { label: "Duration", value: `${interview.durationMinutes ?? 45} min` },
        ],
      });
    } else if (interview.status === "Completed") {
      push(items, {
        id: `act-int-done-${interview.id}`,
        kind: "interview_scheduled",
        title: `${interview.round} completed`,
        description: `Panel: ${interview.interviewers.join(", ")}${interview.result ? ` · ${interview.result}` : ""}`,
        actor: interview.interviewers[0] ?? "Interview panel",
        atRaw: interview.scheduledAt,
      });
      if (interview.feedbackStatus === "Submitted") {
        push(items, {
          id: `act-int-fb-${interview.id}`,
          kind: "feedback_submitted",
          title: "Feedback submitted",
          description: `${interview.round} evaluation submitted`,
          actor: interview.interviewers[0] ?? "Interviewer",
          atRaw: interview.scheduledAt,
        });
      } else if (interview.feedbackStatus === "Pending") {
        push(items, {
          id: `act-int-fb-pend-${interview.id}`,
          kind: "feedback_requested",
          title: "Feedback pending",
          description: `Awaiting evaluation for ${interview.round}`,
          actor: candidate.recruiterOwner,
          atRaw: interview.scheduledAt,
        });
      }
    }
  }

  const bundle = getInterviewFeedback(candidate);
  for (const act of bundle.activity ?? []) {
    push(items, {
      id: act.id,
      kind: mapFeedbackActivityType(act.type, act.label),
      title: act.label,
      description: act.detail,
      actor: act.actor,
      atRaw: act.at,
    });
  }

  if (candidate.recruiterNotes?.trim()) {
    push(items, {
      id: `act-rec-notes-${candidate.id}`,
      kind: "notes_added",
      title: "Recruiter notes updated",
      description: candidate.recruiterNotes.slice(0, 120) + (candidate.recruiterNotes.length > 120 ? "…" : ""),
      actor: candidate.recruiterOwner,
      atRaw: candidate.lastActivity ?? candidate.appliedAt,
    });
  }

  const stage = candidate.stage ?? candidate.currentStage;
  if (stage === "Hired & Offers" || candidate.currentSubstage?.toLowerCase().includes("offer")) {
    push(items, {
      id: `act-offer-${candidate.id}`,
      kind: "offer_sent",
      title: "Offer sent",
      description: candidate.currentSubstage || "Offer extended to candidate",
      actor: candidate.recruiterOwner,
      atRaw: candidate.lastActivity ?? candidate.appliedAt,
    });
  }
  if (stage === "Rejected") {
    push(items, {
      id: `act-reject-${candidate.id}`,
      kind: "rejected",
      title: "Candidate rejected",
      description: "Removed from active pipeline",
      actor: candidate.recruiterOwner,
      atRaw: candidate.lastActivity ?? candidate.appliedAt,
    });
  }
  if (stage === "Hired & Offers" && candidate.kanbanColumn?.includes("hired")) {
    push(items, {
      id: `act-hired-${candidate.id}`,
      kind: "hired",
      title: "Candidate hired",
      description: "Marked as hired in pipeline",
      actor: candidate.hiringManagerNotes ? "Hiring manager" : candidate.recruiterOwner,
      atRaw: candidate.lastActivity ?? candidate.appliedAt,
    });
  }

  const seen = new Set<string>();
  return items
    .filter((item) => {
      const key = `${item.kind}-${item.title}-${item.sortKey}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.sortKey - a.sortKey);
}

export function filterActivities(
  items: CandidateActivityItem[],
  filter: ActivityFilterId,
): CandidateActivityItem[] {
  if (filter === "all") return items;
  if (filter === "interviews") {
    return items.filter((i) =>
      ["interview_scheduled", "interview_rescheduled"].includes(i.kind),
    );
  }
  if (filter === "feedback") {
    return items.filter((i) =>
      ["feedback_requested", "feedback_submitted", "notes_added"].includes(i.kind),
    );
  }
  if (filter === "emails") return items.filter((i) => i.kind === "email_sent");
  if (filter === "stages") {
    return items.filter((i) =>
      [
        "applied",
        "stage_changed",
        "candidate_moved",
        "transfer_request",
        "transfer_resolved",
        "offer_sent",
        "rejected",
        "hired",
      ].includes(i.kind),
    );
  }
  return items.filter((i) => ["applied", "resume_parsed"].includes(i.kind));
}

export function groupActivitiesByDate(
  items: CandidateActivityItem[],
): { label: string; items: CandidateActivityItem[] }[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;

  const buckets = new Map<string, CandidateActivityItem[]>();

  for (const item of items) {
    let label: string;
    if (item.sortKey >= startOfToday) label = "Today";
    else if (item.sortKey >= startOfYesterday) label = "Yesterday";
    else {
      label = new Date(item.sortKey).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    const list = buckets.get(label) ?? [];
    list.push(item);
    buckets.set(label, list);
  }

  const order = ["Today", "Yesterday"];
  const groups: { label: string; items: CandidateActivityItem[] }[] = [];

  for (const key of order) {
    if (buckets.has(key)) {
      groups.push({ label: key, items: buckets.get(key)! });
      buckets.delete(key);
    }
  }

  const rest = Array.from(buckets.entries()).sort(
    (a, b) => (b[1][0]?.sortKey ?? 0) - (a[1][0]?.sortKey ?? 0),
  );
  for (const [label, groupItems] of rest) {
    groups.push({ label, items: groupItems });
  }

  return groups;
}

export function getNextExpectedAction(candidate: HiringCandidate): {
  title: string;
  detail: string;
} | null {
  const bundle = getInterviewFeedback(candidate);
  const status = resolveWorkflowStatus(bundle);

  const pendingInterview = candidate.interviews.find(
    (i) => i.status === "Completed" && i.feedbackStatus === "Pending",
  );
  if (pendingInterview) {
    return {
      title: `Awaiting interviewer feedback from ${pendingInterview.interviewers[0]}`,
      detail: `${pendingInterview.round} · feedback not yet submitted`,
    };
  }

  if (status === "requested" || status === "overdue") {
    return {
      title: `Awaiting interviewer feedback from ${bundle.interviewer.interviewerName}`,
      detail: `${bundle.interviewer.interviewRound} · request sent to panel`,
    };
  }

  const upcoming = candidate.interviews.find((i) => i.status === "Scheduled");
  if (upcoming) {
    return {
      title: `Upcoming ${upcoming.round}`,
      detail: `${upcoming.scheduledAt} · ${upcoming.interviewers.join(", ")}`,
    };
  }

  if (candidate.currentStage === "Screening") {
    return {
      title: "Complete screening review",
      detail: `Owned by ${candidate.recruiterOwner}`,
    };
  }

  return null;
}
