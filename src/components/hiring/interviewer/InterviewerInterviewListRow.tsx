"use client";

import { useRouter } from "next/navigation";
import {
  CalendarClock,
  MessageSquare,
  MoreHorizontal,
  StickyNote,
  UserRound,
  Video,
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
import { CandidateAvatar } from "@/components/hiring/directories/candidateDirectoryUi";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import { ROUTES } from "@/config/routes";
import type { InterviewerAssignedInterviewRow } from "@/lib/hiring/interviewerInterviews";
import { cn } from "@/lib/utils";

const primaryStatusTone: Record<string, string> = {
  Upcoming: "bg-[#F8FAFC] text-[#475569] ring-1 ring-inset ring-[#E2E8F0]",
  Ongoing: "bg-[rgb(var(--accent-soft-rgb))] text-[rgb(var(--accent-deep-rgb))] ring-1 ring-inset ring-[rgb(var(--accent-rgb)/0.18)]",
  Completed: "bg-[#F8FAFC] text-[#475569] ring-1 ring-inset ring-[#E2E8F0]",
  Cancelled: "bg-[#FAFAFA] text-[#71717A] ring-1 ring-inset ring-[#E4E4E7]",
  "Reschedule Requested": "bg-[#FFFBEB] text-[#92400E] ring-1 ring-inset ring-[#FDE68A]",
};

function PrimaryStatusPill({ status }: { status: string }) {
  const label =
    status === "Reschedule Requested" ? "Reschedule requested" : status;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide",
        primaryStatusTone[status] ?? primaryStatusTone.Upcoming,
      )}
    >
      {status === "Reschedule Requested" ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B]" aria-hidden />
      ) : null}
      {label}
    </span>
  );
}

function FeedbackStatusText({
  interviewStatus,
  feedbackStatus,
}: {
  interviewStatus: string;
  feedbackStatus: string;
}) {
  if (interviewStatus !== "Completed" && feedbackStatus === "Pending") return null;
  if (feedbackStatus === "Submitted") {
    return <p className="text-[11px] text-[#94A3B8]">Feedback submitted</p>;
  }
  if (feedbackStatus === "Overdue") {
    return <p className="text-[11px] text-[#B45309]/80">Feedback overdue</p>;
  }
  if (feedbackStatus === "Pending") {
    return <p className="text-[11px] text-[#94A3B8]">Feedback pending</p>;
  }
  return null;
}

const menuItemClass = "gap-2 text-[12px] font-medium";

const overflowBtnClass = cn(
  "h-7 w-7 shrink-0 rounded-lg border border-[rgba(15,23,42,0.08)] bg-white p-0 text-[#64748B] shadow-sm",
  hiringTransition,
  "hover:border-[rgba(15,23,42,0.12)] hover:bg-[#F8FAFC] hover:text-text",
  "data-[state=open]:border-[rgba(15,23,42,0.12)] data-[state=open]:bg-[#F8FAFC] data-[state=open]:text-text",
);

export function InterviewerInterviewListRow({
  row,
  onViewCandidate,
  onRequestReschedule,
  onSubmitFeedback,
}: {
  row: InterviewerAssignedInterviewRow;
  onViewCandidate: () => void;
  onRequestReschedule: () => void;
  onSubmitFeedback: () => void;
}) {
  const router = useRouter();
  const canJoin =
    row.roomId &&
    row.interviewStatus !== "Reschedule Requested" &&
    (row.interviewStatus === "Upcoming" || row.interviewStatus === "Ongoing");

  const canReschedule = row.interviewStatus === "Upcoming";

  const showJoin =
    row.interviewStatus === "Upcoming" || row.interviewStatus === "Ongoing";

  return (
    <div
      className={cn(
        "group flex items-center gap-3.5 px-4 py-3.5 sm:gap-4 sm:py-4",
        hiringTransition,
        "hover:bg-[rgba(15,23,42,0.025)]",
        row.interviewStatus === "Reschedule Requested" && "bg-[#FFFBEB]/40 hover:bg-[#FFFBEB]/55",
      )}
    >
      <CandidateAvatar name={row.candidate.name} className="h-9 w-9 text-[10px] sm:h-10 sm:w-10" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text sm:text-[14px]">
            {row.candidate.name}
          </p>
        </div>
        <p className="truncate text-[11px] text-[#94A3B8] sm:text-[12px]">{row.jobRole}</p>
        <p className="mt-1 text-[12px] font-medium text-text sm:text-[13px]">{row.round}</p>
        <p className="mt-0.5 text-[11px] tabular-nums text-[#64748B] sm:text-[12px]">
          {row.scheduledAt}
        </p>
        <div className="mt-2 space-y-0.5">
          <PrimaryStatusPill status={row.interviewStatus} />
          <FeedbackStatusText
            interviewStatus={row.interviewStatus}
            feedbackStatus={row.feedbackStatus}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {showJoin ? (
          <Button
            size="sm"
            variant="primary"
            disabled={!canJoin}
            className={cn(hiringTransition, "opacity-80 group-hover:opacity-100")}
            onClick={() => row.roomId && router.push(ROUTES.meetRoom(row.roomId))}
          >
            <Video className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Join
          </Button>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={overflowBtnClass}
              aria-label="Interview actions"
            >
              <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            <DropdownMenuItem className={menuItemClass} onClick={onViewCandidate}>
              <UserRound className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
              View candidate
            </DropdownMenuItem>
            {canReschedule ? (
              <DropdownMenuItem className={menuItemClass} onClick={onRequestReschedule}>
                <CalendarClock className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
                Request reschedule
              </DropdownMenuItem>
            ) : null}
            {row.interviewStatus === "Completed" ? (
              <DropdownMenuItem className={menuItemClass} onClick={onSubmitFeedback}>
                <MessageSquare className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
                {row.feedbackStatus === "Submitted" ? "View feedback" : "Submit feedback"}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() =>
                toast.message("Internal note", {
                  description: `Notes for ${row.candidate.name} will sync when backend is connected.`,
                })
              }
            >
              <StickyNote className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
              Add internal note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
