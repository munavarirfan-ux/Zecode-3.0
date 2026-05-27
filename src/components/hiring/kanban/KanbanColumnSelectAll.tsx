"use client";

import { cn } from "@/lib/utils";

/** Per-column select all / deselect all control */
export function KanbanColumnSelectAll({
  columnCandidateIds,
  selectedIds,
  onToggle,
  className,
}: {
  columnCandidateIds: string[];
  selectedIds: Set<string>;
  onToggle: (ids: string[]) => void;
  className?: string;
}) {
  const count = columnCandidateIds.length;
  if (count === 0) return null;

  const allSelected = columnCandidateIds.every((id) => selectedIds.has(id));
  const someSelected = columnCandidateIds.some((id) => selectedIds.has(id));

  return (
    <button
      type="button"
      className={cn(
        "shrink-0 text-[10px] font-medium transition-colors",
        someSelected
          ? "text-accent hover:text-[rgb(var(--accent-hover-rgb))]"
          : "text-muted hover:text-text",
        className,
      )}
      onClick={() => onToggle(columnCandidateIds)}
    >
      {allSelected ? "Deselect all" : "Select all"}
    </button>
  );
}
