"use client";

import { BarChart3, FileEdit, Layers, Plus, Sparkles } from "lucide-react";
import { HeroActionButton } from "@/components/hiring/HeroActionButton";
import { HeroMetricsCollapsible } from "@/components/hiring/HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "@/components/hiring/HiringHeroGlassKpiCard";
import { HiringHeroStrip } from "@/components/hiring/HiringHeroStrip";
import { POOL_STATS } from "../mockData";

export const QUESTION_POOL_HERO_METRICS_COLLAPSED_KEY = "question-pool-hero-metrics-collapsed";

const KPIS = [
  {
    value: POOL_STATS.total,
    label: "Total Questions",
    subtitle: "Across all types",
    icon: Layers,
  },
  {
    value: POOL_STATS.published,
    label: "Published",
    subtitle: "Live in assessments",
    icon: Sparkles,
  },
  {
    value: POOL_STATS.drafts,
    label: "Drafts",
    subtitle: "Awaiting review",
    icon: FileEdit,
  },
  {
    value: POOL_STATS.mostUsedCount,
    label: "Most Used Type",
    subtitle: `${POOL_STATS.mostUsedType} · last 90 days`,
    icon: BarChart3,
  },
] as const;

export function QuestionPoolHero({ onCreate }: { onCreate: () => void }) {
  const subtitle =
    "Create, organize, and reuse technical questions across assessments.";

  return (
    <HiringHeroStrip
      aria-label="Question Pool"
      title="Question Pool"
      subtitle={subtitle}
      collapsedMeta="Curator library for assessments"
      heroCollapseStorageKey="question-pool"
      action={
        <HeroActionButton variant="primary" onClick={onCreate} tooltip="Create Question">
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Create Question
        </HeroActionButton>
      }
    >
      <HeroMetricsCollapsible
        id="question-pool-hero-metrics"
        withBorder={false}
        storageKey={QUESTION_POOL_HERO_METRICS_COLLAPSED_KEY}
        gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {KPIS.map((kpi) => (
          <li key={kpi.label}>
            <HiringHeroGlassKpiCard {...kpi} />
          </li>
        ))}
      </HeroMetricsCollapsible>
    </HiringHeroStrip>
  );
}
