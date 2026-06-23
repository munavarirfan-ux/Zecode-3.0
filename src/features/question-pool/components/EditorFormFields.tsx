"use client";

import { cn } from "@/lib/utils";
import { formatQuestionTypeLabel, QUESTION_TYPE_ACCENT } from "../tokens";
import type { QuestionDraftFormValues } from "../editor/schemas";
import { TagChips } from "./TagChips";
import { CodeEditorPane } from "./editors/CodeEditorPane";
import { DifficultyPicker } from "./editors/DifficultyPicker";
import { FunctionDetailsEditor } from "./editors/FunctionDetailsEditor";
import { ImageRemarksEditor } from "./editors/ImageRemarksEditor";
import { MarkdownEditor } from "./editors/MarkdownEditor";
import { MCQOptionsEditor } from "./editors/MCQOptionsEditor";
import { SchemaPickerCards } from "./editors/SchemaPickerCards";
import { TestCasesEditor } from "./editors/TestCasesEditor";

const SKILLS = [
  "JavaScript",
  "Python",
  "SQL",
  "React",
  "System Design",
  "Data Structures",
  "Algorithms",
];

export function QuestionCoreFields({
  draft,
  onPatch,
  showTitle = true,
}: {
  draft: QuestionDraftFormValues;
  onPatch: (patch: Partial<QuestionDraftFormValues>) => void;
  showTitle?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            color: QUESTION_TYPE_ACCENT[draft.type as keyof typeof QUESTION_TYPE_ACCENT],
            backgroundColor: `color-mix(in srgb, ${QUESTION_TYPE_ACCENT[draft.type as keyof typeof QUESTION_TYPE_ACCENT]} 12%, transparent)`,
          }}
        >
          {formatQuestionTypeLabel(
            draft.type as Parameters<typeof formatQuestionTypeLabel>[0],
            draft.subtype,
          )}
        </span>
        <DifficultyPicker value={draft.difficulty} onChange={(d) => onPatch({ difficulty: d })} />
      </div>
      {showTitle ? (
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text">Title</label>
          <input
            value={draft.title}
            onChange={(e) => onPatch({ title: e.target.value })}
            placeholder="Short question title"
            className={cn(
              "h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 text-[13px] outline-none",
              "focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]",
            )}
          />
        </div>
      ) : null}
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-text">Skill</label>
        <input
          list="qp-skills"
          value={draft.skill}
          onChange={(e) => onPatch({ skill: e.target.value })}
          placeholder="e.g. JavaScript"
          className={cn(
            "h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 text-[13px] outline-none",
            "focus-visible:ring-2 focus-visible:ring-accent/20",
          )}
        />
        <datalist id="qp-skills">
          {SKILLS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
      <MarkdownEditor value={draft.bodyMarkdown} onChange={(bodyMarkdown) => onPatch({ bodyMarkdown })} />
    </div>
  );
}

export function renderStepContent(
  stepId: string,
  draft: QuestionDraftFormValues,
  onPatch: (patch: Partial<QuestionDraftFormValues>) => void,
): React.ReactNode {
  switch (stepId) {
    case "question":
      return <QuestionCoreFields draft={draft} onPatch={onPatch} />;
    case "options":
      return (
        <div className="space-y-4">
          <h2 className="text-[14px] font-semibold text-text">Answer options</h2>
          <MCQOptionsEditor
            options={draft.mcqOptions}
            onChange={(mcqOptions) => onPatch({ mcqOptions })}
          />
        </div>
      );
    case "tags":
      return (
        <div className="space-y-4">
          <h2 className="text-[14px] font-semibold text-text">Tags</h2>
          <TagChips tags={draft.tags} onChange={(tags) => onPatch({ tags })} />
        </div>
      );
    case "test-cases":
      return (
        <div className="space-y-4">
          <h2 className="text-[14px] font-semibold text-text">Test cases</h2>
          <TestCasesEditor testCases={draft.testCases} onChange={(testCases) => onPatch({ testCases })} />
        </div>
      );
    case "image-remarks":
      return (
        <ImageRemarksEditor
          referenceImage={draft.referenceImage}
          uiRemarks={draft.uiRemarks}
          evaluationRemarks={draft.evaluationRemarks}
          frontendLinks={draft.frontendLinks}
          onPatch={onPatch}
        />
      );
    case "function-details":
      return (
        <FunctionDetailsEditor
          functionName={draft.functionName}
          returnType={draft.returnType}
          parameters={draft.parameters}
          onPatch={onPatch}
        />
      );
    case "starter":
      return (
        <CodeEditorPane
          label="Starter code"
          language={
            draft.subtype === "frontend" || draft.subtype === "full-stack"
              ? "typescript"
              : "javascript"
          }
          value={draft.starterCode}
          onChange={(starterCode) => onPatch({ starterCode })}
        />
      );
    case "schema":
      return (
        <div className="space-y-4">
          <h2 className="text-[14px] font-semibold text-text">Data model</h2>
          <SchemaPickerCards
            value={draft.schemaId as "" | import("../types").DatabaseSchemaId}
            onChange={(schemaId) => onPatch({ schemaId })}
          />
        </div>
      );
    case "query":
      return (
        <CodeEditorPane
          label="Expected query"
          language="sql"
          value={draft.expectedQuery}
          onChange={(expectedQuery) => onPatch({ expectedQuery })}
        />
      );
    case "passage":
      return (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-text">Title</label>
            <input
              value={draft.title}
              onChange={(e) => onPatch({ title: e.target.value })}
              className="h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
            />
          </div>
          <DifficultyPicker value={draft.difficulty} onChange={(d) => onPatch({ difficulty: d })} />
          <MarkdownEditor
            label="Reading passage"
            value={draft.passage}
            onChange={(passage) => onPatch({ passage })}
            minHeight="min-h-[220px]"
          />
        </div>
      );
    case "questions":
      return (
        <MarkdownEditor
          label="Follow-up questions"
          value={draft.comprehensionQuestions}
          onChange={(comprehensionQuestions) => onPatch({ comprehensionQuestions })}
          placeholder="List comprehension questions…"
        />
      );
    case "function":
      return (
        <CodeEditorPane
          label="Function signature"
          value={draft.functionSignature}
          onChange={(functionSignature) => onPatch({ functionSignature })}
          minHeight="min-h-[100px]"
        />
      );
    case "buggy":
      return (
        <CodeEditorPane
          label="Buggy code"
          value={draft.buggyCode}
          onChange={(buggyCode) => onPatch({ buggyCode })}
        />
      );
    case "review":
      return (
        <div className="space-y-4 rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] p-4">
          <h2 className="text-[14px] font-semibold text-text">Review & publish</h2>
          <dl className="grid gap-2 text-[13px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Title</dt>
              <dd className="font-medium text-text">{draft.title || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Difficulty</dt>
              <dd className="font-medium capitalize text-text">{draft.difficulty}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Skill</dt>
              <dd className="font-medium text-text">{draft.skill || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Tags</dt>
              <dd className="font-medium text-text">{draft.tags.join(", ") || "—"}</dd>
            </div>
          </dl>
          <p className="text-[12px] text-muted">Use Publish below when everything looks correct.</p>
        </div>
      );
    default:
      return null;
  }
}
