import type { QuestionSubtype, QuestionType } from "../types";

export type EditorStep = { id: string; label: string };

const CODING_BACKEND_STEPS: EditorStep[] = [
  { id: "question", label: "Question Details" },
  { id: "function-details", label: "Function Details" },
  { id: "test-cases", label: "Test Cases" },
];

const CODING_FRONTEND_STEPS: EditorStep[] = [
  { id: "question", label: "Question Details" },
  { id: "image-remarks", label: "Image / Remarks" },
];

export const EDITOR_STEPS: Record<QuestionType, EditorStep[] | null> = {
  mcq: [
    { id: "question", label: "Question" },
    { id: "options", label: "Options" },
    { id: "tags", label: "Tags" },
    { id: "review", label: "Review" },
  ],
  coding: [
    { id: "question", label: "Question" },
    { id: "test-cases", label: "Test Cases" },
    { id: "starter", label: "Starter Code" },
    { id: "review", label: "Review" },
  ],
  database: [
    { id: "schema", label: "Data Model" },
    { id: "question", label: "Question" },
    { id: "query", label: "Expected Query" },
    { id: "review", label: "Review" },
  ],
  comprehension: [
    { id: "passage", label: "Passage" },
    { id: "questions", label: "Questions" },
    { id: "review", label: "Review" },
  ],
  debug: [
    { id: "question", label: "Question" },
    { id: "function", label: "Function" },
    { id: "test-cases", label: "Test Cases" },
    { id: "buggy", label: "Buggy Code" },
    { id: "review", label: "Review" },
  ],
  "open-ended": null,
  "fill-blank": null,
};

export function getEditorSteps(type: QuestionType, subtype?: QuestionSubtype): EditorStep[] {
  if (type === "coding" && subtype === "backend") return CODING_BACKEND_STEPS;
  if (type === "coding" && subtype === "frontend") return CODING_FRONTEND_STEPS;
  return EDITOR_STEPS[type] ?? [];
}

export function hasStepper(type: QuestionType, subtype?: QuestionSubtype): boolean {
  if (type === "coding" && subtype === "backend") return true;
  if (type === "coding" && subtype === "frontend") return true;
  return EDITOR_STEPS[type] !== null;
}
