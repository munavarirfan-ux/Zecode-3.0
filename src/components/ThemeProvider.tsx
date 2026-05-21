"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextThemes } from "next-themes";
import {
  applyAccentPaletteToDocument,
  applyNavbarRgbToDocument,
  applyNavbarTextRgbToDocument,
  applyPrimaryToDocument,
  applyThemeClassToDocument,
  buildAccentPalette,
  chromeToneFromRgb,
  clearLegacyNavColorStorage,
  DEFAULT_PRIMARY_HEX,
  normalizeHex,
  PRIMARY_STORAGE_KEY,
  readStoredPrimary,
  resolvedNavbarRgb,
  type ThemeMode,
  type ThemePreference,
  type ChromeTone,
} from "@/lib/theme";
import { STORAGE_KEYS } from "@/constants/app";

type ThemeContextValue = {
  themePreference: ThemePreference;
  theme: ThemeMode;
  setTheme: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  primaryHex: string;
  setPrimaryHex: (hex: string) => void;
  navRgb: string;
  navTone: ChromeTone;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function persistPrimary(hex: string) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(PRIMARY_STORAGE_KEY, hex);
  } catch {
    /* quota / private mode */
  }
}

function ThemeProviderInner({ children }: { children: React.ReactNode }) {
  const { theme: nextPreference, setTheme: setNextTheme, resolvedTheme } = useNextThemes();
  const [primaryHex, setPrimaryHexState] = React.useState(DEFAULT_PRIMARY_HEX);
  const [mounted, setMounted] = React.useState(false);

  const resolvedMode: ThemeMode = resolvedTheme === "dark" ? "dark" : "light";
  const themePreference: ThemePreference =
    nextPreference === "light" || nextPreference === "dark" || nextPreference === "system"
      ? nextPreference
      : "system";

  const applyResolvedTheme = React.useCallback((mode: ThemeMode, accent: string) => {
    applyThemeClassToDocument(mode);
    applyPrimaryToDocument(accent, mode);
    applyNavbarRgbToDocument(resolvedNavbarRgb(mode));
    applyNavbarTextRgbToDocument(null);
  }, []);

  React.useLayoutEffect(() => {
    setMounted(true);
    clearLegacyNavColorStorage();
    const accent = readStoredPrimary();
    setPrimaryHexState(accent);
  }, []);

  React.useLayoutEffect(() => {
    if (!mounted || !resolvedTheme) return;
    applyResolvedTheme(resolvedMode, primaryHex);
  }, [mounted, resolvedTheme, resolvedMode, primaryHex, applyResolvedTheme]);

  React.useLayoutEffect(() => {
    if (!mounted) return;
    applyAccentPaletteToDocument(buildAccentPalette(primaryHex, resolvedMode));
  }, [primaryHex, resolvedMode, mounted]);

  const setTheme = React.useCallback(
    (preference: ThemePreference) => {
      setNextTheme(preference);
    },
    [setNextTheme],
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedMode === "dark" ? "light" : "dark");
  }, [resolvedMode, setTheme]);

  const setPrimaryHex = React.useCallback(
    (hex: string) => {
      const n = normalizeHex(hex);
      if (!n) return;
      setPrimaryHexState(n);
      persistPrimary(n);
      applyAccentPaletteToDocument(buildAccentPalette(n, resolvedMode));
    },
    [resolvedMode],
  );

  const navRgb = React.useMemo(() => resolvedNavbarRgb(resolvedMode), [resolvedMode]);
  const navTone = React.useMemo(() => chromeToneFromRgb(navRgb), [navRgb]);

  React.useLayoutEffect(() => {
    if (!mounted) return;
    applyNavbarRgbToDocument(navRgb);
  }, [navRgb, mounted]);

  const value = React.useMemo(
    () => ({
      themePreference,
      theme: resolvedMode,
      setTheme,
      toggleTheme,
      primaryHex,
      setPrimaryHex,
      navRgb,
      navTone,
    }),
    [themePreference, resolvedMode, setTheme, toggleTheme, primaryHex, setPrimaryHex, navRgb, navTone],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="min-h-screen min-w-0 w-full bg-app-bg font-sans text-text antialiased">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      storageKey={STORAGE_KEYS.theme}
      disableTransitionOnChange={false}
    >
      <ThemeProviderInner>{children}</ThemeProviderInner>
    </NextThemesProvider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
