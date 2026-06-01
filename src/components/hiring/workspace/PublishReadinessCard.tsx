"use client";

import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HiringJob } from "@/lib/hiring/types";
import {
  getJobHiringTeamForJob,
  isHiringTeamComplete,
  TEAM_UPDATED_EVENT,
  type JobHiringTeamGroups,
} from "@/lib/hiring/jobHiringTeam";
import { overviewGlassCard } from "../hiringTokens";

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          done
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
            : "border-2 border-[rgba(15,23,42,0.12)] text-transparent dark:border-white/[0.12]",
        )}
        aria-hidden
      >
        {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <Circle className="h-3 w-3" />}
      </span>
      <span
        className={cn(
          "text-[13px]",
          done
            ? "font-medium text-[#18181B] line-through opacity-55 dark:text-text"
            : "font-medium text-[#18181B] dark:text-text",
        )}
      >
        {label}
      </span>
    </li>
  );
}

export function PublishReadinessCard({ job }: { job: HiringJob }) {
  const [team, setTeam] = useState<JobHiringTeamGroups>(() => getJobHiringTeamForJob(job));

  useEffect(() => {
    const refresh = () => setTeam(getJobHiringTeamForJob(job));
    refresh();
    window.addEventListener(TEAM_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(TEAM_UPDATED_EVENT, refresh);
  }, [job]);

  const hasRecruiter = team.recruiters.length >= 1;
  const hasHiringManager = team.hiringManagers.length >= 1;
  const hasPanelMember = team.panelMembers.length >= 1;
  const allDone = isHiringTeamComplete(team);

  return (
    <section
      className={cn(
        overviewGlassCard,
        "border-amber-200/60 bg-amber-50/60 dark:border-amber-400/20 dark:bg-amber-400/[0.05]",
      )}
      aria-label="Publish readiness"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#18181B] dark:text-text">
            {allDone ? "Ready to publish" : "Complete setup to publish this job"}
          </h3>
          <p className="mt-0.5 text-[12px] text-[#71717A] dark:text-muted">
            {allDone
              ? "All required team members are assigned. Use the Publish Job button above."
              : "Required hiring team members must be assigned before you can publish."}
          </p>
        </div>
        {allDone ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            <Check className="h-3 w-3" strokeWidth={2.5} />
            Ready
          </span>
        ) : null}
      </div>

      <ul className="mt-4 space-y-2.5">
        <ChecklistItem done label="Job details completed" />
        <ChecklistItem done={hasRecruiter} label="Recruiter assigned" />
        <ChecklistItem done={hasHiringManager} label="Hiring manager assigned" />
        <ChecklistItem done={hasPanelMember} label="Panel member added" />
      </ul>
    </section>
  );
}
