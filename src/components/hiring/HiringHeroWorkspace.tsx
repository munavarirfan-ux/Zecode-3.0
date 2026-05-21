"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HiringHeroDecor } from "./HiringHeroDecor";
import { HeroCollapseActions } from "./HeroCollapseActions";
import { HeroCollapseProvider } from "./HeroCollapseContext";
import { HeroCollapseToggleButton } from "./HeroCollapseToggleButton";
import { HeroMetricsLinkProvider } from "./HeroMetricsLinkContext";
import { usePageHeroCollapsed } from "./usePageHeroCollapsed";
import {
  hiringHeroBackLink,
  hiringHeroCollapseTransition,
  hiringHeroCollapsedActions,
  hiringHeroCollapsedBackBtn,
  hiringHeroCollapsedMeta,
  hiringHeroCollapsedRow,
  hiringHeroCollapsedShell,
  hiringHeroCollapsedTitle,
  hiringHeroStripActions,
  hiringHeroStripBody,
  hiringHeroStripMetaLine,
  hiringHeroStripRow,
  hiringHeroStripShell,
  hiringHeroStripTitle,
  hiringHeroStripWorkspaceBody,
} from "./hiringTokens";

/**
 * Workspace/detail hero — gradient card with optional collapse to a ~36px strip.
 * Chevron expands/collapses the hero and KPI metrics together.
 */
export function HiringHeroWorkspace({
  "aria-label": ariaLabel,
  backHref,
  backLabel,
  title,
  subtitle,
  meta,
  collapsedMeta,
  actions,
  metrics,
  metricsStorageKey: _metricsStorageKey,
  heroCollapseStorageKey,
  defaultHeroCollapsed,
  className,
  decorExtra,
}: {
  "aria-label": string;
  backHref?: string;
  backLabel?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  collapsedMeta?: string[];
  actions?: React.ReactNode;
  metrics?: React.ReactNode;
  /** @deprecated Metrics follow hero chevron when `heroCollapseStorageKey` is set */
  metricsStorageKey?: string;
  heroCollapseStorageKey?: string;
  defaultHeroCollapsed?: boolean;
  className?: string;
  decorExtra?: React.ReactNode;
}) {
  const collapsible = Boolean(heroCollapseStorageKey);
  const pageHero = usePageHeroCollapsed(
    heroCollapseStorageKey ?? "workspace",
    defaultHeroCollapsed ?? false,
  );
  const heroCollapsed = collapsible && pageHero.collapsed && pageHero.hydrated;
  const linkMetrics = collapsible && Boolean(metrics);

  const metaLine =
    collapsedMeta?.filter(Boolean).join(" · ") ??
    (typeof subtitle === "string" ? subtitle : undefined);

  const shellClass = heroCollapsed ? hiringHeroCollapsedShell : hiringHeroStripShell;

  const actionSlot = actions ? (
    <HeroCollapseActions>
      {actions}
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
            aria-label={ariaLabel}
          >
            <HiringHeroDecor />
            {decorExtra}

            {heroCollapsed ? (
              <div className={cn(hiringHeroCollapsedRow, "relative")}>
                {backHref ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={hiringHeroCollapsedBackBtn}
                    asChild
                  >
                    <Link href={backHref} aria-label="Back">
                      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                    </Link>
                  </Button>
                ) : null}

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
              <div className={metrics ? hiringHeroStripWorkspaceBody : hiringHeroStripBody}>
                {backHref && backLabel ? (
                  <Link href={backHref} className={hiringHeroBackLink}>
                    {backLabel}
                  </Link>
                ) : null}

                <div className={hiringHeroStripRow}>
                  <header className="min-w-0 space-y-2">
                    <h1 className={hiringHeroStripTitle}>{title}</h1>
                    {subtitle ? (
                      typeof subtitle === "string" ? (
                        <p className={hiringHeroStripMetaLine}>{subtitle}</p>
                      ) : (
                        subtitle
                      )
                    ) : null}
                    {meta}
                  </header>
                  {actionSlot ? (
                    <div className={hiringHeroStripActions}>{actionSlot}</div>
                  ) : null}
                </div>

                {metrics}
              </div>
            )}
          </section>
        </HeroCollapseProvider>
      </HeroMetricsLinkProvider>
    </TooltipProvider>
  );
}
