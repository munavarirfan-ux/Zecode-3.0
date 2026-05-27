import type { CandidateInterview, HiringCandidate } from "./types";

const STAFF_DESIGNER_JOB_ID = "staff-product-designer";
const STAFF_DESIGNER_TARGET_COUNT = 100;

const SOURCES = ["Careers", "LinkedIn", "Referral", "Agency", "Campus", "Direct"] as const;
const RESUME_STATUSES = ["Parsed", "Reviewed", "Flagged"] as const;

type ApplicantBucket = {
  stage: HiringCandidate["currentStage"];
  substage: string;
  kanbanColumn: string;
  withInterview?: boolean;
  withAssessment?: boolean;
  interviewOutcome?: CandidateInterview["roundOutcome"];
};

const BULK_BUCKETS: ApplicantBucket[] = [
  { stage: "Applicants", substage: "New Application", kanbanColumn: "new-application" },
  { stage: "Applicants", substage: "Resume Review", kanbanColumn: "resume-review" },
  { stage: "Screening", substage: "Recruiter Screening", kanbanColumn: "recruiter-screening", withAssessment: true },
  { stage: "Screening", substage: "Hiring Manager Review", kanbanColumn: "hm-review" },
  { stage: "Screening", substage: "Shortlisted", kanbanColumn: "shortlisted" },
  { stage: "Interviews", substage: "Portfolio Review", kanbanColumn: "portfolio", withInterview: true },
  { stage: "Interviews", substage: "Design Review", kanbanColumn: "design-review", withInterview: true },
  { stage: "Interviews", substage: "Technical Round 1", kanbanColumn: "tech-1", withInterview: true },
  { stage: "Hire & Offers", substage: "Offer Draft", kanbanColumn: "offer-draft", withInterview: true },
  { stage: "Hire & Offers", substage: "Offer Sent", kanbanColumn: "offer-sent", withInterview: true },
  { stage: "Hire & Offers", substage: "Offer Accepted", kanbanColumn: "offer-accepted", withInterview: true },
  { stage: "Hire & Offers", substage: "Hired", kanbanColumn: "hired", withInterview: true },
];

const REJECTED_AT_ROUND_BUCKET: ApplicantBucket = {
  stage: "Interviews",
  substage: "Technical Round 2",
  kanbanColumn: "tech-2",
  withInterview: true,
  interviewOutcome: "Rejected",
};

function canonicalRoundTitleForColumn(columnId: string, fallback: string): string {
  if (columnId === "tech-1" || columnId === "portfolio" || columnId === "assignment") return "Technical Round 1";
  if (columnId === "tech-2" || columnId === "design-review" || columnId === "system-design") return "Technical Round 2";
  if (columnId === "hr-round" || columnId === "culture") return "HR Round";
  // If a candidate moved beyond interviews, keep their interview tied to the last canonical round.
  if (columnId === "offer-sent" || columnId === "offer-draft" || columnId === "offer-accepted") return "HR Round";
  if (columnId === "rejected") return "Technical Round 2";
  return fallback;
}

type CandidateSeed = Omit<
  HiringCandidate,
  "emails" | "interviews" | "timeline" | "recruiterNotes" | "hiringManagerNotes" | "interviewerNotes"
> &
  Partial<
    Pick<
      HiringCandidate,
      "emails" | "interviews" | "timeline" | "recruiterNotes" | "hiringManagerNotes" | "interviewerNotes"
    >
  >;

/** Additional applicants for Staff Product Designer — merged in mockData */
export function buildStaffDesignerApplicants(
  base: (c: CandidateSeed) => HiringCandidate,
): HiringCandidate[] {
  const rows: CandidateSeed[] = [
    {
      id: "c-lena-vogt",
      jobId: "staff-product-designer",
      name: "Lena Vogt",
      email: "lena.vogt@gmail.com",
      phone: "+49 176 220 1188",
      location: "Munich, DE",
      source: "LinkedIn",
      appliedAt: "2026-05-14",
      currentStage: "Applicants",
      currentSubstage: "Resume Review",
      recruiterOwner: "Marcus Chen",
      experience: "6 years · B2B SaaS · Mobile",
      skills: ["Figma", "Prototyping", "User research", "iOS patterns"],
      education: "B.A. Design — HfG Schwäbisch Gmünd",
      noticePeriod: "2 weeks",
      expectedSalary: "€92,000",
      resumeStatus: "Parsed",
      resumeUploadedAt: "2026-05-14",
      kanbanColumn: "resume-review",
      lastActivity: "3h ago",
      unreadEmails: 1,
      verdict: "pending",
      emails: [
        {
          id: "lv-e1",
          subject: "Application received — Staff Product Designer",
          sender: "Ze[code] Careers",
          recipient: "lena.vogt@gmail.com",
          timestamp: "May 14, 08:12",
          type: "Follow-up",
          preview: "Thank you for applying. Our team will review your profile within 5 business days.",
        },
      ],
      timeline: [{ id: "lv-t1", label: "Applied", detail: "LinkedIn Easy Apply", at: "May 14, 08:10" }],
    },
    {
      id: "c-james-okafor",
      jobId: "staff-product-designer",
      name: "James Okafor",
      email: "j.okafor@workmail.co",
      phone: "+44 7911 442 901",
      location: "London, UK",
      source: "Referral",
      appliedAt: "2026-05-13",
      currentStage: "Screening",
      currentSubstage: "Recruiter Screening",
      recruiterOwner: "Marcus Chen",
      experience: "8 years · FinTech · Design leadership",
      skills: ["Design systems", "Workshops", "Stakeholder management", "Figma"],
      education: "M.Des — Royal College of Art",
      linkedin: "linkedin.com/in/jamesokafor",
      noticePeriod: "1 month",
      expectedSalary: "£98,000",
      resumeStatus: "Reviewed",
      resumeUploadedAt: "2026-05-13",
      kanbanColumn: "recruiter-screening",
      lastActivity: "Yesterday",
      recruiterNotes: "Referral from Elena Hoffmann. Strong enterprise portfolio.",
      emails: [
        {
          id: "jo-e1",
          subject: "Recruiter screening — Ze[code]",
          sender: "Marcus Chen",
          recipient: "j.okafor@workmail.co",
          timestamp: "May 13, 14:30",
          type: "Interview Invite",
          preview: "I'd like to schedule a 30-minute recruiter screen for Thursday…",
        },
      ],
      interviews: [
        {
          id: "jo-i1",
          round: "Recruiter Screening",
          interviewers: ["Marcus Chen"],
          scheduledAt: "May 16, 10:00 GMT",
          status: "Scheduled",
          feedbackStatus: "Pending",
        },
        {
          id: "jo-i2",
          round: "Recruiter Screening",
          interviewers: ["Ava Patel"],
          scheduledAt: "Tue · 11:30 CET",
          status: "Completed",
          feedbackStatus: "Pending",
          feedbackRequestedAt: "3 days",
          interviewType: "Video",
          durationMinutes: 30,
          platform: "ZeMeet",
          hasNotes: true,
        },
      ],
      timeline: [
        { id: "jo-t1", label: "Applied", detail: "Employee referral", at: "May 13, 09:20" },
        { id: "jo-t2", label: "Screening scheduled", detail: "Recruiter screen", at: "May 13, 14:30" },
      ],
    },
    {
      id: "c-mia-santos",
      jobId: "staff-product-designer",
      name: "Mia Santos",
      email: "mia.santos@outlook.com",
      phone: "+351 912 880 441",
      location: "Lisbon, PT",
      source: "Careers",
      appliedAt: "2026-05-12",
      currentStage: "Screening",
      currentSubstage: "Hiring Manager Review",
      recruiterOwner: "Marcus Chen",
      experience: "7 years · HR tech · Workflow design",
      skills: ["Enterprise UX", "Information architecture", "Accessibility", "Figma"],
      education: "B.Sc. HCI — Universidade de Lisboa",
      portfolioUrl: "https://miasantos.work",
      noticePeriod: "1 month",
      expectedSalary: "€88,000",
      resumeStatus: "Reviewed",
      resumeUploadedAt: "2026-05-12",
      kanbanColumn: "hm-review",
      lastActivity: "2d ago",
      hiringManagerNotes: "Review portfolio before panel — strong ops flows.",
      emails: [
        {
          id: "ms-e1",
          subject: "HM review packet shared",
          sender: "Marcus Chen",
          recipient: "Elena Hoffmann",
          timestamp: "May 12, 16:00",
          type: "Recruiter",
          preview: "Forwarding Mia Santos profile for HM review ahead of Friday sync.",
        },
      ],
      timeline: [{ id: "ms-t1", label: "Applied", detail: "Careers website", at: "May 12, 11:45" }],
    },
    {
      id: "c-tom-berg",
      jobId: "staff-product-designer",
      name: "Tom Berg",
      email: "tom.berg@icloud.com",
      phone: "+46 70 441 2290",
      location: "Stockholm, SE",
      source: "Agency",
      appliedAt: "2026-05-11",
      currentStage: "Applicants",
      currentSubstage: "New Application",
      recruiterOwner: "Marcus Chen",
      experience: "5 years · Consumer apps",
      skills: ["Visual design", "Motion", "Figma", "Design tokens"],
      education: "B.F.A. — Konstfack",
      noticePeriod: "2 weeks",
      expectedSalary: "€85,000",
      resumeStatus: "Flagged",
      resumeUploadedAt: "2026-05-11",
      kanbanColumn: "new-application",
      lastActivity: "3d ago",
      recruiterNotes: "Agency submission — verify portfolio authenticity.",
      emails: [],
      timeline: [{ id: "tb-t1", label: "Applied", detail: "Agency — Nordic Design Talent", at: "May 11, 07:30" }],
    },
    {
      id: "c-yuki-tanaka",
      jobId: "staff-product-designer",
      name: "Yuki Tanaka",
      email: "yuki.tanaka@proton.me",
      phone: "+81 90 8821 4401",
      location: "Tokyo, JP",
      source: "Direct",
      appliedAt: "2026-05-10",
      currentStage: "Interviews",
      currentSubstage: "Portfolio Review",
      recruiterOwner: "Marcus Chen",
      experience: "10 years · Global SaaS",
      skills: ["Design systems", "Localization", "Research ops", "Figma"],
      education: "M.A. Design — Keio University",
      portfolioUrl: "https://yukitanaka.design",
      noticePeriod: "1 month",
      expectedSalary: "€102,000",
      resumeStatus: "Reviewed",
      resumeUploadedAt: "2026-05-10",
      kanbanColumn: "portfolio",
      lastActivity: "4h ago",
      emails: [
        {
          id: "yt-e1",
          subject: "Portfolio review invitation",
          sender: "Marcus Chen",
          recipient: "yuki.tanaka@proton.me",
          timestamp: "May 14, 09:00",
          type: "Interview Invite",
          preview: "Your portfolio review is scheduled for May 17 at 10:00 JST…",
        },
        {
          id: "yt-e2",
          subject: "Design exercise — take-home brief",
          sender: "Marcus Chen",
          recipient: "yuki.tanaka@proton.me",
          timestamp: "May 12, 11:20",
          type: "Assessment",
          preview: "Please find attached the structured design exercise for Staff Product Designer…",
        },
      ],
      interviews: [
        {
          id: "yt-i1",
          round: "Portfolio Review",
          interviewers: ["Elena Hoffmann"],
          scheduledAt: "May 17, 10:00 JST",
          status: "Scheduled",
          feedbackStatus: "Pending",
        },
      ],
      timeline: [
        { id: "yt-t1", label: "Applied", detail: "Direct upload by recruiter", at: "May 10, 15:00" },
        { id: "yt-t2", label: "Assessment sent", detail: "Take-home exercise", at: "May 12, 11:20" },
      ],
    },
    {
      id: "c-emma-larsen",
      jobId: "staff-product-designer",
      name: "Emma Larsen",
      email: "emma.larsen@gmail.com",
      phone: "+45 28 44 11 02",
      location: "Copenhagen, DK",
      source: "Campus",
      appliedAt: "2026-05-09",
      currentStage: "Applicants",
      currentSubstage: "Resume Review",
      recruiterOwner: "Marcus Chen",
      experience: "4 years · Graduate + internship",
      skills: ["Figma", "User interviews", "Service design", "Prototyping"],
      education: "M.Sc. IT Product Design — Aalborg University",
      noticePeriod: "Immediate",
      expectedSalary: "€78,000",
      resumeStatus: "Parsed",
      resumeUploadedAt: "2026-05-09",
      kanbanColumn: "resume-review",
      lastActivity: "4d ago",
      emails: [
        {
          id: "el-e1",
          subject: "Campus recruiting — next steps",
          sender: "Marcus Chen",
          recipient: "emma.larsen@gmail.com",
          timestamp: "May 10, 10:00",
          type: "Follow-up",
          preview: "Thanks for attending our Copenhagen campus session…",
        },
      ],
      interviews: [
        {
          id: "el-i1",
          round: "Design Review",
          interviewers: ["Ava Patel", "Elena Hoffmann"],
          scheduledAt: "Fri · 09:00 CET",
          status: "Completed",
          feedbackStatus: "Pending",
          feedbackRequestedAt: "12 hours",
          interviewType: "Panel",
          durationMinutes: 60,
          platform: "ZeMeet",
          hasNotes: true,
        },
      ],
      timeline: [{ id: "el-t1", label: "Applied", detail: "Campus event — Copenhagen", at: "May 9, 16:40" }],
    },
    {
      id: "c-david-kim",
      jobId: "staff-product-designer",
      name: "David Kim",
      email: "david.kim@naver.com",
      phone: "+82 10 8822 1190",
      location: "Seoul, KR",
      source: "LinkedIn",
      appliedAt: "2026-05-08",
      currentStage: "Screening",
      currentSubstage: "Shortlisted",
      recruiterOwner: "Marcus Chen",
      experience: "9 years · Marketplace · Growth design",
      skills: ["Experimentation", "Analytics", "Figma", "Design systems"],
      education: "B.A. Visual Communication — Seoul National University",
      linkedin: "linkedin.com/in/davidkimux",
      noticePeriod: "1 month",
      expectedSalary: "€95,000",
      resumeStatus: "Reviewed",
      resumeUploadedAt: "2026-05-08",
      kanbanColumn: "shortlisted",
      lastActivity: "5d ago",
      verdict: "hire",
      recruiterNotes: "Shortlisted for design review batch next week.",
      timeline: [
        { id: "dk-t1", label: "Applied", detail: "LinkedIn", at: "May 8, 12:00" },
        { id: "dk-t2", label: "Shortlisted", detail: "Passed recruiter screen", at: "May 11, 09:00" },
      ],
    },
    {
      id: "c-nora-hassan",
      jobId: "staff-product-designer",
      name: "Nora Hassan",
      email: "nora.hassan@workmail.com",
      phone: "+971 50 441 2299",
      location: "Dubai, AE",
      source: "Agency",
      appliedAt: "2026-05-07",
      currentStage: "Applicants",
      currentSubstage: "Resume Review",
      recruiterOwner: "Marcus Chen",
      experience: "7 years · Enterprise · Arabic localization",
      skills: ["RTL design", "Design systems", "Figma", "Workshops"],
      education: "B.Des — American University of Sharjah",
      noticePeriod: "2 weeks",
      expectedSalary: "€90,000",
      resumeStatus: "Reviewed",
      resumeUploadedAt: "2026-05-07",
      kanbanColumn: "resume-review",
      lastActivity: "6d ago",
      emails: [],
      timeline: [{ id: "nh-t1", label: "Applied", detail: "Agency — Gulf Talent Partners", at: "May 7, 13:15" }],
    },
    {
      id: "c-oliver-grant",
      jobId: "staff-product-designer",
      name: "Oliver Grant",
      email: "oliver.grant@protonmail.com",
      phone: "+1 646 555 0188",
      location: "New York, US",
      source: "Careers",
      appliedAt: "2026-05-06",
      currentStage: "Interviews",
      currentSubstage: "Design Review",
      recruiterOwner: "Marcus Chen",
      experience: "11 years · Staff designer · Data-heavy UX",
      skills: ["Data visualization", "Design ops", "Figma", "Table stakes IA"],
      education: "B.F.A. — RISD",
      portfolioUrl: "https://olivergrant.co",
      noticePeriod: "2 weeks",
      expectedSalary: "€112,000",
      resumeStatus: "Reviewed",
      resumeUploadedAt: "2026-05-06",
      kanbanColumn: "design-review",
      lastActivity: "1d ago",
      hiringManagerNotes: "Schedule panel with engineering partner.",
      interviewerNotes: "Portfolio strong on density and recruiter workflows.",
      emails: [
        {
          id: "og-e1",
          subject: "Design review panel — calendar hold",
          sender: "Marcus Chen",
          recipient: "oliver.grant@protonmail.com",
          timestamp: "May 13, 08:45",
          type: "Interview Invite",
          preview: "Please hold May 18 for a 90-minute design review with the hiring panel…",
        },
      ],
      interviews: [
        {
          id: "og-i1",
          round: "Design Review",
          interviewers: ["Elena Hoffmann", "Raj Mehta"],
          scheduledAt: "May 18, 17:00 EST",
          status: "Scheduled",
          feedbackStatus: "Pending",
        },
        {
          id: "og-i2",
          round: "Portfolio review",
          interviewers: ["Ava Patel"],
          scheduledAt: "Mon · 16:00 CET",
          status: "Completed",
          feedbackStatus: "Pending",
          feedbackRequestedAt: "1 day",
          interviewType: "Panel",
          durationMinutes: 45,
          platform: "ZeMeet",
          result: "Lean Hire",
          hasNotes: true,
        },
      ],
      timeline: [
        { id: "og-t1", label: "Applied", detail: "Careers website", at: "May 6, 20:10" },
        { id: "og-t2", label: "Design review scheduled", detail: "Panel interview", at: "May 13, 08:45" },
      ],
    },
    {
      id: "c-sophie-martin",
      jobId: "staff-product-designer",
      name: "Sophie Martin",
      email: "sophie.martin@gmail.com",
      phone: "+33 6 12 34 56 78",
      location: "Paris, FR",
      source: "Referral",
      appliedAt: "2026-05-05",
      currentStage: "Applicants",
      currentSubstage: "New Application",
      recruiterOwner: "Marcus Chen",
      experience: "5 years · B2B · Onboarding flows",
      skills: ["Onboarding UX", "Content design", "Figma", "French/English"],
      education: "M.A. Design — ENSAD",
      noticePeriod: "1 month",
      expectedSalary: "€86,000",
      resumeStatus: "Parsed",
      resumeUploadedAt: "2026-05-05",
      kanbanColumn: "new-application",
      lastActivity: "1w ago",
      timeline: [{ id: "sm-t1", label: "Applied", detail: "Referral — internal design team", at: "May 5, 10:00" }],
    },
    {
      id: "c-ryan-patel",
      jobId: "staff-product-designer",
      name: "Ryan Patel",
      email: "ryan.patel@outlook.com",
      phone: "+1 415 555 4421",
      location: "Austin, US",
      source: "Direct",
      appliedAt: "2026-05-04",
      currentStage: "Screening",
      currentSubstage: "Recruiter Screening",
      recruiterOwner: "Marcus Chen",
      experience: "8 years · ATS products",
      skills: ["Recruiting UX", "Compliance", "Figma", "Research"],
      education: "B.S. HCI — Carnegie Mellon",
      noticePeriod: "2 weeks",
      expectedSalary: "€99,000",
      resumeStatus: "Reviewed",
      resumeUploadedAt: "2026-05-04",
      kanbanColumn: "recruiter-screening",
      lastActivity: "1w ago",
      emails: [
        {
          id: "rp-e1",
          subject: "Re: Staff Product Designer — domain fit",
          sender: "Ryan Patel",
          recipient: "Marcus Chen",
          timestamp: "May 5, 18:20",
          type: "Follow-up",
          preview: "Following up on my application — happy to share additional case studies from ATS work…",
        },
      ],
      timeline: [{ id: "rp-t1", label: "Applied", detail: "Direct upload", at: "May 4, 14:30" }],
    },
    {
      id: "c-chloe-wright",
      jobId: "staff-product-designer",
      name: "Chloe Wright",
      email: "chloe.wright@icloud.com",
      phone: "+61 412 880 119",
      location: "Sydney, AU",
      source: "Careers",
      appliedAt: "2026-05-03",
      currentStage: "Interviews",
      currentSubstage: "Technical Round 2",
      recruiterOwner: "Marcus Chen",
      experience: "6 years · Consumer HR apps",
      skills: ["Mobile UX", "Illustration", "Figma", "Usability testing"],
      education: "B.Des — UTS",
      noticePeriod: "2 weeks",
      expectedSalary: "€82,000",
      resumeStatus: "Reviewed",
      resumeUploadedAt: "2026-05-03",
      kanbanColumn: "tech-2",
      lastActivity: "5d ago",
      interviews: [
        {
          id: "cw-i1",
          round: "Technical Round 2",
          interviewers: ["Elena Hoffmann"],
          scheduledAt: "May 8, 14:00 CET",
          status: "Completed",
          feedbackStatus: "Submitted",
          roundOutcome: "Rejected",
          interviewType: "Video",
          durationMinutes: 45,
          platform: "ZeMeet",
        },
      ],
      emails: [
        {
          id: "cw-e1",
          subject: "Update on your application — Ze[code]",
          sender: "Marcus Chen",
          recipient: "chloe.wright@icloud.com",
          timestamp: "May 10, 11:00",
          type: "Rejection",
          preview: "Thank you for your interest. After careful review we will not be moving forward…",
        },
      ],
      timeline: [
        { id: "cw-t1", label: "Applied", detail: "Careers website", at: "May 3, 22:00" },
        {
          id: "cw-t2",
          label: "Rejected at Technical Round 2",
          detail: "Did not meet senior systems bar",
          at: "May 10, 11:00",
        },
      ],
    },
  ];

  const manual = rows.map((r) => base(r));
  const bulk = generateBulkStaffDesignerApplicants(
    base,
    1 + manual.length,
    STAFF_DESIGNER_TARGET_COUNT,
  );
  return [...manual, ...bulk];
}

function generateBulkStaffDesignerApplicants(
  base: (c: CandidateSeed) => HiringCandidate,
  existingCount: number,
  targetTotal: number,
): HiringCandidate[] {
  const count = Math.max(0, targetTotal - existingCount);
  if (count === 0) return [];

  const out: HiringCandidate[] = [];
  const baseDate = new Date("2026-05-15");

  for (let i = 0; i < count; i++) {
    const bucket =
      i % 17 === 0 ? REJECTED_AT_ROUND_BUCKET : BULK_BUCKETS[i % BULK_BUCKETS.length];
    const source = SOURCES[i % SOURCES.length];
    const applied = new Date(baseDate);
    applied.setDate(applied.getDate() - (i % 90));
    const appliedAt = applied.toISOString().slice(0, 10);
    const first = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Sam", "Jamie"][
      i % 10
    ];
    const last = [
      "Nguyen",
      "Brooks",
      "Fischer",
      "Moreau",
      "Silva",
      "Kowalski",
      "Andersen",
      "Petrov",
      "Chen",
      "Williams",
    ][Math.floor(i / 10) % 10];
    const name = `${first} ${last}`;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const id = `c-bulk-spd-${i + 1}`;

    const canonicalRoundTitle = canonicalRoundTitleForColumn(bucket.kanbanColumn, bucket.substage);

    const isCancelled = i % 11 === 0;
    const isFeedbackPending = i % 7 === 0;
    const isCompleted = i % 5 === 0;

    const interviews: CandidateInterview[] = bucket.withInterview
      ? [
          {
            id: `${id}-i1`,
            round: canonicalRoundTitle,
            interviewers: i % 2 === 0 ? ["Elena Hoffmann", "Marcus Chen"] : ["Marcus Chen"],
            scheduledAt: `May ${10 + (i % 8)}, ${9 + (i % 6)}:00 CET`,
            status: bucket.interviewOutcome
              ? "Completed"
              : isCancelled
                ? "Cancelled"
                : isFeedbackPending || isCompleted
                  ? "Completed"
                  : "Scheduled",
            feedbackStatus:
              bucket.interviewOutcome || isCancelled || isCompleted || isFeedbackPending
                ? "Submitted"
                : "Pending",
            roundOutcome: bucket.interviewOutcome,
            feedbackRequestedAt: isFeedbackPending ? `${6 + (i % 4)}d ago` : undefined,
            interviewType: i % 3 === 0 ? "Panel" : "Video",
            durationMinutes: 45,
            platform: i % 2 === 0 ? "ZeMeet" : "Google Meet",
            feedbackPendingCount: isFeedbackPending ? 1 : 0,
            feedbackSubmittedCount: isFeedbackPending ? 0 : isCompleted ? 1 : 0,
          },
        ]
      : [];

    const emails = bucket.withAssessment
      ? [
          {
            id: `${id}-e1`,
            subject: "Design exercise — Staff Product Designer",
            sender: "Marcus Chen",
            recipient: `${slug}@example.com`,
            timestamp: `May ${8 + (i % 5)}, 10:00`,
            type: "Assessment" as const,
            preview: "Please complete the structured design exercise within 5 business days…",
          },
        ]
      : [];

    out.push(
      base({
        id,
        jobId: STAFF_DESIGNER_JOB_ID,
        name,
        email: `${slug}.${i + 1}@example.com`,
        phone: `+49 170 ${String(1000000 + i).slice(-7)}`,
        location: ["Berlin, DE", "Munich, DE", "Hamburg, DE", "Amsterdam, NL", "London, UK"][i % 5],
        source,
        appliedAt,
        currentStage: bucket.stage,
        currentSubstage: bucket.substage,
        recruiterOwner: "Marcus Chen",
        experience: `${4 + (i % 8)} years · Product design · B2B SaaS`,
        skills: ["Figma", "Design systems", "User research", "Prototyping"],
        education: "B.A. / M.A. Design",
        noticePeriod: i % 2 === 0 ? "2 weeks" : "1 month",
        expectedSalary: `€${78 + (i % 25)}k`,
        resumeStatus: RESUME_STATUSES[i % RESUME_STATUSES.length],
        resumeUploadedAt: appliedAt,
        kanbanColumn: bucket.kanbanColumn,
        lastActivity: i < 5 ? `${i + 1}h ago` : i < 15 ? "Yesterday" : `${Math.floor(i / 7)}d ago`,
        emails,
        interviews,
        timeline: [
          {
            id: `${id}-t1`,
            label: "Applied",
            detail: `Via ${source}`,
            at: appliedAt,
          },
        ],
        recruiterNotes: i % 7 === 0 ? "Strong portfolio — prioritize for panel." : "",
        hiringManagerNotes: bucket.stage === "Interviews" && i % 5 === 0 ? "Ready for design review." : "",
        interviewerNotes: "",
      }),
    );
  }

  return out;
}
