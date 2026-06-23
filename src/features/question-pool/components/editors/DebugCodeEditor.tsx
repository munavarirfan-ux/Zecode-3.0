"use client";

import { useCallback, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TestCase } from "../../types";

const LANGUAGES = [
  "javascript",
  "python",
  "java",
  "c++",
  "typescript",
  "go",
  "rust",
] as const;

export function DebugCodeEditor({
  codeLanguage,
  buggyCode,
  testCases,
  onPatch,
}: {
  codeLanguage: string;
  buggyCode: string;
  testCases: TestCase[];
  onPatch: (patch: { codeLanguage?: string; buggyCode?: string }) => void;
}) {
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [initialCode] = useState(buggyCode);

  const sampleCase = testCases.find((t) => !t.hidden);

  const handleRun = useCallback(() => {
    setRunning(true);
    setOutput("");
    setTimeout(() => {
      setOutput(
        sampleCase
          ? `> Running with input: ${sampleCase.input || "(empty)"}\n> Expected: ${sampleCase.expected || "(empty)"}\n\n// Output will appear here after execution`
          : "> No sample test cases available",
      );
      setRunning(false);
    }, 800);
  }, [sampleCase]);

  const handleReset = useCallback(() => {
    onPatch({ buggyCode: initialCode });
    setOutput("");
  }, [initialCode, onPatch]);

  return (
    <div className="space-y-3">
      <div className="rounded-[10px] border border-amber-300/40 bg-amber-50/50 px-3 py-2 text-[11px] text-amber-800 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-200">
        Do not modify the main function, function name, or parameters. Write your fix below the comment.
      </div>

      <div className="flex min-h-[420px] gap-3">
        {/* Left — Code Editor */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] dark:border-white/[0.08]">
          <div className="flex items-center justify-between border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] px-3 py-1.5 dark:bg-white/[0.03]">
            <span className="text-[10px] font-medium text-muted">Buggy Code</span>
            <Select
              value={codeLanguage}
              onValueChange={(v) => onPatch({ codeLanguage: v })}
            >
              <SelectTrigger className="h-6 w-28 rounded-[6px] border-[rgba(15,23,42,0.08)] bg-white/80 px-2 font-mono text-[10px] dark:border-white/[0.08] dark:bg-white/[0.04]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l} className="font-mono text-[11px]">
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!codeLanguage ? (
            <div className="flex flex-1 items-center justify-center bg-[#fafafb] text-[13px] text-muted dark:bg-[#141416]">
              Please select a language
            </div>
          ) : (
            <textarea
              value={buggyCode}
              onChange={(e) => onPatch({ buggyCode: e.target.value })}
              spellCheck={false}
              className="flex-1 resize-none bg-[#fafafb] px-3 py-3 font-mono text-[12px] leading-relaxed text-text outline-none dark:bg-[#141416]"
            />
          )}

          <div className="flex items-center gap-2 border-t border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] px-3 py-2 dark:bg-white/[0.02]">
            <button
              type="button"
              onClick={handleRun}
              disabled={running || !codeLanguage || !buggyCode.trim()}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-[8px] bg-accent px-3 text-[11px] font-medium text-white",
                "disabled:opacity-40",
              )}
            >
              <Play className="h-3 w-3" />
              {running ? "Running…" : "Run Code"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-7 items-center gap-1.5 rounded-[8px] border border-[rgba(15,23,42,0.08)] px-3 text-[11px] font-medium text-muted hover:text-text"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Right — Input / Output */}
        <div className="flex w-64 shrink-0 flex-col gap-3">
          {/* Input preview */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] dark:border-white/[0.08]">
            <div className="border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] px-3 py-1.5 text-[10px] font-medium text-muted dark:bg-white/[0.03]">
              Input
            </div>
            <div className="flex-1 overflow-auto bg-[#fafafb] p-3 font-mono text-[11px] text-text dark:bg-[#141416]">
              {sampleCase?.input || <span className="text-muted">No test case input</span>}
            </div>
          </div>

          {/* Output console */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] dark:border-white/[0.08]">
            <div className="border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] px-3 py-1.5 text-[10px] font-medium text-muted dark:bg-white/[0.03]">
              Output
            </div>
            <div className="flex-1 overflow-auto bg-[#1e1e2e] p-3 font-mono text-[11px] leading-relaxed text-green-400">
              {running ? (
                <span className="animate-pulse text-amber-300">Running…</span>
              ) : output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-[#555]">Run code to see output</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
