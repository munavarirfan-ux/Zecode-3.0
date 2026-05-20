"use client";

import { cn } from "@/lib/utils";
import { hiringHeroRadialOverlay, hiringHeroShell } from "./hiringTokens";
import { HiringHeroTexture } from "./HiringHeroTexture";

export function HiringPageHero({
  title,
  subtitle,
  meta,
  action,
  children,
  className,
  "aria-label": ariaLabel,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <section className={cn(hiringHeroShell, className)} aria-label={ariaLabel ?? title}>
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden style={hiringHeroRadialOverlay} />

      <div className="relative space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <header className="min-w-0 space-y-2">
            <h1 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[2.125rem]">
              {title}
            </h1>
            {subtitle ? (
              <p className="max-w-2xl text-[13px] leading-relaxed text-white/[0.68] sm:text-sm">{subtitle}</p>
            ) : null}
            {meta ? <p className="text-[11px] text-white/55">{meta}</p> : null}
          </header>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
