"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonLg,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scheduleCandidateInterview } from "@/lib/hiring/mockData";
import {
  createDefaultScheduleForm,
  createScheduleFormFromInterview,
  DURATION_PRESETS,
  INTERVIEW_TYPE_OPTIONS,
  MOCK_INTERVIEWERS,
  PLATFORM_OPTIONS,
  type InterviewerAvailability,
  type ScheduleInterviewForm,
} from "@/lib/hiring/scheduleInterview";
import type { HiringCandidate } from "@/lib/hiring/types";
import { preventDialogDismissOnPortaledOverlay } from "@/lib/radix-overlay";
import { cn } from "@/lib/utils";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import { ScheduleInterviewPreview } from "./ScheduleInterviewPreview";

const footerBtnBase =
  "inline-flex h-11 min-h-[44px] items-center justify-center rounded-[11px] px-5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const inputClass =
  "h-10 rounded-[10px] border-[rgba(15,23,42,0.08)] text-[14px] focus-visible:ring-2 focus-visible:ring-forest/25";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 focus-visible:ring-offset-2",
        active
          ? "border-forest/30 bg-forest/10 text-forest"
          : "border-[rgba(15,23,42,0.08)] bg-white text-[#71717A] hover:border-forest/20 dark:bg-surface",
      )}
    >
      {children}
    </button>
  );
}

const availabilityDot: Record<InterviewerAvailability, string> = {
  available: "bg-emerald-500",
  busy: "bg-red-500",
  tentative: "bg-amber-500",
};

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  candidate,
  roundTitle,
  mode = "schedule",
  onScheduled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate | null;
  roundTitle: string;
  mode?: "schedule" | "reschedule" | "view";
  onScheduled?: (candidate: HiringCandidate) => void;
}) {
  const [form, setForm] = useState<ScheduleInterviewForm>(() => createDefaultScheduleForm(roundTitle));
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isView = mode === "view";

  useEffect(() => {
    if (!open || !candidate) return;
    const existing = candidate.interviews.find(
      (i) => i.round.trim().toLowerCase() === roundTitle.trim().toLowerCase(),
    );
    if (mode !== "schedule" && existing) {
      setForm(createScheduleFormFromInterview(roundTitle, existing));
    } else {
      setForm(createDefaultScheduleForm(roundTitle));
    }
    setSearch("");
    setSubmitting(false);
  }, [open, roundTitle, candidate, mode]);

  const filteredInterviewers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_INTERVIEWERS;
    return MOCK_INTERVIEWERS.filter(
      (i) => i.name.toLowerCase().includes(q) || i.role.toLowerCase().includes(q),
    );
  }, [search]);

  function patch(next: Partial<ScheduleInterviewForm>) {
    setForm((f) => ({ ...f, ...next }));
  }

  function toggleInterviewer(id: string) {
    setForm((f) => {
      const has = f.interviewerIds.includes(id);
      return {
        ...f,
        interviewerIds: has ? f.interviewerIds.filter((x) => x !== id) : [...f.interviewerIds, id],
      };
    });
  }

  function handleSubmit() {
    if (!candidate || isView) return;
    if (!form.date) {
      toast.error("Select an interview date");
      return;
    }
    if (!form.time) {
      toast.error("Select a start time");
      return;
    }
    if (form.interviewerIds.length === 0) {
      toast.error("Add at least one interviewer");
      return;
    }

    setSubmitting(true);
    const result = scheduleCandidateInterview(candidate.id, { ...form, roundTitle });
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    const actions: string[] = [];
    if (form.sendCalendarInvite) actions.push("Calendar invite sent");
    if (form.sendReminderEmail) actions.push("Reminder scheduled");
    if (form.notifyHiringManager) actions.push("Hiring manager notified");

    toast.success(
      mode === "reschedule" ? "Interview rescheduled" : "Interview scheduled",
      {
        description: [result.interview.scheduledAt, ...actions].filter(Boolean).join(" · "),
      },
    );

    onScheduled?.(result.candidate);
    onOpenChange(false);
  }

  if (!candidate) return null;

  const title =
    mode === "reschedule"
      ? "Reschedule interview"
      : mode === "view"
        ? "Interview details"
        : "Schedule interview";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[240] bg-[rgba(15,23,42,0.45)] backdrop-blur-[5px]" />
        <div
          className={cn(
            "fixed inset-0 z-[240] flex items-center justify-center",
            "px-4 pt-[max(16px,env(safe-area-inset-top))]",
            "pb-[max(16px,env(safe-area-inset-bottom))] sm:px-6",
          )}
        >
          <DialogPanel
            className={cn(
              dashboardCanvas,
              "relative flex w-full max-w-[900px] flex-col overflow-hidden",
              "max-h-[min(720px,calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))]",
              "rounded-[20px] border border-[rgba(15,23,42,0.06)]",
              "shadow-[0_24px_64px_-32px_rgba(15,23,42,0.28)]",
            )}
            onPointerDownOutside={preventDialogDismissOnPortaledOverlay}
            onFocusOutside={preventDialogDismissOnPortaledOverlay}
          >
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogClose
              className={cn("absolute right-3 top-3 z-20", dialogCloseButtonLg)}
              aria-label="Close schedule interview"
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden />
            </DialogClose>
            <DialogDescription className="sr-only">
              Schedule an interview for {candidate.name}
            </DialogDescription>

            <header className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 py-4 sm:px-6 sm:py-5 dark:border-white/[0.06]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-forest">
                {roundTitle}
              </p>
              <h2 className="mt-1 text-[1.35rem] font-semibold tracking-[-0.03em] text-text">{title}</h2>
              <p className="mt-1 text-[13px] text-text-secondary/75">
                {candidate.name} · {candidate.source}
              </p>
            </header>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
                <Section title="Interview details" step="1">
                  <Field label="Type">
                    <div className="flex flex-wrap gap-2">
                      {INTERVIEW_TYPE_OPTIONS.map((t) => (
                        <Chip
                          key={t}
                          active={form.interviewType === t}
                          onClick={() => !isView && patch({ interviewType: t })}
                        >
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="Title">
                    <Input
                      value={form.title}
                      onChange={(e) => patch({ title: e.target.value })}
                      placeholder="e.g. Technical Round 2"
                      className={inputClass}
                      disabled={isView}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Date">
                      <DatePicker
                        value={form.date}
                        onChange={(date) => patch({ date })}
                        placeholder="Pick interview date"
                        className={inputClass}
                        disabled={isView}
                      />
                    </Field>
                    <Field label="Time">
                      <Input
                        type="time"
                        value={form.time}
                        onChange={(e) => patch({ time: e.target.value })}
                        className={inputClass}
                        disabled={isView}
                      />
                    </Field>
                  </div>

                  <Field label="Duration">
                    <div className="flex flex-wrap gap-2">
                      {DURATION_PRESETS.map((m) => (
                        <Chip
                          key={m}
                          active={form.durationPreset === m}
                          onClick={() =>
                            !isView && patch({ durationPreset: m, durationMinutes: m })
                          }
                        >
                          {m}m
                        </Chip>
                      ))}
                      <Chip
                        active={form.durationPreset === "custom"}
                        onClick={() => !isView && patch({ durationPreset: "custom" })}
                      >
                        Custom
                      </Chip>
                      {form.durationPreset === "custom" ? (
                        <Input
                          type="number"
                          min={15}
                          max={240}
                          value={form.durationMinutes}
                          onChange={(e) =>
                            patch({ durationMinutes: Number(e.target.value) || 45 })
                          }
                          className={cn(inputClass, "w-20")}
                          disabled={isView}
                        />
                      ) : null}
                    </div>
                  </Field>

                  <Field label="Platform">
                    <div className="flex flex-wrap gap-2">
                      {PLATFORM_OPTIONS.map((p) => (
                        <Chip
                          key={p}
                          active={form.platform === p}
                          onClick={() => !isView && patch({ platform: p })}
                        >
                          {p}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </Section>

                <Section title="Interviewers" step="2" className="mt-8">
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search interviewers…"
                      className={cn(inputClass, "pl-9")}
                      disabled={isView}
                    />
                  </div>

                  <ul className="mt-3 space-y-2">
                    {filteredInterviewers.map((person) => {
                      const selected = form.interviewerIds.includes(person.id);
                      return (
                        <li key={person.id}>
                          <button
                            type="button"
                            disabled={isView}
                            onClick={() => toggleInterviewer(person.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left transition-colors",
                              selected
                                ? "border-forest/25 bg-forest/[0.06]"
                                : "border-[rgba(15,23,42,0.06)] bg-white hover:border-[rgba(15,23,42,0.1)] dark:border-white/[0.06] dark:bg-surface",
                            )}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F4F5] text-[11px] font-semibold text-[#52525B] dark:bg-white/[0.08]">
                              {person.initials}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13px] font-medium text-text">
                                {person.name}
                              </span>
                              <span className="block text-[11px] text-muted">{person.role}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] text-muted">
                              <span
                                className={cn("h-1.5 w-1.5 rounded-full", availabilityDot[person.availability])}
                                aria-hidden
                              />
                              {person.availabilityNote}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {form.interviewerIds.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {form.interviewerIds.map((id) => {
                        const p = MOCK_INTERVIEWERS.find((i) => i.id === id);
                        if (!p) return null;
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 rounded-full border border-forest/20 bg-forest/10 px-2 py-0.5 text-[11px] font-medium text-forest"
                          >
                            {p.initials} {p.name.split(" ")[0]}
                            {!isView ? (
                              <button
                                type="button"
                                className="ml-0.5 rounded-full hover:bg-forest/20"
                                onClick={() => toggleInterviewer(id)}
                                aria-label={`Remove ${p.name}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            ) : null}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </Section>

                <Section title="Communication" step="3" className="mt-8 pb-2">
                  <div className="space-y-3">
                    <CommOption
                      id="cal-invite"
                      label="Send calendar invite"
                      checked={form.sendCalendarInvite}
                      onChange={(v) => patch({ sendCalendarInvite: v })}
                      disabled={isView}
                    />
                    <CommOption
                      id="reminder"
                      label="Send reminder email"
                      checked={form.sendReminderEmail}
                      onChange={(v) => patch({ sendReminderEmail: v })}
                      disabled={isView}
                    />
                    <CommOption
                      id="meeting-link"
                      label="Include meeting link"
                      checked={form.includeMeetingLink}
                      onChange={(v) => patch({ includeMeetingLink: v })}
                      disabled={isView}
                    />
                    <CommOption
                      id="notify-hm"
                      label="Notify hiring manager"
                      checked={form.notifyHiringManager}
                      onChange={(v) => patch({ notifyHiringManager: v })}
                      disabled={isView}
                    />
                  </div>
                </Section>
              </div>

              <aside className="shrink-0 border-t border-[rgba(15,23,42,0.06)] bg-[#FAFAFB]/80 p-5 dark:border-white/[0.06] dark:bg-white/[0.02] lg:w-[300px] lg:border-l lg:border-t-0">
                <ScheduleInterviewPreview candidate={candidate} form={form} />
              </aside>
            </div>

            {!isView ? (
              <footer className="shrink-0 border-t border-[rgba(15,23,42,0.06)] bg-white/95 px-5 py-3 backdrop-blur-md dark:border-white/[0.06] dark:bg-surface/95 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(footerBtnBase, "border-[rgba(15,23,42,0.1)]")}
                    onClick={() => onOpenChange(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className={cn(
                      footerBtnBase,
                      "min-w-[10rem] bg-forest text-white hover:bg-forest/90 focus-visible:ring-forest/30",
                    )}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Scheduling…
                      </>
                    ) : mode === "reschedule" ? (
                      "Reschedule Interview"
                    ) : (
                      "Schedule Interview"
                    )}
                  </Button>
                </div>
              </footer>
            ) : null}
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}

function Section({
  title,
  step,
  className,
  children,
}: {
  title: string;
  step: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest/10 text-[10px] font-bold text-forest">
          {step}
        </span>
        <h3 className="text-[13px] font-semibold text-text">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[12px] font-medium text-text-secondary/80">{label}</Label>
      {children}
    </div>
  );
}

function CommOption({
  id,
  label,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-[11px] border border-[rgba(15,23,42,0.06)] bg-white px-3 py-2.5 dark:border-white/[0.06] dark:bg-surface",
        disabled && "cursor-default opacity-60",
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        disabled={disabled}
      />
      <span className="text-[13px] font-medium text-text">{label}</span>
    </label>
  );
}
