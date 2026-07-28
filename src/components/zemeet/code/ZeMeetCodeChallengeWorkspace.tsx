"use client";

import { useCallback, useState } from "react";
import {
  Check,
  ChevronDown,
  Circle,
  Clock,
  Cloud,
  Code2,
  Play,
  Plus,
  Square,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { formatChallengeTimer, QUESTION_POOL } from "@/lib/zemeet/codeChallenge";
import { cn } from "@/lib/utils";

const shell = "bg-[#1e1e1e] text-[#d4d4d4]";
const panel = "border-[#2d2d30] bg-[#252526]";
const label = "text-[10px] font-semibold uppercase tracking-[0.08em] text-[#858585]";
const mono = "font-mono";

type LocalQuestion = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  functionName: string;
  expectedIO: { input: string; output: string }[];
  testCases: { id: string; input: string; expectedOutput: string; passed?: boolean }[];
};

function createDefaultQuestion(index: number): LocalQuestion {
  return {
    id: `q-${Date.now()}-${index}`,
    title: "",
    difficulty: "medium",
    description: "",
    functionName: "",
    expectedIO: [{ input: "", output: "" }],
    testCases: [{ id: `tc-${Date.now()}`, input: "", expectedOutput: "" }],
  };
}

export function ZeMeetCodeChallengeWorkspace() {
  const {
    session,
    codeChallenge,
    setEndCodeChallengeOpen,
    runCodeTests,
    submitCodeChallenge,
    updateActiveFileContent,
    questionPool,
    selectPoolQuestion,
    updateCodeChallenge,
    toggleCandidateEditing,
  } = useZeMeet();

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";
  const isCandidate = session.viewerRole === "candidate";
  const canEdit = isCandidate && codeChallenge.candidateEditingEnabled;

  const [questions, setQuestions] = useState<LocalQuestion[]>(() => [
    {
      id: "q-init",
      title: codeChallenge.problemTitle,
      difficulty: "medium",
      description: codeChallenge.problemStatement,
      functionName: "createRateLimiter",
      expectedIO: codeChallenge.examples,
      testCases: codeChallenge.testCases.map((t) => ({
        id: t.id,
        input: t.input ?? "",
        expectedOutput: t.expectedOutput ?? "",
        passed: t.passed,
      })),
    },
  ]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [rightTab, setRightTab] = useState<"output" | "testcases">("output");

  const activeQuestion = questions[activeQuestionIdx] ?? questions[0];

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, createDefaultQuestion(prev.length)]);
    setActiveQuestionIdx(questions.length);
  }, [questions.length]);

  const deleteQuestion = useCallback(
    (idx: number) => {
      if (questions.length <= 1) return;
      setQuestions((prev) => prev.filter((_, i) => i !== idx));
      setActiveQuestionIdx((prev) => Math.min(prev, questions.length - 2));
    },
    [questions.length],
  );

  const updateQuestion = useCallback(
    (idx: number, patch: Partial<LocalQuestion>) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
      );
    },
    [],
  );

  return (
    <div className={cn(shell, "flex h-full min-h-0 flex-1 flex-col overflow-hidden")}>
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#2d2d30] bg-[#1a1a1a] px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2d2d30]">
            <Code2 className="h-3.5 w-3.5 text-[#cccccc]" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#e8e8e8]">
              {activeQuestion?.title || "Untitled Challenge"}
            </p>
            <p className="text-[10px] text-[#858585]">
              Live coding challenge
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live indicator */}
          {codeChallenge.status === "active" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live
            </span>
          )}

          {/* Timer */}
          <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-[#cccccc]">
            <Clock className="h-3.5 w-3.5 text-[#858585]" strokeWidth={1.5} />
            {formatChallengeTimer(codeChallenge.challengeElapsedSeconds)}
          </span>

          {/* Participants */}
          <span className="hidden items-center gap-1 rounded-[8px] border border-[#3c3c3c] px-2 py-1 text-[11px] text-[#858585] sm:inline-flex">
            <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
            {session.participants.length}
          </span>

          {isInterviewer && (
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-red-500/40 bg-red-500/10 px-3 text-[12px] font-semibold text-red-300 hover:bg-red-500/20"
                onClick={() => setEndCodeChallengeOpen(true)}
              >
                <Square className="h-3.5 w-3.5" strokeWidth={2} />
                End Challenge
              </button>
          )}

          {isCandidate && (
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-[8px] border border-[#3c3c3c] px-3 text-[12px] font-medium text-[#cccccc] hover:bg-[#2a2a2a]"
              onClick={submitCodeChallenge}
            >
              Submit
            </button>
          )}
        </div>
      </header>

      {/* Three-column layout */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Left Panel — Question Authoring (interviewer) or Questions View (candidate) */}
        {isInterviewer ? (
          <QuestionAuthoringPanel
            questions={questions}
            activeIdx={activeQuestionIdx}
            onSelectQuestion={setActiveQuestionIdx}
            onAddQuestion={addQuestion}
            onDeleteQuestion={deleteQuestion}
            onUpdateQuestion={updateQuestion}
            questionPool={questionPool}
            onSelectPoolQuestion={(id) => {
              selectPoolQuestion(id);
              const poolItem = questionPool.find((q) => q.id === id);
              if (poolItem) {
                updateQuestion(activeQuestionIdx, {
                  title: poolItem.title,
                  description: poolItem.problemStatement,
                  expectedIO: poolItem.examples,
                  testCases: poolItem.testCases.map((t) => ({
                    id: t.id,
                    input: t.input ?? "",
                    expectedOutput: t.expectedOutput ?? "",
                  })),
                });
              }
            }}
            candidateEditingEnabled={codeChallenge.candidateEditingEnabled}
            onToggleCandidateEditing={toggleCandidateEditing}
          />
        ) : (
          <CandidateQuestionsPanel
            questions={questions}
            activeIdx={activeQuestionIdx}
            onSelectQuestion={setActiveQuestionIdx}
          />
        )}

        {/* Center — Code Editor (45-50%) */}
        <EditorPanel canEdit={canEdit} isInterviewer={isInterviewer} />

        {/* Right — Run/Test Panel (24-28%) */}
        <RunTestPanel
          isInterviewer={isInterviewer}
          rightTab={rightTab}
          setRightTab={setRightTab}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 flex shrink-0 items-center justify-between border-t border-[#2d2d30] bg-[#1a1a1a] px-4 py-1.5 text-[11px] text-[#858585]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
            {session.participants.find((p) => p.id === session.viewerId)?.name ?? "You"}
          </span>
          <span className="text-[#3c3c3c]">·</span>
          <span>{codeChallenge.language}</span>
          <span className="text-[#3c3c3c]">·</span>
          <span>Q{activeQuestionIdx + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>
            {codeChallenge.autosaveStatus === "saving"
              ? "Saving…"
              : codeChallenge.autosaveStatus === "saved"
                ? "All changes saved"
                : "Ready"}
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ============ Left Panel — Question Authoring ============ */

function QuestionAuthoringPanel({
  questions,
  activeIdx,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  questionPool,
  onSelectPoolQuestion,
  candidateEditingEnabled,
  onToggleCandidateEditing,
}: {
  questions: LocalQuestion[];
  activeIdx: number;
  onSelectQuestion: (idx: number) => void;
  onAddQuestion: () => void;
  onDeleteQuestion: (idx: number) => void;
  onUpdateQuestion: (idx: number, patch: Partial<LocalQuestion>) => void;
  questionPool: typeof QUESTION_POOL;
  onSelectPoolQuestion: (id: string) => void;
  candidateEditingEnabled: boolean;
  onToggleCandidateEditing: () => void;
}) {
  const active = questions[activeIdx];
  const [showPool, setShowPool] = useState(false);

  const fullText = active
    ? [
        active.title,
        "",
        active.description,
        "",
        active.functionName ? `Function: ${active.functionName}` : "",
        ...(active.expectedIO.length > 0
          ? ["", "Expected I/O:", ...active.expectedIO.map((io) => `  ${io.input} → ${io.output}`)]
          : []),
        ...(active.testCases.length > 0
          ? ["", "Test Cases:", ...active.testCases.map((tc, i) => `  ${i + 1}. ${tc.input} → ${tc.expectedOutput}`)]
          : []),
      ]
        .filter((line) => line !== undefined)
        .join("\n")
        .trim()
    : "";

  return (
    <aside
      className={cn(
        panel,
        "flex min-h-0 w-[28%] min-w-[260px] max-w-[360px] shrink-0 flex-col overflow-hidden border-r",
      )}
    >
      {/* Question Navigator */}
      <div className="flex items-center gap-2 border-b border-[#2d2d30] px-3 py-2.5">
        <p className={cn(label, "mr-auto")}>Questions</p>
        <div className="flex items-center gap-1">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(i)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-[6px] text-[11px] font-semibold transition-all duration-150",
                i === activeIdx
                  ? "bg-[rgb(var(--accent-rgb))] text-white shadow-sm"
                  : "border border-[#3c3c3c] text-[#858585] hover:border-[#555] hover:text-[#cccccc]",
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={onAddQuestion}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-dashed border-[#3c3c3c] text-[#858585] transition-colors hover:border-[#555] hover:text-[#cccccc]"
            title="Add question"
          >
            <Plus className="h-3 w-3" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Question pool selector */}
      <div className="border-b border-[#2d2d30] px-3 py-2">
        <button
          type="button"
          onClick={() => setShowPool(!showPool)}
          className="flex w-full items-center justify-between rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-2 text-[12px] text-[#b0b0b0] hover:border-[#555]"
        >
          <span>Load from question pool</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showPool && "rotate-180")} strokeWidth={1.5} />
        </button>
        {showPool && (
          <div className="mt-1.5 space-y-1 rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] p-2">
            {questionPool.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  onSelectPoolQuestion(q.id);
                  setShowPool(false);
                }}
                className="w-full rounded-[6px] px-2.5 py-1.5 text-left text-[12px] text-[#b0b0b0] transition-colors hover:bg-[#2a2a2a] hover:text-white"
              >
                {q.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Single large textarea */}
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <textarea
          value={fullText}
          onChange={(e) => {
            const lines = e.target.value.split("\n");
            const title = lines[0] ?? "";
            const rest = lines.slice(1).join("\n").trim();
            onUpdateQuestion(activeIdx, { title, description: rest });
          }}
          placeholder={"Paste or type your full question here…\n\nTitle on the first line, then the problem description, constraints, examples, test cases — all in one place."}
          spellCheck={false}
          className="min-h-0 flex-1 resize-none rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] p-3 text-[12px] leading-relaxed text-[#cccccc] outline-none placeholder:text-[#555] focus:border-[rgb(var(--accent-rgb)/0.5)]"
        />
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between border-t border-[#2d2d30] px-3 py-2.5">
        <label className="flex items-center gap-2 text-[11px] text-[#b0b0b0]">
          <input
            type="checkbox"
            checked={candidateEditingEnabled}
            onChange={onToggleCandidateEditing}
            className="rounded border-[#3c3c3c]"
          />
          Candidate can edit
        </label>
        {questions.length > 1 && (
          <button
            type="button"
            onClick={() => onDeleteQuestion(activeIdx)}
            className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="h-3 w-3" strokeWidth={2} />
            Delete
          </button>
        )}
      </div>
    </aside>
  );
}

/* ============ Left Panel — Candidate Questions View ============ */

function CandidateQuestionsPanel({
  questions,
  activeIdx,
  onSelectQuestion,
}: {
  questions: LocalQuestion[];
  activeIdx: number;
  onSelectQuestion: (idx: number) => void;
}) {
  const active = questions[activeIdx];

  return (
    <aside
      className={cn(
        panel,
        "flex min-h-0 w-[28%] min-w-[260px] max-w-[360px] shrink-0 flex-col overflow-hidden border-r",
      )}
    >
      {/* Question tabs */}
      <div className="flex items-center gap-2 border-b border-[#2d2d30] px-3 py-2.5">
        <p className={cn(label, "mr-auto")}>Questions</p>
        <div className="flex items-center gap-1">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(i)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-[6px] text-[11px] font-semibold transition-all duration-150",
                i === activeIdx
                  ? "bg-[rgb(var(--accent-rgb))] text-white shadow-sm"
                  : "border border-[#3c3c3c] text-[#858585] hover:border-[#555] hover:text-[#cccccc]",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 overflow-y-auto p-4">
        {active && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[14px] font-semibold text-[#e8e8e8]">
                {active.title || "Untitled"}
              </h3>
            </div>

            {active.description && (
              <div>
                <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#b0b0b0]">
                  {active.description}
                </p>
              </div>
            )}

            {active.expectedIO.length > 0 && active.expectedIO[0].input && (
              <div>
                <p className={cn(label, "mb-2")}>Examples</p>
                <div className="space-y-2">
                  {active.expectedIO.map((io, i) => (
                    <div
                      key={i}
                      className="rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] p-2.5"
                    >
                      <p className="font-mono text-[11px] text-[#858585]">
                        <span className="text-[#6a9955]">Input:</span> {io.input}
                      </p>
                      <p className="font-mono text-[11px] text-[#858585]">
                        <span className="text-[#6a9955]">Output:</span> {io.output}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active.testCases.length > 0 && active.testCases[0].input && (
              <div>
                <p className={cn(label, "mb-2")}>Test Cases</p>
                <div className="space-y-1.5">
                  {active.testCases.map((tc, i) => (
                    <div
                      key={tc.id}
                      className="flex items-start gap-2 rounded-[6px] border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-2"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3c3c3c] text-[9px] font-bold text-[#858585]">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[11px] text-[#b0b0b0]">{tc.input}</p>
                        <p className="font-mono text-[10px] text-[#6a6a6a]">→ {tc.expectedOutput}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

/* ============ Center — Code Editor ============ */

function EditorPanel({
  canEdit,
  isInterviewer,
}: {
  canEdit: boolean;
  isInterviewer: boolean;
}) {
  const { codeChallenge, updateActiveFileContent, setActiveFile } = useZeMeet();

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#1e1e1e]">
      {/* File tabs */}
      <div className="flex items-center gap-1 border-b border-[#2d2d30] bg-[#252526] px-2">
        {codeChallenge.files.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => setActiveFile(file.id)}
            className={cn(
              "rounded-t-[6px] px-3 py-2 text-[12px] font-medium transition-colors",
              file.id === codeChallenge.activeFileId
                ? "bg-[#1e1e1e] text-white"
                : "text-[#858585] hover:text-[#cccccc]",
            )}
          >
            {file.name}
          </button>
        ))}
      </div>

      {/* Language bar */}
      <div className="flex items-center justify-between border-b border-[#2d2d30] px-3 py-1.5">
        <select
          value={codeChallenge.language}
          disabled={!canEdit && !isInterviewer}
          onChange={() => {}}
          className="rounded-[6px] border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#cccccc] outline-none"
        >
          {codeChallenge.languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <span className={cn("text-[11px]", isInterviewer ? "text-amber-300/90" : "text-[#858585]")}>
          {canEdit ? "Editing" : isInterviewer ? "Observing live" : "View only"}
        </span>
      </div>

      {/* Code textarea */}
      <textarea
        value={codeChallenge.candidateCode}
        onChange={(e) => canEdit && updateActiveFileContent(e.target.value)}
        readOnly={!canEdit}
        spellCheck={false}
        className={cn(
          mono,
          "min-h-0 flex-1 resize-none bg-[#1e1e1e] p-4 text-[13px] leading-[1.7] text-[#d4d4d4] outline-none",
          !canEdit && "cursor-default opacity-95",
        )}
      />
    </section>
  );
}

/* ============ Right — Run / Test Panel ============ */

function RunTestPanel({
  isInterviewer,
  rightTab,
  setRightTab,
}: {
  isInterviewer: boolean;
  rightTab: "output" | "testcases";
  setRightTab: (tab: "output" | "testcases") => void;
}) {
  const { codeChallenge, runCodeTests, updateCodeChallenge } = useZeMeet();

  return (
    <aside
      className={cn(
        panel,
        "flex min-h-0 w-[26%] min-w-[240px] max-w-[340px] shrink-0 flex-col overflow-hidden border-l",
      )}
    >
      {/* Action buttons */}
      <div className="flex items-center gap-2 border-b border-[#2d2d30] px-3 py-2.5">
        <button
          type="button"
          className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-[#3c3c3c] text-[12px] font-medium text-[#cccccc] transition-colors hover:bg-[#2a2a2a]"
          onClick={runCodeTests}
        >
          <Play className="h-3.5 w-3.5 text-[#858585]" strokeWidth={2} />
          Run Code
        </button>
        <button
          type="button"
          className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-emerald-600/90 text-[12px] font-semibold text-white transition-colors hover:bg-emerald-600"
          onClick={runCodeTests}
        >
          <Play className="h-3.5 w-3.5" strokeWidth={2} />
          Run Tests
        </button>
      </div>

      {/* Tabs: Output | Test Cases */}
      <div className="flex border-b border-[#2d2d30]">
        <button
          type="button"
          onClick={() => setRightTab("output")}
          className={cn(
            "flex-1 py-2 text-center text-[11px] font-semibold transition-colors",
            rightTab === "output"
              ? "border-b-2 border-[rgb(var(--accent-rgb))] text-white"
              : "text-[#858585] hover:text-[#cccccc]",
          )}
        >
          Output
        </button>
        <button
          type="button"
          onClick={() => setRightTab("testcases")}
          className={cn(
            "flex-1 py-2 text-center text-[11px] font-semibold transition-colors",
            rightTab === "testcases"
              ? "border-b-2 border-[rgb(var(--accent-rgb))] text-white"
              : "text-[#858585] hover:text-[#cccccc]",
          )}
        >
          Test Cases
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {rightTab === "output" ? (
          <div className="p-3">
            <pre
              className={cn(
                mono,
                "min-h-[120px] whitespace-pre-wrap rounded-[8px] border border-[#3c3c3c] bg-[#0d0d0d] p-3 text-[11px] leading-relaxed text-[#b0b0b0]",
              )}
            >
              {codeChallenge.consoleOutput}
            </pre>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {codeChallenge.testCases.map((t) => (
              <div
                key={t.id}
                className="rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] p-2.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                      t.passed === true && "bg-emerald-500/20 text-emerald-400",
                      t.passed === false && "bg-red-500/20 text-red-400",
                      t.passed === undefined && "bg-[#3c3c3c] text-[#858585]",
                    )}
                  >
                    {t.passed === true ? (
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    ) : t.passed === false ? (
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    ) : (
                      <Circle className="h-2 w-2" />
                    )}
                  </span>
                  <span className="text-[12px] font-medium text-[#cccccc]">
                    {t.label}
                  </span>
                  {t.passed === true && (
                    <span className="ml-auto text-[10px] font-medium text-emerald-400">
                      Passed
                    </span>
                  )}
                  {t.passed === false && (
                    <span className="ml-auto text-[10px] font-medium text-red-400">
                      Failed
                    </span>
                  )}
                </div>
                {t.input && (
                  <p className="mt-1.5 font-mono text-[11px] text-[#858585]">
                    <span className="text-[#6a6a6a]">in:</span> {t.input}
                  </p>
                )}
                {t.expectedOutput && (
                  <p className="font-mono text-[11px] text-[#858585]">
                    <span className="text-[#6a6a6a]">out:</span> {t.expectedOutput}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
}
