"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Loader2, X } from "lucide-react";
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
import {
  ADD_CANDIDATE_STEPS,
  getMaxReachableStepIndex,
  isCandidateFormStepValid,
  validateCandidateFormStep,
  type CandidateFormStepId,
} from "@/lib/hiring/candidateFormSteps";
import { mergeParsedResume, parseResumeFile } from "@/lib/hiring/parseResume";
import {
  createEmptyCandidateProfile,
  getCandidateEditProfile,
  hasProfileErrors,
  registerCandidateFromProfile,
  saveCandidateEditProfile,
  validateCandidateProfile,
  type CandidateEditProfile,
  type ProfileFieldErrors,
} from "@/lib/hiring/candidateProfile";
import { getDefaultStageReason, type AddedBy } from "@/lib/hiring/stages";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import type { CandidateFormMode } from "./CandidateForm";
import { CandidateFormStepContent } from "./CandidateFormStepContent";
import { CandidateFormStepper } from "./CandidateFormStepper";

const footerBtnBase =
  "inline-flex h-11 min-h-[44px] items-center justify-center rounded-[11px] px-5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

function focusFirstInvalidField(errors: ProfileFieldErrors) {
  const firstKey = Object.keys(errors)[0];
  const firstId =
    firstKey === "firstName"
      ? "first-name"
      : firstKey === "lastName"
        ? "last-name"
        : firstKey === "email"
          ? "email"
          : firstKey === "mobile"
            ? "mobile"
            : firstKey === "resume"
              ? "resume-upload-step"
              : firstKey?.startsWith("education-")
                ? `${firstKey}-details`
                : undefined;
  if (firstId) document.getElementById(firstId)?.focus();
}

export function CandidateFormDialog({
  mode,
  open,
  onOpenChange,
  job,
  candidate,
  addedBy = "admin",
  onSaved,
  returnFocusRef,
}: {
  mode: CandidateFormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: HiringJob;
  candidate?: HiringCandidate;
  addedBy?: AddedBy;
  onSaved?: (candidate: HiringCandidate) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const isCreate = mode === "create";
  const [profile, setProfile] = useState<CandidateEditProfile | null>(null);
  const [baselineJson, setBaselineJson] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [parsingResume, setParsingResume] = useState(false);
  const [resumeParsedHint, setResumeParsedHint] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const stageHelperText = useMemo(() => {
    if (isCreate) return getDefaultStageReason(addedBy);
    return candidate?.defaultStageReason;
  }, [isCreate, addedBy, candidate?.defaultStageReason]);

  const currentStepId = ADD_CANDIDATE_STEPS[stepIndex]?.id ?? 1;
  const isLastStep = stepIndex === ADD_CANDIDATE_STEPS.length - 1;

  useEffect(() => {
    if (!open) return;
    const initial = isCreate
      ? createEmptyCandidateProfile(job, addedBy)
      : candidate
        ? getCandidateEditProfile(candidate, job)
        : null;
    if (!initial) return;
    setProfile(initial);
    setBaselineJson(JSON.stringify(initial));
    setFieldErrors({});
    setShowErrors(false);
    setStepIndex(0);
    setParsingResume(false);
    setResumeParsedHint(false);
  }, [open, isCreate, job, addedBy, candidate]);

  const patch = useCallback((next: Partial<CandidateEditProfile>) => {
    setProfile((p) => (p ? { ...p, ...next } : p));
  }, []);

  const validationErrors = useMemo(
    () => (profile ? validateCandidateProfile(profile) : {}),
    [profile],
  );

  const stepErrors = useMemo(
    () => (profile ? validateCandidateFormStep(currentStepId as CandidateFormStepId, profile) : {}),
    [profile, currentStepId],
  );

  const maxReachableStepIndex = useMemo(
    () => (profile ? getMaxReachableStepIndex(profile) : 0),
    [profile],
  );

  const isValid = !hasProfileErrors(validationErrors);
  const isStepValid = profile ? isCandidateFormStepValid(currentStepId as CandidateFormStepId, profile) : false;
  const isDirty =
    profile !== null && baselineJson !== null && JSON.stringify(profile) !== baselineJson;

  const visibleStepErrors = showErrors ? { ...stepErrors, ...fieldErrors } : fieldErrors;

  const validateCurrentStep = useCallback(() => {
    if (!profile) return true;
    const errors = validateCandidateFormStep(currentStepId as CandidateFormStepId, profile);
    setFieldErrors(errors);
    setShowErrors(true);
    if (hasProfileErrors(errors)) {
      focusFirstInvalidField(errors);
      return false;
    }
    setFieldErrors({});
    setShowErrors(false);
    return true;
  }, [profile, currentStepId]);

  const handleResumeFile = useCallback(
    async (file: File) => {
      if (!profile) return;
      patch({ resumeFileName: file.name });
      setParsingResume(true);
      setResumeParsedHint(false);
      try {
        const parsed = await parseResumeFile(file.name);
        setProfile((p) => (p ? mergeParsedResume(p, parsed) : p));
        setResumeParsedHint(true);
        toast.success("Resume parsed successfully.");
      } catch {
        toast.error("Could not parse resume");
      } finally {
        setParsingResume(false);
      }
    },
    [profile, patch],
  );

  const goNext = () => {
    if (!validateCurrentStep()) return;
    setStepIndex((i) => Math.min(i + 1, ADD_CANDIDATE_STEPS.length - 1));
  };

  const goBack = () => {
    setFieldErrors({});
    setShowErrors(false);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleStepSelect = (index: number) => {
    if (index > maxReachableStepIndex) return;
    if (index === stepIndex) return;
    if (index > stepIndex && !validateCurrentStep()) return;
    setFieldErrors({});
    setShowErrors(false);
    setStepIndex(index);
  };

  const handleSubmit = () => {
    if (!profile) return;
    if (!isLastStep) {
      goNext();
      return;
    }

    const errors = validateCandidateProfile(profile);
    setFieldErrors(errors);
    setShowErrors(true);
    if (hasProfileErrors(errors)) {
      focusFirstInvalidField(errors);
      return;
    }

    setSubmitting(true);
    if (isCreate) {
      const created = registerCandidateFromProfile(job, profile, addedBy);
      setSubmitting(false);
      toast.success("Candidate added");
      onSaved?.(created);
      onOpenChange(false);
      return;
    }

    if (!candidate) {
      setSubmitting(false);
      return;
    }

    const updated = saveCandidateEditProfile(candidate.id, profile);
    setSubmitting(false);
    if (!updated) {
      toast.error("Could not save candidate");
      return;
    }
    toast.success("Candidate updated");
    setBaselineJson(JSON.stringify(profile));
    onSaved?.(updated);
    onOpenChange(false);
  };

  if (!profile) return null;

  const dialogTitle = isCreate ? "Add Candidate" : "Edit Candidate";
  const primaryLabel = isLastStep
    ? isCreate
      ? "Add Candidate"
      : "Save Changes"
    : "Next";
  const primaryDisabled =
    submitting || parsingResume || (isLastStep ? !isValid || (!isCreate && !isDirty) : !isStepValid);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          >
            <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
          <DialogClose
            className={cn(
              "absolute right-3 top-3 z-20 sm:right-5 sm:top-5",
              dialogCloseButtonLg,
            )}
            aria-label={`Close ${dialogTitle.toLowerCase()} modal`}
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden />
          </DialogClose>

          <DialogDescription className="sr-only">
            {dialogTitle} — six steps: resume, basic details, education, experience, social links, and
            application information.
          </DialogDescription>

          <form
            ref={formRef}
            noValidate
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            aria-label={`${dialogTitle} profile`}
          >
            <div
              className={cn(
                "min-h-0 flex-1 overflow-y-auto overscroll-contain",
                "pb-[calc(5rem+max(20px,env(safe-area-inset-bottom)))]",
              )}
            >
              <CandidateFormStepper
                mode={mode}
                currentStepIndex={stepIndex}
                maxReachableStepIndex={maxReachableStepIndex}
                onStepSelect={handleStepSelect}
              >
                <CandidateFormStepContent
                  stepIndex={stepIndex}
                  profile={profile}
                  onPatch={patch}
                  visibleErrors={visibleStepErrors}
                  showErrors={showErrors}
                  stageHelperText={stageHelperText}
                  parsingResume={parsingResume}
                  resumeParsedHint={resumeParsedHint}
                  onResumeFile={handleResumeFile}
                />
              </CandidateFormStepper>
            </div>

            <footer
              className={cn(
                "sticky bottom-0 z-10 shrink-0 border-t border-[rgba(15,23,42,0.06)]",
                "bg-white/95 backdrop-blur-md dark:bg-surface/95",
                "px-4 pt-3 sm:px-6",
                "pb-[max(20px,env(safe-area-inset-bottom))]",
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
                      disabled={submitting || parsingResume}
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      Back
                    </Button>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className={cn(
                    footerBtnBase,
                    "min-w-[7.5rem] bg-forest text-white hover:bg-forest/90 focus-visible:ring-forest/30",
                  )}
                  disabled={primaryDisabled}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      {isLastStep ? (isCreate ? "Adding…" : "Saving…") : "Next…"}
                    </>
                  ) : (
                    primaryLabel
                  )}
                </Button>
              </div>
            </footer>
          </form>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
