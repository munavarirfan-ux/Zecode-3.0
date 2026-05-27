"use client";

import { cn } from "@/lib/utils";
import {
  LineArtIllustration,
  toLineArtIllustrationId,
  type LineArtIllustrationId,
} from "./line-art-illustrations";

export type LineArtEmptyStateSize = "compact" | "default" | "sm";

const sizeStyles: Record<
  LineArtEmptyStateSize,
  { wrap: string; art: string; message: string; description: string }
> = {
  sm: {
    wrap: "px-2 py-4",
    art: "h-10 w-[4.5rem]",
    message: "text-[11px]",
    description: "text-[10px]",
  },
  compact: {
    wrap: "px-3 py-6",
    art: "h-14 w-[5.5rem]",
    message: "text-[12px]",
    description: "text-[11px]",
  },
  default: {
    wrap: "px-4 py-8 sm:py-10",
    art: "h-[72px] w-[120px]",
    message: "text-[13px] sm:text-sm",
    description: "text-[12px] sm:text-[13px]",
  },
};

export function LineArtEmptyState({
  illustration,
  message,
  description,
  size = "default",
  className,
  children,
}: {
  illustration: LineArtIllustrationId | string;
  message: string;
  description?: string;
  size?: LineArtEmptyStateSize;
  className?: string;
  children?: React.ReactNode;
}) {
  const artId = toLineArtIllustrationId(illustration);

  const s = sizeStyles[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        s.wrap,
        className,
      )}
      role="status"
    >
      <LineArtIllustration
        id={artId}
        className={cn(
          "text-[rgb(var(--accent-rgb)/0.42)] dark:text-muted/65",
          s.art,
        )}
      />
      <p
        className={cn(
          "mt-3 max-w-xs font-medium leading-relaxed text-[#52525B] dark:text-text-secondary/90",
          s.message,
        )}
      >
        {message}
      </p>
      {description ? (
        <p
          className={cn(
            "mt-1 max-w-sm leading-relaxed text-[#71717A] dark:text-muted",
            s.description,
          )}
        >
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
