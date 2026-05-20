"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAssessmentCandidate } from "@/lib/hiring/assessments/assessmentCandidates";
import { cn } from "@/lib/utils";
import { AssessmentModalDrawer } from "./AssessmentModalDrawer";

export function InviteCandidateDialog({
  open,
  onOpenChange,
  assessmentId,
  onInvited,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
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
    addAssessmentCandidate(assessmentId, {
      name: name.trim(),
      email: email.trim(),
      linkedin: linkedin.trim() || undefined,
    });
    toast.success(`Invite sent to ${name.trim()}`);
    reset();
    onInvited?.();
    onOpenChange(false);
  };

  return (
    <AssessmentModalDrawer
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title="Invite candidate"
      description="Add a candidate to this live assessment workspace."
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" className="rounded-[10px]" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="rounded-[10px] bg-accent text-white hover:bg-accent-hover" onClick={submit}>
            Send invite
          </Button>
        </div>
      }
    >
      <div className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="invite-name" className="text-[12px]">
            Candidate name
          </Label>
          <Input
            id="invite-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            className="h-9 rounded-[10px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="invite-email" className="text-[12px]">
            Email
          </Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@company.com"
            className="h-9 rounded-[10px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="invite-linkedin" className="text-[12px]">
            LinkedIn URL
          </Label>
          <Input
            id="invite-linkedin"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="linkedin.com/in/..."
            className="h-9 rounded-[10px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Upload resume</Label>
          <label
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[rgba(15,23,42,0.12)]",
              "bg-[rgba(15,23,42,0.02)] px-4 py-6 text-center transition-colors hover:border-[rgb(var(--accent-rgb)/0.25)] hover:bg-[rgb(var(--accent-rgb)/0.03)]",
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
              onChange={(e) => {
                const f = e.target.files?.[0];
                setResumeName(f?.name ?? null);
              }}
            />
          </label>
        </div>
      </div>
    </AssessmentModalDrawer>
  );
}
