import type { AssessmentFormDraft } from "./types";
import { DEFAULT_GUIDELINES_TEXT, DURATION_OPTIONS } from "./types";

export const ASSESSMENT_FORM_STEPS = [
  { id: 1, key: "details", label: "Assessment Details" },
  { id: 2, key: "roles", label: "Roles & Tags" },
  { id: 3, key: "questions", label: "Questions" },
  { id: 4, key: "guidelines", label: "Guidelines" },
] as const;

export type AssessmentFormStepIndex = 0 | 1 | 2 | 3;

const defaultAppliesTo = { mcq: false, comprehension: false };

export function createEmptyAssessmentDraft(): AssessmentFormDraft {
  return {
    name: "",
    durationMinutes: 60,
    durationIsCustom: false,
    validityDays: 7,
    qualifyingPercentage: 70,
    partialScoring: false,
    partialScoringAppliesTo: { ...defaultAppliesTo },
    negativeMarking: false,
    negativeMarkingAppliesTo: { ...defaultAppliesTo },
    negativePenaltyPercent: 25,
    role: "",
    difficulty: "Intermediate",
    tags: [],
    languages: [],
    selectedQuestions: [],
    guidelines: DEFAULT_GUIDELINES_TEXT,
  };
}

export function hasAssessmentWizardProgress(
  draft: AssessmentFormDraft,
  stepIndex: number,
): boolean {
  if (stepIndex > 0) return true;
  const empty = createEmptyAssessmentDraft();
  if (draft.name.trim()) return true;
  if (draft.role.trim()) return true;
  if (draft.tags.length > 0) return true;
  if (draft.languages.length > 0) return true;
  if (draft.selectedQuestions.length > 0) return true;
  if (draft.guidelines.trim() !== empty.guidelines.trim()) return true;
  if (draft.difficulty !== empty.difficulty) return true;
  if (draft.durationMinutes !== empty.durationMinutes || draft.durationIsCustom) return true;
  if (draft.validityDays !== empty.validityDays) return true;
  if (draft.qualifyingPercentage !== empty.qualifyingPercentage) return true;
  if (draft.partialScoring || draft.negativeMarking) return true;
  return false;
}

export function isDurationValid(draft: AssessmentFormDraft): boolean {
  return draft.durationMinutes > 0 && draft.durationMinutes <= 480;
}

export function isAssessmentStepValid(stepIndex: number, draft: AssessmentFormDraft): boolean {
  switch (stepIndex) {
    case 0:
      return (
        draft.name.trim().length > 0 &&
        draft.qualifyingPercentage > 0 &&
        draft.qualifyingPercentage <= 100 &&
        isDurationValid(draft) &&
        draft.validityDays >= 1 &&
        draft.validityDays <= 90
      );
    case 1:
      return draft.role.trim().length > 0;
    case 2:
      return draft.selectedQuestions.length > 0;
    case 3:
      return draft.guidelines.trim().length > 0;
    default:
      return true;
  }
}

export function maxReachableAssessmentStep(draft: AssessmentFormDraft): number {
  let max = 0;
  for (let i = 0; i < ASSESSMENT_FORM_STEPS.length; i++) {
    if (!isAssessmentStepValid(i, draft)) break;
    max = i;
  }
  return max;
}

export function assessmentTotals(draft: AssessmentFormDraft) {
  const totalMarks = draft.selectedQuestions.reduce((s, q) => s + q.marks, 0);
  const totalMinutes = draft.selectedQuestions.reduce((s, q) => s + q.timeLimitMinutes, 0);
  return {
    count: draft.selectedQuestions.length,
    totalMarks,
    totalMinutes,
  };
}

export function isPresetDuration(minutes: number): boolean {
  return (DURATION_OPTIONS as readonly number[]).includes(minutes);
}
