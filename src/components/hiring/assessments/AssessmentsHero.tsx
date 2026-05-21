"use client";

import { ClipboardList, Plus, Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSESSMENTS_HERO_METRICS_COLLAPSED_KEY } from "@/lib/hiring/assessments/types";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { HiringHeroStrip } from "../HiringHeroStrip";
import { hiringHeroStripPrimaryBtn, hiringHeroSecondaryBtnSm } from "../hiringTokens";

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

  const subtitle = newUserEmpty
    ? "Build your first assessment when you're ready — or start with a job and candidates."
    : "Assessment operations center — create, share, and track candidate progress end to end.";

  return (
    <HiringHeroStrip
      aria-label="Assessments overview"
      title="Assessments"
      subtitle={subtitle}
      collapsedMeta={subtitle}
      heroCollapseStorageKey="assessments"
      action={
        !newUserEmpty ? (
          <>
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
            <Button ref={createButtonRef} type="button" onClick={onCreate} className={hiringHeroStripPrimaryBtn}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Create Assessment
            </Button>
          </>
        ) : undefined
      }
    >
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
    </HiringHeroStrip>
  );
}
