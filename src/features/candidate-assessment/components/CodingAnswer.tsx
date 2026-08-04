"use client";

import { useMemo, useRef, useState } from "react";
import { BookOpen, Play, RotateCcw, TerminalSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface CodingAnswerProps {
  question: AssessmentQuestion;
}

type RunState = "idle" | "running" | "done";
type TestStatus = "passed" | "failed" | "timeout" | "not-run";

const TEST_STATUS_STYLES: Record<TestStatus, string> = {
  passed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40",
  failed: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40",
  timeout: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40",
  "not-run": "bg-[rgba(15,23,42,0.03)] text-muted border-[rgba(15,23,42,0.08)] dark:bg-white/[0.04] dark:border-white/[0.08]",
};

const TEST_STATUS_LABEL: Record<TestStatus, string> = {
  passed: "Passed",
  failed: "Failed",
  timeout: "Timeout",
  "not-run": "Not run",
};

/** Split a test-case input string on top-level commas (bracket-aware). */
function splitParams(input: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of input) {
    if (ch === "[" || ch === "(" || ch === "{") depth++;
    if (ch === "]" || ch === ")" || ch === "}") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts.length ? parts : [input];
}

export function CodingAnswer({ question }: CodingAnswerProps) {
  const [code, setCode] = useState(question.codeStarter || "");
  const [output, setOutput] = useState("");
  const [runState, setRunState] = useState<RunState>("idle");
  const [activeTab, setActiveTab] = useState<"output" | "tests">("output");

  const allTestCases = useMemo(() => question.testCases ?? [], [question.testCases]);
  const visibleTestCases = useMemo(
    () => allTestCases.filter((tc) => tc.visible),
    [allTestCases],
  );

  const [testResults, setTestResults] = useState<Record<string, TestStatus>>({});

  // Derive custom-input fields from the first visible test case's parameters.
  const initialParams = useMemo(
    () => (visibleTestCases[0] ? splitParams(visibleTestCases[0].input) : [""]),
    [visibleTestCases],
  );
  const [customInputs, setCustomInputs] = useState<string[]>(initialParams);

  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = Math.max(code.split("\n").length, 1);

  function syncGutterScroll() {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  function handleRunCode() {
    setActiveTab("output");
    setRunState("running");
    setOutput("");
    window.setTimeout(() => {
      setRunState("done");
      setOutput(
        `> Running with input: ${customInputs.join(", ") || "—"}\n> Execution finished in 42ms\n\n${
          visibleTestCases[0]?.expectedOutput ?? "true"
        }`,
      );
    }, 650);
  }

  function handleRunTests() {
    setActiveTab("tests");
    setRunState("running");
    // Reset to "not-run" while evaluating.
    setTestResults(Object.fromEntries(allTestCases.map((tc) => [tc.id, "not-run" as TestStatus])));
    window.setTimeout(() => {
      // Prototype evaluation: mark all-but-last passed for demonstration.
      const next: Record<string, TestStatus> = {};
      allTestCases.forEach((tc, i) => {
        next[tc.id] = i === allTestCases.length - 1 && allTestCases.length > 2 ? "failed" : "passed";
      });
      setTestResults(next);
      setRunState("done");
    }, 800);
  }

  function handleReset() {
    setCode(question.codeStarter || "");
  }

  const passedCount = allTestCases.filter((tc) => testResults[tc.id] === "passed").length;

  return (
    <div className="coding-workspace h-full">
    <div className="coding-workspace-grid">
      {/* ── Column 1 — Question ── */}
      <section className="flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFA] dark:border-white/[0.06] dark:bg-[#0C0C0F]">
        <div className="flex-1 overflow-y-auto p-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
            Question {question.number}
          </span>
          <h2 className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-text">
            {question.title}
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-[12.5px] leading-relaxed text-text-secondary">
            {question.body}
          </p>

          {visibleTestCases.length > 0 && (
            <div className="mt-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Sample test cases
              </h3>
              <div className="mt-2 space-y-2">
                {visibleTestCases.map((tc) => (
                  <div
                    key={tc.id}
                    className="rounded-lg border border-[rgba(15,23,42,0.06)] bg-white p-2.5 dark:border-white/[0.06] dark:bg-white/[0.02]"
                  >
                    <div className="font-mono text-[11px] text-text-secondary">
                      <div>
                        <span className="text-muted">Input:</span> {tc.input}
                      </div>
                      <div className="mt-1">
                        <span className="text-muted">Expected:</span> {tc.expectedOutput}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Column 2 — Code editor ── */}
      <section className="flex min-h-[420px] flex-col overflow-hidden rounded-xl bg-[#1e1e1e]">
        {/* Editor header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
          <select
            className="rounded border border-white/10 bg-[#2d2d2d] px-2 py-1 text-xs text-[#d4d4d4] outline-none"
            defaultValue={question.language || "javascript"}
          >
            <option value={question.language || "javascript"}>
              {question.language || "JavaScript"}
            </option>
          </select>

          <div className="flex items-center gap-1">
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#d4d4d4] transition-colors hover:bg-white/10"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Docs
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#d4d4d4] transition-colors hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Code
            </button>
          </div>
        </div>

        {/* Editor body — line numbers + textarea */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div
            ref={gutterRef}
            aria-hidden
            className="shrink-0 select-none overflow-hidden border-r border-white/[0.06] bg-[#1a1a1a] px-2.5 py-4 text-right font-mono text-sm leading-[1.5] text-[#5a5a5a]"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={syncGutterScroll}
            className="min-h-0 flex-1 resize-none bg-[#1e1e1e] p-4 font-mono text-sm leading-[1.5] text-[#d4d4d4] outline-none"
            spellCheck={false}
          />
        </div>
      </section>

      {/* ── Column 3 — Run / Test ── */}
      <section className="flex min-h-[360px] flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-white dark:border-white/[0.06] dark:bg-[#0C0C0F]">
        {/* Top actions */}
        <div className="flex shrink-0 flex-col gap-2 border-b border-[rgba(15,23,42,0.06)] p-3 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={handleRunTests}
            disabled={runState === "running"}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            <TerminalSquare className="h-3.5 w-3.5" />
            Run Test Cases
          </button>
          <button
            type="button"
            onClick={handleRunCode}
            disabled={runState === "running"}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)] px-3 py-1.5 text-[12px] font-medium text-text transition-colors hover:bg-[rgba(15,23,42,0.06)] disabled:opacity-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
          >
            <Play className="h-3.5 w-3.5" />
            Run Code
          </button>
        </div>

        {/* Custom input */}
        <div className="shrink-0 border-b border-[rgba(15,23,42,0.06)] p-3 dark:border-white/[0.06]">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Custom Input
          </h3>
          <div className="mt-2 space-y-2">
            {customInputs.map((val, i) => (
              <div key={i}>
                <label className="text-[10px] font-medium text-text-secondary">
                  Input {i + 1}
                </label>
                <input
                  value={val}
                  onChange={(e) =>
                    setCustomInputs((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))
                  }
                  className="mt-1 w-full rounded-lg border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.02)] px-2.5 py-1.5 font-mono text-[12px] text-text outline-none focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Output / Test Cases tabs */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "output" | "tests")}
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList size="compact" className="shrink-0 px-3">
              <TabsTrigger value="output" size="compact">
                Output
              </TabsTrigger>
              <TabsTrigger value="tests" size="compact">
                Test Cases
                {allTestCases.length > 0 && (
                  <span className="ml-1 text-[10px] text-muted">
                    ({passedCount}/{allTestCases.length})
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Output tab */}
            <TabsContent
              value="output"
              className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="flex shrink-0 items-center justify-between px-3 pt-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
                  Console
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOutput("");
                    setRunState("idle");
                  }}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted transition-colors hover:bg-[rgba(15,23,42,0.04)] hover:text-text dark:hover:bg-white/[0.04]"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear Log
                </button>
              </div>
              <div className="m-3 mt-2 min-h-0 flex-1 overflow-auto rounded-lg bg-[#1a1a1a] p-3 font-mono text-[11px] leading-relaxed text-[#d4d4d4]">
                {runState === "running" ? (
                  <span className="text-amber-400">Running…</span>
                ) : output ? (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                  <span className="text-[#5a5a5a]">
                    Run your code to see the output here.
                  </span>
                )}
              </div>
            </TabsContent>

            {/* Test Cases tab */}
            <TabsContent
              value="tests"
              className="mt-0 min-h-0 flex-1 overflow-y-auto p-3"
            >
              {allTestCases.length === 0 ? (
                <p className="py-6 text-center text-[11px] text-muted">No test cases.</p>
              ) : (
                <div className="space-y-1.5">
                  {allTestCases.map((tc, i) => {
                    const status: TestStatus = testResults[tc.id] ?? "not-run";
                    return (
                      <div
                        key={tc.id}
                        className="rounded-lg border border-[rgba(15,23,42,0.06)] bg-white p-2.5 dark:border-white/[0.06] dark:bg-white/[0.02]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-text">
                            Test case {i + 1}
                            {!tc.visible && (
                              <span className="ml-1 text-[9px] text-muted">(hidden)</span>
                            )}
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
                              TEST_STATUS_STYLES[status],
                            )}
                          >
                            {TEST_STATUS_LABEL[status]}
                          </span>
                        </div>
                        {tc.visible && (
                          <div className="mt-1.5 space-y-0.5 font-mono text-[10px] text-text-secondary">
                            <div>
                              <span className="text-muted">Input:</span> {tc.input}
                            </div>
                            <div>
                              <span className="text-muted">Expected:</span> {tc.expectedOutput}
                            </div>
                            <div>
                              <span className="text-muted">Actual:</span>{" "}
                              {status === "passed"
                                ? tc.expectedOutput
                                : status === "failed"
                                  ? "—"
                                  : status === "timeout"
                                    ? "timed out"
                                    : "not run"}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
    </div>
  );
}
