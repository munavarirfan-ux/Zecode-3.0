"use client";

import { create } from "zustand";
import type { QuestionDraft } from "../editor/draftTypes";
import { CURATORS, MOCK_QUESTIONS } from "../mockData";
import { filterQuestions, sortQuestions } from "../lib/selectors";
import type {
  PoolFilters,
  PoolSortDir,
  PoolSortKey,
  Question,
  QuestionStatus,
  QuestionType,
} from "../types";
import { POOL_PAGE_SIZE as PAGE_SIZE } from "../types";

const EMPTY_FILTERS: PoolFilters = {
  search: "",
  status: "all",
  difficulty: "all",
  skill: "",
  curatorId: "",
};

type PoolState = {
  questions: Question[];
  activeTypeTab: QuestionType | "all";
  filters: PoolFilters;
  selectedIds: string[];
  sortKey: PoolSortKey;
  sortDir: PoolSortDir;
  page: number;
  drawerQuestionId: string | null;
  createModalOpen: boolean;
  setActiveTypeTab: (tab: QuestionType | "all") => void;
  setFilters: (patch: Partial<PoolFilters>) => void;
  clearFilters: () => void;
  setSearch: (search: string) => void;
  toggleSelected: (id: string) => void;
  setSelectedAll: (ids: string[], selected: boolean) => void;
  clearSelection: () => void;
  setPage: (page: number) => void;
  setSort: (key: PoolSortKey) => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  setCreateModalOpen: (open: boolean) => void;
  bulkSetStatus: (status: QuestionStatus) => void;
  bulkDelete: () => void;
  addQuestion: (draft: QuestionDraft, status: QuestionStatus) => void;
  getFilteredQuestions: () => Question[];
  getPaginatedQuestions: () => { rows: Question[]; total: number; totalPages: number };
};

export const usePoolStore = create<PoolState>((set, get) => ({
  questions: MOCK_QUESTIONS,
  activeTypeTab: "all",
  filters: EMPTY_FILTERS,
  selectedIds: [],
  sortKey: "number",
  sortDir: "asc",
  page: 1,
  drawerQuestionId: null,
  createModalOpen: false,

  setActiveTypeTab: (tab) =>
    set((s) => {
      if (s.activeTypeTab === tab) return s;
      return { activeTypeTab: tab, page: 1, selectedIds: [] };
    }),
  setFilters: (patch) =>
    set((s) => {
      const next = { ...s.filters, ...patch };
      const unchanged = (Object.keys(patch) as (keyof PoolFilters)[]).every(
        (key) => s.filters[key] === next[key],
      );
      if (unchanged) return s;
      return { filters: next, page: 1 };
    }),
  clearFilters: () =>
    set((s) => {
      const unchanged =
        s.filters.search === "" &&
        s.filters.status === "all" &&
        s.filters.difficulty === "all" &&
        !s.filters.skill &&
        !s.filters.curatorId;
      if (unchanged) return s;
      return { filters: EMPTY_FILTERS, page: 1 };
    }),
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search }, page: 1 })),
  toggleSelected: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  setSelectedAll: (ids, selected) =>
    set((s) => {
      if (!selected) return { selectedIds: s.selectedIds.filter((x) => !ids.includes(x)) };
      const merged = new Set(s.selectedIds.concat(ids));
      return { selectedIds: Array.from(merged) };
    }),
  clearSelection: () => set({ selectedIds: [] }),
  setPage: (page) => set((s) => (s.page === page ? s : { page })),
  setSort: (key) =>
    set((s) => ({
      sortKey: key,
      sortDir: s.sortKey === key && s.sortDir === "asc" ? "desc" : "asc",
    })),
  openDrawer: (id) =>
    set((s) => (s.drawerQuestionId === id ? s : { drawerQuestionId: id })),
  closeDrawer: () =>
    set((s) => (s.drawerQuestionId === null ? s : { drawerQuestionId: null })),
  setCreateModalOpen: (open) =>
    set((s) => (s.createModalOpen === open ? s : { createModalOpen: open })),

  bulkSetStatus: (status) =>
    set((s) => ({
      questions: s.questions.map((q) =>
        s.selectedIds.includes(q.id) ? { ...q, status } : q,
      ),
      selectedIds: [],
    })),

  bulkDelete: () =>
    set((s) => ({
      questions: s.questions.filter((q) => !s.selectedIds.includes(q.id)),
      selectedIds: [],
    })),

  addQuestion: (draft, status) =>
    set((s) => {
      const maxNum = s.questions.reduce((m, q) => Math.max(m, q.number), 0);
      const now = new Date().toISOString();
      const question: Question = {
        id: `qp-${Date.now()}`,
        number: maxNum + 1,
        title: draft.title.trim(),
        bodyMarkdown: draft.bodyMarkdown.trim() || draft.passage || draft.fillBlankTemplate,
        type: draft.type,
        subtype: draft.subtype,
        difficulty: draft.difficulty,
        status,
        skill: draft.skill.trim(),
        tags: draft.tags,
        curator: CURATORS[0],
        meta: {
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
          usedInAssessments: [],
        },
        mcqOptions: draft.type === "mcq" ? draft.mcqOptions : undefined,
        testCases:
          draft.type === "coding" || draft.type === "debug" ? draft.testCases : undefined,
        schemaId:
          draft.type === "database" && draft.schemaId ? draft.schemaId : undefined,
      };
      return { questions: [question, ...s.questions], page: 1 };
    }),

  getFilteredQuestions: () => {
    const { questions, filters, activeTypeTab, sortKey, sortDir } = get();
    const filtered = filterQuestions(questions, filters, activeTypeTab);
    return sortQuestions(filtered, sortKey, sortDir);
  },

  getPaginatedQuestions: () => {
    const rows = get().getFilteredQuestions();
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(get().page, totalPages);
    const start = (page - 1) * PAGE_SIZE;
    return { rows: rows.slice(start, start + PAGE_SIZE), total, totalPages };
  },
}));
