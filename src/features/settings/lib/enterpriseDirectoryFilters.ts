import type { EnterpriseListItem } from "../components/enterprises/EnterpriseCard";

export type EnterpriseAccessTab = "all" | "active" | "disabled";

export type EnterpriseViewMode = "grid" | "list";

export type EnterpriseSortKey = "joined-desc" | "joined-asc" | "name" | "candidates-desc";

export type EnterpriseFilters = {
  search: string;
  plan: string;
  joinedFrom: string;
  joinedTo: string;
};

export const EMPTY_ENTERPRISE_FILTERS: EnterpriseFilters = {
  search: "",
  plan: "",
  joinedFrom: "",
  joinedTo: "",
};

export const ENTERPRISE_PLANS = ["Enterprise", "Growth", "Starter"] as const;

export const ENTERPRISE_ACCESS_TABS: { id: EnterpriseAccessTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "disabled", label: "Disabled" },
];

export const ENTERPRISE_SORT_OPTIONS: { value: EnterpriseSortKey; label: string }[] = [
  { value: "joined-desc", label: "Joined · newest" },
  { value: "joined-asc", label: "Joined · oldest" },
  { value: "name", label: "Name A–Z" },
  { value: "candidates-desc", label: "Most candidates" },
];

function parseJoined(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function matchesSearch(e: EnterpriseListItem, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  return (
    e.name.toLowerCase().includes(s) ||
    e.domain.toLowerCase().includes(s) ||
    e.location.toLowerCase().includes(s) ||
    e.plan.toLowerCase().includes(s)
  );
}

function matchesDateRange(e: EnterpriseListItem, from: string, to: string): boolean {
  const joined = parseJoined(e.joined);
  if (from) {
    const fromT = new Date(from).getTime();
    if (!Number.isNaN(fromT) && joined < fromT) return false;
  }
  if (to) {
    const toT = new Date(to).getTime();
    if (!Number.isNaN(toT) && joined > toT + 86400000 - 1) return false;
  }
  return true;
}

export function filterAndSortEnterprises(
  enterprises: EnterpriseListItem[],
  {
    filters,
    accessTab,
    isEnabled,
    sort,
  }: {
    filters: EnterpriseFilters;
    accessTab: EnterpriseAccessTab;
    isEnabled: (domain: string) => boolean;
    sort: EnterpriseSortKey;
  },
): EnterpriseListItem[] {
  let list = enterprises.filter((e) => {
    if (accessTab === "active" && !isEnabled(e.domain)) return false;
    if (accessTab === "disabled" && isEnabled(e.domain)) return false;
    if (filters.plan && e.plan !== filters.plan) return false;
    if (!matchesSearch(e, filters.search)) return false;
    if (!matchesDateRange(e, filters.joinedFrom, filters.joinedTo)) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "joined-asc":
        return parseJoined(a.joined) - parseJoined(b.joined);
      case "name":
        return a.name.localeCompare(b.name);
      case "candidates-desc":
        return b.candidates - a.candidates;
      case "joined-desc":
      default:
        return parseJoined(b.joined) - parseJoined(a.joined);
    }
  });

  return list;
}

export function countByAccessTab(
  enterprises: EnterpriseListItem[],
  filters: EnterpriseFilters,
  isEnabled: (domain: string) => boolean,
): Record<EnterpriseAccessTab, number> {
  const base = enterprises.filter((e) => {
    if (filters.plan && e.plan !== filters.plan) return false;
    if (!matchesSearch(e, filters.search)) return false;
    if (!matchesDateRange(e, filters.joinedFrom, filters.joinedTo)) return false;
    return true;
  });
  return {
    all: base.length,
    active: base.filter((e) => isEnabled(e.domain)).length,
    disabled: base.filter((e) => !isEnabled(e.domain)).length,
  };
}

export function countActiveFilters(filters: EnterpriseFilters): number {
  let n = 0;
  if (filters.search.trim()) n++;
  if (filters.plan) n++;
  if (filters.joinedFrom) n++;
  if (filters.joinedTo) n++;
  return n;
}
