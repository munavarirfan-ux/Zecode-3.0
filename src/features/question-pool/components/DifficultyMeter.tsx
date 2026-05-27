"use client";

import { cn } from "@/lib/utils";
import { DIFFICULTY_LABELS } from "../tokens";
import type { Difficulty } from "../types";

const LEVELS: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function DifficultyMeter({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  const active = LEVELS[difficulty];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-end gap-0.5" aria-hidden>
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn(
              "w-1 rounded-full transition-colors",
              bar <= active ? "bg-accent h-3" : "h-2 bg-[rgba(15,23,42,0.08)] dark:bg-white/10",
            )}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium text-text-secondary/80">{DIFFICULTY_LABELS[difficulty]}</span>
    </div>
  );
}
