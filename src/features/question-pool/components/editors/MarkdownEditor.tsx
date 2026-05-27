"use client";

import { cn } from "@/lib/utils";

export function MarkdownEditor({
  value,
  onChange,
  label = "Question description",
  placeholder = "Write the prompt in markdown…",
  minHeight = "min-h-[160px]",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-medium text-text">{label}</label>
      <div className="overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] dark:border-white/[0.08]">
        <div className="flex gap-0.5 border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] px-2 py-1.5 dark:border-white/[0.06]">
          {["B", "I", "`", "Link"].map((t) => (
            <span
              key={t}
              className="rounded-[6px] px-1.5 py-0.5 text-[10px] font-medium text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full resize-y bg-white/90 px-3 py-3 font-mono text-[13px] leading-relaxed text-text outline-none",
            "placeholder:text-muted/70 dark:bg-white/[0.03]",
            minHeight,
          )}
        />
      </div>
    </div>
  );
}
