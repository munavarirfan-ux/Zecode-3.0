import type { ComprehensionQuestion, MCQOption, QuestionSubtype, QuestionType } from "../types";
import type { QuestionDraft } from "./draftTypes";

function defaultMcqOptions(): MCQOption[] {
  return [
    { id: "a", label: "", isCorrect: true },
    { id: "b", label: "", isCorrect: false },
    { id: "c", label: "", isCorrect: false },
    { id: "d", label: "", isCorrect: false },
  ];
}

export function defaultComprehensionQuestion(): ComprehensionQuestion {
  return {
    id: `cq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    questionBody: "",
    answerType: "single",
    options: [
      { id: "a", label: "", isCorrect: true },
      { id: "b", label: "", isCorrect: false },
      { id: "c", label: "", isCorrect: false },
      { id: "d", label: "", isCorrect: false },
    ],
  };
}

export function createEmptyDraft(type: QuestionType, subtype?: QuestionSubtype): QuestionDraft {
  return {
    type,
    subtype,
    difficulty: "medium",
    title: "",
    bodyMarkdown: "",
    skill: "",
    tags: [],
    answerType: "single",
    mcqOptions: defaultMcqOptions(),
    testCases: [{ id: "t1", input: "", expected: "", hidden: false }],
    starterCode: "",
    functionName: "",
    returnType: "number",
    parameters: [],
    referenceImage: "",
    uiRemarks: "",
    evaluationRemarks: "",
    frontendLinks: [],
    schemaId: "",
    expectedQuery: "",
    passage: "",
    compQuestions: [defaultComprehensionQuestion()],
    functionSignature: "",
    buggyCode: "",
    codeLanguage: "",
    fillBlankTemplate: "",
  };
}
