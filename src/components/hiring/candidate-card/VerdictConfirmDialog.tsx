"use client";

import { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CandidateVerdict } from "@/lib/hiring/types";

export function VerdictConfirmDialog({
  open,
  onOpenChange,
  candidateName,
  verdict,
  onConfirm,
  confirming,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  verdict: Extract<CandidateVerdict, "hire" | "no_hire">;
  onConfirm: (reason: string) => void;
  confirming?: boolean;
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const isHire = verdict === "hire";
  const title = isHire
    ? `Confirm: Mark ${candidateName} as Hire`
    : `Confirm: Mark ${candidateName} as No Hire`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5 dark:border-white/[0.06]">
          <DialogTitle className="flex items-center gap-2 text-[1.0625rem] font-semibold tracking-[-0.02em]">
            {isHire ? (
              <ThumbsUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ThumbsDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            Add a short note so this verdict is accountable for the hiring team.
          </DialogDescription>
        </DialogHeader>
        <div className="px-5 py-4">
          <label htmlFor="verdict-reason" className="text-[12px] font-medium text-text-secondary">
            Reason (required)
          </label>
          <textarea
            id="verdict-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={
              isHire
                ? "Why is this candidate a hire?"
                : "Why is this candidate not moving forward?"
            }
            className="mt-2 w-full resize-none rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white px-3 py-2 text-[13px] text-text outline-none ring-accent/20 placeholder:text-muted focus-visible:ring-2 dark:border-white/[0.08] dark:bg-surface"
          />
        </div>
        <DialogFooter className="border-t border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={confirming}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            className={!isHire ? "bg-red-600 text-white hover:bg-red-700" : undefined}
            disabled={confirming || !reason.trim()}
            onClick={() => onConfirm(reason.trim())}
          >
            {confirming ? "Saving…" : isHire ? "Confirm Hire" : "Confirm No Hire"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
