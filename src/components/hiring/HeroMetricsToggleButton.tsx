"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hiringHeroSecondaryBtnSm } from "./hiringTokens";
import { HIRING_HERO_METRICS_COLLAPSED_KEY, useHeroMetricsCollapsed } from "./useHeroMetricsCollapsed";

/** Frosted hero action — hide/show KPI row (pairs with `HeroMetricsCollapsible` via `storageKey`). */
export function HeroMetricsToggleButton({
  storageKey = HIRING_HERO_METRICS_COLLAPSED_KEY,
  className,
}: {
  storageKey?: string;
  className?: string;
}) {
  const { collapsed, toggle, hydrated } = useHeroMetricsCollapsed(storageKey);
  const hidden = collapsed && hydrated;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(hiringHeroSecondaryBtnSm, className)}
      onClick={toggle}
      aria-expanded={hydrated ? !collapsed : true}
    >
      {hidden ? <Eye className="h-3.5 w-3.5" strokeWidth={1.75} /> : <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />}
      {hidden ? "Show metrics" : "Hide metrics"}
    </Button>
  );
}
