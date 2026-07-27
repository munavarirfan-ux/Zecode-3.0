"use client";

import { useState } from "react";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface DebugAnswerProps {
  question: AssessmentQuestion;
}

export function DebugAnswer({ question }: DebugAnswerProps) {
  const [code, setCode] = useState(question.buggyCode || "");
  const [output, setOutput] = useState("");

  const visibleTestCases = question.testCases?.filter((tc) => tc.visible) || [];

  return (
    <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[2fr_3fr]">
      {/* Left panel */}
      <div className="border-r border-border p-5 overflow-y-auto">
        {question.bugDescription && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Bug Description
            </h3>
            <p className="text-sm text-text-secondary">
              {question.bugDescription}
            </p>
          </div>
        )}

        <h2 className="text-lg font-semibold text-text">{question.title}</h2>
        <p className="text-sm text-text-secondary mt-2 whitespace-pre-wrap">
          {question.body}
        </p>

        {visibleTestCases.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-text mb-3">Test cases</h3>
            <div className="space-y-2">
              {visibleTestCases.map((tc) => (
                <div
                  key={tc.id}
                  className="bg-[rgba(15,23,42,0.03)] rounded-lg p-3"
                >
                  <div className="font-mono text-xs text-text-secondary">
                    <div>
                      <span className="text-muted">Input:</span> {tc.input}
                    </div>
                    <div className="mt-1">
                      <span className="text-muted">Expected:</span>{" "}
                      {tc.expectedOutput}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="flex flex-col overflow-hidden rounded-xl bg-[#1e1e1e]">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between px-3 py-2 border-b border-white/10">
          <span className="text-xs text-[#d4d4d4] font-medium">
            {question.language || "JavaScript"}
          </span>
          <div className="flex items-center gap-1.5">
            <button className="rounded-md px-3 py-1.5 text-xs font-medium text-[#d4d4d4] transition-colors hover:bg-white/10">
              Run code
            </button>
            <button className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10">
              Run tests
            </button>
          </div>
        </div>

        {/* Code editor area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-0 flex-1 resize-none bg-[#1e1e1e] p-4 font-mono text-sm text-[#d4d4d4] outline-none"
          spellCheck={false}
        />

        {/* Output console */}
        <div className="h-[120px] border-t border-white/10 bg-[#1a1a1a] p-3 text-xs font-mono text-[#d4d4d4] overflow-auto">
          {output || "// Output will appear here"}
        </div>
      </div>
    </div>
  );
}
