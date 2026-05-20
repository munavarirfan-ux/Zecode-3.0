"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonSm,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getPreviewActorLabel } from "@/lib/hiring/feedbackPermissions";
import {
  approveTransferRequest,
  getTransferRequest,
  rejectTransferRequest,
  type TransferRequest,
} from "@/lib/hiring/transferRequests";
import { useRole } from "@/context/RoleContext";

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="mt-1 text-[13px] font-medium text-text">{value}</dd>
    </div>
  );
}

export function TransferRequestReviewDialog({
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
  const { selectedRole } = useRole();
  const [request, setRequest] = useState<TransferRequest | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectNote, setShowRejectNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && requestId) {
      setRequest(getTransferRequest(requestId) ?? null);
      setRejectNote("");
      setShowRejectNote(false);
      setSubmitting(false);
    }
  }, [open, requestId]);

  const resolvedBy = getPreviewActorLabel(selectedRole);

  function handleApprove() {
    if (!request) return;
    setSubmitting(true);
    const result = approveTransferRequest(request.id, resolvedBy);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Applicant moved successfully");
    onResolved?.();
    onOpenChange(false);
  }

  function handleReject() {
    if (!request) return;
    if (!showRejectNote) {
      setShowRejectNote(true);
      return;
    }
    setSubmitting(true);
    const result = rejectTransferRequest(request.id, resolvedBy, rejectNote);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Transfer request rejected");
    onResolved?.();
    onOpenChange(false);
  }

  if (!request) return null;

  const isPending = request.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[240] bg-[rgba(15,23,42,0.25)] backdrop-blur-[2px]" />
        <div className="fixed inset-0 z-[240] flex justify-end p-0 sm:p-3">
          <DialogPanel
            className={cn(
              "flex h-[100dvh] w-full flex-col overflow-hidden rounded-none border-l border-[rgba(15,23,42,0.08)] bg-white/95 shadow-[-12px_0_40px_-20px_rgba(15,23,42,0.12)] backdrop-blur-md",
              "sm:h-auto sm:w-[420px] sm:max-h-[min(640px,calc(100dvh-1.5rem))] sm:rounded-[16px] sm:border",
            )}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[rgba(15,23,42,0.06)] px-5 py-4">
              <div>
                <DialogTitle className="text-[15px] font-semibold tracking-[-0.02em]">
                  Review transfer request
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-[12px] text-muted">
                  {request.candidateName}
                </DialogDescription>
              </div>
              <DialogClose className={dialogCloseButtonSm} aria-label="Close">
                <X className="h-4 w-4" strokeWidth={2} />
              </DialogClose>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className="rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB]/90 p-4">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">From</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-text">{request.fromJobTitle}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1 text-right">
                    <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">To</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-text">{request.toJobTitle}</p>
                  </div>
                </div>
              </div>

              {!isPending ? (
                <p className="rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-3 py-2 text-[12px] text-muted">
                  This request was {request.status}.
                  {request.resolvedBy ? ` · ${request.resolvedBy}` : ""}
                </p>
              ) : null}

              <dl className="space-y-3.5">
                <ReviewField label="Requested by" value={request.requestedBy} />
                <ReviewField label="Current job" value={request.fromJobTitle} />
                <ReviewField label="Requested job" value={request.toJobTitle} />
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">Reason</dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-text-secondary">{request.reason}</dd>
                </div>
                <ReviewField label="Submitted" value={formatTimestamp(request.createdAt)} />
              </dl>

              {showRejectNote ? (
                <div className="space-y-2">
                  <label htmlFor="reject-note" className="text-[12px] font-medium text-text">
                    Rejection note <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <Textarea
                    id="reject-note"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Share context with the requesting admin…"
                    rows={2}
                    className="min-h-[64px] resize-none text-[13px]"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
              <Button
                type="button"
                variant="outline"
                className="h-9 flex-1 rounded-[9px] text-[13px]"
                disabled={submitting || !isPending}
                onClick={handleReject}
              >
                {showRejectNote ? (submitting ? "Rejecting…" : "Confirm reject") : "Reject"}
              </Button>
              <Button
                type="button"
                className="h-9 flex-1 rounded-[9px] bg-forest text-[13px] text-white hover:bg-forest/90"
                disabled={submitting || !isPending}
                onClick={handleApprove}
              >
                {submitting ? "Approving…" : "Approve transfer"}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
