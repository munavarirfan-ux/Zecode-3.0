import { cn } from "@/lib/utils";

/** Dashboard surface system — layered depth for enterprise hierarchy */

/** Page canvas */
export const dashboardCanvas =
  "relative min-h-full rounded-[20px] bg-[#F5F7FA] px-1 py-0 dark:bg-app-bg sm:px-2";

/** Primary workspace container — pure white */
export const dashboardWorkspaceShell =
  "min-w-0 rounded-[18px] border border-[rgba(15,23,42,0.05)] bg-white shadow-[0_8px_40px_-24px_rgba(15,23,42,0.12)] dark:border-white/[0.06] dark:bg-surface/50";

/** Operational KPI cards */
export const dashboardKpiCard =
  "group relative flex min-h-[118px] flex-col rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FCFCFD] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-10px_rgba(15,23,42,0.06)] transition-all duration-[180ms] ease-out hover:-translate-y-px hover:border-[rgba(15,61,46,0.14)] hover:bg-white hover:shadow-[0_6px_24px_-8px_rgba(15,23,42,0.1),0_0_0_1px_rgba(15,61,46,0.04)] dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]";

export const dashboardKpiIcon =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:bg-white/[0.06]";

export const dashboardLabel =
  "text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] dark:text-muted/90";

export const dashboardSectionTitle = "text-[15px] font-semibold tracking-[-0.025em] text-[#18181B] dark:text-text";
export const dashboardSectionSub = "mt-0.5 text-[12px] leading-snug text-[#52525B]/90 dark:text-muted/80";

export {
  hiringCard as dashboardCard,
  hiringShadowHover as dashboardShadowHover,
  hiringTransition as dashboardTransition,
  hiringMeta as dashboardMeta,
} from "@/components/hiring/hiringTokens";

export {
  hiringHeroGradient as dashboardHeroGradient,
  hiringHeroTopo as dashboardHeroTopo,
  hiringHeroGlassKpi as dashboardHeroGlassKpi,
  hiringHeroShell as dashboardHeroShell,
} from "@/components/hiring/hiringTokens";

/** Primary border — intelligence workspace cards (all roles) */
export const dashboardIntelligenceBorder =
  "border border-[rgb(var(--accent-rgb)/0.28)] dark:border-[rgb(var(--accent-rgb)/0.32)]";

/** Nested workspace panels */
export const dashboardPanel = cn(
  "min-w-0 rounded-[14px] bg-[#FAFAFB] dark:bg-white/[0.02]",
  dashboardIntelligenceBorder,
);

export const dashboardPanelInteractive = cn(
  "min-w-0 rounded-[14px] bg-white shadow-[0_1px_3px_rgb(var(--accent-rgb)/0.08)] dark:bg-white/[0.03]",
  dashboardIntelligenceBorder,
);

export const dashboardInsightCard = dashboardPanelInteractive;

export const dashboardRowSurface =
  "group/row flex gap-3 rounded-xl border border-transparent bg-[#FCFCFD] p-3 transition-all duration-[180ms] ease-out hover:-translate-y-px hover:border-[rgba(15,23,42,0.07)] hover:bg-white hover:shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]";

export { radixInteractiveCard as dashboardInteractive } from "@/lib/radix-motion";

/** Bento grid for intelligence workspace panels */
export const dashboardBentoGrid =
  "grid grid-cols-1 gap-3 sm:grid-cols-6 lg:grid-cols-12 lg:auto-rows-[minmax(108px,auto)] lg:gap-3";

export const dashboardBentoCell = "min-w-0 h-full [&>section]:h-full";

export const dashboardBentoSpan = {
  hero: "sm:col-span-6 lg:col-span-8 lg:row-span-2",
  chart: "sm:col-span-6 lg:col-span-7 lg:row-span-2",
  side: "sm:col-span-6 lg:col-span-4",
  sideWide: "sm:col-span-6 lg:col-span-5 lg:row-span-2",
  sideTall: "sm:col-span-6 lg:col-span-4 lg:row-span-2",
  wide: "sm:col-span-6 lg:col-span-12",
  half: "sm:col-span-6 lg:col-span-6",
  third: "sm:col-span-3 lg:col-span-4",
  quarter: "sm:col-span-3 lg:col-span-3",
} as const;
