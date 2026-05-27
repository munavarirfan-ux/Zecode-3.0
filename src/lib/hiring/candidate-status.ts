import type { LucideIcon } from "lucide-react";
import {
  Check,
  Circle,
  ClipboardList,
  Clock,
  Mail,
  Minus,
  PartyPopper,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import type { CandidateVerdict } from "./types";
import type { InterviewOperationalStatus } from "./interviewKanbanOps";
import type { CandidateCardStage } from "./stage-actions";

export type UnifiedStatus = {
  icon: LucideIcon;
  label: string;
  textColor: string;
  iconColor: string;
};

const STATUS = {
  gray: {
    textColor: "text-zinc-600 dark:text-zinc-400",
    iconColor: "text-zinc-500 dark:text-zinc-400",
  },
  blue: {
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    textColor: "text-amber-800 dark:text-amber-300",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  green: {
    textColor: "text-emerald-700 dark:text-emerald-300",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  red: {
    textColor: "text-red-700 dark:text-red-300",
    iconColor: "text-red-600 dark:text-red-400",
  },
  purple: {
    textColor: "text-violet-700 dark:text-violet-300",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
} as const;

function withColors(
  icon: LucideIcon,
  label: string,
  tone: keyof typeof STATUS,
): UnifiedStatus {
  const c = STATUS[tone];
  return { icon, label, textColor: c.textColor, iconColor: c.iconColor };
}

function isInterviewRound(stage: CandidateCardStage): boolean {
  return (
    stage === "interview_r1" || stage === "interview_r2" || stage === "interview_r3"
  );
}

function isInterviewRejectedStatus(status?: InterviewOperationalStatus): boolean {
  return status === "Rejected" || status === "No Show" || status === "Cancelled";
}

/** Verdict-only status for cards and badges */
export function getVerdictStatus(verdict: CandidateVerdict): UnifiedStatus | null {
  if (verdict === "hire") return withColors(ThumbsUp, "Hire", "green");
  if (verdict === "no_hire") return withColors(ThumbsDown, "No hire", "red");
  if (verdict === "neutral") return withColors(Minus, "Neutral", "amber");
  return null;
}

/** Unified status line — combines pipeline stage, verdict, and interview ops status */
export function computeUnifiedStatus(
  cardStage: CandidateCardStage,
  verdict: CandidateVerdict = "pending",
  interviewStatus?: InterviewOperationalStatus,
): UnifiedStatus {
  if (cardStage === "rejected" || isInterviewRejectedStatus(interviewStatus)) {
    return withColors(X, "Rejected", "red");
  }

  if (cardStage === "hired") {
    return withColors(PartyPopper, "Hired", "green");
  }

  if (cardStage === "pending_feedback" || interviewStatus === "Feedback Pending") {
    return withColors(Clock, "Pending feedback", "amber");
  }

  if (cardStage === "offer_draft") {
    return withColors(Mail, "Draft offer", "purple");
  }
  if (cardStage === "offer_sent" || cardStage === "offer") {
    return withColors(Mail, "Offer sent", "purple");
  }
  if (cardStage === "offer_accepted") {
    return withColors(Check, "Offer accepted", "green");
  }

  const verdictStatus = getVerdictStatus(verdict);

  if (cardStage === "shortlisted") {
    return verdictStatus ?? withColors(Check, "Shortlisted", "blue");
  }

  if (cardStage === "applied") {
    return verdictStatus ?? withColors(ClipboardList, "Awaiting review", "gray");
  }

  if (isInterviewRound(cardStage)) {
    if (verdictStatus) return verdictStatus;

    if (
      interviewStatus === "Completed" ||
      interviewStatus === "Qualified" ||
      interviewStatus === "Moved to Next Stage"
    ) {
      return withColors(Check, "Round complete", "green");
    }

    return withColors(Clock, "Interview pending", "amber");
  }

  return withColors(Circle, "Unknown", "gray");
}
