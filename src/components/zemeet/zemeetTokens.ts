import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import type { ZeMeetTheme } from "@/lib/zemeet/theme";
import { cn } from "@/lib/utils";

export type ZeMeetTokens = ReturnType<typeof createZeMeetTokens>;

export function createZeMeetTokens(theme: ZeMeetTheme) {
  const isLight = theme === "light";

  return {
    theme,
    isLight,
    shell: cn(
      "relative min-h-dvh overflow-hidden",
      isLight ? "bg-[#F4F6F9] text-[#18181B]" : "bg-[#0B0F14] text-[#E8EAED]",
    ),
    grain: cn(
      "pointer-events-none absolute inset-0",
      isLight
        ? "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(var(--accent-rgb)/0.08),transparent_55%)]"
        : "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(var(--accent-rgb)/0.12),transparent_55%)]",
    ),
    glass: cn(
      "rounded-[16px] border backdrop-blur-xl",
      isLight
        ? "border-[rgba(15,23,42,0.08)] bg-white/80 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
        : "border-white/[0.08] bg-white/[0.04] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]",
    ),
    glassElevated: cn(
      isLight
        ? "rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.14)] backdrop-blur-xl"
        : "rounded-[16px] border border-white/[0.08] bg-white/[0.06] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl",
    ),
    panel: cn(
      "rounded-[14px] border backdrop-blur-md",
      isLight
        ? "border-[rgba(15,23,42,0.08)] bg-white/95"
        : "border-white/[0.06] bg-[#12171F]/90",
    ),
    label: cn(
      "text-[10px] font-semibold uppercase tracking-[0.1em]",
      isLight ? "text-[#71717A]" : "text-white/45",
    ),
    meta: cn("text-[12px]", isLight ? "text-[#52525B]" : "text-white/55"),
    title: cn(
      "text-[15px] font-semibold tracking-[-0.02em]",
      isLight ? "text-[#18181B]" : "text-white/95",
    ),
    controlBtn: cn(
      "inline-flex h-9 w-9 items-center justify-center rounded-[10px] transition-[background-color,box-shadow,transform,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2",
      isLight
        ? "text-[#52525B] hover:bg-[rgba(15,23,42,0.06)] hover:text-[#18181B] focus-visible:ring-[rgba(15,23,42,0.15)]"
        : "text-white/65 hover:bg-white/[0.08] hover:text-white/95 focus-visible:ring-white/20",
    ),
    controlBtnDanger: cn(
      "inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold text-white transition-[background-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40",
      "bg-[#E5484D] shadow-[0_2px_12px_-2px_rgba(229,72,77,0.55)] hover:bg-[#DC3E43] hover:shadow-[0_4px_16px_-2px_rgba(229,72,77,0.6)] active:scale-[0.98]",
    ),
    controlBtnActive: cn(
      "inline-flex h-9 w-9 items-center justify-center rounded-[10px] transition-[background-color,box-shadow,transform,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2",
      isLight
        ? "bg-[rgb(var(--accent-rgb)/0.12)] text-[rgb(var(--accent-rgb))] shadow-[0_0_0_1px_rgb(var(--accent-rgb)/0.2),0_0_12px_-4px_rgb(var(--accent-rgb)/0.35)] focus-visible:ring-[rgb(var(--accent-rgb)/0.25)]"
        : "bg-[rgb(var(--accent-rgb)/0.18)] text-white shadow-[0_0_0_1px_rgb(var(--accent-rgb)/0.35),0_0_16px_-4px_rgb(var(--accent-rgb)/0.45)] focus-visible:ring-[rgb(var(--accent-rgb)/0.35)]",
    ),
    controlBtnMuted: cn(
      "inline-flex h-9 w-9 items-center justify-center rounded-[10px] transition-[background-color,box-shadow,transform,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2",
      isLight
        ? "bg-[rgba(229,72,77,0.1)] text-[#DC3E43] shadow-[0_0_0_1px_rgba(229,72,77,0.15)] focus-visible:ring-red-300/40"
        : "bg-red-500/15 text-red-300 shadow-[0_0_0_1px_rgba(248,113,113,0.2)] focus-visible:ring-red-400/30",
    ),
    controlDockAnchor:
      "pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4",
    primaryBtn: cn(
      "inline-flex h-11 items-center justify-center rounded-[12px] px-6 text-[14px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2",
      "bg-[rgb(var(--accent-rgb))] text-white shadow-[0_4px_24px_-4px_rgb(var(--accent-rgb)/0.5)] hover:brightness-110",
      isLight ? "focus-visible:ring-[rgba(15,23,42,0.2)]" : "focus-visible:ring-white/30",
    ),
    videoTile: cn(
      "relative overflow-hidden rounded-[16px] border",
      isLight
        ? "border-[rgba(15,23,42,0.08)] bg-[#ECEFF3] shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)]"
        : "border-white/[0.08] bg-[#161B24] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.6)]",
    ),
    previewGradient: isLight
      ? "bg-gradient-to-br from-[#E8EDF4] via-[#F0F3F8] to-[#E4E9F0]"
      : "bg-gradient-to-br from-[#1a2230] via-[#12171f] to-[#0b0f14]",
    topBar: cn(
      "flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur-md",
      isLight
        ? "border-[rgba(15,23,42,0.08)] bg-white/90"
        : "border-white/[0.06] bg-[#0B0F14]/80",
    ),
    select: cn(
      "mt-1.5 w-full rounded-[10px] border px-2.5 py-2 text-[12px] outline-none focus:ring-2",
      isLight
        ? "border-[rgba(15,23,42,0.1)] bg-white text-[#18181B] focus:ring-[rgba(15,23,42,0.15)]"
        : "border-white/[0.08] bg-[#12171F] text-white/90 focus:ring-white/20",
    ),
    input: cn(
      "min-w-0 flex-1 rounded-[10px] border px-3 py-2 text-[13px] outline-none focus:ring-2",
      isLight
        ? "border-[rgba(15,23,42,0.1)] bg-white text-[#18181B] focus:ring-[rgba(15,23,42,0.15)]"
        : "border-white/[0.08] bg-[#0d1118] text-white focus:ring-white/15",
    ),
    mutedBadge: cn(
      "rounded-full px-2 py-1 text-[10px] font-medium backdrop-blur-sm",
      isLight ? "bg-black/50 text-white/90" : "bg-black/50 text-white/80",
    ),
    heading: cn(
      "text-[1.75rem] font-semibold tracking-[-0.04em]",
      isLight ? "text-[#18181B]" : "text-white",
    ),
    bodyStrong: cn("text-[14px] font-medium", isLight ? "text-[#18181B]" : "text-white/90"),
    subtlePanel: cn(
      "rounded-[10px] border p-3",
      isLight
        ? "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)]"
        : "border-white/[0.06] bg-white/[0.03]",
    ),
    subtleText: cn("text-[11px] leading-relaxed", isLight ? "text-[#52525B]" : "text-white/55"),
    themeToggle: cn(
      "inline-flex items-center gap-1 rounded-full border p-0.5",
      isLight ? "border-[rgba(15,23,42,0.1)] bg-[rgba(15,23,42,0.04)]" : "border-white/10 bg-white/[0.04]",
    ),
    themeToggleBtn: (active: boolean) =>
      cn(
        "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
        active
          ? isLight
            ? "bg-white text-[#18181B] shadow-sm"
            : "bg-white/15 text-white"
          : isLight
            ? "text-[#71717A] hover:text-[#18181B]"
            : "text-white/50 hover:text-white/80",
      ),
  };
}

/** @deprecated Use useZeMeetTokens() for theme-aware classes */
export const zemeetShell = createZeMeetTokens("dark").shell;
export const zemeetGrain = createZeMeetTokens("dark").grain;
export const zemeetGlass = createZeMeetTokens("dark").glass;
export const zemeetGlassElevated = createZeMeetTokens("dark").glassElevated;
export const zemeetPanel = createZeMeetTokens("dark").panel;
export const zemeetLabel = createZeMeetTokens("dark").label;
export const zemeetMeta = createZeMeetTokens("dark").meta;
export const zemeetTitle = createZeMeetTokens("dark").title;
export const zemeetControlBtn = createZeMeetTokens("dark").controlBtn;
export const zemeetControlBtnDanger = createZeMeetTokens("dark").controlBtnDanger;
export const zemeetControlBtnActive = createZeMeetTokens("dark").controlBtnActive;
export const zemeetPrimaryBtn = createZeMeetTokens("dark").primaryBtn;
export const zemeetVideoTile = createZeMeetTokens("dark").videoTile;

export function useZeMeetTokens() {
  const { theme } = useZeMeet();
  return createZeMeetTokens(theme);
}
