"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { getChartTheme, type ChartThemeTokens } from "@/lib/chart-themes";
import { buildAccentPalette, getChartColorsFromPalette, type ChartAccentColors } from "@/lib/theme";

export type ChartColors = ChartAccentColors &
  ChartThemeTokens & {
    /** First categorical color — prefer accent in charts that support a single series color */
    series: string;
  };

export function useChartAccentColors(): ChartColors {
  const { primaryHex, theme } = useTheme();
  return useMemo(() => {
    const accent = getChartColorsFromPalette(buildAccentPalette(primaryHex, theme));
    const tokens = getChartTheme(theme);
    return {
      ...accent,
      ...tokens,
      series: accent.primary,
      palette: [accent.primary, accent.secondary, accent.deep, accent.muted, ...tokens.palette],
    };
  }, [primaryHex, theme]);
}
