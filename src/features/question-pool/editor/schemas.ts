import { z } from "zod";
import { ALL_QUESTION_SUBTYPES } from "../questionSubtypes";
import type { QuestionType } from "../types";
import { getEditorSteps } from "./editorConfig";

const difficulty = z.enum(["easy", "medium", "hard"]);

export const questionDraftSchema = z.object({
  type: z.string(),
  subtype: z.enum(ALL_QUESTION_SUBTYPES).optional(),
  difficulty,
  title: z.string().min(3, "Title is required"),
  bodyMarkdown: z.string().min(10, "Description is required"),
  skill: z.string().min(1, "Skill is required"),
  tags: z.array(z.string()),
  answerType: z.enum(["single", "multiple"]),
  mcqOptions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      isCorrect: z.boolean(),
    }),
  ),
  testCases: z.array(
    z.object({
      id: z.string(),
      input: z.string(),
      expected: z.string(),
      hidden: z.boolean(),
    }),
  ),
  starterCode: z.string(),
  functionName: z.string(),
  returnType: z.string(),
  parameters: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
    }),
  ),
  referenceImage: z.string(),
  uiRemarks: z.string(),
  evaluationRemarks: z.string(),
  frontendLinks: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      label: z.string(),
    }),
  ),
  schemaId: z.string(),
  expectedQuery: z.string(),
  passage: z.string(),
  compQuestions: z.array(
    z.object({
      id: z.string(),
      questionBody: z.string(),
      answerType: z.enum(["single", "multiple"]),
      options: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          isCorrect: z.boolean(),
        }),
      ),
    }),
  ),
  functionSignature: z.string(),
  buggyCode: z.string(),
  codeLanguage: z.string(),
  fillBlankTemplate: z.string(),
});

export type QuestionDraftFormValues = z.infer<typeof questionDraftSchema>;

export function validateStep(type: QuestionType, stepId: string, values: QuestionDraftFormValues): string | null {
  switch (`${type}:${stepId}`) {
    case "coding:question":
    case "database:question":
    case "debug:question":
      if (!values.title.trim()) return "Add a question title";
      if (!values.bodyMarkdown.trim()) return "Add a question description";
      if (!values.skill.trim()) return "Select or enter a skill";
      return null;
    case "coding:test-cases": {
      if (!values.testCases.some((t) => t.input.trim() && t.expected.trim())) {
        return "Add at least one test case with input and expected output";
      }
      return null;
    }
    case "coding:function-details":
      if (!values.functionName.trim()) return "Add a function name";
      if (!values.returnType.trim()) return "Select a return type";
      if (!values.parameters.some((p) => p.name.trim())) return "Add at least one parameter";
      return null;
    case "coding:image-remarks": {
      const hasImage = values.referenceImage.trim().length > 0;
      const hasRemarks = values.uiRemarks.trim().length > 0;
      if (!hasImage && !hasRemarks)
        return "Add at least a reference image or UI remarks";
      return null;
    }
    case "coding:starter":
      if (!values.starterCode.trim()) return "Add starter code";
      return null;
    case "database:schema":
      if (!values.schemaId) return "Select a database schema";
      return null;
    case "database:query":
      if (!values.expectedQuery.trim()) return "Add the expected SQL query";
      return null;
    case "comprehension:passage":
      if (!values.passage.trim()) return "Add a reading passage";
      return null;
    case "comprehension:questions": {
      if (values.compQuestions.length === 0) return "Add at least one question";
      for (let i = 0; i < values.compQuestions.length; i++) {
        const q = values.compQuestions[i];
        const num = i + 1;
        if (!q.questionBody.trim()) return `Question ${num}: add question text`;
        const filled = q.options.filter((o) => o.label.trim());
        if (filled.length < 2) return `Question ${num}: add at least two options`;
        if (q.options.some((o) => !o.label.trim() && filled.length > 0))
          return `Question ${num}: all option fields must have text`;
        if (!q.options.some((o) => o.isCorrect))
          return `Question ${num}: mark at least one correct answer`;
        if (q.answerType === "single" && q.options.filter((o) => o.isCorrect).length > 1)
          return `Question ${num}: single-answer allows only one correct option`;
      }
      return null;
    }
    case "debug:function-details":
      if (!values.functionName.trim()) return "Add a function name";
      if (!values.returnType.trim()) return "Select a return type";
      if (!values.parameters.some((p) => p.name.trim())) return "Add at least one parameter";
      return null;
    case "debug:test-cases":
      if (!values.testCases.some((t) => t.input.trim() && t.expected.trim())) {
        return "Add at least one test case";
      }
      return null;
    case "debug:debug-code":
      if (!values.codeLanguage.trim()) return "Select a language";
      if (!values.buggyCode.trim()) return "Add buggy code for candidates to fix";
      return null;
    default:
      return null;
  }
}

export function validatePublish(values: QuestionDraftFormValues): string | null {
  const type = values.type as QuestionType;
  const steps = getEditorSteps(type);
  if (!steps) {
    if (type === "mcq") {
      if (!values.bodyMarkdown.trim()) return "Add a question in the editor";
      const filled = values.mcqOptions.filter((o) => o.label.trim());
      if (filled.length < 2) return "Add at least two options";
      if (values.mcqOptions.some((o) => !o.label.trim() && filled.length > 0))
        return "All option inputs must have text";
      if (!values.mcqOptions.some((o) => o.isCorrect)) return "Mark at least one correct option";
      if (values.answerType === "single" && values.mcqOptions.filter((o) => o.isCorrect).length > 1)
        return "Single-answer mode allows only one correct option";
      if (!values.skill.trim()) return "Select a skill";
      return null;
    }
    if (!values.title.trim()) return "Add a question title";
    if (!values.skill.trim()) return "Add a skill";
    if (type === "fill-blank") {
      if (!values.fillBlankTemplate.trim() && !values.bodyMarkdown.trim()) {
        return "Add fill-in-the-blank template content";
      }
      return null;
    }
    if (!values.bodyMarkdown.trim()) return "Add a question description";
    return null;
  }
  for (const step of steps) {
    if (step.id === "review") continue;
    const err = validateStep(type, step.id, values);
    if (err) return err;
  }
  return null;
}
