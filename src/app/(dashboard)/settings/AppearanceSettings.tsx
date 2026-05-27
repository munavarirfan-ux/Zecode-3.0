"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { DEFAULT_PRIMARY_HEX, normalizeHex, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  settingsField,
  settingsPanel,
  settingsSectionDesc,
  settingsSectionTitle,
} from "@/features/settings/settingsTokens";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function AppearanceSettings() {
  const { themePreference, setTheme, primaryHex, setPrimaryHex } = useTheme();
  const [draftPrimary, setDraftPrimary] = useState(primaryHex);

  useEffect(() => {
    setDraftPrimary(primaryHex);
  }, [primaryHex]);

  const previewHex = normalizeHex(draftPrimary) ?? DEFAULT_PRIMARY_HEX;

  function commitPrimary(raw: string) {
    const n = normalizeHex(raw);
    if (!n) return;
    setDraftPrimary(n);
    setPrimaryHex(n);
  }

  return (
    <div className={cn(settingsPanel, "space-y-6 p-5")}>
      <section className="space-y-3">
        <h2 className={settingsSectionTitle}>Theme mode</h2>
        <p className={settingsSectionDesc}>Choose light, dark, or match your system preference.</p>
        <div
          className="inline-flex rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.02)] p-0.5 dark:border-white/[0.08] dark:bg-white/[0.03]"
          role="group"
          aria-label="Theme mode"
        >
          {THEME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={cn(
                "h-8 rounded-[8px] px-3.5 text-[13px] font-medium transition-colors duration-[180ms]",
                themePreference === value
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-secondary/85 hover:text-text",
              )}
              onClick={() => setTheme(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-[rgba(15,23,42,0.06)] pt-6 dark:border-white/[0.06]">
        <h2 className={settingsSectionTitle}>Primary accent</h2>
        <p className={settingsSectionDesc}>Updates buttons, links, and hero gradients across Ze[code].</p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="color"
            aria-label="Pick accent color"
            className="h-10 w-12 cursor-pointer rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-1 dark:bg-white/[0.04]"
            value={previewHex}
            onChange={(e) => commitPrimary(e.target.value)}
          />
          <input
            className={cn(settingsField, "w-[7.5rem] font-mono")}
            value={draftPrimary}
            onChange={(e) => setDraftPrimary(e.target.value)}
            onBlur={() => {
              const n = normalizeHex(draftPrimary);
              if (n) commitPrimary(n);
              else setDraftPrimary(primaryHex);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const n = normalizeHex(draftPrimary);
                if (n) commitPrimary(n);
              }
            }}
            spellCheck={false}
            placeholder="#7C3AED"
          />
          <AccentPreview hex={previewHex} />
        </div>
      </section>
    </div>
  );
}

function AccentPreview({ hex }: { hex: string }) {
  return (
    <div
      className="flex h-10 items-center gap-2 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-2.5 dark:bg-white/[0.04]"
      aria-hidden
    >
      <span className="h-5 w-5 shrink-0 rounded-md shadow-sm" style={{ backgroundColor: hex }} />
      <span className="h-5 w-8 shrink-0 rounded-md bg-accent shadow-sm" />
      <span className="h-5 w-5 shrink-0 rounded-full bg-accent/20 ring-1 ring-accent/30" />
    </div>
  );
}
