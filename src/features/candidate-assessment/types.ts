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
