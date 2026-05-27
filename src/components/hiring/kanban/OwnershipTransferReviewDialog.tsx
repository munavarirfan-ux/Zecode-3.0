"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getOwnershipTransferRequest,
  respondToOwnershipTransferRequest,
} from "@/lib/hiring/ownershipTransferRequests";
import type { OwnershipTransferRequest } from "@/lib/hiring/types";

export function OwnershipTransferReviewDialog({
  open,
  onOpenChange,
  requestId,
  onResolved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string | null;
  onResolved?: () => void;
}) {
  const [request, setRequest] = useState<OwnershipTransferRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && requestId) {
      setRequest(getOwnershipTransferRequest(requestId) ?? null);
      setSubmitting(false);
    }
  }, [open, requestId]);

  function handleRespond(status: "approved" | "declined") {
    if (!request) return;
    setSubmitting(true);
    const res = respondToOwnershipTransferRequest(request.id, status);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(
      status === "approved"
        ? `Transfer approved — ${request.candidateName} moved`
        : "Transfer declined",
    );
    onResolved?.();
    onOpenChange(false);
  }

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ownership transfer request</DialogTitle>
          <DialogDescription>
            {request.toRecruiterName} wants to shortlist {request.candidateName} (you are the
            owner).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p>
            <span className="text-muted">Target: </span>
            {request.targetStage}
            {request.targetSubstage ? ` · ${request.targetSubstage}` : ""}
            {request.priority ? " · High priority" : ""}
          </p>
          <p className="rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-text-secondary">
            {request.reason}
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => handleRespond("declined")}
          >
            Decline
          </Button>
          <Button type="button" disabled={submitting} onClick={() => handleRespond("approved")}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
