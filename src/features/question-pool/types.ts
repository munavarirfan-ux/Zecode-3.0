export type QuestionType =
  | "coding"
  | "database"
  | "mcq"
  | "comprehension"
  | "open-ended"
  | "fill-blank"
  | "debug";

export type CodingSubtype = "backend" | "frontend" | "full-stack" | "data-engineering";
export type DatabaseSubtype = "mysql" | "postgresql" | "sqlite" | "mongodb";
export type McqSubtype = "single-answer" | "multi-select";
export type DebugSubtype = "javascript" | "python" | "java" | "c++";

export type QuestionSubtype =
  | CodingSubtype
  | DatabaseSubtype
  | McqSubtype
  | DebugSubtype;

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionStatus = "published" | "draft" | "archived";

export type Curator = {
  id: string;
  name: string;
  avatarGradient: [string, string];
};

export type Tag = string;

export type MCQOption = {
  id: string;
  label: string;
  isCorrect: boolean;
};

export type TestCase = {
  id: string;
  input: string;
  expected: string;
  hidden: boolean;
  visibility?: "sample" | "hidden";
  points?: number;
};

export type FunctionParameter = {
  id: string;
  name: string;
  type: string;
  required: boolean;
};

export const RETURN_TYPES = [
  "number",
  "string",
  "boolean",
  "number[]",
  "string[]",
  "object",
  "void",
] as const;

export type DatabaseSchemaId = "banking_db" | "ecommerce_db" | "hr_db";

export type DatabaseSchema = {
  id: DatabaseSchemaId;
  label: string;
  tables: { name: string; columns: string[] }[];
  relationships: { from: string; to: string }[];
};

export type QuestionMeta = {
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  usageCount: number;
  usedInAssessments: string[];
};

export type Question = {
  id: string;
  number: number;
  title: string;
  bodyMarkdown: string;
  type: QuestionType;
  subtype?: QuestionSubtype;
  difficulty: Difficulty;
  status: QuestionStatus;
  skill: string;
  tags: Tag[];
  curator: Curator;
  meta: QuestionMeta;
  mcqOptions?: MCQOption[];
  testCases?: TestCase[];
  schemaId?: DatabaseSchemaId;
};

export type PoolFilters = {
  search: string;
  status: QuestionStatus | "all";
  difficulty: Difficulty | "all";
  skill: string;
  curatorId: string;
};

export type PoolSortKey = "number" | "title" | "difficulty" | "updated";

export type PoolSortDir = "asc" | "desc";

export const POOL_PAGE_SIZE = 25;

export const QUESTION_TYPE_ORDER: QuestionType[] = [
  "coding",
  "database",
  "mcq",
  "comprehension",
  "open-ended",
  "fill-blank",
  "debug",
];
