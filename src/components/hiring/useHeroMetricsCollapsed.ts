"use client";

import { useCallback, useEffect, useState } from "react";

/** Shared preference for collapsible KPI rows on hiring heroes (not the main dashboard). */
export const HIRING_HERO_METRICS_COLLAPSED_KEY = "hiringHeroMetricsCollapsed";

/** @deprecated Use HIRING_HERO_METRICS_COLLAPSED_KEY — still read for migration */
export const JOB_HERO_METRICS_COLLAPSED_KEY = "jobHeroMetricsCollapsed";

function readCollapsedPreference(storageKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) return stored === "true";
    if (storageKey === HIRING_HERO_METRICS_COLLAPSED_KEY) {
      const legacy = localStorage.getItem(JOB_HERO_METRICS_COLLAPSED_KEY);
      if (legacy !== null) return legacy === "true";
    }
    return false;
  } catch {
    return false;
  }
}

export function useHeroMetricsCollapsed(
  storageKey: string = HIRING_HERO_METRICS_COLLAPSED_KEY,
) {
  const [collapsed, setCollapsed] = useState(() => readCollapsedPreference(storageKey));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const sync = () => setCollapsed(readCollapsedPreference(storageKey));
    const eventName = `hero-metrics-sync:${storageKey}`;
    window.addEventListener("storage", sync);
    window.addEventListener(eventName, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(eventName, sync);
    };
  }, [storageKey]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storageKey, String(next));
        if (storageKey === HIRING_HERO_METRICS_COLLAPSED_KEY) {
          localStorage.setItem(JOB_HERO_METRICS_COLLAPSED_KEY, String(next));
        }
      } catch {
        /* ignore */
      }
      window.dispatchEvent(new Event(`hero-metrics-sync:${storageKey}`));
      return next;
    });
  }, [storageKey]);

  return { collapsed, toggle, hydrated };
}

/** @deprecated Use useHeroMetricsCollapsed */
export function useJobHeroMetricsCollapsed() {
  return useHeroMetricsCollapsed(HIRING_HERO_METRICS_COLLAPSED_KEY);
}
