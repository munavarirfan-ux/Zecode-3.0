import type {
  DatabaseSchemaId,
  Difficulty,
  FrontendLink,
  FunctionParameter,
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
  functionName: string;
  returnType: string;
  parameters: FunctionParameter[];
  referenceImage: string;
  uiRemarks: string;
  evaluationRemarks: string;
  frontendLinks: FrontendLink[];
  schemaId: DatabaseSchemaId | "";
  expectedQuery: string;
  passage: string;
  comprehensionQuestions: string;
  functionSignature: string;
  buggyCode: string;
  codeLanguage: string;
  fillBlankTemplate: string;
};
