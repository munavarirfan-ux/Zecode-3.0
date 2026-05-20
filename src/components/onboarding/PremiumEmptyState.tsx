"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyStateIllustration, type EmptyStateIllustrationId } from "./EmptyStateIllustrations";
import { QuickGuide } from "./QuickGuide";

export function PremiumEmptyState({
  illustration,
  headline,
  subtext,
  ctaLabel,
  onCtaClick,
  ctaHref,
  guideTitle,
  guideBody,
  className,
}: {
  illustration: EmptyStateIllustrationId;
  headline: string;
  subtext: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  guideTitle?: string;
  guideBody?: string;
  className?: string;
}) {
  const cta =
    ctaLabel &&
    (ctaHref ? (
      <Button asChild className="mt-6 rounded-[12px] bg-accent px-6 text-white hover:bg-accent-hover">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    ) : (
      <Button
        type="button"
        className="mt-6 rounded-[12px] bg-accent px-6 text-white hover:bg-accent-hover"
        onClick={onCtaClick}
      >
        {ctaLabel}
      </Button>
    ));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-[rgba(15,23,42,0.06)] bg-gradient-to-b from-white to-[#FAFAFB] px-6 py-12 text-center sm:px-10 sm:py-14",
        "dark:border-white/[0.06] dark:from-surface dark:to-surface/80",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(var(--accent-rgb),0.08),transparent)]"
        aria-hidden
      />
      <div className="relative">
        <EmptyStateIllustration id={illustration} />
        <h3 className="mt-6 text-[1.125rem] font-semibold tracking-[-0.03em] text-text sm:text-[1.25rem]">
          {headline}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-text-secondary/80">{subtext}</p>
        {cta}
        {guideTitle && guideBody ? (
          <div className="mx-auto mt-8 max-w-lg text-left">
            <QuickGuide title={guideTitle} body={guideBody} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
