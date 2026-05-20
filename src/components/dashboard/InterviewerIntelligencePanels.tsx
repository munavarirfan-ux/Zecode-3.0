"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar,
  CalendarClock,
  ChevronRight,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { resolveLoggedInInterviewerName } from "@/lib/dashboard/interviewerContext";
import {
  dashboardPanelInteractive,
  dashboardRowSurface,
  dashboardSectionSub,
  dashboardSectionTitle,
} from "./dashboardTokens";
import {
  defaultInterviewerAvailabilitySlots,
  myAssignedInterviewsAll,
  myWeeklyScheduleForInterviewer,
  interviewerAssignedJobsAll,
  type AvailabilitySlot,
  type InterviewerAssignedJob,
  type MyAssignedInterview,
  type WeekdayId,
} from "@/features/dashboard/data/dashboard.mock";

const panelShell = cn(dashboardPanelInteractive, "flex h-full min-h-0 flex-col p-3.5 sm:p-4");

const interviewerJobCard = cn(
  "block rounded-[12px] border border-[rgb(var(--accent-rgb)/0.24)] p-3.5",
  "bg-gradient-to-br from-[rgb(var(--accent-soft-rgb))] via-white to-[rgb(var(--accent-50-rgb)/0.45)]",
  "shadow-[0_1px_4px_rgb(var(--accent-rgb)/0.08)]",
  "transition-[transform,border-color,box-shadow] duration-200 ease-out",
  "hover:-translate-y-px hover:border-[rgb(var(--accent-rgb)/0.38)] hover:shadow-[0_8px_24px_-10px_rgb(var(--accent-rgb)/0.22)]",
  "dark:from-[rgb(var(--accent-rgb)/0.1)] dark:via-white/[0.04] dark:to-white/[0.02] dark:border-[rgb(var(--accent-rgb)/0.3)]",
);

const WEEKDAYS: WeekdayId[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function candidateInitials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function statusChip(status: MyAssignedInterview["status"]) {
  switch (status) {
    case "Confirmed":
      return "bg-[#DCFCE7] text-[#166534]";
    case "Hold":
      return "bg-[#FEF3C7] text-[#A16207]";
    default:
      return "bg-muted text-text-secondary";
  }
}

function useInterviewerName() {
  const { data: session } = useSession();
  return resolveLoggedInInterviewerName(session?.user?.name);
}

export function InterviewerIntelligenceWorkspace() {
  const interviewerName = useInterviewerName();
  const interviews = useMemo(
    () => myAssignedInterviewsAll.filter((i) => i.interviewerName === interviewerName),
    [interviewerName],
  );
  const jobs = useMemo(() => interviewerAssignedJobsAll, []);

  return (
    <div className="space-y-4" role="region" aria-label="Your interview workspace">
      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
        <MyUpcomingInterviewsCard interviews={interviews} className="min-h-[380px] lg:min-h-[420px]" />
        <MyWeeklyScheduleCard className="min-h-[380px] lg:min-h-[420px]" />
        <MyAvailabilitySlotsCard className="min-h-[340px] lg:col-span-2" />
      </div>
      <InterviewerAssignedJobsSection jobs={jobs} interviewerName={interviewerName} />
    </div>
  );
}

function MyUpcomingInterviewsCard({
  interviews,
  className,
}: {
  interviews: MyAssignedInterview[];
  className?: string;
}) {
  const router = useRouter();
  const next = interviews[0];
  const rest = interviews.slice(1, 4);

  return (
    <section className={cn(panelShell, className)} aria-label="My upcoming interviews">
      <header className="mb-3 shrink-0">
        <h3 className={dashboardSectionTitle}>My upcoming interviews</h3>
        <p className={dashboardSectionSub}>Panels assigned to you — join when it&apos;s time</p>
      </header>

      {next ? (
        <div className="mb-3 shrink-0 rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-gradient-to-br from-white to-[#F8FAFC] p-3 dark:border-white/[0.06] dark:from-white/[0.05] dark:to-white/[0.02]">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold ring-1 ring-[rgba(15,23,42,0.06)] dark:bg-white/10">
              {candidateInitials(next.candidateName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-[13px] font-semibold text-text">{next.candidateName}</p>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", statusChip(next.status))}>
                  {next.status}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[11px] text-text-secondary">{next.jobRole}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
                {next.round} · {next.durationMin} min
              </p>
              <p className="mt-1 text-[12px] font-medium text-text">
                {next.dateLabel} · {next.timeLabel} <span className="text-text-secondary">{next.timezone}</span>
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-8 rounded-[10px] bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent-hover"
              onClick={() => router.push(ROUTES.meetRoom(next.roomId))}
            >
              <Video className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              Join interview
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-[10px] text-[11px] font-medium"
              asChild
            >
              <Link href={ROUTES.applicants}>View candidate</Link>
            </Button>
          </div>
        </div>
      ) : (
        <p className="mb-3 text-[12px] text-text-secondary">No upcoming interviews on your calendar.</p>
      )}

      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-0.5 [scrollbar-width:thin]">
        {rest.map((r) => (
          <div
            key={r.id}
            className={cn("flex items-start justify-between gap-2", dashboardRowSurface, "p-2.5")}
          >
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-text">{r.candidateName}</p>
              <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                {r.jobRole} · {r.round}
              </p>
              <p className="mt-1 text-[10px] text-muted">
                {r.dateLabel} · {r.durationMin}m · <span className={cn("rounded-full px-1.5 py-0.5", statusChip(r.status))}>{r.status}</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <p className="tabular-nums text-[12px] font-semibold text-text">
                {r.timeLabel} <span className="text-[10px] font-medium text-muted">{r.timezone}</span>
              </p>
              <Button
                size="sm"
                variant="outline"
                className="h-7 rounded-[8px] px-2 text-[10px]"
                onClick={() => router.push(ROUTES.meetRoom(r.roomId))}
              >
                Join
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MyWeeklyScheduleCard({ className }: { className?: string }) {
  const days = myWeeklyScheduleForInterviewer;

  return (
    <section className={cn(panelShell, className)} aria-label="My weekly schedule">
      <header className="mb-3 flex shrink-0 items-start justify-between gap-2">
        <div>
          <h3 className={dashboardSectionTitle}>My weekly schedule</h3>
          <p className={dashboardSectionSub}>Interviews, availability, and blocked time</p>
        </div>
        <Calendar className="h-4 w-4 shrink-0 text-muted/70" strokeWidth={1.75} aria-hidden />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-7 gap-1 overflow-auto sm:gap-1.5">
        {days.map((d) => (
          <div
            key={d.day}
            className="flex min-w-0 flex-col rounded-[10px] border border-[rgba(15,23,42,0.05)] bg-[#FAFAFB]/80 p-1.5 dark:border-white/[0.05] dark:bg-white/[0.02] sm:p-2"
          >
            <p className="text-center text-[10px] font-semibold uppercase tracking-wide text-text">{d.day}</p>
            <p className="text-center text-[9px] text-muted">{d.dateLabel}</p>
            <ul className="mt-1.5 flex-1 space-y-1">
              {d.entries.length === 0 ? (
                <li className="py-2 text-center text-[9px] text-muted/80">—</li>
              ) : (
                d.entries.map((e) => (
                  <li
                    key={e.id}
                    className={cn(
                      "rounded-[6px] px-1 py-0.5 text-[8px] leading-tight sm:text-[9px]",
                      e.kind === "interview" && "bg-[rgb(var(--accent-rgb)/0.08)] text-[rgb(var(--accent-deep-rgb))]",
                      e.kind === "available" && "bg-[#DCFCE7]/80 text-[#166534]",
                      e.kind === "blocked" && "bg-[#F4F4F5] text-text-secondary",
                    )}
                    title={e.kind === "interview" ? `${e.label} · ${e.round}` : e.kind === "blocked" ? e.reason : "Available"}
                  >
                    <span className="block font-medium tabular-nums">{e.time}</span>
                    {e.kind === "interview" ? (
                      <span className="block truncate font-medium">{e.label.split(" ")[0]}</span>
                    ) : e.kind === "blocked" ? (
                      <span className="block truncate opacity-80">Blocked</span>
                    ) : (
                      <span className="block">Open</span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 border-t border-[rgba(15,23,42,0.05)] pt-2.5 text-[10px] text-text-secondary dark:border-white/[0.05]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[rgb(var(--accent-rgb)/0.35)]" aria-hidden />
          Interview
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#86EFAC]" aria-hidden />
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#E4E4E7]" aria-hidden />
          Blocked
        </span>
      </div>
    </section>
  );
}

function MyAvailabilitySlotsCard({ className }: { className?: string }) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(defaultInterviewerAvailabilitySlots);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<AvailabilitySlot>>({});

  function startAdd() {
    setEditingId("new");
    setDraft({
      day: "Mon",
      startTime: "09:00",
      endTime: "12:00",
      timezone: "CET",
      repeatWeekly: true,
    });
  }

  function startEdit(slot: AvailabilitySlot) {
    setEditingId(slot.id);
    setDraft({ ...slot });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  function saveEdit() {
    if (!draft.day || !draft.startTime || !draft.endTime) return;
    const payload: AvailabilitySlot = {
      id: editingId === "new" ? `slot-${Date.now()}` : editingId!,
      day: draft.day as WeekdayId,
      startTime: draft.startTime,
      endTime: draft.endTime,
      timezone: draft.timezone ?? "CET",
      repeatWeekly: draft.repeatWeekly ?? false,
    };
    if (editingId === "new") {
      setSlots((s) => [...s, payload]);
    } else {
      setSlots((s) => s.map((x) => (x.id === payload.id ? payload : x)));
    }
    cancelEdit();
  }

  function removeSlot(id: string) {
    setSlots((s) => s.filter((x) => x.id !== id));
    if (editingId === id) cancelEdit();
  }

  return (
    <section className={cn(panelShell, className)} aria-label="My availability slots">
      <header className="mb-3 flex shrink-0 items-start justify-between gap-2">
        <div>
          <h3 className={dashboardSectionTitle}>My availability slots</h3>
          <p className={dashboardSectionSub}>When you&apos;re open for interview panels this week</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 shrink-0 rounded-[10px] text-[11px]"
          onClick={startAdd}
        >
          <Plus className="mr-1 h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          Add slot
        </Button>
      </header>

      <ul className="min-h-0 flex-1 space-y-2 overflow-auto">
        {slots.map((slot) => (
          <li
            key={slot.id}
            className="flex items-center justify-between gap-2 rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-white/70 px-3 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-text">
                {slot.day} {slot.startTime}–{slot.endTime}
              </p>
              <p className="mt-0.5 text-[10px] text-text-secondary">
                {slot.timezone}
                {slot.repeatWeekly ? " · Repeats weekly" : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => startEdit(slot)}>
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-muted hover:text-destructive"
                onClick={() => removeSlot(slot.id)}
                aria-label="Remove slot"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {editingId ? (
        <div className="mt-3 shrink-0 space-y-2 rounded-[12px] border border-dashed border-[rgba(15,23,42,0.12)] bg-[#FAFAFB] p-3 dark:border-white/[0.1] dark:bg-white/[0.02]">
          <p className="text-[11px] font-medium text-text">{editingId === "new" ? "New slot" : "Edit slot"}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Select value={draft.day} onValueChange={(v) => setDraft((d) => ({ ...d, day: v as WeekdayId }))}>
              <SelectTrigger className="h-9 text-[12px]">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="time"
              className="h-9 text-[12px]"
              value={draft.startTime ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, startTime: e.target.value }))}
            />
            <Input
              type="time"
              className="h-9 text-[12px]"
              value={draft.endTime ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, endTime: e.target.value }))}
            />
            <Input
              className="h-9 text-[12px]"
              placeholder="Timezone"
              value={draft.timezone ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, timezone: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-[11px] text-text-secondary">
            <input
              type="checkbox"
              checked={draft.repeatWeekly ?? false}
              onChange={(e) => setDraft((d) => ({ ...d, repeatWeekly: e.target.checked }))}
              className="rounded border-border"
            />
            Repeat weekly
          </label>
          <div className="flex gap-2">
            <Button type="button" size="sm" className="h-8 rounded-[10px] text-[11px]" onClick={saveEdit}>
              Save
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-8 rounded-[10px] text-[11px]" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function InterviewerAssignedJobsSection({
  jobs,
  interviewerName,
}: {
  jobs: InterviewerAssignedJob[];
  interviewerName: string;
}) {
  const jobInterviews = useMemo(
    () => myAssignedInterviewsAll.filter((i) => i.interviewerName === interviewerName),
    [interviewerName],
  );

  return (
    <section className={cn(dashboardPanelInteractive, "p-3.5 sm:p-4")} aria-label="Jobs assigned to me">
      <header className="mb-3">
        <h3 className={dashboardSectionTitle}>Jobs assigned to me</h3>
        <p className={dashboardSectionSub}>Rounds and candidates you own — open a job to see your panels only</p>
      </header>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Link
            key={job.jobId}
            href={ROUTES.hiringJobInterview(job.jobId)}
            className={interviewerJobCard}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-text">{job.jobTitle}</p>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{job.roundAssigned}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
              <div>
                <dt className="text-muted">Candidates</dt>
                <dd className="font-medium tabular-nums text-text">{job.candidatesAssigned}</dd>
              </div>
              <div>
                <dt className="text-muted">Upcoming</dt>
                <dd className="font-medium tabular-nums text-text">{job.upcomingInterviews}</dd>
              </div>
              <div>
                <dt className="text-muted">Feedback due</dt>
                <dd className="font-medium tabular-nums text-text">{job.feedbackPending}</dd>
              </div>
              <div>
                <dt className="text-muted">Your panels</dt>
                <dd className="font-medium tabular-nums text-text">
                  {jobInterviews.filter((i) => i.jobId === job.jobId).length}
                </dd>
              </div>
            </dl>
            <p className="mt-2.5 flex items-center gap-1 text-[10px] font-medium text-[rgb(var(--accent-deep-rgb))]">
              <CalendarClock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
              View my interviews for this job
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
