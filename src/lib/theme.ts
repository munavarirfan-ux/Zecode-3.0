import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "@/constants/app";

export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;
export const PRIMARY_STORAGE_KEY = STORAGE_KEYS.primary;
/** Legacy keys — cleared on load; nav colors are automatic */
export const NAVBAR_STORAGE_KEY = LEGACY_STORAGE_KEYS.navbar;
export const NAVBAR_TEXT_STORAGE_KEY = LEGACY_STORAGE_KEYS.navbarText;

function migrateStorageKey(current: string, ...legacyKeys: string[]): string | null {
  if (typeof window === "undefined") return null;
  let value = localStorage.getItem(current);
  if (!value) {
    for (const legacy of legacyKeys) {
      const legacyValue = localStorage.getItem(legacy);
      if (legacyValue) {
        value = legacyValue;
        break;
      }
    }
  }
  if (value && !localStorage.getItem(current)) {
    try {
      localStorage.setItem(current, value);
      for (const legacy of legacyKeys) localStorage.removeItem(legacy);
    } catch {
      /* ignore */
    }
  }
  return value;
}
export const DEFAULT_PRIMARY_HEX = "#FF6B2C";

export const DEFAULT_NAVBAR_LIGHT = "#0f172a";
export const DEFAULT_NAVBAR_DARK = "#020617";

/** User preference stored in localStorage */
export type ThemePreference = "light" | "dark" | "system";
/** Resolved appearance applied to the document */
export type ThemeMode = "light" | "dark";
export type ChromeTone = "light" | "dark";

export function hexToRgbSpace(hex: string): string | null {
  const raw = hex.trim().replace(/^#/, "");
  if (!raw) return null;
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function normalizeHex(hex: string): string | null {
  const rgb = hexToRgbSpace(hex);
  if (!rgb) return null;
  const raw = hex.trim().replace(/^#/, "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  return `#${full.toLowerCase()}`;
}

export function mixBlack(rgbSpace: string, amount: number): string {
  const [r, g, b] = rgbSpace.split(/\s+/).map(Number);
  const m = (c: number) => Math.round(c * (1 - amount));
  return `${m(r)} ${m(g)} ${m(b)}`;
}

export function mixWhite(rgbSpace: string, amount: number): string {
  const [r, g, b] = rgbSpace.split(/\s+/).map(Number);
  const m = (c: number) => Math.round(c + (255 - c) * amount);
  return `${m(r)} ${m(g)} ${m(b)}`;
}

/** WCAG relative luminance (0–1) for contrast decisions. */
export function relativeLuminance(rgbSpace: string): number {
  const channels = rgbSpace.split(/\s+/).map(Number);
  if (channels.length !== 3 || channels.some((n) => Number.isNaN(n))) return 0;
  const linear = channels.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
}

export type AccentToneScale = {
  tone50: string;
  tone100: string;
  tone200: string;
  tone500: string;
  tone700: string;
  tone900: string;
};

/** Normalize accent for readable buttons and labels in the current color scheme. */
export function resolveAccentPrimary(accentRgb: string, mode: ThemeMode = "light"): string {
  const lum = relativeLuminance(accentRgb);
  if (mode === "dark") {
    if (lum < 0.32) return mixWhite(accentRgb, 0.28);
    if (lum > 0.72) return mixBlack(accentRgb, 0.16);
    return accentRgb;
  }
  if (lum > 0.55) return mixBlack(accentRgb, 0.32);
  return accentRgb;
}

/** Tonal ramp (50–900) — never use raw accent everywhere. */
export function buildAccentToneScale(primaryRgb: string): AccentToneScale {
  return {
    tone50: mixWhite(primaryRgb, 0.92),
    tone100: mixWhite(primaryRgb, 0.84),
    tone200: mixWhite(primaryRgb, 0.68),
    tone500: primaryRgb,
    tone700: mixBlack(primaryRgb, 0.28),
    tone900: mixBlack(primaryRgb, 0.72),
  };
}

export type AccentPalette = AccentToneScale & {
  accentRgb: string;
  accentHoverRgb: string;
  accentRingRgb: string;
  accentDeepRgb: string;
  accentSoftRgb: string;
  forestRgb: string;
  heroFromRgb: string;
  heroViaRgb: string;
  heroToRgb: string;
  heroBorderRgb: string;
  heroShadowRgb: string;
  heroGlowRgb: string;
  heroFgRgb: string;
  heroUsesLightText: boolean;
};

export type ChartAccentColors = {
  primary: string;
  secondary: string;
  deep: string;
  muted: string;
};

/** Monochromatic ramp from the user accent — hero gradient, deep tones, soft fills. */
export function buildAccentPalette(hex: string, mode: ThemeMode = "light"): AccentPalette {
  const normalized = normalizeHex(hex) ?? DEFAULT_PRIMARY_HEX;
  const rawAccentRgb = hexToRgbSpace(normalized)!;
  const primaryRgb = resolveAccentPrimary(rawAccentRgb, mode);
  const tone = buildAccentToneScale(primaryRgb);

  const heroFromRgb = tone.tone900;
  const heroViaRgb = tone.tone700;
  const heroToRgb = mixBlack(tone.tone500, 0.12);
  const heroBorderRgb = mixBlack(tone.tone700, 0.35);
  const heroShadowRgb = mixBlack(tone.tone900, 0.25);
  const heroGlowRgb = tone.tone200;

  const avgHeroLum =
    (relativeLuminance(heroFromRgb) + relativeLuminance(heroViaRgb) + relativeLuminance(heroToRgb)) / 3;
  const heroUsesLightText = avgHeroLum < 0.42;
  const heroFgRgb = heroUsesLightText ? "255 255 255" : "24 24 27";

  return {
    ...tone,
    accentRgb: tone.tone500,
    accentHoverRgb: tone.tone700,
    accentRingRgb: tone.tone500,
    accentDeepRgb: tone.tone900,
    accentSoftRgb: tone.tone50,
    forestRgb: mode === "dark" ? tone.tone200 : tone.tone700,
    heroFromRgb,
    heroViaRgb,
    heroToRgb,
    heroBorderRgb,
    heroShadowRgb,
    heroGlowRgb,
    heroFgRgb,
    heroUsesLightText,
  };
}

export function applyAccentPaletteToDocument(palette: AccentPalette): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const set = (key: string, value: string) => root.style.setProperty(key, value);

  set("--accent-50-rgb", palette.tone50);
  set("--accent-100-rgb", palette.tone100);
  set("--accent-200-rgb", palette.tone200);
  set("--accent-500-rgb", palette.tone500);
  set("--accent-700-rgb", palette.tone700);
  set("--accent-900-rgb", palette.tone900);

  set("--accent-rgb", palette.accentRgb);
  set("--accent-hover-rgb", palette.accentHoverRgb);
  set("--accent-ring-rgb", palette.accentRingRgb);
  set("--accent-deep-rgb", palette.accentDeepRgb);
  set("--accent-soft-rgb", palette.accentSoftRgb);
  set("--forest-rgb", palette.forestRgb);
  set("--hero-gradient-from-rgb", palette.heroFromRgb);
  set("--hero-gradient-via-rgb", palette.heroViaRgb);
  set("--hero-gradient-to-rgb", palette.heroToRgb);
  set("--hero-border-rgb", palette.heroBorderRgb);
  set("--hero-shadow-rgb", palette.heroShadowRgb);
  set("--hero-glow-rgb", palette.heroGlowRgb);
  set("--hero-fg-rgb", palette.heroFgRgb);

  set("--ig-900-rgb", palette.tone900);
  set("--ig-800-rgb", mixBlack(palette.tone500, 0.22));
  set("--ig-700-rgb", palette.tone700);
  set("--ig-600-rgb", palette.tone500);
  set("--secondary-fill-rgb", palette.tone100);
}

/** Default palette for SSR / first paint (matches DEFAULT_PRIMARY_HEX). */
export const DEFAULT_ACCENT_PALETTE = buildAccentPalette(DEFAULT_PRIMARY_HEX);

/** `rgbSpace` = "R G B" → `#rrggbb` for Recharts and canvas APIs. */
export function rgbSpaceToHex(rgbSpace: string): string {
  const parts = rgbSpace
    .trim()
    .split(/\s+/)
    .map((n) => Math.max(0, Math.min(255, Math.round(Number(n)))));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return "#000000";
  return `#${parts.map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

export function getChartColorsFromPalette(palette: AccentPalette): ChartAccentColors {
  return {
    primary: rgbSpaceToHex(palette.tone500),
    secondary: rgbSpaceToHex(palette.tone200),
    deep: rgbSpaceToHex(palette.tone700),
    muted: rgbSpaceToHex(palette.tone100),
  };
}

/** `rgbSpace` = "R G B" → `rgb(R, G, B)` for inline styles */
export function rgbSpaceToCssRgb(rgbSpace: string): string {
  const parts = rgbSpace.trim().split(/\s+/).map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return "rgb(15, 23, 42)";
  return `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`;
}

export function applyPrimaryToDocument(hex: string, mode: ThemeMode = "light"): void {
  const normalized = normalizeHex(hex);
  if (!normalized) return;
  applyAccentPaletteToDocument(buildAccentPalette(normalized, mode));
}

export function applyNavbarRgbToDocument(rgbSpace: string): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--nav-bg-rgb", rgbSpace);
}

/** Optional sidebar label/link color; `null` clears the override (theme defaults). */
export function applyNavbarTextRgbToDocument(rgbSpace: string | null): void {
  if (typeof document === "undefined") return;
  if (!rgbSpace) document.documentElement.style.removeProperty("--nav-text-rgb");
  else document.documentElement.style.setProperty("--nav-text-rgb", rgbSpace);
}

/** Sync `data-theme`, Tailwind `dark` class, and color-scheme on `<html>`. */
export function applyThemeClassToDocument(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", mode);
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
}

export function readStoredPrimary(): string {
  if (typeof window === "undefined") return DEFAULT_PRIMARY_HEX;
  const s = migrateStorageKey(PRIMARY_STORAGE_KEY, LEGACY_STORAGE_KEYS.primary, "kerohire.primary");
  if (!s) return DEFAULT_PRIMARY_HEX;
  return normalizeHex(s) ?? DEFAULT_PRIMARY_HEX;
}

export function readStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = migrateStorageKey(
    THEME_STORAGE_KEY,
    LEGACY_STORAGE_KEYS.theme,
    LEGACY_STORAGE_KEYS.themeKerohire,
  );
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveThemeMode(preference: ThemePreference): ThemeMode {
  if (preference === "system") return systemPrefersDark() ? "dark" : "light";
  return preference;
}

/** @deprecated Use readStoredThemePreference + resolveThemeMode */
export function readStoredTheme(): ThemeMode {
  return resolveThemeMode(readStoredThemePreference());
}

export function persistThemePreference(preference: ThemePreference): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* quota / private mode */
  }
}

/** Drop legacy manual nav color overrides — nav is derived from theme only. */
export function clearLegacyNavColorStorage(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(NAVBAR_STORAGE_KEY);
    localStorage.removeItem(NAVBAR_TEXT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function defaultNavbarHex(theme: ThemeMode): string {
  return theme === "dark" ? DEFAULT_NAVBAR_DARK : DEFAULT_NAVBAR_LIGHT;
}

export function readStoredNavbarHex(): string | null {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem(NAVBAR_STORAGE_KEY);
  if (!s) return null;
  return normalizeHex(s);
}

export function readStoredNavbarTextHex(): string | null {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem(NAVBAR_TEXT_STORAGE_KEY);
  if (!s) return null;
  return normalizeHex(s);
}

/** Default sidebar text for the current background contrast (matches built-in zinc/slate). */
export function defaultNavbarTextHex(tone: ChromeTone): string {
  return tone === "dark" ? "#e4e4e7" : "#0f172a";
}

export function resolvedNavbarRgb(theme: ThemeMode): string {
  return hexToRgbSpace(defaultNavbarHex(theme)) ?? "15 23 42";
}

/** Whether UI on this background should use dark text / light chrome. */
export function chromeToneFromRgb(rgbSpace: string): ChromeTone {
  const [r, g, b] = rgbSpace.split(/\s+/).map(Number);
  if ([r, g, b].some((n) => Number.isNaN(n))) return "dark";
  const y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return y > 0.58 ? "light" : "dark";
}
