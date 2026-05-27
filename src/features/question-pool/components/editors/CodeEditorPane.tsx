"use client";

import { cn } from "@/lib/utils";

export function CodeEditorPane({
  value,
  onChange,
  label,
  language = "javascript",
  minHeight = "min-h-[200px]",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  language?: string;
  minHeight?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-medium text-text">{label}</label>
        <span className="rounded-[6px] bg-[rgba(15,23,42,0.05)] px-1.5 py-0.5 font-mono text-[10px] text-muted">
          {language}
        </span>
      </div>
      <div className="overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] dark:border-white/[0.08]">
        <div className="border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] px-3 py-1.5 text-[10px] text-muted dark:bg-white/[0.03]">
          Editor
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className={cn(
            "w-full resize-y bg-[#fafafb] px-3 py-3 font-mono text-[12px] leading-relaxed text-text outline-none",
            "dark:bg-[#141416]",
            minHeight,
          )}
        />
      </div>
    </div>
  );
}
