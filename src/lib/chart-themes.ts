import type { ThemeMode } from "@/lib/theme";

/** Categorical series — tuned for light backgrounds (not library defaults). */
export const CHART_PALETTE_LIGHT = [
  "#7C3AED",
  "#EC4899",
  "#2563EB",
  "#16A34A",
  "#EAB308",
  "#0891B2",
  "#9333EA",
  "#EA580C",
] as const;

/** Categorical series — desaturated, readable on dark surfaces. */
export const CHART_PALETTE_DARK = [
  "#A78BFA",
  "#F472B6",
  "#60A5FA",
  "#4ADE80",
  "#FCD34D",
  "#22D3EE",
  "#C084FC",
  "#FB923C",
] as const;

export const CHART_GRID_LIGHT = "rgba(0, 0, 0, 0.06)";
export const CHART_GRID_DARK = "rgba(255, 255, 255, 0.08)";
export const CHART_AXIS_LIGHT = "#6B7280";
export const CHART_AXIS_DARK = "#A0A0AB";
export const CHART_TOOLTIP_BG_LIGHT = "#FFFFFF";
export const CHART_TOOLTIP_BG_DARK = "#1F1F24";
export const CHART_TOOLTIP_BORDER_LIGHT = "rgba(0, 0, 0, 0.1)";
export const CHART_TOOLTIP_BORDER_DARK = "rgba(255, 255, 255, 0.1)";

export type ChartThemeTokens = {
  palette: readonly string[];
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
};

export function getChartTheme(mode: ThemeMode): ChartThemeTokens {
  const isDark = mode === "dark";
  return {
    palette: isDark ? CHART_PALETTE_DARK : CHART_PALETTE_LIGHT,
    grid: isDark ? CHART_GRID_DARK : CHART_GRID_LIGHT,
    axis: isDark ? CHART_AXIS_DARK : CHART_AXIS_LIGHT,
    tooltipBg: isDark ? CHART_TOOLTIP_BG_DARK : CHART_TOOLTIP_BG_LIGHT,
    tooltipBorder: isDark ? CHART_TOOLTIP_BORDER_DARK : CHART_TOOLTIP_BORDER_LIGHT,
  };
}
