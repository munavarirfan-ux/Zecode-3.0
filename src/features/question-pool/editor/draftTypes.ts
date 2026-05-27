import type {
  DatabaseSchemaId,
  Difficulty,
  MCQOption,
  QuestionSubtype,
  QuestionType,
  TestCase,
} from "../types";

export type QuestionDraft = {
  type: QuestionType;
  subtype?: QuestionSubtype;
  difficulty: Difficulty;
  title: string;
  bodyMarkdown: string;
  skill: string;
  tags: string[];
  mcqOptions: MCQOption[];
  testCases: TestCase[];
  starterCode: string;
  schemaId: DatabaseSchemaId | "";
  expectedQuery: string;
  passage: string;
  comprehensionQuestions: string;
  functionSignature: string;
  buggyCode: string;
  fillBlankTemplate: string;
};
