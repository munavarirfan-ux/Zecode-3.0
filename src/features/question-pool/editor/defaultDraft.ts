import type { MCQOption, QuestionSubtype, QuestionType } from "../types";
import type { QuestionDraft } from "./draftTypes";

function defaultMcqOptions(): MCQOption[] {
  return [
    { id: "a", label: "", isCorrect: true },
    { id: "b", label: "", isCorrect: false },
    { id: "c", label: "", isCorrect: false },
    { id: "d", label: "", isCorrect: false },
  ];
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
    mcqOptions: defaultMcqOptions(),
    testCases: [{ id: "t1", input: "", expected: "", hidden: false }],
    starterCode: "",
    functionName: "",
    returnType: "number",
    parameters: [],
    schemaId: "",
    expectedQuery: "",
    passage: "",
    comprehensionQuestions: "",
    functionSignature: "",
    buggyCode: "",
    fillBlankTemplate: "",
  };
}
