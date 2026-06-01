import type { PreviewRole } from "@/config/previewRole";
import { applicantsStatsColumnId, normalizeSource } from "./stages";
import type { HiringCandidate, KanbanViewMode } from "./types";
import type { EngagementRecord } from "./types";
import { candidateVisibleInViewMode } from "./ownership";
import { enrichCandidateOwnership } from "./candidateOwnership";
import { getContactStatus, loadContactedCandidateIds } from "./candidateContactStatus";

export type KanbanSortKey =
  | "newest"
  | "oldest"
  | "mostEngaged"
  | "recentlyActive"
  | "nameAsc";

export type KanbanEngagementFilter = "" | "onlyMe" | "multiple" | "none";

export type KanbanStageAgeFilter = "" | "lt3" | "3to7" | "gt7" | "gt14";

export type KanbanContactFilter = "" | "needs_contact" | "engaged";

export type KanbanOwnershipFilters = {
  sources: string[];
  engagement: KanbanEngagementFilter;
  stageAge: KanbanStageAgeFilter;
  sort: KanbanSortKey;
  search: string;
  contactFilter: KanbanContactFilter;
};

export const EMPTY_KANBAN_OWNERSHIP_FILTERS: KanbanOwnershipFilters = {
  sources: [],
  engagement: "",
  stageAge: "",
  sort: "newest",
  search: "",
  contactFilter: "",
};

const KANBAN_VIEW_MODE_KEY = "kanban-view-mode";

export function loadKanbanViewMode(fallback: KanbanViewMode): KanbanViewMode {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(KANBAN_VIEW_MODE_KEY);
    if (raw === "all" || raw === "mine" || raw === "team") return raw;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function saveKanbanViewMode(mode: KanbanViewMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KANBAN_VIEW_MODE_KEY, mode);
  } catch {
    /* ignore */
  }
}

function daysInStage(appliedAt: string): number {
  const applied = new Date(appliedAt);
  const now = new Date("2026-05-15");
  return Math.floor((now.getTime() - applied.getTime()) / (86400000));
}

function matchesStageAge(appliedAt: string, filter: KanbanStageAgeFilter): boolean {
  if (!filter) return true;
  const days = daysInStage(appliedAt);
  switch (filter) {
    case "lt3":
      return days < 3;
    case "3to7":
      return days >= 3 && days <= 7;
    case "gt7":
      return days > 7;
    case "gt14":
      return days > 14;
    default:
      return true;
  }
}

function matchesEngagement(
  engagedBy: EngagementRecord[] | undefined,
  filter: KanbanEngagementFilter,
  currentUserId: string,
): boolean {
  if (!filter) return true;
  const list = engagedBy ?? [];
  if (filter === "none") return list.length === 0;
  if (filter === "onlyMe") {
    return list.length === 1 && list[0]?.recruiterId === currentUserId;
  }
  if (filter === "multiple") return list.length > 1;
  return true;
}

/** Shared Applicants column — engage, collision, and transfer requests */
export function isCandidateInApplicantsOwnershipScope(candidate: HiringCandidate): boolean {
  return applicantsStatsColumnId(enrichCandidateOwnership(candidate)) === "applied";
}

/** @deprecated use isCandidateInApplicantsOwnershipScope */
export const isCandidateInShortlistedOwnershipScope = isCandidateInApplicantsOwnershipScope;

/**
 * Applicants stats kanban — Applicants column is the shared pool (always visible).
 * Shortlisted is per-recruiter; view mode filters only that column.
 */
export function filterApplicantsStatsKanban(
  candidates: HiringCandidate[],
  viewMode: KanbanViewMode,
  currentUserId: string,
  filters: KanbanOwnershipFilters,
): HiringCandidate[] {
  let list = candidates.map(enrichCandidateOwnership);

  list = list.filter((c) => {
    if (isCandidateInApplicantsOwnershipScope(c)) return true;
    return candidateVisibleInViewMode(c, viewMode, currentUserId);
  });

  return applyKanbanFilters(list, filters, currentUserId);
}

export function filterKanbanCandidates(
  candidates: HiringCandidate[],
  viewMode: KanbanViewMode,
  currentUserId: string,
  filters: KanbanOwnershipFilters,
  _role: PreviewRole,
): HiringCandidate[] {
  let list = candidates.map(enrichCandidateOwnership);

  list = list.filter((c) => candidateVisibleInViewMode(c, viewMode, currentUserId));

  return applyKanbanFilters(list, filters, currentUserId);
}

function applyKanbanFilters(
  list: HiringCandidate[],
  filters: KanbanOwnershipFilters,
  currentUserId: string,
): HiringCandidate[] {
  let result = [...list];

  if (filters.sources.length > 0) {
    const set = new Set(filters.sources);
    result = result.filter((c) => set.has(normalizeSource(c.source as string)));
  }

  result = result.filter((c) =>
    matchesEngagement(c.engagedBy, filters.engagement, currentUserId),
  );

  result = result.filter((c) => matchesStageAge(c.appliedAt, filters.stageAge));

  if (filters.contactFilter) {
    const contacted = loadContactedCandidateIds();
    result = result.filter((c) => getContactStatus(c, contacted) === filters.contactFilter);
  }

  const q = filters.search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.ownerName ?? "").toLowerCase().includes(q),
    );
  }

  result.sort((a, b) => sortKanbanPair(a, b, filters.sort));
  return result;
}

function sortKanbanPair(a: HiringCandidate, b: HiringCandidate, sort: KanbanSortKey): number {
  switch (sort) {
    case "oldest":
      return a.appliedAt.localeCompare(b.appliedAt);
    case "mostEngaged":
      return (b.engagedBy?.length ?? 0) - (a.engagedBy?.length ?? 0);
    case "recentlyActive": {
      const la = a.engagedBy?.[a.engagedBy.length - 1]?.lastEngagedAt ?? a.appliedAt;
      const lb = b.engagedBy?.[b.engagedBy.length - 1]?.lastEngagedAt ?? b.appliedAt;
      return lb.localeCompare(la);
    }
    case "nameAsc":
      return a.name.localeCompare(b.name);
    case "newest":
    default:
      return b.appliedAt.localeCompare(a.appliedAt);
  }
}
