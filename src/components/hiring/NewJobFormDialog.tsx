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
import { createHiringJob, createHiringJobDraft } from "@/lib/hiring/createHiringJob";
import { createDefaultHiringStages, type JobHiringStageConfig } from "@/lib/hiring/jobHiringStages";
import { CUSTOM_FIELD_DEFS, DEPARTMENTS, LOCATIONS } from "@/lib/hiring/mockData";
import { JOB_FORM_STEPS, hasJobWizardProgress, isJobFormStepValid } from "@/lib/hiring/jobFormSteps";
import type { CustomFieldDef } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import { JobFormStepContent, type JobAdditionalDetails, type JobBasicDetails } from "./JobFormStepContent";
import { JobFormStepCard, JobFormWizardHeader } from "./JobFormStepper";
import { JobHiringStagesStep } from "./JobHiringStagesStep";
import { WizardUnsavedCloseAlert } from "./WizardUnsavedCloseAlert";

const footerBtnBase =
  "inline-flex h-11 min-h-[44px] items-center justify-center rounded-[11px] px-5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const BUILTIN_CUSTOM_FIELD_IDS = new Set(CUSTOM_FIELD_DEFS.map((f) => f.id));

const INITIAL_BASIC: JobBasicDetails = {
  title: "",
  department: DEPARTMENTS[0],
  location: LOCATIONS[0],
  workMode: "Hybrid",
  employmentType: "Full-time",
  experienceLevel: "Senior",
  hiringManager: "Elena Hoffmann",
  recruiterOwner: "Marcus Chen",
};

const INITIAL_ADDITIONAL: JobAdditionalDetails = {
  description: "",
  responsibilities: "",
  requiredSkills: "",
  niceToHave: "",
  salaryRange: "",
  openings: "1",
  deadline: "",
  visibility: "Internal + External",
};

export function NewJobFormDialog({
  open,
  onOpenChange,
  onCreated,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (jobId: string) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [showTitleError, setShowTitleError] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [customFieldCatalog, setCustomFieldCatalog] = useState<CustomFieldDef[]>(() => [
    ...CUSTOM_FIELD_DEFS,
  ]);
  const [selectedCustomFieldIds, setSelectedCustomFieldIds] = useState<string[]>([]);
  const [basic, setBasic] = useState<JobBasicDetails>(INITIAL_BASIC);
  const [additional, setAdditional] = useState<JobAdditionalDetails>(INITIAL_ADDITIONAL);
  const [hiringStages, setHiringStages] = useState<JobHiringStageConfig[]>(() =>
    createDefaultHiringStages(),
  );
  const [unsavedAlertOpen, setUnsavedAlertOpen] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    setShowTitleError(false);
    setPublishing(false);
    setCustomFieldCatalog([...CUSTOM_FIELD_DEFS]);
    setSelectedCustomFieldIds([]);
    setBasic({ ...INITIAL_BASIC, department: DEPARTMENTS[0], location: LOCATIONS[0] });
    setAdditional({ ...INITIAL_ADDITIONAL });
    setHiringStages(createDefaultHiringStages());
  }, [open]);

  const isLastStep = stepIndex === JOB_FORM_STEPS.length - 1;
  const isStepValid = isJobFormStepValid(stepIndex, basic, hiringStages);
  const maxReachableStepIndex = useMemo(() => {
    let max = 0;
    for (let i = 0; i < JOB_FORM_STEPS.length; i++) {
      if (isJobFormStepValid(i, basic, hiringStages)) max = i;
      else break;
    }
    return max;
  }, [basic, hiringStages]);

  const titleError = showTitleError && !basic.title.trim() ? "Job title is required" : undefined;
  const currentStepKey = JOB_FORM_STEPS[stepIndex]?.key;
  const hasProgress = useMemo(
    () => hasJobWizardProgress(stepIndex, basic, additional),
    [stepIndex, basic, additional],
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
      createHiringJobDraft({ basic, additional, hiringStages });
      toast.success("Job saved as draft");
      setUnsavedAlertOpen(false);
      onOpenChange(false);
    } catch {
      toast.error("Could not save draft");
    } finally {
      setSavingDraft(false);
    }
  }

  async function publishJob() {
    if (!isJobFormStepValid(stepIndex, basic, hiringStages)) return;
    setPublishing(true);
    try {
      await new Promise((r) => setTimeout(r, 480));
      const job = createHiringJob({ basic, additional, hiringStages });
      toast.success("Job published successfully");
      onCreated?.(job.id);
      onOpenChange(false);
      router.push(`${ROUTES.hiringJob(job.id)}?published=1`);
    } catch {
      toast.error("Could not publish job. Please try again.");
      setPublishing(false);
    }
  }

  function goNext() {
    if (!isStepValid) {
      if (stepIndex === 0) setShowTitleError(true);
      return;
    }
    if (isLastStep) {
      void publishJob();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, JOB_FORM_STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleAddCustomField(field: CustomFieldDef) {
    setCustomFieldCatalog((prev) => [...prev, field]);
  }

  function handleRemoveCustomField(id: string) {
    setCustomFieldCatalog((prev) => prev.filter((f) => f.id !== id));
    setSelectedCustomFieldIds((prev) => prev.filter((x) => x !== id));
  }

  return (
    <>
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
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
              "relative flex w-full max-w-[960px] flex-col overflow-hidden",
              "max-h-[min(900px,calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))]",
              "rounded-[20px] border border-[rgba(15,23,42,0.06)]",
              "shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)]",
            )}
            onCloseAutoFocus={(event) => {
              if (returnFocusRef?.current) {
                event.preventDefault();
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
            <DialogTitle className="sr-only">Add New Job</DialogTitle>
            <button
              type="button"
              disabled={publishing}
              className={cn(
                "absolute right-3 top-3 z-20 sm:right-5 sm:top-5",
                dialogCloseButtonLg,
              )}
              aria-label="Close add job modal"
              onClick={requestClose}
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>

            <DialogDescription className="sr-only">
              Add New Job — configure basic details, additional details, custom fields, and hiring
              stages.
            </DialogDescription>

            {publishing ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-8 py-16">
                <Loader2 className="h-8 w-8 animate-spin text-forest" aria-hidden />
                <p className="text-[15px] font-medium text-[#18181B]">Publishing your job…</p>
                <p className="text-[13px] text-[#71717A]">Setting up pipeline and workspace</p>
              </div>
            ) : null}

            <form
              noValidate
              className={cn(
                "flex min-h-0 flex-1 flex-col overflow-hidden",
                publishing && "pointer-events-none invisible absolute inset-0",
              )}
              onSubmit={(e) => {
                e.preventDefault();
                goNext();
              }}
              aria-label="Add new job"
            >
              <JobFormWizardHeader
                currentStepIndex={stepIndex}
                maxReachableStepIndex={maxReachableStepIndex}
                onStepSelect={setStepIndex}
              />

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">
                <div className="mx-auto w-full max-w-[900px] pb-4">
                  {currentStepKey === "hiring-stages" ? (
                    <div className="mx-auto w-full max-w-[640px] pt-2 sm:pt-4">
                      <JobHiringStagesStep stages={hiringStages} onChange={setHiringStages} />
                    </div>
                  ) : (
                    <JobFormStepCard stepIndex={stepIndex}>
                      <JobFormStepContent
                        stepIndex={stepIndex}
                        basic={basic}
                        onBasicChange={(next) => {
                          setBasic(next);
                          if (next.title.trim()) setShowTitleError(false);
                        }}
                        additional={additional}
                        onAdditionalChange={setAdditional}
                        customFieldCatalog={customFieldCatalog}
                        selectedCustomFieldIds={selectedCustomFieldIds}
                        onSelectedCustomFieldIdsChange={setSelectedCustomFieldIds}
                        onAddCustomField={handleAddCustomField}
                        onRemoveCustomField={handleRemoveCustomField}
                        builtinCustomFieldIds={BUILTIN_CUSTOM_FIELD_IDS}
                        titleError={titleError}
                      />
                    </JobFormStepCard>
                  )}
                </div>
              </div>

              <footer
                className={cn(
                  "shrink-0 border-t border-[rgba(15,23,42,0.06)]",
                  "bg-white/95 backdrop-blur-md dark:bg-surface/95",
                  "rounded-b-[20px] px-4 pt-3 sm:px-6",
                  "pb-[max(16px,env(safe-area-inset-bottom))]",
                )}
              >
                <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4">
                  <div className="min-w-[5rem]">
                    {stepIndex > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          footerBtnBase,
                          "gap-1.5 border-[rgba(15,23,42,0.1)] bg-white text-[#3F3F46] hover:bg-[#FAFAFB] focus-visible:ring-forest/25 dark:bg-surface",
                        )}
                        onClick={goBack}
                      >
                        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                        Back
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          footerBtnBase,
                          "border-[rgba(15,23,42,0.1)] bg-white dark:bg-surface",
                        )}
                        onClick={requestClose}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className={cn(
                      footerBtnBase,
                      isLastStep
                        ? "min-w-[9rem] bg-accent text-white hover:bg-[rgb(var(--accent-hover-rgb))] focus-visible:ring-accent/30"
                        : "min-w-[7.5rem] bg-forest text-white hover:bg-forest/90 focus-visible:ring-forest/30",
                    )}
                    disabled={!isStepValid || publishing}
                  >
                    {isLastStep ? "Publish Job" : "Next"}
                  </Button>
                </div>
              </footer>
            </form>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>

    <WizardUnsavedCloseAlert
      open={unsavedAlertOpen}
      onOpenChange={setUnsavedAlertOpen}
      entityLabel="job"
      onSaveDraft={saveDraftAndClose}
      savingDraft={savingDraft}
    />
    </>
  );
}
