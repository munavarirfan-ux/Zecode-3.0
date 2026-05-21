"use client";

import { createContext, useContext } from "react";

type HeroMetricsLinkValue = {
  /** Metrics row follows hero collapse when true */
  enabled: boolean;
  heroCollapsed: boolean;
  hydrated: boolean;
};

const HeroMetricsLinkContext = createContext<HeroMetricsLinkValue>({
  enabled: false,
  heroCollapsed: false,
  hydrated: false,
});

export function HeroMetricsLinkProvider({
  enabled,
  heroCollapsed,
  hydrated,
  children,
}: {
  enabled: boolean;
  heroCollapsed: boolean;
  hydrated: boolean;
  children: React.ReactNode;
}) {
  return (
    <HeroMetricsLinkContext.Provider value={{ enabled, heroCollapsed, hydrated }}>
      {children}
    </HeroMetricsLinkContext.Provider>
  );
}

export function useHeroMetricsLink() {
  return useContext(HeroMetricsLinkContext);
}
