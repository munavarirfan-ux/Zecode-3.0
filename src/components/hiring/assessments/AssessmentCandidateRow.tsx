"use client";

import {
  AlertCircle,
  Clock,
  FileType2,
  Link2,
  MoreHorizontal,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AssessmentCandidateRecord } from "@/lib/hiring/assessments/types";
import { cn } from "@/lib/utils";
import { hiringTransition } from "../hiringTokens";
import {
  AssessmentCardMenuItem,
  AssessmentCardMenuSeparator,
  assessmentCardMenuContentClass,
} from "./assessmentCardMenu";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 0 1 2.063-2.063 2.062 2.062 0 0 1 2.063 2.063 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function rowStateClass(candidate: AssessmentCandidateRecord) {
  if (candidate.status === "Qualified") {
    return "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07] dark:bg-emerald-400/[0.06]";
  }
  if (candidate.status === "Not Qualified") {
    return "bg-[rgba(15,23,42,0.02)] hover:bg-red-500/[0.03] dark:bg-white/[0.02]";
  }
  if (candidate.status === "Malpractice Detected" || candidate.malpracticeSignals.length > 0) {
    return "bg-violet-500/[0.04] hover:bg-violet-500/[0.07] dark:bg-violet-400/[0.06]";
  }
  return "hover:bg-[rgba(var(--accent-rgb),0.03)]";
}

function compactStatusLabel(status: AssessmentCandidateRecord["status"]) {
  if (status === "Malpractice Detected") return "Flagged";
  return status;
}

function malpracticeShort(signal: string) {
  if (signal.includes("Tab")) return "Tab switch";
  if (signal.includes("Camera")) return "Camera";
  if (signal.includes("Face")) return "Face missing";
  if (signal.includes("Copy")) return "Copy";
  return signal.split(" ")[0];
}

const iconBtn = cn(
  "h-8 w-8 shrink-0 rounded-[9px] border border-[rgba(15,23,42,0.06)] bg-white px-0",
  hiringTransition,
  "hover:border-[rgba(15,23,42,0.1)] hover:bg-[#F8FAFC] dark:bg-surface",
);

export function AssessmentCandidateRow({
  candidate,
  onOpenReport,
}: {
  candidate: AssessmentCandidateRecord;
  onOpenReport: () => void;
}) {
  const initials = candidate.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const linkedinHref = candidate.linkedin
    ? candidate.linkedin.startsWith("http")
      ? candidate.linkedin
      : `https://${candidate.linkedin}`
    : null;

  return (
    <tr
      className={cn(
        "group cursor-pointer border-b border-[rgba(15,23,42,0.05)]",
        hiringTransition,
        rowStateClass(candidate),
        "dark:border-white/[0.05]",
      )}
      onClick={onOpenReport}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenReport();
        }
      }}
    >
      <td className="px-4 py-2.5">
        <div className="flex min-w-[200px] items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.06)] bg-white text-[11px] font-semibold text-[#3F3F46] dark:bg-white/[0.04]">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text">{candidate.name}</p>
            <p className="truncate text-[12px] text-muted">{candidate.email}</p>
          </div>
        </div>
      </td>
      <td className="hidden px-3 py-2.5 sm:table-cell">
        <span
          className={cn(
            "text-[11px] font-semibold",
            candidate.status === "Qualified" && "text-emerald-700 dark:text-emerald-400",
            candidate.status === "Not Qualified" && "text-muted",
            (candidate.status === "Malpractice Detected" || candidate.malpracticeSignals.length > 0) &&
              "text-violet-700 dark:text-violet-300",
            candidate.status === "Pending" && "text-text-secondary",
          )}
        >
          {compactStatusLabel(candidate.status)}
        </span>
      </td>
      <td className="hidden px-3 py-2.5 text-[12px] tabular-nums text-muted md:table-cell">
        {candidate.attemptedAt ?? "—"}
      </td>
      <td className="hidden px-3 py-2.5 text-[12px] tabular-nums text-muted lg:table-cell">
        {candidate.durationMinutes != null ? `${candidate.durationMinutes}m` : "—"}
      </td>
      <td className="hidden px-3 py-2.5 xl:table-cell">
        {candidate.malpracticeSignals.length > 0 ? (
          <span className="inline-flex max-w-[120px] truncate rounded-full border border-violet-500/15 bg-violet-500/[0.06] px-2 py-0.5 text-[10px] font-medium text-violet-800 dark:text-violet-200">
            {malpracticeShort(candidate.malpracticeSignals[0])}
          </span>
        ) : (
          <span className="text-[12px] text-muted/50">—</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-right">
        <span className="text-[13px] font-semibold tabular-nums text-text">
          {candidate.score != null ? `${candidate.score}%` : "—"}
        </span>
      </td>
      <td className="px-2 py-2.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          {linkedinHref ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="outline" size="sm" className={iconBtn}>
                  <a href={linkedinHref} target="_blank" rel="noopener noreferrer" aria-label="Open LinkedIn">
                    <LinkedInIcon />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open LinkedIn</TooltipContent>
            </Tooltip>
          ) : (
            <Button type="button" variant="outline" size="sm" className={iconBtn} disabled aria-label="LinkedIn unavailable">
              <LinkedInIcon />
            </Button>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={iconBtn}
                disabled={!candidate.resumeUrl}
                onClick={() => {
                  if (candidate.resumeUrl) toast.message("Opening resume (demo)");
                }}
              >
                <FileType2 className="h-4 w-4 text-muted" strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View resume</TooltipContent>
          </Tooltip>
        </div>
      </td>
      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm" className={iconBtn} aria-label="Candidate actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={assessmentCardMenuContentClass}>
            <AssessmentCardMenuItem icon={Link2} label="Share candidate report" onSelect={() => toast.message("Share report (demo)")} />
            <AssessmentCardMenuItem icon={Clock} label="Extend assessment time" onSelect={() => toast.message("Extended (demo)")} />
            <AssessmentCardMenuItem icon={AlertCircle} label="Resend assessment email" onSelect={() => toast.success("Invite resent")} />
            <AssessmentCardMenuItem icon={Link2} label="Copy invite link" onSelect={() => toast.success("Link copied")} />
            <AssessmentCardMenuSeparator />
            <AssessmentCardMenuItem icon={ShieldAlert} label="Disable access" onSelect={() => toast.message("Disabled (demo)")} />
            <AssessmentCardMenuItem icon={MoreHorizontal} label="Remove candidate" destructive onSelect={() => toast.message("Removed (demo)")} />
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
