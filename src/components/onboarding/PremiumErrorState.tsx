"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyStateIllustration, type EmptyStateIllustrationId } from "./EmptyStateIllustrations";
import { cn } from "@/lib/utils";

export function PremiumErrorState({
  illustration,
  headline,
  subtext,
  recoveryLabel,
  onRecovery,
  recoveryHref,
  className,
}: {
  illustration: EmptyStateIllustrationId;
  headline: string;
  subtext: string;
  recoveryLabel: string;
  onRecovery?: () => void;
  recoveryHref?: string;
  className?: string;
}) {
  const action =
    recoveryHref != null ? (
      <Button asChild variant="outline" className="mt-6 rounded-[12px]">
        <Link href={recoveryHref}>{recoveryLabel}</Link>
      </Button>
    ) : (
      <Button type="button" variant="outline" className="mt-6 rounded-[12px]" onClick={onRecovery}>
        {recoveryLabel}
      </Button>
    );

  return (
    <div className={cn("flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center", className)}>
      <EmptyStateIllustration id={illustration} />
      <h1 className="mt-6 text-[1.5rem] font-semibold tracking-[-0.035em] text-text">{headline}</h1>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted">{subtext}</p>
      {action}
    </div>
  );
}
