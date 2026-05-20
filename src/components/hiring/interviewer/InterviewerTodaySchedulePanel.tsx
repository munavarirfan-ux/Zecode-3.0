"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { dashboardIntelligenceBorder, dashboardPanelInteractive } from "@/components/dashboard/dashboardTokens";
import type { InterviewerAssignedInterviewRow } from "@/lib/hiring/interviewerInterviews";

export function InterviewerTodaySchedulePanel({
  nextInterview,
}: {
  nextInterview: InterviewerAssignedInterviewRow | null;
}) {
  const router = useRouter();

  return (
    <aside
      className={cn(
        dashboardPanelInteractive,
        dashboardIntelligenceBorder,
        "sticky top-4 flex flex-col p-4 lg:top-6",
      )}
      aria-label="Today's schedule"
    >
      <h2 className="text-[13px] font-semibold tracking-[-0.02em] text-text">Today&apos;s schedule</h2>
      <p className="mt-0.5 text-[11px] text-text-secondary">Next panel on your calendar</p>

      {nextInterview ? (
        <div className="mt-4 rounded-[12px] border border-[rgb(var(--accent-rgb)/0.2)] bg-gradient-to-br from-[rgb(var(--accent-soft-rgb))] to-white p-3.5 dark:from-[rgb(var(--accent-rgb)/0.08)] dark:to-white/[0.03]">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Next interview</p>
          <p className="mt-1 text-[14px] font-semibold text-text">{nextInterview.candidate.name}</p>
          <p className="mt-0.5 text-[12px] text-text-secondary">{nextInterview.jobRole}</p>
          <p className="mt-1 text-[11px] text-text-secondary">{nextInterview.round}</p>
          <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-text">
            <CalendarClock className="h-3.5 w-3.5 text-[rgb(var(--accent-deep-rgb))]" strokeWidth={1.75} aria-hidden />
            {nextInterview.scheduledAt}
          </p>
          <p className="mt-1 text-[11px] text-muted">Starts in ~45 min</p>

          {nextInterview.interviewStatus !== "Reschedule Requested" &&
          nextInterview.roomId &&
          (nextInterview.interviewStatus === "Upcoming" || nextInterview.interviewStatus === "Ongoing") ? (
            <Button
              size="sm"
              className="mt-4 h-9 w-full rounded-[10px] bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover"
              onClick={() => router.push(ROUTES.meetRoom(nextInterview.roomId!))}
            >
              <Video className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              Join interview
            </Button>
          ) : (
            <p className="mt-3 text-[11px] text-amber-800">Join disabled until reschedule is resolved.</p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-[12px] leading-relaxed text-text-secondary">
          No panels on your calendar today. Check upcoming interviews in the list.
        </p>
      )}

      <Link
        href={ROUTES.mySchedule}
        className="mt-4 text-center text-[11px] font-medium text-[rgb(var(--accent-deep-rgb))] hover:underline"
      >
        View full schedule
      </Link>
    </aside>
  );
}
