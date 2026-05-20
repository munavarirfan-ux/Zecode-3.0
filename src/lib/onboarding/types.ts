export type OnboardingIntent =
  | "hire"
  | "interviews"
  | "assessments"
  | "team"
  | "explore";

export type OnboardingProfile = {
  roleTitle: string;
  teamSize: string;
  hiringVolume: string;
  hiringType: "technical" | "non-technical" | "mixed";
  intent: OnboardingIntent;
};

export type OnboardingState = {
  completed: boolean;
  tourSkipped: boolean;
  demoWorkspace: boolean;
  profile: OnboardingProfile | null;
  version: number;
};

export const ONBOARDING_STORAGE_KEY = "zecode-onboarding-v1";
export const ONBOARDING_VERSION = 1;

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  completed: false,
  tourSkipped: false,
  demoWorkspace: false,
  profile: null,
  version: ONBOARDING_VERSION,
};
