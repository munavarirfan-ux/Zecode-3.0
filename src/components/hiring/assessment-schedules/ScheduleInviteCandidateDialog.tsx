"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  dialogCloseButtonSm,
} from "@/components/ui/dialog";
import { addScheduledCandidate } from "@/lib/hiring/assessments/scheduledAssessmentsData";
import { cn } from "@/lib/utils";

export function ScheduleInviteCandidateDialog({
  open,
  onOpenChange,
  scheduleId,
  onInvited,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: string;
  onInvited?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resumeName, setResumeName] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setLinkedin("");
    setResumeName(null);
  };

  const submit = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    addScheduledCandidate(scheduleId, {
      name: name.trim(),
      email: email.trim(),
      linkedinUrl: linkedin.trim() || undefined,
    });
    toast.success(`Invite sent to ${name.trim()}`);
    reset();
    onInvited?.();
    onOpenChange(false);
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
              "flex w-full max-w-[480px] flex-col overflow-hidden rounded-[20px]",
              "border border-white/60 bg-white/95 shadow-[0_24px_80px_-24px_rgba(var(--accent-rgb),0.35)] backdrop-blur-xl",
              "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
            )}
          >
            <div className="relative shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.08),transparent)] px-5 py-4">
              <DialogTitle className="pr-8 text-[1.0625rem] font-semibold tracking-[-0.03em] text-text">
                Invite candidate
              </DialogTitle>
              <p className="mt-1 text-[12px] text-muted">Add a candidate to this scheduled assessment.</p>
              <DialogClose className={cn("absolute right-3 top-3", dialogCloseButtonSm)} aria-label="Close">
                <X className="h-4 w-4" strokeWidth={2} />
              </DialogClose>
            </div>

            <div className="space-y-3.5 px-5 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="sch-invite-name" className="text-[12px]">
                  Candidate name
                </Label>
                <Input
                  id="sch-invite-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="h-9 rounded-[10px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sch-invite-email" className="text-[12px]">
                  Email
                </Label>
                <Input
                  id="sch-invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="h-9 rounded-[10px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sch-invite-linkedin" className="text-[12px]">
                  LinkedIn URL <span className="font-normal text-muted">(optional)</span>
                </Label>
                <Input
                  id="sch-invite-linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/..."
                  className="h-9 rounded-[10px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px]">
                  Resume <span className="font-normal text-muted">(optional)</span>
                </Label>
                <label
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[rgba(15,23,42,0.12)]",
                    "bg-[rgba(15,23,42,0.02)] px-4 py-5 text-center hover:border-[rgb(var(--accent-rgb)/0.25)] hover:bg-[rgb(var(--accent-rgb)/0.03)]",
                  )}
                >
                  <Upload className="h-5 w-5 text-accent/70" strokeWidth={1.5} />
                  <span className="mt-2 text-[12px] font-medium text-text">
                    {resumeName ?? "Drop PDF or click to upload"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => setResumeName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
              <Button type="button" variant="outline" className="rounded-[10px]" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-[10px] bg-accent text-white hover:bg-accent-hover"
                onClick={submit}
              >
                Send Invite
              </Button>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
