"use client";

import { useState } from "react";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface CodingAnswerProps {
  question: AssessmentQuestion;
}

export function CodingAnswer({ question }: CodingAnswerProps) {
  const [code, setCode] = useState(question.codeStarter || "");
  const [output, setOutput] = useState("");

  const visibleTestCases = question.testCases?.filter((tc) => tc.visible) || [];

  return (
    <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[2fr_3fr]">
      {/* Left panel */}
      <div className="border-r border-border p-5 overflow-y-auto">
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
          <select
            className="bg-[#2d2d2d] text-[#d4d4d4] text-xs rounded px-2 py-1 border border-white/10 outline-none"
            defaultValue={question.language || "javascript"}
          >
            <option value={question.language || "javascript"}>
              {question.language || "JavaScript"}
            </option>
          </select>
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
