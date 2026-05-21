/** Resolved appearance for ZeMeet UI (hub `ze-theme` is source of truth). */
export type ZeMeetTheme = "light" | "dark";

/** @deprecated ZeMeet follows hub `ze-theme`; kept for migration reads only */
export const ZEMEET_THEME_STORAGE_KEY = "zemeet-theme-preference";

export function loadZeMeetTheme(): ZeMeetTheme {
  if (typeof window === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  if (document.documentElement.classList.contains("dark")) return "dark";
  try {
    const stored = localStorage.getItem(ZEMEET_THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "dark";
}
