"use client";

import { kanbanColumnHeader } from "../hiringTokens";
import { KanbanColumnSelectAll } from "./KanbanColumnSelectAll";

export function KanbanColumnHeader({
  title,
  count,
  bulkEnabled,
  columnCandidateIds,
  selectedIds,
  onToggleSelectAllInColumn,
}: {
  title: string;
  count: number;
  bulkEnabled?: boolean;
  columnCandidateIds: string[];
  selectedIds: Set<string>;
  onToggleSelectAllInColumn: (ids: string[]) => void;
}) {
  return (
    <div className={kanbanColumnHeader}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71717A] dark:text-muted">
          {title}
        </p>
        {bulkEnabled ? (
          <KanbanColumnSelectAll
            columnCandidateIds={columnCandidateIds}
            selectedIds={selectedIds}
            onToggle={onToggleSelectAllInColumn}
          />
        ) : null}
      </div>
      <p className="text-[11px] tabular-nums text-[#52525B] dark:text-text-secondary">{count}</p>
    </div>
  );
}
