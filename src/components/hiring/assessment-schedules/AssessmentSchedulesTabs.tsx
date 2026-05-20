"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ASSESSMENT_SCHEDULE_TABS,
  type AssessmentScheduleTab,
} from "@/lib/hiring/assessments/scheduleTypes";
import { hiringTransition } from "../hiringTokens";

export function AssessmentSchedulesTabs({
  tab,
  onTabChange,
  tabCounts,
  className,
}: {
  tab: AssessmentScheduleTab;
  onTabChange: (tab: AssessmentScheduleTab) => void;
  tabCounts: Record<AssessmentScheduleTab, number>;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${tab}"]`);
    const parent = listRef.current;
    if (!el || !parent) return;
    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setPill({ left: rect.left - parentRect.left, width: rect.width });
  }, [tab]);

  return (
    <div
      className={cn(
        "sticky top-0 z-20 -mx-px rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white/95 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-md",
        "dark:border-white/[0.06] dark:bg-surface/95",
        className,
      )}
    >
      <div ref={listRef} className="relative flex items-center gap-0.5 overflow-x-auto px-1 py-1 scrollbar-none">
        <span
          className={cn(
            "pointer-events-none absolute bottom-1 top-1 rounded-[10px] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.14),rgba(var(--hero-gradient-to-rgb),0.12))]",
            "border border-[rgba(var(--accent-rgb),0.12)] shadow-[0_1px_3px_rgba(var(--accent-rgb),0.08)]",
            hiringTransition,
          )}
          style={{ left: pill.left, width: pill.width }}
          aria-hidden
        />
        {ASSESSMENT_SCHEDULE_TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              data-tab={t.id}
              onClick={() => onTabChange(t.id)}
              className={cn(
                "relative z-[1] shrink-0 rounded-[10px] px-4 py-2 text-[13px] font-medium",
                hiringTransition,
                active ? "text-[rgb(var(--accent-rgb))]" : "text-text-secondary/80 hover:text-text",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "ml-1.5 tabular-nums text-[11px]",
                  active ? "font-semibold text-[rgb(var(--accent-rgb))]/80" : "text-muted/70",
                )}
              >
                {tabCounts[t.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
