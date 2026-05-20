"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AssessmentFormDraft, DifficultyLevel, QuestionPoolCategory } from "@/lib/hiring/assessments/types";
import { DURATION_OPTIONS, PROGRAMMING_LANGUAGES } from "@/lib/hiring/assessments/types";
import { isPresetDuration } from "@/lib/hiring/assessments/assessmentFormSteps";
import { ASSESSMENT_FORM_STEPS } from "@/lib/hiring/assessments/assessmentFormSteps";
import { AssessmentQuestionsStep } from "./AssessmentQuestionsStep";
import { ValidityDaysStepper } from "./ValidityDaysStepper";

const inputClass =
  "h-10 text-[14px] focus-visible:ring-2 focus-visible:ring-accent/25";

const DIFFICULTIES: DifficultyLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

function ScoringTypeCheckboxes({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { mcq: boolean; comprehension: boolean };
  onChange: (next: { mcq: boolean; comprehension: boolean }) => void;
}) {
  return (
    <div className="ml-1 space-y-2 rounded-lg border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-3 py-2.5 dark:bg-white/[0.02]">
      <p className="text-[11px] font-medium text-muted">Applies to:</p>
      {(
        [
          ["mcq", "MCQ"],
          ["comprehension", "Comprehension"],
        ] as const
      ).map(([key, text]) => (
        <label key={key} className="flex cursor-pointer items-center gap-2 text-[13px] text-text-secondary">
          <input
            type="checkbox"
            checked={value[key]}
            onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
            className="h-4 w-4 rounded border-[rgba(15,23,42,0.2)] accent-accent"
          />
          {text}
        </label>
      ))}
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}

export function AssessmentFormStepContent({
  stepIndex,
  draft,
  onChange,
  onRequestCustomQuestion,
}: {
  stepIndex: number;
  draft: AssessmentFormDraft;
  onChange: (next: AssessmentFormDraft) => void;
  onRequestCustomQuestion?: (category: QuestionPoolCategory) => void;
}) {
  const step = ASSESSMENT_FORM_STEPS[stepIndex];
  const [tagDraft, setTagDraft] = useState("");
  const durationPresetActive =
    !draft.durationIsCustom && isPresetDuration(draft.durationMinutes);

  if (step.key === "questions") {
    return (
      <AssessmentQuestionsStep
        draft={draft}
        onChange={onChange}
        onRequestCustomQuestion={onRequestCustomQuestion ?? (() => {})}
      />
    );
  }

  if (step.key === "details") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Assessment name" htmlFor="asm-name" required className="sm:col-span-2">
          <Input
            id="asm-name"
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
            placeholder="e.g. Frontend Developer Assessment"
            className={inputClass}
          />
        </FormField>

        <div className="sm:col-span-2">
          <p className="mb-2 text-[12px] font-medium text-text-secondary">Assessment duration</p>
          <div className="inline-flex flex-wrap gap-1 rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[#F4F4F5]/80 p-0.5">
            {DURATION_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() =>
                  onChange({ ...draft, durationMinutes: m, durationIsCustom: false })
                }
                className={cn(
                  "rounded-[8px] px-3 py-1.5 text-[12px] font-medium",
                  durationPresetActive && draft.durationMinutes === m
                    ? "bg-white text-text shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                {m} min
              </button>
            ))}
            <button
              type="button"
              onClick={() => onChange({ ...draft, durationIsCustom: true })}
              className={cn(
                "rounded-[8px] px-3 py-1.5 text-[12px] font-medium",
                draft.durationIsCustom
                  ? "bg-white text-text shadow-sm"
                  : "text-muted hover:text-text",
              )}
            >
              Custom
            </button>
          </div>
          {draft.durationIsCustom ? (
            <div className="mt-2 flex items-center gap-2">
              <Input
                id="asm-duration-custom"
                type="number"
                min={1}
                max={480}
                value={draft.durationMinutes || ""}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    durationMinutes: Number(e.target.value) || 0,
                    durationIsCustom: true,
                  })
                }
                className={cn(inputClass, "max-w-[140px]")}
                aria-label="Custom duration in minutes"
              />
              <span className="text-[12px] text-muted">minutes</span>
            </div>
          ) : null}
        </div>

        <FormField label="Assessment validity" htmlFor="asm-validity" className="sm:col-span-2">
          <ValidityDaysStepper
            value={draft.validityDays}
            onChange={(days) => onChange({ ...draft, validityDays: days })}
          />
        </FormField>

        <FormField label="Qualifying percentage" htmlFor="asm-qualify">
          <div className="relative">
            <Input
              id="asm-qualify"
              type="number"
              min={1}
              max={100}
              value={draft.qualifyingPercentage}
              onChange={(e) =>
                onChange({ ...draft, qualifyingPercentage: Number(e.target.value) || 0 })
              }
              className={cn(inputClass, "pr-8")}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted">
              %
            </span>
          </div>
        </FormField>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center gap-2">
            <Switch
              id="partial-scoring"
              checked={draft.partialScoring}
              onCheckedChange={(v) => onChange({ ...draft, partialScoring: v })}
            />
            <label htmlFor="partial-scoring" className="text-[13px] text-text-secondary">
              Partial scoring
            </label>
          </div>
          {draft.partialScoring ? (
            <ScoringTypeCheckboxes
              label="Partial credit applies only to selected question types."
              value={draft.partialScoringAppliesTo}
              onChange={(partialScoringAppliesTo) => onChange({ ...draft, partialScoringAppliesTo })}
            />
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center gap-2">
            <Switch
              id="negative-marking"
              checked={draft.negativeMarking}
              onCheckedChange={(v) => onChange({ ...draft, negativeMarking: v })}
            />
            <label htmlFor="negative-marking" className="text-[13px] text-text-secondary">
              Negative marking
            </label>
          </div>
          {draft.negativeMarking ? (
            <>
              <ScoringTypeCheckboxes
                label="Penalty applies only to selected question types."
                value={draft.negativeMarkingAppliesTo}
                onChange={(negativeMarkingAppliesTo) => onChange({ ...draft, negativeMarkingAppliesTo })}
              />
              <FormField label="Penalty (%)" htmlFor="asm-penalty">
                <Input
                  id="asm-penalty"
                  type="number"
                  min={0}
                  max={100}
                  value={draft.negativePenaltyPercent}
                  onChange={(e) =>
                    onChange({ ...draft, negativePenaltyPercent: Number(e.target.value) || 0 })
                  }
                  className={inputClass}
                />
              </FormField>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  if (step.key === "roles") {
    const allLangs = [...PROGRAMMING_LANGUAGES];
    const allSelected = allLangs.every((l) => draft.languages.includes(l));
    const toggleLang = (lang: string) => {
      const has = draft.languages.includes(lang);
      onChange({
        ...draft,
        languages: has ? draft.languages.filter((l) => l !== lang) : [...draft.languages, lang],
      });
    };
    const toggleSelectAll = () => {
      onChange({ ...draft, languages: allSelected ? [] : [...allLangs] });
    };
    const addTag = () => {
      const t = tagDraft.trim();
      if (!t || draft.tags.includes(t)) return;
      onChange({ ...draft, tags: [...draft.tags, t] });
      setTagDraft("");
    };
    return (
      <div className="space-y-4">
        <FormField label="Role" htmlFor="asm-role" required>
          <Input
            id="asm-role"
            className={inputClass}
            value={draft.role}
            onChange={(e) => onChange({ ...draft, role: e.target.value })}
            placeholder="e.g. React Developer"
          />
        </FormField>
        <div>
          <p className="mb-2 text-[12px] font-medium text-text-secondary">Difficulty level</p>
          <div className="inline-flex flex-wrap gap-1 rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[#F4F4F5]/80 p-0.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onChange({ ...draft, difficulty: d })}
                className={cn(
                  "rounded-[8px] px-3 py-1.5 text-[12px] font-medium",
                  draft.difficulty === d
                    ? "bg-white text-text shadow-sm"
                    : "text-muted hover:text-text",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <FormField label="Tags (optional)" htmlFor="asm-tags">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {draft.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border bg-[#F4F4F5] px-2 py-0.5 text-[11px] font-medium"
              >
                {t}
                <button
                  type="button"
                  className="ml-1 text-muted hover:text-text"
                  onClick={() => onChange({ ...draft, tags: draft.tags.filter((x) => x !== t) })}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Input
            id="asm-tags"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Type tag and press Enter"
            className={inputClass}
          />
        </FormField>
        <div>
          <p className="mb-2 text-[12px] font-medium text-text-secondary">Programming languages</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={toggleSelectAll}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                allSelected
                  ? "border-accent/30 bg-accent/[0.08] text-accent"
                  : "border-[rgba(15,23,42,0.08)] text-muted hover:text-text",
              )}
            >
              Select All
            </button>
            {PROGRAMMING_LANGUAGES.map((lang) => {
              const on = draft.languages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLang(lang)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                    on
                      ? "border-accent/30 bg-accent/[0.08] text-accent"
                      : "border-[rgba(15,23,42,0.08)] text-muted hover:text-text",
                  )}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormField label="Assessment guidelines" htmlFor="asm-guidelines" required className="w-full">
      <Textarea
        id="asm-guidelines"
        value={draft.guidelines}
        onChange={(e) => onChange({ ...draft, guidelines: e.target.value })}
        className="min-h-[320px] w-full resize-y px-4 py-3 text-[13px] leading-relaxed focus-visible:ring-2 focus-visible:ring-accent/25"
        placeholder="Instructions for candidates taking this assessment…"
      />
    </FormField>
  );
}
