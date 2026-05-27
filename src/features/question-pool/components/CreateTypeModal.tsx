"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import {
  Bug,
  CircleHelp,
  Code2,
  Database,
  FileText,
  ListChecks,
  Type,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { radixOverlay } from "@/lib/radix-motion";
import { getTypeCounts } from "../mockData";
import { getSubtypeOptions, typeRequiresSubtype } from "../questionSubtypes";
import { QUESTION_TYPE_ACCENT, QUESTION_TYPE_LABELS } from "../tokens";
import { usePoolStore } from "../store/poolStore";
import type { QuestionSubtype, QuestionType } from "../types";

const TYPE_CARDS: {
  type: QuestionType;
  icon: typeof Code2;
  description: string;
}[] = [
  { type: "coding", icon: Code2, description: "Algorithmic challenges with test cases" },
  { type: "database", icon: Database, description: "SQL against curated schemas" },
  { type: "mcq", icon: ListChecks, description: "Multiple choice with single correct answer" },
  { type: "comprehension", icon: FileText, description: "Passage-based technical reading" },
  { type: "open-ended", icon: CircleHelp, description: "Free-form written responses" },
  { type: "fill-blank", icon: Type, description: "Structured blanks in code or prose" },
  { type: "debug", icon: Bug, description: "Find and fix buggy snippets" },
];

function SubtypePill({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all duration-[180ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        selected
          ? "border-accent/50 bg-[rgba(124,58,237,0.08)] text-accent shadow-[inset_0_0_12px_rgba(124,58,237,0.06)]"
          : "border-[rgba(15,23,42,0.08)] text-text-secondary/85 hover:border-[rgba(124,58,237,0.22)] hover:bg-[rgba(124,58,237,0.04)]",
      )}
    >
      {label}
    </button>
  );
}

export function CreateTypeModal() {
  const router = useRouter();
  const open = usePoolStore((s) => s.createModalOpen);
  const setCreateModalOpen = usePoolStore((s) => s.setCreateModalOpen);
  const questions = usePoolStore((s) => s.questions);
  const counts = getTypeCounts(questions);

  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [subtype, setSubtype] = useState<QuestionSubtype | null>(null);

  const subtypeOptions = selectedType ? getSubtypeOptions(selectedType) : [];
  const needsSubtype = selectedType ? typeRequiresSubtype(selectedType) : false;
  const canContinue = Boolean(selectedType && (!needsSubtype || subtype));

  const reset = () => {
    setSelectedType(null);
    setSubtype(null);
  };

  const onContinue = () => {
    if (!selectedType || !canContinue) return;
    setCreateModalOpen(false);
    reset();
    const q = subtype ? `?subtype=${encodeURIComponent(subtype)}` : "";
    router.push(`${ROUTES.questionPoolCreate(selectedType)}${q}`);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (o === open) return;
        setCreateModalOpen(o);
        if (!o) reset();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0 z-[130]", radixOverlay)} />
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <Dialog.Content
            className={cn(
              "pointer-events-auto flex w-full max-w-[720px] flex-col overflow-hidden rounded-[20px]",
              "border border-white/60 bg-white/95 shadow-[0_24px_80px_-24px_rgba(124,58,237,0.3)] backdrop-blur-xl",
              "focus:outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
              "dark:border-white/10 dark:bg-[#141416]/98",
            )}
          >
            <div className="relative border-b border-[rgba(15,23,42,0.06)] px-6 py-4 dark:border-white/[0.06]">
              <Dialog.Title className="text-[1.0625rem] font-semibold tracking-[-0.03em] text-text">
                What type of question?
              </Dialog.Title>
              <Dialog.Close
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-muted hover:bg-[rgba(15,23,42,0.04)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TYPE_CARDS.map((card) => {
                  const Icon = card.icon;
                  const accent = QUESTION_TYPE_ACCENT[card.type];
                  const active = selectedType === card.type;
                  return (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => {
                        setSelectedType(card.type);
                        setSubtype(null);
                      }}
                      className={cn(
                        "flex flex-col rounded-[14px] border p-4 text-left transition-all duration-[180ms] ease-out",
                        active
                          ? "-translate-y-0.5 shadow-[0_8px_24px_-8px_rgba(124,58,237,0.25)]"
                          : "border-[rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:border-[rgba(124,58,237,0.2)]",
                      )}
                      style={
                        active
                          ? {
                              borderColor: accent,
                              boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 35%, transparent)`,
                            }
                          : undefined
                      }
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
                          color: accent,
                        }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <span className="mt-3 text-[13px] font-semibold text-text">
                        {QUESTION_TYPE_LABELS[card.type]}
                      </span>
                      <span className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">
                        {card.description}
                      </span>
                      <span className="mt-2 text-[10px] font-medium tabular-nums text-text-secondary/70">
                        {counts[card.type]} questions
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity,margin] duration-[180ms] ease-out",
                  needsSubtype ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
                )}
                aria-hidden={!needsSubtype}
              >
                <div className="min-h-0 overflow-hidden">
                  <div
                    className={cn(
                      "transition-transform duration-[180ms] ease-out",
                      needsSubtype ? "translate-y-0" : "-translate-y-1",
                    )}
                  >
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Sub-type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subtypeOptions.map((opt) => (
                        <SubtypePill
                          key={opt.id}
                          label={opt.label}
                          selected={subtype === opt.id}
                          onSelect={() => setSubtype(opt.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] px-6 py-4 dark:border-white/[0.06]">
              <Dialog.Close
                type="button"
                className="h-9 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-4 text-[13px] font-medium"
              >
                Cancel
              </Dialog.Close>
              <button
                type="button"
                disabled={!canContinue}
                onClick={onContinue}
                className={cn(
                  "h-9 rounded-[10px] px-5 text-[13px] font-semibold text-white",
                  canContinue ? "bg-accent hover:bg-accent-hover" : "cursor-not-allowed bg-muted/40",
                )}
              >
                Continue
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
