import type { CandidateEditProfile, ProfileFieldErrors } from "./candidateProfile";
import { hasProfileErrors } from "./candidateProfile";

export const ADD_CANDIDATE_STEPS = [
  { id: 1, key: "resume", label: "Resume Upload" },
  { id: 2, key: "basic", label: "Basic Details" },
  { id: 3, key: "education", label: "Education" },
  { id: 4, key: "experience", label: "Experience" },
  { id: 5, key: "social", label: "Social Network" },
  { id: 6, key: "application", label: "Application" },
] as const;

export type CandidateFormStepId = (typeof ADD_CANDIDATE_STEPS)[number]["id"];
/** @deprecated Use CandidateFormStepId */
export type AddCandidateStepId = CandidateFormStepId;

export function validateCandidateFormStep(
  step: CandidateFormStepId,
  profile: CandidateEditProfile,
): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  switch (step) {
    case 1:
      if (!profile.resumeFileName.trim()) {
        errors.resume = "Upload a resume to continue";
      }
      break;
    case 2:
      if (!profile.firstName.trim()) errors.firstName = "First name is required";
      if (!profile.lastName.trim()) errors.lastName = "Last name is required";
      if (!profile.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
        errors.email = "Enter a valid email address";
      }
      if (!profile.mobile.trim()) errors.mobile = "Mobile number is required";
      break;
    case 3:
      profile.education.forEach((entry) => {
        if (!entry.required) return;
        if (!entry.details.trim()) {
          const label = entry.degree.trim() || "this qualification";
          errors[`education-${entry.id}`] = `Add details for ${label} (required)`;
        }
      });
      break;
    case 4:
    case 5:
      break;
    case 6:
      if (!profile.application.stage) errors.stage = "Stage is required";
      if (!profile.application.source) errors.source = "Source is required";
      break;
    default:
      break;
  }

  return errors;
}

export function isCandidateFormStepValid(step: CandidateFormStepId, profile: CandidateEditProfile): boolean {
  return !hasProfileErrors(validateCandidateFormStep(step, profile));
}

/** Highest step index the user may jump to (all prior steps valid). */
export function getMaxReachableStepIndex(profile: CandidateEditProfile): number {
  let max = 0;
  for (let i = 1; i < ADD_CANDIDATE_STEPS.length; i++) {
    for (let j = 0; j < i; j++) {
      if (!isCandidateFormStepValid(ADD_CANDIDATE_STEPS[j].id, profile)) return max;
    }
    max = i;
  }
  return max;
}

/** @deprecated Use validateCandidateFormStep */
export const validateAddCandidateStep = validateCandidateFormStep;
/** @deprecated Use isCandidateFormStepValid */
export const isAddCandidateStepValid = isCandidateFormStepValid;
