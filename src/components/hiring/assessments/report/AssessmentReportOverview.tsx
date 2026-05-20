"use client";

import type { LucideIcon } from "lucide-react";
import { Award, CheckCircle2, Percent, ShieldAlert, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AssessmentCandidateRecord,
  AssessmentSectionScore,
  MalpracticeBreakdown,
} from "@/lib/hiring/assessments/types";
import {
  dashboardKpiCard,
  dashboardLabel,
  dashboardPanelInteractive,
} from "@/components/dashboard/dashboardTokens";

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className={cn(dashboardKpiCard, "min-h-[108px]")}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className={dashboardLabel}>{label}</span>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[rgba(15,23,42,0.06)] bg-white shadow-sm dark:bg-white/[0.06]">
          <Icon className="h-3.5 w-3.5 text-[rgb(var(--accent-rgb))]" strokeWidth={1.75} />
        </div>
      </div>
      <p className="text-[1.35rem] font-semibold tabular-nums tracking-[-0.03em] text-[#18181B] dark:text-text">
        {value}
      </p>
      {hint ? <p className="mt-1 text-[11px] leading-snug text-[#71717A] dark:text-muted">{hint}</p> : null}
    </div>
  );
}

function MalpracticeRow({ label, count }: { label: string; count: number }) {
  const flagged = count > 0;
  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(15,23,42,0.05)] bg-[#FAFAFB]/80 px-3 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
      <span className="text-[13px] font-medium text-[#3F3F46] dark:text-text-secondary">{label}</span>
      <span
        className={cn(
          "inline-flex min-w-[4.5rem] justify-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums",
          flagged
            ? "border border-violet-400/25 bg-violet-500/[0.08] text-violet-800 dark:text-violet-200"
            : "border border-amber-400/20 bg-amber-500/[0.06] text-amber-800/90 dark:text-amber-200/90",
        )}
      >
        {count} {count === 1 ? "time" : "times"}
      </span>
    </div>
  );
}

function SectionScoreRow({ section }: { section: AssessmentSectionScore }) {
  const pct = section.maxScore ? Math.round((section.score / section.maxScore) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-medium text-[#18181B] dark:text-text">{section.section}</span>
        <span className="text-[12px] font-semibold tabular-nums text-[#52525B] dark:text-text-secondary">
          {section.score} / {section.maxScore}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--accent-rgb)),rgb(var(--hero-gradient-to-rgb)))] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AssessmentReportOverview({
  candidate,
  malpractice,
  sectionalScores,
}: {
  candidate: AssessmentCandidateRecord;
  malpractice: MalpracticeBreakdown;
  sectionalScores: AssessmentSectionScore[];
}) {
  const qualLabel =
    candidate.qualified === true
      ? "Qualified"
      : candidate.qualified === false
        ? "Not qualified"
        : "Pending review";

  const totalFlags = malpractice.copying + malpractice.leavingTab + malpractice.movementDetection;

  const sectionalAvg = Math.round(
    sectionalScores.reduce((s, x) => s + (x.maxScore ? (x.score / x.maxScore) * 100 : 0), 0) /
      Math.max(sectionalScores.length, 1),
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Final score"
          value={candidate.score != null ? `${candidate.score}%` : "—"}
          hint="Weighted across all sections"
          icon={Award}
        />
        <KpiCard label="Qualification status" value={qualLabel} icon={CheckCircle2} />
        <KpiCard
          label="Duration"
          value={candidate.durationMinutes != null ? `${candidate.durationMinutes} min` : "—"}
          icon={Timer}
        />
        <KpiCard
          label="Malpractice summary"
          value={String(totalFlags)}
          hint={totalFlags === 0 ? "No integrity flags" : "Review anomaly details below"}
          icon={ShieldAlert}
        />
        <KpiCard
          label="Sectional score"
          value={`${sectionalAvg}%`}
          hint="Average across sections"
          icon={Percent}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={cn(dashboardPanelInteractive, "p-4 sm:p-5")}>
          <h3 className="flex items-center gap-2 text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
            <ShieldAlert className="h-4 w-4 text-violet-600/80" strokeWidth={1.75} />
            Malpractice / anomaly
          </h3>
          <p className="mt-1 text-[12px] text-[#71717A] dark:text-muted">
            Soft integrity signals detected during the attempt.
          </p>
          <div className="mt-4 space-y-2">
            <MalpracticeRow label="Copying" count={malpractice.copying} />
            <MalpracticeRow label="Leaving tab" count={malpractice.leavingTab} />
            <MalpracticeRow label="Movement detection" count={malpractice.movementDetection} />
          </div>
        </section>

        <section className={cn(dashboardPanelInteractive, "p-4 sm:p-5")}>
          <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
            Sectional score
          </h3>
          <p className="mt-1 text-[12px] text-[#71717A] dark:text-muted">Performance by assessment section.</p>
          <div className="mt-4 space-y-4">
            {sectionalScores.length > 0 ? (
              sectionalScores.map((s) => <SectionScoreRow key={s.section} section={s} />)
            ) : (
              <p className="text-[13px] text-muted">No sectional data yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
