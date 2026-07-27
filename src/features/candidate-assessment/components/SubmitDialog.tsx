"use client";

import { Button } from "@/components/ui/button";
import type { AssessmentSection } from "../types";

interface SubmitDialogProps {
  open: boolean;
  sections: AssessmentSection[];
  onClose: () => void;
  onConfirm: () => void;
}

export function SubmitDialog({ open, sections, onClose, onConfirm }: SubmitDialogProps) {
  if (!open) return null;

  const allQuestions = sections.flatMap((s) => s.questions);
  const answered = allQuestions.filter((q) => q.status === "answered").length;
  const unanswered = allQuestions.filter((q) => q.status === "unanswered").length;
  const marked = allQuestions.filter((q) => q.status === "marked-for-review").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[440px] rounded-[16px] border border-border bg-white p-6 shadow-xl dark:bg-[#1a1a1f]">
        <h2 className="text-lg font-semibold text-text">Submit assessment?</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Please review your progress before submitting.
        </p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-[10px] bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Answered</span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{answered}</span>
          </div>
          <div className="flex items-center justify-between rounded-[10px] bg-[rgba(15,23,42,0.04)] px-4 py-3 dark:bg-white/[0.04]">
            <span className="text-sm font-medium text-text-secondary">Unanswered</span>
            <span className="text-sm font-semibold text-text">{unanswered}</span>
          </div>
          <div className="flex items-center justify-between rounded-[10px] bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Marked for review</span>
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{marked}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Continue assessment
          </Button>
          <Button variant="default" className="flex-1" onClick={onConfirm}>
            Submit assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
