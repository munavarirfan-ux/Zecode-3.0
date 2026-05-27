"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { dialogCloseButtonLg } from "@/components/ui/dialog";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import { createDefaultEnterpriseForm } from "../../lib/createEnterprise/defaults";
import {
  CREATE_ENTERPRISE_STEPS,
  getMaxReachableStepIndex,
  isCreateEnterpriseStepValid,
} from "../../lib/createEnterprise/createEnterpriseSteps";
import {
  domainToSlug,
  getTakenEnterpriseSlugs,
  validateEnterpriseSlugFromDomain,
} from "../../lib/createEnterprise/slugs";
import {
  hasValidationErrors,
  validateEnterpriseDetails,
} from "../../lib/createEnterprise/validation";
import type { CreateEnterpriseFormState } from "../../lib/createEnterprise/types";
import type { CreateEnterpriseFieldErrors } from "../../lib/createEnterprise/types";
import { useCreatedEnterprisesStore } from "../../store/createdEnterprisesStore";
import type { CreatedEnterprise } from "../../store/createdEnterprisesStore";
import {
  settingsPrimaryBtn,
  settingsSecondaryBtn,
} from "../../settingsTokens";
import {
  CreateEnterpriseStepCard,
  CreateEnterpriseWizardHeader,
} from "./create/CreateEnterpriseFormStepper";
import { ConfigureFeaturesStep } from "./create/steps/ConfigureFeaturesStep";
import { EnterpriseDetailsStep } from "./create/steps/EnterpriseDetailsStep";
import { FeaturesStep } from "./create/steps/FeaturesStep";
import { ReviewStep } from "./create/steps/ReviewStep";

const footerBtnBase =
  "inline-flex h-11 min-h-[44px] items-center justify-center rounded-[11px] px-5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export { getTakenEnterpriseSlugs } from "../../lib/createEnterprise/slugs";

export function CreateEnterpriseModal({
  open,
  onOpenChange,
  takenSlugs: takenSlugsProp,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  takenSlugs: string[];
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const add = useCreatedEnterprisesStore((s) => s.add);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<CreateEnterpriseFormState>(createDefaultEnterpriseForm);
  const [fieldErrors, setFieldErrors] = useState<CreateEnterpriseFieldErrors>({});
  const [created, setCreated] = useState<CreatedEnterprise | null>(null);

  const isLastStep = stepIndex === CREATE_ENTERPRISE_STEPS.length - 1;

  const maxReachableStepIndex = useMemo(
    () => getMaxReachableStepIndex(form, takenSlugsProp),
    [form, takenSlugsProp],
  );

  const isStepValid = isCreateEnterpriseStepValid(stepIndex, form, takenSlugsProp);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    setForm(createDefaultEnterpriseForm());
    setFieldErrors({});
    setCreated(null);
  }, [open]);

  const resetAndClose = () => {
    setStepIndex(0);
    setForm(createDefaultEnterpriseForm());
    setFieldErrors({});
    setCreated(null);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetAndClose();
      return;
    }
    onOpenChange(next);
  };

  const validateStep0 = () => {
    const errors = validateEnterpriseDetails(form.details);
    const slugErr = validateEnterpriseSlugFromDomain(form.details.domainName, takenSlugsProp);
    if (slugErr) errors.domainName = slugErr;
    setFieldErrors(errors);
    return !hasValidationErrors(errors);
  };

  const goNext = () => {
    if (stepIndex === 0 && !validateStep0()) {
      toast.error("Fix required fields before continuing");
      return;
    }
    if (isLastStep) {
      submit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, CREATE_ENTERPRISE_STEPS.length - 1));
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const submit = () => {
    if (!validateStep0()) {
      setStepIndex(0);
      toast.error("Fix required fields before creating");
      return;
    }

    const slug = domainToSlug(form.details.domainName);
    const enterprise: CreatedEnterprise = {
      domain: form.details.domainName.trim().toLowerCase(),
      name: form.details.organisationName.trim(),
      slug,
      plan: mapPlan(form.config.assessments.planType),
      seats: Math.max(
        1,
        Number(form.details.numberOfEmployees) || totalFromConfig(form),
      ),
      region: form.details.location.trim(),
      timezone: "UTC",
      language: "en",
      adminName: form.details.spocName.trim(),
      adminEmail: form.details.spocEmail.trim(),
      status: "Trial",
      joinedAt: new Date().toISOString(),
      location: form.details.location.trim(),
    };

    add(enterprise);
    setCreated(enterprise);
    toast.success("Enterprise created");
  };

  const patchDetails = (patch: Partial<CreateEnterpriseFormState["details"]>) => {
    setForm((f) => ({ ...f, details: { ...f.details, ...patch } }));
    setFieldErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <DialogTitle className="sr-only">Create Enterprise</DialogTitle>
            <button
              type="button"
              className={cn("absolute right-3 top-3 z-20 sm:right-5 sm:top-5", dialogCloseButtonLg)}
              aria-label="Close create enterprise modal"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>

            <DialogDescription className="sr-only">
              Create Enterprise — four steps: details, features, configuration, and review.
            </DialogDescription>

            {created ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Check className="h-7 w-7" strokeWidth={2} />
                </span>
                <h2 className="mt-4 text-[1.25rem] font-semibold tracking-[-0.02em] text-text">
                  Enterprise created successfully
                </h2>
                <p className="mt-2 max-w-sm text-[13px] text-text-secondary/85">
                  <span className="font-semibold text-text">{created.name}</span> is ready on the
                  platform.
                </p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
                  <Link href={ROUTES.settingsMyEnterprise} className={settingsPrimaryBtn}>
                    Open Enterprise
                  </Link>
                  <Link href={ROUTES.settingsTeams} className={settingsSecondaryBtn}>
                    Invite Team
                  </Link>
                  <Link href={ROUTES.settingsMyEnterprise} className={settingsSecondaryBtn}>
                    Configure Branding
                  </Link>
                </div>
                <button
                  type="button"
                  className="mt-6 text-[12px] font-medium text-muted hover:text-text"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                noValidate
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
                onSubmit={(e) => {
                  e.preventDefault();
                  goNext();
                }}
                aria-label="Create enterprise"
              >
                <CreateEnterpriseWizardHeader
                  currentStepIndex={stepIndex}
                  maxReachableStepIndex={maxReachableStepIndex}
                  onStepSelect={setStepIndex}
                />

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">
                  <div className="mx-auto w-full max-w-[900px] pb-4">
                    <CreateEnterpriseStepCard stepIndex={stepIndex}>
                      {stepIndex === 0 && (
                        <EnterpriseDetailsStep
                          inModal
                          details={form.details}
                          errors={fieldErrors}
                          onChange={patchDetails}
                        />
                      )}
                      {stepIndex === 1 && (
                        <FeaturesStep
                          inModal
                          features={form.features}
                          onChange={(features) => setForm((f) => ({ ...f, features }))}
                        />
                      )}
                      {stepIndex === 2 && (
                        <ConfigureFeaturesStep
                          features={form.features}
                          config={form.config}
                          onConfigChange={(config) => setForm((f) => ({ ...f, config }))}
                        />
                      )}
                      {stepIndex === 3 && <ReviewStep inModal form={form} />}
                    </CreateEnterpriseStepCard>
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
                          onClick={() => handleOpenChange(false)}
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
                          ? "min-w-[9.5rem] bg-accent text-white hover:bg-[rgb(var(--accent-hover-rgb))] focus-visible:ring-accent/30"
                          : "min-w-[7.5rem] bg-forest text-white hover:bg-forest/90 focus-visible:ring-forest/30",
                      )}
                      disabled={!isStepValid}
                    >
                      {isLastStep ? "Create Enterprise" : "Next"}
                    </Button>
                  </div>
                </footer>
              </form>
            )}
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}

function mapPlan(plan: string): CreatedEnterprise["plan"] {
  if (plan === "Professional") return "Growth";
  if (plan === "Custom") return "Enterprise";
  return "Starter";
}

function totalFromConfig(form: CreateEnterpriseFormState): number {
  const a = form.config.assessments.candidatesIncluded + form.config.assessments.additionallyAdded;
  const i = form.config.interviews.candidatesIncluded + form.config.interviews.additionallyAdded;
  return Math.max(a, i, 25);
}
