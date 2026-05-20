"use client";

import {
  Briefcase,
  Calendar,
  Clock,
  FileText,
  MoreHorizontal,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AssessmentScheduleRecord } from "@/lib/hiring/assessments/scheduleTypes";
import { hiringTransition } from "../hiringTokens";
import { ScheduleStatusPill } from "./ScheduleStatusPill";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" aria-hidden>
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 0 1 2.063-2.063 2.062 2.062 0 0 1 2.063 2.063 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

const menuContent = cn(
  "z-[80] w-[220px] overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-white p-1",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12)]",
);

const menuItem = "cursor-pointer rounded-[6px] px-2 py-1.5 text-[12px] font-medium";

export function AssessmentScheduleRow({
  schedule,
  onOpenReport,
}: {
  schedule: AssessmentScheduleRecord;
  onOpenReport: () => void;
}) {
  const initials = schedule.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const linkedinHref = schedule.linkedin
    ? schedule.linkedin.startsWith("http")
      ? schedule.linkedin
      : `https://${schedule.linkedin}`
    : null;

  const showScore = schedule.score != null;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpenReport}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenReport();
        }
      }}
      className={cn(
        "group grid cursor-pointer gap-3 border-b border-[rgba(15,23,42,0.05)] px-4 py-3.5 transition-all duration-200",
        "hover:bg-[rgba(var(--accent-rgb),0.03)] dark:border-white/[0.05]",
        schedule.malpracticeSignals.length > 0 && "bg-violet-500/[0.02]",
      )}
      style={{
        gridTemplateColumns:
          "minmax(200px,1.1fr) minmax(160px,0.9fr) minmax(140px,0.8fr) auto minmax(100px,0.6fr) minmax(88px,0.5fr) minmax(72px,0.4fr) 40px",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.06)] bg-white text-[11px] font-semibold text-[#3F3F46] dark:bg-white/[0.04]">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text">{schedule.name}</p>
          <p className="truncate text-[12px] text-muted">{schedule.email}</p>
          <div className="mt-1 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {linkedinHref ? (
              <a
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] border border-[rgba(15,23,42,0.06)] bg-white hover:bg-[#F8FAFC]"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            ) : null}
            {schedule.resumeUrl ? (
              <a
                href={schedule.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] border border-[rgba(15,23,42,0.06)] bg-white text-muted hover:text-text"
                aria-label="Resume"
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-[13px] font-medium text-text">{schedule.assessmentName}</p>
        <p className="flex items-center gap-1 text-[11px] text-muted">
          <Briefcase className="h-3 w-3 shrink-0" strokeWidth={1.75} />
          {schedule.role}
        </p>
        <p className="flex items-center gap-1 text-[11px] text-muted">
          <Clock className="h-3 w-3 shrink-0" strokeWidth={1.75} />
          {schedule.durationMinutes} min
        </p>
      </div>

      <div className="min-w-0 space-y-0.5 text-[11px] text-muted">
        <p>
          <span className="text-text-secondary/70">Invite </span>
          {schedule.inviteSentAt}
        </p>
        <p>
          <span className="text-text-secondary/70">Expires </span>
          {schedule.expiryDate}
        </p>
        <p className="flex items-center gap-1">
          <Calendar className="h-3 w-3 shrink-0" strokeWidth={1.75} />
          {schedule.attemptWindow}
        </p>
      </div>

      <div className="flex items-center">
        <ScheduleStatusPill status={schedule.status} />
      </div>

      <div className="min-w-[100px] space-y-1.5">
        <div className="flex items-center justify-between text-[11px] tabular-nums text-muted">
          <span>Progress</span>
          <span className="font-semibold text-text">{schedule.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--accent-rgb)),rgb(var(--hero-gradient-to-rgb)))] transition-all duration-500"
            style={{ width: `${schedule.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 content-start">
        {schedule.malpracticeSignals.length > 0 ? (
          schedule.malpracticeSignals.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-0.5 rounded-full border border-violet-400/20 bg-violet-500/[0.06] px-2 py-0.5 text-[10px] font-medium text-violet-800 dark:text-violet-200"
            >
              <ShieldAlert className="h-2.5 w-2.5" strokeWidth={2} />
              {s}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-muted/60">—</span>
        )}
      </div>

      <div className="text-right">
        {showScore ? (
          <div>
            <p className="text-[14px] font-semibold tabular-nums text-text">{schedule.score}%</p>
            <p
              className={cn(
                "text-[10px] font-semibold",
                schedule.qualified ? "text-emerald-600" : schedule.qualified === false ? "text-red-600" : "text-muted",
              )}
            >
              {schedule.qualified ? "Qualified" : schedule.qualified === false ? "Not qualified" : "Pending"}
            </p>
          </div>
        ) : (
          <span className="text-[12px] text-muted">—</span>
        )}
      </div>

      <div className="flex items-start justify-end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-[9px] border-[rgba(15,23,42,0.06)] p-0 shadow-none"
              aria-label="Row actions"
            >
              <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={menuContent}>
            {[
              "Extend Time",
              "Resend Invite",
              "Disable Attempt",
              "Reset Attempt",
              "Send Reminder",
              "Copy Invite Link",
            ].map((label) => (
              <DropdownMenuItem key={label} className={menuItem} onSelect={() => toast.message(`${label} (demo)`)}>
                {label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className={menuItem} onSelect={onOpenReport}>
              View Report
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(menuItem, "text-red-600 focus:text-red-600")}
              onSelect={() => toast.message("Remove candidate (demo)")}
            >
              Remove Candidate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
