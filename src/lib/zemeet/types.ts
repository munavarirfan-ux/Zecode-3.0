/**
 * ZeMeet — collaborative interview workspace domain model.
 *
 * Architecture layers:
 * 1. Scheduling (Hiring OS) → creates ZeMeetRoom + notifications
 * 2. Lobby → device setup + interview context
 * 3. Live room → video, chat, private notes, code challenge
 * 4. Post-session → feedback modal + auto-sync to Candidate Report
 *
 * Future: WebRTC provider (LiveKit/Daily), CRDT notes, real editor (Monaco/CodeMirror).
 */

export type ZeMeetParticipantRole = "candidate" | "interviewer" | "observer";

export type ZeMeetPhase = "lobby" | "live" | "feedback" | "ended";

export type ZeMeetConnectionQuality = "excellent" | "good" | "fair" | "poor";

export type ZeMeetCodeChallengeStatus =
  | "idle"
  | "invite_pending"
  | "declined"
  | "active"
  | "completed";

export type ZeMeetRecommendation =
  | "Strong Hire"
  | "Hire"
  | "Hold"
  | "No Hire"
  | "Re-interview";

export type ZeMeetParticipant = {
  id: string;
  name: string;
  role: ZeMeetParticipantRole;
  title?: string;
  initials: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking?: boolean;
  /** Admin / superAdmin silent monitor */
  isObserver?: boolean;
  /** Path to face photo — shown as video feed background */
  avatarSrc?: string;
};

export type ZeMeetCandidateIntel = {
  email?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  portfolioUrl?: string;
  linkedin?: string;
  resumeUrl?: string;
  resumeStatus?: string;
};

export type ZeMeetInterviewerIntelPanel = "none" | "resume" | "linkedin";

export type ZeMeetInterviewContext = {
  roomId: string;
  jobTitle: string;
  jobId: string;
  roundTitle: string;
  interviewType: string;
  scheduledAt: string;
  timezone: string;
  durationMinutes: number;
  candidateId: string;
  candidateName: string;
  interviewId: string;
  /** Interviewer-only — never exposed in candidate UI */
  candidateIntel?: ZeMeetCandidateIntel;
};

export type ZeMeetSession = {
  context: ZeMeetInterviewContext;
  participants: ZeMeetParticipant[];
  /** Current viewer role (from auth / join link) */
  viewerRole: ZeMeetParticipantRole;
  viewerId: string;
  recordingEnabled: boolean;
  codeChallengeEnabled: boolean;
};

export type ZeMeetDeviceSettings = {
  cameraId: string;
  microphoneId: string;
  speakerId: string;
  blurBackground: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
};

export type ZeMeetPermissionState = {
  camera: boolean;
  microphone: boolean;
  notifications: boolean;
};

export type ZeMeetNoteEntry = {
  id: string;
  body: string;
  createdAt: string;
  /** Offset ms from session start */
  timestampMs?: number;
  /** Optional pinned label shown on sticky notes */
  label?: string;
};

export type ZeMeetChatMessage = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  at: string;
};

export type ZeMeetCodeChallengeTestCase = {
  id: string;
  label: string;
  input?: string;
  expectedOutput?: string;
  passed?: boolean;
};

export type ZeMeetCodeChallengeFile = {
  id: string;
  name: string;
  language: string;
  content: string;
};

export type ZeMeetCodeChallengeFinalStatus =
  | "pending"
  | "active"
  | "completed"
  | "declined"
  | "rejected";

export type ZeMeetQuestionPoolItem = {
  id: string;
  title: string;
  problemStatement: string;
  requirements: string[];
  userStories: string[];
  examples: { input: string; output: string }[];
  constraints: string[];
  testCaseInstructions: string;
  testCases: ZeMeetCodeChallengeTestCase[];
  language: string;
  starterCode: string;
};

export type ZeMeetCodeChallenge = {
  status: ZeMeetCodeChallengeStatus;
  problemTitle: string;
  problemStatement: string;
  requirements: string[];
  userStories: string[];
  examples: { input: string; output: string }[];
  constraints: string[];
  testCaseInstructions: string;
  language: string;
  languages: string[];
  files: ZeMeetCodeChallengeFile[];
  activeFileId: string;
  candidateCode: string;
  testCases: ZeMeetCodeChallengeTestCase[];
  consoleOutput: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  interviewerNotes: string;
  interviewerObservations: string;
  candidateEditingEnabled: boolean;
  finalStatus: ZeMeetCodeChallengeFinalStatus;
  autosaveStatus: "idle" | "saving" | "saved";
  challengeElapsedSeconds: number;
  selectedQuestionId?: string;
};

export type ZeMeetCodeChallengeArtifact = {
  questionTitle: string;
  problemStatement: string;
  candidateCode: string;
  language: string;
  testResults: ZeMeetCodeChallengeTestCase[];
  consoleOutput: string;
  durationSeconds: number;
  startedAt?: string;
  endedAt?: string;
  interviewerNotes: string;
  interviewerObservations: string;
  finalStatus: ZeMeetCodeChallengeFinalStatus;
};

export type ZeMeetFeedbackDraft = {
  recommendation: ZeMeetRecommendation | null;
  skillRatings: Record<string, number>;
  summary: string;
  technicalEvaluation: string;
  cultureFit: string;
  reInterview: boolean;
};

export type ZeMeetSessionArtifact = {
  roomId: string;
  candidateId: string;
  interviewId: string;
  notes: ZeMeetNoteEntry[];
  codeChallenge?: ZeMeetCodeChallengeArtifact;
  feedback?: ZeMeetFeedbackDraft;
  recordingUrl?: string;
  endedAt: string;
  durationSeconds: number;
};

export const DEFAULT_DEVICE_SETTINGS: ZeMeetDeviceSettings = {
  cameraId: "default",
  microphoneId: "default",
  speakerId: "default",
  blurBackground: false,
  videoEnabled: true,
  audioEnabled: true,
};

export const DEFAULT_PERMISSIONS: ZeMeetPermissionState = {
  camera: true,
  microphone: true,
  notifications: true,
};

export const SKILL_RATING_LABELS = [
  "Problem solving",
  "System design",
  "Code quality",
  "Communication",
  "Collaboration",
] as const;
