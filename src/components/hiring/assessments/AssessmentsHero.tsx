"use client";

import { ClipboardList, Plus, Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS_HERO_METRICS_COLLAPSED_KEY } from "@/lib/hiring/assessments/types";
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

export function AssessmentsHero({
  stats,
  onCreate,
  onShare,
  createButtonRef,
  newUserEmpty,
}: {
  stats: { active: number; invited: number; qualified: number };
  onCreate: () => void;
  onShare: () => void;
  createButtonRef?: React.Ref<HTMLButtonElement>;
  newUserEmpty?: boolean;
}) {
  const kpis = [
    { value: stats.active, label: "Active assessments", subtitle: "Published & in progress", icon: ClipboardList },
    { value: stats.invited, label: "Candidates invited", subtitle: "Across active assessments", icon: Users },
    { value: stats.qualified, label: "Qualified", subtitle: "Passed qualifying score", icon: ClipboardList },
  ] as const;

  return (
    <section className={hiringHeroShell} aria-label="Assessments overview">
      <HiringHeroTexture />
      <div className="pointer-events-none absolute inset-0" style={hiringHeroRadialOverlay} aria-hidden />
      <div className="relative space-y-9 sm:space-y-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <header className="min-w-0 space-y-2">
            <h1 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[2.125rem]">
              Assessments
            </h1>
            <p className="max-w-lg text-[13px] leading-relaxed text-white/[0.68] sm:text-sm">
              {newUserEmpty
                ? "Build your first assessment when you're ready — or start with a job and candidates."
                : "Assessment operations center — create, share, and track candidate progress end to end."}
            </p>
          </header>
          {!newUserEmpty ? (
          <div className="flex flex-wrap gap-2">
            <HeroMetricsToggleButton storageKey={ASSESSMENTS_HERO_METRICS_COLLAPSED_KEY} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={hiringHeroSecondaryBtnSm}
              onClick={onShare}
            >
              <Share2 className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
              Share Assessment
            </Button>
            <Button ref={createButtonRef} type="button" onClick={onCreate} className={hiringHeroPrimaryBtnMd}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Create Assessment
            </Button>
          </div>
          ) : null}
        </div>

        {!newUserEmpty ? (
        <HeroMetricsCollapsible
          id="assessments-hero-metrics"
          withBorder={false}
          storageKey={ASSESSMENTS_HERO_METRICS_COLLAPSED_KEY}
          gridClassName="grid-cols-1 sm:grid-cols-3"
        >
          {kpis.map((k) => (
            <li key={k.label}>
              <HiringHeroGlassKpiCard {...k} />
            </li>
          ))}
        </HeroMetricsCollapsible>
        ) : null}
      </div>
    </section>
  );
}
