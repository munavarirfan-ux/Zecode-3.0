"use client";

import { useMemo, useState } from "react";
import { Check, Download, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  dialogCloseButtonSm,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getAllAssessments } from "@/lib/hiring/assessments/assessmentStore";
import { addSchedule } from "@/lib/hiring/assessments/scheduleStore";
import type { AssessmentScheduleRecord } from "@/lib/hiring/assessments/scheduleTypes";

const TEMPLATE =
  "name,email,linkedin_url,resume_link\nPriya Sharma,priya@corp.com,linkedin.com/in/priya,/resumes/priya.pdf\n";

const STEPS = [
  "Choose assessment",
  "Upload CSV",
  "Configure",
  "Preview",
  "Send invites",
] as const;

const SELECT_CONTENT_CLASS = "z-[250]";

type PreviewRow = { name: string; email: string; linkedin?: string; resume?: string; error?: string };

export function BulkScheduleDialog({
  open,
  onOpenChange,
  onScheduled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: () => void;
}) {
  const assessments = useMemo(
    () => getAllAssessments().filter((a) => a.enabled && a.status !== "Draft"),
    [open],
  );
  const [step, setStep] = useState(0);
  const [assessmentId, setAssessmentId] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [expiry, setExpiry] = useState("");
  const [reminder, setReminder] = useState("daily");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [accessWindow, setAccessWindow] = useState("flexible");
  const [dragOver, setDragOver] = useState(false);

  const selectedAssessment = assessments.find((a) => a.id === assessmentId);

  const reset = () => {
    setStep(0);
    setAssessmentId(undefined);
    setPreview([]);
    setExpiry("");
    setReminder("daily");
    setTimezone("America/Los_Angeles");
    setAccessWindow("flexible");
  };

  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/).slice(1);
    const rows: PreviewRow[] = [];
    const emails = new Set<string>();
    lines.forEach((line, i) => {
      const [name, email, linkedin, resume] = line.split(",").map((s) => s.trim());
      if (!name || !email) {
        rows.push({ name: name || `Row ${i + 2}`, email: email || "—", error: "Missing name or email" });
        return;
      }
      if (emails.has(email.toLowerCase())) {
        rows.push({ name, email, error: "Duplicate email" });
        return;
      }
      emails.add(email.toLowerCase());
      rows.push({ name, email, linkedin, resume });
    });
    setPreview(rows);
    setStep(2);
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assessment-schedule-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendInvites = () => {
    const a = selectedAssessment;
    const valid = preview.filter((r) => !r.error);
    if (!a || valid.length === 0) {
      toast.error("No valid candidates to schedule");
      return;
    }
    valid.forEach((r, i) => {
      const record: AssessmentScheduleRecord = {
        id: `sch-bulk-${Date.now()}-${i}`,
        tab: "upcoming",
        assessmentId: a.id,
        assessmentName: a.name,
        role: a.role,
        durationMinutes: a.config.durationMinutes,
        candidateId: `sch-cand-bulk-${Date.now()}-${i}`,
        name: r.name,
        email: r.email,
        linkedin: r.linkedin,
        resumeUrl: r.resume,
        recruiter: "You",
        inviteSentAt: "May 20, 2026",
        expiryDate: expiry || "May 27, 2026",
        attemptWindow: accessWindow === "flexible" ? "Flexible window" : "Fixed window",
        calendarDate: "2026-05-20",
        status: "Not Started",
        progress: 0,
        score: null,
        qualified: null,
        malpracticeSignals: [],
        remindersSent: 0,
        lastReminderAt: null,
        reminderLevel: "muted",
      };
      addSchedule(record);
    });
    toast.success(`Sent ${valid.length} invites`);
    reset();
    onScheduled?.();
    onOpenChange(false);
  };

  const validCount = preview.filter((r) => !r.error).length;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="z-[130]" />
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <DialogPanel
            className={cn(
              "flex max-h-[min(90vh,720px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[20px]",
              "border border-white/60 bg-white/95 shadow-[0_24px_80px_-24px_rgba(var(--accent-rgb),0.35)] backdrop-blur-xl",
              "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
            )}
          >
            <div className="relative shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.08),transparent)] px-5 py-4">
              <DialogTitle className="pr-8 text-[1.0625rem] font-semibold tracking-[-0.03em]">
                Bulk schedule
              </DialogTitle>
              <p className="mt-1 text-[12px] text-muted">
                Invite multiple candidates with shared expiry and reminder settings.
              </p>
              <DialogClose className={cn("absolute right-3 top-3", dialogCloseButtonSm)} aria-label="Close">
                <X className="h-4 w-4" strokeWidth={2} />
              </DialogClose>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-4 flex gap-1">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={cn(
                      "flex-1 rounded-[8px] px-1 py-1 text-center text-[9px] font-medium leading-tight",
                      i <= step
                        ? "bg-[rgba(var(--accent-rgb),0.1)] text-[rgb(var(--accent-rgb))]"
                        : "bg-[rgba(15,23,42,0.04)] text-muted",
                    )}
                  >
                    {i < step ? <Check className="mx-auto h-3 w-3" /> : null}
                    {label}
                  </div>
                ))}
              </div>

              {step === 0 ? (
                <div className="space-y-2">
                  <Label className="text-[12px]">Assessment</Label>
                  {assessments.length === 0 ? (
                    <p className="rounded-[10px] border border-dashed border-[rgba(15,23,42,0.12)] px-3 py-4 text-[12px] text-muted">
                      No published assessments available. Create an assessment first.
                    </p>
                  ) : (
                    <Select value={assessmentId} onValueChange={setAssessmentId}>
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue placeholder="Choose assessment" />
                      </SelectTrigger>
                      <SelectContent className={SELECT_CONTENT_CLASS}>
                        {assessments.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {selectedAssessment ? (
                    <p className="text-[11px] text-muted">
                      {selectedAssessment.role} · {selectedAssessment.config.durationMinutes} min
                    </p>
                  ) : null}
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-[10px]"
                    onClick={downloadTemplate}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download CSV template
                  </Button>
                  <div
                    className={cn(
                      "rounded-[12px] border border-dashed px-4 py-8 text-center transition-colors",
                      dragOver
                        ? "border-[rgb(var(--accent-rgb))] bg-[rgba(var(--accent-rgb),0.04)]"
                        : "border-[rgba(15,23,42,0.12)]",
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const file = e.dataTransfer.files[0];
                      if (file) file.text().then(parseCsv);
                    }}
                  >
                    <Upload className="mx-auto h-8 w-8 text-muted/50" />
                    <p className="mt-2 text-[12px] font-medium text-text">Drop CSV or click to upload</p>
                    <label className="mt-2 inline-block cursor-pointer text-[11px] font-semibold text-accent hover:underline">
                      Browse file
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) file.text().then(parseCsv);
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Expiry date</Label>
                    <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="rounded-[10px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Reminder frequency</Label>
                    <Select value={reminder} onValueChange={setReminder}>
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={SELECT_CONTENT_CLASS}>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="48h">Every 48h</SelectItem>
                        <SelectItem value="once">Once before expiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={SELECT_CONTENT_CLASS}>
                        <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Access window</Label>
                    <Select value={accessWindow} onValueChange={setAccessWindow}>
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={SELECT_CONTENT_CLASS}>
                        <SelectItem value="flexible">Flexible — anytime before expiry</SelectItem>
                        <SelectItem value="fixed">Fixed — scheduled slot only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="max-h-64 space-y-1 overflow-auto rounded-[10px] border border-[rgba(15,23,42,0.06)]">
                  {preview.map((r, i) => (
                    <div
                      key={`${r.email}-${i}`}
                      className={cn(
                        "flex items-center justify-between border-b px-3 py-2 text-[12px] last:border-0",
                        r.error ? "bg-red-500/[0.04]" : "bg-white",
                      )}
                    >
                      <span className="font-medium text-text">{r.name}</span>
                      <span className="text-muted">{r.email}</span>
                      {r.error ? <span className="text-[10px] font-medium text-red-600">{r.error}</span> : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {step === 4 ? (
                <div className="rounded-[12px] border border-emerald-400/20 bg-emerald-500/[0.06] p-4 text-center">
                  <p className="text-[14px] font-semibold text-emerald-900">Ready to send</p>
                  <p className="mt-1 text-[12px] text-emerald-800/80">
                    {validCount} candidates will receive invites for{" "}
                    <strong>{selectedAssessment?.name ?? "assessment"}</strong> with {reminder} reminders until{" "}
                    {expiry || "expiry"}.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 justify-between gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-[10px]"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              {step < 4 ? (
                <Button
                  type="button"
                  className="rounded-[10px] bg-accent text-white hover:bg-accent-hover"
                  disabled={
                    (step === 0 && !assessmentId) ||
                    (step === 1 && preview.length === 0) ||
                    (step === 2 && !expiry)
                  }
                  onClick={() => setStep((s) => Math.min(4, s + 1))}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-[10px] bg-accent text-white hover:bg-accent-hover"
                  disabled={validCount === 0}
                  onClick={sendInvites}
                >
                  Send {validCount} invites
                </Button>
              )}
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
