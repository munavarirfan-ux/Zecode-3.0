export type AssessmentScheduleTab = "upcoming" | "ongoing" | "completed" | "expired" | "drafts";

export const ASSESSMENT_SCHEDULE_TABS: { id: AssessmentScheduleTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Completed" },
  { id: "expired", label: "Expired" },
  { id: "drafts", label: "Drafts" },
];

export type ScheduleAttemptStatus =
  | "Not Started"
  | "Started"
  | "Ongoing"
  | "Submitted"
  | "Evaluated"
  | "Expired";

export type ScheduleMalpracticeSignal =
  | "Tab switch"
  | "Camera anomaly"
  | "Multiple faces"
  | "Copy attempt";

export type ReminderLevel = "muted" | "active" | "escalated";

export type ScheduleViewMode = "list" | "calendar";

export type CalendarEventKind = "scheduled" | "ongoing" | "completed" | "expired" | "malpractice";

export interface AssessmentScheduleRecord {
  id: string;
  tab: AssessmentScheduleTab;
  assessmentId: string;
  assessmentName: string;
  role: string;
  durationMinutes: number;
  candidateId: string;
  name: string;
  email: string;
  linkedin?: string;
  resumeUrl?: string;
  recruiter: string;
  inviteSentAt: string;
  expiryDate: string;
  attemptWindow: string;
  calendarDate: string;
  status: ScheduleAttemptStatus;
  progress: number;
  score: number | null;
  qualified: boolean | null;
  malpracticeSignals: ScheduleMalpracticeSignal[];
  remindersSent: number;
  lastReminderAt: string | null;
  reminderLevel: ReminderLevel;
  isDraft?: boolean;
}

export interface LiveAssessmentAttempt {
  id: string;
  scheduleId: string;
  candidateName: string;
  assessmentName: string;
  currentQuestion: string;
  remainingMinutes: number;
  internetStability: "Stable" | "Unstable" | "Poor";
  tabSwitchCount: number;
  cameraStatus: "On" | "Off" | "Blocked";
  fullscreen: boolean;
}

export interface ScheduleCalendarEvent {
  id: string;
  scheduleId: string;
  title: string;
  subtitle: string;
  date: string;
  startHour: number;
  durationHours: number;
  kind: CalendarEventKind;
  schedule: AssessmentScheduleRecord;
}

export interface ScheduleInsight {
  id: string;
  label: string;
  tone: "default" | "warning" | "success" | "danger";
}

export const ASSESSMENT_SCHEDULES_HERO_METRICS_COLLAPSED_KEY = "assessmentSchedulesHeroMetricsCollapsed";
