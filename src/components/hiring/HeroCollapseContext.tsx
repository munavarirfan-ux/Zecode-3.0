"use client";

import { createContext, useContext } from "react";

const HeroCollapseContext = createContext(false);

export function HeroCollapseProvider({
  collapsed,
  children,
}: {
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <HeroCollapseContext.Provider value={collapsed}>{children}</HeroCollapseContext.Provider>
  );
}

export function useHeroCollapseContext() {
  return useContext(HeroCollapseContext);
}
