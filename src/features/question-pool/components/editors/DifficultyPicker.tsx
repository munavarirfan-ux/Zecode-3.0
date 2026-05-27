"use client";

import { cn } from "@/lib/utils";
import { DIFFICULTY_LABELS } from "../../tokens";
import type { Difficulty } from "../../types";

const LEVELS: Difficulty[] = ["easy", "medium", "hard"];

const ACTIVE: Record<Difficulty, string> = {
  easy: "border-emerald-400/50 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  medium: "border-amber-400/50 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  hard: "border-red-400/50 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300",
};

export function DifficultyPicker({
  value,
  onChange,
}: {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={cn(
            "rounded-[10px] border px-3 py-1.5 text-[12px] font-medium transition-colors",
            value === level
              ? ACTIVE[level]
              : "border-[rgba(15,23,42,0.08)] text-text-secondary/80 hover:bg-[rgba(15,23,42,0.03)]",
          )}
        >
          {DIFFICULTY_LABELS[level]}
        </button>
      ))}
    </div>
  );
}
