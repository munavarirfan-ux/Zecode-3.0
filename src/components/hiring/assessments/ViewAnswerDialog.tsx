"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  dialogCloseButtonPositionClass,
  dialogCloseButtonSm,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AssessmentQuestionResult } from "@/lib/hiring/assessments/types";
import { dashboardPanelInteractive } from "@/components/dashboard/dashboardTokens";

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium text-[#18181B] dark:text-text">{value}</p>
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#1e293b] bg-[#0f172a]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 rounded-[8px] text-[11px] text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={copy}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          Copy code
        </Button>
      </div>
      <pre className="max-h-[280px] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-slate-200">
        {code}
      </pre>
    </div>
  );
}

function CodingAnswer({ question }: { question: AssessmentQuestionResult }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cn(dashboardPanelInteractive, "p-4")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Problem statement</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#3F3F46] dark:text-text-secondary">
            {question.problemStatement ?? "No problem statement provided."}
          </p>
        </div>
        <div>
          {question.submittedCode || question.candidateFixedSnippet ? (
            <CodeBlock
              code={question.submittedCode ?? question.candidateFixedSnippet ?? ""}
              label="Submitted code"
            />
          ) : (
            <p className="text-[13px] text-muted">No code submitted.</p>
          )}
        </div>
      </div>
      {question.testCaseResults && question.testCaseResults.length > 0 ? (
        <div className={cn(dashboardPanelInteractive, "p-4")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Test case results</p>
          <ul className="mt-3 space-y-2">
            {question.testCaseResults.map((tc) => (
              <li
                key={tc.name}
                className={cn(
                  "flex items-center justify-between rounded-[10px] border px-3 py-2 text-[12px]",
                  tc.passed
                    ? "border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-800"
                    : "border-red-500/15 bg-red-500/[0.06] text-red-800",
                )}
              >
                <span className="font-medium">{tc.name}</span>
                <span className="font-semibold">{tc.passed ? "Passed" : "Failed"}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function DebugSnippetAnswer({ question }: { question: AssessmentQuestionResult }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CodeBlock code={question.originalSnippet ?? "// original"} label="Original snippet" />
      <CodeBlock code={question.candidateFixedSnippet ?? question.submittedCode ?? "// fix"} label="Candidate fix" />
      {question.expectedFix ? (
        <div className={cn(dashboardPanelInteractive, "p-4 lg:col-span-2")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Expected fix</p>
          <p className="mt-2 text-[13px] text-[#3F3F46]">{question.expectedFix}</p>
        </div>
      ) : null}
    </div>
  );
}

function McqAnswer({ question }: { question: AssessmentQuestionResult }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <MetaChip label="Candidate answer" value={question.candidateAnswer ?? "—"} />
      <MetaChip label="Correct answer" value={question.correctAnswer ?? "—"} />
      <MetaChip label="Result" value={question.status} />
      <MetaChip label="Score" value={`${question.score} / ${question.maxScore}`} />
    </div>
  );
}

function OpenEndedAnswer({ question }: { question: AssessmentQuestionResult }) {
  return (
    <div className="space-y-4">
      <div className={cn(dashboardPanelInteractive, "p-4")}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Candidate response</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#3F3F46] dark:text-text-secondary">
          {question.candidateAnswer ?? question.submittedCode ?? "—"}
        </p>
      </div>
      {question.evaluatorNotes ? (
        <div className={cn(dashboardPanelInteractive, "p-4")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Evaluator notes</p>
          <p className="mt-2 text-[13px] leading-relaxed">{question.evaluatorNotes}</p>
        </div>
      ) : null}
    </div>
  );
}

function DefaultAnswer({ question }: { question: AssessmentQuestionResult }) {
  return (
    <div className="space-y-4">
      {question.submittedCode ? <CodeBlock code={question.submittedCode} label="Submitted answer" /> : null}
      {question.executionOutput ? (
        <div className={cn(dashboardPanelInteractive, "p-4")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Output</p>
          <p className="mt-2 font-mono text-[12px]">{question.executionOutput}</p>
        </div>
      ) : null}
      {question.evaluatorNotes ? (
        <div className={cn(dashboardPanelInteractive, "p-4")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Evaluator notes</p>
          <p className="mt-2 text-[13px]">{question.evaluatorNotes}</p>
        </div>
      ) : null}
    </div>
  );
}

function AnswerBody({ question }: { question: AssessmentQuestionResult }) {
  if (question.tab === "Coding") return <CodingAnswer question={question} />;
  if (question.tab === "Debug Snippet") return <DebugSnippetAnswer question={question} />;
  if (question.tab === "MCQ" || question.tab === "Fill in the Blanks") return <McqAnswer question={question} />;
  if (question.tab === "Open Ended") return <OpenEndedAnswer question={question} />;
  return <DefaultAnswer question={question} />;
}

export function ViewAnswerDialog({
  open,
  onOpenChange,
  question,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: AssessmentQuestionResult | null;
}) {
  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[250] bg-[rgba(15,23,42,0.5)] backdrop-blur-[6px]" />
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6">
          <DialogPanel
            className={cn(
              "relative flex max-h-[90vh] w-full max-w-[960px] flex-col overflow-hidden rounded-[20px]",
              "border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.28)] dark:bg-surface",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            <DialogClose
              className={cn(dialogCloseButtonPositionClass, "z-10", dialogCloseButtonSm)}
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </DialogClose>

            <div className="shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.06),transparent)] px-6 py-5 pr-14 dark:border-white/[0.06]">
              <DialogTitle className="text-[1.125rem] font-semibold tracking-[-0.03em] text-[#18181B] dark:text-text">
                Candidate answer
              </DialogTitle>
              <DialogDescription className="mt-1 text-[14px] font-medium text-[#18181B] dark:text-text">
                {question.title}
              </DialogDescription>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MetaChip label="Type" value={question.tab} />
                <MetaChip label="Difficulty" value={question.difficulty} />
                <MetaChip label="Status" value={question.status} />
                <MetaChip label="Score" value={`${question.score} / ${question.maxScore}`} />
                {question.language ? <MetaChip label="Language" value={question.language} /> : null}
                {question.testCasesPassed ? (
                  <MetaChip label="Test cases" value={question.testCasesPassed} />
                ) : null}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <AnswerBody question={question} />
              {question.aiSummary ? (
                <div className="mt-4 rounded-[14px] border border-[rgb(var(--accent-rgb)/0.15)] bg-[rgb(var(--accent-rgb)/0.04)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">AI evaluation</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#52525B]">{question.aiSummary}</p>
                </div>
              ) : null}
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
