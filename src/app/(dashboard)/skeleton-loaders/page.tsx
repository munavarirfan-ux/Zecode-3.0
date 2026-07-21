"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DashboardSkeleton,
  JobsSkeleton,
  JobDetailsSkeleton,
  CandidatesSkeleton,
  CandidateReportSkeleton,
  InterviewsSkeleton,
  InterviewDetailsSkeleton,
  MyScheduleSkeleton,
  AssessmentsSkeleton,
  AssessmentDetailsSkeleton,
  AssessmentCandidateReportSkeleton,
  AssessmentDriveSkeleton,
  QuestionPoolSkeleton,
  QuestionEditorSkeleton,
  ReportsSkeleton,
  SettingsSkeleton,
  EnterprisesSkeleton,
  EnterpriseDetailsSkeleton,
  LoginSignupSkeleton,
} from "@/components/skeletons";

const SCREENS = [
  { id: "dashboard", label: "Dashboard", component: DashboardSkeleton },
  { id: "jobs", label: "Jobs", component: JobsSkeleton },
  { id: "job-details", label: "Job Details", component: JobDetailsSkeleton },
  { id: "candidates", label: "Candidates", component: CandidatesSkeleton },
  { id: "candidate-report", label: "Candidate Report", component: CandidateReportSkeleton },
  { id: "interviews", label: "Interviews", component: InterviewsSkeleton },
  { id: "interview-details", label: "Interview Details", component: InterviewDetailsSkeleton },
  { id: "my-schedule", label: "My Schedule", component: MyScheduleSkeleton },
  { id: "assessments", label: "Assessments", component: AssessmentsSkeleton },
  { id: "assessment-details", label: "Assessment Details", component: AssessmentDetailsSkeleton },
  { id: "assessment-candidate-report", label: "Assessment Candidate Report", component: AssessmentCandidateReportSkeleton },
  { id: "assessment-drive", label: "Assessment Drive", component: AssessmentDriveSkeleton },
  { id: "question-pool", label: "Question Pool", component: QuestionPoolSkeleton },
  { id: "question-editor", label: "Question Editor", component: QuestionEditorSkeleton },
  { id: "reports", label: "Reports", component: ReportsSkeleton },
  { id: "settings", label: "Settings", component: SettingsSkeleton },
  { id: "enterprises", label: "Enterprises", component: EnterprisesSkeleton },
  { id: "enterprise-details", label: "Enterprise Details", component: EnterpriseDetailsSkeleton },
  { id: "login-signup", label: "Login / Sign Up", component: LoginSignupSkeleton },
] as const;

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORTS: { id: Viewport; label: string; width: string }[] = [
  { id: "desktop", label: "Desktop", width: "w-full" },
  { id: "tablet", label: "Tablet", width: "max-w-[768px]" },
  { id: "mobile", label: "Mobile", width: "max-w-[375px]" },
];

export default function SkeletonLoadersPage() {
  const [activeScreen, setActiveScreen] = useState(SCREENS[0].id);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [animating, setAnimating] = useState(true);

  const ActiveComponent = SCREENS.find((s) => s.id === activeScreen)!.component;
  const viewportWidth = VIEWPORTS.find((v) => v.id === viewport)!.width;

  return (
    <div className="relative min-h-full w-full min-w-0 rounded-[20px] bg-white py-3 dark:bg-[#0E0E11]">
      {/* Header */}
      <div className="px-4 sm:px-5">
        <h1 className="text-[1.25rem] font-semibold tracking-[-0.025em] text-text">
          Skeleton Loaders
        </h1>
        <p className="mt-1 text-[13px] text-text-secondary/80">
          Preview loading states for all major Ze[hub] screens and components.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-[rgba(15,23,42,0.06)] px-4 pb-4 dark:border-white/[0.06] sm:px-5">
        {/* Viewport selector */}
        <div className="flex gap-1 rounded-[10px] border border-[rgba(15,23,42,0.06)] p-0.5 dark:border-white/[0.06]">
          {VIEWPORTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setViewport(v.id)}
              className={cn(
                "rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-all duration-[180ms]",
                viewport === v.id
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-secondary hover:bg-[rgba(15,23,42,0.04)] dark:hover:bg-white/[0.04]",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Animation toggle */}
        <button
          type="button"
          onClick={() => setAnimating(!animating)}
          className={cn(
            "rounded-[10px] border px-3 py-1.5 text-[12px] font-medium transition-all duration-[180ms]",
            animating
              ? "border-accent/20 bg-accent/5 text-accent"
              : "border-[rgba(15,23,42,0.08)] text-text-secondary hover:bg-[rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:hover:bg-white/[0.04]",
          )}
        >
          {animating ? "Stop Animation" : "Start Animation"}
        </button>
      </div>

      <div className="mt-4 flex gap-4 px-4 sm:px-5">
        {/* Screen selector sidebar */}
        <div className="hidden w-[200px] shrink-0 lg:block">
          <div className="sticky top-4 space-y-0.5">
            {SCREENS.map((screen) => (
              <button
                key={screen.id}
                type="button"
                onClick={() => setActiveScreen(screen.id)}
                className={cn(
                  "block w-full rounded-[8px] px-3 py-2 text-left text-[12px] font-medium transition-all duration-[180ms]",
                  activeScreen === screen.id
                    ? "bg-[rgb(var(--accent-rgb)/0.08)] text-accent"
                    : "text-text-secondary/80 hover:bg-[rgba(15,23,42,0.04)] hover:text-text dark:hover:bg-white/[0.04]",
                )}
              >
                {screen.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile screen selector */}
        <div className="mb-3 block w-full lg:hidden">
          <select
            value={activeScreen}
            onChange={(e) => setActiveScreen(e.target.value as typeof activeScreen)}
            className="h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-[13px] font-medium text-text dark:border-white/[0.08] dark:bg-white/[0.04]"
          >
            {SCREENS.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.label}
              </option>
            ))}
          </select>
        </div>

        {/* Preview area */}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "mx-auto overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] p-3 transition-all duration-300 dark:border-white/[0.06] dark:bg-[#0E0E11]",
              viewportWidth,
              !animating && "[&_*]:!animate-none [&_*]:before:!animate-none",
            )}
          >
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
