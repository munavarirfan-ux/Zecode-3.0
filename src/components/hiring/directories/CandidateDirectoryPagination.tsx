"use client";

import { PaginationControls } from "./DirectoryPagination";

export const CANDIDATES_DEFAULT_PAGE_SIZE = 50;

export function CandidateDirectoryPagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}: {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}) {
  return (
    <PaginationControls
      totalItems={totalItems}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      entityLabel="candidates"
      className={className}
    />
  );
}
