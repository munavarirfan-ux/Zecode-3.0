"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  AssessmentFormDraft,
  QuestionDifficulty,
  QuestionPoolCategory,
  SelectedAssessmentQuestion,
} from "@/lib/hiring/assessments/types";
import { QUESTION_POOL_TABS } from "@/lib/hiring/assessments/types";
import { QUESTION_POOL, getPoolQuestion } from "@/lib/hiring/assessments/questionPool";
import { assessmentTotals } from "@/lib/hiring/assessments/assessmentFormSteps";

const DIFFICULTY_FILTERS: { value: "all" | QuestionDifficulty; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Expert", label: "Expert" },
];

function poolToSelected(
  poolId: string,
  sortOrder: number,
): SelectedAssessmentQuestion | null {
  const q = getPoolQuestion(poolId);
  if (!q) return null;
  return {
    id: `sel-${poolId}-${Date.now()}`,
    poolQuestionId: q.id,
    title: q.title,
    type: q.type,
    difficulty: q.difficulty,
    weightage: q.defaultWeightage,
    marks: q.defaultMarks,
    timeLimitMinutes: q.estimatedMinutes,
    required: true,
    sortOrder,
  };
}

export function AssessmentQuestionsStep({
  draft,
  onChange,
  onRequestCustomQuestion,
}: {
  draft: AssessmentFormDraft;
  onChange: (next: AssessmentFormDraft) => void;
  onRequestCustomQuestion: (category: QuestionPoolCategory) => void;
}) {
  const [category, setCategory] = useState<QuestionPoolCategory>("Coding");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | QuestionDifficulty>("all");
  const totals = assessmentTotals(draft);

  const selectedIds = useMemo(
    () => new Set(draft.selectedQuestions.map((q) => q.poolQuestionId)),
    [draft.selectedQuestions],
  );

  const poolFiltered = useMemo(() => {
    return QUESTION_POOL.filter((q) => {
      if (q.type !== category) return false;
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) return false;
      if (search.trim()) {
        const hay = `${q.title} ${q.tags.join(" ")} ${q.skills.join(" ")} ${q.languages.join(" ")}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [category, search, difficultyFilter]);

  const addQuestion = (poolId: string) => {
    if (selectedIds.has(poolId)) return;
    const entry = poolToSelected(poolId, draft.selectedQuestions.length);
    if (!entry) return;
    onChange({ ...draft, selectedQuestions: [...draft.selectedQuestions, entry] });
  };

  const removeSelected = (id: string) => {
    onChange({
      ...draft,
      selectedQuestions: draft.selectedQuestions
        .filter((q) => q.id !== id)
        .map((q, i) => ({ ...q, sortOrder: i })),
    });
  };

  const sortedSelected = draft.selectedQuestions.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1 border-b border-[rgba(15,23,42,0.06)] pb-2">
          {QUESTION_POOL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                category === tab.id
                  ? "bg-forest/10 text-forest"
                  : "text-muted hover:bg-muted/30 hover:text-text",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, skill, tag, or language"
              className="h-9 pl-8 text-[13px]"
            />
          </div>
          <div className="inline-flex flex-wrap gap-1 rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[#F4F4F5]/80 p-0.5">
            {DIFFICULTY_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setDifficultyFilter(f.value)}
                className={cn(
                  "rounded-[8px] px-2.5 py-1 text-[11px] font-medium",
                  difficultyFilter === f.value
                    ? "bg-white text-text shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 rounded-[8px] border-dashed text-[12px]"
          onClick={() => onRequestCustomQuestion(category)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Custom Question
        </Button>

        <div className="space-y-2">
          {poolFiltered.length === 0 ? (
            <p className="rounded-xl border border-dashed px-4 py-8 text-center text-[13px] text-muted">
              No questions match your filters.
            </p>
          ) : (
            poolFiltered.map((q) => {
              const added = selectedIds.has(q.id);
              return (
                <div
                  key={q.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-3 py-3 dark:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-text">{q.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {q.type} · {q.difficulty} · {q.estimatedMinutes} min · {q.defaultMarks} marks · wt{" "}
                      {q.defaultWeightage}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {q.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-muted dark:bg-surface"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className={cn(
                      "h-8 shrink-0 rounded-[8px] text-[12px]",
                      added ? "" : "bg-accent text-white hover:bg-accent-hover",
                    )}
                    variant={added ? "outline" : "default"}
                    disabled={added}
                    onClick={() => addQuestion(q.id)}
                  >
                    {added ? "Added" : "Add"}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-white p-4 shadow-sm dark:bg-surface">
          <h3 className="text-[13px] font-semibold text-text">Selected questions</h3>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-[#F4F4F5] px-2 py-2 dark:bg-white/[0.04]">
              <dt className="text-[10px] text-muted">Questions</dt>
              <dd className="text-[15px] font-semibold tabular-nums text-text">{totals.count}</dd>
            </div>
            <div className="rounded-lg bg-[#F4F4F5] px-2 py-2 dark:bg-white/[0.04]">
              <dt className="text-[10px] text-muted">Marks</dt>
              <dd className="text-[15px] font-semibold tabular-nums text-text">{totals.totalMarks}</dd>
            </div>
            <div className="rounded-lg bg-[#F4F4F5] px-2 py-2 dark:bg-white/[0.04]">
              <dt className="text-[10px] text-muted">Est. time</dt>
              <dd className="text-[15px] font-semibold tabular-nums text-text">{totals.totalMinutes}m</dd>
            </div>
          </dl>

          <div className="mt-3 max-h-[min(420px,50vh)] space-y-2 overflow-y-auto">
            {sortedSelected.length === 0 ? (
              <p className="text-[12px] text-muted">Add questions from the pool or create a custom question.</p>
            ) : (
              sortedSelected.map((q) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] p-2.5 dark:bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-text line-clamp-2">{q.title}</p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        {q.type}
                        {q.isCustom ? " · Custom" : ""} · {q.difficulty}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-md p-1 text-muted hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove question"
                      onClick={() => removeSelected(q.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-1.5 text-[10px] tabular-nums text-muted">
                    {q.marks} marks · wt {q.weightage} · {q.timeLimitMinutes} min
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

    </div>
  );
}
