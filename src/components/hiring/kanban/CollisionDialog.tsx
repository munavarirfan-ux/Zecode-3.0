"use client";

import { Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HiringCandidate } from "@/lib/hiring/types";
import { getCandidateOwner } from "@/lib/hiring/ownership";

export function CollisionDialog({
  open,
  onOpenChange,
  candidate,
  onRequestTransfer,
  onViewProfile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate | null;
  onRequestTransfer: () => void;
  onViewProfile: () => void;
}) {
  if (!candidate) return null;
  const { ownerName } = getCandidateOwner(candidate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border-subtle px-5 py-4">
          <DialogTitle className="text-base font-semibold">
            Candidate already engaged
          </DialogTitle>
          <DialogDescription className="text-sm text-muted">
            {candidate.name} is currently being managed by {ownerName}. You cannot shortlist
            them to your pipeline directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 px-5 py-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border border-border-subtle px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-2"
            onClick={() => {
              onOpenChange(false);
              onRequestTransfer();
            }}
          >
            <Send className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
            <span>
              Request transfer from <span className="font-medium">{ownerName}</span>
            </span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border border-border-subtle px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-2"
            onClick={() => {
              onOpenChange(false);
              onViewProfile();
            }}
          >
            <Eye className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />
            <span>View profile (read-only)</span>
          </button>
        </div>

        <DialogFooter className="border-t border-border-subtle px-5 py-3 sm:justify-between">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onRequestTransfer}>
            Request transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
