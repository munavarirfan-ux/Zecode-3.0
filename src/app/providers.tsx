"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { RoleProvider } from "@/context/RoleContext";
import { OnboardingGate } from "@/components/onboarding/OnboardingGate";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TooltipProvider delayDuration={300}>
          <RoleProvider>
            <OnboardingGate>
              {children}
            </OnboardingGate>
            <Toaster position="top-center" richColors closeButton toastOptions={{ classNames: { toast: "rounded-[12px] border border-[#E8E8E3]" } }} />
          </RoleProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
