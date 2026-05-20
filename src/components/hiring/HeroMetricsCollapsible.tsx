"use client";

import { cn } from "@/lib/utils";
import {
  HIRING_HERO_METRICS_COLLAPSED_KEY,
  useHeroMetricsCollapsed,
} from "./useHeroMetricsCollapsed";

export function HeroMetricsCollapsible({
  id,
  children,
  gridClassName,
  withBorder = true,
  storageKey = HIRING_HERO_METRICS_COLLAPSED_KEY,
}: {
  id: string;
  children: React.ReactNode;
  gridClassName?: string;
  withBorder?: boolean;
  storageKey?: string;
}) {
  const { collapsed, hydrated } = useHeroMetricsCollapsed(storageKey);
  const isCollapsed = collapsed && hydrated;

  return (
    <section
      className={cn(
        "flex flex-col",
        withBorder && "mt-6 border-t border-white/[0.1] pt-6",
      )}
      aria-label="Hero metrics"
    >
      <div
        id={id}
        className={cn(
          "grid min-h-0 transition-[grid-template-rows,margin] duration-200 ease-out",
          isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        )}
        aria-hidden={isCollapsed}
      >
        <div className="min-h-0 overflow-hidden">
          <ul
            className={cn(
              "grid gap-3 sm:gap-4",
              gridClassName,
              "transition-opacity duration-200 ease-out",
              isCollapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            {children}
          </ul>
        </div>
      </div>
    </section>
  );
}
