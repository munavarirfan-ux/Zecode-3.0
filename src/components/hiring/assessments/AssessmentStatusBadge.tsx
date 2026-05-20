import { cn } from "@/lib/utils";
import type { AssessmentLifecycleStatus } from "@/lib/hiring/assessments/types";

const STYLES: Record<AssessmentLifecycleStatus, string> = {
  Ongoing:
    "border-emerald-500/12 bg-emerald-500/[0.07] text-emerald-800/90 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90",
  Completed:
    "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] text-text-secondary/80 dark:border-white/[0.08] dark:bg-white/[0.04]",
  Draft:
    "border-amber-500/14 bg-amber-500/[0.08] text-amber-900/80 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300/90",
};

export function AssessmentStatusBadge({ status }: { status: AssessmentLifecycleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.03em]",
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
