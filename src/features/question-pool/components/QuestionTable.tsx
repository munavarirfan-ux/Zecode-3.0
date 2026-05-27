"use client";

import { useEffect, useMemo } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { hiringCard, hiringTransition } from "@/components/hiring/hiringTokens";
import { DirectoryPagination } from "@/components/hiring/directories/DirectoryPagination";
import { DifficultyMeter } from "./DifficultyMeter";
import {
  EMPTY_CELL,
  formatQuestionTypeLabel,
  QUESTION_TYPE_ACCENT,
  QUESTION_TYPE_LABELS,
  STATUS_DOT,
  STATUS_LABELS,
} from "../tokens";
import { filterQuestions, sortQuestions } from "../lib/selectors";
import { usePoolStore } from "../store/poolStore";
import { POOL_PAGE_SIZE, type Question, type QuestionType } from "../types";

/** Checkbox · # · question · type · difficulty · skill · tag · curator · status · actions */
const TABLE_GRID = cn(
  "grid items-center gap-x-3 px-3",
  "grid-cols-[2.25rem_2.25rem_minmax(12rem,2fr)_6.5rem_7.25rem_minmax(4.5rem,0.7fr)_minmax(4rem,0.6fr)_minmax(5.5rem,0.85fr)_5.75rem_4.25rem]",
);

const TABLE_MIN_WIDTH = "min-w-[52rem]";

const HEADER_LABEL =
  "text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/70";

function GridHeaderCell({
  children,
  align = "start",
}: {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
}) {
  return (
    <span
      className={cn(
        HEADER_LABEL,
        align === "end" && "text-right",
        align === "center" && "text-center",
      )}
    >
      {children}
    </span>
  );
}

function TypePill({ type, label }: { type: QuestionType; label?: string }) {
  const accent = QUESTION_TYPE_ACCENT[type];
  return (
    <span
      className="inline-flex max-w-full items-center truncate rounded-full px-2 py-0.5 text-[10px] font-medium"
      style={{
        color: accent,
        backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${accent} 22%, transparent)`,
      }}
    >
      {label ?? QUESTION_TYPE_LABELS[type]}
    </span>
  );
}

function TypeCell({ question }: { question: Question }) {
  const label = formatQuestionTypeLabel(question.type, question.subtype);
  return <TypePill type={question.type} label={label} />;
}

function StatusCell({ status }: { status: Question["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-secondary/85">
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}

function QuestionTableRow({
  question,
  index,
  selected,
  onToggleSelect,
  onOpen,
}: {
  question: Question;
  index: number;
  selected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
}) {
  const tag = question.tags[0];
  const delay = Math.min(index, 11) * 40;

  return (
    <>
      <article
        className={cn(
          "group flex cursor-pointer gap-2 border-b border-[rgba(15,23,42,0.05)] px-3 py-3 md:hidden",
          hiringTransition,
          selected ? "bg-[rgba(124,58,237,0.06)]" : "hover:bg-[rgba(124,58,237,0.04)]",
          "qp-row-enter",
        )}
        style={{ animationDelay: `${delay}ms` }}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen();
        }}
        role="button"
        tabIndex={0}
      >
        <Checkbox.Root
          checked={selected}
          onCheckedChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-[rgba(15,23,42,0.15)] bg-white data-[state=checked]:border-accent data-[state=checked]:bg-accent"
          aria-label={`Select ${question.title}`}
        >
          <Checkbox.Indicator>
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[13px] font-medium text-text">{question.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <TypeCell question={question} />
            <DifficultyMeter difficulty={question.difficulty} />
          </div>
        </div>
      </article>

      <article
        className={cn(
          TABLE_GRID,
          "hidden border-b border-[rgba(15,23,42,0.05)] py-2.5 md:grid",
          hiringTransition,
          "group cursor-pointer",
          selected ? "bg-[rgba(124,58,237,0.06)]" : "hover:bg-[rgba(124,58,237,0.04)]",
          "qp-row-enter",
        )}
        style={{ animationDelay: `${delay}ms` }}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox.Root
            checked={selected}
            onCheckedChange={onToggleSelect}
            className="flex h-4 w-4 items-center justify-center rounded-[4px] border border-[rgba(15,23,42,0.15)] bg-white data-[state=checked]:border-accent data-[state=checked]:bg-accent"
            aria-label={`Select question ${question.number}`}
          >
            <Checkbox.Indicator>
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>
        <span className="text-[11px] tabular-nums text-muted">{question.number}</span>
        <p className="min-w-0 line-clamp-2 text-left text-[13px] font-medium leading-snug text-text">
          {question.title}
        </p>
        <div className="min-w-0">
          <TypeCell question={question} />
        </div>
        <div className="min-w-0">
          <DifficultyMeter difficulty={question.difficulty} />
        </div>
        <span className="min-w-0 truncate text-[11px] text-text-secondary/80">{question.skill}</span>
        <span className="min-w-0 truncate text-[11px] text-text-secondary/70">{tag ?? EMPTY_CELL}</span>
        <span className="min-w-0 truncate text-[11px] font-medium text-text-secondary/85">
          {question.curator.name}
        </span>
        <div className="min-w-0">
          <StatusCell status={question.status} />
        </div>
        <div
          className="flex items-center justify-end gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="rounded-[8px] p-1.5 text-muted hover:bg-white/80 hover:text-text"
            aria-label="Edit question"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="rounded-[8px] p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
            aria-label="Delete question"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </article>
    </>
  );
}

export function QuestionTable() {
  const selectedIds = usePoolStore((s) => s.selectedIds);
  const toggleSelected = usePoolStore((s) => s.toggleSelected);
  const openDrawer = usePoolStore((s) => s.openDrawer);
  const page = usePoolStore((s) => s.page);
  const setPage = usePoolStore((s) => s.setPage);
  const questions = usePoolStore((s) => s.questions);
  const filters = usePoolStore((s) => s.filters);
  const activeTypeTab = usePoolStore((s) => s.activeTypeTab);
  const sortKey = usePoolStore((s) => s.sortKey);
  const sortDir = usePoolStore((s) => s.sortDir);

  const { rows, total, totalPages } = useMemo(() => {
    const filtered = sortQuestions(
      filterQuestions(questions, filters, activeTypeTab),
      sortKey,
      sortDir,
    );
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / POOL_PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * POOL_PAGE_SIZE;
    return {
      rows: filtered.slice(start, start + POOL_PAGE_SIZE),
      total,
      totalPages,
    };
  }, [questions, filters, activeTypeTab, sortKey, sortDir, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages, setPage]);

  return (
    <section className={cn(hiringCard, "overflow-hidden p-0")}>
      <div className="overflow-x-auto">
        <div className={TABLE_MIN_WIDTH}>
          <header
            className={cn(
              TABLE_GRID,
              "hidden border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] py-2 md:grid",
              "dark:border-white/[0.06] dark:bg-white/[0.02]",
            )}
          >
            <span className="inline-block h-4 w-4 shrink-0" aria-hidden />
            <GridHeaderCell>#</GridHeaderCell>
            <GridHeaderCell>Question</GridHeaderCell>
            <GridHeaderCell>Type</GridHeaderCell>
            <GridHeaderCell>Difficulty</GridHeaderCell>
            <GridHeaderCell>Skill</GridHeaderCell>
            <GridHeaderCell>Tag</GridHeaderCell>
            <GridHeaderCell>Curator</GridHeaderCell>
            <GridHeaderCell>Status</GridHeaderCell>
            <GridHeaderCell align="end">Actions</GridHeaderCell>
          </header>

          {rows.length === 0 ? (
            <p className="px-4 py-12 text-center text-[13px] text-muted">No questions match your filters.</p>
          ) : (
            rows.map((q, i) => (
              <QuestionTableRow
                key={q.id}
                question={q}
                index={i}
                selected={selectedIds.includes(q.id)}
                onToggleSelect={() => toggleSelected(q.id)}
                onOpen={() => openDrawer(q.id)}
              />
            ))
          )}
        </div>
      </div>

      <DirectoryPagination
        page={page}
        totalPages={totalPages}
        totalCount={total}
        pageSize={POOL_PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="questions"
      />
    </section>
  );
}
