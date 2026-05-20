"use client";

import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ValidityDaysStepper({
  value,
  onChange,
  min = 1,
  max = 90,
}: {
  value: number;
  onChange: (days: number) => void;
  min?: number;
  max?: number;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className="space-y-1.5">
      <div className="inline-flex items-center gap-2 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-[#FAFAFB] p-1 dark:bg-white/[0.02]">
        <button
          type="button"
          aria-label="Decrease validity days"
          disabled={value <= min}
          onClick={() => onChange(clamp(value - 1))}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[8px] text-text-secondary transition-colors",
            "hover:bg-white disabled:opacity-40 dark:hover:bg-surface",
          )}
        >
          <Minus className="h-4 w-4" strokeWidth={2} />
        </button>
        <div className="flex min-w-[120px] items-center gap-1.5 px-1">
          <Input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n)) onChange(clamp(n));
            }}
            className="h-9 w-14 border-0 bg-transparent p-0 text-center text-[15px] font-semibold tabular-nums shadow-none focus-visible:ring-0"
            aria-label="Validity days"
          />
          <span className="text-[13px] font-medium text-muted">days</span>
        </div>
        <button
          type="button"
          aria-label="Increase validity days"
          disabled={value >= max}
          onClick={() => onChange(clamp(value + 1))}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[8px] text-text-secondary transition-colors",
            "hover:bg-white disabled:opacity-40 dark:hover:bg-surface",
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <p className="text-[11px] leading-relaxed text-muted">
        Candidate link will stay active for selected number of days.
      </p>
    </div>
  );
}
