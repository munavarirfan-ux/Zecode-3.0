"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import type { LineArtIllustrationId } from "@/components/empty-states/line-art-illustrations";
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
  illustration: LineArtIllustrationId | string;
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
      <Button asChild className="rounded-[12px] bg-accent px-6 text-white hover:bg-accent-hover">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    ) : (
      <Button
        type="button"
        className="rounded-[12px] bg-accent px-6 text-white hover:bg-accent-hover"
        onClick={onCtaClick}
      >
        {ctaLabel}
      </Button>
    ));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-[rgba(15,23,42,0.06)] bg-gradient-to-b from-white to-[#FAFAFB] dark:border-white/[0.06] dark:from-surface dark:to-surface/80",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(var(--accent-rgb),0.08),transparent)]"
        aria-hidden
      />
      <div className="relative">
        <LineArtEmptyState illustration={illustration} message={headline} description={subtext}>
          {cta}
        </LineArtEmptyState>
        {guideTitle && guideBody ? (
          <div className="mx-auto max-w-lg px-6 pb-8 text-left">
            <QuickGuide title={guideTitle} body={guideBody} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
