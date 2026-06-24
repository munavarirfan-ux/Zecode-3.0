"use client";

import { useCallback, useState } from "react";
import { Play, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ResultRow = Record<string, string | number | null>;

type QueryResult =
  | { status: "idle" }
  | { status: "running" }
  | { status: "success"; columns: string[]; rows: ResultRow[] }
  | { status: "error"; message: string };

const MOCK_RESULTS: Record<string, { columns: string[]; rows: ResultRow[] }> = {
  default: {
    columns: ["id", "name", "email", "created_at"],
    rows: [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", created_at: "2024-01-15" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", created_at: "2024-02-20" },
      { id: 3, name: "Carol White", email: "carol@example.com", created_at: "2024-03-10" },
      { id: 4, name: "David Brown", email: "david@example.com", created_at: "2024-04-05" },
      { id: 5, name: "Eva Martinez", email: "eva@example.com", created_at: "2024-05-12" },
    ],
  },
  aggregate: {
    columns: ["total_count", "avg_balance", "min_balance", "max_balance"],
    rows: [
      { total_count: 142, avg_balance: 5230.45, min_balance: 100.0, max_balance: 25000.0 },
    ],
  },
  join: {
    columns: ["customer_name", "account_type", "balance", "last_transaction"],
    rows: [
      { customer_name: "Alice Johnson", account_type: "savings", balance: 12500.0, last_transaction: "2024-06-01" },
      { customer_name: "Alice Johnson", account_type: "checking", balance: 3200.0, last_transaction: "2024-06-15" },
      { customer_name: "Bob Smith", account_type: "savings", balance: 8750.5, last_transaction: "2024-05-28" },
    ],
  },
};

function pickMockResult(query: string): { columns: string[]; rows: ResultRow[] } {
  const q = query.toLowerCase();
  if (/\b(count|sum|avg|min|max)\b/.test(q)) return MOCK_RESULTS.aggregate;
  if (/\bjoin\b/.test(q)) return MOCK_RESULTS.join;
  return MOCK_RESULTS.default;
}

type Tab = "output" | "json";

export function ExpectedQueryEditor({
  value,
  onChange,
  schemaId,
}: {
  value: string;
  onChange: (v: string) => void;
  schemaId: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("output");
  const [result, setResult] = useState<QueryResult>({ status: "idle" });
  const [copied, setCopied] = useState(false);

  const handleExecute = useCallback(() => {
    if (!value.trim()) return;
    setResult({ status: "running" });
    setActiveTab("output");
    setTimeout(() => {
      const q = value.trim().toLowerCase();
      if (
        !q.startsWith("select") &&
        !q.startsWith("with") &&
        !q.startsWith("show")
      ) {
        setResult({
          status: "error",
          message: `ERROR: syntax error at or near "${value.trim().split(/\s/)[0]}"\nOnly SELECT queries are supported in preview mode.`,
        });
        return;
      }
      const mock = pickMockResult(value);
      setResult({ status: "success", columns: mock.columns, rows: mock.rows });
    }, 900);
  }, [value]);

  const handleCopyJson = useCallback(() => {
    if (result.status !== "success") return;
    navigator.clipboard.writeText(JSON.stringify(result.rows, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "output", label: "Output" },
    { id: "json", label: "JSON" },
  ];

  return (
    <div className="space-y-4">
      {/* SQL Editor */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-text">
            Expected query
          </label>
          <span className="rounded-[6px] bg-[rgba(15,23,42,0.05)] px-1.5 py-0.5 font-mono text-[10px] text-muted">
            sql
          </span>
        </div>
        <div className="overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] dark:border-white/[0.08]">
          <div className="border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] px-3 py-1.5 text-[10px] text-muted dark:bg-white/[0.03]">
            Editor
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder="SELECT * FROM ..."
            className={cn(
              "w-full resize-y bg-[#fafafb] px-3 py-3 font-mono text-[12px] leading-relaxed text-text outline-none",
              "placeholder:text-muted/40 dark:bg-[#141416]",
              "min-h-[140px]",
            )}
          />
        </div>
      </div>

      {/* Execute button */}
      <button
        type="button"
        onClick={handleExecute}
        disabled={result.status === "running" || !value.trim()}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-accent px-4 text-[12px] font-medium text-white",
          "disabled:opacity-40",
        )}
      >
        <Play className="h-3 w-3" />
        {result.status === "running" ? "Executing…" : "Execute Query"}
      </button>

      {/* Tabs */}
      <div className="space-y-0">
        <div className="flex gap-1 border-b border-[rgba(15,23,42,0.06)] pb-px dark:border-white/[0.06]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 px-3 py-2 text-[12px] font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted hover:text-text",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-3 overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] dark:border-white/[0.08]">
          {activeTab === "output" ? (
            <OutputPanel result={result} />
          ) : (
            <JsonPanel result={result} copied={copied} onCopy={handleCopyJson} />
          )}
        </div>
      </div>
    </div>
  );
}

function OutputPanel({ result }: { result: QueryResult }) {
  if (result.status === "idle") {
    return (
      <div className="flex h-[180px] items-center justify-center bg-[#fafafb] text-[13px] text-muted dark:bg-[#141416]">
        Run the expected query to preview output.
      </div>
    );
  }

  if (result.status === "running") {
    return (
      <div className="flex h-[180px] items-center justify-center bg-[#fafafb] dark:bg-[#141416]">
        <div className="flex items-center gap-2 text-[13px] text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
          Executing query…
        </div>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="bg-red-50/50 p-4 dark:bg-red-950/20">
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-red-600 dark:text-red-400">
          {result.message}
        </pre>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)] dark:border-white/[0.08] dark:bg-white/[0.03]">
            {result.columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap px-3 py-2 font-mono text-[11px] font-semibold text-text"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[rgba(15,23,42,0.04)] last:border-0 dark:border-white/[0.04]"
            >
              {result.columns.map((col) => (
                <td
                  key={col}
                  className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-text"
                >
                  {row[col] === null ? (
                    <span className="text-muted">NULL</span>
                  ) : (
                    String(row[col])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] px-3 py-1.5 text-[10px] text-muted dark:border-white/[0.06] dark:bg-white/[0.02]">
        {result.rows.length} row{result.rows.length !== 1 ? "s" : ""} returned
      </div>
    </div>
  );
}

function JsonPanel({
  result,
  copied,
  onCopy,
}: {
  result: QueryResult;
  copied: boolean;
  onCopy: () => void;
}) {
  if (result.status === "idle") {
    return (
      <div className="flex h-[180px] items-center justify-center bg-[#fafafb] text-[13px] text-muted dark:bg-[#141416]">
        Run the expected query to view JSON output.
      </div>
    );
  }

  if (result.status === "running") {
    return (
      <div className="flex h-[180px] items-center justify-center bg-[#fafafb] dark:bg-[#141416]">
        <div className="flex items-center gap-2 text-[13px] text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
          Executing query…
        </div>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="bg-red-50/50 p-4 dark:bg-red-950/20">
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-red-600 dark:text-red-400">
          {result.message}
        </pre>
      </div>
    );
  }

  const json = JSON.stringify(result.rows, null, 2);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "absolute right-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-2.5 text-[11px] font-medium transition-colors",
          "hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]",
          copied && "border-green-300 text-green-600",
        )}
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            Copy JSON
          </>
        )}
      </button>
      <pre className="max-h-[320px] overflow-auto bg-[#1e1e2e] p-4 pr-28 font-mono text-[11px] leading-relaxed text-green-400">
        {json}
      </pre>
    </div>
  );
}
