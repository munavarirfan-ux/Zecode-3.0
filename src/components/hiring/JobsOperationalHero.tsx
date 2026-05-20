"use client";

import { Briefcase, Calendar, FileCheck, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HiringOverviewStats } from "@/lib/hiring/mockData";
import { HeroMetricsCollapsible } from "./HeroMetricsCollapsible";
import { HeroMetricsToggleButton } from "./HeroMetricsToggleButton";
import { HiringHeroGlassKpiCard } from "./HiringHeroGlassKpiCard";
import {
  hiringHeroPrimaryBtnMd,
  hiringHeroRadialOverlay,
  hiringHeroShell,
} from "./hiringTokens";
import { HiringHeroTexture } from "./HiringHeroTexture";

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

  return (
    <section className={hiringHeroShell} aria-label="Jobs operational overview">
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-teal-200/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={hiringHeroRadialOverlay}
      />

      <div className="relative space-y-9 sm:space-y-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <header className="min-w-0 space-y-2">
            <h1 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[2.125rem]">
              Jobs
            </h1>
            <p className="max-w-lg text-[13px] leading-relaxed text-white/[0.68] sm:text-sm">
              {newUserEmpty
                ? "How to get started: create a job, publish it, then build your candidate pipeline."
                : "Operational view of active hiring workflows across your organization."}
            </p>
          </header>
          {newUserEmpty ? (
            <Button ref={addJobButtonRef} type="button" onClick={onAddJob} className={hiringHeroPrimaryBtnMd}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Create your first job
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <HeroMetricsToggleButton storageKey="jobs-operational-hero-metrics-collapsed" />
              <Button ref={addJobButtonRef} type="button" onClick={onAddJob} className={hiringHeroPrimaryBtnMd}>
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add New Job
              </Button>
            </div>
          )}
        </div>

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
      </div>
    </section>
  );
}
