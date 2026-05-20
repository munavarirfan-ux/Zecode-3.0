"use client";

import {
  DEFAULT_ONBOARDING_STATE,
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_VERSION,
  type OnboardingProfile,
  type OnboardingState,
} from "./types";

export const ONBOARDING_UPDATED_EVENT = "zecode-onboarding-updated";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ONBOARDING_UPDATED_EVENT));
  }
}

export function readOnboardingState(): OnboardingState {
  if (typeof window === "undefined") return DEFAULT_ONBOARDING_STATE;
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return DEFAULT_ONBOARDING_STATE;
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    return {
      ...DEFAULT_ONBOARDING_STATE,
      ...parsed,
      version: ONBOARDING_VERSION,
    };
  } catch {
    return DEFAULT_ONBOARDING_STATE;
  }
}

export function writeOnboardingState(next: OnboardingState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ ...next, version: ONBOARDING_VERSION }));
    notify();
  } catch {
    /* ignore */
  }
}

export function completeOnboarding(profile: OnboardingProfile, opts?: { demo?: boolean; tourSkipped?: boolean }) {
  writeOnboardingState({
    completed: true,
    tourSkipped: opts?.tourSkipped ?? false,
    demoWorkspace: opts?.demo ?? false,
    profile,
    version: ONBOARDING_VERSION,
  });
}

export function resetOnboarding() {
  writeOnboardingState(DEFAULT_ONBOARDING_STATE);
}

export function shouldShowOnboarding(selectedRole: string): boolean {
  if (selectedRole !== "newUser") return false;
  return !readOnboardingState().completed;
}
