"use client";

import { cn } from "@/lib/utils";
import type { AssessmentCandidateStatus } from "@/lib/hiring/assessments/types";

const STYLES: Record<AssessmentCandidateStatus, string> = {
  Pending:
    "border-slate-500/15 bg-slate-500/[0.07] text-slate-700 dark:border-slate-400/20 dark:bg-slate-400/10 dark:text-slate-300",
  Attempted:
    "border-sky-500/15 bg-sky-500/[0.07] text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300",
  Qualified:
    "border-emerald-500/15 bg-emerald-500/[0.08] text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  "Not Qualified":
    "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] text-[#71717A] dark:border-white/[0.08] dark:bg-white/[0.04]",
  Expired:
    "border-amber-500/15 bg-amber-500/[0.08] text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
  "Malpractice Detected":
    "border-violet-500/20 bg-violet-500/[0.08] text-violet-900 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-200",
};

export function AssessmentCandidateStatusPill({
  status,
  className,
}: {
  status: AssessmentCandidateStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight",
        STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

export function QualifiedPill({ qualified }: { qualified: boolean | null }) {
  if (qualified == null) return null;
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        qualified
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-[rgba(15,23,42,0.08)] bg-black/[0.03] text-muted",
      )}
    >
      {qualified ? "Qualified" : "Not qualified"}
    </span>
  );
}
