"use client";

import { HiringHeroStrip } from "./HiringHeroStrip";

/** @deprecated Prefer `HiringHeroStrip` — alias kept for existing imports */
export function HiringPageHero({
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
  return (
    <HiringHeroStrip
      title={title}
      subtitle={subtitle}
      meta={meta}
      collapsedMeta={collapsedMeta}
      action={action}
      className={className}
      aria-label={ariaLabel}
      heroCollapseStorageKey={heroCollapseStorageKey}
      defaultHeroCollapsed={defaultHeroCollapsed}
    >
      {children}
    </HiringHeroStrip>
  );
}
