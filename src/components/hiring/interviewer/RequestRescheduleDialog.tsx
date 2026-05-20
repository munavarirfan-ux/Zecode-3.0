"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewerAssignedInterviewRow } from "@/lib/hiring/interviewerInterviews";

export function RequestRescheduleDialog({
  open,
  onOpenChange,
  row,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: InterviewerAssignedInterviewRow | null;
  onSubmit: (payload: {
    reason: string;
    preferredDates: string;
    preferredTimes: string;
    notifyTeam: boolean;
  }) => void;
}) {
  const [reason, setReason] = useState("");
  const [preferredDates, setPreferredDates] = useState("");
  const [preferredTimes, setPreferredTimes] = useState("");
  const [notifyTeam, setNotifyTeam] = useState(true);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setReason("");
      setPreferredDates("");
      setPreferredTimes("");
      setNotifyTeam(true);
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    if (!reason.trim()) return;
    onSubmit({
      reason: reason.trim(),
      preferredDates: preferredDates.trim(),
      preferredTimes: preferredTimes.trim(),
      notifyTeam,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Interview Reschedule</DialogTitle>
          <DialogDescription>
            {row
              ? `${row.candidate.name} · ${row.jobRole} · ${row.round}. Admins will review and reschedule officially.`
              : "Submit a reschedule request to your hiring team."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-text" htmlFor="reschedule-reason">
              Reason for reschedule
            </label>
            <Textarea
              id="reschedule-reason"
              placeholder="e.g. Scheduling conflict, personal emergency, calendar overlap…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] text-[13px]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-text" htmlFor="preferred-dates">
              Preferred new availability <span className="font-normal text-muted">(optional)</span>
            </label>
            <Input
              id="preferred-dates"
              placeholder="Date suggestions, e.g. May 22–24"
              value={preferredDates}
              onChange={(e) => setPreferredDates(e.target.value)}
              className="h-9 text-[13px]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-text" htmlFor="preferred-times">
              Time suggestions <span className="font-normal text-muted">(optional)</span>
            </label>
            <Input
              id="preferred-times"
              placeholder="e.g. 10:00–12:00 CET"
              value={preferredTimes}
              onChange={(e) => setPreferredTimes(e.target.value)}
              className="h-9 text-[13px]"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-text-secondary">
            <Checkbox checked={notifyTeam} onCheckedChange={(v) => setNotifyTeam(v === true)} />
            Notify hiring team
          </label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-accent text-white hover:bg-accent-hover"
            disabled={!reason.trim()}
            onClick={handleSubmit}
          >
            Submit Reschedule Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
