"use client";

import { Plus, Trash2 } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import type { TestCase } from "../../types";

function newId() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function TestCasesEditor({
  testCases,
  onChange,
}: {
  testCases: TestCase[];
  onChange: (cases: TestCase[]) => void;
}) {
  const update = (id: string, patch: Partial<TestCase>) => {
    onChange(testCases.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  return (
    <div className="space-y-3">
      {testCases.map((tc, i) => {
        const isHidden = tc.visibility === "hidden" || tc.hidden;
        return (
          <div
            key={tc.id}
            className="rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white/80 p-3 dark:bg-white/[0.03]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text">Case {i + 1}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-[10px] text-muted">
                  {isHidden ? "Hidden" : "Sample"}
                  <Switch.Root
                    checked={isHidden}
                    onCheckedChange={(hidden) =>
                      update(tc.id, {
                        hidden,
                        visibility: hidden ? "hidden" : "sample",
                      })
                    }
                    className="relative h-4 w-7 rounded-full bg-[rgba(15,23,42,0.12)] data-[state=checked]:bg-accent"
                  >
                    <Switch.Thumb className="block h-3 w-3 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-3.5" />
                  </Switch.Root>
                </label>
                <div className="flex items-center gap-1">
                  <label className="text-[10px] text-muted">Pts</label>
                  <input
                    type="number"
                    min={0}
                    value={tc.points ?? ""}
                    onChange={(e) =>
                      update(tc.id, {
                        points: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="10"
                    className="h-6 w-12 rounded-[6px] border border-[rgba(15,23,42,0.08)] bg-surface px-1.5 text-center font-mono text-[10px] outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
                  />
                </div>
                {testCases.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => onChange(testCases.filter((t) => t.id !== tc.id))}
                    className="text-muted hover:text-red-600"
                    aria-label="Remove test case"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-medium text-muted">Input</label>
                <textarea
                  value={tc.input}
                  onChange={(e) => update(tc.id, { input: e.target.value })}
                  className="mt-1 min-h-[72px] w-full rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-surface px-2 py-1.5 font-mono text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted">Expected</label>
                <textarea
                  value={tc.expected}
                  onChange={(e) => update(tc.id, { expected: e.target.value })}
                  className="mt-1 min-h-[72px] w-full rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-surface px-2 py-1.5 font-mono text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
                />
              </div>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...testCases,
            { id: newId(), input: "", expected: "", hidden: false, visibility: "sample" },
          ])
        }
        className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-dashed border-[rgba(15,23,42,0.12)] px-3 text-[12px] font-medium text-accent hover:bg-[rgba(124,58,237,0.06)]"
      >
        <Plus className="h-3.5 w-3.5" />
        Add test case
      </button>
    </div>
  );
}
