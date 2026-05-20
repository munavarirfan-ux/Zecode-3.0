"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  dialogCloseButtonLg,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import {
  ASSESSMENT_FORM_STEPS,
  createEmptyAssessmentDraft,
  hasAssessmentWizardProgress,
  isAssessmentStepValid,
  maxReachableAssessmentStep,
} from "@/lib/hiring/assessments/assessmentFormSteps";
import type { AssessmentFormDraft, QuestionPoolCategory, SelectedAssessmentQuestion } from "@/lib/hiring/assessments/types";
import { publishAssessment, saveAssessmentDraft } from "@/lib/hiring/assessments/assessmentStore";
import { WizardUnsavedCloseAlert } from "../WizardUnsavedCloseAlert";
import {
  AssessmentFormStepCard,
  AssessmentFormWizardHeader,
} from "./AssessmentFormStepper";
import { AssessmentFormStepContent } from "./AssessmentFormStepContent";
import { AddCustomQuestionDialog } from "./AddCustomQuestionDialog";

const footerBtn =
  "inline-flex h-11 min-h-[44px] items-center justify-center rounded-[11px] px-5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function CreateAssessmentDialog({
  open,
  onOpenChange,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<AssessmentFormDraft>(createEmptyAssessmentDraft);
  const [publishing, setPublishing] = useState(false);
  const [customQuestion, setCustomQuestion] = useState<{
    open: boolean;
    category: QuestionPoolCategory;
  }>({ open: false, category: "Coding" });
  const [unsavedAlertOpen, setUnsavedAlertOpen] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    setDraft(createEmptyAssessmentDraft());
    setPublishing(false);
    setCustomQuestion({ open: false, category: "Coding" });
  }, [open]);

  const addCustomQuestion = (question: SelectedAssessmentQuestion) => {
    setDraft((d) => ({
      ...d,
      selectedQuestions: [
        ...d.selectedQuestions,
        { ...question, sortOrder: d.selectedQuestions.length },
      ],
    }));
  };

  const isLast = stepIndex === ASSESSMENT_FORM_STEPS.length - 1;
  const stepValid = isAssessmentStepValid(stepIndex, draft);
  const maxReachable = useMemo(() => maxReachableAssessmentStep(draft), [draft]);
  const isQuestionsStep = ASSESSMENT_FORM_STEPS[stepIndex]?.key === "questions";
  const hasProgress = useMemo(
    () => hasAssessmentWizardProgress(draft, stepIndex),
    [draft, stepIndex],
  );

  function requestClose() {
    if (!hasProgress) {
      onOpenChange(false);
      return;
    }
    setUnsavedAlertOpen(true);
  }

  function handleDialogOpenChange(next: boolean) {
    if (next) {
      onOpenChange(true);
      return;
    }
    if (publishing) return;
    requestClose();
  }

  async function saveDraftAndClose() {
    setSavingDraft(true);
    try {
      await new Promise((r) => setTimeout(r, 320));
      saveAssessmentDraft(draft);
      toast.success("Assessment saved as draft");
      setUnsavedAlertOpen(false);
      onOpenChange(false);
    } catch {
      toast.error("Could not save draft");
    } finally {
      setSavingDraft(false);
    }
  }

  async function publish() {
    if (!isAssessmentStepValid(0, draft) || !isAssessmentStepValid(1, draft) || !isAssessmentStepValid(2, draft)) {
      toast.error("Complete required steps before publishing");
      return;
    }
    setPublishing(true);
    try {
      await new Promise((r) => setTimeout(r, 480));
      const record = publishAssessment(draft);
      toast.success("Assessment published successfully");
      onOpenChange(false);
      router.push(ROUTES.assessment(record.id));
    } catch {
      toast.error("Could not publish assessment");
      setPublishing(false);
    }
  }

  function goNext() {
    if (!stepValid) {
      toast.error("Complete required fields to continue");
      return;
    }
    if (isLast) {
      void publish();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, ASSESSMENT_FORM_STEPS.length - 1));
  }

  return (
    <>
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[230] bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]" />
        <div className="fixed inset-0 z-[230] flex items-center justify-center px-4 py-5 sm:px-6">
          <DialogPanel
            className={cn(
              dashboardCanvas,
              "relative flex w-full max-w-[1040px] flex-col overflow-hidden",
              "max-h-[min(920px,calc(100dvh-2.5rem))] rounded-[20px] border border-[rgba(15,23,42,0.06)] shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)]",
            )}
            onCloseAutoFocus={(e) => {
              if (returnFocusRef?.current) {
                e.preventDefault();
                returnFocusRef.current.focus();
              }
            }}
            onInteractOutside={(e) => {
              if (hasProgress) {
                e.preventDefault();
                setUnsavedAlertOpen(true);
              }
            }}
            onEscapeKeyDown={(e) => {
              if (hasProgress) {
                e.preventDefault();
                setUnsavedAlertOpen(true);
              }
            }}
          >
            <DialogTitle className="sr-only">Create Assessment</DialogTitle>
            <DialogDescription className="sr-only">Assessment creation wizard</DialogDescription>
            <button
              type="button"
              disabled={publishing}
              className={cn("absolute right-3 top-3 z-20", dialogCloseButtonLg)}
              aria-label="Close"
              onClick={requestClose}
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>

            {publishing ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 py-16">
                <Loader2 className="h-8 w-8 animate-spin text-forest" />
                <p className="text-[15px] font-medium">Publishing assessment…</p>
              </div>
            ) : (
              <form
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
                onSubmit={(e) => {
                  e.preventDefault();
                  goNext();
                }}
              >
                <AssessmentFormWizardHeader
                  currentStepIndex={stepIndex}
                  maxReachableStepIndex={maxReachable}
                  onStepSelect={setStepIndex}
                />
                <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
                  <div className={cn("mx-auto w-full pb-4", isQuestionsStep ? "max-w-full" : "max-w-[900px]")}>
                    {isQuestionsStep ? (
                      <AssessmentFormStepContent
                        stepIndex={stepIndex}
                        draft={draft}
                        onChange={setDraft}
                        onRequestCustomQuestion={(category) =>
                          setCustomQuestion({ open: true, category })
                        }
                      />
                    ) : (
                      <AssessmentFormStepCard stepIndex={stepIndex}>
                        <AssessmentFormStepContent
                          stepIndex={stepIndex}
                          draft={draft}
                          onChange={setDraft}
                          onRequestCustomQuestion={(category) =>
                            setCustomQuestion({ open: true, category })
                          }
                        />
                      </AssessmentFormStepCard>
                    )}
                  </div>
                </div>
                <footer className="shrink-0 border-t bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 dark:bg-surface/95">
                  <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4">
                    {stepIndex > 0 ? (
                      <Button type="button" variant="outline" className={footerBtn} onClick={() => setStepIndex((i) => i - 1)}>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back
                      </Button>
                    ) : (
                      <span />
                    )}
                    <Button type="submit" className={cn(footerBtn, "bg-accent text-white hover:bg-accent-hover")}>
                      {isLast ? "Publish Assessment" : "Continue"}
                    </Button>
                  </div>
                </footer>
              </form>
            )}
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>

    <AddCustomQuestionDialog
      open={customQuestion.open}
      onOpenChange={(o) => setCustomQuestion((c) => ({ ...c, open: o }))}
      category={customQuestion.category}
      sortOrder={draft.selectedQuestions.length}
      onAdd={addCustomQuestion}
    />

    <WizardUnsavedCloseAlert
      open={unsavedAlertOpen}
      onOpenChange={setUnsavedAlertOpen}
      entityLabel="assessment"
      onSaveDraft={saveDraftAndClose}
      savingDraft={savingDraft}
    />
    </>
  );
}
