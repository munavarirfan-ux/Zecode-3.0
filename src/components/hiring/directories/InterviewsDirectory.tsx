"use client";

import { useMemo } from "react";
import type { PreviewRole } from "@/config/previewRole";
import { useRole } from "@/context/RoleContext";
import { NewUserModuleEmptyState } from "@/components/onboarding/NewUserModuleEmptyState";
import { isFreshNewUserWorkspace } from "@/lib/onboarding/workspaceMode";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";
import { InterviewerInterviewsWorkspace } from "@/components/hiring/interviewer/InterviewerInterviewsWorkspace";
import { getInterviewDirectoryJobs } from "@/lib/hiring/candidateDirectory";
import { cn } from "@/lib/utils";
import { Briefcase, Calendar, MessageSquare, Users } from "lucide-react";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HeroMetricsToggleButton } from "../HeroMetricsToggleButton";
import {
  hiringCanvas,
  hiringHeroRadialOverlay,
  hiringHeroShell,
  hiringTransition,
} from "../hiringTokens";
import { HiringHeroTexture } from "../HiringHeroTexture";
import { InterviewDirectoryJobCard } from "./InterviewDirectoryJobCard";
import { PremiumEmptyState } from "@/components/onboarding/PremiumEmptyState";
import { EMPTY_STATE_PRESETS } from "@/lib/onboarding/emptyStatePresets";
import { ROUTES } from "@/config/routes";

export function InterviewsDirectory() {
  const { selectedRole } = useRole();
  if (selectedRole === "evaluator") {
    return <InterviewerInterviewsWorkspace />;
  }
  return <AdminInterviewsDirectory selectedRole={selectedRole} />;
}

function AdminInterviewsDirectory({ selectedRole }: { selectedRole: PreviewRole }) {
  const workspaceRefresh = useWorkspaceRefresh();
  const freshNewUser = useMemo(
    () => isFreshNewUserWorkspace(selectedRole),
    [selectedRole, workspaceRefresh],
  );
  const jobs = useMemo(
    () => getInterviewDirectoryJobs(selectedRole),
    [selectedRole, workspaceRefresh],
  );
  const showNewUserEmpty = freshNewUser && jobs.length === 0;
  const summary = useMemo(() => {
    const activePipelines = jobs.length;
    const ongoingInterviews = jobs.reduce((sum, j) => sum + (j.stats?.interviewCandidates ?? 0), 0);
    const feedbackPending = jobs.reduce((sum, j) => sum + (j.stats?.feedbackPending ?? 0), 0);
    const interviewsToday = jobs.reduce((sum, j) => sum + (j.interviewsToday ?? 0), 0);
    return { activePipelines, ongoingInterviews, feedbackPending, interviewsToday };
  }, [jobs]);

  return (
    <div className={hiringCanvas}>
      <div className="relative mx-auto max-w-shell space-y-8 pb-14">
        {showNewUserEmpty ? (
          <NewUserModuleEmptyState module="interviews" />
        ) : (
        <>
          <section className={hiringHeroShell} aria-label="Interview operations overview">
            <HiringHeroTexture />
            <div
              className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-white/[0.06] blur-3xl"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0" aria-hidden style={hiringHeroRadialOverlay} />

            <div className="relative space-y-9 sm:space-y-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <header className="min-w-0 space-y-2">
                  <h1 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[2.125rem]">
                    Interviews
                  </h1>
                  <p className="max-w-2xl text-[13px] leading-relaxed text-white/[0.68] sm:text-sm">
                    View and manage interview pipelines across all active jobs.
                  </p>
                </header>
                <HeroMetricsToggleButton storageKey="interviews-directory-hero-metrics-collapsed" />
              </div>

              <HeroMetricsCollapsible
                id="interviews-directory-hero-metrics"
                withBorder={false}
                storageKey="interviews-directory-hero-metrics-collapsed"
                gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              >
                <HiringHeroGlassKpiCard
                  value={summary.activePipelines}
                  label="Active pipelines"
                  subtitle="Jobs with interview activity"
                  icon={Briefcase}
                />
                <HiringHeroGlassKpiCard
                  value={summary.ongoingInterviews}
                  label="Ongoing interviews"
                  subtitle="Candidates in interview stages"
                  icon={Users}
                />
                <HiringHeroGlassKpiCard
                  value={summary.interviewsToday}
                  label="Interviews today"
                  subtitle={summary.interviewsToday > 0 ? "On the calendar" : "No sessions today"}
                  icon={Calendar}
                />
                <HiringHeroGlassKpiCard
                  value={summary.feedbackPending}
                  label="Pending feedback"
                  subtitle={summary.feedbackPending > 0 ? "Needs review" : "Inbox clear"}
                  icon={MessageSquare}
                />
              </HeroMetricsCollapsible>
            </div>
          </section>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {jobs.map((job) => (
                <InterviewDirectoryJobCard key={job.id} job={job} />
              ))}
            </div>

            {jobs.length === 0 ? (
              <PremiumEmptyState
                {...EMPTY_STATE_PRESETS.interviews}
                ctaLabel="Schedule Interview"
                ctaHref={ROUTES.interviews}
              />
            ) : null}
        </>
        )}
      </div>
    </div>
  );
}
