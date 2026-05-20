export type KpiDef = {
  id: string;
  label: string;
  value: string | number;
  subtitle: string;
  /** e.g. "+12% from yesterday" */
  trend?: string;
  trendUp?: boolean;
  /** Secondary operational line */
  insight?: string;
  icon: "briefcase" | "users" | "mic" | "percent" | "inbox" | "check" | "calendar" | "clipboard" | "flag" | "layers" | "archive" | "shield";
};

export const dashboardGreeting = {
  /** Shown when no session name */
  fallbackName: "Irfan",
  stats: {
    interviewsToday: 4,
    feedbackPending: 12,
    assessmentsAwaitingReview: 3,
  },
};

/** Interview funnel for Recharts */
export const interviewStatusChart = [
  { name: "Invited", value: 22, fill: "#71717A" },
  { name: "Upcoming", value: 31, fill: "#FF6B2C" },
  { name: "Ongoing", value: 6, fill: "#F97316" },
  { name: "Completed", value: 58, fill: "#16A34A" },
  { name: "No Show", value: 4, fill: "#EF4444" },
  { name: "Rescheduled", value: 3, fill: "#F59E0B" },
];

export const interviewerProductivityRows = [
  { name: "Marcus Chen", conducted: 18, totalHours: 22.5, avgRating: 4.7, barPct: 100 },
  { name: "Ava Patel", conducted: 14, totalHours: 16.0, avgRating: 4.5, barPct: 78 },
  { name: "Noah Singh", conducted: 12, totalHours: 15.25, avgRating: 4.6, barPct: 67 },
  { name: "Lina Hoffmann", conducted: 9, totalHours: 11.0, avgRating: 4.4, barPct: 50 },
  { name: "Maya Torres", conducted: 7, totalHours: 8.25, avgRating: 4.3, barPct: 39 },
];

export type ScheduleRow = {
  candidate: string;
  role: string;
  interviewer: string;
  interviewerInitials: string;
  timeLabel: string;
  timezone: string;
  durationMin: number;
  stage: string;
  status: "Confirmed" | "Hold" | "Rescheduled";
  join: string;
};

export const upcomingScheduleRows: ScheduleRow[] = [
  {
    candidate: "Sarah Jenkins",
    role: "Senior business analyst",
    interviewer: "Ava Patel",
    interviewerInitials: "AP",
    timeLabel: "10:30",
    timezone: "CET",
    durationMin: 60,
    stage: "Technical",
    status: "Confirmed",
    join: "Join",
  },
  {
    candidate: "Morgen Hill",
    role: "Staff Backend Engineer",
    interviewer: "Noah Singh",
    interviewerInitials: "NS",
    timeLabel: "15:00",
    timezone: "CET",
    durationMin: 90,
    stage: "System design",
    status: "Confirmed",
    join: "Join",
  },
  {
    candidate: "Elena Rodriguez",
    role: "Principal PM",
    interviewer: "Marcus Chen",
    interviewerInitials: "MC",
    timeLabel: "17:15",
    timezone: "EST",
    durationMin: 45,
    stage: "Culture",
    status: "Hold",
    join: "Join",
  },
];

/** Design mock: four green bars, shared axis label "90 – 100", heights ~45 / 30 / 65 / 20 */
export const assessmentQualification = [
  { range: "90 – 100", count: 45 },
  { range: "90 – 100", count: 30 },
  { range: "90 – 100", count: 65 },
  { range: "90 – 100", count: 20 },
];

export const malpracticeSignals = [
  { label: "Copy / paste attempts", pct: 9, note: "Median 2 events per session" },
  { label: "Tab visibility changes", pct: 21, note: "Often paired with research tasks" },
  { label: "Window minimize / blur", pct: 16, note: "Within expected range" },
  { label: "AI-generated answer risk", pct: 6, note: "Style + timing heuristics" },
];

export const evaluationQueue = [
  { candidate: "Jamie Fox", assessment: "System Design — Senior", score: "—", wait: "2h" },
  { candidate: "Alex Chen", assessment: "Backend Systems", score: "82%", wait: "5h" },
  { candidate: "Priya Nair", assessment: "SQL + Analytics", score: "74%", wait: "1d" },
];

export const topTechnologies = [
  { name: "TypeScript", pct: 31, assessments: 69, barMuted: false },
  { name: "Python", pct: 34, assessments: 69, barMuted: false },
  { name: "GO", pct: 33, assessments: 69, barMuted: false },
  { name: "JAVA", pct: 29, assessments: 69, barMuted: true },
];

export const scheduleCalendarDays = [
  { day: "Mon", interviews: 6, conflicts: 0 },
  { day: "Tue", interviews: 9, conflicts: 1 },
  { day: "Wed", interviews: 11, conflicts: 0 },
  { day: "Thu", interviews: 14, conflicts: 2 },
  { day: "Fri", interviews: 8, conflicts: 0 },
];

export const evaluatorAvailability = [
  { name: "Marcus Chen", slots: "12 / 20", status: "Available" },
  { name: "Raj Mehta", slots: "6 / 20", status: "Limited" },
  { name: "Charlie Dubois", slots: "18 / 20", status: "Available" },
  { name: "Chandu", slots: "10 / 20", status: "Limited" },
  { name: "Praveen", slots: "14 / 20", status: "Available" },
  { name: "Supriya", slots: "8 / 20", status: "Limited" },
  { name: "Anuradha", slots: "16 / 20", status: "Available" },
  { name: "Kavya", slots: "11 / 20", status: "Available" },
];

export type GlobalInterviewStatus =
  | "Live now"
  | "Starting soon"
  | "Scheduled"
  | "Waiting room"
  | "Feedback pending";

export type GlobalInterviewFeedRow = {
  id: string;
  candidateName: string;
  jobRole: string;
  stage: string;
  panelMembers: string[];
  scheduledTime: string;
  status: GlobalInterviewStatus;
  meetingStatus: "Connected" | "Not started" | "Waiting";
  roomId: string;
};

export const globalInterviewFeedRows: GlobalInterviewFeedRow[] = [
  {
    id: "g-1",
    candidateName: "Sarah Jenkins",
    jobRole: "Staff Product Designer",
    stage: "Technical Round 2",
    panelMembers: ["Marcus Chen", "Elena Hoffmann"],
    scheduledTime: "10:30 CET",
    status: "Live now",
    meetingStatus: "Connected",
    roomId: "zm-dashboard-sarah-jenkins-tech-2",
  },
  {
    id: "g-2",
    candidateName: "Morgen Hill",
    jobRole: "Staff Backend Engineer",
    stage: "System design",
    panelMembers: ["Noah Singh", "Ava Patel"],
    scheduledTime: "11:15 CET",
    status: "Starting soon",
    meetingStatus: "Waiting",
    roomId: "zm-dashboard-morgen-hill-system-design",
  },
  {
    id: "g-3",
    candidateName: "Elena Rodriguez",
    jobRole: "Principal PM",
    stage: "Culture",
    panelMembers: ["Marcus Chen"],
    scheduledTime: "13:00 EST",
    status: "Waiting room",
    meetingStatus: "Waiting",
    roomId: "zm-dashboard-elena-rodriguez-culture",
  },
  {
    id: "g-4",
    candidateName: "Jamie Fox",
    jobRole: "Senior business analyst",
    stage: "Technical Round 1",
    panelMembers: ["Lina Hoffmann"],
    scheduledTime: "15:20 CET",
    status: "Scheduled",
    meetingStatus: "Not started",
    roomId: "zm-dashboard-jamie-fox-tech-1",
  },
  {
    id: "g-5",
    candidateName: "Oliver Grant",
    jobRole: "Senior Product Designer",
    stage: "Portfolio review",
    panelMembers: ["Ava Patel"],
    scheduledTime: "17:10 CET",
    status: "Feedback pending",
    meetingStatus: "Not started",
    roomId: "zm-dashboard-oliver-grant-portfolio",
  },
];

export type InterviewerWorkloadStatus = "Available" | "Moderate load" | "Busy" | "Overloaded";

export type InterviewerOpsRow = {
  id: string;
  name: string;
  title: string;
  assignedThisWeek: number;
  completed: number;
  pendingFeedback: number;
  availableSlotsToday: number;
  status: InterviewerWorkloadStatus;
};

export const interviewerOpsRows: InterviewerOpsRow[] = [
  {
    id: "i-1",
    name: "Marcus Chen",
    title: "Senior Product Designer",
    assignedThisWeek: 12,
    completed: 8,
    pendingFeedback: 3,
    availableSlotsToday: 2,
    status: "Moderate load",
  },
  {
    id: "i-2",
    name: "Ava Patel",
    title: "Senior Backend Engineer",
    assignedThisWeek: 15,
    completed: 10,
    pendingFeedback: 5,
    availableSlotsToday: 1,
    status: "Busy",
  },
  {
    id: "i-3",
    name: "Noah Singh",
    title: "Engineering Manager",
    assignedThisWeek: 7,
    completed: 6,
    pendingFeedback: 1,
    availableSlotsToday: 3,
    status: "Available",
  },
  {
    id: "i-4",
    name: "Lina Hoffmann",
    title: "Principal PM",
    assignedThisWeek: 18,
    completed: 11,
    pendingFeedback: 7,
    availableSlotsToday: 0,
    status: "Overloaded",
  },
];

export type FeedbackDueStatus = "Pending" | "Request Sent" | "Overdue" | "Completed";

export type FeedbackDueItem = {
  id: string;
  candidateName: string;
  jobName: string;
  stage: string;
  interviewerName: string;
  pendingDuration: string;
  status: FeedbackDueStatus;
  /** e.g. "Reminder sent 2h ago" */
  requestSentNote?: string;
};

export const feedbackDueItems: FeedbackDueItem[] = [
  {
    id: "fd-1",
    candidateName: "Sarah Jenkins",
    jobName: "Staff Product Designer",
    stage: "Technical Round 2",
    interviewerName: "Marcus Chen",
    pendingDuration: "2 days",
    status: "Pending",
  },
  {
    id: "fd-2",
    candidateName: "Morgen Hill",
    jobName: "Staff Backend Engineer",
    stage: "System design",
    interviewerName: "Ava Patel",
    pendingDuration: "4 days",
    status: "Overdue",
  },
  {
    id: "fd-3",
    candidateName: "Elena Rodriguez",
    jobName: "Principal PM",
    stage: "Culture",
    interviewerName: "Noah Singh",
    pendingDuration: "6h",
    status: "Request Sent",
    requestSentNote: "Reminder sent 2h ago",
  },
  {
    id: "fd-4",
    candidateName: "Jamie Fox",
    jobName: "Senior business analyst",
    stage: "Technical Round 1",
    interviewerName: "Lina Hoffmann",
    pendingDuration: "—",
    status: "Completed",
    requestSentNote: "Submitted 18m ago",
  },
];

export const schedulingConflicts = [
  { id: "1", detail: "Ava Patel — double-booked 14:00–15:00 Thu", severity: "medium" as const },
  { id: "2", detail: "Berlin panel room — overlap 11:00 Tue", severity: "low" as const },
];

export type OperationalActivityTone = "default" | "success" | "warning" | "accent";

export type OperationalActivityItem = {
  id: string;
  initials: string;
  headline: string;
  detail: string;
  timeLabel: string;
  tone: OperationalActivityTone;
};

export const recentOperationalActivity: OperationalActivityItem[] = [
  {
    id: "a1",
    initials: "MC",
    headline: "Marcus Chen submitted interview feedback",
    detail: "Senior Product Designer · Round 2",
    timeLabel: "2m ago",
    tone: "default",
  },
  {
    id: "a2",
    initials: "SJ",
    headline: "Sarah Jenkins moved to Round 3",
    detail: "Staff Backend Engineer · Pipeline",
    timeLabel: "14m ago",
    tone: "accent",
  },
  {
    id: "a3",
    initials: "AI",
    headline: "Assessment flagged for AI-risk review",
    detail: "SQL + Analytics · Heuristic match",
    timeLabel: "32m ago",
    tone: "warning",
  },
  {
    id: "a4",
    initials: "AP",
    headline: "Offer sent to Noah Singh",
    detail: "Principal PM · Compensation band B",
    timeLabel: "1h ago",
    tone: "default",
  },
  {
    id: "a5",
    initials: "NS",
    headline: "Candidate accepted offer",
    detail: "Platform Engineer · London",
    timeLabel: "2h ago",
    tone: "success",
  },
];

/** Demo persona when previewing as interviewer (maps session fallback names). */
export const loggedInInterviewerPersona = "Ava Patel";

export type MyAssignedInterview = {
  id: string;
  candidateName: string;
  jobRole: string;
  round: string;
  dateLabel: string;
  timeLabel: string;
  timezone: string;
  durationMin: number;
  status: ScheduleRow["status"];
  roomId: string;
  interviewerName: string;
  jobId: string;
};

export const myAssignedInterviewsAll: MyAssignedInterview[] = [
  {
    id: "mi-1",
    candidateName: "Sarah Jenkins",
    jobRole: "Staff Product Designer",
    round: "Technical Round 2",
    dateLabel: "Today",
    timeLabel: "10:30",
    timezone: "CET",
    durationMin: 60,
    status: "Confirmed",
    roomId: "zm-dashboard-sarah-jenkins-tech-2",
    interviewerName: "Ava Patel",
    jobId: "job-spd-1",
  },
  {
    id: "mi-2",
    candidateName: "Oliver Grant",
    jobRole: "Senior Product Designer",
    round: "Portfolio review",
    dateLabel: "Today",
    timeLabel: "14:00",
    timezone: "CET",
    durationMin: 45,
    status: "Confirmed",
    roomId: "zm-dashboard-oliver-grant-portfolio",
    interviewerName: "Ava Patel",
    jobId: "job-spd-2",
  },
  {
    id: "mi-3",
    candidateName: "Morgen Hill",
    jobRole: "Staff Backend Engineer",
    round: "System design",
    dateLabel: "Thu",
    timeLabel: "15:00",
    timezone: "CET",
    durationMin: 90,
    status: "Confirmed",
    roomId: "zm-dashboard-morgen-hill-system-design",
    interviewerName: "Ava Patel",
    jobId: "job-sbe-1",
  },
  {
    id: "mi-4",
    candidateName: "Ryan Patel",
    jobRole: "Staff Product Designer",
    round: "Technical Round 1",
    dateLabel: "Fri",
    timeLabel: "11:00",
    timezone: "CET",
    durationMin: 60,
    status: "Hold",
    roomId: "zm-dashboard-ryan-patel-tr1",
    interviewerName: "Ava Patel",
    jobId: "job-spd-1",
  },
  {
    id: "mi-5",
    candidateName: "Elena Rodriguez",
    jobRole: "Principal PM",
    round: "Culture",
    dateLabel: "Wed",
    timeLabel: "17:15",
    timezone: "EST",
    durationMin: 45,
    status: "Confirmed",
    roomId: "zm-dashboard-elena-rodriguez-culture",
    interviewerName: "Noah Singh",
    jobId: "job-pm-1",
  },
  {
    id: "mi-6",
    candidateName: "Oliver Grant",
    jobRole: "Senior Product Designer",
    round: "Portfolio review",
    dateLabel: "Mon",
    timeLabel: "16:00",
    timezone: "CET",
    durationMin: 45,
    status: "Confirmed",
    roomId: "zm-dashboard-oliver-grant-portfolio-done",
    interviewerName: "Ava Patel",
    jobId: "job-spd-2",
  },
  {
    id: "mi-7",
    candidateName: "James Okafor",
    jobRole: "Staff Product Designer",
    round: "Recruiter Screening",
    dateLabel: "Tue",
    timeLabel: "11:30",
    timezone: "CET",
    durationMin: 30,
    status: "Confirmed",
    roomId: "zm-dashboard-james-okafor-screen",
    interviewerName: "Ava Patel",
    jobId: "job-spd-1",
  },
  {
    id: "mi-8",
    candidateName: "Alex Chen",
    jobRole: "Principal Platform Engineer",
    round: "Technical Round 1",
    dateLabel: "Wed",
    timeLabel: "14:00",
    timezone: "GMT",
    durationMin: 55,
    status: "Confirmed",
    roomId: "zm-dashboard-alex-chen-tr1",
    interviewerName: "Ava Patel",
    jobId: "job-sbe-1",
  },
  {
    id: "mi-9",
    candidateName: "Morgen Hill",
    jobRole: "Staff Backend Engineer",
    round: "Technical Interview",
    dateLabel: "Thu",
    timeLabel: "10:00",
    timezone: "GMT",
    durationMin: 50,
    status: "Confirmed",
    roomId: "zm-dashboard-morgen-hill-tech",
    interviewerName: "Ava Patel",
    jobId: "job-sbe-1",
  },
  {
    id: "mi-10",
    candidateName: "Emma Larsen",
    jobRole: "Staff Product Designer",
    round: "Design Review",
    dateLabel: "Fri",
    timeLabel: "09:00",
    timezone: "CET",
    durationMin: 60,
    status: "Confirmed",
    roomId: "zm-dashboard-emma-larsen-design",
    interviewerName: "Ava Patel",
    jobId: "job-spd-1",
  },
];

export type WeekdayId = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type WeeklyScheduleEntry =
  | { kind: "interview"; id: string; time: string; label: string; round: string }
  | { kind: "available"; id: string; time: string }
  | { kind: "blocked"; id: string; time: string; reason?: string };

export type InterviewerWeekDay = {
  day: WeekdayId;
  dateLabel: string;
  entries: WeeklyScheduleEntry[];
};

export const myWeeklyScheduleForInterviewer: InterviewerWeekDay[] = [
  {
    day: "Mon",
    dateLabel: "May 19",
    entries: [
      { kind: "available", id: "a-mon-1", time: "10:00–12:00" },
      { kind: "interview", id: "i-mon-1", time: "14:00", label: "Sarah Jenkins", round: "Technical R2" },
    ],
  },
  {
    day: "Tue",
    dateLabel: "May 20",
    entries: [
      { kind: "interview", id: "i-tue-1", time: "10:30", label: "Sarah Jenkins", round: "Technical R2" },
      { kind: "interview", id: "i-tue-2", time: "14:00", label: "Oliver Grant", round: "Portfolio" },
      { kind: "blocked", id: "b-tue-1", time: "16:00–17:00", reason: "Team sync" },
    ],
  },
  {
    day: "Wed",
    dateLabel: "May 21",
    entries: [
      { kind: "available", id: "a-wed-1", time: "14:00–17:00" },
      { kind: "blocked", id: "b-wed-1", time: "09:00–10:00", reason: "Focus block" },
    ],
  },
  {
    day: "Thu",
    dateLabel: "May 22",
    entries: [
      { kind: "available", id: "a-thu-1", time: "09:00–11:00" },
      { kind: "interview", id: "i-thu-1", time: "15:00", label: "Morgen Hill", round: "System design" },
    ],
  },
  {
    day: "Fri",
    dateLabel: "May 23",
    entries: [
      { kind: "interview", id: "i-fri-1", time: "11:00", label: "Jamie Fox", round: "Technical R1" },
      { kind: "available", id: "a-fri-1", time: "13:00–16:00" },
    ],
  },
  { day: "Sat", dateLabel: "May 24", entries: [] },
  { day: "Sun", dateLabel: "May 25", entries: [] },
];

export type AvailabilitySlot = {
  id: string;
  day: WeekdayId;
  startTime: string;
  endTime: string;
  timezone: string;
  repeatWeekly: boolean;
};

export const defaultInterviewerAvailabilitySlots: AvailabilitySlot[] = [
  { id: "slot-1", day: "Mon", startTime: "10:00", endTime: "12:00", timezone: "CET", repeatWeekly: true },
  { id: "slot-2", day: "Wed", startTime: "14:00", endTime: "17:00", timezone: "CET", repeatWeekly: true },
];

export type InterviewerAssignedJob = {
  jobId: string;
  jobTitle: string;
  roundAssigned: string;
  candidatesAssigned: number;
  upcomingInterviews: number;
  feedbackPending: number;
};

export const interviewerAssignedJobsAll: InterviewerAssignedJob[] = [
  {
    jobId: "job-spd-1",
    jobTitle: "Staff Product Designer",
    roundAssigned: "Technical · Portfolio",
    candidatesAssigned: 4,
    upcomingInterviews: 2,
    feedbackPending: 1,
  },
  {
    jobId: "job-spd-2",
    jobTitle: "Senior Product Designer",
    roundAssigned: "Portfolio review",
    candidatesAssigned: 3,
    upcomingInterviews: 1,
    feedbackPending: 0,
  },
  {
    jobId: "job-sbe-1",
    jobTitle: "Staff Backend Engineer",
    roundAssigned: "System design",
    candidatesAssigned: 2,
    upcomingInterviews: 1,
    feedbackPending: 1,
  },
];
