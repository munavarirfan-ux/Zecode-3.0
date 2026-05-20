export type ZeInterviewStatus = "Invited" | "Upcoming" | "Ongoing" | "Completed" | "No Show" | "Cancelled";

export const zeMock = {
  workspace: {
    name: "Ze[hub] — NovaTech",
    region: "EU/UK",
  },
  dashboard: {
    hero: {
      activeJobs: 12,
      totalCandidates: 482,
      totalInterviews: 126,
      avgHiringSuccessRate: 31,
      hiringHealth: "Healthy" as const,
    },
    interviewStatus: {
      counts: {
        invited: 22,
        upcoming: 31,
        ongoing: 6,
        completed: 58,
        noShow: 4,
        rescheduled: 3,
        cancelled: 2,
      },
      totals: {
        totalInterviews: 126,
        avgCompletionRatePct: 79,
        noShowPct: 3.2,
        feedbackPendingPct: 12.5,
      },
    },
    interviewerTime: [
      { name: "Marcus Chen", interviews: 18, hours: 22.5, avgRating: 4.7, completionRatePct: 94 },
      { name: "Ava Patel", interviews: 14, hours: 16.0, avgRating: 4.5, completionRatePct: 91 },
      { name: "Noah Singh", interviews: 12, hours: 15.25, avgRating: 4.6, completionRatePct: 88 },
      { name: "Lina Hoffmann", interviews: 9, hours: 11.0, avgRating: 4.4, completionRatePct: 93 },
      { name: "Maya Torres", interviews: 7, hours: 8.25, avgRating: 4.3, completionRatePct: 86 },
    ],
    assessmentAnalytics: {
      kpis: {
        totalAssessments: 38,
        completedAssessments: 312,
        qualifiedCandidates: 74,
        rejectedCandidates: 129,
        avgScorePct: 71,
        avgCompletionMinutes: 64,
        activeAssessments: 6,
        abandonedAssessments: 41,
      },
      trendMonthly: [
        { month: "Jan", avgScore: 67, completions: 44 },
        { month: "Feb", avgScore: 69, completions: 52 },
        { month: "Mar", avgScore: 70, completions: 58 },
        { month: "Apr", avgScore: 72, completions: 61 },
        { month: "May", avgScore: 71, completions: 97 },
      ],
    },
    malpractice: {
      flaggedCandidates: 13,
      items: [
        { label: "Tab switching", pct: 21, severity: "medium" as const },
        { label: "Copy attempts", pct: 9, severity: "low" as const },
        { label: "Camera disabled", pct: 6, severity: "high" as const },
        { label: "Suspicious movement", pct: 12, severity: "medium" as const },
        { label: "Multiple screen detected", pct: 4, severity: "high" as const },
        { label: "Browser minimize events", pct: 16, severity: "low" as const },
      ],
    },
    topLanguages: [
      { name: "Python", candidates: 146, assessments: 92, successRatePct: 34 },
      { name: "Java", candidates: 88, assessments: 57, successRatePct: 29 },
      { name: "JavaScript", candidates: 102, assessments: 74, successRatePct: 27 },
      { name: "TypeScript", candidates: 96, assessments: 69, successRatePct: 31 },
      { name: "C++", candidates: 41, assessments: 26, successRatePct: 22 },
      { name: "Go", candidates: 37, assessments: 18, successRatePct: 33 },
      { name: "Rust", candidates: 19, assessments: 8, successRatePct: 28 },
      { name: "SQL", candidates: 122, assessments: 104, successRatePct: 26 },
    ],
    candidateAnalytics: {
      totals: {
        total: 482,
        shortlisted: 138,
        interviewed: 126,
        hired: 24,
        rejected: 141,
        pipelineConversionRatePct: 18,
      },
      funnel: [
        { stage: "Applied", value: 482 },
        { stage: "Assessment", value: 312 },
        { stage: "Interview", value: 126 },
        { stage: "Offer", value: 41 },
        { stage: "Hired", value: 24 },
      ],
    },
    ops: [
      { label: "Upcoming interviews", value: 18 },
      { label: "Pending feedback", value: 9 },
      { label: "Assessments awaiting review", value: 14 },
      { label: "No-show candidates", value: 3 },
      { label: "Qualified candidates", value: 27 },
      { label: "Rejected candidates", value: 41 },
    ],
    activity: [
      { time: "2m ago", text: "Elena Rodriguez moved to Interview stage (Senior Product Designer)." },
      { time: "14m ago", text: "Assessment completed: Backend Systems — Marcus Thorne (Score: 88%)." },
      { time: "46m ago", text: "Feedback submitted: Technical Round — Emma Schneider (Problem solving: 4.8/5)." },
      { time: "2h ago", text: "Job created: Staff Data Engineer (Berlin / Hybrid)." },
    ],
    upcomingSchedules: {
      today: [
        { title: "Technical Interview", candidate: "Sarah Jenkins", interviewer: "Ava Patel", time: "10:30", type: "Live", joinLabel: "Join" },
        { title: "Assessment Review", candidate: "Morgan Hill", interviewer: "Noah Singh", time: "15:00", type: "Async", joinLabel: "Open" },
      ],
      tomorrow: [
        { title: "HR Interview", candidate: "Elena Rodriguez", interviewer: "Marcus Chen", time: "09:00", type: "Meet", joinLabel: "Join" },
      ],
      week: [
        { title: "System Design", candidate: "Jamie Fox", interviewer: "Lina Hoffmann", time: "Tue 14:00", type: "Live", joinLabel: "Join" },
        { title: "Portfolio Review", candidate: "Alex Chen", interviewer: "Maya Torres", time: "Wed 11:00", type: "Meet", joinLabel: "Join" },
      ],
    },
  },

  interviews: {
    primaryCta: "+ Schedule Interview",
    list: [
      {
        candidate: "Emma Schneider",
        role: "Senior Product Designer",
        interviewer: "Marcus Chen",
        dateTime: "Wed 15:00",
        timezone: "Europe/Berlin",
        status: "Completed" as ZeInterviewStatus,
        feedback: "Submitted",
      },
      {
        candidate: "Sarah Jenkins",
        role: "Senior Product Designer",
        interviewer: "Ava Patel",
        dateTime: "Thu 10:30",
        timezone: "Europe/London",
        status: "Upcoming" as ZeInterviewStatus,
        feedback: "Pending",
      },
      {
        candidate: "Elena Rodriguez",
        role: "Senior Product Designer",
        interviewer: "Marcus Chen",
        dateTime: "Fri 09:00",
        timezone: "America/New_York",
        status: "Invited" as ZeInterviewStatus,
        feedback: "—",
      },
    ],
  },

  assessments: {
    list: [
      {
        name: "Backend Systems — Core",
        role: "Backend Engineer",
        createdBy: "Admin",
        date: "May 09",
        invited: 44,
        notStarted: 12,
        evaluated: 18,
        qualified: 9,
        status: "Ongoing",
      },
      {
        name: "SQL + Analytics",
        role: "Data Analyst",
        createdBy: "Curator",
        date: "May 06",
        invited: 30,
        notStarted: 6,
        evaluated: 19,
        qualified: 11,
        status: "Completed",
      },
      {
        name: "System Design — Senior",
        role: "Platform Engineer",
        createdBy: "Admin",
        date: "May 03",
        invited: 0,
        notStarted: 0,
        evaluated: 0,
        qualified: 0,
        status: "Draft",
      },
    ],
  },

  questionPool: {
    types: ["Coding", "Database", "MCQ", "Comprehension", "Open-ended", "Fill-in-the-blank", "Debugging", "System design"] as const,
    questions: [
      {
        title: "Design a rate limiter for API traffic",
        type: "System design",
        difficulty: "Hard",
        skills: ["Distributed systems", "Caching"],
        tags: ["rate-limit", "infra"],
        curator: "Curator",
        usage: 128,
        avgScore: 0.62,
        updated: "May 10",
      },
      {
        title: "SQL: Find 7-day retention by cohort",
        type: "Database",
        difficulty: "Medium",
        skills: ["SQL", "Analytics"],
        tags: ["cohort", "retention"],
        curator: "Curator",
        usage: 244,
        avgScore: 0.55,
        updated: "May 08",
      },
      {
        title: "Coding: Merge overlapping intervals",
        type: "Coding",
        difficulty: "Easy",
        skills: ["Algorithms"],
        tags: ["arrays"],
        curator: "Curator",
        usage: 512,
        avgScore: 0.78,
        updated: "May 02",
      },
    ],
  },

  enterprises: {
    list: [
      { name: "NovaTech Solutions", domain: "novatech.com", location: "Berlin", plan: "Enterprise", status: "Active", joined: "2025-10-12", users: 84, jobs: 22, candidates: 1184 },
      { name: "AtlasBank", domain: "atlasbank.co", location: "London", plan: "Enterprise", status: "Active", joined: "2025-08-03", users: 120, jobs: 34, candidates: 2093 },
      { name: "HelioHealth", domain: "helio.health", location: "NYC", plan: "Growth", status: "Trial", joined: "2026-04-21", users: 18, jobs: 6, candidates: 311 },
    ],
  },
};

