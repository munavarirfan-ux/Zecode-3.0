"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";

interface DatabaseAnswerProps {
  question: AssessmentQuestion;
}

export function DatabaseAnswer({ question }: DatabaseAnswerProps) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"output" | "json">("output");

  return (
    <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[2fr_3fr]">
      {/* Left panel */}
      <div className="border-r border-border p-5 overflow-y-auto">
        <h2 className="text-lg font-semibold text-text">{question.title}</h2>
        <p className="text-sm text-text-secondary mt-2 whitespace-pre-wrap">
          {question.body}
        </p>

        {question.schema && (
          <div className="mt-4">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
              Schema: {question.schema}
            </span>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="flex flex-col overflow-hidden rounded-xl bg-[#1e1e1e]">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between px-3 py-2 border-b border-white/10">
          <span className="text-xs text-[#d4d4d4] font-medium">SQL</span>
          <button className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10">
            Run query
          </button>
        </div>

        {/* SQL editor area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="-- Write your SQL query here"
          className="min-h-0 flex-1 resize-none bg-[#1e1e1e] p-4 font-mono text-sm text-[#d4d4d4] outline-none"
          spellCheck={false}
        />

        {/* Output area with tabs */}
        <div className="h-[160px] border-t border-white/10 bg-[#1a1a1a] flex flex-col">
          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-white/10">
            <button
              onClick={() => setActiveTab("output")}
              className={cn(
                "px-4 py-2 text-xs font-medium transition-all",
                activeTab === "output"
                  ? "text-white border-b-2 border-accent"
                  : "text-[#888] hover:text-white"
              )}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={cn(
                "px-4 py-2 text-xs font-medium transition-all",
                activeTab === "json"
                  ? "text-white border-b-2 border-accent"
                  : "text-[#888] hover:text-white"
              )}
            >
              JSON
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 p-3 text-xs font-mono text-[#d4d4d4] overflow-auto">
            {output || "// Output will appear here"}
          </div>
        </div>
      </div>
    </div>
  );
}
