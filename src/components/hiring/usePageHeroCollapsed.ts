"use client";

import { useCallback, useEffect, useState } from "react";

export const PAGE_HERO_COLLAPSED_PREFIX = "hero-collapsed-";

/** Page-type defaults — operational pages start collapsed; overview pages expanded */
const DEFAULT_COLLAPSED_PAGES = new Set([
  "job-detail",
  "candidates-directory",
  "interviews-directory",
  "assessment-detail",
  "live-assessment-monitor",
  "scheduled-assessment-detail",
  "interviewer-interviews",
  "assessments",
  "assessment-schedules",
  "my-schedule",
  "question-pool",
  "question-pool-editor",
]);

function storageKeyFor(pageKey: string) {
  return `${PAGE_HERO_COLLAPSED_PREFIX}${pageKey}`;
}

function readHeroCollapsed(pageKey: string, defaultCollapsed: boolean): boolean {
  if (typeof window === "undefined") {
    return defaultCollapsed;
  }
  try {
    const stored = localStorage.getItem(storageKeyFor(pageKey));
    if (stored !== null) return stored === "true";
    return DEFAULT_COLLAPSED_PAGES.has(pageKey) ? true : defaultCollapsed;
  } catch {
    return defaultCollapsed;
  }
}

export function usePageHeroCollapsed(
  pageKey: string,
  defaultCollapsed = DEFAULT_COLLAPSED_PAGES.has(pageKey),
) {
  const [collapsed, setCollapsed] = useState(() =>
    readHeroCollapsed(pageKey, defaultCollapsed),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const sync = () => setCollapsed(readHeroCollapsed(pageKey, defaultCollapsed));
    const eventName = `page-hero-sync:${pageKey}`;
    window.addEventListener("storage", sync);
    window.addEventListener(eventName, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(eventName, sync);
    };
  }, [pageKey, defaultCollapsed]);

  const setCollapsedPersisted = useCallback(
    (next: boolean) => {
      setCollapsed(next);
      try {
        localStorage.setItem(storageKeyFor(pageKey), String(next));
      } catch {
        /* ignore */
      }
      window.dispatchEvent(new Event(`page-hero-sync:${pageKey}`));
    },
    [pageKey],
  );

  const toggle = useCallback(() => {
    setCollapsedPersisted(!collapsed);
  }, [collapsed, setCollapsedPersisted]);

  return { collapsed, setCollapsed: setCollapsedPersisted, toggle, hydrated };
}
