"use client";

import { cn } from "@/lib/utils";
import type { EditorStep } from "../editor/editorConfig";

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: EditorStep[];
  current: number;
  onStepClick?: (index: number) => void;
}) {
  return (
    <nav
      className="flex h-16 shrink-0 items-center gap-1 overflow-x-auto border-b border-[rgba(15,23,42,0.06)] bg-white/90 px-4 dark:border-white/[0.06] dark:bg-white/[0.02]"
      aria-label="Editor steps"
    >
      {steps.map((step, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepClick?.(i)}
            disabled={!onStepClick}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-[10px] px-3 py-2 text-left transition-all",
              active && "bg-[rgba(124,58,237,0.08)]",
              onStepClick && !active && "hover:bg-[rgba(15,23,42,0.03)]",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-transform",
                active && "scale-110 bg-accent text-white",
                done && !active && "bg-accent/20 text-accent",
                !active && !done && "bg-[rgba(15,23,42,0.06)] text-muted",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-[12px] font-medium",
                active ? "text-text" : "text-text-secondary/70",
              )}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
