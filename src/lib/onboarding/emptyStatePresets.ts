import type { EmptyStateIllustrationId } from "@/components/onboarding/EmptyStateIllustrations";

export type EmptyStatePreset = {
  illustration: EmptyStateIllustrationId;
  headline: string;
  subtext: string;
  guideTitle?: string;
  guideBody?: string;
};

export const EMPTY_STATE_PRESETS = {
  jobs: {
    illustration: "jobs",
    headline: "No jobs created yet",
    subtext: "Create your first job to start tracking candidates, interviews, and hiring progress.",
    guideTitle: "How jobs work",
    guideBody: "Jobs help organize candidates, interviews, and assessments under one workflow.",
  },
  jobsFiltered: {
    illustration: "jobs",
    headline: "No jobs match",
    subtext: "Try another status tab or adjust filters to find what you're looking for.",
  },
  interviews: {
    illustration: "interviews",
    headline: "No interviews scheduled",
    subtext: "Schedule interviews to start evaluating candidates collaboratively.",
    guideTitle: "How interviews work",
    guideBody: "Interviews automatically sync with feedback and candidate reports.",
  },
  assessments: {
    illustration: "assessments",
    headline: "No assessments published",
    subtext: "Create assessments to evaluate coding, problem-solving, and technical skills at scale.",
    guideTitle: "How assessments work",
    guideBody: "Assessments support coding, MCQs, database, debugging, and more.",
  },
  candidates: {
    illustration: "candidates",
    headline: "No candidates yet",
    subtext: "Candidates added through jobs, assessments, or direct sourcing will appear here.",
    guideTitle: "Candidate directory",
    guideBody: "Every applicant flows into one searchable profile with interview and assessment history.",
  },
  questionPool: {
    illustration: "questionPool",
    headline: "Your question pool is empty",
    subtext: "Build reusable question libraries for assessments and interviews.",
    guideTitle: "Question pool",
    guideBody: "Curate once, reuse across assessments — with difficulty, tags, and usage analytics.",
  },
  feedback: {
    illustration: "feedback",
    headline: "No feedback submitted yet",
    subtext: "Interview evaluations and assessment reviews will appear here.",
    guideTitle: "Feedback loop",
    guideBody: "Structured scorecards keep hiring decisions consistent and auditable.",
  },
} as const satisfies Record<string, EmptyStatePreset>;

export const ERROR_STATE_PRESETS = {
  network: {
    illustration: "network" as const,
    headline: "Connection interrupted",
    subtext: "We're having trouble reaching the server. Try again in a moment.",
    recoveryLabel: "Retry",
  },
  permission: {
    illustration: "permission" as const,
    headline: "Access restricted",
    subtext: "You don't currently have permission to access this section.",
    recoveryLabel: "Contact admin",
  },
  notFound: {
    illustration: "notFound" as const,
    headline: "This page wandered off",
    subtext: "The page may have been moved or no longer exists.",
    recoveryLabel: "Back to dashboard",
  },
} as const;
