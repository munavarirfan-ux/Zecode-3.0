"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { candidateInitials } from "@/components/hiring/directories/candidateDirectoryUi";
import { cn } from "@/lib/utils";
import type { EngagementRecord } from "@/lib/hiring/types";

function formatRelativeEngagement(iso: string): string {
  const then = new Date(iso).getTime();
  const now = new Date("2026-05-15").getTime();
  const days = Math.floor((now - then) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

const ENGAGEMENT_LABELS: Record<EngagementRecord["engagementType"], string> = {
  viewed: "Viewed profile",
  emailed: "Sent email",
  commented: "Left comment",
  scheduled: "Scheduled interview",
  voted: "Recorded verdict",
};

export function EngagedByPills({
  recruiters,
  ownerId,
  max = 3,
  className,
  compact = false,
}: {
  recruiters: EngagementRecord[];
  ownerId: string;
  max?: number;
  className?: string;
  compact?: boolean;
}) {
  const visible = recruiters.slice(0, max);
  const overflow = Math.max(0, recruiters.length - max);

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center gap-1">
        {visible.map((r) => (
          <Tooltip key={r.recruiterId}>
            <TooltipTrigger asChild>
              <div className="relative shrink-0">
                <span
                  className={cn(
                    "flex items-center justify-center overflow-hidden rounded-full border border-border-subtle",
                    "bg-gradient-to-br from-accent/15 to-accent-deep/10 font-semibold text-accent-deep",
                    compact ? "h-4 w-4 text-[8px]" : "h-5 w-5 text-[9px]",
                  )}
                >
                  {r.recruiterAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.recruiterAvatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    candidateInitials(r.recruiterName)
                  )}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px] text-xs">
              <p className="font-medium text-text">
                {r.recruiterName}
                {r.recruiterId === ownerId ? " (owner)" : ""}
              </p>
              <p className="mt-0.5 text-muted">
                Last: {ENGAGEMENT_LABELS[r.engagementType]},{" "}
                {formatRelativeEngagement(r.lastEngagedAt)}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      {overflow > 0 ? (
        <span className="ml-1.5 text-[10px] text-muted">+{overflow}</span>
      ) : null}
    </div>
  );
}
