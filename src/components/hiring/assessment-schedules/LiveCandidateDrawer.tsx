"use client";

import { ExternalLink, FileText, Linkedin, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/lib/hiring/assessments/liveMonitoringData";
import type { LiveCandidateSession } from "@/lib/hiring/assessments/liveMonitoringTypes";
import { cn } from "@/lib/utils";
import { AssessmentModalDrawer } from "../assessments/AssessmentModalDrawer";

function runAction(label: string) {
  toast.message(`${label} (demo)`);
}

export function LiveCandidateDrawer({
  candidate,
  open,
  onOpenChange,
}: {
  candidate: LiveCandidateSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!candidate) return null;

  const linkedinHref = candidate.linkedin
    ? candidate.linkedin.startsWith("http")
      ? candidate.linkedin
      : `https://${candidate.linkedin}`
    : null;

  const flagged = candidate.status === "flagged";

  return (
    <AssessmentModalDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={candidate.name}
      description={candidate.email}
      className="max-w-[420px]"
      footer={
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="flex-1 rounded-[10px]" onClick={() => runAction("Warn")}>
            Warn
          </Button>
          <Button type="button" variant="outline" className="flex-1 rounded-[10px]" onClick={() => runAction("Extend time")}>
            Extend time
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-[10px] border-red-400/30 text-red-700 hover:bg-red-500/10"
            onClick={() => runAction("Terminate")}
          >
            Terminate
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
              flagged
                ? "border-red-400/30 bg-red-500/10 text-red-800"
                : candidate.status === "idle"
                  ? "border-amber-400/25 bg-amber-500/10 text-amber-900"
                  : "border-emerald-400/25 bg-emerald-500/10 text-emerald-800",
            )}
          >
            {statusLabel(candidate.status)}
          </span>
          <span className="rounded-full border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-2.5 py-0.5 text-[11px] font-medium text-muted">
            {candidate.progressPercent}% complete
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {linkedinHref ? (
            <Button type="button" variant="outline" size="sm" className="gap-1.5 rounded-[10px]" asChild>
              <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            </Button>
          ) : null}
          {candidate.resumeUrl ? (
            <Button type="button" variant="outline" size="sm" className="gap-1.5 rounded-[10px]" asChild>
              <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-3.5 w-3.5" />
                Resume
              </a>
            </Button>
          ) : null}
        </div>

        <div className="rounded-[12px] border border-[rgba(var(--accent-rgb),0.12)] bg-[rgba(var(--accent-rgb),0.05)] px-3 py-2.5">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-text">
            <Timer className="h-4 w-4 text-[rgb(var(--accent-rgb))]" strokeWidth={1.75} />
            {candidate.remainingMinutes} minutes remaining
          </p>
          <p className="mt-1 text-[12px] text-muted">
            Question {candidate.currentQuestion} of {candidate.totalQuestions}
          </p>
        </div>

        {candidate.warnings.length > 0 ? (
          <div className="rounded-[12px] border border-red-400/20 bg-red-500/[0.04] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-red-700">Warnings</p>
            <ul className="mt-2 space-y-1 text-[12px] text-red-800">
              {candidate.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Event log</p>
          <ul className="mt-2 space-y-2">
            {candidate.eventLog.map((e, i) => (
              <li key={i} className="flex gap-2 text-[12px]">
                <span className="shrink-0 tabular-nums text-muted">{e.at}</span>
                <span className="text-text-secondary">{e.message}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] p-3 dark:bg-white/[0.03]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Device info</p>
          <ul className="mt-2 space-y-1 text-[12px] text-text-secondary">
            <li>
              {candidate.deviceInfo.browser} · {candidate.deviceInfo.os}
            </li>
            <li className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3 opacity-50" />
              {candidate.deviceInfo.ip} · {candidate.deviceInfo.resolution}
            </li>
          </ul>
        </div>
      </div>
    </AssessmentModalDrawer>
  );
}
