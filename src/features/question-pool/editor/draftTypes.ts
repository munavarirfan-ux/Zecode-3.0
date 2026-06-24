import type {
  ComprehensionQuestion,
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
  answerType: "single" | "multiple";
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
  compQuestions: ComprehensionQuestion[];
  functionSignature: string;
  buggyCode: string;
  codeLanguage: string;
  fillBlankTemplate: string;
};
