import type { HiringCandidate } from "./types";
import {
  addAdminComment,
  markDraftSaved,
  markFeedbackOpened,
  markFeedbackSubmitted,
  requestInterviewFeedback,
  resolveWorkflowStatus,
  type AdminFeedbackComment,
  type FeedbackActivityEntry,
  type FeedbackWorkflowStatus,
} from "./feedbackWorkflow";
import {
  addFeedbackRequestNotification,
  sendFeedbackRequestEmail,
} from "./feedbackNotifications";

export type { FeedbackWorkflowStatus, FeedbackActivityEntry, AdminFeedbackComment };
export {
  resolveWorkflowStatus,
  isFeedbackOverdue,
  getPendingInterviewers,
  WORKFLOW_STATUS_LABELS,
  FEEDBACK_SLA_HOURS,
} from "./feedbackWorkflow";

export type HireRecommendation =
  | "strong_no_hire"
  | "no_hire"
  | "lean_hire"
  | "hire"
  | "strong_hire";

export type SkillFeedbackEntry = {
  id: string;
  title: string;
  rating: number;
  quickSignals: string[];
  summary: string;
  detailedNotes: string;
  strengths: string[];
  concerns: string[];
  /** True when added via “Add More” — can be removed by the interviewer */
  custom?: boolean;
};

export type FeedbackNotePhase = "during" | "after";

export type InterviewSessionStatus = "scheduled" | "in_progress" | "completed";

export type FeedbackNoteEntry = {
  id: string;
  author: string;
  role: "Interviewer" | "Recruiter";
  body: string;
  at: string;
  phase: FeedbackNotePhase;
};

export function createNoteEntry(
  partial: Pick<FeedbackNoteEntry, "author" | "role" | "body" | "phase"> &
    Partial<Pick<FeedbackNoteEntry, "at">>,
): FeedbackNoteEntry {
  return {
    id: uid("note"),
    author: partial.author,
    role: partial.role,
    body: partial.body,
    phase: partial.phase,
    at:
      partial.at ??
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
  };
}

export function deriveInterviewSessionStatus(candidate: HiringCandidate): InterviewSessionStatus {
  const active =
    candidate.interviews.find((i) => i.status === "Scheduled") ??
    candidate.interviews.find((i) => i.status === "Completed") ??
    candidate.interviews[0];

  if (!active) return "scheduled";
  if (active.status === "Completed") return "completed";
  return "scheduled";
}

export type RecordingHighlight = {
  id: string;
  label: string;
  time: string;
  tone: "positive" | "neutral" | "concern";
};

export type InterviewerFeedbackData = {
  interviewerName: string;
  interviewerRole: string;
  interviewRound: string;
  interviewType: string;
  interviewDate: string;
  durationMinutes: number;
  interviewSessionStatus: InterviewSessionStatus;
  recommendation: HireRecommendation | null;
  skills: SkillFeedbackEntry[];
  codeChallenge: {
    question: string;
    code: string;
  };
  recording: {
    url?: string;
    duration: string;
    uploadedAt: string;
    transcript: string;
    aiSummary: string;
    highlights: RecordingHighlight[];
  };
  notes: FeedbackNoteEntry[];
  /** Post-interview summary written on the feedback form */
  additionalInterviewNotes: string;
};

export type RecruiterFeedbackData = {
  evaluationNotes: string;
  cultureFit: string;
  salaryAlignment: string;
  availability: string;
  recommendation: string;
  concerns: string;
  decisionSummary: string;
  expectedSalary: string;
  budgetRange: string;
  compensationStatus: string;
};

export type InterviewFeedbackBundle = {
  status: "draft" | "submitted";
  workflowStatus?: FeedbackWorkflowStatus;
  roleTitle?: string;
  requestedBy?: string;
  requestedAt?: string;
  requestMessage?: string;
  submittedBy?: string;
  submittedAt?: string;
  openedAt?: string;
  lastEmailSentAt?: string;
  adminComments?: AdminFeedbackComment[];
  activity?: FeedbackActivityEntry[];
  interviewer: InterviewerFeedbackData;
  recruiter: RecruiterFeedbackData;
};

export const DEFAULT_SKILL_TITLES = [
  "Communication",
  "Technical Depth",
  "Problem Solving",
  "Collaboration",
  "Leadership",
  "Culture Fit",
  "Ownership",
] as const;

export const SKILL_QUICK_SIGNALS: Record<string, string[]> = {
  Communication: ["Clear", "Structured", "Concise", "Needs confidence"],
  "Technical Depth": ["Deep expertise", "Solid fundamentals", "Surface-level", "Gaps in stack"],
  "Problem Solving": ["Structured approach", "Creative", "Methodical", "Needs prompting"],
  Collaboration: ["Team-oriented", "Cross-functional", "Solo-focused", "Conflict-aware"],
  Leadership: ["Influences others", "Mentors peers", "Individual contributor", "Emerging leader"],
  "Culture Fit": ["Values-aligned", "Adaptable", "Misaligned signals", "Needs vetting"],
  Ownership: ["End-to-end", "Accountable", "Needs direction", "Proactive"],
};

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createDefaultSkillSet(
  partialByTitle?: Partial<Record<string, Partial<SkillFeedbackEntry>>>,
): SkillFeedbackEntry[] {
  return DEFAULT_SKILL_TITLES.map((title) =>
    createSkillEntry(title, partialByTitle?.[title]),
  );
}

export function createSkillEntry(title: string, partial?: Partial<SkillFeedbackEntry>): SkillFeedbackEntry {
  return {
    id: uid("skill"),
    title,
    rating: partial?.rating ?? 0,
    quickSignals: partial?.quickSignals ?? [],
    summary: partial?.summary ?? "",
    detailedNotes: partial?.detailedNotes ?? "",
    strengths: partial?.strengths ?? [],
    concerns: partial?.concerns ?? [],
    custom: partial?.custom ?? false,
  };
}

const SEED_SKILLS: Partial<SkillFeedbackEntry>[] = [
  {
    title: "Communication",
    rating: 4,
    quickSignals: ["Clear", "Structured"],
    summary: "Explains trade-offs clearly; tighten executive summaries.",
    strengths: ["Active listening", "Structured narratives"],
    concerns: ["Verbose on edge cases"],
  },
  {
    title: "Technical Depth",
    rating: 5,
    quickSignals: ["Deep expertise"],
    summary: "Strong .NET and API design depth with pragmatic system thinking.",
    strengths: ["System design", "API modeling"],
  },
  {
    title: "Problem Solving",
    rating: 4,
    quickSignals: ["Structured approach", "Methodical"],
    summary: "Decomposes problems well; occasionally needs a nudge on constraints.",
  },
  {
    title: "Collaboration",
    rating: 4,
    quickSignals: ["Cross-functional", "Team-oriented"],
    summary: "Works well with PM and design partners.",
  },
  {
    title: "Leadership",
    rating: 3,
    quickSignals: ["Emerging leader"],
    summary: "Shows influence in squad context; limited org-wide examples.",
    concerns: ["Few mentorship examples"],
  },
  {
    title: "Culture Fit",
    rating: 4,
    quickSignals: ["Values-aligned", "Adaptable"],
    summary: "Product-minded and comfortable with ambiguity.",
  },
  {
    title: "Ownership",
    rating: 4,
    quickSignals: ["Proactive", "Accountable"],
    summary: "Drives initiatives end-to-end with clear accountability.",
  },
];

export function buildDefaultInterviewFeedback(candidate: HiringCandidate): InterviewFeedbackBundle {
  const interview =
    candidate.interviews.find((i) => i.status === "Completed") ?? candidate.interviews[0];

  return {
    status: "draft",
    workflowStatus: "not_requested",
    adminComments: [],
    activity: [],
    interviewer: {
      interviewerName: interview?.interviewers[0] ?? "Irfan",
      interviewerRole: ".NET",
      interviewRound: interview?.round ?? "Technical · Round 2",
      interviewType: "Video",
      interviewDate: interview?.scheduledAt?.split("·")[0]?.trim() || "17 May 2026",
      durationMinutes: 18,
      interviewSessionStatus: deriveInterviewSessionStatus(candidate),
      recommendation: "strong_hire",
      skills: DEFAULT_SKILL_TITLES.map((title) => {
        const seed = SEED_SKILLS.find((s) => s.title === title);
        return createSkillEntry(title, seed);
      }),
      codeChallenge: {
        question: `Implement a rate limiter for an async API that allows at most N requests per second per client.

Requirements:
- Use a sliding window (not fixed buckets).
- \`TryAcquire()\` returns true when a request is allowed, false when rate-limited.
- Thread-safe for concurrent callers.
- No external dependencies beyond the standard library.`,
        code: `public class RateLimiter
{
    private readonly int _maxRequests;
    private readonly Queue<DateTime> _window = new();

    public RateLimiter(int maxRequests) => _maxRequests = maxRequests;

    public bool TryAcquire()
    {
        var now = DateTime.UtcNow;
        while (_window.Count > 0 && (now - _window.Peek()).TotalSeconds >= 1)
            _window.Dequeue();

        if (_window.Count >= _maxRequests) return false;
        _window.Enqueue(now);
        return true;
    }
}`,
      },
      recording: {
        url: undefined,
        duration: "18:24",
        uploadedAt: "17 May 2026, 14:30",
        transcript:
          "Candidate walked through system design for a multi-tenant hiring platform and discussed trade-offs between event-driven updates and polling.",
        aiSummary:
          "Strong system design narrative with clear scaling rationale. Communication dips briefly during async patterns discussion.",
        highlights: [
          { id: uid("hl"), label: "Strong answer — scaling architecture", time: "04:12", tone: "positive" },
          { id: uid("hl"), label: "Unclear explanation — async retries", time: "11:38", tone: "concern" },
          { id: uid("hl"), label: "Leadership example — squad initiative", time: "15:02", tone: "positive" },
        ],
      },
      additionalInterviewNotes: "",
      notes: [
        createNoteEntry({
          author: "Marcus Chen",
          role: "Interviewer",
          body: "Candidate explained scaling architecture clearly.",
          phase: "during",
          at: "2:14 PM",
        }),
        createNoteEntry({
          author: "Irfan",
          role: "Interviewer",
          body: "Weak async communication examples.",
          phase: "during",
          at: "2:18 PM",
        }),
        createNoteEntry({
          author: "Irfan",
          role: "Interviewer",
          body: "Follow up on system design trade-offs in feedback form.",
          phase: "after",
          at: "3:05 PM",
        }),
      ],
    },
    recruiter: {
      evaluationNotes:
        "Positive signals from technical panel. Candidate aligns with senior IC expectations.",
      cultureFit: "Collaborative, product-minded, and comfortable with ambiguity.",
      salaryAlignment: "Expectations within approved band for L5.",
      availability: "4 weeks notice · open to negotiate",
      recommendation: "Proceed to offer stage pending references.",
      concerns: "Limited exposure to large-scale observability tooling.",
      decisionSummary: "Recommend hire — pending HM sign-off.",
      expectedSalary: "€92k",
      budgetRange: "€95k–€110k",
      compensationStatus: "Within range",
    },
  };
}

const feedbackStore = new Map<string, InterviewFeedbackBundle>();

function migrateBundle(bundle: InterviewFeedbackBundle): InterviewFeedbackBundle {
  const rec = bundle.interviewer.recommendation;
  const recommendation =
    rec === ("average_hire" as HireRecommendation) ? "lean_hire" : rec;

  const skills = bundle.interviewer.skills.map((s) => {
    const legacy = s as SkillFeedbackEntry & { comment?: string };
    return {
      id: s.id,
      title: s.title,
      rating: s.rating,
      quickSignals: legacy.quickSignals ?? [],
      summary: legacy.summary ?? legacy.comment ?? "",
      detailedNotes: legacy.detailedNotes ?? "",
      strengths: legacy.strengths ?? [],
      concerns: legacy.concerns ?? [],
      custom: legacy.custom ?? !DEFAULT_SKILL_TITLES.includes(s.title as (typeof DEFAULT_SKILL_TITLES)[number]),
    };
  });

  const workflowStatus = resolveWorkflowStatus(bundle);

  return {
    ...bundle,
    workflowStatus,
    adminComments: bundle.adminComments ?? [],
    activity: bundle.activity ?? [],
    interviewer: {
      ...bundle.interviewer,
      recommendation,
      interviewRound: bundle.interviewer.interviewRound ?? "Technical · Round 2",
      interviewType: bundle.interviewer.interviewType ?? "Video",
      interviewSessionStatus:
        bundle.interviewer.interviewSessionStatus ??
        (bundle.interviewer.notes?.length ? "completed" : "scheduled"),
      notes: (bundle.interviewer.notes ?? []).map((n) => {
        const note = n as FeedbackNoteEntry & { phase?: FeedbackNotePhase };
        return { ...note, phase: note.phase ?? "during" };
      }),
      skills,
      codeChallenge: {
        question:
          bundle.interviewer.codeChallenge.question ??
          (bundle.interviewer.codeChallenge as { title?: string }).title ??
          "",
        code: bundle.interviewer.codeChallenge.code ?? "",
      },
      recording: {
        ...bundle.interviewer.recording,
        aiSummary: bundle.interviewer.recording.aiSummary ?? "",
        highlights: bundle.interviewer.recording.highlights ?? [],
      },
      additionalInterviewNotes: bundle.interviewer.additionalInterviewNotes ?? "",
    },
    recruiter: {
      ...bundle.recruiter,
      expectedSalary: bundle.recruiter.expectedSalary ?? "€92k",
      budgetRange: bundle.recruiter.budgetRange ?? "€95k–€110k",
      compensationStatus: bundle.recruiter.compensationStatus ?? "Within range",
    },
  };
}

export function getInterviewFeedback(candidate: HiringCandidate): InterviewFeedbackBundle {
  const stored = feedbackStore.get(candidate.id);
  if (stored) return migrateBundle(structuredClone(stored));
  const fresh = buildDefaultInterviewFeedback(candidate);
  feedbackStore.set(candidate.id, structuredClone(fresh));
  return structuredClone(fresh);
}

export function saveInterviewFeedback(
  candidateId: string,
  bundle: InterviewFeedbackBundle,
  status: "draft" | "submitted",
  actorName?: string,
): InterviewFeedbackBundle {
  let next = { ...bundle, status };
  if (status === "submitted" && actorName) {
    next = markFeedbackSubmitted(next, actorName);
  }
  next = migrateBundle(next);
  feedbackStore.set(candidateId, structuredClone(next));
  return structuredClone(next);
}

export function persistInterviewFeedback(
  candidateId: string,
  bundle: InterviewFeedbackBundle,
): InterviewFeedbackBundle {
  const next = migrateBundle(bundle);
  feedbackStore.set(candidateId, structuredClone(next));
  return structuredClone(next);
}

export function openInterviewFeedback(
  candidateId: string,
  bundle: InterviewFeedbackBundle,
  actorName: string,
): InterviewFeedbackBundle {
  const next = migrateBundle(markFeedbackOpened(bundle, actorName));
  feedbackStore.set(candidateId, structuredClone(next));
  return structuredClone(next);
}

export function saveInterviewFeedbackDraft(
  candidateId: string,
  bundle: InterviewFeedbackBundle,
  actorName: string,
): InterviewFeedbackBundle {
  const next = migrateBundle(markDraftSaved({ ...bundle, status: "draft" }, actorName));
  feedbackStore.set(candidateId, structuredClone(next));
  return structuredClone(next);
}

export function submitFeedbackRequest(
  candidateId: string,
  bundle: InterviewFeedbackBundle,
  input: {
    actorName: string;
    message?: string;
    sendEmail: boolean;
    candidate: HiringCandidate;
    jobTitle: string;
  },
): InterviewFeedbackBundle {
  let next = requestInterviewFeedback(bundle, input);

  addFeedbackRequestNotification({
    candidateId,
    candidateName: input.candidate.name,
    roleTitle: input.jobTitle,
    round: bundle.interviewer.interviewRound,
    requestedBy: input.actorName,
    assigneeName: bundle.interviewer.interviewerName,
  });

  if (input.sendEmail) {
    void sendFeedbackRequestEmail({
      to: bundle.interviewer.interviewerName,
      subject: `Feedback requested for ${input.candidate.name} interview`,
      candidateName: input.candidate.name,
      roleTitle: input.jobTitle,
      round: bundle.interviewer.interviewRound,
      interviewDate: bundle.interviewer.interviewDate,
      requestedBy: input.actorName,
    });
  }

  next = migrateBundle(next);
  feedbackStore.set(candidateId, structuredClone(next));
  return structuredClone(next);
}

export function postAdminFeedbackComment(
  candidateId: string,
  bundle: InterviewFeedbackBundle,
  input: { author: string; body: string },
): InterviewFeedbackBundle {
  const next = migrateBundle(addAdminComment(bundle, input));
  feedbackStore.set(candidateId, structuredClone(next));
  return structuredClone(next);
}

export function averageSkillRating(skills: SkillFeedbackEntry[]): number {
  const rated = skills.filter((s) => s.rating > 0);
  if (rated.length === 0) return 0;
  const sum = rated.reduce((acc, s) => acc + s.rating, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

export function getRecommendationLabel(value: HireRecommendation | null): string {
  const opt = RECOMMENDATION_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? "Not set";
}

export function deriveRatingInsights(avg: number, recommendation: HireRecommendation | null) {
  const confidenceScore = avg >= 4.5 ? 92 : avg >= 4 ? 86 : avg >= 3 ? 72 : avg > 0 ? 58 : 0;
  const percentile = avg >= 4.5 ? 12 : avg >= 4 ? 18 : avg >= 3 ? 35 : 50;
  const label =
    recommendation === "strong_hire"
      ? "Strong Hire"
      : recommendation === "hire"
        ? "Hire"
        : recommendation === "lean_hire"
          ? "Lean Hire"
          : recommendation === "no_hire"
            ? "No Hire"
            : recommendation === "strong_no_hire"
              ? "Strong No Hire"
              : avg >= 4.5
                ? "Strong Hire"
                : avg >= 4
                  ? "Hire"
                  : "Pending";

  return { confidenceScore, percentile, label };
}

export type InterviewerFeedbackValidation = {
  valid: boolean;
  errors: string[];
};

export function validateInterviewerFeedbackSubmit(
  data: InterviewerFeedbackData,
): InterviewerFeedbackValidation {
  const errors: string[] = [];
  if (!data.recommendation) {
    errors.push("Select a hiring recommendation.");
  }
  const ratedSkills = data.skills.filter((s) => s.rating > 0);
  if (ratedSkills.length === 0) {
    errors.push("Rate at least one skill area.");
  }
  return { valid: errors.length === 0, errors };
}

export function hireRecommendationToInterviewResult(
  recommendation: HireRecommendation | null,
): "Strong Hire" | "Hire" | "Hold" | "No Hire" | undefined {
  switch (recommendation) {
    case "strong_hire":
      return "Strong Hire";
    case "hire":
      return "Hire";
    case "lean_hire":
      return "Hold";
    case "no_hire":
    case "strong_no_hire":
      return "No Hire";
    default:
      return undefined;
  }
}

export function computeFeedbackCompletion(data: InterviewerFeedbackData): number {
  if (data.skills.length === 0) return data.recommendation ? 15 : 0;

  const skillPortion =
    data.skills.reduce((acc, skill) => {
      let score = 0;
      if (skill.rating > 0) score += 0.35;
      if (skill.summary.trim()) score += 0.25;
      if (skill.quickSignals.length > 0) score += 0.2;
      if (skill.strengths.length > 0 || skill.concerns.length > 0 || skill.detailedNotes.trim()) {
        score += 0.2;
      }
      return acc + score;
    }, 0) / data.skills.length;

  const recommendationPortion = data.recommendation ? 0.15 : 0;
  return Math.min(100, Math.round((skillPortion * 0.85 + recommendationPortion) * 100));
}

export const RECOMMENDATION_OPTIONS: {
  value: HireRecommendation;
  label: string;
  shortLabel: string;
  className: string;
  icon: "x" | "minus" | "tilde" | "check" | "star";
}[] = [
  {
    value: "strong_no_hire",
    label: "Strong No Hire",
    shortLabel: "Strong No",
    className:
      "border-red-200/80 bg-red-50/80 text-red-800 hover:border-red-300 data-[selected=true]:border-red-600 data-[selected=true]:bg-red-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_4px_12px_-4px_rgba(220,38,38,0.45)]",
    icon: "x",
  },
  {
    value: "no_hire",
    label: "No Hire",
    shortLabel: "No",
    className:
      "border-orange-200/80 bg-orange-50/80 text-orange-900 hover:border-orange-300 data-[selected=true]:border-orange-600 data-[selected=true]:bg-orange-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_4px_12px_-4px_rgba(234,88,12,0.4)]",
    icon: "minus",
  },
  {
    value: "lean_hire",
    label: "Lean Hire",
    shortLabel: "Lean",
    className:
      "border-amber-200/80 bg-amber-50/80 text-amber-900 hover:border-amber-300 data-[selected=true]:border-amber-600 data-[selected=true]:bg-amber-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_4px_12px_-4px_rgba(217,119,6,0.4)]",
    icon: "tilde",
  },
  {
    value: "hire",
    label: "Hire",
    shortLabel: "Hire",
    className:
      "border-emerald-200/80 bg-emerald-50/80 text-emerald-900 hover:border-emerald-300 data-[selected=true]:border-emerald-600 data-[selected=true]:bg-emerald-600 data-[selected=true]:text-white data-[selected=true]:shadow-[0_4px_12px_-4px_rgba(5,150,105,0.4)]",
    icon: "check",
  },
  {
    value: "strong_hire",
    label: "Strong Hire",
    shortLabel: "Strong",
    className:
      "border-green-300/80 bg-green-50/80 text-green-950 hover:border-green-500 data-[selected=true]:border-green-700 data-[selected=true]:bg-green-700 data-[selected=true]:text-white data-[selected=true]:shadow-[0_4px_14px_-4px_rgba(21,128,61,0.45)]",
    icon: "star",
  },
];
