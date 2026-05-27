"use client";

import { create } from "zustand";
import { createEmptyDraft } from "../editor/defaultDraft";
import type { QuestionDraft } from "../editor/draftTypes";
import type { QuestionSubtype, QuestionType } from "../types";

type DraftState = {
  draft: QuestionDraft | null;
  dirty: boolean;
  lastSavedAt: Date | null;
  currentStep: number;
  initDraft: (type: QuestionType, subtype?: QuestionSubtype) => void;
  patchDraft: (patch: Partial<QuestionDraft>) => void;
  setDirty: (dirty: boolean) => void;
  markSaved: () => void;
  setStep: (step: number) => void;
  reset: () => void;
};

export const useDraftStore = create<DraftState>((set) => ({
  draft: null,
  dirty: false,
  lastSavedAt: null,
  currentStep: 0,

  initDraft: (type, subtype) =>
    set({
      draft: createEmptyDraft(type, subtype),
      dirty: false,
      lastSavedAt: null,
      currentStep: 0,
    }),

  patchDraft: (patch) =>
    set((s) => {
      if (!s.draft) return s;
      return { draft: { ...s.draft, ...patch }, dirty: true };
    }),

  setDirty: (dirty) => set({ dirty }),
  markSaved: () => set({ dirty: false, lastSavedAt: new Date() }),
  setStep: (step) => set({ currentStep: step }),
  reset: () => set({ draft: null, dirty: false, lastSavedAt: null, currentStep: 0 }),
}));
