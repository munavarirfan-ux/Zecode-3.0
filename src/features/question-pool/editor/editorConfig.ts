import type { QuestionType } from "../types";

export type EditorStep = { id: string; label: string };

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

export function getEditorSteps(type: QuestionType): EditorStep[] {
  return EDITOR_STEPS[type] ?? [];
}

export function hasStepper(type: QuestionType): boolean {
  return EDITOR_STEPS[type] !== null;
}
