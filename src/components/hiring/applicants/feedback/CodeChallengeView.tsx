"use client";

import { cn } from "@/lib/utils";
import type { ZeMeetCodeChallengeArtifact } from "@/lib/zemeet/types";
import { getStoredCodeChallengeArtifact } from "@/lib/zemeet/sync";
import { SidebarCard } from "./FeedbackUi";
import { dashboardPanel } from "@/components/dashboard/dashboardTokens";

export function CodeChallengeView({
  data,
  interviewId,
}: {
  data: { question: string; code: string };
  interviewId?: string;
}) {
  const stored = interviewId ? getStoredCodeChallengeArtifact(interviewId) : undefined;
  const artifact: ZeMeetCodeChallengeArtifact | null = stored ?? (data.code
    ? {
        questionTitle: data.question,
        problemStatement: data.question,
        candidateCode: data.code,
        language: "TypeScript",
        testResults: [],
        consoleOutput: "",
        durationSeconds: 0,
        interviewerNotes: "",
        interviewerObservations: "",
        finalStatus: "completed",
      }
    : null);

  if (!artifact) {
    return (
      <p className="text-[13px] text-[#71717A]">No code challenge recorded for this interview.</p>
    );
  }

  const passed = artifact.testResults.filter((t) => t.passed === true).length;
  const total = artifact.testResults.length;

  return (
    <div className="grid min-w-0 gap-3 lg:grid-cols-2">
      <SidebarCard title="Challenge" className="min-h-[280px] lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="Title" value={artifact.questionTitle} />
          <Meta label="Language" value={artifact.language} />
          <Meta
            label="Duration"
            value={
              artifact.durationSeconds
                ? `${Math.floor(artifact.durationSeconds / 60)}m ${artifact.durationSeconds % 60}s`
                : "—"
            }
          />
          <Meta label="Status" value={artifact.finalStatus} />
          {artifact.startedAt ? <Meta label="Started" value={formatWhen(artifact.startedAt)} /> : null}
          {artifact.endedAt ? <Meta label="Ended" value={formatWhen(artifact.endedAt)} /> : null}
          <Meta label="Tests" value={total ? `${passed}/${total} passed` : "—"} />
        </div>
        <p className="mt-4 whitespace-pre-wrap text-[13px] leading-relaxed text-[#3F3F46]">
          {artifact.problemStatement}
        </p>
      </SidebarCard>

      <SidebarCard title="Candidate solution" className="min-h-[320px]">
        <pre
          className={cn(
            dashboardPanel,
            "max-h-[min(480px,55vh)] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-[#3F3F46]",
          )}
        >
          {artifact.candidateCode || "// No submission"}
        </pre>
      </SidebarCard>

      <SidebarCard title="Test results & console" className="min-h-[320px]">
        <ul className="space-y-1.5 text-[13px] text-[#52525B]">
          {artifact.testResults.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  t.passed === true && "bg-emerald-500",
                  t.passed === false && "bg-red-500",
                  t.passed === undefined && "bg-[#D4D4D8]",
                )}
              />
              {t.label}
            </li>
          ))}
        </ul>
        {artifact.consoleOutput ? (
          <pre className="mt-4 max-h-40 overflow-auto rounded-[10px] bg-[#F4F4F5] p-3 font-mono text-[11px] text-[#52525B]">
            {artifact.consoleOutput}
          </pre>
        ) : null}
        {artifact.interviewerNotes ? (
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA]">
              Interviewer notes
            </p>
            <p className="mt-1 text-[13px] text-[#52525B]">{artifact.interviewerNotes}</p>
          </div>
        ) : null}
        {artifact.interviewerObservations ? (
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA]">
              Observations
            </p>
            <p className="mt-1 text-[13px] text-[#52525B]">{artifact.interviewerObservations}</p>
          </div>
        ) : null}
      </SidebarCard>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A1A1AA]">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium text-[#18181B]">{value}</p>
    </div>
  );
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
