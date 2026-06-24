"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MCQOption } from "../../types";

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export function MCQAnswerTypeToggle({
  answerType,
  onChange,
}: {
  answerType: "single" | "multiple";
  onChange: (type: "single" | "multiple") => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex rounded-[10px] border border-[rgba(15,23,42,0.08)] p-0.5">
        <button
          type="button"
          onClick={() => onChange("single")}
          className={cn(
            "rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-colors",
            answerType === "single"
              ? "bg-accent text-white"
              : "text-muted hover:text-text",
          )}
        >
          Single correct
        </button>
        <button
          type="button"
          onClick={() => onChange("multiple")}
          className={cn(
            "rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-colors",
            answerType === "multiple"
              ? "bg-accent text-white"
              : "text-muted hover:text-text",
          )}
        >
          Multiple correct
        </button>
      </div>
    </div>
  );
}

export function MCQOptionsEditor({
  options,
  answerType,
  onChange,
}: {
  options: MCQOption[];
  answerType: "single" | "multiple";
  onChange: (options: MCQOption[]) => void;
}) {
  const toggleCorrect = (id: string) => {
    if (answerType === "single") {
      onChange(options.map((o) => ({ ...o, isCorrect: o.id === id })));
    } else {
      onChange(options.map((o) => (o.id === id ? { ...o, isCorrect: !o.isCorrect } : o)));
    }
  };

  const updateLabel = (id: string, label: string) => {
    onChange(options.map((o) => (o.id === id ? { ...o, label } : o)));
  };

  const addOption = () => {
    const next = optionLabel(options.length).toLowerCase();
    onChange([...options, { id: next, label: "", isCorrect: false }]);
  };

  const deleteOption = (id: string) => {
    if (options.length <= 2) return;
    const filtered = options.filter((o) => o.id !== id);
    const relabeled = filtered.map((o, i) => ({
      ...o,
      id: optionLabel(i).toLowerCase(),
    }));
    onChange(relabeled);
  };

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div
          key={`${opt.id}-${i}`}
          className={cn(
            "flex items-center gap-3 rounded-[12px] border px-3 py-2.5 transition-colors",
            opt.isCorrect
              ? "border-emerald-400/60 bg-emerald-50/50 ring-1 ring-emerald-400/20 dark:bg-emerald-950/25"
              : "border-[rgba(15,23,42,0.08)] hover:border-[rgba(124,58,237,0.2)] hover:bg-[rgba(124,58,237,0.03)]",
          )}
        >
          {/* Correct indicator */}
          <button
            type="button"
            onClick={() => toggleCorrect(opt.id)}
            className="shrink-0"
            aria-label={`Mark option ${optionLabel(i)} as ${opt.isCorrect ? "incorrect" : "correct"}`}
          >
            {answerType === "single" ? (
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                  opt.isCorrect
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-[rgba(15,23,42,0.2)]",
                )}
              >
                {opt.isCorrect && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
            ) : (
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-[4px] border-2 transition-colors",
                  opt.isCorrect
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-[rgba(15,23,42,0.2)]",
                )}
              >
                {opt.isCorrect && (
                  <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            )}
          </button>

          {/* Label badge */}
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
              opt.isCorrect
                ? "bg-emerald-500 text-white"
                : "bg-[rgba(15,23,42,0.06)] text-muted",
            )}
          >
            {optionLabel(i)}
          </span>

          {/* Text input */}
          <input
            type="text"
            value={opt.label}
            onChange={(e) => updateLabel(opt.id, e.target.value)}
            placeholder={`Option ${optionLabel(i)}`}
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted/70"
          />

          {/* Delete */}
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => deleteOption(opt.id)}
              className="shrink-0 rounded-[6px] p-1 text-muted/50 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label={`Delete option ${optionLabel(i)}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}

      {/* Add option */}
      <button
        type="button"
        onClick={addOption}
        className="flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-accent/30 py-2.5 text-[12px] font-medium text-accent transition-colors hover:border-accent/50 hover:bg-accent/[0.03]"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Option
      </button>

      <p className="text-[11px] text-muted">
        {answerType === "single"
          ? "Select one correct answer"
          : "Select one or more correct answers"}
      </p>
    </div>
  );
}
