import { getSubtypeLabel } from "./questionSubtypes";
import type { Difficulty, QuestionStatus, QuestionSubtype, QuestionType } from "./types";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  coding: "Coding",
  database: "Database",
  mcq: "MCQ",
  comprehension: "Comprehension",
  "open-ended": "Open-ended",
  "fill-blank": "Fill-in-the-blank",
  debug: "Debug Snippet",
};

/** e.g. Coding - Frontend */
export function formatQuestionTypeLabel(
  type: QuestionType,
  subtype?: QuestionSubtype,
): string {
  const base = QUESTION_TYPE_LABELS[type];
  if (subtype) {
    return `${base} - ${getSubtypeLabel(subtype)}`;
  }
  return base;
}

export const QUESTION_TYPE_ACCENT: Record<QuestionType, string> = {
  coding: "var(--qp-type-coding)",
  database: "var(--qp-type-database)",
  mcq: "var(--qp-type-mcq)",
  comprehension: "var(--qp-type-comprehension)",
  "open-ended": "var(--qp-type-open-ended)",
  "fill-blank": "var(--qp-type-fill-blank)",
  debug: "var(--qp-type-debug)",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const STATUS_LABELS: Record<QuestionStatus, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

export const STATUS_DOT: Record<QuestionStatus, string> = {
  published: "bg-emerald-500",
  draft: "bg-amber-400",
  archived: "bg-muted/60",
};

export const EMPTY_CELL = "—";
