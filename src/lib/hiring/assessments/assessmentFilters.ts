import type { AssessmentRecord, AssessmentTab } from "./types";

export type AssessmentsViewMode = "grid" | "list";

export type AssessmentsFilterState = {
  date: string;
  role: string;
  status: string;
  createdBy: string;
};

export const EMPTY_ASSESSMENTS_FILTERS: AssessmentsFilterState = {
  date: "",
  role: "",
  status: "",
  createdBy: "",
};

export const GRID_PAGE_SIZE = 20;
export const LIST_PAGE_SIZE = 50;

export function filterByTab(items: AssessmentRecord[], tab: AssessmentTab): AssessmentRecord[] {
  if (tab === "active") {
    return items.filter((a) => a.status === "Ongoing");
  }
  if (tab === "drafts") {
    return items.filter((a) => a.status === "Draft");
  }
  return items.filter((a) => a.status === "Completed");
}

export function applyAssessmentFilters(
  items: AssessmentRecord[],
  filters: AssessmentsFilterState,
): AssessmentRecord[] {
  return items.filter((a) => {
    if (filters.role && !a.role.toLowerCase().includes(filters.role.toLowerCase())) return false;
    if (filters.createdBy && !a.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())) {
      return false;
    }
    if (filters.status && a.status !== filters.status) return false;
    if (filters.date && !a.createdOn.toLowerCase().includes(filters.date.toLowerCase())) return false;
    return true;
  });
}

export function countByTab(items: AssessmentRecord[]): Record<AssessmentTab, number> {
  return {
    active: filterByTab(items, "active").length,
    drafts: filterByTab(items, "drafts").length,
    completed: filterByTab(items, "completed").length,
  };
}

export function uniqueRoles(items: AssessmentRecord[]): string[] {
  return Array.from(new Set(items.map((a) => a.role))).sort();
}

export function uniqueCreators(items: AssessmentRecord[]): string[] {
  return Array.from(new Set(items.map((a) => a.createdBy))).sort();
}

export function uniqueDates(items: AssessmentRecord[]): string[] {
  return Array.from(new Set(items.map((a) => a.createdOn))).sort((a, b) => b.localeCompare(a));
}

export function countActiveAssessmentFilters(filters: AssessmentsFilterState): number {
  return Object.values(filters).filter(Boolean).length;
}

export type AssessmentsSortKey = "updated" | "newest" | "invited" | "qualified";

export function sortAssessmentsList(
  list: AssessmentRecord[],
  sort: AssessmentsSortKey,
): AssessmentRecord[] {
  const sorted = [...list];
  sorted.sort((a, b) => {
    if (sort === "invited") return b.invited - a.invited;
    if (sort === "qualified") return b.qualified - a.qualified;
    if (sort === "newest") return b.id.localeCompare(a.id);
    return b.createdOn.localeCompare(a.createdOn);
  });
  return sorted;
}
