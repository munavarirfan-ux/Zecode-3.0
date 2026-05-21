"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";
import type { ScheduledAssessmentRecord } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { cn } from "@/lib/utils";
import { ScheduledAssessmentStatusPill } from "./ScheduledAssessmentStatusPill";
import { assessmentCardMenuContentClass } from "../assessments/assessmentCardMenu";

export function ScheduledAssessmentListRow({ record }: { record: ScheduledAssessmentRecord }) {
  const router = useRouter();
  const href = ROUTES.scheduleScheduledDetail(record.id);
  const open = () => router.push(href);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className={cn(
        "grid cursor-pointer grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)_minmax(0,0.7fr)_minmax(0,0.65fr)_minmax(0,0.55fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,0.7fr)_auto] items-center gap-2",
        "border-b border-[rgba(15,23,42,0.05)] px-3 py-2.5 text-[12px] hover:bg-[#FAFAFB] dark:hover:bg-white/[0.02]",
      )}
    >
      <span className="min-w-0 font-semibold text-text">{record.assessmentName}</span>
      <span className="truncate text-muted">{record.role}</span>
      <span className="text-text-secondary/85">{record.scheduledDate}</span>
      <span className="text-text-secondary/85">{record.scheduledTime}</span>
      <span className="tabular-nums text-right font-medium text-text">{record.candidatesInvited}</span>
      <span className="text-[11px] font-medium text-text-secondary/85">{record.instructionEmailLabel}</span>
      <span className="line-clamp-1 text-[11px] text-muted">{record.reminderStatusLabel}</span>
      <ScheduledAssessmentStatusPill status={record.status} />
      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-[10px] p-0">
              <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={assessmentCardMenuContentClass}>
            <DropdownMenuItem className="text-[12px]" onSelect={open}>
              Open schedule
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[12px]" onSelect={() => toast.message("Resend instruction (demo)")}>
              Resend instruction email
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[12px]" onSelect={() => toast.message("Send reminder (demo)")}>
              Send reminder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[12px]" onSelect={() => toast.message("Cancel assessment (demo)")}>
              Cancel assessment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
