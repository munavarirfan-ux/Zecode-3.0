"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CREATE_ENTERPRISE_STEPS } from "../../../lib/createEnterprise/createEnterpriseSteps";

const SUBTITLE =
  "Provision a new workspace with organization details, enabled modules, limits, and branding.";

export function CreateEnterpriseWizardHeader({
  currentStepIndex,
  maxReachableStepIndex,
  onStepSelect,
}: {
  currentStepIndex: number;
  maxReachableStepIndex: number;
  onStepSelect: (index: number) => void;
}) {
  return (
    <header className="shrink-0 space-y-6 px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
      <div className="space-y-2 pr-10 sm:pr-12">
        <h1 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-text sm:text-[2rem]">
          Create Enterprise
        </h1>
        <p className="max-w-2xl text-[13px] leading-relaxed text-text-secondary/70">{SUBTITLE}</p>
      </div>

      <nav aria-label="Create enterprise progress">
        <ol className="flex flex-wrap gap-2">
          {CREATE_ENTERPRISE_STEPS.map((s, index) => {
            const active = index === currentStepIndex;
            const completed = index < currentStepIndex;
            const reachable = index <= maxReachableStepIndex;
            const disabled = !reachable;

            return (
              <li key={s.key}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && onStepSelect(index)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 focus-visible:ring-offset-2",
                    active && "cursor-default border-forest/30 bg-forest/10 text-forest",
                    completed &&
                      !active &&
                      reachable &&
                      "cursor-pointer border-border bg-muted/20 text-text-secondary hover:border-forest/20 hover:bg-muted/30",
                    !active &&
                      !completed &&
                      reachable &&
                      "cursor-pointer border-border bg-white text-muted hover:border-forest/20 dark:bg-surface",
                    disabled &&
                      "cursor-not-allowed border-border/80 bg-white/60 text-muted/60 opacity-60 dark:bg-surface/60",
                  )}
                  aria-current={active ? "step" : undefined}
                  aria-disabled={disabled}
                >
                  {s.id}. {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}

export function CreateEnterpriseStepCard({
  stepIndex,
  children,
}: {
  stepIndex: number;
  children: React.ReactNode;
}) {
  const step = CREATE_ENTERPRISE_STEPS[stepIndex];

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[24px] border border-[rgba(15,23,42,0.06)] bg-white",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_-16px_rgba(15,23,42,0.12)]",
        "dark:border-white/[0.06] dark:bg-surface",
      )}
    >
      <CardHeader className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 py-4 sm:px-6 sm:py-5 dark:border-white/[0.06]">
        <CardTitle className="text-base font-semibold text-text">{step.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">{children}</CardContent>
    </Card>
  );
}
