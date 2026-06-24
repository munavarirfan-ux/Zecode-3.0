"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { DATABASE_SCHEMAS } from "../mockData";
import { formatQuestionTypeLabel, QUESTION_TYPE_ACCENT } from "../tokens";
import type { QuestionDraftFormValues } from "../editor/schemas";
import { ERDiagram } from "./editors/ERDiagram";

export function CandidatePreview({ draft }: { draft: QuestionDraftFormValues }) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [debounced, setDebounced] = useState(draft);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(draft), 200);
    return () => clearTimeout(t);
  }, [draft]);

  const accent = QUESTION_TYPE_ACCENT[debounced.type as keyof typeof QUESTION_TYPE_ACCENT];
  const schema = DATABASE_SCHEMAS.find((s) => s.id === debounced.schemaId) ?? null;

  return (
    <div className="flex h-full flex-col bg-[rgba(15,23,42,0.02)] dark:bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          Candidate preview
        </p>
        <div className="flex rounded-[8px] border border-[rgba(15,23,42,0.08)] p-0.5">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={cn(
              "rounded-[6px] p-1.5",
              viewport === "desktop" ? "bg-accent text-white" : "text-muted",
            )}
            aria-label="Desktop preview"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={cn(
              "rounded-[6px] p-1.5",
              viewport === "mobile" ? "bg-accent text-white" : "text-muted",
            )}
            aria-label="Mobile preview"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div
          className={cn(
            "mx-auto rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white p-4 shadow-sm transition-[max-width]",
            viewport === "mobile" ? "max-w-[320px]" : "max-w-full",
          )}
        >
          <span
            className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              color: accent,
              backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
            }}
          >
            {formatQuestionTypeLabel(
              debounced.type as Parameters<typeof formatQuestionTypeLabel>[0],
              debounced.subtype,
            )}
          </span>

          {debounced.type !== "mcq" && (
            <h3 className="mt-3 text-[15px] font-semibold text-text">
              {debounced.title || "Question title"}
            </h3>
          )}

          {debounced.type === "mcq" ? (
            <div className="mt-3 space-y-3">
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-text">
                {debounced.bodyMarkdown || "Question text appears here..."}
              </p>
              <ul className="space-y-2">
                {debounced.mcqOptions.map((o, i) => (
                  <li
                    key={o.id}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-[13px]",
                      o.isCorrect
                        ? "border-dashed border-emerald-400/70 bg-emerald-50/30"
                        : "border-[rgba(15,23,42,0.08)]",
                    )}
                  >
                    {debounced.answerType === "multiple" ? (
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-2",
                          o.isCorrect
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-[rgba(15,23,42,0.2)]",
                        )}
                      >
                        {o.isCorrect && (
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                          o.isCorrect
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-[rgba(15,23,42,0.2)]",
                        )}
                      >
                        {o.isCorrect && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    )}
                    {o.label || `Option ${String.fromCharCode(65 + i)}`}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {(debounced.type === "coding" && debounced.subtype === "frontend") ? (
            <div className="mt-4 space-y-3">
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-text-secondary/90">
                {debounced.bodyMarkdown || "Question instructions appear here."}
              </p>
              {debounced.referenceImage && (
                <div className="overflow-hidden rounded-[10px] border border-[rgba(15,23,42,0.08)]">
                  <div className="bg-[rgba(15,23,42,0.04)] px-2 py-1 text-[10px] text-muted">Reference</div>
                  <img
                    src={debounced.referenceImage}
                    alt="Reference"
                    className="max-h-40 w-full object-contain p-2"
                  />
                </div>
              )}
              {debounced.uiRemarks && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Requirements
                  </p>
                  <p className="whitespace-pre-wrap rounded-[8px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] p-2 text-[11px] text-text-secondary/90">
                    {debounced.uiRemarks}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <span className="rounded-[8px] bg-accent px-3 py-1.5 text-[11px] font-medium text-white">
                  Submit
                </span>
              </div>
            </div>
          ) : (debounced.type === "coding" || debounced.type === "debug") ? (
            <div className="mt-4 space-y-3">
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-text-secondary/90">
                {debounced.bodyMarkdown || "Question instructions appear here."}
              </p>
              <div className="overflow-hidden rounded-[10px] border border-[rgba(15,23,42,0.08)]">
                <div className="bg-[rgba(15,23,42,0.04)] px-2 py-1 text-[10px] text-muted">Code</div>
                <pre className="max-h-40 overflow-auto p-3 font-mono text-[11px] text-text">
                  {debounced.type === "debug"
                    ? debounced.buggyCode || "// buggy code…"
                    : debounced.starterCode || "// starter code…"}
                </pre>
              </div>
              {debounced.testCases.some((t) => !t.hidden) && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Sample test cases
                  </p>
                  {debounced.testCases
                    .filter((t) => !t.hidden)
                    .map((t, i) => (
                      <div
                        key={t.id}
                        className="rounded-[8px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] p-2"
                      >
                        <p className="text-[10px] font-medium text-muted">Case {i + 1}</p>
                        <div className="mt-1 grid grid-cols-2 gap-2 font-mono text-[10px]">
                          <div>
                            <span className="text-muted">Input: </span>
                            <span className="text-text">{t.input || "—"}</span>
                          </div>
                          <div>
                            <span className="text-muted">Expected: </span>
                            <span className="text-text">{t.expected || "—"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              <div className="flex gap-2">
                <span className="rounded-[8px] border px-3 py-1.5 text-[11px] font-medium">Run</span>
                <span className="rounded-[8px] bg-accent px-3 py-1.5 text-[11px] font-medium text-white">
                  Submit
                </span>
              </div>
            </div>
          ) : null}

          {debounced.type === "database" ? (
            <div className="mt-4 space-y-3">
              <p className="text-[13px] text-text-secondary/90">
                {debounced.bodyMarkdown || "SQL challenge instructions."}
              </p>
              <ERDiagram schema={schema} />
              <div className="rounded-[10px] border border-[rgba(15,23,42,0.08)]">
                <div className="border-b px-2 py-1 text-[10px] text-muted">SQL</div>
                <pre className="p-3 font-mono text-[11px] text-muted">SELECT …</pre>
              </div>
            </div>
          ) : null}

          {debounced.type === "comprehension" ? (
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="whitespace-pre-wrap rounded-[10px] bg-[rgba(15,23,42,0.03)] p-3 text-text-secondary/90">
                {debounced.passage || "Reading passage…"}
              </div>
              {debounced.compQuestions.length > 0 ? (
                <div className="space-y-3">
                  {debounced.compQuestions.map((q, qi) => (
                    <div key={q.id} className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Question {qi + 1}
                      </p>
                      <p className="whitespace-pre-wrap text-[13px] text-text">
                        {q.questionBody || "Question text…"}
                      </p>
                      <ul className="space-y-1.5">
                        {q.options.map((o, oi) => (
                          <li
                            key={o.id}
                            className="flex items-center gap-2.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-3 py-2 text-[12px]"
                          >
                            {q.answerType === "multiple" ? (
                              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-2 border-[rgba(15,23,42,0.2)]" />
                            ) : (
                              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(15,23,42,0.2)]" />
                            )}
                            {o.label || `Option ${String.fromCharCode(65 + oi)}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-muted">No questions added yet.</p>
              )}
            </div>
          ) : null}

          {(debounced.type === "open-ended" || debounced.type === "fill-blank") && (
            <div className="mt-4 space-y-3">
              <p className="whitespace-pre-wrap text-[13px] text-text-secondary/90">
                {debounced.bodyMarkdown || debounced.fillBlankTemplate || "Response area…"}
              </p>
              <div className="min-h-[80px] rounded-[10px] border border-dashed border-[rgba(15,23,42,0.12)]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
