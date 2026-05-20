"use client";

import { useState } from "react";
import { Copy, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { AssessmentRecord } from "@/lib/hiring/assessments/types";

export function ShareAssessmentDialog({
  open,
  onOpenChange,
  assessment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: AssessmentRecord | null;
}) {
  const [emails, setEmails] = useState("");

  if (!assessment) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(assessment.shareLink);
      toast.success("Assessment link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[16px]">
        <DialogHeader>
          <DialogTitle>Share assessment</DialogTitle>
          <DialogDescription>{assessment.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-[12px] font-medium text-muted">Public assessment link</p>
            <div className="flex gap-2">
              <Input readOnly value={assessment.shareLink} className="h-9 text-[12px]" />
              <Button type="button" variant="outline" size="sm" className="h-9 shrink-0 gap-1" onClick={copyLink}>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[12px] font-medium text-muted">Invite by email</p>
            <Input
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="candidate@email.com, …"
              className="h-9 text-[13px]"
            />
          </div>
          <Button
            type="button"
            className="w-full gap-1.5 bg-accent text-white hover:bg-accent-hover"
            onClick={() => {
              toast.success("Invitations queued", { description: assessment.name });
              onOpenChange(false);
            }}
          >
            <Link2 className="h-4 w-4" />
            Send invitations
          </Button>
          <p className="text-[11px] text-muted">
            You can also upload a candidate list or share with job applicants from the assessment detail page.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
