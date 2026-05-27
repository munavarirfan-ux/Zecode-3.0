"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { getTypeCounts } from "../mockData";
import { QUESTION_TYPE_ACCENT, QUESTION_TYPE_LABELS } from "../tokens";
import { usePoolStore } from "../store/poolStore";
import { QUESTION_TYPE_ORDER, type QuestionType } from "../types";

const TAB_ITEMS: { id: QuestionType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...QUESTION_TYPE_ORDER.map((id) => ({ id, label: QUESTION_TYPE_LABELS[id] })),
];

export function TypeTabs() {
  const questions = usePoolStore((s) => s.questions);
  const activeTypeTab = usePoolStore((s) => s.activeTypeTab);
  const setActiveTypeTab = usePoolStore((s) => s.setActiveTypeTab);
  const counts = getTypeCounts(questions);

  return (
    <Tabs.Root
      value={activeTypeTab}
      onValueChange={(v) => setActiveTypeTab(v as QuestionType | "all")}
    >
      <Tabs.List
        className="flex gap-1 overflow-x-auto border-b border-[rgba(15,23,42,0.06)] pb-px dark:border-white/[0.06]"
        aria-label="Question types"
      >
        {TAB_ITEMS.map((tab) => {
          const accent = tab.id === "all" ? "var(--brand-primary)" : QUESTION_TYPE_ACCENT[tab.id];
          const active = activeTypeTab === tab.id;
          return (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "group relative flex shrink-0 items-center gap-2 rounded-t-[10px] px-3 py-2.5 text-[12px] font-medium outline-none transition-colors",
                active ? "text-text" : "text-text-secondary/70 hover:text-text",
              )}
            >
              {tab.id !== "all" ? (
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                  aria-hidden
                />
              ) : null}
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                  active
                    ? "bg-[rgba(124,58,237,0.1)] font-semibold text-accent"
                    : "bg-[rgba(15,23,42,0.04)] text-muted dark:bg-white/[0.06]",
                )}
              >
                {counts[tab.id]}
              </span>
              <span
                className={cn(
                  "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
                style={{ backgroundColor: accent }}
                aria-hidden
              />
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
    </Tabs.Root>
  );
}
