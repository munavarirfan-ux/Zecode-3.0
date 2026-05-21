"use client";

import { Briefcase, Calendar, FileCheck, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HiringOverviewStats } from "@/lib/hiring/mockData";
import { HeroMetricsCollapsible } from "./HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "./HiringHeroGlassKpiCard";
import { HiringHeroStrip } from "./HiringHeroStrip";
import { hiringHeroStripPrimaryBtn } from "./hiringTokens";

export function JobsOperationalHero({
  stats,
  onAddJob,
  addJobButtonRef,
  newUserEmpty,
}: {
  stats: HiringOverviewStats;
  onAddJob: () => void;
  addJobButtonRef?: React.Ref<HTMLButtonElement>;
  /** Fresh New User workspace — calmer hero before first job exists. */
  newUserEmpty?: boolean;
}) {
  const kpis = [
    {
      value: stats.activeJobs,
      label: "Active Jobs",
      subtitle: stats.activeJobs > 0 ? "Live workflows" : "No active workflows",
      icon: Briefcase,
    },
    {
      value: stats.candidatesInPipeline,
      label: "Candidates in Pipeline",
      subtitle: stats.insights.candidates,
      icon: Users,
    },
    {
      value: stats.interviewsToday,
      label: "Interviews Today",
      subtitle: stats.insights.interviews,
      icon: Calendar,
    },
    {
      value: stats.offersPending,
      label: "Offers Pending",
      subtitle: stats.offersPending > 0 ? stats.insights.offers : "Awaiting response",
      icon: FileCheck,
    },
  ] as const;

  const subtitle = newUserEmpty
    ? "How to get started: create a job, publish it, then build your candidate pipeline."
    : "Operational view of active hiring workflows across your organization.";

  return (
    <HiringHeroStrip
      aria-label="Jobs operational overview"
      title="Jobs"
      subtitle={subtitle}
      collapsedMeta={subtitle}
      heroCollapseStorageKey="jobs-operational"
      defaultHeroCollapsed={false}
      action={
        newUserEmpty ? (
          <Button ref={addJobButtonRef} type="button" onClick={onAddJob} className={hiringHeroStripPrimaryBtn}>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Create your first job
          </Button>
        ) : (
          <>
            <Button ref={addJobButtonRef} type="button" onClick={onAddJob} className={hiringHeroStripPrimaryBtn}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add New Job
            </Button>
          </>
        )
      }
    >
      {!newUserEmpty ? (
        <HeroMetricsCollapsible
          id="jobs-operational-hero-metrics"
          withBorder={false}
          storageKey="jobs-operational-hero-metrics-collapsed"
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {kpis.map((kpi) => (
            <HiringHeroGlassKpiCard
              key={kpi.label}
              value={kpi.value}
              label={kpi.label}
              subtitle={kpi.subtitle}
              icon={kpi.icon}
            />
          ))}
        </HeroMetricsCollapsible>
      ) : null}
    </HiringHeroStrip>
  );
}
