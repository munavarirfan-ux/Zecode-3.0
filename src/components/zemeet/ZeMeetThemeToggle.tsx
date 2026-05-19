"use client";

import { Moon, Sun } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import type { ZeMeetTheme } from "@/lib/zemeet/theme";

export function ZeMeetThemeToggle({ compact }: { compact?: boolean }) {
  const { theme, setTheme } = useZeMeet();
  const t = useZeMeetTokens();

  return (
    <div className={t.themeToggle} role="group" aria-label="Appearance">
      {(["light", "dark"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => setTheme(mode)}
          className={t.themeToggleBtn(theme === mode)}
          aria-pressed={theme === mode}
        >
          {compact ? (
            mode === "light" ? (
              <Sun className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            ) : (
              <Moon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            )
          ) : (
            <span className="inline-flex items-center gap-1 capitalize">
              {mode === "light" ? (
                <Sun className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              ) : (
                <Moon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              )}
              {mode}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
