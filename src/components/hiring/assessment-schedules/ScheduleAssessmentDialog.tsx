"use client";

import { useCallback, useState } from "react";
import { Download, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  dialogCloseButtonSm,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAssessments } from "@/lib/hiring/assessments/assessmentStore";
import {
  addScheduledAssessment,
  CSV_TEMPLATE_CONTENT,
  EXPIRY_WINDOW_OPTIONS,
  parseCandidatesCsv,
} from "@/lib/hiring/assessments/scheduledAssessmentsData";
import type { ExpiryWindowHours } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { cn } from "@/lib/utils";

function downloadCsvTemplate() {
  const blob = new Blob([CSV_TEMPLATE_CONTENT], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "assessment-candidates-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function ScheduleAssessmentDialog({
  open,
  onOpenChange,
  onScheduled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: () => void;
}) {
  const assessments = getAllAssessments().filter((a) => a.enabled && a.status !== "Draft");

  const [fileName, setFileName] = useState<string | null>(null);
  const [candidateCount, setCandidateCount] = useState(0);
  const [csvCandidates, setCsvCandidates] = useState<{ name: string; email: string; linkedinUrl?: string }[]>([]);
  const [assessmentId, setAssessmentId] = useState<string | undefined>(undefined);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [expiryHours, setExpiryHours] = useState<ExpiryWindowHours>(24);
  const [sendInstruction, setSendInstruction] = useState(true);
  const [sendReminder, setSendReminder] = useState(true);
  const [sendExpiry, setSendExpiry] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const reset = useCallback(() => {
    setFileName(null);
    setCandidateCount(0);
    setCsvCandidates([]);
    setAssessmentId(undefined);
    setScheduledDate("");
    setScheduledTime("");
    setExpiryHours(24);
    setSendInstruction(true);
    setSendReminder(true);
    setSendExpiry(true);
  }, []);

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a .csv file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const { candidates, errors } = parseCandidatesCsv(text);
      if (errors.length) {
        toast.error(errors[0]);
        return;
      }
      setFileName(file.name);
      setCsvCandidates(candidates);
      setCandidateCount(candidates.length);
    };
    reader.readAsText(file);
  };

  const handleSchedule = () => {
    if (!csvCandidates.length) {
      toast.error("Upload a candidates CSV first");
      return;
    }
    if (!assessmentId) {
      toast.error("Choose an assessment");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Set schedule date and time");
      return;
    }

    addScheduledAssessment({
      assessmentId,
      scheduledDate,
      scheduledTime,
      expiryWindowHours: expiryHours,
      sendInstructionEmail: sendInstruction,
      sendReminderBefore: sendReminder,
      sendExpiryReminder: sendExpiry,
      candidates: csvCandidates,
    });

    toast.success("Assessment scheduled successfully");
    reset();
    onOpenChange(false);
    onScheduled?.();
  };

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
              "flex max-h-[min(90vh,720px)] w-full max-w-[634px] flex-col overflow-hidden rounded-[20px]",
              "border border-white/60 bg-white/95 shadow-[0_24px_80px_-24px_rgba(var(--accent-rgb),0.35)] backdrop-blur-xl",
              "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
              "dark:border-white/10 dark:bg-[#141416]/95",
            )}
          >
            <div className="relative shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.08),transparent)] px-5 py-4 dark:border-white/[0.06]">
              <DialogTitle className="pr-8 text-[1.0625rem] font-semibold tracking-[-0.03em] text-text">
                Schedule Assessment
              </DialogTitle>
              <p className="mt-1 text-[12px] leading-snug text-muted">
                Upload candidates, pick an assessment, and set the live window.
              </p>
              <DialogClose className={cn("absolute right-3 top-3", dialogCloseButtonSm)} aria-label="Close">
                <X className="h-4 w-4" strokeWidth={2} />
              </DialogClose>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label className="text-[12px]">Upload Candidates CSV</Label>
                  <label
                    className={cn(
                      "flex cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed px-4 py-6 text-center transition-colors",
                      dragOver
                        ? "border-accent/40 bg-accent/[0.05]"
                        : "border-[rgba(15,23,42,0.12)] bg-[rgba(15,23,42,0.02)] hover:border-[rgb(var(--accent-rgb)/0.25)] hover:bg-[rgb(var(--accent-rgb)/0.03)]",
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
                      if (file) processFile(file);
                    }}
                  >
                    <Upload className="h-5 w-5 text-accent/70" strokeWidth={1.5} />
                    <span className="mt-2 text-[12px] font-medium text-text">
                      {fileName ?? "Drag & drop CSV or click to upload"}
                    </span>
                    <span className="mt-0.5 text-[11px] text-muted">.csv only</span>
                    {candidateCount > 0 ? (
                      <span className="mt-2 text-[11px] font-semibold text-accent">
                        {candidateCount} candidate{candidateCount === 1 ? "" : "s"} ready
                      </span>
                    ) : null}
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processFile(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 w-full gap-1.5 rounded-[10px] text-[12px]"
                    onClick={downloadCsvTemplate}
                  >
                    <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Download CSV Template
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[12px]">Choose Assessment</Label>
                  <Select value={assessmentId} onValueChange={setAssessmentId}>
                    <SelectTrigger className="h-9 rounded-[10px]">
                      <SelectValue placeholder="Select assessment" />
                    </SelectTrigger>
                    <SelectContent className="z-[260]">
                      {assessments.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="schedule-date" className="text-[12px]">
                      Schedule Date
                    </Label>
                    <DatePicker
                      id="schedule-date"
                      value={scheduledDate}
                      onChange={setScheduledDate}
                      placeholder="Pick date"
                      disablePast
                      className="h-9 text-[13px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="schedule-time" className="text-[12px]">
                      Schedule Time
                    </Label>
                    <TimePicker
                      id="schedule-time"
                      value={scheduledTime}
                      onChange={setScheduledTime}
                      placeholder="Pick time"
                      className="h-9 text-[13px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[12px]">Expiry Window</Label>
                  <Select
                    value={String(expiryHours)}
                    onValueChange={(v) => setExpiryHours(Number(v) as ExpiryWindowHours)}
                  >
                    <SelectTrigger className="h-9 rounded-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[260]">
                      {EXPIRY_WINDOW_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={String(o.value)}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5 rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] p-3 dark:bg-white/[0.03]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Communication</p>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <Checkbox checked={sendInstruction} onCheckedChange={(c) => setSendInstruction(c === true)} />
                    <span className="text-[12px] text-text">Send instruction email</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <Checkbox checked={sendReminder} onCheckedChange={(c) => setSendReminder(c === true)} />
                    <span className="text-[12px] text-text">Send reminder before assessment</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <Checkbox checked={sendExpiry} onCheckedChange={(c) => setSendExpiry(c === true)} />
                    <span className="text-[12px] text-text">Send expiry reminder</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
              <Button type="button" variant="outline" className="rounded-[10px]" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-[10px] bg-accent text-white hover:bg-accent-hover"
                onClick={handleSchedule}
              >
                Schedule Assessment
              </Button>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
