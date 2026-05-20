"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  ChevronRight,
  GraduationCap,
  LayoutGrid,
  Mic2,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/config/routes";
import { completeOnboarding } from "@/lib/onboarding/onboardingStore";
import type { OnboardingIntent, OnboardingProfile } from "@/lib/onboarding/types";
import { EmptyStateIllustration } from "./EmptyStateIllustrations";

const INTENTS: { id: OnboardingIntent; label: string; description: string; icon: typeof Briefcase }[] = [
  { id: "hire", label: "Hire Candidates", description: "Run pipelines from job creation to offer.", icon: Briefcase },
  { id: "interviews", label: "Conduct Interviews", description: "Schedule panels and capture structured feedback.", icon: Mic2 },
  { id: "assessments", label: "Create Assessments", description: "Evaluate technical skills at scale.", icon: GraduationCap },
  { id: "team", label: "Manage Hiring Team", description: "Coordinate recruiters, interviewers, and evaluators.", icon: Users },
  { id: "explore", label: "Explore Platform", description: "Tour the workspace with demo-ready modules.", icon: LayoutGrid },
];

const SPOTLIGHTS = [
  { title: "Jobs workspace", body: "This is your Jobs workspace — organize requisitions and candidate pipelines." },
  { title: "Candidate pipeline", body: "Track every applicant stage, from screening through offer." },
  { title: "Assessments", body: "Manage assessments from creation through candidate evaluation." },
  { title: "Interviews", body: "Schedule interviews and sync feedback with candidate reports." },
];

export function OnboardingExperience({ onComplete }: { onComplete: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<OnboardingIntent>("hire");
  const [roleTitle, setRoleTitle] = useState("");
  const [teamSize, setTeamSize] = useState("1–5");
  const [hiringVolume, setHiringVolume] = useState("1–10 / month");
  const [hiringType, setHiringType] = useState<OnboardingProfile["hiringType"]>("mixed");
  const [spotlight, setSpotlight] = useState(0);

  function finish(profile: OnboardingProfile, demo?: boolean, tourSkipped?: boolean) {
    completeOnboarding(profile, { demo, tourSkipped });
    onComplete();
    if (demo) router.push(ROUTES.dashboard);
    else router.push(ROUTES.hiringJobs);
  }

  return (
    <div className="fixed inset-0 z-[300] flex flex-col overflow-hidden bg-[#FAFAFB] text-text dark:bg-[#0c0c0e]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -left-[20%] top-[-30%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.18),transparent_70%)]"
          style={{ animation: "nux-mesh 14s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-[15%] bottom-[-20%] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(15,61,46,0.12),transparent_70%)]"
          style={{ animation: "nux-mesh 18s ease-in-out infinite reverse" }}
        />
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-accent/30"
            style={{
              left: `${8 + i * 7}%`,
              top: `${12 + (i % 5) * 14}%`,
              animation: `nux-float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-sm font-bold tracking-tight">{APP_NAME}</span>
        {step > 0 && step < 3 ? (
          <button
            type="button"
            className="text-[12px] font-medium text-muted hover:text-text"
            onClick={() => finish({ roleTitle, teamSize, hiringVolume, hiringType, intent }, true, true)}
          >
            Skip for now
          </button>
        ) : null}
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 pb-10 sm:px-10">
        {step === 0 && (
          <div className="nux-fade-up text-center">
            <div className="mx-auto mb-8">
              <EmptyStateIllustration id="welcome" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Welcome to {APP_NAME}</p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[2.75rem]">
              Hiring operations,
              <br />
              redesigned.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-text-secondary/85">
              Create jobs, conduct interviews, evaluate talent, and manage hiring workflows from one intelligent
              workspace.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button
                className="h-11 rounded-[12px] bg-accent px-8 text-white hover:bg-accent-hover"
                onClick={() => setStep(1)}
              >
                Get Started
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-[12px]"
                onClick={() =>
                  finish(
                    { roleTitle: "Explorer", teamSize: "—", hiringVolume: "—", hiringType: "mixed", intent: "explore" },
                    true,
                    true,
                  )
                }
              >
                Explore Demo Workspace
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="nux-fade-up">
            <h2 className="text-center text-[1.5rem] font-semibold tracking-[-0.035em] sm:text-[1.75rem]">
              What do you want to do?
            </h2>
            <p className="mt-2 text-center text-[14px] text-muted">We&apos;ll personalize your workspace.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {INTENTS.map((item) => {
                const Icon = item.icon;
                const active = intent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIntent(item.id)}
                    className={cn(
                      "group rounded-[16px] border p-4 text-left transition-all duration-300",
                      active
                        ? "border-accent/30 bg-white shadow-[0_8px_32px_-12px_rgba(var(--accent-rgb),0.35)] ring-1 ring-accent/20"
                        : "border-[rgba(15,23,42,0.06)] bg-white/80 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-md dark:bg-white/[0.04]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors",
                        active ? "bg-accent/15 text-accent" : "bg-[rgba(15,23,42,0.04)] text-muted group-hover:text-accent",
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <p className="mt-3 text-[14px] font-semibold text-text">{item.label}</p>
                    <p className="mt-1 text-[12px] text-muted">{item.description}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-center">
              <Button className="rounded-[12px] bg-accent text-white hover:bg-accent-hover" onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="nux-fade-up mx-auto max-w-md">
            <h2 className="text-center text-[1.5rem] font-semibold tracking-[-0.035em]">Personalize your setup</h2>
            <p className="mt-2 text-center text-[14px] text-muted">Helps us tune recommendations and quick actions.</p>
            <div className="mt-8 space-y-4">
              <label className="block text-[12px] font-medium text-muted">Your role</label>
              <Input
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Head of Talent"
                className="h-11 rounded-[12px]"
              />
              <label className="block text-[12px] font-medium text-muted">Team size</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="h-11 w-full rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-[14px]"
              >
                {["1–5", "6–20", "21–50", "50+"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <label className="block text-[12px] font-medium text-muted">Hiring volume</label>
              <select
                value={hiringVolume}
                onChange={(e) => setHiringVolume(e.target.value)}
                className="h-11 w-full rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-[14px]"
              >
                {["1–10 / month", "11–30 / month", "30+ / month"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <label className="block text-[12px] font-medium text-muted">Hiring type</label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["technical", "Technical"],
                    ["non-technical", "Non-technical"],
                    ["mixed", "Mixed"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setHiringType(v)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[12px] font-medium",
                      hiringType === v
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-[rgba(15,23,42,0.08)] text-muted",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-2">
              <Button variant="outline" className="rounded-[12px]" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="rounded-[12px] bg-accent text-white hover:bg-accent-hover" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="nux-fade-up mx-auto max-w-lg text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Quick tour
            </span>
            <h2 className="mt-4 text-[1.5rem] font-semibold tracking-[-0.035em]">{SPOTLIGHTS[spotlight].title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary/85">{SPOTLIGHTS[spotlight].body}</p>
            <div className="mt-6 flex justify-center gap-1.5">
              {SPOTLIGHTS.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === spotlight ? "w-6 bg-accent" : "w-1.5 bg-[rgba(15,23,42,0.12)]",
                  )}
                />
              ))}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <Button
                variant="ghost"
                className="rounded-[12px] text-muted"
                onClick={() =>
                  finish(
                    {
                      roleTitle: roleTitle || "New User",
                      teamSize,
                      hiringVolume,
                      hiringType,
                      intent,
                    },
                    intent === "explore",
                    true,
                  )
                }
              >
                Skip tour
              </Button>
              {spotlight < SPOTLIGHTS.length - 1 ? (
                <Button className="rounded-[12px] bg-accent text-white hover:bg-accent-hover" onClick={() => setSpotlight((s) => s + 1)}>
                  Next
                </Button>
              ) : (
                <Button
                  className="rounded-[12px] bg-accent text-white hover:bg-accent-hover"
                  onClick={() =>
                    finish(
                      {
                        roleTitle: roleTitle || "New User",
                        teamSize,
                        hiringVolume,
                        hiringType,
                        intent,
                      },
                      intent === "explore",
                      false,
                    )
                  }
                >
                  Enter workspace
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
