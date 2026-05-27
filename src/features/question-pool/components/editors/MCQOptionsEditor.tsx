"use client";

import { cn } from "@/lib/utils";
import type { MCQOption } from "../../types";

export function MCQOptionsEditor({
  options,
  onChange,
}: {
  options: MCQOption[];
  onChange: (options: MCQOption[]) => void;
}) {
  const setCorrect = (id: string) => {
    onChange(options.map((o) => ({ ...o, isCorrect: o.id === id })));
  };

  const updateLabel = (id: string, label: string) => {
    onChange(options.map((o) => (o.id === id ? { ...o, label } : o)));
  };

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setCorrect(opt.id)}
          className={cn(
            "flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left transition-colors",
            opt.isCorrect
              ? "border-emerald-400/60 bg-emerald-50/50 ring-1 ring-emerald-400/20 dark:bg-emerald-950/25"
              : "border-[rgba(15,23,42,0.08)] hover:border-[rgba(124,58,237,0.2)] hover:bg-[rgba(124,58,237,0.03)]",
          )}
        >
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
              opt.isCorrect ? "bg-emerald-500 text-white" : "bg-[rgba(15,23,42,0.06)] text-muted",
            )}
          >
            {String.fromCharCode(65 + i)}
          </span>
          <input
            type="text"
            value={opt.label}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateLabel(opt.id, e.target.value)}
            placeholder={`Option ${String.fromCharCode(65 + i)}`}
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted/70"
          />
        </button>
      ))}
      <p className="text-[11px] text-muted">Click an option to mark it correct</p>
    </div>
  );
}
