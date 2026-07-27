"use client";

import { Clock, FileText, Calendar, Info, ArrowRight, Shield, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AssessmentData } from "@/features/candidate-assessment/types";

interface InvitationScreenProps {
  assessment: AssessmentData;
  onProceed: () => void;
}

export function InvitationScreen({ assessment, onProceed }: InvitationScreenProps) {
  const expiresDate = new Date(assessment.expiresAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFB] px-5 py-10 dark:bg-[#0E0E11]">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(113,0,189,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(113,0,189,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow behind card */}
      <div className="pointer-events-none absolute right-[15%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[120px]" />
      {/* Subtle glow behind heading */}
      <div className="pointer-events-none absolute left-[10%] top-[35%] h-[400px] w-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />
      {/* Fade grid toward center */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#FAFAFB]/60 to-transparent dark:via-[#0E0E11]/60" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1140px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-[72px]">
        {/* Left column — 52% */}
        <div className="w-full lg:w-[52%]">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent/10">
              <span className="text-sm font-bold text-accent">Ze</span>
            </div>
            <span className="text-lg font-semibold text-text">Ze[code]</span>
          </div>

          {/* Main heading */}
          <h1 className="mt-10 max-w-[520px] text-[clamp(2rem,4.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text">
            You&apos;re invited to an assessment
          </h1>

          {/* Greeting + description */}
          <div className="mt-6 max-w-[480px]">
            <p className="text-[17px] font-medium text-text">
              Hi {assessment.candidateName},
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
              You&apos;ve been invited to complete the{" "}
              <span className="font-semibold text-text">{assessment.title}</span>.
            </p>
          </div>

          {/* Important note callout */}
          <div className="mt-8 flex items-start gap-3 rounded-[14px] bg-accent/[0.05] px-5 py-4 dark:bg-accent/[0.08]">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Info className="h-3.5 w-3.5 text-accent" />
            </div>
            <p className="text-[14px] leading-relaxed text-text-secondary">
              Your timer will not begin until you start the assessment.
            </p>
          </div>
        </div>

        {/* Right column — 48% */}
        <div className="flex w-full justify-center lg:w-[48%]">
          <div className="w-full max-w-[460px] overflow-hidden rounded-[20px] border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_4px_40px_-12px_rgba(113,0,189,0.08)] dark:border-white/[0.06] dark:bg-[#1a1a1f] dark:shadow-none">
            {/* Card header area with subtle texture */}
            <div className="relative border-b border-[rgba(15,23,42,0.05)] bg-gradient-to-br from-accent/[0.03] via-transparent to-transparent px-7 pb-6 pt-7 dark:border-white/[0.04]">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <span className="relative text-[10px] font-semibold uppercase tracking-[0.1em] text-accent/80">
                Technical Assessment
              </span>
              <h2 className="relative mt-2 text-[20px] font-semibold leading-tight text-text">
                {assessment.title}
              </h2>
              <span className="relative mt-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
                {assessment.role}
              </span>
            </div>

            {/* Card body */}
            <div className="px-7 pb-7 pt-6">
              {/* Stat blocks */}
              <div className="grid grid-cols-3 gap-0 rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.015)] dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="px-4 py-3.5 text-center">
                  <p className="text-[18px] font-bold text-text">{assessment.duration}<span className="text-[13px] font-medium text-text-secondary"> min</span></p>
                  <p className="mt-0.5 text-[11px] text-muted">Duration</p>
                </div>
                <div className="border-x border-[rgba(15,23,42,0.06)] px-4 py-3.5 text-center dark:border-white/[0.06]">
                  <p className="text-[18px] font-bold text-text">{assessment.totalQuestions}</p>
                  <p className="mt-0.5 text-[11px] text-muted">Questions</p>
                </div>
                <div className="px-4 py-3.5 text-center">
                  <p className="text-[18px] font-bold text-text">{expiresDate}</p>
                  <p className="mt-0.5 text-[11px] text-muted">Expires</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {assessment.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-[8px] border border-accent/10 bg-accent/[0.05] px-2.5 py-1 text-[11px] font-medium text-accent dark:border-accent/20 dark:bg-accent/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Primary CTA */}
              <Button
                variant="default"
                size="lg"
                className="mt-6 h-[50px] w-full gap-2 text-[15px] font-semibold shadow-sm"
                onClick={onProceed}
              >
                Review assessment
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="mt-3 text-center text-[12px] text-muted">
                Your timer starts only when you begin.
              </p>

              {/* Trust signals */}
              <div className="mt-5 flex items-center justify-center gap-5 border-t border-[rgba(15,23,42,0.05)] pt-4 dark:border-white/[0.04]">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-muted" />
                  <span className="text-[11px] text-muted">Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Save className="h-3 w-3 text-muted" />
                  <span className="text-[11px] text-muted">Autosaved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-3 w-3 text-muted" />
                  <span className="text-[11px] text-muted">Proctored</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
