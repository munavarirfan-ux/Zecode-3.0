"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, CalendarClock, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";
import { EXPIRY_WINDOW_OPTIONS } from "@/lib/hiring/assessments/scheduledAssessmentsData";
import type { ScheduledAssessmentRecord } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { hiringCard, hiringTransition } from "../hiringTokens";
import { ScheduledAssessmentStatusPill } from "./ScheduledAssessmentStatusPill";
import { assessmentCardMenuContentClass } from "../assessments/assessmentCardMenu";

const accentBar =
  "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-[rgb(var(--accent-rgb))] before:shadow-[2px_0_12px_rgba(var(--accent-rgb),0.28)] before:content-['']";

export function ScheduledAssessmentCard({ record }: { record: ScheduledAssessmentRecord }) {
  const router = useRouter();
  const href = ROUTES.scheduleScheduledDetail(record.id);
  const expiry =
    EXPIRY_WINDOW_OPTIONS.find((o) => o.value === record.expiryWindowHours)?.label ??
    `${record.expiryWindowHours}h`;

  const open = () => router.push(href);

  return (
    <article
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
        hiringCard,
        "group relative flex h-full cursor-pointer flex-col overflow-hidden",
        "hover:-translate-y-1 hover:border-[rgba(var(--accent-rgb),0.14)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06),0_24px_48px_-16px_rgba(var(--accent-rgb),0.12)]",
        hiringTransition,
        accentBar,
      )}
    >
      <ArrowUpRight
        className={cn(
          "pointer-events-none absolute right-4 top-4 z-[1] h-4 w-4 text-[rgb(var(--accent-rgb)/0)]",
          hiringTransition,
          "group-hover:text-[rgb(var(--accent-rgb)/0.55)]",
        )}
        strokeWidth={2}
        aria-hidden
      />
      <div className="relative flex flex-1 flex-col gap-3 p-4 sm:p-[1.125rem]">
        <div className="flex items-start justify-between gap-2 pr-6">
          <div className="min-w-0">
            <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.03em] text-text group-hover:text-[rgb(var(--accent-rgb))]">
              {record.assessmentName}
            </h3>
            <p className="mt-0.5 text-[12px] font-medium text-text-secondary/70">{record.role}</p>
          </div>
          <ScheduledAssessmentStatusPill status={record.status} />
        </div>

        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] px-2 py-0.5 font-medium text-text-secondary/80">
            <CalendarClock className="h-3 w-3 opacity-60" strokeWidth={1.75} />
            {record.scheduledDate} · {record.scheduledTime}
          </span>
          <span className="rounded-full border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] px-2 py-0.5 font-medium text-muted">
            {expiry} window
          </span>
        </div>

        <div
          className={cn(
            "rounded-[12px] border border-[rgb(var(--accent-rgb)/0.12)] bg-[rgb(var(--accent-rgb)/0.05)] px-3 py-2.5",
          )}
        >
          <p className="text-[1.5rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-text">
            {record.candidatesInvited}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--accent-rgb))]">
            <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
            Candidates invited
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[rgba(15,23,42,0.05)] pt-3">
          <p className="text-[11px] leading-snug text-muted">{record.reminderStatusLabel}</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-[10px] p-0">
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={assessmentCardMenuContentClass}>
                <DropdownMenuItem className="text-[12px]" onSelect={open}>
                  Open schedule
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[12px]" onSelect={() => toast.message("Resend instruction (demo)")}>
                  Resend instruction email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  );
}
