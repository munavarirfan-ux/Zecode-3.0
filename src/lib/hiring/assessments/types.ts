export type AssessmentLifecycleStatus = "Draft" | "Ongoing" | "Completed";

export type AssessmentTab = "active" | "drafts" | "completed";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard" | "Expert";

export type QuestionPoolCategory =
  | "Coding"
  | "Database"
  | "MCQ"
  | "Comprehension"
  | "Open Ended"
  | "Fill in the Blanks"
  | "Debug Snippet";

export const QUESTION_POOL_TABS: { id: QuestionPoolCategory; label: string }[] = [
  { id: "Coding", label: "Coding" },
  { id: "Database", label: "Database" },
  { id: "MCQ", label: "MCQ" },
  { id: "Comprehension", label: "Comprehension" },
  { id: "Open Ended", label: "Open Ended" },
  { id: "Fill in the Blanks", label: "Fill in the Blanks" },
  { id: "Debug Snippet", label: "Debug Snippet" },
];

export const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "SQL",
] as const;

export type ProgrammingLanguage = (typeof PROGRAMMING_LANGUAGES)[number];

export type ScoringAppliesTo = {
  mcq: boolean;
  comprehension: boolean;
};

export interface PoolQuestion {
  id: string;
  title: string;
  type: QuestionPoolCategory;
  difficulty: QuestionDifficulty;
  estimatedMinutes: number;
  tags: string[];
  skills: string[];
  languages: string[];
  defaultMarks: number;
  defaultWeightage: number;
}

export interface SelectedAssessmentQuestion {
  id: string;
  poolQuestionId: string;
  title: string;
  type: QuestionPoolCategory;
  difficulty: QuestionDifficulty;
  weightage: number;
  marks: number;
  timeLimitMinutes: number;
  required: boolean;
  sortOrder: number;
  isCustom?: boolean;
}

export interface AssessmentFormDraft {
  name: string;
  durationMinutes: number;
  durationIsCustom: boolean;
  validityDays: number;
  qualifyingPercentage: number;
  partialScoring: boolean;
  partialScoringAppliesTo: ScoringAppliesTo;
  negativeMarking: boolean;
  negativeMarkingAppliesTo: ScoringAppliesTo;
  negativePenaltyPercent: number;
  role: string;
  difficulty: DifficultyLevel;
  tags: string[];
  languages: string[];
  selectedQuestions: SelectedAssessmentQuestion[];
  guidelines: string;
}

export interface AssessmentRecord {
  id: string;
  name: string;
  role: string;
  createdBy: string;
  createdOn: string;
  invited: number;
  notStarted: number;
  evaluated: number;
  qualified: number;
  status: AssessmentLifecycleStatus;
  enabled: boolean;
  shareLink: string;
  config: AssessmentFormDraft;
}

export const DEFAULT_GUIDELINES_TEXT = `Complete the assessment within the given duration.
Do not refresh or close the browser during the test.
Ensure a stable internet connection.
Submit before the timer ends.`;

export const DURATION_OPTIONS = [30, 60, 90, 120] as const;

export const ASSESSMENTS_HERO_METRICS_COLLAPSED_KEY = "assessmentsHeroMetricsCollapsed";
export const ASSESSMENT_DETAIL_METRICS_COLLAPSED_KEY = "assessmentDetailMetricsCollapsed";

export type AssessmentCandidateStatus =
  | "Pending"
  | "Attempted"
  | "Qualified"
  | "Not Qualified"
  | "Expired"
  | "Malpractice Detected";

export type MalpracticeSignalType =
  | "Tab switch detected"
  | "Camera anomaly"
  | "Copy attempt"
  | "Face missing";

export interface AssessmentCandidateRecord {
  id: string;
  assessmentId: string;
  name: string;
  email: string;
  linkedin?: string;
  phone?: string;
  resumeUrl?: string;
  status: AssessmentCandidateStatus;
  score: number | null;
  qualified: boolean | null;
  durationMinutes: number | null;
  attemptedAt: string | null;
  inviteSentAt: string;
  malpracticeSignals: MalpracticeSignalType[];
  completionPercent: number | null;
}

export type AssessmentReportMainTab = "overview" | "snapshots" | "questions";

export const ASSESSMENT_REPORT_MAIN_TABS: { id: AssessmentReportMainTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "snapshots", label: "Camera Snapshots" },
  { id: "questions", label: "Question Breakdown" },
];

export type AssessmentReportTab =
  | "Coding"
  | "Debug Snippet"
  | "MCQ"
  | "Database"
  | "Open Ended"
  | "Fill in the Blanks";

export const ASSESSMENT_REPORT_TABS: { id: AssessmentReportTab; label: string }[] = [
  { id: "Coding", label: "Coding" },
  { id: "Debug Snippet", label: "Debug Snippet" },
  { id: "MCQ", label: "MCQ" },
  { id: "Database", label: "Database" },
  { id: "Open Ended", label: "Open Ended" },
  { id: "Fill in the Blanks", label: "Fill in the Blanks" },
];

export interface MalpracticeBreakdown {
  copying: number;
  leavingTab: number;
  movementDetection: number;
}

export interface AssessmentSectionScore {
  section: string;
  score: number;
  maxScore: number;
}

export interface CameraSnapshot {
  id: string;
  capturedAt: string;
  label: string;
  hasAnomaly: boolean;
}

export interface AssessmentTestCaseResult {
  name: string;
  passed: boolean;
  expected?: string;
  actual?: string;
}

export interface AssessmentQuestionResult {
  id: string;
  candidateId: string;
  assessmentId: string;
  tab: AssessmentReportTab;
  title: string;
  difficulty: string;
  language?: string;
  score: number;
  maxScore: number;
  testCasesPassed?: string;
  status: "Passed" | "Partial" | "Failed" | "Skipped";
  submittedCode?: string;
  executionOutput?: string;
  evaluatorNotes?: string;
  aiSummary?: string;
  problemStatement?: string;
  candidateAnswer?: string;
  correctAnswer?: string;
  expectedOutput?: string;
  actualOutput?: string;
  originalSnippet?: string;
  candidateFixedSnippet?: string;
  expectedFix?: string;
  testCaseResults?: AssessmentTestCaseResult[];
}
