import { cn } from "@/lib/utils";

export const nuxGlassCard = cn(
  "relative overflow-hidden rounded-[22px]",
  "border border-white/70 bg-white/75 backdrop-blur-[20px]",
  "shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_24px_56px_-28px_rgba(var(--accent-rgb),0.22)]",
  "transition-[transform,box-shadow,border-color] duration-300 ease-out",
  "dark:border-white/[0.08] dark:bg-white/[0.06]",
  "dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_24px_56px_-28px_rgba(0,0,0,0.45)]",
);

export const nuxGlassCardHover = cn(
  "hover:-translate-y-1",
  "hover:border-[rgb(var(--accent-rgb)/0.22)]",
  "hover:shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_28px_64px_-24px_rgba(var(--accent-rgb),0.35)]",
);

export const nuxSetupPanel = cn(
  nuxGlassCard,
  "rounded-[22px]",
  "border-[rgb(var(--accent-rgb)/0.12)]",
  "bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.78)_48%,rgba(var(--accent-rgb),0.04)_100%)]",
);

export const nuxAccentGlow = cn(
  "pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300",
  "bg-[radial-gradient(ellipse_at_50%_0%,rgba(var(--accent-rgb),0.18),transparent_68%)]",
  "group-hover:opacity-100",
);
