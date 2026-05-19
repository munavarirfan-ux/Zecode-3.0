"use client";

import { cn } from "@/lib/utils";
import {
  RECOMMENDATION_OPTIONS,
  type HireRecommendation,
} from "@/lib/hiring/interviewFeedback";

export function RecommendationSegmented({
  value,
  onChange,
  disabled,
}: {
  value: HireRecommendation | null;
  onChange: (value: HireRecommendation) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Hiring recommendation"
      className="flex flex-wrap gap-1"
    >
      {RECOMMENDATION_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-[11px] font-medium leading-tight transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.2)]",
              selected
                ? "bg-[rgb(var(--accent-rgb)/0.1)] text-[rgb(var(--accent-rgb))] ring-1 ring-[rgb(var(--accent-rgb)/0.18)]"
                : "text-[#A1A1AA] hover:bg-[rgba(15,23,42,0.04)] hover:text-[#71717A]",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            {opt.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
