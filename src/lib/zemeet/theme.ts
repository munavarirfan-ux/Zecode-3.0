export type ZeMeetTheme = "light" | "dark";

export const ZEMEET_THEME_STORAGE_KEY = "zemeet-theme-preference";

export function loadZeMeetTheme(): ZeMeetTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(ZEMEET_THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "dark";
}

export function saveZeMeetTheme(theme: ZeMeetTheme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ZEMEET_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}
