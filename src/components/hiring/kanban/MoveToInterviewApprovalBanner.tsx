"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type MoveToInterviewRequest,
  approveMoveToInterviewRequest,
  rejectMoveToInterviewRequest,
} from "@/lib/hiring/moveToInterviewApproval";

// ---------------------------------------------------------------------------
// RejectModal — inline confirm dialog for rejection
// ---------------------------------------------------------------------------

function RejectModal({
  reviewerName,
  requestedBy,
  onConfirm,
  onCancel,
  submitting,
}: {
  reviewerName: string;
  requestedBy: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="mt-3 rounded-lg border border-red-200/70 bg-red-50/60 p-4 dark:border-red-800/40 dark:bg-red-950/30">
      <p className="mb-2 text-[13px] font-medium text-red-800 dark:text-red-300">
        Reject this request?
      </p>
      <textarea
        className={cn(
          "w-full resize-none rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-text",
          "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-400/30",
        )}
        rows={3}
        placeholder="Optional reason for rejection…"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        disabled={submitting}
      />
      <div className="mt-3 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={submitting}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          className="border border-red-500 bg-transparent text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/40"
          disabled={submitting}
          onClick={() => onConfirm(reason.trim())}
        >
          {submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          Reject Request
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MoveToInterviewApprovalBanner
// ---------------------------------------------------------------------------

export interface MoveToInterviewApprovalBannerProps {
  request: MoveToInterviewRequest;
  reviewerName: string;
  onDecision?: () => void;
}

export function MoveToInterviewApprovalBanner({
  request,
  reviewerName,
  onDecision,
}: MoveToInterviewApprovalBannerProps) {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  async function handleApprove() {
    setApproving(true);
    try {
      await approveMoveToInterviewRequest(request.id, reviewerName);
      toast.success("Candidate moved to interview stage.", {
        description: `Email sent to ${request.requestedBy}.`,
      });
      onDecision?.();
    } finally {
      setApproving(false);
    }
  }

  async function handleRejectConfirm(reason: string) {
    setRejecting(true);
    try {
      await rejectMoveToInterviewRequest(request.id, reviewerName, reason);
      toast.success("Move request rejected.", {
        description: `Email sent to ${request.requestedBy}.`,
      });
      setRejectOpen(false);
      onDecision?.();
    } finally {
      setRejecting(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-amber-200/60 bg-amber-50/80 px-4 py-3",
        "dark:border-amber-700/40 dark:bg-amber-950/30",
      )}
    >
      {/* Header */}
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
        Move to Interview Request
      </p>

      {/* Details */}
      <dl className="space-y-1.5 text-sm">
        <div className="flex gap-2">
          <dt className="w-36 shrink-0 text-amber-700/70 dark:text-amber-400/70">Requested by</dt>
          <dd className="font-medium text-text">{request.requestedBy}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-36 shrink-0 text-amber-700/70 dark:text-amber-400/70">
            Requested stage
          </dt>
          <dd className="font-medium text-text">{request.requestedStage}</dd>
        </div>
        {request.requestNote && (
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-amber-700/70 dark:text-amber-400/70">
              Request note
            </dt>
            <dd className="text-text-secondary">{request.requestNote}</dd>
          </div>
        )}
      </dl>

      {/* Actions */}
      {!rejectOpen && (
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            size="sm"
            className="bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500/30 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            disabled={approving || rejecting}
            onClick={handleApprove}
          >
            {approving ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="mr-1.5 h-3.5 w-3.5" />
            )}
            Approve
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-red-400 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/40"
            disabled={approving || rejecting}
            onClick={() => setRejectOpen(true)}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      )}

      {/* Inline reject modal */}
      {rejectOpen && (
        <RejectModal
          reviewerName={reviewerName}
          requestedBy={request.requestedBy}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectOpen(false)}
          submitting={rejecting}
        />
      )}
    </div>
  );
}
