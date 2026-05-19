"use client";

import {
  Check,
  Circle,
  Clock,
  Cloud,
  Code2,
  Play,
  Square,
  Users,
} from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { formatChallengeTimer } from "@/lib/zemeet/codeChallenge";
import { ZeMeetVideoPipRail } from "@/components/zemeet/room/ZeMeetVideoPipRail";
import { cn } from "@/lib/utils";

const shell = "bg-[#1e1e1e] text-[#d4d4d4]";
const panel = "border-[#2d2d30] bg-[#252526]";
const label = "text-[10px] font-semibold uppercase tracking-[0.08em] text-[#858585]";
const mono = "font-mono";

export function ZeMeetCodeChallengeWorkspace() {
  const {
    session,
    codeChallenge,
    workspacePanel,
    setWorkspacePanel,
    setEndCodeChallengeOpen,
    runCodeTests,
    submitCodeChallenge,
    updateActiveFileContent,
    openSendCodeChallengeConfirm,
  } = useZeMeet();

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";
  const isCandidate = session.viewerRole === "candidate";
  const canEdit = isCandidate && codeChallenge.candidateEditingEnabled;

  return (
    <div className={cn(shell, "flex h-full min-h-0 flex-1 flex-col overflow-hidden pb-20")}>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#2d2d30] bg-[#252526] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#3c3c3c]">
            <Code2 className="h-4 w-4 text-[#cccccc]" strokeWidth={1.5} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#e8e8e8]">
              {session.context.jobTitle} · {codeChallenge.problemTitle}
            </p>
            <p className="text-[11px] text-[#858585]">Live code challenge</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-[#cccccc]">
            <Clock className="h-3.5 w-3.5 text-[#858585]" strokeWidth={1.5} aria-hidden />
            {formatChallengeTimer(codeChallenge.challengeElapsedSeconds)}
          </span>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-emerald-600/90 px-3 text-[12px] font-semibold text-white hover:bg-emerald-600"
            onClick={runCodeTests}
          >
            <Play className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Run
          </button>
          {isCandidate ? (
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-[8px] border border-[#3c3c3c] px-3 text-[12px] font-medium text-[#cccccc] hover:bg-[#2a2a2a]"
              onClick={submitCodeChallenge}
            >
              Submit
            </button>
          ) : null}
          {isInterviewer ? (
            <>
              <button
                type="button"
                className={cn(
                  "inline-flex h-8 items-center rounded-[8px] border px-3 text-[12px] font-medium",
                  workspacePanel === "questions"
                    ? "border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.15)] text-white"
                    : "border-[#3c3c3c] text-[#cccccc] hover:bg-[#2a2a2a]",
                )}
                onClick={() =>
                  setWorkspacePanel(workspacePanel === "questions" ? "workspace" : "questions")
                }
              >
                Questions
              </button>
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-red-500/40 bg-red-500/15 px-3 text-[12px] font-semibold text-red-300 hover:bg-red-500/25"
                onClick={() => setEndCodeChallengeOpen(true)}
              >
                <Square className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                End Challenge
              </button>
            </>
          ) : null}
          <span className="hidden items-center gap-1 rounded-[8px] border border-[#3c3c3c] px-2 py-1 text-[11px] text-[#858585] sm:inline-flex">
            <Users className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            {session.participants.length}
          </span>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <ProblemPanel readOnly={isCandidate} />

        <EditorPanel canEdit={canEdit} />

        {workspacePanel === "questions" && isInterviewer ? (
          <QuestionsPanel />
        ) : (
          <RightPanel isInterviewer={isInterviewer} />
        )}

        <div className="pointer-events-none absolute bottom-4 right-4 z-20">
          <ZeMeetVideoPipRail />
        </div>
      </div>

      <footer className="relative z-10 flex shrink-0 items-center justify-between border-t border-[#2d2d30] bg-[#252526] px-4 py-2 text-[11px] text-[#858585]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" aria-hidden />
            {session.participants.find((p) => p.id === session.viewerId)?.name ?? "You"}
          </span>
          <span>·</span>
          <span>{codeChallenge.language}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          <span>
            {codeChallenge.autosaveStatus === "saving"
              ? "Saving…"
              : codeChallenge.autosaveStatus === "saved"
                ? "All changes saved"
                : "Ready"}
          </span>
          {!isInterviewer && codeChallenge.status === "invite_pending" ? (
            <button
              type="button"
              className="ml-2 text-[rgb(var(--accent-rgb))] hover:underline"
              onClick={openSendCodeChallengeConfirm}
            >
              Pending request
            </button>
          ) : null}
        </div>
      </footer>
    </div>
  );
}

function ProblemPanel({ readOnly }: { readOnly: boolean }) {
  const { codeChallenge } = useZeMeet();

  return (
    <aside
      className={cn(
        panel,
        "flex min-h-0 w-[min(100%,300px)] shrink-0 flex-col overflow-hidden border-r",
      )}
    >
      <div className="border-b border-[#2d2d30] px-4 py-3">
        <p className={label}>Challenge</p>
        <h2 className="mt-1 text-[15px] font-semibold text-[#e8e8e8]">{codeChallenge.problemTitle}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <section>
          <p className={label}>Problem statement</p>
          <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-[#cccccc]">
            {codeChallenge.problemStatement}
          </p>
        </section>
        {codeChallenge.requirements.length > 0 ? (
          <section>
            <p className={label}>Requirements</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-[#b0b0b0]">
              {codeChallenge.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {codeChallenge.userStories.length > 0 ? (
          <section>
            <p className={label}>User stories</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-[#b0b0b0]">
              {codeChallenge.userStories.map((s) => (
                <li key={s} className="rounded-[6px] bg-[#1e1e1e] px-2.5 py-1.5">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {codeChallenge.examples.length > 0 ? (
          <section>
            <p className={label}>Examples</p>
            <div className="mt-2 space-y-2">
              {codeChallenge.examples.map((ex, i) => (
                <div key={i} className="rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] p-2.5 text-[12px]">
                  <p className="text-[#858585]">Input</p>
                  <p className="mt-0.5 font-mono text-[#dcdcaa]">{ex.input}</p>
                  <p className="mt-2 text-[#858585]">Output</p>
                  <p className="mt-0.5 font-mono text-[#4ec9b0]">{ex.output}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
        {codeChallenge.constraints.length > 0 ? (
          <section>
            <p className={label}>Constraints</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-[#b0b0b0]">
              {codeChallenge.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <section>
          <p className={label}>Test instructions</p>
          <p className="mt-2 text-[13px] text-[#b0b0b0]">{codeChallenge.testCaseInstructions}</p>
        </section>
        {readOnly ? (
          <p className="text-[11px] text-[#6a6a6a]">Problem is read-only for the candidate.</p>
        ) : null}
      </div>
    </aside>
  );
}

function EditorPanel({ canEdit }: { canEdit: boolean }) {
  const { codeChallenge, updateActiveFileContent, setActiveFile, session } = useZeMeet();
  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-r border-[#2d2d30] bg-[#1e1e1e]">
      <div className="flex items-center gap-1 border-b border-[#2d2d30] bg-[#252526] px-2">
        {codeChallenge.files.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => setActiveFile(file.id)}
            className={cn(
              "rounded-t-[6px] px-3 py-2 text-[12px] font-medium",
              file.id === codeChallenge.activeFileId
                ? "bg-[#1e1e1e] text-[#ffffff]"
                : "text-[#858585] hover:text-[#cccccc]",
            )}
          >
            {file.name}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between border-b border-[#2d2d30] px-3 py-1.5">
        <select
          value={codeChallenge.language}
          disabled={!canEdit && !isInterviewer}
          onChange={(e) => {
            /* language switch demo */
          }}
          className="rounded-[6px] border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#cccccc] outline-none"
        >
          {codeChallenge.languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <span className="text-[11px] text-[#858585]">
          {canEdit ? "Editing" : isInterviewer ? "Observing live" : "View only"}
        </span>
      </div>
      <textarea
        value={codeChallenge.candidateCode}
        onChange={(e) => canEdit && updateActiveFileContent(e.target.value)}
        readOnly={!canEdit}
        spellCheck={false}
        className={cn(
          mono,
          "min-h-0 flex-1 resize-none bg-[#1e1e1e] p-4 text-[13px] leading-relaxed text-[#d4d4d4] outline-none",
          !canEdit && "cursor-default opacity-95",
        )}
      />
    </section>
  );
}

function RightPanel({ isInterviewer }: { isInterviewer: boolean }) {
  const { codeChallenge, runCodeTests, updateCodeChallenge } = useZeMeet();

  return (
    <aside className={cn(panel, "flex min-h-0 w-[min(100%,320px)] shrink-0 flex-col overflow-hidden border-l")}>
      <div className="border-b border-[#2d2d30] px-4 py-3">
        <p className={label}>Test results & console</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <section>
          <p className={label}>Test cases</p>
          <ul className="mt-2 space-y-1.5">
            {codeChallenge.testCases.map((t) => (
              <li
                key={t.id}
                className="rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-2 text-[12px]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full",
                      t.passed === true && "bg-emerald-500/20 text-emerald-400",
                      t.passed === false && "bg-red-500/20 text-red-400",
                      t.passed === undefined && "bg-[#3c3c3c] text-[#858585]",
                    )}
                  >
                    {t.passed === true ? <Check className="h-2.5 w-2.5" /> : null}
                  </span>
                  <span className="font-medium text-[#cccccc]">{t.label}</span>
                </div>
                {t.input ? (
                  <p className="mt-1 font-mono text-[11px] text-[#858585]">in: {t.input}</p>
                ) : null}
                {t.expectedOutput ? (
                  <p className="font-mono text-[11px] text-[#858585]">out: {t.expectedOutput}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-3 text-[12px] font-medium text-[rgb(var(--accent-rgb))] hover:underline"
            onClick={runCodeTests}
          >
            Run all tests
          </button>
        </section>
        <section>
          <p className={label}>Console</p>
          <pre className="mt-2 max-h-[140px] overflow-auto rounded-[8px] border border-[#3c3c3c] bg-[#0d0d0d] p-3 font-mono text-[11px] leading-relaxed text-[#b0b0b0]">
            {codeChallenge.consoleOutput}
          </pre>
        </section>
        {isInterviewer ? (
          <section>
            <p className={label}>Interviewer observations (private)</p>
            <textarea
              value={codeChallenge.interviewerObservations}
              onChange={(e) =>
                updateCodeChallenge({ interviewerObservations: e.target.value })
              }
              rows={4}
              placeholder="Live observations — candidate cannot see"
              className="mt-2 w-full resize-none rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] p-2.5 text-[12px] text-[#cccccc] outline-none focus:ring-1 focus:ring-[rgb(var(--accent-rgb)/0.4)]"
            />
          </section>
        ) : null}
      </div>
    </aside>
  );
}

function QuestionsPanel() {
  const {
    codeChallenge,
    questionPool,
    selectPoolQuestion,
    updateCodeChallenge,
    toggleCandidateEditing,
    setWorkspacePanel,
  } = useZeMeet();

  return (
    <aside className={cn(panel, "flex min-h-0 w-[min(100%,380px)] shrink-0 flex-col overflow-hidden border-l")}>
      <div className="flex items-center justify-between border-b border-[#2d2d30] px-4 py-3">
        <p className={label}>Questions · interviewer only</p>
        <button
          type="button"
          className="text-[12px] text-[rgb(var(--accent-rgb))] hover:underline"
          onClick={() => setWorkspacePanel("workspace")}
        >
          Back to workspace
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <section>
          <p className={label}>Question pool</p>
          <div className="mt-2 space-y-1.5">
            {questionPool.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => selectPoolQuestion(q.id)}
                className={cn(
                  "w-full rounded-[8px] border px-3 py-2 text-left text-[12px] transition-colors",
                  codeChallenge.selectedQuestionId === q.id
                    ? "border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.12)] text-white"
                    : "border-[#3c3c3c] text-[#b0b0b0] hover:bg-[#2a2a2a]",
                )}
              >
                {q.title}
              </button>
            ))}
          </div>
        </section>
        <section>
          <p className={label}>Title</p>
          <input
            value={codeChallenge.problemTitle}
            onChange={(e) => updateCodeChallenge({ problemTitle: e.target.value })}
            className="mt-1.5 w-full rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-2 text-[13px] text-[#e8e8e8] outline-none"
          />
        </section>
        <section>
          <p className={label}>Problem statement</p>
          <textarea
            value={codeChallenge.problemStatement}
            onChange={(e) => updateCodeChallenge({ problemStatement: e.target.value })}
            rows={5}
            className="mt-1.5 w-full resize-none rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] p-2.5 text-[13px] text-[#cccccc] outline-none"
          />
        </section>
        <section>
          <p className={label}>Private interviewer notes</p>
          <textarea
            value={codeChallenge.interviewerNotes}
            onChange={(e) => updateCodeChallenge({ interviewerNotes: e.target.value })}
            rows={3}
            className="mt-1.5 w-full resize-none rounded-[8px] border border-[#3c3c3c] bg-[#1e1e1e] p-2.5 text-[12px] text-[#b0b0b0] outline-none"
          />
        </section>
        <label className="flex items-center gap-2 text-[12px] text-[#b0b0b0]">
          <input
            type="checkbox"
            checked={codeChallenge.candidateEditingEnabled}
            onChange={toggleCandidateEditing}
            className="rounded border-[#3c3c3c]"
          />
          Allow candidate to edit code
        </label>
        <p className="text-[11px] text-[#6a6a6a]">
          Edit the challenge before sending. The candidate only sees the final version after accepting.
        </p>
      </div>
    </aside>
  );
}
