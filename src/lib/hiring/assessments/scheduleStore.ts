"use client";

import type { AssessmentCandidateRecord } from "./types";
import { getAssessmentCandidateById } from "./assessmentCandidates";
import { getAssessmentById } from "./assessmentStore";
import {
  SEED_LIVE_ATTEMPTS,
  SEED_SCHEDULES,
  tabForStatus,
} from "./mockAssessmentSchedules";
import type {
  AssessmentScheduleRecord,
  LiveAssessmentAttempt,
  ScheduleAttemptStatus,
} from "./scheduleTypes";

const scheduleStore = new Map<string, AssessmentScheduleRecord>(
  SEED_SCHEDULES.map((s) => [s.id, s]),
);

const liveStore = new Map<string, LiveAssessmentAttempt>(
  SEED_LIVE_ATTEMPTS.map((l) => [l.id, l]),
);

export const ASSESSMENT_SCHEDULES_UPDATED_EVENT = "zecode-assessment-schedules-updated";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ASSESSMENT_SCHEDULES_UPDATED_EVENT));
  }
}

export function getAllSchedules(): AssessmentScheduleRecord[] {
  return Array.from(scheduleStore.values());
}

export function getScheduleById(id: string): AssessmentScheduleRecord | undefined {
  return scheduleStore.get(id);
}

export function getLiveAttempts(): LiveAssessmentAttempt[] {
  return Array.from(liveStore.values());
}

export function addSchedule(record: AssessmentScheduleRecord) {
  scheduleStore.set(record.id, record);
  notify();
}

export function updateSchedule(id: string, patch: Partial<AssessmentScheduleRecord>) {
  const cur = scheduleStore.get(id);
  if (!cur) return;
  const next = { ...cur, ...patch };
  if (patch.status) next.tab = tabForStatus(patch.status, next.isDraft);
  scheduleStore.set(id, next);
  notify();
}

export function removeSchedule(id: string) {
  scheduleStore.delete(id);
  notify();
}

export function scheduleToCandidateRecord(
  schedule: AssessmentScheduleRecord,
): AssessmentCandidateRecord | null {
  const existing = getAssessmentCandidateById(schedule.candidateId);
  if (existing) return existing;

  const assessment = getAssessmentById(schedule.assessmentId);
  if (!assessment) return null;

  const statusMap: Record<ScheduleAttemptStatus, AssessmentCandidateRecord["status"]> = {
    "Not Started": "Pending",
    Started: "Attempted",
    Ongoing: "Attempted",
    Submitted: "Attempted",
    Evaluated: schedule.qualified ? "Qualified" : schedule.qualified === false ? "Not Qualified" : "Attempted",
    Expired: "Expired",
  };

  return {
    id: schedule.candidateId,
    assessmentId: schedule.assessmentId,
    name: schedule.name,
    email: schedule.email,
    linkedin: schedule.linkedin,
    resumeUrl: schedule.resumeUrl,
    status: statusMap[schedule.status] ?? "Pending",
    score: schedule.score,
    qualified: schedule.qualified,
    durationMinutes: schedule.durationMinutes,
    attemptedAt: schedule.progress > 0 ? schedule.inviteSentAt : null,
    inviteSentAt: schedule.inviteSentAt === "—" ? "Draft" : schedule.inviteSentAt,
    malpracticeSignals: schedule.malpracticeSignals.map((s) => {
      if (s === "Tab switch") return "Tab switch detected" as const;
      if (s === "Copy attempt") return "Copy attempt" as const;
      if (s === "Camera anomaly") return "Camera anomaly" as const;
      return "Face missing" as const;
    }),
    completionPercent: schedule.progress,
  };
}
