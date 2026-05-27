"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { getFilterOptions, hasActiveFilters } from "../lib/selectors";
import { usePoolStore } from "../store/poolStore";
import { STATUS_LABELS } from "../tokens";
import type { QuestionStatus } from "../types";
import { QuestionPoolFiltersPopover } from "./QuestionPoolFiltersPopover";

const STATUS_CHIPS: { id: QuestionStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "published", label: STATUS_LABELS.published },
  { id: "draft", label: STATUS_LABELS.draft },
  { id: "archived", label: STATUS_LABELS.archived },
];

export function FilterBar({ searchInputRef }: { searchInputRef?: React.RefObject<HTMLInputElement> }) {
  const questions = usePoolStore((s) => s.questions);
  const filters = usePoolStore((s) => s.filters);
  const setFilters = usePoolStore((s) => s.setFilters);
  const clearFilters = usePoolStore((s) => s.clearFilters);
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = searchInputRef ?? internalRef;

  const { skills } = useMemo(() => getFilterOptions(questions), [questions]);
  const showClear = hasActiveFilters(filters);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputRef]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="search"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Search questions, tags, skills…"
          className={cn(
            "h-9 w-full rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white/90 pl-9 pr-16 text-[13px]",
            "placeholder:text-muted/80 outline-none focus-visible:ring-2 focus-visible:ring-accent/20",
            "dark:border-white/[0.08] dark:bg-white/[0.04]",
          )}
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-[6px] border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)] px-1.5 py-0.5 text-[10px] font-medium text-muted sm:inline">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Status">
          {STATUS_CHIPS.map((chip) => {
            const active = filters.status === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilters({ status: chip.id })}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "bg-accent text-white shadow-[0_2px_8px_rgb(var(--accent-rgb)/0.25)]"
                    : "border border-[rgba(15,23,42,0.06)] bg-white/80 text-text-secondary/80 hover:bg-[rgba(124,58,237,0.06)] dark:border-white/[0.08] dark:bg-white/[0.04]",
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <QuestionPoolFiltersPopover skills={skills} />

        {showClear ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-9 items-center gap-1 rounded-[10px] px-2 text-[11px] font-medium text-accent hover:bg-[rgba(124,58,237,0.08)]"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
}
