export type ScheduledAssessmentStatus = "Scheduled" | "Live" | "Completed" | "Expired";

export type ExpiryWindowHours = 2 | 6 | 12 | 24 | 48;

export type ScheduledInviteStatus = "Invited" | "Opened" | "Started" | "Completed" | "Expired";

export type ScheduledCandidateStatus = "Pending" | "In progress" | "Completed" | "Expired" | "No show";

export interface ScheduledCsvCandidate {
  name: string;
  email: string;
  linkedinUrl?: string;
}

export interface ScheduledEmailLogEntry {
  at: string;
  type: "instruction" | "reminder" | "expiry";
  detail: string;
}

export interface ScheduledAssessmentCandidate {
  id: string;
  name: string;
  email: string;
  linkedinUrl?: string;
  inviteStatus: ScheduledInviteStatus;
  instructionSent: boolean;
  instructionMailStatus: string;
  reminderSent: boolean;
  reminderStatus: string;
  assessmentStarted: boolean;
  assessmentCompleted: boolean;
  assessmentStatus: string;
  attemptedDate: string | null;
  score: number | null;
  status: ScheduledCandidateStatus;
}

export interface ScheduledAssessmentRecord {
  id: string;
  assessmentId: string;
  assessmentName: string;
  role: string;
  createdBy: string;
  shareLink: string;
  scheduledDate: string;
  scheduledTime: string;
  scheduledAtIso: string;
  candidatesInvited: number;
  instructionSent: boolean;
  instructionEmailLabel: string;
  reminderSent: boolean;
  reminderStatusLabel: string;
  status: ScheduledAssessmentStatus;
  expiryWindowHours: ExpiryWindowHours;
  sendInstructionEmail: boolean;
  sendReminderBefore: boolean;
  sendExpiryReminder: boolean;
  emailLog: ScheduledEmailLogEntry[];
  candidates: ScheduledAssessmentCandidate[];
}

export interface ScheduleAssessmentFormInput {
  assessmentId: string;
  scheduledDate: string;
  scheduledTime: string;
  expiryWindowHours: ExpiryWindowHours;
  sendInstructionEmail: boolean;
  sendReminderBefore: boolean;
  sendExpiryReminder: boolean;
  candidates: ScheduledCsvCandidate[];
}

export type AssessmentSchedulesTab = "live" | "scheduled";

export type SchedulesViewMode = "grid" | "list";
