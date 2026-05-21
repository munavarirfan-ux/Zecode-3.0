"use client";

import { Calendar, ClipboardCheck, FileCheck, MessageSquare, Users } from "lucide-react";
import type { CandidateDirectoryStats } from "@/lib/hiring/candidateDirectoryStats";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { HiringHeroStrip } from "../HiringHeroStrip";

export function CandidatesDirectoryHero({
  stats,
  newUserEmpty,
}: {
  stats: CandidateDirectoryStats;
  newUserEmpty?: boolean;
}) {
  const kpis = [
    {
      value: stats.total,
      label: "Total Candidates",
      subtitle: "In your view",
      icon: Users,
    },
    {
      value: stats.interviewsActive,
      label: "Interviews Active",
      subtitle: "Live pipelines",
      icon: Calendar,
    },
    {
      value: stats.assessmentPending,
      label: "Assessment Pending",
      subtitle: "Screening queue",
      icon: ClipboardCheck,
    },
    {
      value: stats.feedbackPending,
      label: "Feedback Pending",
      subtitle: "Needs review",
      icon: MessageSquare,
    },
    {
      value: stats.offersSent,
      label: "Offers Sent",
      subtitle: "Hire & offers",
      icon: FileCheck,
    },
  ] as const;

  const subtitle = newUserEmpty
    ? "Candidates show up here once you create a job and add applicants to your pipeline."
    : "Search, filter, and manage candidates across all hiring pipelines.";

  return (
    <HiringHeroStrip
      aria-label="Candidates overview"
      title="Candidates"
      subtitle={subtitle}
      collapsedMeta={subtitle}
      heroCollapseStorageKey="candidates-directory"
    >
      {!newUserEmpty ? (
        <HeroMetricsCollapsible
          id="candidates-directory-hero-metrics"
          withBorder={false}
          storageKey="candidates-directory-hero-metrics-collapsed"
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
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
