"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CreatedEnterprise = {
  domain: string;
  name: string;
  slug: string;
  plan: "Starter" | "Growth" | "Enterprise";
  seats: number;
  region: string;
  timezone: string;
  language: string;
  adminName: string;
  adminEmail: string;
  status: "Active" | "Trial";
  joinedAt: string;
  location: string;
};

type CreatedEnterprisesState = {
  created: CreatedEnterprise[];
  add: (enterprise: CreatedEnterprise) => void;
};

export const useCreatedEnterprisesStore = create<CreatedEnterprisesState>()(
  persist(
    (set) => ({
      created: [],
      add: (enterprise) =>
        set((s) => ({
          created: [enterprise, ...s.created],
        })),
    }),
    { name: "zecode-created-enterprises" },
  ),
);
