"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createMoveToInterviewRequest } from "@/lib/hiring/moveToInterviewApproval";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";

const INTERVIEW_STAGES = [
  "Technical Round 1",
  "Technical Round 2",
  "HR Round",
  "Final Round",
] as const;

type InterviewStage = (typeof INTERVIEW_STAGES)[number];

export interface RequestMoveToInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate | null;
  job: HiringJob;
  requestedBy: string;
  onSubmitted?: () => void;
}

export function RequestMoveToInterviewDialog({
  open,
  onOpenChange,
  candidate,
  job,
  requestedBy,
  onSubmitted,
}: RequestMoveToInterviewDialogProps) {
  const [interviewStage, setInterviewStage] = useState<InterviewStage>("Technical Round 1");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setInterviewStage("Technical Round 1");
    setNote("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  async function handleSubmit() {
    if (!candidate) return;
    setSubmitting(true);
    try {
      await createMoveToInterviewRequest({
        candidateId: candidate.id,
        candidateName: candidate.name,
        jobId: job.id,
        jobTitle: job.title,
        requestedBy,
        requestedStage: interviewStage,
        requestNote: note.trim(),
      });
      toast("Move request sent to Super Admin.", {
        description: "Email sent to Super Admin.",
      });
      resetForm();
      onOpenChange(false);
      onSubmitted?.();
    } finally {
      setSubmitting(false);
    }
  }

  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request move to interview stage</DialogTitle>
          <DialogDescription>
            Choose the interview stage and send this request to a Super Admin for approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">
              Candidate:{" "}
              <span className="font-medium text-foreground">{candidate.name}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interview-stage">Interview stage</Label>
            <Select
              value={interviewStage}
              onValueChange={(v) => setInterviewStage(v as InterviewStage)}
            >
              <SelectTrigger id="interview-stage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-note">
              Request note{" "}
              <span className={cn("text-xs text-muted-foreground")}>(optional)</span>
            </Label>
            <Textarea
              id="request-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add context for the Super Admin..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
