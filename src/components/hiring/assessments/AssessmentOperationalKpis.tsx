"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ClipboardList,
  Clock,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { ASSESSMENT_DETAIL_METRICS_COLLAPSED_KEY } from "@/lib/hiring/assessments/types";
import { useHeroMetricsCollapsed } from "../useHeroMetricsCollapsed";
import { SurfaceMetricsToggleButton } from "../SurfaceMetricsToggleButton";
import { hiringCard, hiringTransition } from "../hiringTokens";
import { cn } from "@/lib/utils";

function MetricChip({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[14px] border border-[rgba(15,23,42,0.05)]",
        "bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(var(--accent-rgb),0.04))]",
        "p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]",
        hiringTransition,
        "hover:-translate-y-px hover:border-[rgb(var(--accent-rgb)/0.12)] hover:shadow-[0_8px_24px_-12px_rgba(var(--accent-rgb),0.2)]",
        "dark:border-white/[0.06] dark:bg-white/[0.04]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgb(var(--accent-rgb)/0.08)] text-accent">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="text-[1.25rem] font-semibold tabular-nums tracking-[-0.03em] text-text">{value}</span>
      </div>
      <p className="mt-2 text-[11px] font-semibold text-text">{label}</p>
      <p className="mt-0.5 text-[10px] text-muted">{subtitle}</p>
    </div>
  );
}

export function AssessmentOperationalKpis({
  stats,
  onViewAllCandidates,
  className,
}: {
  stats: {
    invited: number;
    attempted: number;
    qualified: number;
    notQualified: number;
    pending: number;
    malpractice: number;
  };
  onViewAllCandidates: () => void;
  className?: string;
}) {
  const { collapsed, hydrated } = useHeroMetricsCollapsed(ASSESSMENT_DETAIL_METRICS_COLLAPSED_KEY);
  const metricsHidden = collapsed && hydrated;

  const kpis = [
    { value: stats.invited, label: "Total invited", subtitle: "All with access", icon: Users },
    { value: stats.attempted, label: "Attempted", subtitle: "Opened or submitted", icon: ClipboardList },
    { value: stats.qualified, label: "Qualified", subtitle: "Met threshold", icon: UserCheck },
    { value: stats.notQualified, label: "Not qualified", subtitle: "Below threshold", icon: UserX },
    { value: stats.pending, label: "Pending", subtitle: "No attempt yet", icon: Clock },
    { value: stats.malpractice, label: "Malpractice", subtitle: "Signals to review", icon: AlertTriangle },
  ] as const;

  return (
    <section className={cn(hiringCard, "overflow-hidden p-4 sm:p-5", className)} aria-label="Assessment metrics">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-text">Operational metrics</h2>
          <p className="mt-0.5 text-[12px] text-muted">Live funnel for this assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <SurfaceMetricsToggleButton storageKey={ASSESSMENT_DETAIL_METRICS_COLLAPSED_KEY} />
          <button
            type="button"
            onClick={onViewAllCandidates}
            className="text-[12px] font-semibold text-accent hover:text-accent-hover"
          >
            All invited candidates →
          </button>
        </div>
      </div>

      {!metricsHidden ? (
        <div
          id="assessment-detail-metrics"
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-6"
        >
          {kpis.map((k) => (
            <MetricChip key={k.label} {...k} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
