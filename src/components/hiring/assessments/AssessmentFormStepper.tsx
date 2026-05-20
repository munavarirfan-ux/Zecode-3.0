"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ASSESSMENT_FORM_STEPS } from "@/lib/hiring/assessments/assessmentFormSteps";

export function AssessmentFormWizardHeader({
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
          Create Assessment
        </h1>
        <p className="max-w-2xl text-[13px] leading-relaxed text-text-secondary/70">
          Configure assessment details, question pool, and candidate guidelines before publishing.
        </p>
      </div>
      <nav aria-label="Assessment form progress">
        <ol className="flex flex-wrap gap-2">
          {ASSESSMENT_FORM_STEPS.map((s, index) => {
            const active = index === currentStepIndex;
            const completed = index < currentStepIndex;
            const reachable = index <= maxReachableStepIndex;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => reachable && onStepSelect(index)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30",
                    active && "border-forest/30 bg-forest/10 text-forest",
                    completed && !active && reachable && "border-border bg-muted/20 text-text-secondary",
                    !active && !completed && reachable && "border-border bg-white text-muted dark:bg-surface",
                    !reachable && "cursor-not-allowed opacity-60",
                  )}
                  aria-current={active ? "step" : undefined}
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

export function AssessmentFormStepCard({
  stepIndex,
  children,
}: {
  stepIndex: number;
  children: React.ReactNode;
}) {
  const step = ASSESSMENT_FORM_STEPS[stepIndex];
  return (
    <Card className="overflow-hidden rounded-[24px] border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)] dark:bg-surface">
      <CardHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 py-4 sm:px-6">
        <CardTitle className="text-base font-semibold text-text">{step.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">{children}</CardContent>
    </Card>
  );
}
