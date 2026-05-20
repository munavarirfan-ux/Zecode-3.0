"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { hiringHeroGlassKpi } from "./hiringTokens";

function Sparkline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 14" className={cn("h-2.5 w-9 shrink-0 text-white/40", className)} aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="0,11 6,9 12,10 18,6 24,7 30,4 40,5"
      />
    </svg>
  );
}

export function HiringHeroGlassKpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  padValue = false,
}: {
  label: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  /** @deprecated No longer changes layout — kept for API compatibility */
  compact?: boolean;
  padValue?: boolean;
}) {
  const displayValue = padValue ? String(value).padStart(2, "0") : value;

  return (
    <li className={hiringHeroGlassKpi}>
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-white/[0.06] blur-xl opacity-60 transition-opacity duration-[180ms] ease-out group-hover/kpi:opacity-100"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-1.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-white/[0.16] bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <Icon className="h-3.5 w-3.5 text-white/90" strokeWidth={1.5} aria-hidden />
        </div>
        <Sparkline />
      </div>
      <p className="relative mt-2 text-[1.875rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-white">
        {displayValue}
      </p>
      <p className="relative mt-1 text-[11px] font-semibold leading-tight tracking-[-0.01em] text-white/90">
        {label}
      </p>
      <p className="relative mt-0.5 line-clamp-1 text-[10px] leading-snug text-white/55">{subtitle}</p>
    </li>
  );
}
