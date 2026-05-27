import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  Eye,
  Mail,
  MessageCircle,
  MoveRight,
  Undo2,
} from "lucide-react";
import type { HiringCandidate, CandidateVerdict } from "./types";
import type { InterviewOperationalStatus } from "./interviewKanbanOps";
import {
  applicantsStatsColumnId,
  getCandidateStage,
  hireOffersKanbanColumnId,
  type HireOffersKanbanColumnId,
  type HiringStageName,
} from "./stages";

export type CandidateCardStage =
  | "applied"
  | "shortlisted"
  | "interview_r1"
  | "interview_r2"
  | "interview_r3"
  | "pending_feedback"
  | "offer_draft"
  | "offer_sent"
  | "offer_accepted"
  | "offer"
  | "hired"
  | "rejected";

export type PrimaryActionId =
  | "review"
  | "moveToInterview"
  | "schedule"
  | "requestFeedback"
  | "sendOffer"
  | "onboarding"
  | "reopen"
  | "view"
  | "viewOffer"
  | "viewSignedOffer"
  | "moveNext"
  | "viewProfile";

/** Primary button color category — 4 semantic action types app-wide */
export type ActionCategory = "review" | "schedule" | "advance" | "view";

export type StageActionAppearance = "solid" | "surface";

export type StageAction = {
  label: string;
  icon: LucideIcon;
  action: PrimaryActionId;
  category: ActionCategory;
  /** Surface style — tinted background, semantic text (no solid fill) */
  appearance?: StageActionAppearance;
  /** Explicit kanban button variant (overrides category mapping) */
  buttonVariant?: StageButtonVariant;
};

export type StageButtonVariant =
  | ActionCategory
  | "review-surface"
  | "feedback-surface"
  | "advance-surface"
  | "advance-green-surface"
  | "primary"
  | "secondary"
  | "tertiary"
  | "soft";

/** Short labels for narrow kanban cards — full label via tooltip */
const KANBAN_SHORT_LABELS: Partial<Record<PrimaryActionId, string>> = {
  review: "Review",
  moveToInterview: "Move to Interview",
  schedule: "Schedule",
  requestFeedback: "Feedback",
  sendOffer: "Send Offer",
  viewOffer: "View offer",
  viewSignedOffer: "View signed offer",
  onboarding: "Onboard",
  view: "View",
  viewProfile: "View",
  moveNext: "Next stage",
  reopen: "Reopen",
};

export function getKanbanActionLabels(action: StageAction): {
  short: string;
  full: string;
} {
  const full = action.label;
  const short = KANBAN_SHORT_LABELS[action.action] ?? full;
  return { short, full };
}

/** Kanban card buttons — surface styles for review / move / feedback */
export function getKanbanStageButtonVariant(action: StageAction): StageButtonVariant {
  return getStageButtonVariant(action);
}

/** Resolve Button `variant` from stage action (category + action + appearance) */
export function getStageButtonVariant(action: StageAction): StageButtonVariant {
  if (action.buttonVariant) return action.buttonVariant;
  if (action.action === "requestFeedback") return "feedback-surface";
  if (action.action === "moveNext") return "advance-green-surface";
  if (action.action === "moveToInterview" && action.appearance === "surface") {
    return "advance-surface";
  }
  if (
    action.appearance === "surface" &&
    (action.category === "review" || action.action === "review")
  ) {
    return "review-surface";
  }
  return action.category;
}

/** Map primary/menu actions to button category for consistent CTAs */
export function getActionCategory(action: PrimaryActionId | KanbanMenuAction): ActionCategory {
  switch (action) {
    case "review":
    case "requestFeedback":
      return "review";
    case "schedule":
    case "sendOffer":
    case "reschedule":
    case "sendEmail":
      return "schedule";
    case "moveToInterview":
    case "moveNext":
    case "onboarding":
      return "advance";
    case "view":
    case "viewOffer":
    case "viewSignedOffer":
    case "viewProfile":
    case "reopen":
    default:
      return "view";
  }
}

export type KanbanMenuAction =
  | "schedule"
  | "moveNext"
  | "sendEmail"
  | "viewProfile"
  | "reject"
  | "moveToInterview"
  | "requestFeedback"
  | "addNote"
  | "setVerdictHire"
  | "setVerdictNoHire"
  | "setVerdictNeutral"
  | "reschedule"
  | "cancelInterview";

const MENU_LABELS: Record<KanbanMenuAction, string> = {
  schedule: "Schedule interview",
  moveNext: "Move to next stage",
  sendEmail: "Send email",
  viewProfile: "View profile",
  reject: "Reject",
  moveToInterview: "Move to Interview",
  requestFeedback: "Request feedback",
  addNote: "Add note",
  setVerdictHire: "Hire",
  setVerdictNoHire: "No Hire",
  setVerdictNeutral: "Neutral",
  reschedule: "Reschedule interview",
  cancelInterview: "Cancel interview",
};

export function getMenuActionLabel(action: KanbanMenuAction): string {
  return MENU_LABELS[action];
}

export type StageActionContext = {
  cardStage: CandidateCardStage;
  verdict?: CandidateVerdict;
  interviewStatus?: InterviewOperationalStatus;
  pipelineStage?: HiringStageName;
};

function hasPendingInterviewFeedback(candidate: HiringCandidate): boolean {
  return (
    candidate.interviews?.some(
      (i) => i.status === "Completed" && i.feedbackStatus === "Pending",
    ) ?? false
  );
}

function isInterviewRound(stage: CandidateCardStage): boolean {
  return (
    stage === "interview_r1" || stage === "interview_r2" || stage === "interview_r3"
  );
}

function isInterviewRejectedStatus(status?: InterviewOperationalStatus): boolean {
  return status === "Rejected" || status === "No Show" || status === "Cancelled";
}

/** Resolve kanban card stage from pipeline + candidate substage/column */
export function resolveCandidateCardStage(
  candidate: HiringCandidate,
  pipelineStage?: HiringStageName,
): CandidateCardStage {
  const stage = pipelineStage ?? getCandidateStage(candidate);

  if (stage === "Rejected") return "rejected";

  if (stage === "Hired & Offers") {
    return resolveOfferCardStage(hireOffersKanbanColumnId(candidate));
  }

  if (stage === "Interviews") {
    if (hasPendingInterviewFeedback(candidate)) return "pending_feedback";
    const sub = candidate.currentSubstage ?? "";
    if (sub.includes("Technical Round 2") || candidate.kanbanColumn === "tech-2") {
      return "interview_r2";
    }
    if (sub.includes("HR Round") || candidate.kanbanColumn === "hr-round") {
      return "interview_r3";
    }
    return "interview_r1";
  }

  if (stage === "Screening") {
    return applicantsStatsColumnId(candidate) === "shortlisted" ? "shortlisted" : "applied";
  }

  return "applied";
}

function resolveOfferCardStage(column: HireOffersKanbanColumnId): CandidateCardStage {
  switch (column) {
    case "hired":
      return "hired";
    case "offer-accepted":
      return "offer_accepted";
    case "offer-sent":
      return "offer_sent";
    case "offer-draft":
    default:
      return "offer_draft";
  }
}

/** Single primary CTA for the card — label, icon, and button variant */
export function getStageAction(ctx: StageActionContext): StageAction {
  const { cardStage, verdict = "pending", interviewStatus } = ctx;

  if (cardStage === "applied") {
    return {
      label: "Review",
      icon: ClipboardCheck,
      action: "review",
      category: "review",
      appearance: "surface",
    };
  }
  if (cardStage === "shortlisted") {
    return {
      label: "Move to Interview",
      icon: ArrowRight,
      action: "moveToInterview",
      category: "advance",
      appearance: "surface",
    };
  }
  if (cardStage === "pending_feedback") {
    return {
      label: "Request Feedback",
      icon: MessageCircle,
      action: "requestFeedback",
      category: "review",
      appearance: "surface",
    };
  }
  if (cardStage === "offer_draft") {
    return {
      label: "Send offer",
      icon: Mail,
      action: "sendOffer",
      category: "schedule",
      buttonVariant: "primary",
    };
  }
  if (cardStage === "offer_sent") {
    return {
      label: "View offer",
      icon: Eye,
      action: "viewOffer",
      category: "view",
      buttonVariant: "tertiary",
    };
  }
  if (cardStage === "offer_accepted") {
    return {
      label: "View signed offer",
      icon: Eye,
      action: "viewSignedOffer",
      category: "view",
      buttonVariant: "secondary",
    };
  }
  if (cardStage === "offer") {
    return {
      label: "Send offer",
      icon: Mail,
      action: "sendOffer",
      category: "schedule",
      buttonVariant: "primary",
    };
  }
  if (cardStage === "hired") {
    return {
      label: "Onboard",
      icon: CheckCircle,
      action: "onboarding",
      category: "advance",
      buttonVariant: "soft",
    };
  }
  if (cardStage === "rejected") {
    return { label: "View Profile", icon: Eye, action: "viewProfile", category: "view" };
  }

  if (isInterviewRound(cardStage)) {
    if (isInterviewRejectedStatus(interviewStatus)) {
      return { label: "View Schedule", icon: Eye, action: "view", category: "view" };
    }
    if (interviewStatus === "Feedback Pending") {
      return {
        label: "Request Feedback",
        icon: MessageCircle,
        action: "requestFeedback",
        category: "review",
        appearance: "surface",
      };
    }
    if (
      interviewStatus === "Completed" ||
      interviewStatus === "Qualified" ||
      interviewStatus === "Moved to Next Stage" ||
      verdict === "hire" ||
      verdict === "no_hire" ||
      verdict === "neutral"
    ) {
      return {
        label: "Move to next stage",
        icon: MoveRight,
        action: "moveNext",
        category: "advance",
        appearance: "surface",
      };
    }
    if (interviewStatus === "Scheduled" || interviewStatus === "Ongoing") {
      return { label: "View Schedule", icon: Eye, action: "view", category: "view" };
    }
    return {
      label: "Schedule Interview",
      icon: Calendar,
      action: "schedule",
      category: "schedule",
    };
  }

  return { label: "View profile", icon: Eye, action: "viewProfile", category: "view" };
}

/** Kebab menu items — excludes actions that duplicate the primary button */
export function getKebabMenuActions(ctx: StageActionContext): KanbanMenuAction[] {
  const primary = getStageAction(ctx);
  const { cardStage, pipelineStage } = ctx;
  const items: KanbanMenuAction[] = ["viewProfile"];

  const addIfNotPrimary = (action: KanbanMenuAction, primaryId: PrimaryActionId) => {
    if (primary.action !== primaryId) items.push(action);
  };

  if (pipelineStage === "Interviews" || isInterviewRound(cardStage)) {
    addIfNotPrimary("schedule", "schedule");
    addIfNotPrimary("moveNext", "moveNext");
    addIfNotPrimary("requestFeedback", "requestFeedback");
    if (ctx.interviewStatus === "Scheduled" || ctx.interviewStatus === "Ongoing") {
      items.push("reschedule", "cancelInterview");
    }
  } else if (pipelineStage === "Screening") {
    addIfNotPrimary("moveToInterview", "moveToInterview");
    addIfNotPrimary("schedule", "schedule");
  } else if (pipelineStage === "Hired & Offers") {
    items.push("sendEmail");
    if (cardStage === "offer_draft") addIfNotPrimary("sendEmail", "sendOffer");
    if (cardStage === "offer_sent") addIfNotPrimary("viewProfile", "viewOffer");
    if (cardStage === "offer_accepted") addIfNotPrimary("viewProfile", "viewSignedOffer");
  }

  items.push("addNote");
  items.push("setVerdictHire", "setVerdictNoHire", "setVerdictNeutral");

  if (cardStage !== "rejected") {
    items.push("reject");
  }

  return dedupe(items);
}

function dedupe<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Short relative applied date: 2d, 1w, 3w, then "12 May" */
export function formatRelativeApplied(iso: string, now = new Date()): string {
  const applied = new Date(iso);
  if (Number.isNaN(applied.getTime())) return iso;

  const diffMs = now.getTime() - applied.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Today";
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 28) return `${Math.floor(diffDays / 7)}w`;

  return applied.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatAppliedTooltip(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export type PipelineTenure = {
  appliedIso: string;
  appliedLabel: string;
  daysInPipeline: number;
  daysLabel: string;
};

/** Days since application — used on candidate report timeline. */
export function getPipelineTenure(iso: string, now = new Date()): PipelineTenure | null {
  const applied = new Date(iso);
  if (Number.isNaN(applied.getTime())) return null;

  const diffMs = Math.max(0, now.getTime() - applied.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysLabel =
    days === 0 ? "Less than 1 day" : days === 1 ? "1 day in pipeline" : `${days} days in pipeline`;

  return {
    appliedIso: iso,
    appliedLabel: formatAppliedTooltip(iso),
    daysInPipeline: days,
    daysLabel,
  };
}

export function getCandidateInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function getUnreadEmailCount(candidate: HiringCandidate): number {
  if (typeof candidate.unreadEmails === "number") return candidate.unreadEmails;
  return 0;
}
