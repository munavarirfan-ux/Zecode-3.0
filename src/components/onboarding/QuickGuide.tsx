"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickGuide({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] dark:bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left"
      >
        <span className="text-[12px] font-semibold text-text-secondary">{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
          strokeWidth={2}
        />
      </button>
      {open ? (
        <p className="border-t border-[rgba(15,23,42,0.05)] px-3.5 py-2.5 text-[12px] leading-relaxed text-muted">
          {body}
        </p>
      ) : null}
    </div>
  );
}
