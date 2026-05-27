"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import type { LineArtIllustrationId } from "@/components/empty-states/line-art-illustrations";
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
  illustration: LineArtIllustrationId | string;
  headline: string;
  subtext: string;
  recoveryLabel: string;
  onRecovery?: () => void;
  recoveryHref?: string;
  className?: string;
}) {
  const action =
    recoveryHref != null ? (
      <Button asChild variant="outline" className="rounded-[12px]">
        <Link href={recoveryHref}>{recoveryLabel}</Link>
      </Button>
    ) : (
      <Button type="button" variant="outline" className="rounded-[12px]" onClick={onRecovery}>
        {recoveryLabel}
      </Button>
    );

  return (
    <div className={cn("flex min-h-[50vh] items-center justify-center px-4 py-16", className)}>
      <LineArtEmptyState illustration={illustration} message={headline} description={subtext}>
        {action}
      </LineArtEmptyState>
    </div>
  );
}
