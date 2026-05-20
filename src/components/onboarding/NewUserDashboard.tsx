"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRole } from "@/context/RoleContext";
import { getNewUserSetupProgress } from "@/lib/onboarding/newUserSetupProgress";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";
import { dashboardGreeting } from "@/features/dashboard/data/dashboard.mock";
import { cn } from "@/lib/utils";
import { OnboardingAmbientBackground } from "./OnboardingAmbientBackground";
import { OnboardingHeroCluster } from "./OnboardingHeroCluster";
import { WorkspaceSetupPanel } from "./WorkspaceSetupPanel";
import { NewUserQuickStartCards } from "./NewUserQuickStartCards";

function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function NewUserDashboard() {
  const { selectedRole } = useRole();
  const { data: session } = useSession();
  const workspaceRefresh = useWorkspaceRefresh();

  const displayName = useMemo(() => {
    const fromSession = session?.user?.name?.trim().split(/\s+/)[0];
    return fromSession ?? dashboardGreeting.fallbackName;
  }, [session?.user?.name]);

  const contextualHint = useMemo(
    () => getNewUserSetupProgress(selectedRole).contextualHint,
    [selectedRole, workspaceRefresh],
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <OnboardingAmbientBackground />

      <div className="relative z-10 flex h-full min-h-0 flex-col gap-2 px-3 py-1.5 sm:gap-3 sm:px-5 sm:py-2 max-h-[820px]:gap-1.5 max-h-[820px]:py-1">
        <div className="grid min-h-0 flex-1 items-center gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-5 xl:grid-cols-[1fr_1.05fr]">
          <section
            className="flex min-h-0 flex-col items-center justify-center text-center lg:items-start lg:text-left"
            aria-label="Welcome"
          >
            <OnboardingHeroCluster compact />
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              Your workspace
            </p>
            <h1 className="mt-1 text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-text sm:text-[1.65rem]">
              {timeGreeting()}, {displayName}
            </h1>
            <p className="mt-1 max-w-md text-[12px] leading-snug text-text-secondary/85 sm:text-[13px] max-h-[820px]:hidden">
              Everything you need to run hiring — jobs, assessments, interviews, and feedback — in
              one calm, intelligent workspace.
            </p>
            <p className="mt-1 line-clamp-1 max-w-md text-[11px] font-medium text-accent/90 sm:text-[12px]">
              {contextualHint}
            </p>
          </section>

          <WorkspaceSetupPanel compact className="h-fit w-4/5 max-w-full justify-self-center self-center" />
        </div>

        <div className="shrink-0">
          <NewUserQuickStartCards compact />
        </div>
      </div>
    </div>
  );
}
