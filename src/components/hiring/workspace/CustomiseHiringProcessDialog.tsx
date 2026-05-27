"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  dialogCloseButtonLg,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import { HiringPipelineEditor } from "@/components/hiring/HiringPipelineEditor";
import {
  areInterviewRoundsValid,
  cloneInterviewRounds,
  getEditableInterviewRounds,
  normalizeInterviewRounds,
  saveEditableInterviewRounds,
} from "@/lib/hiring/customiseHiringProcess";
import type { InterviewRound } from "@/lib/hiring/interviewRounds";
import type { HiringJob } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";

const footerBtnBase =
  "inline-flex h-11 min-h-[44px] items-center justify-center rounded-[11px] px-5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function CustomiseHiringProcessDialog({
  open,
  onOpenChange,
  job,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: HiringJob;
}) {
  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>(() =>
    getEditableInterviewRounds(job),
  );
  const [baseline, setBaseline] = useState<InterviewRound[]>(() => getEditableInterviewRounds(job));

  useEffect(() => {
    if (!open) return;
    const next = getEditableInterviewRounds(job);
    setInterviewRounds(cloneInterviewRounds(next));
    setBaseline(cloneInterviewRounds(next));
  }, [open, job]);

  const isDirty = useMemo(() => {
    return JSON.stringify(interviewRounds) !== JSON.stringify(baseline);
  }, [interviewRounds, baseline]);

  function handleClose() {
    setInterviewRounds(cloneInterviewRounds(baseline));
    onOpenChange(false);
  }

  function handleSave() {
    const trimmed = normalizeInterviewRounds(interviewRounds);
    if (!areInterviewRoundsValid(trimmed)) {
      toast.error("Each interview round needs a unique name");
      return;
    }
    saveEditableInterviewRounds(job.id, trimmed);
    setInterviewRounds(trimmed);
    setBaseline(cloneInterviewRounds(trimmed));
    toast.success("Interview rounds saved", {
      description: `${job.title} interview pipeline updated.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}>
      <DialogPortal>
        <DialogOverlay className="z-[230] bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]" />
        <div
          className={cn(
            "fixed inset-0 z-[230] flex items-center justify-center",
            "px-4 pt-[max(20px,env(safe-area-inset-top))]",
            "pb-[max(20px,env(safe-area-inset-bottom))] sm:px-6",
          )}
        >
          <DialogPanel
            className={cn(
              dashboardCanvas,
              "relative flex w-full max-w-[998px] flex-col overflow-hidden",
              "max-h-[min(720px,calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))]",
              "rounded-[20px] border border-[rgba(15,23,42,0.06)]",
              "shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)]",
            )}
          >
            <DialogTitle className="sr-only">Customise Hiring Process</DialogTitle>
            <DialogDescription className="sr-only">
              Configure fixed applicants and hire stages; edit interview round names for {job.title}.
            </DialogDescription>

            <button
              type="button"
              className={cn("absolute right-3 top-3 z-20 sm:right-5 sm:top-5", dialogCloseButtonLg)}
              aria-label="Close customise hiring process"
              onClick={handleClose}
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>

            <header className="shrink-0 space-y-2 px-4 pb-2 pt-6 sm:px-6 sm:pt-8">
              <h1 className="pr-10 text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-text sm:text-[1.75rem]">
                Customise Hiring Process
              </h1>
              <p className="max-w-xl text-[13px] leading-relaxed text-text-secondary/70">
                Applicants stats and Hire and Offer are fixed. Rename, add, or remove interview rounds
                for this job.
              </p>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">
              <Card
                className={cn(
                  "overflow-hidden rounded-[24px] border border-[rgba(15,23,42,0.06)] bg-white",
                  "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_-16px_rgba(15,23,42,0.12)]",
                  "dark:border-white/[0.06] dark:bg-surface",
                )}
              >
                <CardHeader className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 py-4 sm:px-6 sm:py-5 dark:border-white/[0.06]">
                  <CardTitle className="text-base font-semibold text-text">Hiring pipeline</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
                  <HiringPipelineEditor
                    interviewRounds={interviewRounds}
                    onInterviewRoundsChange={setInterviewRounds}
                  />
                </CardContent>
              </Card>
            </div>

            <footer
              className={cn(
                "shrink-0 border-t border-[rgba(15,23,42,0.06)]",
                "bg-white/95 backdrop-blur-md dark:bg-surface/95",
                "rounded-b-[20px] px-4 pt-3 sm:px-6",
                "pb-[max(16px,env(safe-area-inset-bottom))]",
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    footerBtnBase,
                    "border-[rgba(15,23,42,0.1)] bg-white dark:bg-surface",
                  )}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className={cn(
                    footerBtnBase,
                    "min-w-[9rem] bg-forest text-white hover:bg-forest/90 focus-visible:ring-forest/30",
                  )}
                  disabled={!isDirty}
                  onClick={handleSave}
                >
                  Save Process
                </Button>
              </div>
            </footer>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
