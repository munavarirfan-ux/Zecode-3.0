"use client";

import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { radixContent, radixSurface } from "@/lib/radix-motion";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import { CURATORS } from "../mockData";
import { countPoolAdvancedFilters } from "../lib/selectors";
import { usePoolStore } from "../store/poolStore";
import { DIFFICULTY_LABELS } from "../tokens";
import type { Difficulty, PoolFilters } from "../types";

function PopoverSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const resolved = value || "__all__";

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-text-secondary/80">{label}</label>
      <Select.Root
        value={resolved}
        onValueChange={(v) => {
          const next = v === "__all__" ? "" : v;
          if (next === value) return;
          onChange(next);
        }}
      >
        <Select.Trigger
          className={cn(
            "inline-flex h-9 w-full items-center justify-between gap-2 rounded-[10px] border border-[rgba(15,23,42,0.08)]",
            "bg-white/90 px-2.5 text-[12px] font-medium text-text outline-none",
            "hover:border-[rgba(15,23,42,0.12)] focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]",
            hiringTransition,
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="z-[150] overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-surface shadow-[var(--qp-shadow)]"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-1">
              <Select.Item
                value="__all__"
                className="cursor-pointer rounded-[8px] px-2 py-1.5 text-[12px] outline-none data-[highlighted]:bg-[rgba(124,58,237,0.08)]"
              >
                <Select.ItemText>{placeholder}</Select.ItemText>
              </Select.Item>
              {options.map((o) => (
                <Select.Item
                  key={o.value}
                  value={o.value}
                  className="cursor-pointer rounded-[8px] px-2 py-1.5 text-[12px] outline-none data-[highlighted]:bg-[rgba(124,58,237,0.08)]"
                >
                  <Select.ItemText>{o.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export function QuestionPoolFiltersPopover({ skills }: { skills: string[] }) {
  const filters = usePoolStore((s) => s.filters);
  const setFilters = usePoolStore((s) => s.setFilters);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Pick<PoolFilters, "difficulty" | "skill" | "curatorId">>({
    difficulty: filters.difficulty,
    skill: filters.skill,
    curatorId: filters.curatorId,
  });

  const activeCount = countPoolAdvancedFilters(filters);

  useEffect(() => {
    if (open) {
      setDraft({
        difficulty: filters.difficulty,
        skill: filters.skill,
        curatorId: filters.curatorId,
      });
    }
  }, [open, filters.difficulty, filters.skill, filters.curatorId]);

  const apply = () => {
    setFilters(draft);
    setOpen(false);
  };

  const clearAdvanced = () => {
    const cleared = { difficulty: "all" as const, skill: "", curatorId: "" };
    setDraft(cleared);
    setFilters(cleared);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Filter questions"
          aria-expanded={open}
          className={cn(
            "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border",
            "border-[rgba(15,23,42,0.08)] bg-white/90 text-text-secondary/80 shadow-none outline-none",
            "hover:border-[rgba(15,23,42,0.12)] hover:bg-[rgba(124,58,237,0.04)] hover:text-text",
            "focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]",
            hiringTransition,
            activeCount > 0 && "border-accent/30 bg-[rgba(124,58,237,0.08)] text-accent",
          )}
        >
          <Filter className="h-4 w-4" strokeWidth={1.75} />
          {activeCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold tabular-nums text-white">
              {activeCount}
            </span>
          ) : null}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-[140] w-[min(100vw-2rem,18rem)] overflow-hidden p-0 outline-none",
            radixSurface,
            radixContent,
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="border-b border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
            <p className="text-sm font-semibold tracking-tight text-text">Filters</p>
            <p className="mt-0.5 text-[11px] text-text-secondary/75">Difficulty, skill, and curator</p>
          </div>
          <div className="grid gap-3 p-4">
            <PopoverSelect
              label="Difficulty"
              value={draft.difficulty === "all" ? "" : draft.difficulty}
              placeholder="All difficulties"
              onChange={(v) =>
                setDraft((d) => ({ ...d, difficulty: (v || "all") as Difficulty | "all" }))
              }
              options={(["easy", "medium", "hard"] as Difficulty[]).map((d) => ({
                value: d,
                label: DIFFICULTY_LABELS[d],
              }))}
            />
            <PopoverSelect
              label="Skill"
              value={draft.skill}
              placeholder="All skills"
              onChange={(v) => setDraft((d) => ({ ...d, skill: v }))}
              options={skills.map((s) => ({ value: s, label: s }))}
            />
            <PopoverSelect
              label="Curator"
              value={draft.curatorId}
              placeholder="All curators"
              onChange={(v) => setDraft((d) => ({ ...d, curatorId: v }))}
              options={CURATORS.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <div className="flex gap-2 border-t border-[rgba(15,23,42,0.06)] p-3 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={clearAdvanced}
              className="h-9 flex-1 rounded-[10px] border border-[rgba(15,23,42,0.08)] text-[12px] font-medium text-text-secondary/85 hover:bg-[rgba(15,23,42,0.03)]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={apply}
              className="h-9 flex-1 rounded-[10px] bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover"
            >
              Apply
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
