import type { CreateEnterpriseFormState } from "./types";
import {
  hasValidationErrors,
  validateEnterpriseDetails,
} from "./validation";
import { validateEnterpriseSlugFromDomain } from "./slugs";
import { CORE_FEATURE_IDS } from "./features";

export const CREATE_ENTERPRISE_STEPS = [
  { id: 1, key: "details", label: "Enterprise Details" },
  { id: 2, key: "features", label: "Features" },
  { id: 3, key: "configure", label: "Configure Features" },
  { id: 4, key: "review", label: "Review & Create" },
] as const;

export function isCreateEnterpriseStepValid(
  stepIndex: number,
  form: CreateEnterpriseFormState,
  takenSlugs: string[],
): boolean {
  if (stepIndex === 0) {
    const errors = validateEnterpriseDetails(form.details);
    const slugErr = validateEnterpriseSlugFromDomain(form.details.domainName, takenSlugs);
    if (slugErr) return false;
    return !hasValidationErrors(errors);
  }
  if (stepIndex === 1) {
    return CORE_FEATURE_IDS.some((id) => form.features[id]);
  }
  return true;
}

export function getMaxReachableStepIndex(
  form: CreateEnterpriseFormState,
  takenSlugs: string[],
): number {
  let max = 0;
  for (let i = 0; i < CREATE_ENTERPRISE_STEPS.length; i++) {
    if (isCreateEnterpriseStepValid(i, form, takenSlugs)) max = i;
    else break;
  }
  return max;
}

export function hasCreateEnterpriseProgress(form: CreateEnterpriseFormState): boolean {
  const d = form.details;
  return Boolean(
    d.organisationName.trim() ||
      d.domainName.trim() ||
      d.spocName.trim() ||
      d.spocEmail.trim() ||
      d.logoUrl ||
      d.faviconUrl,
  );
}
