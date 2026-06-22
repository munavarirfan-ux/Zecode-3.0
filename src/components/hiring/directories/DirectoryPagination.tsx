"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { hiringTransition } from "../hiringTokens";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export type PaginationControlsProps = {
  totalItems: number;
  page: number;
  pageSize: number;
  entityLabel: string;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
};

export function PaginationControls({
  totalItems,
  page,
  pageSize,
  entityLabel,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = editing ? draft : String(safePage);

  const commitDraft = useCallback(() => {
    const parsed = parseInt(draft, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      onPageChange(1);
    } else if (parsed > totalPages) {
      onPageChange(totalPages);
    } else {
      onPageChange(parsed);
    }
    setEditing(false);
  }, [draft, totalPages, onPageChange]);

  const handleFocus = () => {
    setDraft(String(safePage));
    setEditing(true);
  };

  const handleBlur = () => {
    commitDraft();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitDraft();
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(15,23,42,0.06)] px-3 py-2.5",
        "bg-[rgba(248,250,252,0.5)] dark:border-white/[0.06] dark:bg-white/[0.02]",
        className,
      )}
    >
      {/* Left: page-size selector + range */}
      <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-medium text-text-secondary/70">
        <div className="flex items-center gap-1.5">
          <span className="whitespace-nowrap">Items per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger
              className="h-7 w-[4.25rem] min-w-0 gap-1 rounded-[8px] border-[rgba(15,23,42,0.08)] bg-white px-2 text-[11px] font-semibold tabular-nums text-text shadow-none focus:ring-2 focus:ring-accent/20 dark:bg-surface"
              aria-label="Items per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              side="top"
              align="start"
              className="min-w-[5rem]"
            >
              {pageSizeOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={String(opt)}
                  className="text-[12px] tabular-nums"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-text-secondary/30 select-none">·</span>

        <p className="whitespace-nowrap">
          <span className="tabular-nums text-text">{start}</span>
          {"–"}
          <span className="tabular-nums text-text">{end}</span>
          {" of "}
          <span className="tabular-nums font-semibold text-text">{totalItems}</span>{" "}
          {entityLabel}
        </p>
      </div>

      {/* Right: prev / page input / next */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className={cn(
            "h-8 gap-1 rounded-[9px] px-2.5 text-[11px] font-medium",
            hiringTransition,
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Previous
        </Button>

        <span className="flex items-center gap-1 px-2 text-[11px] font-medium tabular-nums text-text-secondary/80">
          Page
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={(e) => {
              setDraft(e.target.value.replace(/[^0-9]/g, ""));
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "h-7 w-8 rounded-[7px] border border-[rgba(15,23,42,0.08)] bg-white text-center text-[11px] font-semibold tabular-nums text-text outline-none",
              "focus:border-accent/30 focus:ring-2 focus:ring-accent/20",
              "dark:border-white/[0.1] dark:bg-surface",
              hiringTransition,
            )}
            aria-label="Page number"
          />
          <span className="text-text-secondary/50">/</span>
          <span className="text-text">{totalPages}</span>
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className={cn(
            "h-8 gap-1 rounded-[9px] px-2.5 text-[11px] font-medium",
            hiringTransition,
          )}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

export { PaginationControls as DirectoryPagination };
