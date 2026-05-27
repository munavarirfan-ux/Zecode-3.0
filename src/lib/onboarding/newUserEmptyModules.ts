import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Calendar,
  CalendarPlus,
  Clock,
  DatabaseZap,
  GraduationCap,
  Mic2,
  Rocket,
  Users,
} from "lucide-react";
import type { LineArtIllustrationId } from "@/components/empty-states/line-art-illustrations";
import { APP_NAME, MODULE_HIRE } from "@/constants/app";
import { ROUTES } from "@/config/routes";

export type NewUserEmptyModuleId =
  | "jobs"
  | "assessments"
  | "interviews"
  | "candidates"
  | "questionPool"
  | "schedules"
  | "mySchedule";

export type NewUserEmptyModuleConfig = {
  illustration: LineArtIllustrationId;
  eyebrow: string;
  headline: string;
  subtext: string;
  guideTitle: string;
  guideBody: string;
  primaryCta: string;
  /** Optional second action (e.g. publish flow) */
  secondaryCta?: string;
  steps: { icon: LucideIcon; title: string; body: string }[];
  /** When set, primary button links instead of onClick */
  primaryHref?: string;
};

export const NEW_USER_EMPTY_MODULES: Record<NewUserEmptyModuleId, NewUserEmptyModuleConfig> = {
  jobs: {
    illustration: "jobs",
    eyebrow: "Your jobs workspace",
    headline: "Create a job and build your candidate pipeline from scratch.",
    subtext:
      "Define the role, publish when you're ready, then add candidates and schedule interviews from your pipeline.",
    guideTitle: `What is a job in ${MODULE_HIRE}?`,
    guideBody:
      "Each job is a hiring workflow: requisition details, pipeline stages, applicant tracking, interview rounds, assessments, and team collaboration — all in one place.",
    primaryCta: "Create your first job",
    steps: [
      { icon: Briefcase, title: "Create your first job", body: "Set title, department, and hiring details in a few guided steps." },
      { icon: Rocket, title: "Publish your job", body: "Go live as Published, Internal, or External so candidates can enter your pipeline." },
      { icon: Users, title: "Add candidates", body: "Applicants appear in your pipeline and candidate directory." },
      { icon: Mic2, title: "Schedule interviews", body: "Panels, feedback, and candidate reports stay in sync." },
    ],
  },
  assessments: {
    illustration: "assessments",
    eyebrow: "Assessments",
    headline: "No assessments published yet.",
    subtext:
      "Create assessments to evaluate coding, problem-solving, and technical skills — then invite candidates from jobs or directly.",
    guideTitle: "How assessments work",
    guideBody:
      "Build from the question pool, set duration and scoring, publish a link, and track invited → evaluated → qualified candidates.",
    primaryCta: "Create Assessment",
    steps: [
      { icon: GraduationCap, title: "Create an assessment", body: "Pick questions, set duration, and qualifying score." },
      { icon: DatabaseZap, title: "Use the question pool", body: "Reuse curated questions or add your own." },
      { icon: Briefcase, title: "Attach to a job", body: "Send assessments to applicants in a hiring workflow." },
      { icon: Users, title: "Review results", body: "Track completion and qualification from the assessment dashboard." },
    ],
  },
  interviews: {
    illustration: "interviews",
    eyebrow: "Interviews",
    headline: "No interview pipelines yet.",
    subtext:
      "Once you have a job with candidates in interview stages, this page becomes your hub for scheduling, panels, and feedback.",
    guideTitle: "How interviews work",
    guideBody:
      "Interviews sync with jobs and candidate reports — schedule panels, capture scorecards, and track feedback due.",
    primaryCta: "Go to Jobs",
    primaryHref: ROUTES.hiringJobs,
    steps: [
      { icon: Briefcase, title: "Start with a job", body: "Create a job and move candidates into interview stages." },
      { icon: Mic2, title: "Schedule panels", body: "Book interviews and assign interviewers." },
      { icon: Users, title: "Collaborate", body: "Everyone sees the same candidate context." },
      { icon: Calendar, title: "Close the loop", body: "Submit feedback that flows into hiring decisions." },
    ],
  },
  candidates: {
    illustration: "candidates",
    eyebrow: "Candidates",
    headline: "No candidates in your workspace yet.",
    subtext:
      "Candidates appear when you add them to a job, invite them to an assessment, or import from sourcing.",
    guideTitle: "Candidate directory",
    guideBody:
      "One searchable profile per person — applications, assessments, interviews, and feedback history together.",
    primaryCta: "Create a job & add candidates",
    primaryHref: `${ROUTES.hiringJobs}?addJob=1`,
    steps: [
      { icon: Briefcase, title: "Create a job", body: "Every candidate is tied to a hiring workflow." },
      { icon: Users, title: "Add or import applicants", body: "They show up here and in the job pipeline." },
      { icon: GraduationCap, title: "Optional: assessments", body: "Screen technical skills before interviews." },
      { icon: Mic2, title: "Move to interviews", body: "Advance qualified candidates to panels." },
    ],
  },
  questionPool: {
    illustration: "questionPool",
    eyebrow: "Question pool",
    headline: "Your question library is empty.",
    subtext:
      "Build reusable questions for assessments — coding, MCQ, SQL, comprehension, and more.",
    guideTitle: "Question pool",
    guideBody:
      "Curate once, reuse across many assessments. Tag by skill, difficulty, and language.",
    primaryCta: "Add Question",
    steps: [
      { icon: DatabaseZap, title: "Add questions", body: "Create items by type: coding, MCQ, database, etc." },
      { icon: GraduationCap, title: "Use in assessments", body: "Pull from the pool when building an assessment." },
      { icon: Briefcase, title: "Standardize hiring", body: "Keep evaluation consistent across roles." },
    ],
  },
  schedules: {
    illustration: "proctoring",
    eyebrow: "Schedules",
    headline: "No assessment schedules yet.",
    subtext:
      "When you run assessments at scale, scheduled sessions and candidate slots appear here.",
    guideTitle: "Assessment schedules",
    guideBody:
      "Coordinate proctored windows, batch invites, and completion tracking for high-volume hiring.",
    primaryCta: "Create Assessment",
    primaryHref: ROUTES.assessments,
    steps: [
      { icon: GraduationCap, title: "Publish an assessment", body: "Schedules tie to live assessments." },
      { icon: Calendar, title: "Plan sessions", body: "Set windows for candidates to complete tests." },
      { icon: Users, title: "Track attendance", body: "See who started, finished, or needs follow-up." },
    ],
  },
  mySchedule: {
    illustration: "calendar",
    eyebrow: "My schedule",
    headline: "Build your interview calendar from scratch.",
    subtext:
      "Add open availability and block focus time — booked interviews from your hiring pipeline appear here automatically.",
    guideTitle: "How your schedule works",
    guideBody:
      `Open slots signal when you're free, blocked time protects focus, and booked interviews sync with candidates and feedback in ${APP_NAME}.`,
    primaryCta: "Add your first slot",
    steps: [
      { icon: CalendarPlus, title: "Add your first slot", body: "Pick a day and time range to open availability for interviews." },
      { icon: Clock, title: "Set open hours", body: "Open slots show when you're available for panels and calls." },
      { icon: Calendar, title: "Block focus time", body: "Mark busy periods so nothing gets booked over team syncs or deep work." },
      { icon: Mic2, title: "Interviews appear when booked", body: "As candidates move through jobs, booked sessions land on this calendar." },
    ],
  },
};
