"use client";

import { useEffect, useState } from "react";
import { ONBOARDING_UPDATED_EVENT } from "./onboardingStore";

/** Re-render when demo workspace is enabled or onboarding state changes. */
export function useWorkspaceRefresh(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((n) => n + 1);
    window.addEventListener(ONBOARDING_UPDATED_EVENT, handler);
    return () => window.removeEventListener(ONBOARDING_UPDATED_EVENT, handler);
  }, []);
  return tick;
}
