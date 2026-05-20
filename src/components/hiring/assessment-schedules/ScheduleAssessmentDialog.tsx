"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
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
import { getAllAssessments } from "@/lib/hiring/assessments/assessmentStore";
import { addSchedule } from "@/lib/hiring/assessments/scheduleStore";
import type { AssessmentScheduleRecord } from "@/lib/hiring/assessments/scheduleTypes";
import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ScheduleAssessmentDialog({
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | undefined>(undefined);
  const [expiry, setExpiry] = useState("");
  const [reminder, setReminder] = useState("daily");

  const selectedAssessment = assessments.find((x) => x.id === assessmentId);

  const reset = () => {
    setName("");
    setEmail("");
    setLinkedin("");
    setResumeName(null);
    setAssessmentId(undefined);
    setExpiry("");
    setReminder("daily");
  };

  const submit = () => {
    const a = selectedAssessment;
    if (!name.trim() || !email.trim() || !a || !expiry) {
      toast.error("Complete all required fields");
      return;
    }
    const record: AssessmentScheduleRecord = {
      id: `sch-${Date.now()}`,
      tab: "upcoming",
      assessmentId: a.id,
      assessmentName: a.name,
      role: a.role,
      durationMinutes: a.config.durationMinutes,
      candidateId: `sch-cand-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      linkedin: linkedin.trim() || undefined,
      resumeUrl: resumeName ? "/resumes/demo.pdf" : undefined,
      recruiter: "You",
      inviteSentAt: "May 20, 2026",
      expiryDate: expiry,
      attemptWindow: `May 20 – ${expiry}`,
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
    toast.success(`Invite sent to ${name.trim()}`);
    reset();
    onScheduled?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogPortal>
        <DialogOverlay className="z-[130]" />
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <DialogPanel
            className={cn(
              "w-full max-w-[480px] overflow-hidden rounded-[20px] border border-white/60 bg-white/95 p-0 shadow-[0_24px_80px_-24px_rgba(var(--accent-rgb),0.35)] backdrop-blur-xl",
              "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
            )}
          >
            <div className="border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.08),transparent)] px-5 py-4">
              <DialogTitle className="text-[1.0625rem] font-semibold tracking-[-0.03em]">Schedule assessment</DialogTitle>
              <p className="mt-1 text-[12px] text-muted">Send a single candidate invite with expiry and reminders.</p>
            </div>
            <div className="space-y-3.5 px-5 py-4">
              <div className="space-y-1.5">
                <Label className="text-[12px]">Candidate name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-[10px]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px]">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-[10px]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px]">LinkedIn URL</Label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="rounded-[10px]" placeholder="linkedin.com/in/…" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px]">Resume</Label>
                <label className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-dashed border-[rgba(15,23,42,0.12)] px-3 py-2.5 text-[12px] text-muted hover:bg-[#FAFAFB]">
                  <Upload className="h-4 w-4" />
                  {resumeName ?? "Upload resume (PDF)"}
                  <input type="file" className="sr-only" accept=".pdf" onChange={(e) => setResumeName(e.target.files?.[0]?.name ?? null)} />
                </label>
              </div>
              <div className="space-y-1.5">
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
                    <SelectContent className="z-[250]">
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
              <div className="space-y-1.5">
                <Label className="text-[12px]">Expiry date</Label>
                <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="rounded-[10px]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px]">Reminder settings</Label>
                <Select value={reminder} onValueChange={setReminder}>
                  <SelectTrigger className="rounded-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[250]">
                    <SelectItem value="daily">Daily until expiry</SelectItem>
                    <SelectItem value="48h">Every 48 hours</SelectItem>
                    <SelectItem value="once">Once, 24h before expiry</SelectItem>
                    <SelectItem value="none">No reminders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
              <Button type="button" variant="outline" className="rounded-[10px]" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" className="rounded-[10px] bg-accent text-white hover:bg-accent-hover" onClick={submit}>
                Send invite
              </Button>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
