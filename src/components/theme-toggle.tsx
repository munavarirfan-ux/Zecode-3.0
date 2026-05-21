"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import type { ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

type ThemeToggleProps = {
  /** Compact row for dropdown menus */
  variant?: "segmented" | "menu";
  className?: string;
};

export function ThemeToggle({ variant = "segmented", className }: ThemeToggleProps) {
  const { themePreference, setTheme } = useTheme();

  if (variant === "menu") {
    return (
      <div className={cn("flex flex-col gap-0.5 p-1", className)} role="group" aria-label="Appearance">
        <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-secondary">
          Appearance
        </p>
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] font-medium transition-colors",
              themePreference === value
                ? "bg-surface-2 text-text"
                : "text-fg-secondary hover:bg-surface-2/80 hover:text-text",
            )}
            aria-pressed={themePreference === value}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex rounded-[10px] border border-subtle bg-surface-1 p-0.5",
        className,
      )}
      role="group"
      aria-label="Appearance"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-[12px] font-medium transition-colors",
            themePreference === value
              ? "bg-surface text-text shadow-sm"
              : "text-fg-secondary hover:text-text",
          )}
          aria-pressed={themePreference === value}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
