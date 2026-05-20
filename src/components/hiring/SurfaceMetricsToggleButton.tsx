"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hiringTransition } from "./hiringTokens";
import { useHeroMetricsCollapsed } from "./useHeroMetricsCollapsed";

/** Hide/show metrics on light cards — same frosted action shape, adapted for white surfaces. */
export function SurfaceMetricsToggleButton({
  storageKey,
  className,
}: {
  storageKey: string;
  className?: string;
}) {
  const { collapsed, toggle, hydrated } = useHeroMetricsCollapsed(storageKey);
  const hidden = collapsed && hydrated;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "h-9 gap-1.5 rounded-[11px] border-[rgba(15,23,42,0.08)] px-4 text-[13px] font-medium shadow-none",
        hiringTransition,
        "hover:border-[rgba(15,23,42,0.12)] hover:bg-[#F8FAFC] dark:border-white/[0.08] dark:hover:bg-white/[0.04]",
        className,
      )}
      onClick={toggle}
      aria-expanded={hydrated ? !collapsed : true}
    >
      {hidden ? <Eye className="h-3.5 w-3.5" strokeWidth={1.75} /> : <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />}
      {hidden ? "Show metrics" : "Hide metrics"}
    </Button>
  );
}
