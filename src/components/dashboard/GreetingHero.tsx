"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Calendar,
  Check,
  ClipboardList,
  Clock,
  FileCheck,
  Inbox,
  Layers,
  Mic2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { PreviewRole } from "@/config/previewRole";
import { getDashboardHeroBlock } from "@/config/dashboardHeroByRole";
import {
  buildInterviewerAssignedInterviews,
  computeInterviewTimeSpentMinutesThisWeek,
  countInterviewsTimeSpentThisWeek,
  formatInterviewDuration,
} from "@/lib/hiring/interviewerInterviews";
import type { DashboardHeroKpi } from "@/config/dashboardHeroByRole";
import {
  hiringHeroGlassKpi,
  hiringHeroRadialOverlay,
  hiringHeroShell,
} from "@/components/hiring/hiringTokens";
import { HiringHeroTexture } from "@/components/hiring/HiringHeroTexture";

function greetingLine(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const HERO_KPI_ICONS: Record<string, LucideIcon> = {
  interviewsToday: Calendar,
  feedbackDue: Inbox,
  assessmentsProgress: ClipboardList,
  offers: FileCheck,
  today: Calendar,
  feedback: Inbox,
  upcoming: Mic2,
  done: Check,
  ongoing: ClipboardList,
  timeSpent: Clock,
  pending: Inbox,
  flagged: Briefcase,
  created: Layers,
  reuse: Users,
  lowQ: Briefcase,
  archived: Layers,
};

function Sparkline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 14" className={cn("h-3.5 w-10 text-white/40", className)} aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="0,11 6,9 12,10 18,6 24,7 30,4 40,5"
      />
    </svg>
  );
}

function WorkspaceSummaryCard({
  brandLine,
  region,
  activeTeams,
  hiringHealth,
}: {
  brandLine: string;
  region: string;
  activeTeams: string;
  hiringHealth: string;
}) {
  return (
    <aside className={cn(hiringHeroGlassKpi, "min-h-[140px] lg:max-w-[260px]")}>
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/[0.06] blur-2xl opacity-60"
        aria-hidden
      />
      <p className="relative text-[9px] font-medium uppercase tracking-[0.1em] text-white/50">Workspace</p>
      <p className="relative mt-2 text-[1.375rem] font-semibold leading-snug tracking-tight text-white">{brandLine}</p>
      <p className="relative mt-3 text-[12px] font-semibold text-white/90">Region</p>
      <p className="relative mt-1 text-[11px] text-white/55">{region}</p>
      <p className="relative mt-3 text-[12px] font-semibold text-white/90">Active teams</p>
      <p className="relative mt-1 text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.03em] text-white">
        {activeTeams}
      </p>
      <p className="relative mt-2 text-[11px] text-[rgb(var(--hero-glow-rgb)/0.85)]">{hiringHealth}</p>
    </aside>
  );
}

function HeroGlassKpi({ k }: { k: DashboardHeroKpi }) {
  const Icon = HERO_KPI_ICONS[k.id] ?? Briefcase;
  const subtitle = k.trend ?? k.caption;

  return (
    <li className={hiringHeroGlassKpi}>
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/[0.06] blur-2xl opacity-60 transition-opacity duration-[180ms] ease-out group-hover/kpi:opacity-100"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.16] bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <Icon className="h-[18px] w-[18px] text-white/90" strokeWidth={1.5} />
        </div>
        <Sparkline />
      </div>
      <p className="relative mt-5 text-[2.25rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-white sm:text-[2.375rem]">
        {k.value}
      </p>
      <p className="relative mt-3 text-[12px] font-semibold tracking-[-0.01em] text-white/90">{k.label}</p>
      {subtitle ? <p className="relative mt-1 text-[11px] leading-snug text-white/55">{subtitle}</p> : null}
    </li>
  );
}

export function GreetingHero({
  role,
  name,
  organizationName,
}: {
  role: PreviewRole;
  name: string;
  organizationName?: string | null;
}) {
  const { data: session } = useSession();
  const [line, setLine] = useState("Good afternoon");

  useEffect(() => {
    setLine(greetingLine(new Date().getHours()));
  }, []);

  const hero = useMemo(() => {
    const base = getDashboardHeroBlock(role, organizationName);
    if (role !== "evaluator") return base;

    const rows = buildInterviewerAssignedInterviews(role, session?.user?.name);
    const minutes = computeInterviewTimeSpentMinutesThisWeek(rows);
    const sessionCount = countInterviewsTimeSpentThisWeek(rows);

    return {
      ...base,
      kpis: base.kpis.map((kpi) =>
        kpi.id === "timeSpent"
          ? {
              ...kpi,
              value: formatInterviewDuration(minutes),
              trend: sessionCount === 1 ? "1 session" : `${sessionCount} sessions`,
              trendUp: minutes > 0,
            }
          : kpi,
      ),
    };
  }, [role, organizationName, session?.user?.name]);

  const isWideExecutive = hero.layout === "workspace";
  const kpiGridClass =
    hero.kpis.length >= 5
      ? "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3 xl:grid-cols-5"
      : "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4";

  return (
    <section className={hiringHeroShell} aria-label="Dashboard overview">
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.06)] blur-3xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden style={hiringHeroRadialOverlay} />

      <div
        className={cn(
          "relative space-y-8 sm:space-y-9",
          isWideExecutive && hero.workspaceSummary && "lg:flex lg:items-start lg:justify-between lg:gap-8 lg:space-y-0",
        )}
      >
        <div className="min-w-0 flex-1 space-y-8 sm:space-y-9">
          <header className="min-w-0 space-y-2">
            {hero.topLabel?.trim() ? (
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/50">{hero.topLabel}</p>
            ) : null}
            <h1 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[2.125rem]">
              {line}, {name}{" "}
              <span className="font-normal text-white/80" aria-hidden>
                👋
              </span>
            </h1>
            <p className="max-w-lg text-[13px] leading-relaxed text-white/[0.68] sm:text-sm">{hero.subheading}</p>
          </header>

          <ul className={kpiGridClass}>
            {hero.kpis.map((k) => (
              <HeroGlassKpi key={k.id} k={k} />
            ))}
          </ul>

          {hero.chips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {hero.chips.map((c) => (
                <span
                  key={c}
                  className="inline-flex max-w-full items-center rounded-full border border-white/[0.14] bg-white/[0.08] px-2.5 py-1 text-[10px] font-medium text-white/75"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {isWideExecutive && hero.workspaceSummary ? (
          <WorkspaceSummaryCard
            brandLine={hero.workspaceSummary.brandLine}
            region={hero.workspaceSummary.region}
            activeTeams={hero.workspaceSummary.activeTeams}
            hiringHealth={hero.workspaceSummary.hiringHealth}
          />
        ) : null}
      </div>
    </section>
  );
}
