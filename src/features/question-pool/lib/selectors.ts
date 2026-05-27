import type {
  PoolFilters,
  PoolSortDir,
  PoolSortKey,
  Question,
  QuestionType,
} from "../types";

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 } as const;

export function filterQuestions(questions: Question[], filters: PoolFilters, typeTab: QuestionType | "all"): Question[] {
  const q = filters.search.trim().toLowerCase();
  return questions.filter((item) => {
    if (typeTab !== "all" && item.type !== typeTab) return false;
    if (filters.status !== "all" && item.status !== filters.status) return false;
    if (filters.difficulty !== "all" && item.difficulty !== filters.difficulty) return false;
    if (filters.skill && item.skill !== filters.skill) return false;
    if (filters.curatorId && item.curator.id !== filters.curatorId) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.skill.toLowerCase().includes(q) ||
      item.curator.name.toLowerCase().includes(q)
    );
  });
}

export function sortQuestions(questions: Question[], key: PoolSortKey, dir: PoolSortDir): Question[] {
  const sorted = [...questions];
  const sign = dir === "asc" ? 1 : -1;
  sorted.sort((a, b) => {
    switch (key) {
      case "number":
        return (a.number - b.number) * sign;
      case "title":
        return a.title.localeCompare(b.title) * sign;
      case "difficulty":
        return (DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]) * sign;
      case "updated":
        return (new Date(a.meta.updatedAt).getTime() - new Date(b.meta.updatedAt).getTime()) * sign;
      default:
        return 0;
    }
  });
  return sorted;
}

export function getFilterOptions(questions: Question[]) {
  const skills = Array.from(new Set(questions.map((x) => x.skill))).sort();
  const curatorIds = Array.from(new Set(questions.map((x) => x.curator.id)));
  return { skills, curatorIds };
}

export function countPoolAdvancedFilters(filters: PoolFilters): number {
  let count = 0;
  if (filters.difficulty !== "all") count++;
  if (filters.skill) count++;
  if (filters.curatorId) count++;
  return count;
}

export function hasActiveFilters(filters: PoolFilters): boolean {
  return Boolean(filters.search.trim()) || filters.status !== "all" || countPoolAdvancedFilters(filters) > 0;
}
