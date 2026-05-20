"use client";

import type { PreviewRole } from "@/config/previewRole";
import { readOnboardingState, writeOnboardingState } from "./onboardingStore";

/** New User without demo sees an empty workspace to learn the product. */
export function shouldShowDemoWorkspaceData(role: PreviewRole): boolean {
  if (role !== "newUser") return true;
  const { completed, demoWorkspace } = readOnboardingState();
  if (!completed) return false;
  return demoWorkspace;
}

export function isFreshNewUserWorkspace(role: PreviewRole): boolean {
  if (role !== "newUser") return false;
  const { completed, demoWorkspace } = readOnboardingState();
  return completed && !demoWorkspace;
}

export function enableDemoWorkspace() {
  const state = readOnboardingState();
  writeOnboardingState({ ...state, demoWorkspace: true });
}
