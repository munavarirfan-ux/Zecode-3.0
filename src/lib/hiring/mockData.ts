import type {
  CandidateInterview,
  CandidateVerdict,
  CustomFieldDef,
  HiringCandidate,
  HiringJob,
} from "./types";
import {
  formToCandidateInterview,
  type ScheduleInterviewPayload,
} from "./scheduleInterview";
import { DEFAULT_HIRING_STAGES } from "./types";
import { buildStaffDesignerApplicants } from "./staffDesignerApplicants";
import { mergePersistedJobs } from "./persistedJobs";
import { isHrInterviewRound } from "./customiseHiringProcess";
import {
  enrichCandidate,
  getCandidateStage,
  getDefaultStageForAddedBy,
  getDefaultSubstageForAddedBy,
  syncCandidateStageFields,
  type HiringStageName,
  buildStageTimelineDetail,
  type AddedBy,
  type CandidateSource,
  inferSourceCategory,
  normalizeSource,
} from "./stages";

const flow = (steps: string[]) => steps;

export const HIRING_JOBS: HiringJob[] = [
  {
    id: "staff-product-designer",
    title: "Staff Product Designer",
    department: "Product Design",
    location: "Berlin, DE",
    workMode: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Staff",
    hiringManager: "Elena Hoffmann",
    recruiterOwner: "Marcus Chen",
    status: "Published",
    visibility: "Internal + External",
    priority: "High",
    candidateCount: 100,
    careersApplicants: 48,
    referralCount: 18,
    interviewingCount: 28,
    candidatesThisWeek: 24,
    interviewsToday: 6,
    feedbackPending: 8,
    sources: [
      { channel: "Careers", count: 48 },
      { channel: "LinkedIn", count: 26 },
      { channel: "Referral", count: 18 },
      { channel: "Agency", count: 8 },
    ],
    flowPreview: flow(["Applied", "Screening", "Technical Round 1", "HR Round", "Offer"]),
    stages: [
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
        substages: DEFAULT_HIRING_STAGES[3].substages,
      },
    ],
    lastUpdated: "2026-05-14T10:22:00Z",
    lastUpdatedLabel: "2h ago",
    openings: 2,
    description:
      "Lead end-to-end product design for enterprise hiring workflows. Partner with engineering and research to ship structured, recruiter-efficient experiences across Ze[code].",
    responsibilities: [
      "Own design system alignment for hiring surfaces",
      "Run discovery with global enterprise customers",
      "Prototype and validate workflow changes with recruiters",
    ],
    requiredSkills: ["Figma", "Design systems", "Enterprise UX", "Workshop facilitation"],
    niceToHaveSkills: ["Hiring domain experience", "Accessibility audits"],
    salaryRange: "€95,000 – €115,000",
    deadline: "2026-06-30",
  },
  {
    id: "principal-platform-engineer",
    title: "Principal Platform Engineer",
    department: "Engineering",
    location: "London, UK",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Principal",
    hiringManager: "Noah Singh",
    recruiterOwner: "Ava Patel",
    status: "Published",
    visibility: "External",
    priority: "High",
    candidateCount: 62,
    careersApplicants: 28,
    referralCount: 8,
    interviewingCount: 16,
    candidatesThisWeek: 18,
    interviewsToday: 6,
    feedbackPending: 3,
    sources: [
      { channel: "Careers", count: 28 },
      { channel: "LinkedIn", count: 22 },
      { channel: "Referral", count: 8 },
      { channel: "Campus", count: 4 },
    ],
    flowPreview: flow(["Applied", "Screening", "Tech 1", "Tech 2", "System Design", "Offer"]),
    stages: DEFAULT_HIRING_STAGES.map((s) =>
      s.id === "interviews"
        ? {
            ...s,
            substages: [
              { id: "tech-1", name: "Technical Round 1" },
              { id: "tech-2", name: "Technical Round 2" },
              { id: "system-design", name: "System Design" },
            ],
          }
        : { ...s },
    ),
    lastUpdated: "2026-05-14T08:05:00Z",
    lastUpdatedLabel: "4h ago",
    openings: 1,
    description:
      "Architect scalable platform services for interview intelligence, assessment orchestration, and enterprise hiring operations.",
    responsibilities: [
      "Define platform APIs for hiring workflows",
      "Lead reliability and performance initiatives",
      "Mentor senior engineers across squads",
    ],
    requiredSkills: ["TypeScript", "Distributed systems", "PostgreSQL", "AWS"],
    niceToHaveSkills: ["Event-driven architecture", "SOC2 experience"],
    salaryRange: "£140,000 – £165,000",
    deadline: "2026-07-15",
  },
  {
    id: "senior-talent-partner",
    title: "Senior Talent Partner",
    department: "People Operations",
    location: "Singapore",
    workMode: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    hiringManager: "Priya Nair",
    recruiterOwner: "Raj Mehta",
    status: "Internal",
    visibility: "Internal",
    priority: "Normal",
    candidateCount: 19,
    careersApplicants: 0,
    referralCount: 11,
    interviewingCount: 4,
    candidatesThisWeek: 3,
    interviewsToday: 1,
    feedbackPending: 0,
    sources: [
      { channel: "Referral", count: 11 },
      { channel: "LinkedIn", count: 6 },
      { channel: "Direct", count: 2 },
    ],
    flowPreview: flow(["Applied", "Screening", "Panel", "Offer"]),
    stages: DEFAULT_HIRING_STAGES,
    lastUpdated: "2026-05-13T16:40:00Z",
    lastUpdatedLabel: "Yesterday",
    openings: 1,
    description: "Drive structured hiring operations for APAC engineering and GTM teams.",
    responsibilities: [
      "Partner with hiring managers on workforce planning",
      "Run operational reviews on pipeline health",
      "Improve recruiter tooling adoption",
    ],
    requiredSkills: ["Full-cycle recruiting", "Stakeholder management", "ATS operations"],
    niceToHaveSkills: ["APAC market experience"],
    salaryRange: "S$110,000 – S$130,000",
    deadline: "2026-06-01",
  },
  {
    id: "data-analyst-hiring-insights",
    title: "Data Analyst — Hiring Insights",
    department: "Analytics",
    location: "Austin, TX",
    workMode: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    hiringManager: "Jamie Fox",
    recruiterOwner: "Supriya Anand",
    status: "Draft",
    visibility: "Internal",
    priority: "Normal",
    candidateCount: 0,
    careersApplicants: 0,
    referralCount: 0,
    interviewingCount: 0,
    candidatesThisWeek: 0,
    interviewsToday: 0,
    feedbackPending: 0,
    sources: [],
    flowPreview: flow(["Applied", "Screening", "Case Study", "Offer"]),
    stages: DEFAULT_HIRING_STAGES,
    lastUpdated: "2026-05-12T11:00:00Z",
    lastUpdatedLabel: "2d ago",
    openings: 1,
    description: "Build operational analytics for hiring funnel health, interviewer load, and offer outcomes.",
    responsibilities: [
      "Define metrics for hiring operations",
      "Partner with product on dashboard insights",
      "Deliver weekly hiring health reports",
    ],
    requiredSkills: ["SQL", "dbt", "Looker", "Experiment design"],
    niceToHaveSkills: ["Python", "Hiring analytics"],
    salaryRange: "$95,000 – $110,000",
    deadline: "2026-08-01",
  },
  {
    id: "customer-success-lead-enterprise",
    title: "Customer Success Lead — Enterprise",
    department: "Customer Success",
    location: "New York, NY",
    workMode: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead",
    hiringManager: "Lina Hoffmann",
    recruiterOwner: "Marcus Chen",
    status: "On Hold",
    visibility: "Internal + External",
    priority: "Low",
    candidateCount: 24,
    careersApplicants: 14,
    referralCount: 4,
    interviewingCount: 5,
    candidatesThisWeek: 2,
    interviewsToday: 0,
    feedbackPending: 1,
    sources: [
      { channel: "Careers", count: 14 },
      { channel: "Agency", count: 6 },
      { channel: "Referral", count: 4 },
    ],
    flowPreview: flow(["Applied", "Screening", "Panel", "Executive", "Offer"]),
    stages: DEFAULT_HIRING_STAGES,
    lastUpdated: "2026-05-10T09:15:00Z",
    lastUpdatedLabel: "4d ago",
    openings: 1,
    description: "Lead enterprise onboarding and adoption for structured hiring operations.",
    responsibilities: [
      "Own post-sale hiring workflow success",
      "Run QBRs with enterprise customers",
      "Coordinate with product on roadmap feedback",
    ],
    requiredSkills: ["Enterprise CS", "Hiring operations", "Executive communication"],
    niceToHaveSkills: ["SaaS HR tech"],
    salaryRange: "$130,000 – $150,000",
    deadline: "2026-09-01",
  },
  {
    id: "campus-relations-coordinator",
    title: "Campus Relations Coordinator",
    department: "University Programs",
    location: "Toronto, CA",
    workMode: "Hybrid",
    employmentType: "Contract",
    experienceLevel: "Junior",
    hiringManager: "Charlie Dubois",
    recruiterOwner: "Kavya Menon",
    status: "Closed",
    visibility: "External",
    priority: "Normal",
    candidateCount: 88,
    careersApplicants: 52,
    referralCount: 12,
    interviewingCount: 0,
    candidatesThisWeek: 0,
    interviewsToday: 0,
    feedbackPending: 0,
    sources: [
      { channel: "Campus", count: 52 },
      { channel: "Careers", count: 24 },
      { channel: "Referral", count: 12 },
    ],
    flowPreview: flow(["Applied", "Screening", "Panel", "Offer"]),
    stages: DEFAULT_HIRING_STAGES,
    lastUpdated: "2026-04-28T14:00:00Z",
    lastUpdatedLabel: "2w ago",
    openings: 0,
    description: "Coordinate campus hiring events and early-career pipeline programs.",
    responsibilities: [
      "Plan university recruiting calendar",
      "Manage campus event logistics",
      "Track intern conversion metrics",
    ],
    requiredSkills: ["Event coordination", "Campus recruiting", "Communication"],
    niceToHaveSkills: ["Bilingual French"],
    salaryRange: "$58,000 – $68,000",
    deadline: "2026-04-15",
  },
];

export const CUSTOM_FIELD_DEFS: CustomFieldDef[] = [
  { id: "portfolio", label: "Portfolio URL", type: "url" },
  { id: "github", label: "GitHub", type: "url" },
  { id: "notice", label: "Notice Period", type: "dropdown", options: ["Immediate", "2 weeks", "1 month", "2+ months"] },
  { id: "expected-salary", label: "Expected Salary", type: "text" },
  { id: "work-auth", label: "Work Authorization", type: "dropdown", options: ["EU", "UK", "US", "Singapore", "Other"] },
];

function baseCandidate(
  partial: Omit<
    HiringCandidate,
    "emails" | "interviews" | "timeline" | "recruiterNotes" | "hiringManagerNotes" | "interviewerNotes"
  > & {
    emails?: HiringCandidate["emails"];
    interviews?: HiringCandidate["interviews"];
    timeline?: HiringCandidate["timeline"];
    recruiterNotes?: string;
    hiringManagerNotes?: string;
    interviewerNotes?: string;
  },
): HiringCandidate {
  return {
    ...partial,
    emails: partial.emails ?? [],
    interviews: partial.interviews ?? [],
    timeline: partial.timeline ?? [],
    recruiterNotes: partial.recruiterNotes ?? "",
    hiringManagerNotes: partial.hiringManagerNotes ?? "",
    interviewerNotes: partial.interviewerNotes ?? "",
  };
}

export const HIRING_CANDIDATES: HiringCandidate[] = [
  baseCandidate({
    id: "c-sarah-jenkins",
    jobId: "staff-product-designer",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@protonmail.com",
    phone: "+49 170 882 4410",
    location: "Berlin, DE",
    source: "Careers",
    appliedAt: "2026-05-10",
    currentStage: "Interviews",
    currentSubstage: "Design Review",
    recruiterOwner: "Marcus Chen",
    experience: "9 years · Enterprise SaaS · Design systems",
    skills: ["Figma", "Design ops", "Workshop facilitation", "Accessibility"],
    education: "M.A. Interaction Design — UdK Berlin",
    portfolioUrl: "https://sarahjenkins.design",
    linkedin: "linkedin.com/in/sarahjenkins",
    noticePeriod: "1 month",
    expectedSalary: "€108,000",
    resumeStatus: "Reviewed",
    resumeUploadedAt: "2026-05-10",
    kanbanColumn: "design-review",
    lastActivity: "2h ago",
    recruiterNotes: "Strong systems thinking. Portfolio aligns with enterprise density goals.",
    hiringManagerNotes: "Proceed to design review panel. Watch for research depth.",
    interviewerNotes: "Portfolio review: clear hierarchy, operational layouts.",
    emails: [
      {
        id: "e1",
        subject: "Ze[code] — Design Review invitation",
        sender: "Marcus Chen",
        recipient: "Elena",
        timestamp: "May 12, 10:30",
        type: "Interview Invite",
        preview: "Your design review is scheduled for May 15 at 14:00 CET…",
        body: `Hi Elena,

Thank you for your interest in the Staff Product Designer role at Ze[code].

Your design review is scheduled for May 15 at 14:00 CET (45 minutes, Google Meet). You'll meet with Elena Hoffmann from the product design team.

Please come prepared to walk through two case studies from your portfolio and discuss how you approach enterprise density and operational workflows.

Please reply to confirm your attendance. If you need to reschedule, let us know at least 24 hours in advance.

Best regards,
Marcus Chen
Senior Talent Partner`,
      },
      {
        id: "e2",
        subject: "Follow-up on portfolio submission",
        sender: "Marcus Chen",
        recipient: "Elena",
        timestamp: "May 11, 16:05",
        type: "Follow-up",
        preview: "Thanks for sharing your case study deck. Elena will join the review…",
        body: `Hi Elena,

Thanks for sharing your case study deck — the hiring panel has reviewed it and we're moving forward with a design review.

Elena Hoffmann will join the session to focus on research depth and how you structure complex hiring workflows in dense UIs.

If you have an updated deck or additional artifacts, feel free to attach them before May 14.

Feel free to reply with any questions. We're happy to help before your next step.

Best regards,
Marcus Chen`,
      },
    ],
    interviewPipeline: [
      { id: "jp1", label: "Resume Review", state: "completed" },
      { id: "jp2", label: "Recruiter Screen", state: "completed" },
      { id: "jp3", label: "Design Review", state: "active" },
      { id: "jp4", label: "Technical Interview", state: "upcoming" },
      { id: "jp5", label: "Final Round", state: "upcoming" },
      { id: "jp6", label: "Offer", state: "upcoming" },
    ],
    interviews: [
      {
        id: "i1",
        round: "Design Review",
        interviewers: ["Elena Hoffmann", "Marcus Chen"],
        scheduledAt: "May 15 · 17:00 CET",
        status: "Scheduled",
        feedbackStatus: "Pending",
        interviewType: "Panel",
        durationMinutes: 45,
        platform: "ZeMeet",
        roomId: "zm-c-sarah-jenkins-design-review",
        meetUrl: "/meet/zm-c-sarah-jenkins-design-review",
        feedbackPendingCount: 2,
        hasCodeChallenge: true,
      },
      {
        id: "i2",
        round: "Recruiter Screening",
        interviewers: ["Marcus Chen"],
        scheduledAt: "May 11 · 11:00 CET",
        status: "Completed",
        feedbackStatus: "Submitted",
        result: "Strong Hire",
        interviewType: "Video",
        durationMinutes: 30,
        platform: "Zoom",
        overallRating: 4.4,
        feedbackSubmittedCount: 1,
        feedbackPendingCount: 0,
        hasNotes: true,
        hasRecording: false,
      },
      {
        id: "i2b",
        round: "Resume Review",
        interviewers: ["Jordan Lee"],
        scheduledAt: "May 9 · 10:00 CET",
        status: "Completed",
        feedbackStatus: "Submitted",
        result: "Hire",
        interviewType: "Async",
        durationMinutes: 20,
        platform: "Ze[code] Review",
        overallRating: 4.1,
        feedbackSubmittedCount: 1,
        hasNotes: true,
      },
    ],
    timeline: [
      { id: "t1", label: "Applied", detail: "Via careers website", at: "May 10, 09:14" },
      { id: "t2", label: "Screening", detail: "Recruiter screening completed", at: "May 11, 12:30" },
      { id: "t3", label: "Interview Scheduled", detail: "Design Review — May 15", at: "May 12, 10:30" },
    ],
  }),
  baseCandidate({
    id: "c-alex-chen",
    jobId: "principal-platform-engineer",
    name: "Alex Chen",
    email: "alex.chen@outlook.com",
    phone: "+44 7700 900 882",
    location: "London, UK",
    source: "LinkedIn",
    appliedAt: "2026-05-08",
    currentStage: "Interviews",
    currentSubstage: "Technical Round 2",
    recruiterOwner: "Ava Patel",
    experience: "12 years · Platform · Distributed systems",
    skills: ["TypeScript", "Go", "Kafka", "PostgreSQL", "AWS"],
    education: "B.Sc. Computer Science — Imperial College London",
    github: "github.com/alexchen-platform",
    linkedin: "linkedin.com/in/alexchen",
    noticePeriod: "2 weeks",
    expectedSalary: "£155,000",
    resumeStatus: "Parsed",
    resumeUploadedAt: "2026-05-08",
    kanbanColumn: "tech-2",
    recruiterNotes: "Strong platform background. Moving to system design if Tech 2 passes.",
    hiringManagerNotes: "Prioritize system design slot this week.",
    interviewerNotes: "Tech 1: deep API design, good trade-off articulation.",
    emails: [
      {
        id: "e3",
        subject: "Technical Round 2 — Ze[code]",
        sender: "Ava Patel",
        timestamp: "May 13, 09:00",
        type: "Interview Invite",
        preview: "Your technical interview is confirmed for May 16…",
      },
    ],
    interviewPipeline: [
      { id: "ac-j1", label: "Recruiter Screen", state: "completed" },
      { id: "ac-j2", label: "Technical Round 1", state: "completed" },
      { id: "ac-j3", label: "Technical Round 2", state: "active" },
      { id: "ac-j4", label: "System Design", state: "upcoming" },
    ],
    interviews: [
      {
        id: "i3",
        round: "Technical Round 2",
        interviewers: ["Noah Singh", "Raj Mehta"],
        scheduledAt: "May 16 · 15:00 GMT",
        status: "Scheduled",
        feedbackStatus: "Pending",
        interviewType: "Technical",
        durationMinutes: 60,
        platform: "Google Meet",
        feedbackPendingCount: 2,
        hasCodeChallenge: true,
        feedbackRequestedAt: "4h ago",
      },
      {
        id: "i3a",
        round: "Technical Round 1",
        interviewers: ["Noah Singh"],
        scheduledAt: "May 12 · 14:00 GMT",
        status: "Completed",
        feedbackStatus: "Submitted",
        result: "Hire",
        interviewType: "Technical",
        durationMinutes: 55,
        platform: "Google Meet",
        overallRating: 4.2,
        feedbackSubmittedCount: 1,
        hasNotes: true,
        hasRecording: true,
        hasCodeChallenge: true,
      },
      {
        id: "i3b",
        round: "Technical Round 1",
        interviewers: ["Ava Patel"],
        scheduledAt: "Wed · 14:00 GMT",
        status: "Completed",
        feedbackStatus: "Pending",
        feedbackRequestedAt: "6 hours",
        interviewType: "Technical",
        durationMinutes: 55,
        platform: "ZeMeet",
        roomId: "zm-c-alex-chen-technical-round-1",
        meetUrl: "/meet/zm-c-alex-chen-technical-round-1",
        hasNotes: true,
      },
    ],
    timeline: [
      { id: "t4", label: "Applied", detail: "Inbound from LinkedIn", at: "May 8, 14:22" },
      { id: "t5", label: "Interview Scheduled", detail: "Technical Round 2", at: "May 13, 09:00" },
    ],
  }),
  baseCandidate({
    id: "c-priya-nair",
    jobId: "senior-talent-partner",
    name: "Priya Nair",
    email: "priya.nair@gmail.com",
    phone: "+65 9123 4401",
    location: "Singapore",
    source: "Referral",
    appliedAt: "2026-05-12",
    currentStage: "Screening",
    currentSubstage: "Hiring Manager Review",
    recruiterOwner: "Raj Mehta",
    experience: "7 years · Tech recruiting · APAC",
    skills: ["Full-cycle recruiting", "Workforce planning", "ATS operations"],
    education: "B.B.A. — NUS",
    linkedin: "linkedin.com/in/priyanair",
    noticePeriod: "1 month",
    expectedSalary: "S$125,000",
    resumeStatus: "Reviewed",
    resumeUploadedAt: "2026-05-12",
    kanbanColumn: "hm-review",
    recruiterNotes: "Referral from Noah Singh. Strong ops mindset.",
    hiringManagerNotes: "Schedule HM review by Friday.",
    interviewerNotes: "",
    emails: [],
    interviews: [],
    timeline: [{ id: "t6", label: "Applied", detail: "Employee referral", at: "May 12, 08:40" }],
  }),
  baseCandidate({
    id: "c-morgen-hill",
    jobId: "principal-platform-engineer",
    name: "Morgen Hill",
    email: "morgen.hill@icloud.com",
    phone: "+1 415 555 0192",
    location: "San Francisco, CA",
    source: "Agency",
    appliedAt: "2026-05-06",
    currentStage: "Hire & Offers",
    currentSubstage: "Offer Sent",
    stage: "Hired & Offers",
    recruiterOwner: "Ava Patel",
    experience: "14 years · Staff+ engineering",
    skills: ["Java", "Kubernetes", "System design", "Mentorship"],
    education: "M.S. CS — Stanford",
    github: "github.com/morgenhill",
    noticePeriod: "2 weeks",
    expectedSalary: "£162,000",
    resumeStatus: "Reviewed",
    resumeUploadedAt: "2026-05-06",
    kanbanColumn: "offer-sent",
    recruiterNotes: "Offer sent May 13. Awaiting signature.",
    hiringManagerNotes: "Approved comp band B.",
    interviewerNotes: "Unanimous hire across panels.",
    emails: [
      {
        id: "e4",
        subject: "Ze[code] — Offer letter",
        sender: "Ava Patel",
        timestamp: "May 13, 17:00",
        type: "Offer",
        preview: "We are pleased to extend an offer for Principal Platform Engineer…",
      },
    ],
    interviewPipeline: [
      { id: "mh-j1", label: "Recruiter Screen", state: "completed" },
      { id: "mh-j2", label: "Technical Interview", state: "completed" },
      { id: "mh-j3", label: "System Design", state: "completed" },
      { id: "mh-j4", label: "Final Round", state: "completed" },
      { id: "mh-j5", label: "Offer", state: "active" },
    ],
    interviews: [
      {
        id: "i4",
        round: "System Design",
        interviewers: ["Noah Singh", "Raj Mehta"],
        scheduledAt: "May 10 · 16:00 GMT",
        status: "Completed",
        feedbackStatus: "Submitted",
        result: "Strong Hire",
        interviewType: "Technical",
        durationMinutes: 75,
        platform: "Google Meet",
        overallRating: 4.6,
        feedbackSubmittedCount: 2,
        feedbackPendingCount: 0,
        hasNotes: true,
        hasRecording: true,
        hasCodeChallenge: true,
      },
      {
        id: "i4b",
        round: "Technical Interview",
        interviewers: ["Elena Hoffmann"],
        scheduledAt: "May 7 · 11:00 GMT",
        status: "Completed",
        feedbackStatus: "Submitted",
        result: "Strong Hire",
        interviewType: "Video",
        durationMinutes: 50,
        platform: "Zoom",
        overallRating: 4.3,
        feedbackSubmittedCount: 1,
        hasNotes: true,
        hasRecording: true,
      },
    ],
    timeline: [
      { id: "t7", label: "Applied", detail: "Agency — Vertex Talent", at: "May 6, 11:00" },
      { id: "t8", label: "Offer Sent", detail: "Band B · London remote", at: "May 13, 17:00" },
    ],
  }),
  /** Applicants pool · owned by Marcus — Alex engaged; test transfer when shortlisting from Applicants */
  baseCandidate({
    id: "c-transfer-demo",
    jobId: "staff-product-designer",
    name: "Samira Okonkwo · transfer demo",
    email: "samira.okonkwo@example.com",
    phone: "+49 171 555 0198",
    location: "Berlin, DE",
    source: "Referral",
    appliedAt: "2026-05-09",
    stage: "Screening",
    currentStage: "Screening",
    currentSubstage: "Applied",
    kanbanColumn: "applied",
    recruiterOwner: "Marcus Chen",
    ownerId: "rec-marcus",
    ownerName: "Marcus Chen",
    engagedBy: [
      {
        recruiterId: "rec-marcus",
        recruiterName: "Marcus Chen",
        firstEngagedAt: "2026-05-09",
        lastEngagedAt: "2026-05-14T09:00:00.000Z",
        engagementType: "emailed",
      },
      {
        recruiterId: "rec-alex",
        recruiterName: "Alex Rivera",
        firstEngagedAt: "2026-05-12",
        lastEngagedAt: "2026-05-14T11:30:00.000Z",
        engagementType: "viewed",
      },
    ],
    experience: "8 years · Product design · Design systems",
    skills: ["Figma", "Research", "Prototyping", "Workshop facilitation"],
    education: "B.A. Industrial Design — UDK Berlin",
    noticePeriod: "1 month",
    expectedSalary: "€98,000",
    resumeStatus: "Reviewed",
    resumeUploadedAt: "2026-05-09",
    lastActivity: "1d ago",
    recruiterNotes:
      "Transfer demo (Applicants pool): View as Admin, drag to Shortlisted or use actions → collision. Marcus owns; Alex engaged. Approve transfer as Super Admin.",
    hiringManagerNotes: "",
    interviewerNotes: "",
    emails: [
      {
        id: "e-transfer-demo",
        subject: "Ze[code] — Portfolio follow-up",
        sender: "Marcus Chen",
        timestamp: "May 12, 10:00",
        type: "Follow-up",
        preview: "Thanks for your application — we'd like to see two case studies…",
      },
    ],
    interviews: [],
    timeline: [
      { id: "td-t1", label: "Applied", detail: "Employee referral", at: "May 9, 09:00" },
      { id: "td-t2", label: "Contacted", detail: "Marcus emailed portfolio request", at: "May 11, 15:20" },
    ],
  }),
  ...buildStaffDesignerApplicants(baseCandidate),
];

export interface HiringOverviewInsights {
  activeJobs: string;
  candidates: string;
  interviews: string;
  offers: string;
}

export interface HiringOverviewStats {
  activeJobs: number;
  candidatesInPipeline: number;
  interviewsToday: number;
  offersPending: number;
  candidatesThisWeek: number;
  insights: HiringOverviewInsights;
}

const ACTIVE_JOB_STATUSES = new Set<HiringJob["status"]>(["Published", "Internal", "External"]);

export function getHiringOverviewStats(jobs: HiringJob[]): HiringOverviewStats {
  const active = jobs.filter((j) => ACTIVE_JOB_STATUSES.has(j.status));
  const activeJobs = active.length;
  const candidatesInPipeline = active.reduce((sum, j) => sum + j.candidateCount, 0);
  const interviewsToday = active.reduce((sum, j) => sum + j.interviewsToday, 0);
  const offersPending = HIRING_CANDIDATES.filter(
    (c) =>
      jobs.some((j) => j.id === c.jobId) &&
      c.kanbanColumn !== "hired" &&
      (c.kanbanColumn === "offer-sent" ||
        c.kanbanColumn === "offer-draft" ||
        c.kanbanColumn === "offer-accepted" ||
        c.currentStage === "Hire & Offers"),
  ).length;
  const candidatesThisWeek = active.reduce((sum, j) => sum + j.candidatesThisWeek, 0);
  const jobsWithWeeklyActivity = active.filter((j) => j.candidatesThisWeek > 0).length;
  const interviewingInProgress = active.reduce((sum, j) => sum + j.interviewingCount, 0);
  const offersAwaitingApproval = HIRING_CANDIDATES.filter(
    (c) =>
      jobs.some((j) => j.id === c.jobId) &&
      c.kanbanColumn !== "hired" &&
      c.kanbanColumn === "offer-draft",
  ).length;
  const newApplicationsToday = active.reduce(
    (sum, j) => sum + Math.min(j.candidatesThisWeek, Math.max(1, Math.round(j.candidatesThisWeek / 7))),
    0,
  );

  const insights: HiringOverviewInsights = {
    activeJobs:
      jobsWithWeeklyActivity > 0 ? `+${jobsWithWeeklyActivity} with activity this week` : "All workflows steady",
    candidates:
      newApplicationsToday > 0
        ? `${newApplicationsToday} new applications today`
        : candidatesThisWeek > 0
          ? `+${candidatesThisWeek} this week`
          : "Pipeline stable",
    interviews:
      interviewsToday > 0
        ? `${interviewsToday} scheduled today · ${interviewingInProgress} in progress`
        : interviewingInProgress > 0
          ? `${interviewingInProgress} currently in progress`
          : "No interviews today",
    offers:
      offersPending > 0
        ? offersAwaitingApproval > 0
          ? `${offersAwaitingApproval} awaiting approval`
          : `${offersPending} pending response`
        : "No offers pending",
  };

  return {
    activeJobs,
    candidatesInPipeline,
    interviewsToday,
    offersPending,
    candidatesThisWeek,
    insights,
  };
}

export function getJobById(id: string): HiringJob | undefined {
  return getAllJobs().find((j) => j.id === id);
}

export function getAllJobs(): HiringJob[] {
  return mergePersistedJobs(HIRING_JOBS);
}

export function getCandidatesForJob(jobId: string): HiringCandidate[] {
  return HIRING_CANDIDATES.filter((c) => c.jobId === jobId).map(enrichCandidate);
}

export function getActiveJobsForMove(excludeJobId: string): HiringJob[] {
  return HIRING_JOBS.filter((j) => j.id !== excludeJobId && ACTIVE_JOB_STATUSES.has(j.status));
}

function syncJobCandidateCount(jobId: string) {
  const job = HIRING_JOBS.find((j) => j.id === jobId);
  if (job) job.candidateCount = getCandidatesForJob(jobId).length;
}

export type MoveApplicantResult =
  | { ok: true; candidate: HiringCandidate; fromJobTitle: string; toJobTitle: string }
  | { ok: false; error: string };

function formatTimelineAt(): string {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function prependCandidateTimeline(candidateId: string, label: string, detail: string): void {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return;
  candidate.timeline = [
    {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label,
      detail,
      at: formatTimelineAt(),
    },
    ...candidate.timeline,
  ];
}

/** Move applicant to another job — updates in-memory mock store */
export function moveApplicantToJob(
  candidateId: string,
  toJobId: string,
  options?: { detailOverride?: string },
): MoveApplicantResult {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return { ok: false, error: "Applicant not found" };

  const fromJobId = candidate.jobId;
  if (fromJobId === toJobId) return { ok: false, error: "Applicant is already on this job" };

  const fromJob = getJobById(fromJobId);
  const toJob = getJobById(toJobId);
  if (!toJob) return { ok: false, error: "Target job not found" };

  candidate.jobId = toJobId;
  syncCandidateStageFields(candidate, "Applied", "New Application");

  const fromTitle = fromJob?.title ?? "Previous job";
  const toTitle = toJob.title;
  candidate.timeline = [
    {
      id: `t-move-${Date.now()}`,
      label: "Applicant moved",
      detail:
        options?.detailOverride ??
        `Applicant moved from ${fromTitle} to ${toTitle}`,
      at: formatTimelineAt(),
    },
    ...candidate.timeline,
  ];

  syncJobCandidateCount(fromJobId);
  syncJobCandidateCount(toJobId);

  return { ok: true, candidate: { ...candidate }, fromJobTitle: fromTitle, toJobTitle: toTitle };
}

export function getCandidateById(id: string): HiringCandidate | undefined {
  const found = HIRING_CANDIDATES.find((c) => c.id === id);
  return found ? enrichCandidate(found) : undefined;
}

export type MoveStageResult =
  | { ok: true; candidate: HiringCandidate; fromStage: HiringStageName; toStage: HiringStageName }
  | { ok: false; error: string };

/** Move candidate to a pipeline stage — updates tab placement and timeline */
export function moveCandidateToStage(
  candidateId: string,
  toStage: HiringStageName,
  options?: { substage?: string },
): MoveStageResult {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return { ok: false, error: "Candidate not found" };

  const fromStage = getCandidateStage(enrichCandidate(candidate));
  if (fromStage === toStage && !options?.substage) {
    return { ok: false, error: "Candidate is already in this stage" };
  }

  const substage = options?.substage;
  syncCandidateStageFields(candidate, toStage, substage);

  candidate.timeline = [
    {
      id: `t-stage-${Date.now()}`,
      label: "Stage updated",
      detail: buildStageTimelineDetail(fromStage, toStage, candidate.currentSubstage),
      at: "May 15, 16:00",
    },
    ...candidate.timeline,
  ];

  return {
    ok: true,
    candidate: enrichCandidate(candidate),
    fromStage,
    toStage,
  };
}

/** Advance a shortlisted screening candidate into a specific interview round */
export function moveCandidateToInterview(
  candidateId: string,
  jobId: string,
  round: { id: string; title: string },
): MoveStageResult {
  if (isHrInterviewRound(round)) {
    return {
      ok: false,
      error: "HR round cannot be assigned from Applicant Stats. Use technical rounds first.",
    };
  }

  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return { ok: false, error: "Candidate not found" };

  const enriched = enrichCandidate(candidate);
  const fromStage = getCandidateStage(enriched);
  const fromSubstage =
    enriched.currentSubstage === "Shortlisted" ? "Shortlisted" : enriched.currentSubstage || "Shortlisted";

  candidate.stage = "Interviews";
  candidate.currentStage = "Interviews";
  candidate.currentSubstage = round.title;
  candidate.kanbanColumn = round.id;

  candidate.timeline = [
    {
      id: `t-to-interview-${Date.now()}`,
      label: "Moved to interview",
      detail: `Candidate moved from Screening / ${fromSubstage} to Interviews / ${round.title}`,
      at: formatTimelineAt(),
    },
    ...candidate.timeline,
  ];

  return {
    ok: true,
    candidate: enrichCandidate(candidate),
    fromStage,
    toStage: "Interviews",
  };
}

export type ScheduleInterviewResult =
  | { ok: true; candidate: HiringCandidate; interview: CandidateInterview }
  | { ok: false; error: string };

/** Book an interview — updates pipeline, timeline, and in-memory interview record */
export function scheduleCandidateInterview(
  candidateId: string,
  payload: ScheduleInterviewPayload,
): ScheduleInterviewResult {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return { ok: false, error: "Candidate not found" };

  const interviewData = formToCandidateInterview(payload, payload.roundTitle, candidateId);
  const interview: CandidateInterview = {
    id: `i-${Date.now()}`,
    ...interviewData,
  };

  const existingIdx = candidate.interviews.findIndex(
    (i) => i.round.toLowerCase() === payload.roundTitle.toLowerCase(),
  );
  if (existingIdx >= 0) {
    candidate.interviews[existingIdx] = interview;
  } else {
    candidate.interviews = [interview, ...candidate.interviews];
  }

  syncCandidateStageFields(candidate, "Interviews", payload.roundTitle);

  const interviewerNames = interview.interviewers.join(", ") || "Panel TBD";
  const detail = `${payload.roundTitle} · ${interview.scheduledAt} · ${interviewerNames}`;

  candidate.timeline = [
    {
      id: `t-int-${Date.now()}`,
      label: "Interview scheduled",
      detail,
      at: "Just now",
    },
    ...candidate.timeline,
  ];

  const job = HIRING_JOBS.find((j) => j.id === candidate.jobId);
  if (job) {
    job.interviewsToday = (job.interviewsToday ?? 0) + 1;
    job.interviewingCount = Math.max(
      job.interviewingCount ?? 0,
      HIRING_CANDIDATES.filter(
        (c) => c.jobId === job.id && getCandidateStage(enrichCandidate(c)) === "Interviews",
      ).length,
    );
  }

  return { ok: true, candidate: enrichCandidate(candidate), interview };
}

export type CancelInterviewResult =
  | { ok: true; candidate: HiringCandidate }
  | { ok: false; error: string };

/** Cancel a scheduled interview for a specific round */
export function cancelCandidateInterview(
  candidateId: string,
  roundTitle: string,
): CancelInterviewResult {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return { ok: false, error: "Candidate not found" };

  const idx = candidate.interviews.findIndex(
    (i) => i.round.toLowerCase() === roundTitle.toLowerCase() && i.status === "Scheduled",
  );
  if (idx < 0) {
    return { ok: false, error: "No interview found for this round" };
  }

  const previous = candidate.interviews[idx];
  if (previous.status === "Cancelled") {
    return { ok: false, error: "Interview is already cancelled" };
  }

  candidate.interviews[idx] = {
    ...previous,
    status: "Cancelled",
  };

  candidate.timeline = [
    {
      id: `t-cancel-${Date.now()}`,
      label: "Interview cancelled",
      detail: `${roundTitle} · ${previous.scheduledAt}`,
      at: "Just now",
    },
    ...candidate.timeline,
  ];

  return { ok: true, candidate: enrichCandidate(candidate) };
}

export type RejectAtRoundResult =
  | { ok: true; candidate: HiringCandidate }
  | { ok: false; error: string };

/** Reject at the current interview round — candidate stays in Interviews pipeline for traceability */
export function rejectCandidateAtRound(
  candidateId: string,
  roundTitle: string,
): RejectAtRoundResult {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return { ok: false, error: "Candidate not found" };

  const idx = candidate.interviews.findIndex(
    (i) => i.round.toLowerCase() === roundTitle.toLowerCase(),
  );

  if (idx >= 0) {
    candidate.interviews[idx] = {
      ...candidate.interviews[idx],
      status: "Completed",
      feedbackStatus: "Submitted",
      roundOutcome: "Rejected",
    };
  } else {
    candidate.interviews.push({
      id: `i-reject-${Date.now()}`,
      round: roundTitle,
      interviewers: [candidate.recruiterOwner],
      scheduledAt: "—",
      status: "Completed",
      feedbackStatus: "Submitted",
      roundOutcome: "Rejected",
    });
  }

  if (candidate.currentStage !== "Interviews") {
    syncCandidateStageFields(candidate, "Interviews", roundTitle);
  }

  candidate.timeline = [
    {
      id: `t-reject-${Date.now()}`,
      label: "Rejected at interview round",
      detail: `${roundTitle} · ${candidate.name}`,
      at: "Just now",
    },
    ...candidate.timeline,
  ];

  return { ok: true, candidate: enrichCandidate(candidate) };
}

/** Register a new candidate with default stage based on how they were added */
export function registerCandidate(
  partial: Omit<
    HiringCandidate,
    "emails" | "interviews" | "timeline" | "recruiterNotes" | "hiringManagerNotes" | "interviewerNotes"
  > & {
    addedBy?: AddedBy;
    source?: string;
    emails?: HiringCandidate["emails"];
    interviews?: HiringCandidate["interviews"];
    timeline?: HiringCandidate["timeline"];
    recruiterNotes?: string;
    hiringManagerNotes?: string;
    interviewerNotes?: string;
  },
): HiringCandidate {
  const addedBy = partial.addedBy ?? "external";
  const source = normalizeSource((partial.source as string) ?? "Other");
  const stage = getDefaultStageForAddedBy(addedBy);
  const substage = getDefaultSubstageForAddedBy(addedBy);

  const candidate = baseCandidate({
    ...partial,
    source,
    sourceCategory: inferSourceCategory(source),
    addedBy,
    stage,
    currentStage: stage,
    currentSubstage: substage,
    kanbanColumn: undefined,
  });

  syncCandidateStageFields(candidate, stage, substage);
  HIRING_CANDIDATES.push(candidate);
  syncJobCandidateCount(candidate.jobId);
  return enrichCandidate(candidate);
}

export type UpdateVerdictResult =
  | { ok: true; candidate: HiringCandidate }
  | { ok: false; error: string };

export function updateCandidateVerdict(
  candidateId: string,
  verdict: CandidateVerdict,
  reason?: string,
): UpdateVerdictResult {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return { ok: false, error: "Candidate not found" };

  candidate.verdict = verdict;
  if (reason?.trim()) {
    candidate.verdictReason = reason.trim();
  } else if (verdict === "pending" || verdict === "neutral") {
    candidate.verdictReason = undefined;
  }

  const verdictLabel =
    verdict === "hire"
      ? "Hire"
      : verdict === "no_hire"
        ? "No Hire"
        : verdict === "neutral"
          ? "Neutral"
          : "Pending";

  candidate.timeline = [
    {
      id: `t-verdict-${Date.now()}`,
      label: "Verdict updated",
      detail: reason?.trim()
        ? `Marked as ${verdictLabel}: ${reason.trim()}`
        : `Marked as ${verdictLabel}`,
      at: formatTimelineAt(),
    },
    ...candidate.timeline,
  ];

  return { ok: true, candidate: enrichCandidate(candidate) };
}

export const DEPARTMENTS = [
  "Product Design",
  "Engineering",
  "People Operations",
  "Analytics",
  "Customer Success",
  "University Programs",
];

export const LOCATIONS = ["Berlin, DE", "London, UK", "Singapore", "Austin, TX", "New York, NY", "Toronto, CA"];

export const HIRING_MANAGERS = Array.from(
  new Set(HIRING_JOBS.map((j) => j.hiringManager).filter(Boolean)),
).sort();
