export type JobStatus =
  | "Published"
  | "Internal"
  | "External"
  | "Draft"
  | "On Hold"
  | "Closed"
  | "Deleted";

export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full-time" | "Contract" | "Internship" | "Part-time";
export type JobVisibility = "Internal" | "External" | "Internal + External";
export type HiringPriority = "High" | "Normal" | "Low";

export type SourceChannel = "Careers" | "LinkedIn" | "Referral" | "Agency" | "Campus" | "Direct";

export const SOURCE_LABELS: Record<SourceChannel, string> = {
  Careers: "Careers Website",
  LinkedIn: "LinkedIn",
  Referral: "Referral",
  Direct: "Direct Upload",
  Agency: "Agency",
  Campus: "Campus",
};

export type CandidateVerdict = "hire" | "no_hire" | "neutral" | "pending";

export type EngagementType =
  | "viewed"
  | "emailed"
  | "commented"
  | "scheduled"
  | "voted";

export interface EngagementRecord {
  recruiterId: string;
  recruiterName: string;
  recruiterAvatarUrl?: string;
  firstEngagedAt: string;
  lastEngagedAt: string;
  engagementType: EngagementType;
}

export type OwnershipTransferStatus = "pending" | "approved" | "declined" | "discussing";

export interface OwnershipTransferRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  fromRecruiterId: string;
  fromRecruiterName: string;
  toRecruiterId: string;
  toRecruiterName: string;
  reason: string;
  targetStage: import("./stages").HiringStageName;
  targetSubstage?: string;
  priority?: boolean;
  status: OwnershipTransferStatus;
  createdAt: string;
  respondedAt?: string;
  responseNote?: string;
}

export type KanbanViewMode = "all" | "mine" | "team";

export type {
  HiringStageName,
  CandidateSource,
  SourceCategory,
  AddedBy,
} from "./stages";

export {
  HIRING_STAGES,
  CANDIDATE_SOURCES,
  SOURCE_CATEGORIES as CANDIDATE_SOURCE_CATEGORIES,
} from "./stages";

export interface SourceBreakdown {
  channel: SourceChannel;
  count: number;
}

export interface HiringStage {
  id: string;
  name: string;
  substages: { id: string; name: string }[];
}

export interface HiringJob {
  id: string;
  title: string;
  department: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: string;
  hiringManager: string;
  recruiterOwner: string;
  status: JobStatus;
  visibility: JobVisibility;
  priority: HiringPriority;
  candidateCount: number;
  careersApplicants: number;
  /** Referrals in pipeline */
  referralCount: number;
  /** Candidates currently in interview stages */
  interviewingCount: number;
  /** Operational health — shown subtly on job card */
  candidatesThisWeek: number;
  interviewsToday: number;
  /** Pending interviewer feedback (operational micro-signal) */
  feedbackPending: number;
  sources: SourceBreakdown[];
  flowPreview: string[];
  stages: HiringStage[];
  lastUpdated: string;
  lastUpdatedLabel: string;
  openings: number;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  salaryRange: string;
  deadline: string;
}

export interface CandidateEmail {
  id: string;
  subject: string;
  sender: string;
  timestamp: string;
  type: "Interview Invite" | "Follow-up" | "Assessment" | "Offer" | "Rejection" | "Recruiter";
  preview: string;
  /** Full message body when opened from the email list */
  body?: string;
  recipient?: string;
}

export type InterviewJourneyState = "completed" | "active" | "upcoming";

export interface InterviewPipelineStep {
  id: string;
  label: string;
  state: InterviewJourneyState;
}

/** Stage-level outcome — candidate stays in the interview round column */
export type InterviewRoundOutcome =
  | "Rejected"
  | "Rescheduled"
  | "No Show"
  | "Qualified"
  | "Moved to Next Stage";

export interface CandidateInterview {
  id: string;
  round: string;
  interviewers: string[];
  scheduledAt: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  feedbackStatus: "Pending" | "Submitted";
  /** Operational outcome for this round (rejection, no-show, etc.) */
  roundOutcome?: InterviewRoundOutcome;
  result?: "Strong Hire" | "Hire" | "Hold" | "No Hire";
  interviewType?: string;
  durationMinutes?: number;
  platform?: string;
  /** ZeMeet room id — generated when platform is ZeMeet */
  roomId?: string;
  /** Join URL for collaborative session */
  meetUrl?: string;
  overallRating?: number;
  feedbackSubmittedCount?: number;
  feedbackPendingCount?: number;
  hasNotes?: boolean;
  hasRecording?: boolean;
  hasCodeChallenge?: boolean;
  /** Display string e.g. "2h ago" when feedback was requested */
  feedbackRequestedAt?: string;
}

export interface InterviewSummaryStats {
  total: number;
  upcoming: number;
  feedbackPending: number;
  averageRating: number | null;
}

export interface TimelineEvent {
  id: string;
  label: string;
  detail: string;
  at: string;
}

export interface HiringCandidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  /** Canonical pipeline stage */
  stage?: import("./stages").HiringStageName;
  source: import("./stages").CandidateSource | SourceChannel;
  sourceCategory?: import("./stages").SourceCategory;
  addedBy?: import("./stages").AddedBy;
  defaultStageReason?: string;
  appliedAt: string;
  /** @deprecated Use `stage` — kept in sync for legacy UI */
  currentStage: string;
  currentSubstage: string;
  recruiterOwner: string;
  /** Recruiter who first took a meaningful action — canonical owner id */
  ownerId?: string;
  ownerName?: string;
  ownerAvatarUrl?: string;
  /** All recruiters who engaged, ordered by first engagement */
  engagedBy?: EngagementRecord[];
  experience: string;
  skills: string[];
  education: string;
  portfolioUrl?: string;
  github?: string;
  linkedin?: string;
  resumeUrl?: string;
  noticePeriod: string;
  expectedSalary: string;
  resumeStatus: "Parsed" | "Reviewed" | "Flagged";
  resumeUploadedAt: string;
  emails: CandidateEmail[];
  recruiterNotes: string;
  hiringManagerNotes: string;
  interviewerNotes: string;
  interviews: CandidateInterview[];
  /** Optional hiring pipeline steps for the interview journey rail */
  interviewPipeline?: InterviewPipelineStep[];
  timeline: TimelineEvent[];
  kanbanColumn?: string;
  /** Human-readable last touch e.g. "2h ago" */
  lastActivity?: string;
  /** Recruiter screening verdict — inline on kanban cards */
  verdict?: CandidateVerdict;
  /** Optional note when verdict is hire / no_hire */
  verdictReason?: string;
  /** Unread email thread count for card badge */
  unreadEmails?: number;
  avatarUrl?: string;
}

export type CustomFieldType =
  | "text"
  | "number"
  | "dropdown"
  | "multiselect"
  | "date"
  | "url"
  | "file";

export interface CustomFieldDef {
  id: string;
  label: string;
  type: CustomFieldType;
  required?: boolean;
  options?: string[];
}

export const DEFAULT_HIRING_STAGES: HiringStage[] = [
  {
    id: "applicants",
    name: "Applicants",
    substages: [
      { id: "new-application", name: "New Application" },
      { id: "resume-review", name: "Resume Review" },
    ],
  },
  {
    id: "screening",
    name: "Screening",
    substages: [
      { id: "recruiter-screening", name: "Recruiter Screening" },
      { id: "hm-review", name: "Hiring Manager Review" },
      { id: "shortlisted", name: "Shortlisted" },
    ],
  },
  {
    id: "interviews",
    name: "Interviews",
    substages: [
      { id: "tech-1", name: "Technical Round 1" },
      { id: "tech-2", name: "Technical Round 2" },
      { id: "hr-round", name: "HR Round" },
    ],
  },
  {
    id: "offers",
    name: "Hire & Offers",
    substages: [
      { id: "offer-draft", name: "Offer Draft" },
      { id: "offer-sent", name: "Offer Sent" },
      { id: "offer-accepted", name: "Offer Accepted" },
      { id: "hired", name: "Hired" },
    ],
  },
];
