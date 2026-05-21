"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { enableDemoWorkspace } from "@/lib/onboarding/workspaceMode";
import {
  NEW_USER_EMPTY_MODULES,
  type NewUserEmptyModuleId,
} from "@/lib/onboarding/newUserEmptyModules";
import { EmptyStateIllustration } from "./EmptyStateIllustrations";
import { QuickGuide } from "./QuickGuide";

export function NewUserModuleEmptyState({
  module,
  onPrimaryAction,
  onSecondaryAction,
  onDemoEnabled,
  showDemoButton = true,
}: {
  module: NewUserEmptyModuleId;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onDemoEnabled?: () => void;
  showDemoButton?: boolean;
}) {
  const config = NEW_USER_EMPTY_MODULES[module];

  const primaryButton =
    config.primaryHref != null ? (
      <Button asChild className="h-11 rounded-[12px] bg-accent px-6 text-white hover:bg-accent-hover">
        <Link href={config.primaryHref}>
          {config.primaryCta}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </Button>
    ) : (
      <Button
        type="button"
        className="h-11 rounded-[12px] bg-accent px-6 text-white hover:bg-accent-hover"
        onClick={onPrimaryAction}
      >
        {config.primaryCta}
        <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    );

  return (
    <div
      className="flex w-full min-w-0 min-h-[min(720px,calc(100svh-12rem))] items-center justify-center py-10 sm:py-14"
      role="region"
      aria-label={config.eyebrow}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[22px] border border-[rgba(15,23,42,0.06)]",
          "bg-gradient-to-b from-white via-[#FAFAFB] to-[#F5F5F7] px-6 py-10 sm:px-10 sm:py-12",
          "dark:border-white/[0.06] dark:from-surface dark:via-surface dark:to-surface/90",
        )}
      >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-15%,rgba(var(--accent-rgb),0.1),transparent_60%)]"
        aria-hidden
      />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="text-center lg:text-left">
          <EmptyStateIllustration id={config.illustration} />
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {config.eyebrow}
          </p>
          <h2 className="mt-2 text-[1.5rem] font-semibold leading-[1.12] tracking-[-0.035em] text-text sm:text-[1.75rem]">
            {config.headline}
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-text-secondary/85 lg:mx-0 mx-auto">
            {config.subtext}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {primaryButton}
            {config.secondaryCta && onSecondaryAction ? (
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-[12px]"
                onClick={onSecondaryAction}
              >
                {config.secondaryCta}
              </Button>
            ) : null}
            {showDemoButton ? (
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-[12px]"
                onClick={() => {
                  enableDemoWorkspace();
                  onDemoEnabled?.();
                }}
              >
                <Sparkles className="mr-1.5 h-4 w-4 text-accent" />
                Explore with demo data
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">How to get started</p>
          <ol className="space-y-2.5">
            {config.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="flex gap-3 rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white/90 p-3.5 shadow-[0_4px_20px_-12px_rgba(15,23,42,0.12)] dark:bg-white/[0.04]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[12px] font-bold text-accent">
                    {index + 1}
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="flex items-center gap-1.5 text-[13px] font-semibold text-text">
                      <Icon className="h-3.5 w-3.5 text-accent/80" strokeWidth={2} />
                      {step.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <QuickGuide title={config.guideTitle} body={config.guideBody} />
        </div>
      </div>
      </div>
    </div>
  );
}
