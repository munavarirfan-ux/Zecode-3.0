"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { Pencil, Trash2, X } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { radixOverlay } from "@/lib/radix-motion";
import { DifficultyMeter } from "./DifficultyMeter";
import { EMPTY_CELL, formatQuestionTypeLabel, QUESTION_TYPE_ACCENT, STATUS_LABELS } from "../tokens";
import { usePoolStore } from "../store/poolStore";
import { DATABASE_SCHEMAS } from "../mockData";

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted/75">{label}</p>
      <div className="mt-1 text-[12px] font-medium text-text">{children}</div>
    </div>
  );
}

export function QuestionDrawer() {
  const drawerQuestionId = usePoolStore((s) => s.drawerQuestionId);
  const closeDrawer = usePoolStore((s) => s.closeDrawer);
  const questions = usePoolStore((s) => s.questions);

  const question = useMemo(
    () => questions.find((q) => q.id === drawerQuestionId) ?? null,
    [questions, drawerQuestionId],
  );

  const schema = question?.schemaId
    ? DATABASE_SCHEMAS.find((s) => s.id === question.schemaId)
    : null;

  return (
    <Dialog.Root
      open={Boolean(drawerQuestionId)}
      onOpenChange={(open) => {
        if (!open && drawerQuestionId) closeDrawer();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0 z-[125]", radixOverlay)} />
        <div className="fixed inset-0 z-[125] flex justify-end p-3 sm:p-4">
          <Dialog.Content
            className={cn(
              "flex h-full w-full max-w-[480px] flex-col overflow-hidden rounded-[20px]",
              "border border-white/60 bg-white/95 shadow-[0_24px_80px_-24px_rgba(124,58,237,0.25)] backdrop-blur-xl",
              "focus:outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right-8 data-[state=open]:fade-in-0",
              "dark:border-white/10 dark:bg-[#141416]/98",
            )}
            aria-describedby={undefined}
          >
            {question ? (
              <>
                <div className="relative shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
                  <div className="flex items-start justify-between gap-3 pr-8">
                    <span
                      className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        color: QUESTION_TYPE_ACCENT[question.type],
                        backgroundColor: `color-mix(in srgb, ${QUESTION_TYPE_ACCENT[question.type]} 12%, transparent)`,
                      }}
                    >
                      {formatQuestionTypeLabel(question.type, question.subtype)}
                    </span>
                    <Dialog.Close
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-muted hover:bg-[rgba(15,23,42,0.04)] hover:text-text"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </Dialog.Close>
                  </div>
                  <Dialog.Title className="mt-2 text-[1rem] font-semibold tracking-[-0.02em] text-text">
                    Question #{question.number}
                  </Dialog.Title>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-secondary/85">{question.title}</p>
                </div>

                <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
                  <div className="prose prose-sm max-w-none text-[13px] text-text-secondary/90">
                    <p className="whitespace-pre-wrap">{question.bodyMarkdown.replace(/^## .+\n\n/, "")}</p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <MetaItem label="Difficulty">
                      <DifficultyMeter difficulty={question.difficulty} />
                    </MetaItem>
                    <MetaItem label="Skill">{question.skill}</MetaItem>
                    <MetaItem label="Tag">{question.tags[0] ?? EMPTY_CELL}</MetaItem>
                    <MetaItem label="Status">{STATUS_LABELS[question.status]}</MetaItem>
                    <MetaItem label="Curator">{question.curator.name}</MetaItem>
                    <MetaItem label="Created">
                      {format(new Date(question.meta.createdAt), "MMM d, yyyy")}
                    </MetaItem>
                    <MetaItem label="Last used">
                      {question.meta.lastUsedAt
                        ? format(new Date(question.meta.lastUsedAt), "MMM d, yyyy")
                        : EMPTY_CELL}
                    </MetaItem>
                  </div>

                  {question.tags.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted/75">Tags</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {question.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] px-2 py-0.5 text-[11px] font-medium text-text-secondary/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {question.mcqOptions ? (
                    <div className="mt-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted/75">Options</p>
                      <ul className="mt-2 space-y-1.5">
                        {question.mcqOptions.map((o) => (
                          <li
                            key={o.id}
                            className={cn(
                              "rounded-[10px] border px-3 py-2 text-[12px]",
                              o.isCorrect
                                ? "border-emerald-400/50 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30"
                                : "border-[rgba(15,23,42,0.06)]",
                            )}
                          >
                            {o.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {question.testCases?.[0] ? (
                    <div className="mt-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted/75">Sample test case</p>
                      <pre className="mt-2 overflow-x-auto rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] p-3 font-mono text-[11px]">
                        {`in: ${question.testCases[0].input}\nout: ${question.testCases[0].expected}`}
                      </pre>
                    </div>
                  ) : null}

                  {schema ? (
                    <div className="mt-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted/75">Schema</p>
                      <p className="mt-1 text-[12px] font-medium text-text">{schema.label}</p>
                      <p className="mt-1 text-[11px] text-muted">{schema.tables.map((t) => t.name).join(" · ")}</p>
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted/75">Recent activity</p>
                    <ul className="mt-2 space-y-2">
                      {question.meta.usedInAssessments.length > 0 ? (
                        question.meta.usedInAssessments.map((a) => (
                          <li key={a} className="text-[12px] text-text-secondary/85">
                            Used in <span className="font-medium text-text">{a}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-[12px] text-muted">Not used in assessments yet</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
                  <button
                    type="button"
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] text-[13px] font-medium hover:bg-[rgba(124,58,237,0.06)]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-red-200 bg-red-50/50 text-[13px] font-medium text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            ) : null}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
