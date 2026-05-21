"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  hiringHeroCollapsedIconBtn,
  hiringHeroSecondaryBtnSm,
} from "./hiringTokens";
import { useHeroCollapseContext } from "./HeroCollapseContext";
import { HIRING_HERO_METRICS_COLLAPSED_KEY, useHeroMetricsCollapsed } from "./useHeroMetricsCollapsed";

/** Frosted hero action — hide/show KPI row (pairs with `HeroMetricsCollapsible` via `storageKey`). */
export function HeroMetricsToggleButton({
  storageKey = HIRING_HERO_METRICS_COLLAPSED_KEY,
  className,
}: {
  storageKey?: string;
  className?: string;
}) {
  const heroCollapsed = useHeroCollapseContext();
  const { collapsed, toggle, hydrated } = useHeroMetricsCollapsed(storageKey);
  const hidden = collapsed && hydrated;
  const label = hidden ? "Show metrics" : "Hide metrics";

  if (heroCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(hiringHeroCollapsedIconBtn, className)}
            onClick={toggle}
            aria-expanded={hydrated ? !collapsed : true}
            aria-label={label}
          >
            {hidden ? (
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
            ) : (
              <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    );
  }

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
      {label}
    </Button>
  );
}
