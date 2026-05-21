"use client";

import { Link2, Mail, MoreHorizontal, Send, Timer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ScheduledAssessmentCandidate } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { cn } from "@/lib/utils";
import { hiringTransition } from "../hiringTokens";
import {
  AssessmentCardMenuItem,
  AssessmentCardMenuSeparator,
  assessmentCardMenuContentClass,
} from "../assessments/assessmentCardMenu";

const TD = "px-3 py-2.5 text-[12px]";

export function ScheduledCandidateRow({
  candidate,
  shareLink,
  onRemove,
}: {
  candidate: ScheduledAssessmentCandidate;
  shareLink: string;
  onRemove: () => void;
}) {
  const initials = candidate.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const copyLink = () => {
    void navigator.clipboard.writeText(shareLink);
    toast.success("Assessment link copied");
  };

  return (
    <tr className={cn("border-b border-[rgba(15,23,42,0.05)]", hiringTransition, "hover:bg-[rgba(var(--accent-rgb),0.03)]")}>
      <td className={cn(TD, "pl-4")}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--accent-rgb)/0.1)] text-[11px] font-semibold text-[rgb(var(--accent-rgb))]">
            {initials}
          </span>
          <span className="font-semibold text-text">{candidate.name}</span>
        </div>
      </td>
      <td className={cn(TD, "text-muted")}>{candidate.email}</td>
      <td className={cn(TD, "text-text-secondary/85")}>{candidate.inviteStatus}</td>
      <td className={cn(TD, "text-text-secondary/85")}>{candidate.instructionMailStatus}</td>
      <td className={cn(TD, "text-text-secondary/85")}>{candidate.reminderStatus}</td>
      <td className={cn(TD, "text-text-secondary/85")}>{candidate.assessmentStatus}</td>
      <td className={cn(TD, "text-muted")}>{candidate.attemptedDate ?? "—"}</td>
      <td className={cn(TD, "tabular-nums font-medium text-text")}>
        {candidate.score != null ? candidate.score : "—"}
      </td>
      <td className={cn(TD, "pr-2")}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-[10px] p-0">
              <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={assessmentCardMenuContentClass}>
            <AssessmentCardMenuItem
              icon={Mail}
              label="Resend instruction email"
              onSelect={() => toast.message("Instruction resent (demo)")}
            />
            <AssessmentCardMenuItem
              icon={Send}
              label="Send reminder"
              onSelect={() => toast.message("Reminder sent (demo)")}
            />
            <AssessmentCardMenuItem
              icon={Timer}
              label="Extend expiry"
              onSelect={() => toast.message("Expiry extended (demo)")}
            />
            <AssessmentCardMenuItem icon={Link2} label="Copy assessment link" onSelect={copyLink} />
            <AssessmentCardMenuSeparator />
            <AssessmentCardMenuItem icon={Trash2} label="Remove candidate" destructive onSelect={onRemove} />
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
