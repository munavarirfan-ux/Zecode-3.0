"use client";

import { AlertTriangle, ArrowLeft, Clock, Radio, Timer, Users } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { formatClosesIn } from "@/lib/hiring/assessments/liveMonitoringData";
import type { LiveAssessmentSummary } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { HiringHeroWorkspace } from "../HiringHeroWorkspace";
import { hiringHeroStripMetaChips } from "../hiringTokens";

const glassMeta =
  "inline-flex items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/78 backdrop-blur-md";

const METRICS_KEY = "live-assessment-monitor-hero-metrics-collapsed";

export function LiveAssessmentMonitorHero({
  summary,
  counts,
}: {
  summary: LiveAssessmentSummary;
  counts: { all: number; live: number; idle: number; flagged: number };
}) {
  const kpis = [
    {
      value: counts.live,
      label: "Live candidates",
      subtitle: "Actively taking the exam",
      icon: Radio,
    },
    {
      value: counts.idle,
      label: "Idle",
      subtitle: counts.idle > 0 ? "Needs attention" : "All active",
      icon: Timer,
    },
    {
      value: counts.flagged,
      label: "Flagged",
      subtitle: counts.flagged > 0 ? "Review signals" : "No flags",
      icon: AlertTriangle,
    },
    {
      value: summary.closesInMinutes,
      label: "Window closes",
      subtitle: formatClosesIn(summary.closesInMinutes),
      icon: Clock,
    },
  ] as const;

  return (
    <HiringHeroWorkspace
      aria-label="Live assessment monitor"
      heroCollapseStorageKey="live-assessment-monitor"
      defaultHeroCollapsed
      collapsedMeta={[summary.role, `${counts.all} in session`, `Closes in ${formatClosesIn(summary.closesInMinutes)}`]}
      backHref={ROUTES.schedules}
      backLabel={
        <>
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          Assessment Drive
        </>
      }
      title={summary.assessmentName}
      subtitle={summary.role}
      meta={
        <div className={hiringHeroStripMetaChips}>
          <span className={glassMeta}>
            <Radio className="h-3 w-3" strokeWidth={2} aria-hidden />
            Live assessment
          </span>
          <span className={glassMeta}>
            <Users className="h-3 w-3 opacity-80" strokeWidth={1.75} />
            {counts.all} in session
          </span>
          <span className={glassMeta}>
            <Clock className="h-3 w-3 opacity-80" strokeWidth={1.75} />
            Closes in {formatClosesIn(summary.closesInMinutes)}
          </span>
        </div>
      }
      metricsStorageKey={METRICS_KEY}
      metrics={
        <HeroMetricsCollapsible
          id="live-assessment-monitor-metrics"
          storageKey={METRICS_KEY}
          withBorder={false}
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {kpis.map((kpi) => (
            <HiringHeroGlassKpiCard key={kpi.label} {...kpi} />
          ))}
        </HeroMetricsCollapsible>
      }
    />
  );
}
