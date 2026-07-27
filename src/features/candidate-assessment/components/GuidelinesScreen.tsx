"use client";

import { useState } from "react";
import {
  Play,
  ArrowRight,
  ClipboardList,
  Monitor,
  Code2,
  ShieldAlert,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  Camera,
  Volume2,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { AssessmentData } from "@/features/candidate-assessment/types";

interface GuidelinesScreenProps {
  assessment: AssessmentData;
  onStart: () => void;
}

const GUIDELINE_STYLES: Record<
  string,
  { icon: typeof ClipboardList; tintBg: string; tintText: string; tintBorder: string }
> = {
  overview: {
    icon: ClipboardList,
    tintBg: "bg-violet-500/8 dark:bg-violet-400/10",
    tintText: "text-violet-600 dark:text-violet-400",
    tintBorder: "border-violet-500/10 dark:border-violet-400/10",
  },
  environment: {
    icon: Monitor,
    tintBg: "bg-blue-500/8 dark:bg-blue-400/10",
    tintText: "text-blue-600 dark:text-blue-400",
    tintBorder: "border-blue-500/10 dark:border-blue-400/10",
  },
  "code-submission": {
    icon: Code2,
    tintBg: "bg-cyan-500/8 dark:bg-cyan-400/10",
    tintText: "text-cyan-600 dark:text-cyan-400",
    tintBorder: "border-cyan-500/10 dark:border-cyan-400/10",
  },
  compliance: {
    icon: ShieldAlert,
    tintBg: "bg-amber-500/8 dark:bg-amber-400/10",
    tintText: "text-amber-600 dark:text-amber-400",
    tintBorder: "border-amber-500/10 dark:border-amber-400/10",
  },
  navigation: {
    icon: Navigation,
    tintBg: "bg-emerald-500/8 dark:bg-emerald-400/10",
    tintText: "text-emerald-600 dark:text-emerald-400",
    tintBorder: "border-emerald-500/10 dark:border-emerald-400/10",
  },
};

export function GuidelinesScreen({ assessment, onStart }: GuidelinesScreenProps) {
  const [consentIndependent, setConsentIndependent] = useState(false);
  const [consentMonitoring, setConsentMonitoring] = useState(false);

  const allConsented = consentIndependent && consentMonitoring;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFB] dark:bg-[#0E0E11]">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-14 items-center border-b border-[rgba(15,23,42,0.06)] bg-white/80 backdrop-blur-md px-4 lg:px-6 dark:border-white/[0.06] dark:bg-[#0E0E11]/80">
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

      {/* Body */}
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-6 px-4 py-8 pb-28 lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 lg:px-6">
        {/* Left column - Assessment summary (sticky) */}
        <aside className="lg:sticky lg:top-[calc(3.5rem+2rem)] lg:self-start">
          <div className="overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-white shadow-sm dark:border-white/[0.06] dark:bg-[#1a1a1f]">
            {/* Summary header */}
            <div className="border-b border-[rgba(15,23,42,0.05)] bg-gradient-to-br from-accent/[0.03] via-transparent to-transparent px-5 pb-4 pt-5 dark:border-white/[0.04]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent/70">
                Assessment Details
              </span>
              <h3 className="mt-1.5 text-[15px] font-semibold leading-tight text-text">
                {assessment.title}
              </h3>
              <span className="mt-2 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                {assessment.role}
              </span>
            </div>

            {/* Stats */}
            <div className="px-5 py-4">
              <dl className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-text-secondary">
                    <Clock className="h-3.5 w-3.5" />
                    Duration
                  </dt>
                  <dd className="font-semibold text-text">{assessment.duration} min</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-text-secondary">
                    <ClipboardList className="h-3.5 w-3.5" />
                    Questions
                  </dt>
                  <dd className="font-semibold text-text">{assessment.totalQuestions}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-text-secondary">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Sections
                  </dt>
                  <dd className="font-semibold text-text">{assessment.sections.length}</dd>
                </div>
              </dl>

              {/* Skills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {assessment.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-[6px] border border-accent/10 bg-accent/[0.05] px-2 py-0.5 text-[10px] font-medium text-accent dark:border-accent/20 dark:bg-accent/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right column */}
        <main className="space-y-8">
          {/* Page intro */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
              Step 2 of 3
            </span>
            <h1 className="mt-2 text-[clamp(1.5rem,3vw,1.875rem)] font-bold leading-tight tracking-[-0.02em] text-text">
              Prepare for your assessment
            </h1>
            <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-text-secondary">
              Review the guidelines below carefully. Understanding these will help you navigate
              the assessment smoothly and avoid common issues.
            </p>

            {/* Progress pills */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 w-10 rounded-full bg-accent" />
              <div className="h-1.5 w-10 rounded-full bg-accent" />
              <div className="h-1.5 w-10 rounded-full bg-[rgba(15,23,42,0.08)] dark:bg-white/[0.08]" />
            </div>
          </div>

          {/* Guideline cards */}
          <section className="space-y-3">
            {assessment.guidelines.map((section) => {
              const style = GUIDELINE_STYLES[section.id] || GUIDELINE_STYLES.overview;
              const Icon = style.icon;
              return (
                <div
                  key={section.id}
                  className={cn(
                    "rounded-[14px] border bg-white p-5 dark:bg-[#1a1a1f]",
                    style.tintBorder,
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                        style.tintBg,
                      )}
                    >
                      <Icon className={cn("h-4 w-4", style.tintText)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-semibold text-text">
                        {section.title}
                      </h3>
                      <ul className="mt-2.5 space-y-2">
                        {section.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-[13px] leading-relaxed text-text-secondary"
                          >
                            <span
                              className={cn(
                                "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                                style.tintBg,
                              )}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Monitoring warning callout */}
          <div className="flex items-start gap-3.5 rounded-[14px] border border-amber-500/15 bg-amber-500/[0.04] p-5 dark:border-amber-400/15 dark:bg-amber-400/[0.06]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-amber-500/10 dark:bg-amber-400/15">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-amber-800 dark:text-amber-300">
                Active monitoring enabled
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-amber-700/80 dark:text-amber-300/70">
                Your webcam, screen activity, and browser tabs will be monitored throughout
                the assessment. Any suspicious activity such as switching tabs, opening
                external tools, or leaving the frame will be flagged for review.
              </p>
            </div>
          </div>

          {/* Quick readiness check */}
          <div className="rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white p-5 dark:border-white/[0.06] dark:bg-[#1a1a1f]">
            <h3 className="text-[14px] font-semibold text-text">Quick readiness check</h3>
            <p className="mt-1 text-[12px] text-text-secondary">
              Make sure you have these ready before starting
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Wifi, label: "Stable internet" },
                { icon: Camera, label: "Webcam ready" },
                { icon: Volume2, label: "Quiet space" },
                { icon: Clock, label: `${assessment.duration} min free` },
              ].map(({ icon: ItemIcon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-[10px] border border-[rgba(15,23,42,0.04)] bg-[rgba(15,23,42,0.015)] px-3 py-3.5 text-center dark:border-white/[0.04] dark:bg-white/[0.02]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/8 dark:bg-emerald-400/10">
                    <ItemIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-medium text-text-secondary">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections overview */}
          <section>
            <h2 className="text-[15px] font-semibold text-text">Sections breakdown</h2>
            <p className="mt-1 text-[12px] text-text-secondary">
              {assessment.sections.length} sections · {assessment.totalQuestions} questions total
            </p>
            <div className="mt-3 overflow-hidden rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white dark:border-white/[0.06] dark:bg-[#1a1a1f]">
              {assessment.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3.5",
                    idx !== assessment.sections.length - 1 &&
                      "border-b border-[rgba(15,23,42,0.04)] dark:border-white/[0.04]",
                  )}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-accent/8 text-[11px] font-bold text-accent">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-text">{section.label}</p>
                  </div>
                  <span className="text-[12px] text-text-secondary">
                    {section.questionCount} Qs
                  </span>
                  <span className="w-12 text-right text-[12px] font-medium text-text-secondary">
                    {section.weightage}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Consent area */}
          <section>
            <div
              className={cn(
                "rounded-[14px] border p-5 transition-colors duration-200",
                allConsented
                  ? "border-emerald-500/20 bg-emerald-500/[0.02] dark:border-emerald-400/20 dark:bg-emerald-400/[0.03]"
                  : "border-[rgba(15,23,42,0.06)] bg-white dark:border-white/[0.06] dark:bg-[#1a1a1f]",
              )}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={cn(
                    "h-4 w-4 transition-colors",
                    allConsented
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted",
                  )}
                />
                <h3 className="text-[14px] font-semibold text-text">Consent & agreement</h3>
              </div>
              <p className="mt-1.5 text-[12px] text-text-secondary">
                Please confirm the following before starting your assessment
              </p>

              <div className="mt-4 space-y-3.5">
                <label className="flex items-start gap-3 cursor-pointer rounded-[10px] border border-[rgba(15,23,42,0.04)] bg-[rgba(15,23,42,0.01)] p-3.5 transition-colors hover:bg-[rgba(15,23,42,0.02)] dark:border-white/[0.04] dark:bg-white/[0.01] dark:hover:bg-white/[0.03]">
                  <Checkbox
                    checked={consentIndependent}
                    onCheckedChange={(checked) =>
                      setConsentIndependent(checked === true)
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-[13px] font-medium text-text">
                      Independent work declaration
                    </span>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-text-secondary">
                      I confirm that I will complete this assessment independently without
                      external assistance, notes, or unauthorized tools.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer rounded-[10px] border border-[rgba(15,23,42,0.04)] bg-[rgba(15,23,42,0.01)] p-3.5 transition-colors hover:bg-[rgba(15,23,42,0.02)] dark:border-white/[0.04] dark:bg-white/[0.01] dark:hover:bg-white/[0.03]">
                  <Checkbox
                    checked={consentMonitoring}
                    onCheckedChange={(checked) =>
                      setConsentMonitoring(checked === true)
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-[13px] font-medium text-text">
                      Monitoring consent
                    </span>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-text-secondary">
                      I agree to being monitored via webcam and screen recording throughout
                      the duration of this assessment.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Sticky bottom actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(15,23,42,0.06)] bg-white/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#0E0E11]/80">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-3.5 lg:px-6">
          <Button variant="outline" size="default" className="gap-2">
            <Play className="h-3.5 w-3.5" />
            Watch video
          </Button>
          <Button
            variant="default"
            size="lg"
            disabled={!allConsented}
            onClick={onStart}
            className="gap-2 px-6 text-[14px] font-semibold shadow-sm"
          >
            Start assessment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
