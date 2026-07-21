"use client";

import { cn } from "@/lib/utils";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.6s_ease-in-out_infinite] dark:before:via-white/[0.06] motion-reduce:before:animate-none";

const base = "rounded-[14px] bg-[rgba(15,23,42,0.04)] dark:bg-white/[0.04]";

export function SkeletonBox({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(base, shimmer, className)} {...props} />;
}

export function SkeletonText({ className }: { className?: string; lines?: number; widths?: string[] }) {
  return <SkeletonBox className={className} />;
}

export function SkeletonAvatar({ className }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return <SkeletonBox className={className} />;
}

export function SkeletonButton({ className }: { className?: string }) {
  return <SkeletonBox className={className} />;
}

export function SkeletonInput({ className }: { className?: string }) {
  return <SkeletonBox className={className} />;
}

export function SkeletonPill({ className }: { className?: string }) {
  return <SkeletonBox className={className} />;
}

export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn(base, shimmer, className)}>{children}</div>;
}

export function SkeletonKPI({ className }: { className?: string }) {
  return <SkeletonBox className={cn("h-[100px]", className)} />;
}

export function SkeletonHero({ className }: { className?: string }) {
  return <SkeletonBox className={cn("h-[160px] rounded-[20px]", className)} />;
}

export function SkeletonTableRow({ className }: { className?: string; cols?: number }) {
  return <SkeletonBox className={className} />;
}

export function SkeletonListRow({ className }: { className?: string }) {
  return <SkeletonBox className={className} />;
}
