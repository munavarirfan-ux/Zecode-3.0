"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Pause,
  Play,
  RotateCcw,
  Terminal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  dialogCloseButtonLg,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { QuestionDraftFormValues } from "../editor/schemas";

const MOCK_TEST_CASES = [
  { name: "Test case 1 — basic input", expected: "true", actual: "true", passed: true },
  { name: "Test case 2 — edge case", expected: "false", actual: "false", passed: true },
  { name: "Test case 3 — large input", expected: "42", actual: "—", passed: false },
];

function CodePanel({ draft }: { draft: QuestionDraftFormValues }) {
  const [copied, setCopied] = useState(false);
  const code = draft.type === "debug" ? draft.buggyCode : draft.starterCode;
  const language = draft.type === "debug" ? draft.codeLanguage : "javascript";
  const lines = (code || "").split("\n");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code || "");
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[12px] border border-[#1e293b] bg-[#0f172a]">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {draft.type === "debug" ? "Buggy Code" : "Starter Code"}
          </span>
          {language && (
            <span className="rounded-[5px] bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
              {language}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 rounded-[6px] px-1.5 text-[10px] text-slate-400 hover:bg-white/10 hover:text-white"
          onClick={copyCode}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          Copy
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {code ? (
          <div className="flex">
            <div className="shrink-0 select-none border-r border-white/[0.06] bg-[#0c1220] px-2.5 pt-2.5 text-right font-mono text-[11px] leading-[1.7] text-slate-600">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="flex-1 overflow-x-auto whitespace-pre p-2.5 font-mono text-[11.5px] leading-[1.7] text-slate-200">
              {code}
            </pre>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-slate-500">
            No code added yet
          </div>
        )}
      </div>
    </div>
  );
}

function RunTestPanel({ draft }: { draft: QuestionDraftFormValues }) {
  const [activeTab, setActiveTab] = useState<"output" | "testcases">("output");
  const [hasRun, setHasRun] = useState(false);

  const testCases = draft.testCases.length > 0
    ? draft.testCases.map((tc, i) => ({
        name: tc.input ? `Test: ${tc.input.slice(0, 30)}` : `Test case ${i + 1}`,
        expected: tc.expected || "—",
        actual: "—",
        passed: false,
      }))
    : MOCK_TEST_CASES;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08] dark:bg-surface">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-[rgba(15,23,42,0.06)] px-2.5 py-1.5 dark:border-white/[0.06]">
        <Button
          type="button"
          size="sm"
          className="h-6 gap-1 rounded-[6px] bg-emerald-600 px-2 text-[10px] font-medium text-white hover:bg-emerald-700"
          onClick={() => {
            setHasRun(true);
            setActiveTab("output");
            toast.success("Code executed (mock)");
          }}
        >
          <Play className="h-2.5 w-2.5" fill="currentColor" />
          Run Code
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-6 gap-1 rounded-[6px] bg-accent px-2 text-[10px] font-medium text-white hover:bg-accent/90"
          onClick={() => {
            setHasRun(true);
            setActiveTab("testcases");
            toast.success("Tests executed (mock)");
          }}
        >
          <Terminal className="h-2.5 w-2.5" />
          Run Tests
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto h-6 gap-1 rounded-[6px] px-1.5 text-[10px] text-muted hover:text-text"
          onClick={() => setHasRun(false)}
        >
          <RotateCcw className="h-2.5 w-2.5" />
          Clear
        </Button>
      </div>

      <div className="flex shrink-0 border-b border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]">
        <button
          type="button"
          onClick={() => setActiveTab("output")}
          className={cn(
            "px-3 py-1.5 text-[11px] font-medium transition-colors",
            activeTab === "output"
              ? "border-b-2 border-accent text-accent"
              : "text-muted hover:text-text",
          )}
        >
          Output
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("testcases")}
          className={cn(
            "px-3 py-1.5 text-[11px] font-medium transition-colors",
            activeTab === "testcases"
              ? "border-b-2 border-accent text-accent"
              : "text-muted hover:text-text",
          )}
        >
          Test Cases
          <span className="ml-1 text-[10px] text-muted">({testCases.length})</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {activeTab === "output" ? (
          <div className="h-full bg-[#0f172a] p-3 font-mono text-[11px] leading-relaxed text-slate-300">
            {hasRun ? (
              <>
                <span className="text-emerald-400">$</span> Running code...{"\n"}
                <span className="text-slate-500">Output will appear here during live execution.</span>
              </>
            ) : (
              <span className="text-slate-500">Click "Run Code" to see output</span>
            )}
          </div>
        ) : (
          <div className="p-2">
            <ul className="space-y-1">
              {testCases.map((tc, i) => (
                <li
                  key={i}
                  className={cn(
                    "rounded-[8px] border px-2.5 py-2 text-[11px]",
                    hasRun && tc.passed
                      ? "border-emerald-500/15 bg-emerald-500/[0.04]"
                      : hasRun
                        ? "border-red-500/15 bg-red-500/[0.04]"
                        : "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#18181B] dark:text-text">
                      {tc.name}
                    </span>
                    {hasRun && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                          tc.passed
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-red-500/10 text-red-700",
                        )}
                      >
                        {tc.passed ? "Passed" : "Failed"}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                    <div>
                      <span className="text-muted">Expected: </span>
                      <span className="text-[#3F3F46]">{tc.expected}</span>
                    </div>
                    <div>
                      <span className="text-muted">Actual: </span>
                      <span className="text-[#3F3F46]">{hasRun ? tc.actual : "—"}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function CodingPreviewDialog({
  open,
  onOpenChange,
  draft,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: QuestionDraftFormValues;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[250] bg-[rgba(15,23,42,0.5)] backdrop-blur-[6px]" />
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <DialogPanel
            className={cn(
              "relative flex flex-col overflow-hidden rounded-[16px]",
              "h-[85vh] w-[92vw] max-w-[1400px]",
              "border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.28)] dark:bg-surface",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[rgba(15,23,42,0.06)] px-5 py-3 dark:border-white/[0.06]">
              <div className="min-w-0">
                <DialogTitle className="text-[15px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
                  {draft.title || "Untitled Question"}
                </DialogTitle>
                {draft.bodyMarkdown && (
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[#52525B] dark:text-text-secondary">
                    {draft.bodyMarkdown.slice(0, 120)}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted dark:bg-white/[0.06]">
                  {draft.difficulty}
                </span>
                <span className="rounded-[5px] bg-[rgba(15,23,42,0.06)] px-1.5 py-0.5 text-[10px] font-semibold text-muted dark:bg-white/[0.06]">
                  {draft.type === "debug" ? "Debug Snippet" : "Coding"}
                </span>
                <button
                  type="button"
                  className={dialogCloseButtonLg}
                  aria-label="Close preview"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            </div>

            {/* 2-column workspace */}
            <div className="min-h-0 flex-1 overflow-hidden bg-[#F5F7FA] p-2 dark:bg-app-bg">
              <div className="grid h-full grid-cols-1 gap-2 lg:grid-cols-[55%_minmax(0,1fr)]">
                <CodePanel draft={draft} />
                <RunTestPanel draft={draft} />
              </div>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
