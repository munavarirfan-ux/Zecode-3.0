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
import { HiringHeroStrip } from "../HiringHeroStrip";
import { hiringCanvas, hiringTransition } from "../hiringTokens";
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
      <div className="relative w-full min-w-0 space-y-8 pb-14">
        {showNewUserEmpty ? (
          <NewUserModuleEmptyState module="interviews" />
        ) : (
        <>
          <HiringHeroStrip
            aria-label="Interview operations overview"
            title="Interviews"
            subtitle="View and manage interview pipelines across all active jobs."
            collapsedMeta="View and manage interview pipelines across all active jobs."
            heroCollapseStorageKey="interviews-directory"
          >
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
          </HiringHeroStrip>

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
