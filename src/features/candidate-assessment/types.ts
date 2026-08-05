export type QuestionType =
  | "mcq"
  | "coding"
  | "open-ended"
  | "comprehension"
  | "database"
  | "fill-blank"
  | "debug";

export type QuestionStatus = "answered" | "unanswered" | "marked-for-review";

export interface MCQOption {
  id: string;
  letter: string;
  text: string;
}

export interface DbColumn {
  name: string;
  type: string;
  pk?: boolean;
  fk?: boolean;
  nullable?: boolean;
}

export interface DbTable {
  name: string;
  columns: DbColumn[];
}

export type FrontendFileLanguage = "html" | "css" | "javascript" | "json";

export interface FrontendFile {
  name: string;
  language: FrontendFileLanguage;
  content: string;
}

export type FrontendAssetKind = "image" | "svg" | "icon" | "font" | "zip";

export interface FrontendAsset {
  id: string;
  name: string;
  kind: FrontendAssetKind;
  /** Data URI or path used for the thumbnail + download. */
  src: string;
}

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  sectionId: string;
  number: number;
  title: string;
  body: string;
  status: QuestionStatus;
  options?: MCQOption[];
  answerType?: "single" | "multiple";
  passage?: string;
  subQuestions?: { id: string; body: string; options: MCQOption[]; answerType: "single" | "multiple" }[];
  codeStarter?: string;
  language?: string;
  testCases?: { id: string; input: string; expectedOutput: string; visible: boolean }[];
  blanks?: { id: string; label: string }[];
  bugDescription?: string;
  buggyCode?: string;
  schema?: string;
  /** Frontend (HTML/CSS/JS) challenge — renders the live-preview IDE workspace. */
  frontend?: boolean;
  difficulty?: string;
  estimatedMinutes?: number;
  points?: number;
  requirements?: string[];
  assets?: FrontendAsset[];
  referenceImage?: string;
  files?: FrontendFile[];
  /** Database / SQL question extras. */
  constraints?: string[];
  erDiagram?: string;
  dbTables?: DbTable[];
  queryColumns?: string[];
  queryRows?: (string | number)[][];
}

export interface AssessmentSection {
  id: string;
  type: QuestionType;
  label: string;
  questionCount: number;
  weightage: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentData {
  id: string;
  title: string;
  role: string;
  candidateName: string;
  duration: number;
  totalQuestions: number;
  expiresAt: string;
  skills: string[];
  sections: AssessmentSection[];
  guidelines: GuidelineSection[];
}

export interface GuidelineSection {
  id: string;
  title: string;
  items: string[];
}

export type AssessmentScreen =
  | "invitation"
  | "guidelines"
  | "workspace";

export type WorkspaceView =
  | "section-overview"
  | "question";
