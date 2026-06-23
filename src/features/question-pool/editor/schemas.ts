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
  schemaId: z.string(),
  expectedQuery: z.string(),
  passage: z.string(),
  comprehensionQuestions: z.string(),
  functionSignature: z.string(),
  buggyCode: z.string(),
  fillBlankTemplate: z.string(),
});

export type QuestionDraftFormValues = z.infer<typeof questionDraftSchema>;

export function validateStep(type: QuestionType, stepId: string, values: QuestionDraftFormValues): string | null {
  switch (`${type}:${stepId}`) {
    case "mcq:question":
    case "coding:question":
    case "database:question":
    case "debug:question":
      if (!values.title.trim()) return "Add a question title";
      if (!values.bodyMarkdown.trim()) return "Add a question description";
      if (!values.skill.trim()) return "Select or enter a skill";
      return null;
    case "mcq:options": {
      const filled = values.mcqOptions.filter((o) => o.label.trim());
      if (filled.length < 2) return "Add at least two options";
      if (!values.mcqOptions.some((o) => o.isCorrect)) return "Mark one option as correct";
      return null;
    }
    case "mcq:tags":
      if (values.tags.length === 0) return "Add at least one tag";
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
      if (!values.title.trim()) return "Add a title";
      if (!values.passage.trim()) return "Add a reading passage";
      return null;
    case "comprehension:questions":
      if (!values.comprehensionQuestions.trim()) return "Add follow-up questions";
      return null;
    case "debug:function":
      if (!values.functionSignature.trim()) return "Add a function signature";
      return null;
    case "debug:test-cases":
      if (!values.testCases.some((t) => t.input.trim() && t.expected.trim())) {
        return "Add at least one test case";
      }
      return null;
    case "debug:buggy":
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
