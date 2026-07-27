"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  ShieldCheck,
  Mail,
  Users,
  FileCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationScreenProps {
  assessmentTitle: string;
  onBackToPreview: () => void;
}

export function ConfirmationScreen({ assessmentTitle, onBackToPreview }: ConfirmationScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FAFAFB] px-5 py-12">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/40 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-[60%] rounded-full bg-emerald-200/20 blur-[80px]" />
      </div>

      {/* Top bar */}
      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-5 py-4 lg:px-8">
        <span className="text-[12px] font-semibold text-text-secondary">
          Ze<span className="text-accent">[</span>code<span className="text-accent">]</span>
        </span>
        <button
          onClick={onBackToPreview}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-text-secondary transition-colors hover:bg-[rgba(15,23,42,0.05)] hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-[820px] flex-col items-center text-center">
        {/* Success mark */}
        <div className="relative">
          {/* Expanding rings */}
          <div
            className={cn(
              "absolute inset-0 scale-100 rounded-full border-2 border-emerald-200/60 opacity-0 transition-all duration-[800ms] ease-out motion-reduce:transition-none",
              mounted && "scale-[2.2] opacity-100",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 scale-100 rounded-full border border-emerald-100/40 opacity-0 transition-all duration-[1000ms] ease-out delay-150 motion-reduce:transition-none",
              mounted && "scale-[3] opacity-100",
            )}
          />

          {/* Main circle */}
          <div
            className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-[600ms] ease-out motion-reduce:transition-none",
              mounted ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            <CheckCircle2
              className={cn(
                "h-11 w-11 text-emerald-600 transition-all duration-[500ms] delay-200 ease-out motion-reduce:transition-none",
                mounted ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          className={cn(
            "mt-10 text-[2.25rem] font-bold tracking-[-0.025em] text-text transition-all duration-500 delay-200 ease-out motion-reduce:transition-none lg:text-[2.5rem]",
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          Assessment submitted
        </h1>

        <p
          className={cn(
            "mt-3 max-w-[580px] text-[15px] leading-relaxed text-text-secondary transition-all duration-500 delay-300 ease-out motion-reduce:transition-none",
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          Your responses for{" "}
          <span className="font-semibold text-text">{assessmentTitle}</span>{" "}
          have been submitted successfully.
        </p>

        {/* Summary card */}
        <div
          className={cn(
            "mt-10 w-full max-w-[600px] rounded-[20px] border border-emerald-100/80 bg-white/80 p-7 shadow-sm backdrop-blur-sm transition-all duration-500 delay-400 ease-out dark:border-emerald-900/30 dark:bg-[#1a1a1f]/80 motion-reduce:transition-none",
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Submitted */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Submitted</p>
                <p className="mt-0.5 text-[13px] font-semibold text-text">Just now</p>
              </div>
            </div>

            {/* Assessment */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent/[0.06]">
                <ClipboardCheck className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Assessment</p>
                <p className="mt-0.5 truncate text-[13px] font-semibold text-text">{assessmentTitle}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-amber-50 dark:bg-amber-900/20">
                <Clock3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Status</p>
                <p className="mt-0.5 text-[13px] font-semibold text-text">Under review</p>
              </div>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div
          className={cn(
            "mt-8 w-full max-w-[600px] transition-all duration-500 delay-500 ease-out motion-reduce:transition-none",
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">
            What happens next
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-2.5 rounded-[12px] border border-[rgba(15,23,42,0.05)] bg-white/60 px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
              <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent/60" />
              <p className="text-[12px] leading-relaxed text-text-secondary">Your responses will be evaluated</p>
            </div>
            <div className="flex items-start gap-2.5 rounded-[12px] border border-[rgba(15,23,42,0.05)] bg-white/60 px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent/60" />
              <p className="text-[12px] leading-relaxed text-text-secondary">The hiring team will review your results</p>
            </div>
            <div className="flex items-start gap-2.5 rounded-[12px] border border-[rgba(15,23,42,0.05)] bg-white/60 px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent/60" />
              <p className="text-[12px] leading-relaxed text-text-secondary">You&apos;ll receive an update by email</p>
            </div>
          </div>
        </div>

        {/* Trust message */}
        <div
          className={cn(
            "mt-10 flex items-center gap-1.5 text-[11px] text-muted transition-all duration-500 delay-[600ms] ease-out motion-reduce:transition-none",
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/70" />
          <span>Your responses have been saved securely</span>
        </div>
      </div>
    </div>
  );
}
