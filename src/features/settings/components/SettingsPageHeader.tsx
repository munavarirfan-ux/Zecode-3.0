"use client";

import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HiringHeroDecor } from "@/components/hiring/HiringHeroDecor";
import { HeroCollapseActions } from "@/components/hiring/HeroCollapseActions";
import { HeroCollapseProvider } from "@/components/hiring/HeroCollapseContext";
import {
  hiringHeroStripActions,
  hiringHeroStripBody,
  hiringHeroStripHeader,
  hiringHeroStripRow,
  hiringHeroStripShell,
  hiringHeroStripSubtitle,
  hiringHeroStripTitle,
} from "@/components/hiring/hiringTokens";
import { SettingsScopePill } from "./SettingsScopePill";
import type { SettingsScope } from "../settingsTypes";

export function SettingsPageHeader({
  scope,
  scopeLabel,
  title,
  description,
  action,
}: {
  scope: SettingsScope;
  scopeLabel: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const actionSlot = (
    <div className={hiringHeroStripActions}>
      <HeroCollapseActions>
        <SettingsScopePill label={scopeLabel} scope={scope} variant="hero" />
        {action}
      </HeroCollapseActions>
    </div>
  );

  return (
    <TooltipProvider delayDuration={280}>
      <HeroCollapseProvider collapsed={false}>
        <section className={hiringHeroStripShell} aria-label={title}>
          <HiringHeroDecor />
          <div className={hiringHeroStripBody}>
            <div className={hiringHeroStripRow}>
              <div className={hiringHeroStripHeader}>
                <h1 className={hiringHeroStripTitle}>{title}</h1>
                {description ? (
                  <p className={hiringHeroStripSubtitle}>{description}</p>
                ) : null}
              </div>
              {actionSlot}
            </div>
          </div>
        </section>
      </HeroCollapseProvider>
    </TooltipProvider>
  );
}
