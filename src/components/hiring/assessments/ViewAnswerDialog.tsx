"use client";

import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Globe,
  Pause,
  Play,
  RotateCcw,
  Terminal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonLg,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AssessmentQuestionResult, ComprehensionSubQuestion, McqOptionResult } from "@/lib/hiring/assessments/types";
import { dashboardPanelInteractive } from "@/components/dashboard/dashboardTokens";

const STATUS_DOT: Record<AssessmentQuestionResult["status"], string> = {
  Passed: "bg-emerald-500",
  Partial: "bg-amber-500",
  Failed: "bg-red-500",
  Skipped: "bg-zinc-400",
};

const STATUS_BADGE: Record<AssessmentQuestionResult["status"], string> = {
  Passed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Partial: "bg-amber-500/10 text-amber-800 dark:text-amber-200",
  Failed: "bg-red-500/10 text-red-700 dark:text-red-300",
  Skipped: "bg-black/[0.04] text-muted",
};

/* ------------------------------------------------------------------ */
/*  Question navigation pill                                           */
/* ------------------------------------------------------------------ */

function QuestionNavPill({
  index,
  question,
  active,
  onClick,
}: {
  index: number;
  question: AssessmentQuestionResult;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-7 min-w-[28px] items-center justify-center rounded-[6px] px-1.5 text-[11px] font-semibold tabular-nums transition-colors",
        active
          ? "bg-accent text-white shadow-sm"
          : "bg-[rgba(15,23,42,0.06)] text-muted hover:bg-[rgba(15,23,42,0.1)] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]",
      )}
    >
      {index + 1}
      <span
        className={cn(
          "absolute -right-0.5 -top-0.5 h-[6px] w-[6px] rounded-full ring-1 ring-white",
          STATUS_DOT[question.status],
        )}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  MCQ Option Row                                                     */
/* ------------------------------------------------------------------ */

function McqOptionRow({ option }: { option: McqOptionResult }) {
  const isCorrectSelected = option.isCorrect && option.isSelected;
  const isWrongSelected = !option.isCorrect && option.isSelected;
  const isCorrectNotSelected = option.isCorrect && !option.isSelected;

  let bg = "bg-white dark:bg-surface";
  let border = "border-[rgba(15,23,42,0.08)] dark:border-white/[0.08]";
  let stateLabel = "";
  let stateColor = "";
  let icon: React.ReactNode = null;

  if (isCorrectSelected) {
    bg = "bg-emerald-50 dark:bg-emerald-500/[0.08]";
    border = "border-emerald-200 dark:border-emerald-500/30";
    stateLabel = "Selected · Correct";
    stateColor = "text-emerald-700 dark:text-emerald-300";
    icon = (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-3 w-3" strokeWidth={3} />
      </div>
    );
  } else if (isWrongSelected) {
    bg = "bg-red-50 dark:bg-red-500/[0.08]";
    border = "border-red-200 dark:border-red-500/30";
    stateLabel = "Candidate selected";
    stateColor = "text-red-700 dark:text-red-300";
    icon = (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
        <X className="h-3 w-3" strokeWidth={3} />
      </div>
    );
  } else if (isCorrectNotSelected) {
    bg = "bg-emerald-50/60 dark:bg-emerald-500/[0.05]";
    border = "border-emerald-200/70 dark:border-emerald-500/20";
    stateLabel = "Correct answer";
    stateColor = "text-emerald-700 dark:text-emerald-300";
    icon = (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-emerald-400 text-emerald-500">
        <Check className="h-3 w-3" strokeWidth={3} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[10px] border px-4 py-3 transition-colors",
        bg,
        border,
      )}
    >
      <span className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
        isCorrectSelected || isCorrectNotSelected
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          : isWrongSelected
            ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
            : "bg-[rgba(15,23,42,0.05)] text-muted dark:bg-white/[0.06]",
      )}>
        {option.letter}
      </span>
      <p className="min-w-0 flex-1 text-[13px] leading-snug text-[#18181B] dark:text-text">
        {option.text}
      </p>
      {icon && (
        <div className="flex shrink-0 items-center gap-2">
          <span className={cn("text-[10px] font-semibold", stateColor)}>
            {stateLabel}
          </span>
          {icon}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MCQ Answer Body                                                    */
/* ------------------------------------------------------------------ */

function McqAnswerBody({
  question,
  mcqQuestions,
  mcqActiveIndex,
}: {
  question: AssessmentQuestionResult;
  mcqQuestions: AssessmentQuestionResult[];
  mcqActiveIndex: number;
}) {
  const options = question.mcqOptions ?? [];
  const selectedLetters = options.filter((o) => o.isSelected).map((o) => o.letter);
  const correctLetters = options.filter((o) => o.isCorrect).map((o) => o.letter);

  return (
    <div className="grid h-full grid-cols-1 gap-0 lg:grid-cols-[42%_1fr]">
      {/* Left — Question */}
      <div className="flex flex-col overflow-y-auto border-r border-[rgba(15,23,42,0.06)] p-5 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Question {mcqActiveIndex + 1} of {mcqQuestions.length}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold text-muted dark:bg-white/[0.06]">
            MCQ
          </span>
          <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted dark:bg-white/[0.06]">
            {question.difficulty}
          </span>
          {question.mcqAnswerType === "multiple" && (
            <span className="rounded-[5px] bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-300">
              Multi-select
            </span>
          )}
        </div>
        <h3 className="mt-4 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-[#18181B] dark:text-text">
          {question.title}
        </h3>
        {question.problemStatement && (
          <p className="mt-3 text-[13px] leading-relaxed text-[#52525B] dark:text-text-secondary">
            {question.problemStatement}
          </p>
        )}
      </div>

      {/* Right — Options + Summary */}
      <div className="flex flex-col overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Answer Options
          </span>
          <span
            className={cn(
              "rounded-[5px] px-2 py-0.5 text-[10px] font-semibold",
              STATUS_BADGE[question.status],
            )}
          >
            {question.status === "Passed" ? "Correct" : question.status === "Failed" ? "Incorrect" : question.status === "Skipped" ? "Unanswered" : "Partial"}
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          {options.map((option) => (
            <McqOptionRow key={option.letter} option={option} />
          ))}
        </div>

        {/* Summary strip */}
        <div className={cn(
          "mt-4 flex items-center gap-4 rounded-[8px] border px-4 py-2.5",
          "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] dark:border-white/[0.06] dark:bg-white/[0.02]",
        )}>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted">
              {question.mcqAnswerType === "multiple" ? "Selected:" : "Selected:"}
            </span>
            <span className="text-[11px] font-semibold text-[#18181B] dark:text-text">
              {selectedLetters.length > 0 ? selectedLetters.join(", ") : "None"}
            </span>
          </div>
          <div className="h-3 w-px bg-[rgba(15,23,42,0.1)] dark:bg-white/[0.1]" />
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted">
              {question.mcqAnswerType === "multiple" ? "Correct:" : "Correct:"}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              {correctLetters.join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Theory Answer Body (Open Ended, Fill in the Blanks, Comprehension) */
/* ------------------------------------------------------------------ */

function TheoryAnswerBody({
  question,
  theoryQuestions,
  theoryActiveIndex,
}: {
  question: AssessmentQuestionResult;
  theoryQuestions: AssessmentQuestionResult[];
  theoryActiveIndex: number;
}) {
  const isFillBlanks = question.tab === "Fill in the Blanks";
  const isOpenEnded = question.tab === "Open Ended" || question.tab === "Comprehension";
  const [manualScore, setManualScore] = useState(String(question.score));
  const [feedback, setFeedback] = useState(question.evaluatorNotes ?? "");

  return (
    <div className="grid h-full grid-cols-1 gap-0 lg:grid-cols-[42%_1fr]">
      {/* Left — Question */}
      <div className="flex flex-col overflow-y-auto border-r border-[rgba(15,23,42,0.06)] p-5 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Question {theoryActiveIndex + 1} of {theoryQuestions.length}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold text-muted dark:bg-white/[0.06]">
            {question.tab}
          </span>
          <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted dark:bg-white/[0.06]">
            {question.difficulty}
          </span>
        </div>
        <h3 className="mt-4 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-[#18181B] dark:text-text">
          {question.title}
        </h3>
        {question.problemStatement && (
          <p className="mt-3 text-[13px] leading-relaxed text-[#52525B] dark:text-text-secondary">
            {question.problemStatement}
          </p>
        )}
      </div>

      {/* Right — Answer + Scoring */}
      <div className="flex flex-col overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Candidate Response
          </span>
          <span
            className={cn(
              "rounded-[5px] px-2 py-0.5 text-[10px] font-semibold",
              STATUS_BADGE[question.status],
            )}
          >
            {question.status}
          </span>
        </div>

        {isFillBlanks ? (
          <div className="mt-3 space-y-3">
            <div className={cn(
              "rounded-[10px] border px-4 py-3",
              question.status === "Passed"
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/[0.08]"
                : question.status === "Failed"
                  ? "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/[0.08]"
                  : "border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08] dark:bg-surface",
            )}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Candidate answer
              </p>
              <p className="mt-2 text-[14px] font-medium text-[#18181B] dark:text-text">
                {question.candidateAnswer || "—"}
              </p>
            </div>
            <div className="rounded-[10px] border border-emerald-200/70 bg-emerald-50/60 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/[0.05]">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Correct answer
              </p>
              <p className="mt-2 text-[14px] font-medium text-[#18181B] dark:text-text">
                {question.correctAnswer || "—"}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <div className={cn(
              "rounded-[10px] border px-4 py-4",
              "border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08] dark:bg-surface",
            )}>
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#3F3F46] dark:text-text-secondary">
                {question.candidateAnswer ?? question.submittedCode ?? "No response submitted"}
              </p>
            </div>
          </div>
        )}

        {/* Score + Feedback for Open Ended / Comprehension */}
        {isOpenEnded && (
          <div className="mt-4 space-y-3">
            <div className={cn(
              "rounded-[10px] border px-4 py-3",
              "border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08] dark:bg-surface",
            )}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Score
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={question.maxScore}
                  value={manualScore}
                  onChange={(e) => setManualScore(e.target.value)}
                  className="h-9 w-20 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.02)] px-3 text-center text-[14px] font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]"
                />
                <span className="text-[13px] text-muted">/ {question.maxScore}</span>
                <Button
                  type="button"
                  size="sm"
                  className="ml-auto h-8 rounded-[8px] bg-accent px-3 text-[11px] font-medium text-white hover:bg-accent/90"
                  onClick={() => toast.success("Score saved")}
                >
                  Save score
                </Button>
              </div>
            </div>

            <div className={cn(
              "rounded-[10px] border px-4 py-3",
              "border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08] dark:bg-surface",
            )}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Comments & Feedback
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add evaluation notes, feedback for candidate, or internal comments..."
                rows={3}
                className="mt-2 w-full resize-none rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.02)] px-3 py-2 text-[12px] leading-relaxed text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-text"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  className="h-8 rounded-[8px] bg-accent px-3 text-[11px] font-medium text-white hover:bg-accent/90"
                  onClick={() => toast.success("Feedback saved")}
                >
                  Save feedback
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Summary strip (non-open-ended) */}
        {!isOpenEnded && (
          <div className={cn(
            "mt-4 flex items-center gap-4 rounded-[8px] border px-4 py-2.5",
            "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] dark:border-white/[0.06] dark:bg-white/[0.02]",
          )}>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted">Score:</span>
              <span className="text-[11px] font-semibold text-[#18181B] dark:text-text">
                {question.score}/{question.maxScore}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Comprehension Answer Body                                          */
/* ------------------------------------------------------------------ */

function ComprehensionSubQuestionRow({
  subQ,
  index,
}: {
  subQ: ComprehensionSubQuestion;
  index: number;
}) {
  const correctOption = subQ.options.find((o) => o.isCorrect);
  const selectedOption = subQ.options.find((o) => o.isSelected);
  const isCorrect = subQ.status === "Passed";
  const isSkipped = subQ.status === "Skipped";

  return (
    <div className={cn(
      "rounded-[10px] border px-4 py-3",
      isCorrect
        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/[0.04]"
        : isSkipped
          ? "border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08] dark:bg-surface"
          : "border-red-200 bg-red-50/50 dark:border-red-500/20 dark:bg-red-500/[0.04]",
    )}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-medium leading-snug text-[#18181B] dark:text-text">
          <span className="mr-1.5 text-[11px] font-bold text-muted">{index + 1}.</span>
          {subQ.question}
        </p>
        <span className={cn(
          "shrink-0 rounded-[5px] px-1.5 py-0.5 text-[9px] font-semibold",
          isCorrect
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : isSkipped
              ? "bg-black/[0.04] text-muted"
              : "bg-red-500/10 text-red-700 dark:text-red-300",
        )}>
          {isCorrect ? "Correct" : isSkipped ? "Skipped" : "Wrong"}
        </span>
      </div>

      <div className="mt-2.5 space-y-1.5">
        {subQ.options.map((opt) => {
          const isSelected = opt.isSelected;
          const isRight = opt.isCorrect;
          const showGreen = isRight;
          const showRed = isSelected && !isRight;

          return (
            <div
              key={opt.letter}
              className={cn(
                "flex items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-[11px]",
                showGreen
                  ? "bg-emerald-100/80 dark:bg-emerald-500/[0.1]"
                  : showRed
                    ? "bg-red-100/80 dark:bg-red-500/[0.1]"
                    : "bg-transparent",
              )}
            >
              <span className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                showGreen
                  ? "bg-emerald-500 text-white"
                  : showRed
                    ? "bg-red-500 text-white"
                    : "bg-[rgba(15,23,42,0.06)] text-muted dark:bg-white/[0.08]",
              )}>
                {showGreen ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : showRed ? <X className="h-2.5 w-2.5" strokeWidth={3} /> : opt.letter}
              </span>
              <span className={cn(
                "leading-snug",
                showGreen ? "font-medium text-emerald-800 dark:text-emerald-200" : showRed ? "font-medium text-red-800 dark:text-red-200" : "text-[#3F3F46] dark:text-text-secondary",
              )}>
                {opt.text}
              </span>
              {isSelected && !isRight && (
                <span className="ml-auto text-[9px] font-semibold text-red-600 dark:text-red-300">Selected</span>
              )}
              {isRight && isSelected && (
                <span className="ml-auto text-[9px] font-semibold text-emerald-600 dark:text-emerald-300">Selected</span>
              )}
              {isRight && !isSelected && (
                <span className="ml-auto text-[9px] font-semibold text-emerald-600 dark:text-emerald-300">Correct</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComprehensionAnswerBody({
  question,
  compQuestions,
  compActiveIndex,
}: {
  question: AssessmentQuestionResult;
  compQuestions: AssessmentQuestionResult[];
  compActiveIndex: number;
}) {
  const passage = question.comprehensionPassage ?? "";
  const subQuestions = question.comprehensionQuestions ?? [];
  const correctCount = subQuestions.filter((q) => q.status === "Passed").length;

  return (
    <div className="grid h-full grid-cols-1 gap-0 lg:grid-cols-[45%_1fr]">
      {/* Left — Passage */}
      <div className="flex flex-col overflow-y-auto border-r border-[rgba(15,23,42,0.06)] p-5 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Question {compActiveIndex + 1} of {compQuestions.length}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold text-muted dark:bg-white/[0.06]">
            Comprehension
          </span>
          <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted dark:bg-white/[0.06]">
            {question.difficulty}
          </span>
        </div>
        <h3 className="mt-3 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#18181B] dark:text-text">
          {question.title}
        </h3>
        <div className="mt-4 rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-white p-4 dark:border-white/[0.06] dark:bg-surface">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Reading Passage
          </p>
          <div className="mt-3 whitespace-pre-wrap text-[12.5px] leading-[1.75] text-[#3F3F46] dark:text-text-secondary">
            {passage}
          </div>
        </div>
      </div>

      {/* Right — Sub-questions */}
      <div className="flex flex-col overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Passage Questions ({subQuestions.length})
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
              {correctCount}/{subQuestions.length} correct
            </span>
            <span
              className={cn(
                "rounded-[5px] px-2 py-0.5 text-[10px] font-semibold",
                STATUS_BADGE[question.status],
              )}
            >
              {question.status}
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {subQuestions.map((subQ, i) => (
            <ComprehensionSubQuestionRow key={subQ.id} subQ={subQ} index={i} />
          ))}
        </div>

        {/* Summary strip */}
        <div className={cn(
          "mt-4 flex items-center gap-4 rounded-[8px] border px-4 py-2.5",
          "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] dark:border-white/[0.06] dark:bg-white/[0.02]",
        )}>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted">Score:</span>
            <span className="text-[11px] font-semibold text-[#18181B] dark:text-text">
              {question.score}/{question.maxScore}
            </span>
          </div>
          <div className="h-3 w-px bg-[rgba(15,23,42,0.1)] dark:bg-white/[0.1]" />
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted">Correct:</span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              {correctCount}
            </span>
          </div>
          <div className="h-3 w-px bg-[rgba(15,23,42,0.1)] dark:bg-white/[0.1]" />
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted">Wrong:</span>
            <span className="text-[11px] font-semibold text-red-700 dark:text-red-300">
              {subQuestions.filter((q) => q.status === "Failed").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Code editor panel                                                  */
/* ------------------------------------------------------------------ */

function CodeEditorPanel({ question }: { question: AssessmentQuestionResult }) {
  const [copied, setCopied] = useState(false);
  const code =
    question.submittedCode ??
    question.candidateFixedSnippet ??
    question.candidateAnswer ??
    "";

  const lines = code.split("\n");

  async function copyCode() {
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
    <div className="flex h-full flex-col overflow-hidden rounded-[12px] border border-[#1e293b] bg-[#0f172a]">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Submitted Code
          </span>
          {question.language && (
            <span className="rounded-[5px] bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
              {question.language}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 rounded-[6px] px-1.5 text-[10px] text-slate-400 hover:bg-white/10 hover:text-white"
          onClick={copyCode}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          Copy
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {code ? (
          <div className="flex">
            <div className="shrink-0 select-none border-r border-white/[0.06] bg-[#0c1220] px-2.5 pt-2.5 text-right font-mono text-[11px] leading-[1.7] text-slate-600">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="flex-1 overflow-x-auto whitespace-pre p-2.5 font-mono text-[11.5px] leading-[1.7] text-slate-200">
              {code}
            </pre>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-slate-500">
            No code submitted
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Output / Test Cases panel (center)                                 */
/* ------------------------------------------------------------------ */

function OutputTestPanel({ question }: { question: AssessmentQuestionResult }) {
  const [activeTab, setActiveTab] = useState<"output" | "testcases">("output");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08] dark:bg-surface">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-[rgba(15,23,42,0.06)] px-2.5 py-1.5 dark:border-white/[0.06]">
        <Button
          type="button"
          size="sm"
          className="h-6 gap-1 rounded-[6px] bg-emerald-600 px-2 text-[10px] font-medium text-white hover:bg-emerald-700"
          disabled
        >
          <Play className="h-2.5 w-2.5" fill="currentColor" />
          Run Code
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-6 gap-1 rounded-[6px] bg-accent px-2 text-[10px] font-medium text-white hover:bg-accent/90"
          disabled
        >
          <Terminal className="h-2.5 w-2.5" />
          Run Tests
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto h-6 gap-1 rounded-[6px] px-1.5 text-[10px] text-muted hover:text-text"
          disabled
        >
          <RotateCcw className="h-2.5 w-2.5" />
          Clear
        </Button>
      </div>

      <div className="flex shrink-0 border-b border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]">
        <button
          type="button"
          onClick={() => setActiveTab("output")}
          className={cn(
            "px-3 py-1.5 text-[11px] font-medium transition-colors",
            activeTab === "output"
              ? "border-b-2 border-accent text-accent"
              : "text-muted hover:text-text",
          )}
        >
          Output
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("testcases")}
          className={cn(
            "px-3 py-1.5 text-[11px] font-medium transition-colors",
            activeTab === "testcases"
              ? "border-b-2 border-accent text-accent"
              : "text-muted hover:text-text",
          )}
        >
          Test Cases
          {question.testCaseResults && (
            <span className="ml-1 text-[10px] text-muted">
              ({question.testCaseResults.filter((tc) => tc.passed).length}/
              {question.testCaseResults.length})
            </span>
          )}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {activeTab === "output" ? (
          <div className="h-full bg-[#0f172a] p-3 font-mono text-[11px] leading-relaxed text-slate-300">
            {question.executionOutput || question.actualOutput || (
              <span className="text-slate-500">No output available</span>
            )}
          </div>
        ) : (
          <div className="p-2">
            {question.testCaseResults && question.testCaseResults.length > 0 ? (
              <ul className="space-y-1">
                {question.testCaseResults.map((tc) => (
                  <li
                    key={tc.name}
                    className={cn(
                      "rounded-[8px] border px-2.5 py-2 text-[11px]",
                      tc.passed
                        ? "border-emerald-500/15 bg-emerald-500/[0.04]"
                        : "border-red-500/15 bg-red-500/[0.04]",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#18181B] dark:text-text">
                        {tc.name}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                          tc.passed
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-red-500/10 text-red-700",
                        )}
                      >
                        {tc.passed ? "Passed" : "Failed"}
                      </span>
                    </div>
                    {(tc.expected || tc.actual) && (
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                        {tc.expected && (
                          <div>
                            <span className="text-muted">Expected: </span>
                            <span className="text-[#3F3F46]">{tc.expected}</span>
                          </div>
                        )}
                        {tc.actual && (
                          <div>
                            <span className="text-muted">Actual: </span>
                            <span className="text-[#3F3F46]">{tc.actual}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-[11px] text-muted">
                No test case results
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Evaluation panel (right)                                           */
/* ------------------------------------------------------------------ */

function EvaluationPanel({ question }: { question: AssessmentQuestionResult }) {
  const [manualScore, setManualScore] = useState(String(question.score));

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      {/* Test cases card */}
      {question.testCasesPassed && (
        <div className={cn(dashboardPanelInteractive, "p-3")}>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">
            Test Cases Passed
          </p>
          <p className="mt-1 text-[20px] font-bold tabular-nums leading-tight text-[#18181B] dark:text-text">
            {question.testCasesPassed}
          </p>
        </div>
      )}

      {/* Score card */}
      <div className={cn(dashboardPanelInteractive, "p-3")}>
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">
          Score
        </p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-[20px] font-bold tabular-nums leading-tight text-[#18181B] dark:text-text">
            {question.score}
          </span>
          <span className="text-[13px] text-muted">/ {question.maxScore}</span>
        </div>
        <span
          className={cn(
            "mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
            STATUS_BADGE[question.status],
          )}
        >
          {question.status}
        </span>
      </div>

      {/* Manual score */}
      <div className={cn(dashboardPanelInteractive, "p-3")}>
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">
          Manual Score
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            max={question.maxScore}
            value={manualScore}
            onChange={(e) => setManualScore(e.target.value)}
            className="h-8 w-full rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-white px-2.5 text-center text-[13px] font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]"
          />
          <span className="shrink-0 text-[12px] text-muted">/ {question.maxScore}</span>
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-2 h-8 w-full rounded-[8px] bg-accent text-[11px] font-medium text-white hover:bg-accent/90"
          onClick={() => toast.success("Score saved")}
        >
          Save Score
        </Button>
      </div>

      {/* Metadata */}
      <div className={cn(dashboardPanelInteractive, "p-3")}>
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">
          Attempt Details
        </p>
        <dl className="mt-2 space-y-2 text-[11px]">
          {question.language && (
            <div className="flex items-center gap-2">
              <Code2 className="h-3 w-3 shrink-0 text-muted" />
              <dt className="text-muted">Language</dt>
              <dd className="ml-auto font-medium text-[#18181B] dark:text-text">
                {question.language}
              </dd>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3 shrink-0 text-muted" />
            <dt className="text-muted">Type</dt>
            <dd className="ml-auto font-medium text-[#18181B] dark:text-text">
              {question.tab}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 shrink-0 text-muted" />
            <dt className="text-muted">Difficulty</dt>
            <dd className="ml-auto font-medium capitalize text-[#18181B] dark:text-text">
              {question.difficulty}
            </dd>
          </div>
        </dl>
      </div>

    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Non-code answer body (Open Ended, Fill in the Blanks, etc.)        */
/* ------------------------------------------------------------------ */

function NonCodeAnswerBody({ question }: { question: AssessmentQuestionResult }) {
  if (question.tab === "Fill in the Blanks") {
    return (
      <div className="grid h-full grid-cols-1 gap-2 p-2 lg:grid-cols-[1fr_1fr_280px]">
        <div className={cn(dashboardPanelInteractive, "flex flex-col p-4")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Candidate answer
          </p>
          <p className="mt-3 text-[14px] font-medium text-[#18181B] dark:text-text">
            {question.candidateAnswer ?? "—"}
          </p>
        </div>
        <div className={cn(dashboardPanelInteractive, "flex flex-col p-4")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Correct answer
          </p>
          <p className="mt-3 text-[14px] font-medium text-[#18181B] dark:text-text">
            {question.correctAnswer ?? "—"}
          </p>
        </div>
        <EvaluationPanel question={question} />
      </div>
    );
  }

  if (question.tab === "Open Ended") {
    return (
      <div className="grid h-full grid-cols-1 gap-2 p-2 lg:grid-cols-[1fr_280px]">
        <div className={cn(dashboardPanelInteractive, "flex flex-col overflow-auto p-4")}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Candidate response
          </p>
          <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-[#3F3F46] dark:text-text-secondary">
            {question.candidateAnswer ?? question.submittedCode ?? "—"}
          </p>
        </div>
        <EvaluationPanel question={question} />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 gap-2 p-2 lg:grid-cols-[1fr_280px]">
      <div className="space-y-2 overflow-auto">
        {question.submittedCode && (
          <div className="overflow-hidden rounded-[12px] border border-[#1e293b] bg-[#0f172a]">
            <div className="border-b border-white/10 px-3 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Submitted answer
              </span>
            </div>
            <pre className="overflow-auto p-3 font-mono text-[11px] leading-relaxed text-slate-200">
              {question.submittedCode}
            </pre>
          </div>
        )}
        {question.executionOutput && (
          <div className={cn(dashboardPanelInteractive, "p-4")}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              Output
            </p>
            <p className="mt-2 font-mono text-[11px]">{question.executionOutput}</p>
          </div>
        )}
      </div>
      <EvaluationPanel question={question} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Playback bar                                                       */
/* ------------------------------------------------------------------ */

function PlaybackBar({ question }: { question: AssessmentQuestionResult }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<"1x" | "1.5x" | "2x">("1x");
  const [progress, setProgress] = useState(0);

  const totalSeconds = 42 * 60 + 17;
  const currentSeconds = Math.round((progress / 100) * totalSeconds);
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-1.5">
      <button
        type="button"
        onClick={() =>
          setSpeed((p) => (p === "1x" ? "1.5x" : p === "1.5x" ? "2x" : "1x"))
        }
        className="shrink-0 rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted transition-colors hover:bg-[rgba(15,23,42,0.1)] dark:bg-white/[0.06]"
      >
        {speed}
      </button>
      <button
        type="button"
        onClick={() => setPlaying(!playing)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90"
      >
        {playing ? (
          <Pause className="h-2.5 w-2.5" fill="currentColor" />
        ) : (
          <Play className="h-2.5 w-2.5 translate-x-[1px]" fill="currentColor" />
        )}
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[rgba(15,23,42,0.1)] accent-accent outline-none [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent dark:bg-white/[0.1]"
        />
        <span className="shrink-0 text-[10px] tabular-nums text-muted">
          {fmt(currentSeconds)} / {fmt(totalSeconds)}
        </span>
      </div>

      {/* Compact score summary */}
      <div className="hidden shrink-0 items-center gap-2 border-l border-[rgba(15,23,42,0.06)] pl-3 sm:flex dark:border-white/[0.06]">
        {question.testCasesPassed && (
          <span className="text-[10px] tabular-nums text-muted">
            Tests: <span className="font-semibold text-[#18181B] dark:text-text">{question.testCasesPassed}</span>
          </span>
        )}
        <span className="text-[10px] tabular-nums text-muted">
          Score:{" "}
          <span className={cn("font-semibold", STATUS_BADGE[question.status].split(" ").find(c => c.startsWith("text-")) ?? "text-[#18181B]")}>
            {question.score}/{question.maxScore}
          </span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main dialog                                                        */
/* ------------------------------------------------------------------ */

function isCodeQuestion(q: AssessmentQuestionResult) {
  return (
    q.tab === "Coding" ||
    q.tab === "Debug Snippet" ||
    q.tab === "Database"
  );
}

function isMcqQuestion(q: AssessmentQuestionResult) {
  return q.tab === "MCQ";
}

function isTheoryQuestion(q: AssessmentQuestionResult) {
  return (
    q.tab === "MCQ" ||
    q.tab === "Open Ended" ||
    q.tab === "Fill in the Blanks" ||
    q.tab === "Comprehension"
  );
}

export function ViewAnswerDialog({
  open,
  onOpenChange,
  questions,
  activeIndex,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: AssessmentQuestionResult[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}) {
  const question = questions[activeIndex];
  if (!question) return null;

  const isMcq = isMcqQuestion(question);
  const isTheory = isTheoryQuestion(question);

  // When viewing a theory question, scope navigation to same-tab questions only
  const scopedTab = isTheory ? question.tab : null;
  const scopedIndices = scopedTab
    ? questions.reduce<number[]>((acc, q, i) => (q.tab === scopedTab ? [...acc, i] : acc), [])
    : [];
  const scopedQuestions = scopedTab ? scopedIndices.map((i) => questions[i]) : [];
  const scopedActiveIndex = scopedTab ? scopedIndices.indexOf(activeIndex) : 0;

  const navQuestions = isTheory ? scopedQuestions : questions;
  const navActiveIndex = isTheory ? scopedActiveIndex : activeIndex;
  const hasPrev = navActiveIndex > 0;
  const hasNext = navActiveIndex < navQuestions.length - 1;

  function handleNav(navIdx: number) {
    if (isTheory) {
      onNavigate(scopedIndices[navIdx]);
    } else {
      onNavigate(navIdx);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[250] bg-[rgba(15,23,42,0.5)] backdrop-blur-[6px]" />
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3">
          <DialogPanel
            className={cn(
              "relative flex flex-col overflow-hidden rounded-[16px]",
              "h-[90vh] w-[96vw]",
              "border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.28)] dark:bg-surface",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            {/* ── Top bar ── */}
            <div className="flex shrink-0 items-center gap-2 border-b border-[rgba(15,23,42,0.06)] px-3 py-2 dark:border-white/[0.06]">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => handleNav(navActiveIndex - 1)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-[rgba(15,23,42,0.06)] disabled:opacity-30 dark:hover:bg-white/[0.06]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {navQuestions.map((q, i) => (
                  <QuestionNavPill
                    key={q.id}
                    index={i}
                    question={q}
                    active={i === navActiveIndex}
                    onClick={() => handleNav(i)}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={!hasNext}
                onClick={() => handleNav(navActiveIndex + 1)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-[rgba(15,23,42,0.06)] disabled:opacity-30 dark:hover:bg-white/[0.06]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="flex-1" />

              <DialogClose
                className={dialogCloseButtonLg}
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              </DialogClose>
            </div>

            {/* ── Question header (code questions only) ── */}
            {!isTheory && (
              <div className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-4 py-2 dark:border-white/[0.06]">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <DialogTitle className="flex items-baseline gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Question {activeIndex + 1} of {questions.length}
                      </span>
                    </DialogTitle>
                    <DialogDescription className="mt-0.5 truncate text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
                      {question.title}
                    </DialogDescription>
                    {question.problemStatement && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-[#52525B] dark:text-text-secondary">
                        {question.problemStatement}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold text-muted dark:bg-white/[0.06]">
                      {question.tab}
                    </span>
                    <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted dark:bg-white/[0.06]">
                      {question.difficulty}
                    </span>
                    <span
                      className={cn(
                        "rounded-[5px] px-1.5 py-0.5 text-[10px] font-semibold",
                        STATUS_BADGE[question.status],
                      )}
                    >
                      {question.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Hidden accessible title for theory questions ── */}
            {isTheory && (
              <>
                <DialogTitle className="sr-only">{question.title}</DialogTitle>
                <DialogDescription className="sr-only">{question.tab} answer review</DialogDescription>
              </>
            )}

            {/* ── Workspace body ── */}
            <div className="min-h-0 flex-1 overflow-hidden bg-[#F5F7FA] dark:bg-app-bg">
              {isMcq ? (
                <McqAnswerBody
                  question={question}
                  mcqQuestions={scopedQuestions}
                  mcqActiveIndex={scopedActiveIndex}
                />
              ) : question.tab === "Comprehension" ? (
                <ComprehensionAnswerBody
                  question={question}
                  compQuestions={scopedQuestions}
                  compActiveIndex={scopedActiveIndex}
                />
              ) : isTheory ? (
                <TheoryAnswerBody
                  question={question}
                  theoryQuestions={scopedQuestions}
                  theoryActiveIndex={scopedActiveIndex}
                />
              ) : (
                <div className="grid h-full grid-cols-1 gap-2 p-2 lg:grid-cols-[45%_minmax(0,1fr)_260px]">
                  <CodeEditorPanel question={question} />
                  <OutputTestPanel question={question} />
                  <EvaluationPanel question={question} />
                </div>
              )}
            </div>

            {/* ── Bottom playback bar (code questions only) ── */}
            {!isTheory && (
              <div className="shrink-0 border-t border-[rgba(15,23,42,0.06)] bg-white dark:border-white/[0.06] dark:bg-surface">
                <PlaybackBar question={question} />
              </div>
            )}
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
