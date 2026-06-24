"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";
import { getEditorSteps, hasStepper } from "./editor/editorConfig";
import { createEmptyDraft } from "./editor/defaultDraft";
import type { QuestionDraft } from "./editor/draftTypes";
import type { QuestionDraftFormValues } from "./editor/schemas";
import { validatePublish, validateStep } from "./editor/schemas";
import { parseSubtypeParam } from "./questionSubtypes";
import { QUESTION_TYPE_LABELS } from "./tokens";
import type { QuestionType } from "./types";
import { cn } from "@/lib/utils";
import { EditorShell } from "./components/EditorShell";
import { QuestionCoreFields, renderStepContent } from "./components/EditorFormFields";
import { TagChips } from "./components/TagChips";
import { DifficultyPicker } from "./components/editors/DifficultyPicker";
import { MCQAnswerTypeToggle, MCQOptionsEditor } from "./components/editors/MCQOptionsEditor";
import { MarkdownEditor } from "./components/editors/MarkdownEditor";
import { useDraftStore } from "./store/draftStore";
import { usePoolStore } from "./store/poolStore";

const MCQ_SKILLS = [
  "JavaScript",
  "Python",
  "SQL",
  "React",
  "System Design",
  "Data Structures",
  "Algorithms",
];
const VALID_TYPES = new Set<string>([
  "coding",
  "database",
  "mcq",
  "comprehension",
  "open-ended",
  "fill-blank",
  "debug",
]);

export function CreateQuestionEditor({
  typeParam,
  subtypeParam,
}: {
  typeParam: string;
  subtypeParam?: string;
}) {
  const router = useRouter();
  const initDraft = useDraftStore((s) => s.initDraft);
  const patchDraft = useDraftStore((s) => s.patchDraft);
  const draft = useDraftStore((s) => s.draft);
  const dirty = useDraftStore((s) => s.dirty);
  const lastSavedAt = useDraftStore((s) => s.lastSavedAt);
  const markSaved = useDraftStore((s) => s.markSaved);
  const currentStep = useDraftStore((s) => s.currentStep);
  const setStep = useDraftStore((s) => s.setStep);
  const reset = useDraftStore((s) => s.reset);
  const addQuestion = usePoolStore((s) => s.addQuestion);

  const type = VALID_TYPES.has(typeParam) ? (typeParam as QuestionType) : null;
  const subtype = type ? parseSubtypeParam(type, subtypeParam) : undefined;

  useEffect(() => {
    if (!type) return;
    initDraft(type, subtype);
    return () => reset();
  }, [type, subtype, initDraft, reset]);

  const steps = type ? getEditorSteps(type, subtype) : [];
  const stepped = type ? hasStepper(type, subtype) : false;
  const stepId = steps[currentStep]?.id;

  const formValues: QuestionDraftFormValues | null = useMemo(
    () => (draft ? { ...draft, schemaId: draft.schemaId || "" } : null),
    [draft],
  );

  const onPatch = useCallback(
    (patch: Partial<QuestionDraftFormValues>) => {
      patchDraft(patch as Partial<QuestionDraft>);
    },
    [patchDraft],
  );

  useEffect(() => {
    if (!dirty || !draft) return;
    const id = setInterval(() => markSaved(), 2000);
    return () => clearInterval(id);
  }, [dirty, draft, markSaved]);

  const persistQuestion = (status: "draft" | "published") => {
    if (!draft || !type) return;
    const values = { ...draft, schemaId: draft.schemaId || "" } as QuestionDraftFormValues;
    if (status === "published") {
      const err = validatePublish(values);
      if (err) {
        toast.error(err);
        return;
      }
    }
    addQuestion(draft, status);
    toast.success(status === "published" ? "Question published" : "Draft saved");
    markSaved();
    router.push(ROUTES.questionPool);
  };

  const goNext = () => {
    if (!draft || !type || !stepId) return;
    const values = { ...draft, schemaId: draft.schemaId || "" } as QuestionDraftFormValues;
    const err = validateStep(type, stepId, values);
    if (err) {
      toast.error(err);
      return;
    }
    if (currentStep < steps.length - 1) setStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setStep(currentStep - 1);
  };

  if (!type || !draft || !formValues) {
    return (
      <div className="rounded-[20px] border border-[rgba(15,23,42,0.06)] bg-surface p-8 text-center">
        <p className="text-[13px] text-muted">Unknown question type.</p>
      </div>
    );
  }

  const title = `Create ${QUESTION_TYPE_LABELS[type]} question`;

  const formContent = stepped ? (
    renderStepContent(stepId, formValues, onPatch)
  ) : type === "mcq" ? (
    <div className="space-y-5">
      {/* Note */}
      <div className="rounded-[10px] border border-blue-200/60 bg-blue-50/40 px-3 py-2.5 text-[12px] leading-relaxed text-blue-800 dark:border-blue-500/20 dark:bg-blue-950/20 dark:text-blue-200">
        <span className="font-semibold">Note:</span>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-[11px]">
          <li>The image should be in jpg, jpeg, or png format</li>
          <li>For latex code, place a dollar ($) symbol at start and end of the code</li>
        </ul>
      </div>

      {/* Question editor with Difficulty beside heading */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-text">Question</label>
          <DifficultyPicker
            value={formValues.difficulty}
            onChange={(d) => onPatch({ difficulty: d })}
          />
        </div>
        <MarkdownEditor
          value={formValues.bodyMarkdown}
          onChange={(bodyMarkdown) => onPatch({ bodyMarkdown })}
          placeholder="Please enter text here..."
          minHeight="min-h-[180px]"
          hideLabel
        />
      </div>

      {/* Options + Answer Type */}
      <div className="border-t border-[rgba(15,23,42,0.06)] pt-5 dark:border-white/[0.06]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-text">Options</h2>
          <MCQAnswerTypeToggle
            answerType={formValues.answerType}
            onChange={(newType) => {
              if (newType === "single" && formValues.answerType !== "single") {
                const firstCorrect = formValues.mcqOptions.findIndex((o) => o.isCorrect);
                onPatch({
                  answerType: newType,
                  mcqOptions: formValues.mcqOptions.map((o, i) => ({
                    ...o,
                    isCorrect: i === (firstCorrect >= 0 ? firstCorrect : 0),
                  })),
                });
              } else {
                onPatch({ answerType: newType });
              }
            }}
          />
        </div>
        <MCQOptionsEditor
          options={formValues.mcqOptions}
          answerType={formValues.answerType}
          onChange={(mcqOptions) => onPatch({ mcqOptions })}
        />
      </div>

      {/* Skill / Tags */}
      <div className="border-t border-[rgba(15,23,42,0.06)] pt-5 dark:border-white/[0.06]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 space-y-1.5">
              <label className="text-[12px] font-medium text-text">Skill</label>
              <input
                list="mcq-skills"
                value={formValues.skill}
                onChange={(e) => onPatch({ skill: e.target.value })}
                placeholder="Search skill"
                className={cn(
                  "h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 text-[13px] outline-none",
                  "focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]",
                )}
              />
              <datalist id="mcq-skills">
                {MCQ_SKILLS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[12px] font-medium text-text">Tags</label>
              <TagChips
                tags={formValues.tags}
                onChange={(tags) => onPatch({ tags })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <QuestionCoreFields draft={formValues} onPatch={onPatch} />
      {type === "open-ended" ? null : (
        <div className="space-y-4">
          <h2 className="text-[14px] font-semibold text-text">Tags</h2>
          <TagChips tags={formValues.tags} onChange={(tags) => onPatch({ tags })} />
        </div>
      )}
      {type === "fill-blank" ? (
        <MarkdownEditor
          label="Template with blanks"
          value={formValues.fillBlankTemplate}
          onChange={(fillBlankTemplate) => onPatch({ fillBlankTemplate })}
          placeholder="Use ___ for blanks…"
        />
      ) : null}
    </div>
  );

  return (
    <EditorShell
      title={title}
      steps={stepped ? steps : null}
      currentStep={currentStep}
      onStepClick={(i) => i <= currentStep && setStep(i)}
      draft={formValues}
      dirty={dirty}
      lastSavedAt={lastSavedAt}
      onDiscard={() => {
        reset();
        router.push(ROUTES.questionPool);
      }}
      onSaveDraft={() => persistQuestion("draft")}
      onPublish={() => persistQuestion("published")}
      onContinue={stepped && stepId !== "review" ? goNext : undefined}
      onBack={stepped && currentStep > 0 ? goBack : undefined}
      stepped={stepped}
    >
      {formContent}
    </EditorShell>
  );
}
