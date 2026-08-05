"use client";

import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  Download,
  KeyRound,
  Link2,
  Maximize2,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Search,
  Table2,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonSm,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AssessmentQuestion, DbColumn } from "@/features/candidate-assessment/types";

interface DatabaseAnswerProps {
  question: AssessmentQuestion;
}

/* ── tiny markdown (headings, bold, lists) ── */
function renderInline(text: string, key: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={`${key}-${i}`} className="font-semibold text-text">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return (
        <code key={`${key}-${i}`} className="rounded bg-[rgba(15,23,42,0.06)] px-1 py-0.5 font-mono text-[11px] text-text dark:bg-white/[0.08]">
          {p.slice(1, -1)}
        </code>
      );
    return <span key={`${key}-${i}`}>{p}</span>;
  });
}

function Markdown({ source }: { source: string }) {
  return (
    <div>
      {source.split("\n").map((line, i) => {
        if (line.startsWith("## "))
          return (
            <h3 key={i} className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted first:mt-0">
              {line.slice(3)}
            </h3>
          );
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return (
          <p key={i} className="mt-1.5 text-[12.5px] leading-relaxed text-text-secondary">
            {renderInline(line, `l${i}`)}
          </p>
        );
      })}
    </div>
  );
}

/* ── SQL data-uri helper for ER diagram ── */
function toSrc(raw: string) {
  return raw.trim().startsWith("<svg") ? `data:image/svg+xml,${encodeURIComponent(raw)}` : raw;
}

/* ── ER diagram lightbox ── */
function ErDialog({ src, open, onOpenChange }: { src: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [zoom, setZoom] = useState(1);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[250] bg-[rgba(15,23,42,0.6)] backdrop-blur-[4px]" />
        <div className="fixed inset-0 z-[250] flex flex-col p-4">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-t-[14px] border border-b-0 border-[rgba(15,23,42,0.08)] bg-white px-4 py-2.5 dark:border-white/[0.08] dark:bg-surface">
            <DialogTitle className="text-[13px] font-semibold text-text">ER Diagram</DialogTitle>
            <DialogDescription className="sr-only">Entity relationship diagram</DialogDescription>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-[rgba(15,23,42,0.05)] dark:hover:bg-white/[0.06]" aria-label="Zoom out"><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-11 text-center text-[11px] tabular-nums text-muted">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-[rgba(15,23,42,0.05)] dark:hover:bg-white/[0.06]" aria-label="Zoom in"><Plus className="h-3.5 w-3.5" /></button>
              <button onClick={() => setZoom(1)} className="ml-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted hover:bg-[rgba(15,23,42,0.05)] dark:hover:bg-white/[0.06]">Fit</button>
              <DialogClose className={cn(dialogCloseButtonSm, "ml-1")} aria-label="Close" />
            </div>
          </div>
          <DialogPanel className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center overflow-auto rounded-b-[14px] border border-[rgba(15,23,42,0.08)] bg-[#f8fafc] p-6 dark:border-white/[0.08] dark:bg-[#0c0c0f]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="ER diagram" style={{ transform: `scale(${zoom})` }} className="max-h-full max-w-full origin-center transition-transform" />
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}

/* ── Column type icons ── */
function ColumnMeta({ col }: { col: DbColumn }) {
  return (
    <span className="flex items-center gap-1">
      {col.pk && <KeyRound className="h-2.5 w-2.5 text-amber-500" aria-label="Primary key" />}
      {col.fk && <Link2 className="h-2.5 w-2.5 text-sky-500" aria-label="Foreign key" />}
      {col.nullable && <span className="text-[8px] font-medium text-muted" title="Nullable">NULL</span>}
    </span>
  );
}

export function DatabaseAnswer({ question }: DatabaseAnswerProps) {
  const [code, setCode] = useState(question.codeStarter ?? "");
  const [ran, setRan] = useState(false);
  const [outputHeight, setOutputHeight] = useState(220);
  const [erOpen, setErOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ col: number; dir: "asc" | "desc" } | null>(null);
  const [execMs] = useState(() => 12 + (question.title.length % 30));

  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const columns = question.queryColumns ?? [];
  const baseRows = useMemo(() => question.queryRows ?? [], [question.queryRows]);
  const tables = question.dbTables ?? [];

  const rows = useMemo(() => {
    if (!sort) return baseRows;
    const copy = [...baseRows];
    copy.sort((a, b) => {
      const av = a[sort.col];
      const bv = b[sort.col];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [baseRows, sort]);

  const lineCount = Math.max(code.split("\n").length, 1);

  function runQuery() {
    setRan(true);
  }
  function formatSql() {
    setCode((c) =>
      c
        .replace(/\s+\n/g, "\n")
        .replace(/\b(select|from|where|join|inner join|left join|group by|order by|having|limit|on|as|with recursive|sum|count|avg|desc|asc)\b/gi, (m) => m.toUpperCase()),
    );
    toast.success("Query formatted");
  }
  function resetQuery() {
    setCode(question.codeStarter ?? "");
    setRan(false);
  }
  function copyResult() {
    const tsv = [columns.join("\t"), ...rows.map((r) => r.join("\t"))].join("\n");
    navigator.clipboard.writeText(tsv).then(() => toast.success("Result copied"));
  }
  function exportCsv() {
    const csv = [columns.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${question.id}-result.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function syncGutter() {
    if (gutterRef.current && textareaRef.current) gutterRef.current.scrollTop = textareaRef.current.scrollTop;
  }

  function startResize(e: React.PointerEvent) {
    e.preventDefault();
    const rect = centerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const onMove = (ev: PointerEvent) => {
      const h = rect.bottom - ev.clientY;
      setOutputHeight(Math.max(120, Math.min(rect.height - 160, h)));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const q = search.trim().toLowerCase();

  return (
    <div className="db-workspace h-full">
      <div className="db-workspace-grid">
        {/* ── Column 1 — Problem ── */}
        <section className="flex min-h-[240px] flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFA] dark:border-white/[0.06] dark:bg-[#0C0C0F]">
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-text">{question.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {question.difficulty && (
                <span className="rounded-md bg-[rgba(15,23,42,0.05)] px-1.5 py-0.5 text-[10px] font-medium text-text-secondary dark:bg-white/[0.06]">{question.difficulty}</span>
              )}
              {question.estimatedMinutes != null && (
                <span className="rounded-md bg-[rgba(15,23,42,0.05)] px-1.5 py-0.5 text-[10px] font-medium text-text-secondary dark:bg-white/[0.06]">~{question.estimatedMinutes} min</span>
              )}
              {question.points != null && (
                <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">{question.points} pts</span>
              )}
            </div>

            <div className="mt-3">
              <Markdown source={question.body} />
            </div>

            {question.requirements?.length ? (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Requirements</p>
                <ul className="mt-2 space-y-1.5">
                  {question.requirements.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-[12px] text-text-secondary">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {question.constraints?.length ? (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Constraints</p>
                <ul className="mt-2 space-y-1">
                  {question.constraints.map((c) => (
                    <li key={c} className="flex gap-1.5 text-[12px] leading-relaxed text-text-secondary">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {question.erDiagram && (
              <button
                type="button"
                onClick={() => setErOpen(true)}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[rgba(15,23,42,0.1)] bg-white px-3 py-2 text-[12px] font-medium text-text transition-colors hover:bg-[rgba(15,23,42,0.03)] dark:border-white/[0.1] dark:bg-white/[0.03]"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Open ER Diagram
              </button>
            )}
          </div>
        </section>

        {/* ── Column 2 — SQL editor + output ── */}
        <section ref={centerRef} className="flex min-h-[420px] flex-col gap-2 overflow-hidden">
          {/* Editor */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#1e1e1e]">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
              <span className="rounded border border-white/10 bg-[#2d2d2d] px-2 py-1 text-xs font-medium text-[#d4d4d4]">SQL</span>
              <div className="flex items-center gap-0.5">
                <button onClick={runQuery} className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700">
                  <Play className="h-3 w-3" fill="currentColor" />
                  Run Query
                </button>
                <button onClick={formatSql} className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[#d4d4d4] hover:bg-white/10">
                  <Wand2 className="h-3.5 w-3.5" />
                  Format
                </button>
                <button onClick={resetQuery} className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[#d4d4d4] hover:bg-white/10">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <a href="https://developer.mozilla.org/en-US/docs/Web/SQL" target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[#d4d4d4] hover:bg-white/10">
                  <BookOpen className="h-3.5 w-3.5" />
                  Docs
                </a>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 overflow-hidden">
              <div ref={gutterRef} aria-hidden className="shrink-0 select-none overflow-hidden border-r border-white/[0.06] bg-[#1a1a1a] px-2.5 py-4 text-right font-mono text-[12px] leading-[1.5] text-[#5a5a5a]">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={syncGutter}
                spellCheck={false}
                placeholder="-- Write your SQL query here"
                className="min-h-0 flex-1 resize-none bg-[#1e1e1e] p-4 font-mono text-[12px] leading-[1.5] text-[#d4d4d4] outline-none"
              />
            </div>
          </div>

          {/* Resize handle */}
          <div
            onPointerDown={startResize}
            className="group flex h-1.5 shrink-0 cursor-row-resize items-center justify-center"
            role="separator"
            aria-orientation="horizontal"
          >
            <div className="h-0.5 w-10 rounded-full bg-[rgba(15,23,42,0.15)] transition-colors group-hover:bg-accent dark:bg-white/20" />
          </div>

          {/* Output panel */}
          <div style={{ height: outputHeight }} className="flex shrink-0 flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-white dark:border-white/[0.06] dark:bg-[#0C0C0F]">
            <div className="flex shrink-0 items-center justify-between border-b border-[rgba(15,23,42,0.06)] px-3 py-2 dark:border-white/[0.06]">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Results</span>
              {ran && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tabular-nums text-muted">{rows.length} rows · {execMs} ms</span>
                  <button onClick={copyResult} className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"><Copy className="h-3 w-3" />Copy</button>
                  <button onClick={exportCsv} className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"><Download className="h-3 w-3" />CSV</button>
                </div>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {!ran ? (
                <p className="py-8 text-center text-[11px] text-muted">Run your query to see results.</p>
              ) : (
                <table className="w-full border-collapse text-[11px]">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {columns.map((c, i) => (
                        <th
                          key={c}
                          onClick={() => setSort((s) => (s?.col === i ? { col: i, dir: s.dir === "asc" ? "desc" : "asc" } : { col: i, dir: "asc" }))}
                          className="cursor-pointer select-none border-b border-[rgba(15,23,42,0.08)] bg-[#F5F7FA] px-3 py-1.5 text-left font-semibold text-text-secondary hover:bg-[rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:bg-white/[0.04]"
                        >
                          <span className="flex items-center gap-1">
                            {c}
                            {sort?.col === i && <span className="text-[8px]">{sort.dir === "asc" ? "▲" : "▼"}</span>}
                          </span>
                        </th>
                      ))}
                      <th className="w-8 border-b border-[rgba(15,23,42,0.08)] bg-[#F5F7FA] dark:border-white/[0.08] dark:bg-white/[0.04]" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, ri) => (
                      <tr key={ri} className="group hover:bg-[rgba(15,23,42,0.02)] dark:hover:bg-white/[0.02]">
                        {r.map((cell, ci) => (
                          <td key={ci} className="border-b border-[rgba(15,23,42,0.05)] px-3 py-1.5 font-mono text-[#3F3F46] dark:border-white/[0.05] dark:text-text-secondary">
                            {cell}
                          </td>
                        ))}
                        <td className="border-b border-[rgba(15,23,42,0.05)] text-center dark:border-white/[0.05]">
                          <button
                            onClick={() => navigator.clipboard.writeText(r.join("\t")).then(() => toast.success("Row copied"))}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Copy row"
                          >
                            <Copy className="h-3 w-3 text-muted hover:text-text" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        {/* ── Column 3 — Database explorer ── */}
        <section className="flex min-h-[240px] flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFA] dark:border-white/[0.06] dark:bg-[#0C0C0F]">
          <div className="shrink-0 border-b border-[rgba(15,23,42,0.06)] p-2.5 dark:border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              <Database className="h-3.5 w-3.5" />
              Explorer
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-[rgba(15,23,42,0.08)] bg-white px-2 py-1 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <Search className="h-3 w-3 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tables, columns"
                className="w-full bg-transparent text-[11px] text-text outline-none placeholder:text-muted"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear search"><X className="h-3 w-3 text-muted" /></button>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {tables.map((t) => {
              const matchTable = t.name.toLowerCase().includes(q);
              const visibleCols = t.columns.filter((c) => !q || matchTable || c.name.toLowerCase().includes(q));
              if (q && !matchTable && visibleCols.length === 0) return null;
              const isCollapsed = collapsed.has(t.name);
              return (
                <div key={t.name} className="mb-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsed((s) => {
                        const n = new Set(s);
                        n.has(t.name) ? n.delete(t.name) : n.add(t.name);
                        return n;
                      })
                    }
                    className="flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-[12px] font-medium text-text transition-colors hover:bg-[rgba(15,23,42,0.04)] dark:hover:bg-white/[0.04]"
                  >
                    {isCollapsed ? <ChevronRight className="h-3 w-3 text-muted" /> : <ChevronDown className="h-3 w-3 text-muted" />}
                    <Table2 className="h-3 w-3 text-accent" />
                    {t.name}
                  </button>
                  {!isCollapsed && (
                    <div className="ml-4 border-l border-[rgba(15,23,42,0.08)] pl-1.5 dark:border-white/[0.08]">
                      {visibleCols.map((col) => (
                        <div key={col.name} className="flex items-center justify-between gap-1 rounded px-1.5 py-0.5 hover:bg-[rgba(15,23,42,0.03)] dark:hover:bg-white/[0.03]">
                          <span className="flex min-w-0 items-center gap-1">
                            <span className="truncate font-mono text-[11px] text-text-secondary">{col.name}</span>
                            <span className="shrink-0 font-mono text-[9px] uppercase text-muted">{col.type}</span>
                          </span>
                          <ColumnMeta col={col} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {tables.length === 0 && <p className="p-3 text-center text-[11px] text-muted">No schema available.</p>}
          </div>
        </section>
      </div>

      {question.erDiagram && <ErDialog src={toSrc(question.erDiagram)} open={erOpen} onOpenChange={setErOpen} />}
    </div>
  );
}
