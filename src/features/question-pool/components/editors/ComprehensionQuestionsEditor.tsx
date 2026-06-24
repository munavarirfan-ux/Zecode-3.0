"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComprehensionQuestion } from "../../types";
import { defaultComprehensionQuestion } from "../../editor/defaultDraft";
import type { QuestionDraftFormValues } from "../../editor/schemas";
import { MarkdownEditor } from "./MarkdownEditor";
import { MCQAnswerTypeToggle, MCQOptionsEditor } from "./MCQOptionsEditor";

function updateQuestion(
  questions: ComprehensionQuestion[],
  index: number,
  patch: Partial<ComprehensionQuestion>,
): ComprehensionQuestion[] {
  return questions.map((q, i) => (i === index ? { ...q, ...patch } : q));
}

export function ComprehensionQuestionsEditor({
  compQuestions,
  onPatch,
}: {
  compQuestions: ComprehensionQuestion[];
  onPatch: (patch: Partial<QuestionDraftFormValues>) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = compQuestions[activeIndex] ?? compQuestions[0];

  const addQuestion = () => {
    const next = [...compQuestions, defaultComprehensionQuestion()];
    onPatch({ compQuestions: next });
    setActiveIndex(next.length - 1);
  };

  const deleteQuestion = (index: number) => {
    if (compQuestions.length <= 1) return;
    const next = compQuestions.filter((_, i) => i !== index);
    onPatch({ compQuestions: next });
    if (activeIndex >= next.length) setActiveIndex(next.length - 1);
    else if (activeIndex > index) setActiveIndex(activeIndex - 1);
  };

  const patchActive = (patch: Partial<ComprehensionQuestion>) => {
    onPatch({ compQuestions: updateQuestion(compQuestions, activeIndex, patch) });
  };

  const handleAnswerTypeChange = (newType: "single" | "multiple") => {
    if (newType === "single" && active.answerType !== "single") {
      const firstCorrect = active.options.findIndex((o) => o.isCorrect);
      patchActive({
        answerType: newType,
        options: active.options.map((o, i) => ({
          ...o,
          isCorrect: i === (firstCorrect >= 0 ? firstCorrect : 0),
        })),
      });
    } else {
      patchActive({ answerType: newType });
    }
  };

  return (
    <div className="space-y-5">
      {/* Question switcher */}
      <div>
        <p className="mb-2 text-[12px] font-medium text-text">Questions</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {compQuestions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "group relative flex h-8 min-w-[32px] items-center justify-center rounded-[8px] px-2 text-[13px] font-semibold transition-colors",
                i === activeIndex
                  ? "bg-accent text-white"
                  : "bg-[rgba(15,23,42,0.06)] text-muted hover:bg-[rgba(15,23,42,0.1)] dark:bg-white/[0.06]",
              )}
            >
              {i + 1}
              {compQuestions.length > 1 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(i);
                  }}
                  className={cn(
                    "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-white opacity-0 transition-opacity group-hover:opacity-100",
                    i === activeIndex ? "bg-red-500" : "bg-red-400",
                  )}
                >
                  <X className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="flex h-8 items-center gap-1 rounded-[8px] border border-dashed border-accent/40 px-2.5 text-[12px] font-medium text-accent transition-colors hover:border-accent/60 hover:bg-accent/[0.03]"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>

      {/* Active question editor */}
      {active && (
        <div className="space-y-4 rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            Question {activeIndex + 1}
          </p>

          {/* Question text */}
          <MarkdownEditor
            label="Question text"
            value={active.questionBody}
            onChange={(questionBody) => patchActive({ questionBody })}
            placeholder="Write the question..."
            minHeight="min-h-[120px]"
          />

          {/* Options + Answer Type */}
          <div className="border-t border-[rgba(15,23,42,0.06)] pt-4 dark:border-white/[0.06]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-text">Options</h3>
              <MCQAnswerTypeToggle
                answerType={active.answerType}
                onChange={handleAnswerTypeChange}
              />
            </div>
            <MCQOptionsEditor
              options={active.options}
              answerType={active.answerType}
              onChange={(options) => patchActive({ options })}
            />
          </div>
        </div>
      )}

    </div>
  );
}
