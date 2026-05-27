"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function TagChips({
  tags,
  onChange,
  placeholder = "Type a tag and press Enter",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,23,42,0.08)] bg-[rgba(124,58,237,0.06)] px-2.5 py-1 text-[11px] font-medium text-text"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="rounded-full p-0.5 text-muted hover:bg-white/80 hover:text-text"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
          }
        }}
        onBlur={() => addTag(input)}
        placeholder={placeholder}
        className={cn(
          "h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 text-[13px]",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]",
        )}
      />
    </div>
  );
}
