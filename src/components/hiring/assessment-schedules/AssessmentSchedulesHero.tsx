"use client";

import {
  CalendarClock,
  ClipboardCheck,
  Download,
  Hourglass,
  Plus,
  Radio,
  Upload,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_SCHEDULES_HERO_METRICS_COLLAPSED_KEY } from "@/lib/hiring/assessments/scheduleTypes";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HeroMetricsToggleButton } from "../HeroMetricsToggleButton";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { HiringHeroTexture } from "../HiringHeroTexture";
import {
  hiringHeroPrimaryBtnMd,
  hiringHeroRadialOverlay,
  hiringHeroSecondaryBtnSm,
  hiringHeroShell,
} from "../hiringTokens";

export function AssessmentSchedulesHero({
  metrics,
  onSchedule,
  onBulkSchedule,
  onExport,
}: {
  metrics: {
    scheduledToday: number;
    ongoingAttempts: number;
    pendingEvaluations: number;
    expiringToday: number;
    qualifiedCandidates: number;
  };
  onSchedule: () => void;
  onBulkSchedule: () => void;
  onExport: () => void;
}) {
  const kpis = [
    { value: metrics.scheduledToday, label: "Scheduled today", subtitle: "Invites going out today", icon: CalendarClock },
    { value: metrics.ongoingAttempts, label: "Ongoing attempts", subtitle: "Live & in progress", icon: Radio },
    { value: metrics.pendingEvaluations, label: "Pending evaluations", subtitle: "Awaiting review", icon: Hourglass },
    { value: metrics.expiringToday, label: "Expiring today", subtitle: "Needs follow-up", icon: ClipboardCheck },
    { value: metrics.qualifiedCandidates, label: "Qualified candidates", subtitle: "Met threshold", icon: UserCheck },
  ] as const;

  return (
    <section className={hiringHeroShell} aria-label="Assessment schedules overview">
      <HiringHeroTexture />
      <div className="pointer-events-none absolute inset-0" style={hiringHeroRadialOverlay} aria-hidden />
      <div className="relative space-y-9 sm:space-y-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <header className="min-w-0 space-y-2">
            <h1 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[2.125rem]">
              Assessment Schedules
            </h1>
            <p className="max-w-xl text-[13px] leading-relaxed text-white/[0.68] sm:text-sm">
              Manage assessment invitations, live attempts, expiry timelines, and candidate progress.
            </p>
          </header>
          <div className="flex flex-wrap gap-2">
            <HeroMetricsToggleButton storageKey={ASSESSMENT_SCHEDULES_HERO_METRICS_COLLAPSED_KEY} />
            <Button type="button" variant="outline" size="sm" className={hiringHeroSecondaryBtnSm} onClick={onExport}>
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
              Export
            </Button>
            <Button type="button" variant="outline" size="sm" className={hiringHeroSecondaryBtnSm} onClick={onBulkSchedule}>
              <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
              Bulk Schedule
            </Button>
            <Button type="button" onClick={onSchedule} className={hiringHeroPrimaryBtnMd}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Schedule Assessment
            </Button>
          </div>
        </div>

        <HeroMetricsCollapsible
          id="assessment-schedules-hero-metrics"
          withBorder={false}
          storageKey={ASSESSMENT_SCHEDULES_HERO_METRICS_COLLAPSED_KEY}
          gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        >
          {kpis.map((k) => (
            <li key={k.label}>
              <HiringHeroGlassKpiCard {...k} />
            </li>
          ))}
        </HeroMetricsCollapsible>
      </div>
    </section>
  );
}
