"use client";

import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HiringHeroDecor } from "./HiringHeroDecor";
import { HiringHeroStripRow } from "./HiringHeroStripRow";
import { HeroCollapseActions } from "./HeroCollapseActions";
import { HeroCollapseProvider } from "./HeroCollapseContext";
import { HeroCollapseToggleButton } from "./HeroCollapseToggleButton";
import { HeroMetricsLinkProvider } from "./HeroMetricsLinkContext";
import { usePageHeroCollapsed } from "./usePageHeroCollapsed";
import {
  hiringHeroCollapseTransition,
  hiringHeroCollapsedActions,
  hiringHeroCollapsedMeta,
  hiringHeroCollapsedRow,
  hiringHeroCollapsedShell,
  hiringHeroCollapsedTitle,
  hiringHeroStripBody,
  hiringHeroStripShell,
} from "./hiringTokens";

/**
 * Compact gradient header strip. Chevron expands/collapses hero + KPI metrics together.
 */
export function HiringHeroStrip({
  title,
  subtitle,
  meta,
  collapsedMeta,
  action,
  children,
  className,
  "aria-label": ariaLabel,
  heroCollapseStorageKey,
  defaultHeroCollapsed,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  collapsedMeta?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  heroCollapseStorageKey?: string;
  defaultHeroCollapsed?: boolean;
}) {
  const collapsible = Boolean(heroCollapseStorageKey);
  const pageHero = usePageHeroCollapsed(
    heroCollapseStorageKey ?? "strip",
    defaultHeroCollapsed ?? false,
  );
  const heroCollapsed = collapsible && pageHero.collapsed && pageHero.hydrated;
  const linkMetrics = collapsible && Boolean(children);
  const shellClass = heroCollapsed ? hiringHeroCollapsedShell : hiringHeroStripShell;
  const metaLine = collapsedMeta ?? subtitle;

  const actionSlot = action ? (
    <HeroCollapseActions>
      {action}
      {collapsible ? (
        <HeroCollapseToggleButton
          collapsed={pageHero.collapsed}
          onToggle={pageHero.toggle}
        />
      ) : null}
    </HeroCollapseActions>
  ) : collapsible ? (
    <HeroCollapseToggleButton collapsed={pageHero.collapsed} onToggle={pageHero.toggle} />
  ) : null;

  return (
    <TooltipProvider delayDuration={280}>
      <HeroMetricsLinkProvider
        enabled={linkMetrics}
        heroCollapsed={pageHero.collapsed}
        hydrated={pageHero.hydrated}
      >
        <HeroCollapseProvider collapsed={heroCollapsed}>
          <section
            className={cn(shellClass, hiringHeroCollapseTransition, className)}
            aria-label={ariaLabel ?? title}
          >
            <HiringHeroDecor />

            {heroCollapsed ? (
              <div className={cn(hiringHeroCollapsedRow, "relative")}>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <h1 className={hiringHeroCollapsedTitle}>{title}</h1>
                  {metaLine ? (
                    <span className={hiringHeroCollapsedMeta}>· {metaLine}</span>
                  ) : null}
                </div>
                {actionSlot ? (
                  <div className={hiringHeroCollapsedActions}>{actionSlot}</div>
                ) : null}
              </div>
            ) : (
              <div className={hiringHeroStripBody}>
                <HiringHeroStripRow
                  title={title}
                  subtitle={subtitle}
                  meta={meta}
                  actions={actionSlot}
                />
                {children}
              </div>
            )}
          </section>
        </HeroCollapseProvider>
      </HeroMetricsLinkProvider>
    </TooltipProvider>
  );
}
