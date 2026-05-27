"use client";

import { Calendar, Clock, MapPin, UserRound, Video } from "lucide-react";
import {
  formatSchedulePreviewDate,
  formatSchedulePreviewTime,
  MOCK_INTERVIEWERS,
  type ScheduleInterviewForm,
} from "@/lib/hiring/scheduleInterview";
import type { HiringCandidate } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";

export function ScheduleInterviewPreview({
  candidate,
  form,
}: {
  candidate: HiringCandidate;
  form: ScheduleInterviewForm;
}) {
  const interviewers = form.interviewerIds
    .map((id) => MOCK_INTERVIEWERS.find((i) => i.id === id))
    .filter(Boolean);

  const round = form.title || "Interview";
  const meetingLink = form.includeMeetingLink ? "meet.google.com/abc-defg-hij" : null;

  return (
    <div className="flex h-full flex-col">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        Live preview
      </p>
      <div
        className={cn(
          "mt-3 flex flex-1 flex-col overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.06)]",
          "bg-gradient-to-b from-white to-[#FAFAFB] shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)]",
          "dark:border-white/[0.06] dark:from-surface dark:to-[#0c0c0e]",
        )}
      >
        <div className="border-b border-[rgba(15,23,42,0.06)] bg-forest/[0.06] px-4 py-3 dark:border-white/[0.06]">
          <p className="text-[15px] font-semibold leading-snug text-text">
            {form.title || "Interview title"}
          </p>
          <p className="mt-1 text-[12px] text-text-secondary/80">with {candidate.name}</p>
        </div>

        <div className="space-y-4 p-4">
          <PreviewRow
            icon={Calendar}
            label="Date"
            value={formatSchedulePreviewDate(form.date, form.time)}
          />
          <PreviewRow
            icon={Clock}
            label="Time"
            value={formatSchedulePreviewTime(form.time, form.durationMinutes)}
          />
          <PreviewRow icon={Video} label="Platform" value={form.platform} />
          <PreviewRow
            icon={UserRound}
            label="Interviewers"
            value={
              interviewers.length > 0
                ? interviewers.map((i) => i!.name).join(", ")
                : "Add at least one interviewer"
            }
            muted={interviewers.length === 0}
          />
          {meetingLink ? (
            <PreviewRow icon={MapPin} label="Meeting link" value={meetingLink} isLink />
          ) : null}
        </div>

        <div className="mt-auto border-t border-[rgba(15,23,42,0.06)] bg-white/60 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Notifications</p>
          <ul className="mt-2 space-y-1 text-[11px] text-text-secondary/80">
            {form.sendCalendarInvite ? <li>Calendar invite → candidate & panel</li> : null}
            {form.sendReminderEmail ? <li>Reminder email scheduled</li> : null}
            {form.notifyHiringManager ? <li>Hiring manager notified</li> : null}
            {!form.sendCalendarInvite && !form.sendReminderEmail && !form.notifyHiringManager ? (
              <li className="text-muted">No notifications selected</li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
  muted,
  isLink,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  muted?: boolean;
  isLink?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F4F4F5] dark:bg-white/[0.06]">
        <Icon className="h-4 w-4 text-[#71717A]" strokeWidth={1.5} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted">{label}</p>
        <p
          className={cn(
            "mt-0.5 text-[13px] font-medium",
            muted ? "text-muted" : "text-text",
            isLink && "text-forest",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
