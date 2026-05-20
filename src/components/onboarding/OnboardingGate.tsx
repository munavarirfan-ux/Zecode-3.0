"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/context/RoleContext";
import { ONBOARDING_UPDATED_EVENT, shouldShowOnboarding } from "@/lib/onboarding/onboardingStore";
import { OnboardingExperience } from "./OnboardingExperience";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { selectedRole } = useRole();
  const [show, setShow] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setShow(shouldShowOnboarding(selectedRole));
  }, [selectedRole]);

  useEffect(() => {
    const sync = () => setShow(shouldShowOnboarding(selectedRole));
    window.addEventListener(ONBOARDING_UPDATED_EVENT, sync);
    return () => window.removeEventListener(ONBOARDING_UPDATED_EVENT, sync);
  }, [selectedRole]);

  if (!hydrated) return <>{children}</>;

  return (
    <>
      {children}
      {show ? <OnboardingExperience onComplete={() => setShow(false)} /> : null}
    </>
  );
}
