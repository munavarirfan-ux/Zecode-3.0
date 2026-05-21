"use client";

import { cn } from "@/lib/utils";
import {
  hiringHeroStripActions,
  hiringHeroStripHeader,
  hiringHeroStripRow,
  hiringHeroStripSubtitle,
  hiringHeroStripTitle,
} from "./hiringTokens";

export function HiringHeroStripRow({
  title,
  subtitle,
  meta,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(hiringHeroStripRow, className)}>
      <header className={hiringHeroStripHeader}>
        <h1 className={hiringHeroStripTitle}>{title}</h1>
        {subtitle ? <p className={hiringHeroStripSubtitle}>{subtitle}</p> : null}
        {meta ? <p className="mt-1 text-[11px] text-white/55">{meta}</p> : null}
      </header>
      {actions ? <div className={hiringHeroStripActions}>{actions}</div> : null}
    </div>
  );
}
