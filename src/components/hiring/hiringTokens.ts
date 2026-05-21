import { cn } from "@/lib/utils";

/** Shared elevation + border language for hiring surfaces */
export const hiringBorder = "border border-[rgba(15,23,42,0.04)] dark:border-white/[0.05]";

export const hiringShadow =
  "shadow-[0_1px_2px_rgba(15,23,42,0.02),0_4px_16px_rgba(15,23,42,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.2)]";

export const hiringShadowHover =
  "hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_16px_40px_rgba(15,23,42,0.06),0_0_0_1px_rgb(var(--accent-rgb)/0.08)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_16px_40px_rgba(0,0,0,0.28),0_0_0_1px_rgb(var(--accent-rgb)/0.12)]";

export const hiringCard = cn(
  "rounded-[20px] bg-surface/98 backdrop-blur-sm",
  hiringBorder,
  hiringShadow,
  "transition-[transform,box-shadow,border-color] duration-[180ms] ease-out",
);

export const hiringCanvas =
  "relative min-h-full w-full min-w-0 rounded-[20px] bg-white py-2 dark:bg-[#0E0E11] sm:py-3";

export const hiringTransition = "transition-all duration-[180ms] ease-out";

export const hiringTitle = "text-[1.0625rem] font-semibold leading-snug tracking-[-0.025em] text-text";

export const hiringMeta = "text-[13px] font-medium text-text-secondary/70";

export const hiringLabel = "text-[10px] font-medium uppercase tracking-[0.08em] text-muted/70";

export const hiringStatChip =
  "inline-flex items-center gap-1.5 rounded-full border border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.02)] px-2.5 py-1 text-[11px] font-medium text-text-secondary/85 dark:border-white/[0.06] dark:bg-white/[0.03]";

export const hiringStatValue = "tabular-nums font-semibold text-text";

/** Dynamic hero gradient from selected accent (see `lib/theme.ts` → `--hero-gradient-*-rgb`) */
export const hiringHeroGradient =
  "bg-[linear-gradient(to_bottom_right,rgb(var(--hero-gradient-from-rgb)),rgb(var(--hero-gradient-via-rgb)),rgb(var(--hero-gradient-to-rgb)))]";

export const hiringHeroShell = cn(
  "relative isolate overflow-hidden rounded-[28px]",
  "border border-[rgb(var(--hero-border-rgb)/0.28)]",
  "text-[rgb(var(--hero-fg-rgb))]",
  hiringHeroGradient,
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.08)]",
  "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
  "px-8 py-8 sm:px-8 sm:py-8 lg:px-10 lg:py-9",
);

/** Compact page header strip — title + actions (~72–90px when metrics collapsed) */
export const hiringHeroStripShell = cn(
  hiringHeroShell,
  "!px-6 !py-4 sm:!px-6 sm:!py-4 lg:!px-6 lg:!py-4",
);

/** Collapsed page hero — single-line strip (~36–40px) */
export const hiringHeroCollapsedShell = cn(
  hiringHeroShell,
  "!rounded-xl !px-4 !py-2 sm:!px-4 sm:!py-2",
  "transition-[padding] duration-200 ease-out motion-reduce:transition-none",
);

export const hiringHeroCollapseTransition =
  "transition-[padding] duration-200 ease-out motion-reduce:transition-none";

export const hiringHeroCollapsedTitle = "truncate text-sm font-semibold text-white";

export const hiringHeroCollapsedMeta =
  "hidden truncate text-xs text-white/60 md:inline";

export const hiringHeroCollapsedRow = "relative flex min-w-0 items-center gap-2 sm:gap-3";

export const hiringHeroCollapsedBackBtn = cn(
  "h-7 w-7 shrink-0 rounded-full border border-white/[0.16] bg-white/[0.07] text-white/80",
  "hover:border-white/[0.26] hover:bg-white/[0.11] hover:text-white",
);

export const hiringHeroCollapseToggleBtn = cn(
  "h-7 w-7 shrink-0 text-white/70 hover:bg-white/[0.08] hover:text-white",
);

export const hiringHeroCollapsedIconBtn = cn(
  "h-7 w-7 shrink-0 rounded-[10px] border-white/[0.18] bg-white/[0.08] text-white backdrop-blur-sm",
  "hover:border-white/[0.28] hover:bg-white/[0.14]",
);

export const hiringHeroCollapsedActions = "flex shrink-0 items-center gap-1";

export const hiringHeroStripRow =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4";

export const hiringHeroStripHeader = "min-w-0";

export const hiringHeroStripTitle =
  "text-2xl font-semibold leading-tight tracking-[-0.025em] text-white";

export const hiringHeroStripSubtitle = "mt-0.5 text-sm leading-snug text-white/70";

export const hiringHeroStripActions = "flex shrink-0 flex-wrap items-center gap-2";

export const hiringHeroStripBody = "relative space-y-4";

/** Workspace / detail heroes — back link + strip row + optional metrics */
export const hiringHeroStripWorkspaceBody = "relative space-y-3";

export const hiringHeroBackLink = cn(
  "inline-flex w-fit items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.07] px-3 py-1 text-[11px] font-medium text-white/72 backdrop-blur-sm",
  hiringTransition,
  "hover:border-white/[0.26] hover:bg-white/[0.11] hover:text-white",
);

export const hiringHeroStripMetaLine = "text-sm text-white/70";

export const hiringHeroStripMetaChips = "flex flex-wrap items-center gap-2";

/** Dialog / report headers — compact strip padding, no min-height */
export const hiringHeroReportStripShell = cn(
  hiringHeroStripShell,
  "shrink-0 overflow-hidden rounded-[16px] border-b-0 shadow-none",
);

/** Report/modal heroes with avatar + meta chips */
export const hiringHeroReportStripRow = cn(
  hiringHeroStripRow,
  "items-start sm:items-center",
);

/**
 * Staggered [] bracket grid — applied via inline style (Tailwind cannot see runtime URLs).
 * Tile: 64×56px, ~24px rounded-rect outlines, offset every other row.
 */
const hiringHeroBracketPatternSvg = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="56" viewBox="0 0 64 56">' +
    '<g fill="none" stroke="#fff" stroke-width="1">' +
    '<rect x="4" y="4" width="24" height="20" rx="3.5"/>' +
    '<rect x="36" y="4" width="24" height="20" rx="3.5"/>' +
    '<rect x="20" y="32" width="24" height="20" rx="3.5"/>' +
    "</g></svg>",
);

/** @deprecated Use `<HiringHeroTexture />` — class alone does not include the SVG pattern */
export const hiringHeroTopo = cn(
  "pointer-events-none absolute inset-0 z-[1]",
  "opacity-[0.07] mix-blend-soft-light",
  "[mask-image:radial-gradient(ellipse_88%_78%_at_50%_42%,#000_18%,transparent_74%)]",
  "[-webkit-mask-image:radial-gradient(ellipse_88%_78%_at_50%_42%,#000_18%,transparent_74%)]",
);

export const hiringHeroTopoPatternStyle = {
  backgroundImage: `url("data:image/svg+xml,${hiringHeroBracketPatternSvg}")`,
  backgroundSize: "64px 56px",
} as const;

export const hiringHeroGlassKpi = cn(
  "group/kpi relative flex min-h-0 flex-col overflow-hidden rounded-[18px] p-[18px] sm:p-5",
  "border border-white/[0.22] bg-white/[0.12] backdrop-blur-[22px]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_32px_-12px_rgba(0,0,0,0.25)]",
  "transition-all duration-[180ms] ease-out",
  "hover:-translate-y-0.5 hover:border-white/[0.32] hover:bg-white/[0.16]",
  "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_40px_-10px_rgba(0,0,0,0.28)]",
);

export const hiringHeroRadialOverlay = {
  backgroundImage:
    "radial-gradient(ellipse 80% 50% at 20% 100%, rgba(255,255,255,0.06) 0, transparent 50%), radial-gradient(ellipse 60% 40% at 90% 0%, rgba(255,255,255,0.09) 0, transparent 45%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 35%)",
} as const;

/** Primary CTA on gradient hero — white surface, brand accent text */
export const hiringHeroPrimaryBtn = cn(
  "border-0 font-semibold text-accent bg-white",
  "shadow-[0_2px_12px_rgba(0,0,0,0.14)]",
  hiringTransition,
  "hover:bg-white/95 hover:text-accent-hover hover:shadow-[0_4px_18px_rgba(0,0,0,0.16)]",
);

export const hiringHeroPrimaryBtnSm = cn(
  hiringHeroPrimaryBtn,
  "h-9 gap-1.5 rounded-[11px] px-4 text-[13px]",
);

/** Secondary CTA on gradient hero — frosted glass, white text */
export const hiringHeroSecondaryBtnSm = cn(
  "h-9 gap-1.5 rounded-[11px] border-0 px-4 text-[13px] font-medium text-white",
  hiringTransition,
  "bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-white/[0.2]",
);

export const hiringHeroPrimaryBtnMd = cn(
  hiringHeroPrimaryBtn,
  "h-10 shrink-0 gap-1.5 rounded-[12px] px-5 text-sm hover:-translate-y-px",
);

/** Primary CTA in compact strip — h-9 to align with `hiringHeroSecondaryBtnSm` */
export const hiringHeroStripPrimaryBtn = cn(
  hiringHeroPrimaryBtn,
  "h-9 shrink-0 gap-1.5 rounded-[11px] px-4 text-[13px]",
);

/** Frosted overview modules — Linear / Ashby-inspired */
export const overviewGlassCard = cn(
  "rounded-[24px] border border-[rgba(16,24,40,0.06)] bg-[rgba(255,255,255,0.72)] p-4 backdrop-blur-[12px] sm:p-5",
  "shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_28px_-12px_rgba(15,23,42,0.08)]",
  "transition-[transform,box-shadow] duration-[180ms] ease-out",
  "hover:-translate-y-px hover:shadow-[0_2px_6px_rgba(15,23,42,0.04),0_16px_40px_-14px_rgba(15,23,42,0.12)]",
  "dark:border-white/[0.06] dark:bg-white/[0.04] dark:hover:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.35)]",
);

export const overviewElevatedPanel = cn(
  "rounded-[20px] border border-[rgba(16,24,40,0.08)] bg-white p-4",
  "shadow-[0_2px_12px_-4px_rgba(15,23,42,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset]",
  "dark:border-white/[0.08] dark:bg-white/[0.06] dark:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.4)]",
);

export const overviewSectionLabel =
  "text-[10px] font-medium uppercase tracking-[0.1em] text-[#A1A1AA] dark:text-muted/75";

export const overviewSectionTitle =
  "text-[14px] font-medium tracking-[-0.02em] text-[#18181B] dark:text-text";

export const overviewBody =
  "text-[13px] leading-[1.55] text-[#52525B] dark:text-text-secondary/85";

export const overviewMuted = "text-[12px] text-[#71717A] dark:text-muted/80";

/** Kanban workspace tint — see `globals.css` `.kanban-board-shell` (theme accent CSS vars) */
export const kanbanBoardShell = "kanban-board-shell";
/** Kanban tint without forced min-height — use for headers */
export const kanbanBoardTint = "kanban-board-tint";
export const kanbanBoardGrain = "kanban-board-grain";
export const kanbanBoardTrack = "kanban-board-track";
export const kanbanColumnShell = "kanban-column-shell";
export const kanbanColumnShellDrop = "is-drop-target";
export const kanbanColumnHeader = "kanban-column-header";

export const kanbanColumnBody = "kanban-column-body";

export const kanbanCard = cn(
  "group rounded-[12px] border border-[rgba(15,23,42,0.07)] bg-white p-3 text-left",
  "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_6px_16px_-6px_rgba(15,23,42,0.08)]",
  "dark:border-white/[0.08] dark:bg-[rgb(var(--surface-rgb))] dark:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)]",
  hiringTransition,
  "hover:border-[rgba(15,23,42,0.1)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.05),0_12px_24px_-8px_rgba(15,23,42,0.1)]",
  "dark:hover:border-white/[0.12]",
);

export const kanbanCardDragging = "opacity-50 ring-2 ring-[rgb(var(--accent-rgb)/0.18)] shadow-lg";
