import { cn } from "@/lib/utils";
import { hiringCard, hiringHeroSelectSm, hiringTransition } from "@/components/hiring/hiringTokens";

/** Theme-aware accent surfaces — never hardcode purple */
export const settingsAccentBg = "bg-[rgb(var(--accent-rgb)/0.08)]";
export const settingsAccentBgHover = "hover:bg-[rgb(var(--accent-rgb)/0.06)]";
export const settingsAccentBgActive = "bg-[rgb(var(--accent-rgb)/0.12)]";
export const settingsAccentBorder = "border-[rgb(var(--accent-rgb)/0.2)]";
export const settingsAccentBorderSoft = "border-[rgb(var(--accent-rgb)/0.12)]";
export const settingsCanvasGlow =
  "bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgb(var(--accent-rgb)/0.06),transparent)]";
export const settingsModalShadow = "shadow-[0_24px_80px_-24px_rgb(var(--accent-rgb)/0.22)]";

export const settingsPanel = hiringCard;

export const settingsField = cn(
  "h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 text-[13px] text-text outline-none",
  "placeholder:text-muted/70 focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.25)]",
  "dark:border-white/[0.08] dark:bg-white/[0.04]",
);

export const settingsFieldLabel = "text-[12px] font-medium text-text";

export const settingsSectionTitle = "text-[14px] font-semibold tracking-[-0.02em] text-text";

export const settingsSectionDesc = "text-[12px] leading-relaxed text-text-secondary/80";

export const settingsPrimaryBtn = cn(
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] bg-accent px-4 text-[13px] font-semibold text-white",
  hiringTransition,
  "hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50",
);

export const settingsSecondaryBtn = cn(
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-4 text-[13px] font-medium text-text",
  hiringTransition,
  "hover:bg-[rgb(var(--accent-rgb)/0.05)] dark:border-white/[0.08]",
);

export const settingsNavRail = cn(settingsPanel, "sticky top-4 p-3 lg:p-4");

export const settingsNavIcon = cn(
  "flex h-8 w-8 items-center justify-center rounded-[10px] text-accent",
  settingsAccentBg,
);

export const settingsNavLink = (active: boolean) =>
  cn(
    "block rounded-[10px] px-2.5 py-2 text-[13px] font-medium transition-all duration-[180ms]",
    active
      ? cn(settingsAccentBgActive, "text-accent shadow-[inset_2px_0_0_0_rgb(var(--accent-rgb))]")
      : "text-text-secondary/85 hover:bg-[rgba(15,23,42,0.04)] hover:text-text dark:hover:bg-white/[0.04]",
  );

/** Hero strip controls (settings headers on gradient) */
export const settingsHeroSelect = hiringHeroSelectSm;

export const settingsIconTile = cn(
  "flex items-center justify-center rounded-[12px] border border-[rgba(15,23,42,0.06)] text-accent dark:border-white/[0.08]",
  settingsAccentBg,
);
