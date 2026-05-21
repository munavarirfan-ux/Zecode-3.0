"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hiringHeroCollapseToggleBtn } from "./hiringTokens";

export function HeroCollapseToggleButton({
  collapsed,
  onToggle,
  className,
}: {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(hiringHeroCollapseToggleBtn, className)}
      onClick={onToggle}
      aria-expanded={!collapsed}
      aria-label={
        collapsed ? "Expand page header and metrics" : "Collapse page header and metrics"
      }
    >
      {collapsed ? (
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      ) : (
        <ChevronUp className="h-4 w-4" strokeWidth={2} aria-hidden />
      )}
    </Button>
  );
}
