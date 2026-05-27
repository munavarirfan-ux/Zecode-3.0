"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zeMock } from "@/features/demo/data/ze.mock";

function initialEnabledMap(): Record<string, boolean> {
  return Object.fromEntries(
    zeMock.enterprises.list.map((e) => [e.domain, e.status === "Active" || e.status === "Trial"]),
  );
}

type EnterpriseEnabledState = {
  enabledByDomain: Record<string, boolean>;
  setEnabled: (domain: string, enabled: boolean) => void;
  toggleEnabled: (domain: string) => void;
  isEnabled: (domain: string) => boolean;
};

export const useEnterpriseEnabledStore = create<EnterpriseEnabledState>()(
  persist(
    (set, get) => ({
      enabledByDomain: initialEnabledMap(),
      setEnabled: (domain, enabled) =>
        set((s) => ({
          enabledByDomain: { ...s.enabledByDomain, [domain]: enabled },
        })),
      toggleEnabled: (domain) => {
        const next = !get().isEnabled(domain);
        get().setEnabled(domain, next);
        return next;
      },
      isEnabled: (domain) => get().enabledByDomain[domain] ?? true,
    }),
    {
      name: "zecode-enterprise-enabled",
      partialize: (s) => ({ enabledByDomain: s.enabledByDomain }),
    },
  ),
);
