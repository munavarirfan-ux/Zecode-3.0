"use client";

import { AlertTriangle, CalendarClock, Plus, Radio, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LiveMonitoringOverviewStats } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { HiringHeroStrip } from "../HiringHeroStrip";
import { hiringHeroStripPrimaryBtn } from "../hiringTokens";

export const ASSESSMENT_SCHEDULES_HERO_METRICS_COLLAPSED_KEY =
  "assessment-schedules-hero-metrics-collapsed";

export function AssessmentSchedulesHero({
  stats,
  scheduledCount,
  onSchedule,
}: {
  stats: LiveMonitoringOverviewStats;
  scheduledCount: number;
  onSchedule: () => void;
}) {
  const kpis = [
    {
      value: stats.liveAssessments,
      label: "Live assessments",
      subtitle:
        stats.liveAssessments === 1
          ? "1 window open right now"
          : `${stats.liveAssessments} windows open right now`,
      icon: Radio,
    },
    {
      value: scheduledCount,
      label: "Scheduled assessments",
      subtitle: "Upcoming windows",
      icon: CalendarClock,
    },
    {
      value: stats.candidatesLive,
      label: "Candidates live",
      subtitle: "Currently taking exams",
      icon: Users,
    },
    {
      value: stats.flagged,
      label: "Flagged",
      subtitle: stats.flagged > 0 ? "Needs attention" : "No flags right now",
      icon: AlertTriangle,
    },
  ] as const;

  const subtitle = "Monitor live assessments and manage upcoming scheduled windows.";

  return (
    <HiringHeroStrip
      aria-label="Assessment schedules overview"
      title="Assessment Drive"
      subtitle={subtitle}
      collapsedMeta={subtitle}
      heroCollapseStorageKey="assessment-schedules"
      action={
        <>
          <Button type="button" onClick={onSchedule} className={hiringHeroStripPrimaryBtn}>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Schedule Assessment
          </Button>
        </>
      }
    >
      <HeroMetricsCollapsible
        id="assessment-schedules-hero-metrics"
        withBorder={false}
        storageKey={ASSESSMENT_SCHEDULES_HERO_METRICS_COLLAPSED_KEY}
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
    </HiringHeroStrip>
  );
}
