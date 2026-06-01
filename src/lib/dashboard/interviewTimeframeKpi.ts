import type { InterviewerAssignedInterviewRow } from "@/lib/hiring/interviewerInterviews";

export const INTERVIEW_TIMEFRAME_STORAGE_KEY = "ze.dashboard.interviews-timeframe";

export type InterviewTimeframe =
  | "today"
  | "tomorrow"
  | "this-week"
  | "next-week"
  | "this-month";

export const INTERVIEW_TIMEFRAME_OPTIONS: {
  value: InterviewTimeframe;
  label: string;
}[] = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this-week", label: "This week" },
  { value: "next-week", label: "Next week" },
  { value: "this-month", label: "This month" },
];

/** Timeframe options for non-interview KPIs — Tomorrow excluded (not operationally relevant). */
export const KPI_TIMEFRAME_OPTIONS: {
  value: InterviewTimeframe;
  label: string;
}[] = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "next-week", label: "Next week" },
  { value: "this-month", label: "This month" },
];

export type InterviewTimeframeSnapshot = {
  count: number;
  subStat: string;
};

export type InterviewTimeframeStats = Record<InterviewTimeframe, InterviewTimeframeSnapshot>;

const ORG_TIMEFRAME_STATS: InterviewTimeframeStats = {
  today: { count: 15, subStat: "Scheduled panels · +3 vs yesterday" },
  tomorrow: { count: 8, subStat: "8 confirmed · 0 on hold" },
  "this-week": { count: 31, subStat: "8 in the next 48 hours" },
  "next-week": { count: 24, subStat: "12 panels need room assignment" },
  "this-month": { count: 89, subStat: "Across 18 active requisitions" },
};

const WEEKDAY_ABBREVS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function isScheduledInterview(row: InterviewerAssignedInterviewRow): boolean {
  return row.interviewStatus === "Upcoming" || row.interviewStatus === "Ongoing";
}

/** Parse demo schedule strings (e.g. "Today · 10:30", "Thu · 15:00") into day offset from reference date. */
export function dayOffsetFromScheduledAt(scheduledAt: string, reference: Date = new Date()): number | null {
  const s = scheduledAt.toLowerCase();
  if (s.includes("today")) return 0;
  if (s.includes("tomorrow")) return 1;

  for (let dow = 0; dow < 7; dow++) {
    const abbrev = WEEKDAY_ABBREVS[dow];
    if (s.startsWith(`${abbrev} `) || s.startsWith(`${abbrev} ·`) || s.includes(` ${abbrev} ·`)) {
      const refDow = reference.getDay();
      let diff = dow - refDow;
      if (diff < 0) diff += 7;
      return diff;
    }
  }
  return null;
}

function daysUntilEndOfWeek(reference: Date): number {
  const dow = reference.getDay();
  return dow === 0 ? 0 : 7 - dow;
}

function matchesTimeframe(offset: number | null, timeframe: InterviewTimeframe, reference: Date): boolean {
  if (offset === null) return false;
  const endOfWeek = daysUntilEndOfWeek(reference);

  switch (timeframe) {
    case "today":
      return offset === 0;
    case "tomorrow":
      return offset === 1;
    case "this-week":
      return offset >= 0 && offset <= endOfWeek;
    case "next-week":
      return offset > endOfWeek && offset <= endOfWeek + 7;
    case "this-month":
      return offset >= 0 && offset < 28;
    default:
      return false;
  }
}

export function buildEvaluatorInterviewTimeframeStats(
  rows: InterviewerAssignedInterviewRow[],
  reference: Date = new Date(),
): InterviewTimeframeStats {
  const scheduled = rows.filter(isScheduledInterview);

  const countFor = (timeframe: InterviewTimeframe) =>
    scheduled.filter((row) =>
      matchesTimeframe(dayOffsetFromScheduledAt(row.scheduledAt, reference), timeframe, reference),
    ).length;

  const today = countFor("today");
  const tomorrow = countFor("tomorrow");
  const thisWeek = countFor("this-week");
  const nextWeek = countFor("next-week");
  const thisMonth = countFor("this-month");

  const nextToday = scheduled.find(
    (r) => dayOffsetFromScheduledAt(r.scheduledAt, reference) === 0,
  );

  return {
    today: {
      count: today,
      subStat: nextToday
        ? `Next at ${nextToday.scheduledAt.split("·").pop()?.trim() ?? "soon"}`
        : today > 0
          ? "Scheduled with you"
          : "No interviews today",
    },
    tomorrow: {
      count: tomorrow,
      subStat: tomorrow > 0 ? `${tomorrow} on your calendar` : "Nothing scheduled yet",
    },
    "this-week": {
      count: thisWeek,
      subStat: thisWeek > 0 ? `${thisWeek} panels this week` : "Clear week ahead",
    },
    "next-week": {
      count: nextWeek,
      subStat: nextWeek > 0 ? `${nextWeek} scheduled so far` : "No sessions booked yet",
    },
    "this-month": {
      count: thisMonth,
      subStat: thisMonth > 0 ? `${thisMonth} across assigned jobs` : "Open slots available",
    },
  };
}

export function getOrgInterviewTimeframeStats(): InterviewTimeframeStats {
  return ORG_TIMEFRAME_STATS;
}

/** All org-wide interviews scheduled ahead (hero KPI — not scoped to a single day). */
export function getOrgUpcomingInterviewsOverall(): InterviewTimeframeSnapshot {
  const { tomorrow, "this-week": thisWeek, "next-week": nextWeek } = ORG_TIMEFRAME_STATS;
  const count = thisWeek.count + nextWeek.count;
  return {
    count,
    subStat: `${tomorrow.count} tomorrow · ${thisWeek.count} this week · ${nextWeek.count} next week`,
  };
}

/** Evaluator — all upcoming panels on their calendar (includes today). */
export function buildEvaluatorUpcomingInterviewsOverall(
  rows: InterviewerAssignedInterviewRow[],
): InterviewTimeframeSnapshot {
  const upcoming = rows.filter(
    (r) => r.interviewStatus === "Upcoming" || r.interviewStatus === "Ongoing",
  );
  const afterToday = upcoming.filter((r) => !r.isToday);
  return {
    count: upcoming.length,
    subStat:
      afterToday.length > 0
        ? `${afterToday.length} ahead · ${upcoming.length - afterToday.length} today`
        : upcoming.length > 0
          ? `${upcoming.length} today only`
          : "Nothing scheduled",
  };
}

export function readStoredInterviewTimeframe(): InterviewTimeframe {
  if (typeof window === "undefined") return "today";
  try {
    const stored = localStorage.getItem(INTERVIEW_TIMEFRAME_STORAGE_KEY);
    if (stored && INTERVIEW_TIMEFRAME_OPTIONS.some((o) => o.value === stored)) {
      return stored as InterviewTimeframe;
    }
  } catch {
    /* ignore */
  }
  return "today";
}

export function persistInterviewTimeframe(timeframe: InterviewTimeframe): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(INTERVIEW_TIMEFRAME_STORAGE_KEY, timeframe);
  } catch {
    /* ignore */
  }
}

export function isInterviewsTimeframeKpiId(id: string): boolean {
  return id === "interviewsToday" || id === "today";
}

// ── Static timeframe KPI data (feedbackDue, offers, hired) ────

const FEEDBACK_DUE_TIMEFRAME_STATS: InterviewTimeframeStats = {
  today:        { count: 10, subStat: "3 overdue" },
  tomorrow:     { count: 6,  subStat: "2 due tomorrow" },
  "this-week":  { count: 12, subStat: "12 pending review" },
  "next-week":  { count: 9,  subStat: "9 upcoming" },
  "this-month": { count: 38, subStat: "38 pending review" },
};

const OFFERS_TIMEFRAME_STATS: InterviewTimeframeStats = {
  today:        { count: 9,  subStat: "2 expiring" },
  tomorrow:     { count: 7,  subStat: "1 expiring tomorrow" },
  "this-week":  { count: 8,  subStat: "8 active offers" },
  "next-week":  { count: 5,  subStat: "5 active offers" },
  "this-month": { count: 26, subStat: "26 active offers" },
};

const HIRED_TIMEFRAME_STATS: InterviewTimeframeStats = {
  today:        { count: 1,  subStat: "1 hired today" },
  tomorrow:     { count: 0,  subStat: "No hires projected" },
  "this-week":  { count: 5,  subStat: "5 this week" },
  "next-week":  { count: 3,  subStat: "3 projected" },
  "this-month": { count: 24, subStat: "Across all roles" },
};

const STATIC_KPI_TIMEFRAME_STATS: Record<string, InterviewTimeframeStats> = {
  feedbackDue: FEEDBACK_DUE_TIMEFRAME_STATS,
  offers:      OFFERS_TIMEFRAME_STATS,
  hired:       HIRED_TIMEFRAME_STATS,
};

const STATIC_KPI_STORAGE_KEYS: Record<string, string> = {
  feedbackDue: "ze.dashboard.feedback-due-timeframe",
  offers:      "ze.dashboard.offers-timeframe",
  hired:       "ze.dashboard.hired-timeframe",
};

export function getStaticKpiTimeframeStats(kpiId: string): InterviewTimeframeStats {
  return STATIC_KPI_TIMEFRAME_STATS[kpiId] ?? FEEDBACK_DUE_TIMEFRAME_STATS;
}

export function readStoredKpiTimeframe(kpiId: string): InterviewTimeframe {
  if (typeof window === "undefined") return "today";
  try {
    const key = STATIC_KPI_STORAGE_KEYS[kpiId];
    if (!key) return "today";
    const stored = localStorage.getItem(key);
    // Validate against the restricted option set (no Tomorrow for static KPIs)
    if (stored && KPI_TIMEFRAME_OPTIONS.some((o) => o.value === stored)) {
      return stored as InterviewTimeframe;
    }
  } catch { /* ignore */ }
  return "today";
}

export function persistKpiTimeframe(kpiId: string, timeframe: InterviewTimeframe): void {
  try {
    if (typeof window === "undefined") return;
    const key = STATIC_KPI_STORAGE_KEYS[kpiId];
    if (key) localStorage.setItem(key, timeframe);
  } catch { /* ignore */ }
}

const STATIC_TIMEFRAME_KPI_IDS = new Set(["feedbackDue", "offers", "hired"]);

export function isStaticKpiTimeframeId(id: string): boolean {
  return STATIC_TIMEFRAME_KPI_IDS.has(id);
}
