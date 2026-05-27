"use client";

import { cn } from "@/lib/utils";
import {
  settingsAccentBg,
  settingsAccentBorder,
  settingsAccentBorderSoft,
} from "../settingsTokens";
import type { SettingsScope } from "../settingsTypes";

const SCOPE_STYLES: Record<SettingsScope, string> = {
  platform: cn(settingsAccentBorder, settingsAccentBg, "text-accent"),
  enterprise: cn(settingsAccentBorderSoft, settingsAccentBg, "text-accent"),
  personal:
    "border-[rgba(15,23,42,0.1)] bg-[rgba(15,23,42,0.04)] text-text-secondary/90 dark:border-white/[0.1] dark:bg-white/[0.04]",
};

const HERO_SCOPE_STYLES: Record<SettingsScope, string> = {
  platform: "border-white/25 bg-white/10 text-white",
  enterprise: "border-white/25 bg-white/10 text-white/90",
  personal: "border-white/20 bg-white/8 text-white/85",
};

export function SettingsScopePill({
  label,
  scope,
  variant = "default",
}: {
  label: string;
  scope: SettingsScope;
  variant?: "default" | "hero";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em]",
        variant === "hero" ? HERO_SCOPE_STYLES[scope] : SCOPE_STYLES[scope],
      )}
    >
      {label}
    </span>
  );
}
