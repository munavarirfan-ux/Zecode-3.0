"use client";

import { ThemeToggle } from "@/components/theme-toggle";

/** ZeMeet uses the same hub theme preference (light / dark / system). */
export function ZeMeetThemeToggle({ compact }: { compact?: boolean }) {
  if (compact) {
    return <ThemeToggle className="scale-90" />;
  }
  return <ThemeToggle />;
}
