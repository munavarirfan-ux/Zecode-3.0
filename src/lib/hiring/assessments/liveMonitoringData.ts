import {
  getRuntimeLiveCandidates,
  initLiveSessionStore,
} from "./liveSessionRuntime";
import type {
  LiveAssessmentSummary,
  LiveCandidateSession,
  LiveCandidateStatus,
  LiveMonitorFilter,
  LiveMonitoringOverviewStats,
} from "./liveMonitoringTypes";

const CANDIDATES: Omit<LiveCandidateSession, "assessmentId" | "id">[] = [
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@email.com",
    linkedin: "linkedin.com/in/sarahjenkins",
    resumeUrl: "/resumes/demo.pdf",
    remainingMinutes: 42,
    currentQuestion: 8,
    totalQuestions: 20,
    status: "live",
    warnings: ["Tab switched 2x"],
    progressPercent: 40,
    eventLog: [
      { at: "10:42 AM", message: "Started assessment" },
      { at: "10:58 AM", message: "Tab switch detected" },
      { at: "11:04 AM", message: "Tab switch detected" },
    ],
    deviceInfo: {
      browser: "Chrome 124",
      os: "macOS Sonoma",
      ip: "104.28.42.18",
      resolution: "1920×1080",
    },
  },
  {
    name: "Marcus Webb",
    email: "marcus.webb@hire.co",
    linkedin: "linkedin.com/in/marcuswebb",
    remainingMinutes: 38,
    currentQuestion: 11,
    totalQuestions: 20,
    status: "flagged",
    warnings: ["Tab switched 4x", "Camera off briefly"],
    progressPercent: 54,
    eventLog: [
      { at: "10:30 AM", message: "Started assessment" },
      { at: "10:45 AM", message: "Left fullscreen" },
      { at: "11:02 AM", message: "Tab switch detected" },
    ],
    deviceInfo: {
      browser: "Chrome 124",
      os: "Windows 11",
      ip: "73.12.88.4",
      resolution: "2560×1440",
    },
  },
  {
    name: "Aisha Khan",
    email: "aisha.khan@mail.com",
    remainingMinutes: 52,
    currentQuestion: 6,
    totalQuestions: 18,
    status: "live",
    warnings: [],
    progressPercent: 33,
    eventLog: [{ at: "10:15 AM", message: "Started assessment" }],
    deviceInfo: {
      browser: "Firefox 125",
      os: "Ubuntu 24",
      ip: "192.168.1.42",
      resolution: "1920×1080",
    },
  },
  {
    name: "Noah Fischer",
    email: "noah.fischer@tech.de",
    linkedin: "linkedin.com/in/noahfischer",
    remainingMinutes: 41,
    currentQuestion: 9,
    totalQuestions: 15,
    status: "live",
    warnings: [],
    progressPercent: 60,
    eventLog: [{ at: "10:20 AM", message: "Started assessment" }],
    deviceInfo: {
      browser: "Chrome 124",
      os: "macOS Sonoma",
      ip: "89.44.12.90",
      resolution: "1680×1050",
    },
  },
  {
    name: "Elena Vasquez",
    email: "elena.v@studio.dev",
    remainingMinutes: 12,
    currentQuestion: 2,
    totalQuestions: 20,
    status: "idle",
    warnings: ["No activity 8 min"],
    progressPercent: 10,
    eventLog: [
      { at: "09:50 AM", message: "Started assessment" },
      { at: "10:05 AM", message: "Idle — no input" },
    ],
    deviceInfo: {
      browser: "Safari 17",
      os: "macOS Sonoma",
      ip: "203.0.113.8",
      resolution: "1440×900",
    },
  },
  {
    name: "James Okonkwo",
    email: "j.okonkwo@corp.io",
    remainingMinutes: 28,
    currentQuestion: 14,
    totalQuestions: 22,
    status: "flagged",
    warnings: ["Copy attempt", "Multiple faces"],
    progressPercent: 64,
    eventLog: [
      { at: "10:00 AM", message: "Started assessment" },
      { at: "10:22 AM", message: "Copy attempt blocked" },
    ],
    deviceInfo: {
      browser: "Chrome 124",
      os: "Windows 11",
      ip: "198.51.100.22",
      resolution: "1920×1080",
    },
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    remainingMinutes: 55,
    currentQuestion: 5,
    totalQuestions: 20,
    status: "idle",
    warnings: ["No activity 5 min"],
    progressPercent: 25,
    eventLog: [{ at: "10:10 AM", message: "Started assessment" }],
    deviceInfo: {
      browser: "Chrome 124",
      os: "Android 14",
      ip: "10.0.0.44",
      resolution: "1080×2400",
    },
  },
  {
    name: "Daniel Park",
    email: "daniel.park@startup.com",
    remainingMinutes: 47,
    currentQuestion: 10,
    totalQuestions: 20,
    status: "live",
    warnings: [],
    progressPercent: 50,
    eventLog: [{ at: "10:35 AM", message: "Started assessment" }],
    deviceInfo: {
      browser: "Edge 124",
      os: "Windows 11",
      ip: "172.16.0.88",
      resolution: "1920×1080",
    },
  },
];

function buildSessions(assessmentId: string, indices: number[]): LiveCandidateSession[] {
  return indices.map((i, idx) => ({
    ...CANDIDATES[i],
    id: `live-${assessmentId}-${idx}`,
    assessmentId,
  }));
}

/** All live monitoring sessions keyed by assessment */
const SESSIONS_BY_ASSESSMENT: Record<string, LiveCandidateSession[]> = {
  "asm-frontend-react": buildSessions("asm-frontend-react", [0, 1, 2, 3, 4, 5, 6]),
  "asm-backend-core": buildSessions("asm-backend-core", [1, 2, 5, 6]),
  "asm-sql-analytics": buildSessions("asm-sql-analytics", [3, 4, 6]),
};

initLiveSessionStore(SESSIONS_BY_ASSESSMENT);

function sessionsFor(assessmentId: string): LiveCandidateSession[] {
  const runtime = getRuntimeLiveCandidates(assessmentId);
  return runtime.length > 0 ? runtime : SESSIONS_BY_ASSESSMENT[assessmentId] ?? [];
}

const SUMMARY_META: Omit<LiveAssessmentSummary, "liveCount" | "flaggedCount" | "idleCount">[] = [
  {
    assessmentId: "asm-frontend-react",
    assessmentName: "Frontend Developer Assessment",
    role: "React Developer",
    closesInMinutes: 135,
  },
  {
    assessmentId: "asm-backend-core",
    assessmentName: "Backend Systems — Core",
    role: "Backend Engineer",
    closesInMinutes: 95,
  },
  {
    assessmentId: "asm-sql-analytics",
    assessmentName: "SQL & Analytics Screening",
    role: "Data Analyst",
    closesInMinutes: 48,
  },
];

function countSessions(sessions: LiveCandidateSession[]) {
  return {
    liveCount: sessions.filter((c) => c.status === "live").length,
    flaggedCount: sessions.filter((c) => c.status === "flagged").length,
    idleCount: sessions.filter((c) => c.status === "idle").length,
  };
}

function buildSummaries(): LiveAssessmentSummary[] {
  return SUMMARY_META.map((meta) => {
    const sessions = sessionsFor(meta.assessmentId);
    return { ...meta, ...countSessions(sessions) };
  });
}

export function formatClosesIn(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getLiveAssessmentSummaries(): LiveAssessmentSummary[] {
  return buildSummaries();
}

export function getLiveMonitoringOverviewStats(): LiveMonitoringOverviewStats {
  return buildSummaries().reduce(
    (acc, s) => ({
      liveAssessments: acc.liveAssessments + 1,
      candidatesLive: acc.candidatesLive + s.liveCount,
      flagged: acc.flagged + s.flaggedCount,
      idle: acc.idle + s.idleCount,
    }),
    { liveAssessments: 0, candidatesLive: 0, flagged: 0, idle: 0 },
  );
}

export function getLiveAssessmentSummary(assessmentId: string): LiveAssessmentSummary | undefined {
  return buildSummaries().find((s) => s.assessmentId === assessmentId);
}

export function getLiveCandidatesForAssessment(assessmentId: string): LiveCandidateSession[] {
  return sessionsFor(assessmentId);
}

export function filterLiveCandidates(
  candidates: LiveCandidateSession[],
  filter: LiveMonitorFilter,
): LiveCandidateSession[] {
  if (filter === "all") return candidates;
  return candidates.filter((c) => c.status === filter);
}

export function countByStatus(candidates: LiveCandidateSession[]) {
  return {
    all: candidates.length,
    live: candidates.filter((c) => c.status === "live").length,
    idle: candidates.filter((c) => c.status === "idle").length,
    flagged: candidates.filter((c) => c.status === "flagged").length,
  };
}

export function statusLabel(status: LiveCandidateStatus): string {
  if (status === "live") return "Live";
  if (status === "idle") return "Idle";
  return "Flagged";
}
