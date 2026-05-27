"use client";

import { ArrowLeft } from "lucide-react";
import { HiringHeroWorkspace } from "@/components/hiring/HiringHeroWorkspace";
import { hiringHeroStripMetaChips } from "@/components/hiring/hiringTokens";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { DIFFICULTY_LABELS } from "../tokens";
import type { Difficulty } from "../types";

const glassMeta =
  "inline-flex items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/78 backdrop-blur-md";

export function QuestionPoolEditorHero({
  title,
  typeLabel,
  difficulty,
  stepLabel,
  dirty,
}: {
  title: string;
  typeLabel: string;
  difficulty: Difficulty;
  stepLabel?: string;
  dirty?: boolean;
}) {
  return (
    <HiringHeroWorkspace
      aria-label="Question editor"
      heroCollapseStorageKey="question-pool-editor"
      defaultHeroCollapsed={false}
      collapsedMeta={[typeLabel, stepLabel].filter(Boolean) as string[]}
      backHref={ROUTES.questionPool}
      backLabel={
        <>
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          Question Pool
        </>
      }
      title={title}
      subtitle="Build, preview, and publish reusable assessment content."
      meta={
        <div className={hiringHeroStripMetaChips}>
          <span className={glassMeta}>{typeLabel}</span>
          <span className={glassMeta}>{DIFFICULTY_LABELS[difficulty]}</span>
          {stepLabel ? <span className={cn(glassMeta, "text-white/88")}>{stepLabel}</span> : null}
          {dirty ? <span className={glassMeta}>Unsaved changes</span> : null}
        </div>
      }
    />
  );
}
