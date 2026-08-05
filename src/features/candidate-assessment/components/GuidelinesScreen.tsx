"use client";

import { useMemo, useState, type ComponentType } from "react";
import { ArrowRight, BarChart3, Check, ClipboardList, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { AssessmentData, GuidelineSection } from "@/features/candidate-assessment/types";
import {
  ComplianceIllo,
  EnvironmentIllo,
  MonitoringIllo,
  NavigationIllo,
  OverviewIllo,
  ReadyIllo,
  SubmissionIllo,
} from "./GuidelineIllustrations";

interface GuidelinesScreenProps {
  assessment: AssessmentData;
  onStart: () => void;
}

/* ── Per-guideline presentation (illustration, tone, copy) ── */
type Illo = ComponentType<{ className?: string }>;

interface StepConfig {
  Illo: Illo;
  /** short lead-in shown under the title */
  description: string;
  /** completes the sentence "I have read and understood …" */
  confirm: string;
  /** compact stepper label */
  short: string;
  /** soft illustration-cell background */
  cell: string;
}

const STEP_CONFIG: Record<string, StepConfig> = {
  overview: {
    Illo: OverviewIllo,
    description: "Understand how the assessment works before you begin.",
    confirm: "the assessment overview",
    short: "Assessment",
    cell: "bg-gradient-to-br from-violet-50 to-white dark:from-violet-500/[0.06] dark:to-transparent",
  },
  environment: {
    Illo: EnvironmentIllo,
    description: "Prepare your device and surroundings for a smooth session.",
    confirm: "the environment requirements",
    short: "Environment",
    cell: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-500/[0.06] dark:to-transparent",
  },
  "code-submission": {
    Illo: SubmissionIllo,
    description: "Write, test, and submit your code safely.",
    confirm: "the code submission process",
    short: "Submission",
    cell: "bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-500/[0.06] dark:to-transparent",
  },
  compliance: {
    Illo: ComplianceIllo,
    description: "Follow the rules and remain inside the assessment.",
    confirm: "the compliance rules",
    short: "Compliance",
    cell: "bg-gradient-to-br from-amber-50 to-white dark:from-amber-500/[0.06] dark:to-transparent",
  },
  navigation: {
    Illo: NavigationIllo,
    description: "Navigate between questions and track your progress.",
    confirm: "how to navigate the exam",
    short: "Navigation",
    cell: "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-500/[0.06] dark:to-transparent",
  },
};

/* Active monitoring is presented as its own step (content preserved from the
   existing monitoring notice — meaning unchanged, presentation improved). */
const MONITORING_STEP: GuidelineSection & { config: StepConfig } = {
  id: "monitoring",
  title: "Active monitoring",
  items: [
    "Your webcam feed is recorded throughout the assessment.",
    "Screen activity is captured and reviewed.",
    "Browser tab switches and leaving the frame are detected.",
    "Any suspicious activity will be flagged for review.",
  ],
  config: {
    Illo: MonitoringIllo,
    description: "Your webcam, screen, and browser activity are monitored.",
    confirm: "the monitoring policy",
    short: "Monitoring",
    cell: "bg-gradient-to-br from-amber-50/80 to-white dark:from-amber-500/[0.05] dark:to-transparent",
  },
};

type Step = GuidelineSection & { config: StepConfig };

/* ── Reusable checklist row ── */
function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[15px] leading-snug text-text-secondary">
      <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400">
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

export function GuidelinesScreen({ assessment, onStart }: GuidelinesScreenProps) {
  /* Build the ordered step list: existing guidelines (order preserved) + monitoring. */
  const steps = useMemo<Step[]>(() => {
    const fromData = assessment.guidelines
      .filter((g) => STEP_CONFIG[g.id])
      .map((g) => ({ ...g, config: STEP_CONFIG[g.id] }));
    return [...fromData, MONITORING_STEP];
  }, [assessment.guidelines]);

  const TOTAL = steps.length;
  const FINAL = TOTAL; // virtual index for the final consent step

  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [consentIndependent, setConsentIndependent] = useState(false);
  const [consentMonitoring, setConsentMonitoring] = useState(false);

  const completedCount = useMemo(() => {
    let n = 0;
    while (completed.has(n)) n += 1;
    return n;
  }, [completed]);

  const allConsented = consentIndependent && consentMonitoring;

  function confirmAndContinue(i: number) {
    setCompleted((prev) => new Set(prev).add(i));
    setActiveStep(i + 1); // advance directly to the next step (or final consent)
  }

  const displayIndex = activeStep < TOTAL ? activeStep + 1 : TOTAL;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="ze-guidelines-bg flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-[rgba(15,23,42,0.06)] bg-white/80 px-4 backdrop-blur-md lg:px-6 dark:border-white/[0.06] dark:bg-[#0E0E11]/80">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent/10">
              <span className="text-[10px] font-bold text-accent">Ze</span>
            </div>
            <span className="text-[15px] font-semibold text-text">Ze[code]</span>
          </div>
          <p className="ml-auto hidden text-sm font-medium text-text-secondary lg:block">
            {assessment.title}
          </p>
        </header>

        {/* Body — vertically centered block; `my-auto` falls back to top
            alignment + scrolling when the content is taller than the viewport. */}
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col px-4 sm:px-6 md:px-10 lg:px-12">
          <div className="mx-auto my-auto w-full max-w-[1440px] py-6 lg:py-8">
          {/* Intro + meta */}
          <div className="mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
              Guidelines
            </span>
            <h1 className="mt-1 text-[clamp(1.5rem,2.2vw,1.875rem)] font-bold leading-tight tracking-[-0.02em] text-text">
              Prepare for your assessment
            </h1>
            <p className="mt-1.5 max-w-[640px] text-[14px] leading-relaxed text-text-secondary">
              Read each guideline and confirm you understand it. The next step appears once you
              continue.
            </p>

            {/* compact assessment meta */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted" />
                <span className="font-semibold text-text">{assessment.duration} min</span> duration
              </span>
              <span className="flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-muted" />
                <span className="font-semibold text-text">{assessment.totalQuestions}</span> questions
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-muted" />
                <span className="font-semibold text-text">{assessment.sections.length}</span> sections
              </span>
            </div>
          </div>

          {/* Progress stepper */}
          <div className="shrink-0">
            <StepProgress
              steps={steps}
              completed={completed}
              completedCount={completedCount}
              activeStep={activeStep}
              displayIndex={displayIndex}
              total={TOTAL}
              onJump={(i) => setActiveStep(i)}
            />
          </div>

          {/* Step flow — only the active step is rendered; the stepper is the
              single source of navigation. `key` retriggers the fade transition. */}
          <div className="mt-2">
            <div key={activeStep} className="ze-step-in">
              {activeStep === FINAL ? (
                <FinalConsent
                  consentIndependent={consentIndependent}
                  consentMonitoring={consentMonitoring}
                  onIndependent={setConsentIndependent}
                  onMonitoring={setConsentMonitoring}
                  allConsented={allConsented}
                  onStart={onStart}
                />
              ) : (
                <StepCard
                  step={steps[activeStep]}
                  index={activeStep}
                  total={TOTAL}
                  checked={!!checked[activeStep]}
                  onCheck={(v) => setChecked((c) => ({ ...c, [activeStep]: v }))}
                  onContinue={() => confirmAndContinue(activeStep)}
                />
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* ─────────────────────────── Progress stepper ─────────────────────────── */
function StepProgress({
  steps,
  completed,
  completedCount,
  activeStep,
  displayIndex,
  total,
  onJump,
}: {
  steps: Step[];
  completed: Set<number>;
  completedCount: number;
  activeStep: number;
  displayIndex: number;
  total: number;
  onJump: (i: number) => void;
}) {
  const currentTitle = activeStep < total ? steps[activeStep].title : "Final consent";

  return (
    <div className="rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white px-5 py-2.5 dark:border-white/[0.06] dark:bg-[#1a1a1f] lg:px-10 lg:py-2.5">
      {/* Desktop stepper */}
      <ol className="hidden items-center sm:flex">
        {steps.map((step, i) => {
          const isDone = completed.has(i);
          const isActive = activeStep === i;
          const reachable = i <= completedCount;
          const node = (
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onJump(i)}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors lg:h-8 lg:w-8 lg:text-[12px]",
                isActive
                  ? "bg-accent text-white ring-4 ring-accent/15"
                  : isDone
                    ? "bg-emerald-500 text-white"
                    : "bg-[rgba(15,23,42,0.05)] text-muted dark:bg-white/[0.06]",
                reachable ? "cursor-pointer" : "cursor-default",
              )}
            >
              {isDone && !isActive ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </button>
          );
          return (
            <li key={step.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>{node}</TooltipTrigger>
                  <TooltipContent>{step.title}</TooltipContent>
                </Tooltip>
                <span
                  className={cn(
                    "text-[11px] font-medium lg:text-[12px]",
                    isActive ? "text-text" : isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted",
                  )}
                >
                  {step.config.short}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2.5 h-0.5 flex-1 rounded-full transition-colors lg:mx-4",
                    i < completedCount ? "bg-emerald-500/70" : "bg-[rgba(15,23,42,0.08)] dark:bg-white/[0.08]",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: current step summary */}
      <div className="sm:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          Step {displayIndex} of {total}
        </p>
        <p className="text-[13px] font-semibold text-text">{currentTitle}</p>
        <div className="mt-2 flex gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                completed.has(i)
                  ? "bg-emerald-500"
                  : activeStep === i
                    ? "bg-accent"
                    : "bg-[rgba(15,23,42,0.08)] dark:bg-white/[0.08]",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Active step card ─────────────────────────── */
function StepCard({
  step,
  index,
  total,
  checked,
  onCheck,
  onContinue,
}: {
  step: Step;
  index: number;
  total: number;
  checked: boolean;
  onCheck: (v: boolean) => void;
  onContinue: () => void;
}) {
  const { Illo, description, confirm, cell } = step.config;
  const checkboxId = `confirm-${step.id}`;

  return (
    <section
      aria-current="step"
      className="overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#1a1a1f]"
    >
      <div className="grid w-full md:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
        {/* Illustration */}
        <div className={cn("flex items-center justify-center p-5 md:px-6 md:py-5", cell)}>
          <Illo className="h-32 w-full max-w-[340px] object-contain md:h-auto md:max-h-[300px]" />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="flex-1 p-5 md:px-8 md:py-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-accent">
              Step {index + 1} of {total}
            </span>
            <h2 className="mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.01em] text-text lg:text-[28px]">
              {step.title}
            </h2>
            <p className="mt-3 max-w-[640px] text-[15px] leading-snug text-text-secondary lg:text-[16px]">
              {description}
            </p>

            <ul className="mt-4 space-y-2.5">
              {step.items.map((item, idx) => (
                <CheckRow key={idx}>{item}</CheckRow>
              ))}
            </ul>
          </div>

          {/* Compact CTA footer */}
          <div className="flex min-h-[64px] items-center border-t border-[rgba(15,23,42,0.07)] bg-white/90 px-5 py-3 md:px-8 dark:border-white/[0.07] dark:bg-[#1a1a1f]/90">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor={checkboxId}
                className="flex cursor-pointer items-center gap-3 text-[14px] font-medium text-text"
              >
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  onCheckedChange={(c) => onCheck(c === true)}
                  className="shrink-0"
                />
                I have read and understood {confirm}.
              </label>

              <div className="flex shrink-0 items-center justify-end gap-3">
                {!checked && (
                  <span
                    id={`${checkboxId}-hint`}
                    className="hidden whitespace-nowrap text-[12px] text-muted sm:block"
                  >
                    Confirm to continue
                  </span>
                )}
                <Button
                  variant="default"
                  size="default"
                  disabled={!checked}
                  aria-describedby={!checked ? `${checkboxId}-hint` : undefined}
                  onClick={onContinue}
                  className="w-full gap-1.5 px-5 sm:w-auto"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Final consent step ─────────────────────────── */
function FinalConsent({
  consentIndependent,
  consentMonitoring,
  onIndependent,
  onMonitoring,
  allConsented,
  onStart,
}: {
  consentIndependent: boolean;
  consentMonitoring: boolean;
  onIndependent: (v: boolean) => void;
  onMonitoring: (v: boolean) => void;
  allConsented: boolean;
  onStart: () => void;
}) {
  const summary = [
    "Device prepared",
    "Rules understood",
    "Monitoring accepted",
    "Navigation understood",
  ];

  return (
    <section className="overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#1a1a1f]">
      <div className="grid w-full md:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
        {/* Illustration */}
        <div className="flex items-center justify-center bg-gradient-to-br from-accent/[0.06] to-white p-5 md:px-6 md:py-5 dark:from-accent/[0.08] dark:to-transparent">
          <ReadyIllo className="h-32 w-full max-w-[340px] object-contain md:h-auto md:max-h-[300px]" />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="flex-1 p-5 md:px-8 md:py-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-accent">
              Final step
            </span>
            <h2 className="mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.01em] text-text lg:text-[28px]">
              You&apos;re ready to begin
            </h2>
            <p className="mt-1.5 max-w-[640px] text-[15px] leading-snug text-text-secondary lg:text-[16px]">
              You&apos;ve reviewed every guideline. Confirm the declarations below to start.
            </p>

            {/* summary chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {summary.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[12px] font-medium text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                  {s}
                </span>
              ))}
            </div>

            <Separator className="my-4" />

            {/* required consents */}
            <div className="space-y-2">
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[10px] border border-transparent p-2.5 transition-colors",
                  consentIndependent
                    ? "bg-emerald-500/[0.06] dark:bg-emerald-400/[0.08]"
                    : "bg-[rgba(15,23,42,0.025)] hover:bg-[rgba(15,23,42,0.045)] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
                )}
              >
                <Checkbox
                  checked={consentIndependent}
                  onCheckedChange={(c) => onIndependent(c === true)}
                  className="mt-0.5"
                />
                <span className="text-[14px] font-medium text-text">
                  I confirm that I will complete this assessment independently.
                </span>
              </label>

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[10px] border border-transparent p-2.5 transition-colors",
                  consentMonitoring
                    ? "bg-emerald-500/[0.06] dark:bg-emerald-400/[0.08]"
                    : "bg-[rgba(15,23,42,0.025)] hover:bg-[rgba(15,23,42,0.045)] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
                )}
              >
                <Checkbox
                  checked={consentMonitoring}
                  onCheckedChange={(c) => onMonitoring(c === true)}
                  className="mt-0.5"
                />
                <span className="text-[14px] font-medium text-text">
                  I consent to webcam, screen, and browser activity monitoring.
                </span>
              </label>
            </div>
          </div>

          {/* Compact CTA footer */}
          <div className="flex min-h-[64px] items-center border-t border-[rgba(15,23,42,0.07)] bg-white/90 px-5 py-3 md:px-8 dark:border-white/[0.07] dark:bg-[#1a1a1f]/90">
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="outline" size="default" className="w-full gap-2 sm:w-auto">
                <Play className="h-3.5 w-3.5" />
                Watch overview video
              </Button>
              <Button
                variant="default"
                size="default"
                disabled={!allConsented}
                onClick={onStart}
                className="w-full gap-2 px-5 text-[14px] font-semibold shadow-sm sm:w-auto"
              >
                Start assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
