export type LiveCandidateStatus = "live" | "idle" | "flagged";

export type LiveMonitorFilter = "all" | LiveCandidateStatus;

export interface LiveEventLogEntry {
  at: string;
  message: string;
}

export interface LiveCandidateSession {
  id: string;
  assessmentId: string;
  name: string;
  email: string;
  linkedin?: string;
  resumeUrl?: string;
  remainingMinutes: number;
  currentQuestion: number;
  totalQuestions: number;
  status: LiveCandidateStatus;
  warnings: string[];
  progressPercent: number;
  eventLog: LiveEventLogEntry[];
  deviceInfo: {
    browser: string;
    os: string;
    ip: string;
    resolution: string;
  };
}

export interface LiveAssessmentSummary {
  assessmentId: string;
  assessmentName: string;
  role: string;
  liveCount: number;
  flaggedCount: number;
  idleCount: number;
  closesInMinutes: number;
}

export interface LiveMonitoringOverviewStats {
  liveAssessments: number;
  candidatesLive: number;
  flagged: number;
  idle: number;
}
