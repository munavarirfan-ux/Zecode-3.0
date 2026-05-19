import { cn } from "@/lib/utils";

export const DOCK_TRANSITION =
  "transition-[background-color,border-color,box-shadow,transform,color] duration-200 ease-out";

/** Minimum touch target — 44px */
export const BUBBLE_SIZE = "h-11 w-11 min-h-[44px] min-w-[44px]";

/** Code challenge accent — dot only, no glow */
export const DOCK_ACCENT_DOT = "#A78BFA";

export type GlassBubbleVariant = "default" | "active" | "muted" | "hero" | "danger";

/** Floating anchor — fixed to viewport during code challenge so scroll does not move the dock */
export function glassDockAnchor(fixedToViewport = false): string {
  return cn(
    "pointer-events-none z-30 flex justify-center px-4",
    fixedToViewport ? "fixed inset-x-0 bottom-6" : "absolute inset-x-0 bottom-6",
  );
}

/** Thick frosted glass pill — adapts to ZeMeet light/dark theme */
export function glassDockPill(isLight: boolean): string {
  return cn(
    "pointer-events-auto inline-flex max-h-16 w-fit max-w-[calc(100vw-2rem)] items-center",
    "rounded-full border py-2.5 pl-3.5 pr-3.5",
    "backdrop-blur-[28px] backdrop-saturate-[180%]",
    DOCK_TRANSITION,
    isLight
      ? [
          "border-[rgba(255,255,255,0.55)]",
          "bg-[rgba(255,255,255,0.72)]",
          "shadow-[0_18px_50px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.65)]",
        ]
      : [
          "border-[rgba(255,255,255,0.10)]",
          "bg-[rgba(10,13,18,0.82)]",
          "shadow-[0_18px_50px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)]",
        ],
  );
}

export function glassDockRow(): string {
  return cn("flex flex-wrap items-center justify-center gap-2");
}

export function glassGroupDivider(isLight: boolean): string {
  return cn(
    "mx-0.5 hidden h-7 w-px shrink-0 sm:block",
    DOCK_TRANSITION,
    isLight ? "bg-[rgba(15,23,42,0.12)]" : "bg-[rgba(255,255,255,0.12)]",
  );
}

export function glassBubbleSurface(
  isLight: boolean,
  variant: GlassBubbleVariant = "default",
): string {
  const focusRing = isLight
    ? "focus-visible:ring-[rgba(15,23,42,0.2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(255,255,255,0.65)]"
    : "focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,13,18,0.9)]";

  if (variant === "danger") {
    return cn(
      "relative inline-flex shrink-0 items-center justify-center rounded-full border border-transparent",
      "h-11 min-h-[44px] min-w-[44px] px-4",
      "bg-[#DC2626] text-[#FFFFFF]",
      "hover:bg-[#B91C1C]",
      DOCK_TRANSITION,
      "active:scale-[0.98]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]/40",
      focusRing,
    );
  }

  const base = cn(
    "relative inline-flex shrink-0 items-center justify-center rounded-full border",
    BUBBLE_SIZE,
    DOCK_TRANSITION,
    "active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2",
    focusRing,
  );

  if (variant === "hero") {
    return cn(
      base,
      isLight
        ? "border-[rgba(15,23,42,0.12)] bg-[rgba(15,23,42,0.06)] hover:border-[rgba(15,23,42,0.16)] hover:bg-[rgba(15,23,42,0.1)]"
        : "border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.16)]",
    );
  }

  if (variant === "active") {
    return cn(
      base,
      isLight
        ? "border-[rgba(15,23,42,0.16)] bg-[rgba(15,23,42,0.1)]"
        : "border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.18)]",
    );
  }

  if (variant === "muted") {
    return cn(
      base,
      isLight
        ? "border-[rgba(15,23,42,0.1)] bg-[rgba(255,255,255,0.85)] hover:border-[rgba(15,23,42,0.14)] hover:bg-white"
        : "border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.14)]",
    );
  }

  return cn(
    base,
    isLight
      ? "border-[rgba(15,23,42,0.1)] bg-[rgba(255,255,255,0.9)] hover:border-[rgba(15,23,42,0.14)] hover:bg-white"
      : "border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.14)]",
  );
}

export function glassIconClass(isLight: boolean, variant?: GlassBubbleVariant): string {
  if (variant === "muted") {
    return isLight ? "text-[#71717A]" : "text-[rgba(255,255,255,0.55)]";
  }
  if (variant === "active" || variant === "hero") {
    return isLight ? "text-[#18181B]" : "text-white";
  }
  if (variant === "danger") {
    return "text-[#FFFFFF]";
  }
  return isLight ? "text-[#3F3F46]" : "text-[rgba(255,255,255,0.88)]";
}

/** Tiny accent marker for code challenge — no glow */
export function glassHeroAccentClass(): string {
  return "pointer-events-none absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#A78BFA]";
}

export function glassTooltipSurface(isLight: boolean): string {
  return cn(
    "flex items-center gap-2 border px-2.5 py-1.5 backdrop-blur-[24px]",
    DOCK_TRANSITION,
    isLight
      ? "border-[rgba(15,23,42,0.1)] bg-white text-[#18181B] shadow-[0_4px_16px_rgba(15,23,42,0.12)]"
      : "border-[rgba(255,255,255,0.10)] bg-[rgba(10,13,18,0.96)] text-[rgba(255,255,255,0.92)] shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
  );
}

export function glassTooltipKbd(isLight: boolean): string {
  return cn(
    "rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium",
    isLight ? "bg-[rgba(15,23,42,0.06)] text-[#71717A]" : "bg-white/10 text-white/50",
  );
}
