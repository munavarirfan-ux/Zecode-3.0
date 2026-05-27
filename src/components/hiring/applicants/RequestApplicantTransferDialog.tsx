"use client";

import { useMemo, useState } from "react";
import { Briefcase, MapPin, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { getPreviewActorLabel } from "@/lib/hiring/feedbackPermissions";
import { getActiveJobsForMove } from "@/lib/hiring/mockData";
import { submitTransferRequest } from "@/lib/hiring/transferRequests";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { useRole } from "@/context/RoleContext";

export function RequestApplicantTransferDialog({
  open,
  onOpenChange,
  candidate,
  currentJob,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate;
  currentJob: HiringJob;
  onSubmitted?: () => void;
}) {
  const { selectedRole } = useRole();
  const [query, setQuery] = useState("");
  const [targetJobId, setTargetJobId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableJobs = useMemo(() => getActiveJobsForMove(currentJob.id), [currentJob.id]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableJobs;
    return availableJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q),
    );
  }, [availableJobs, query]);

  const targetJob = useMemo(
    () => (targetJobId ? availableJobs.find((j) => j.id === targetJobId) : undefined),
    [availableJobs, targetJobId],
  );

  const reset = () => {
    setQuery("");
    setTargetJobId(null);
    setReason("");
    setSubmitting(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!targetJobId || !targetJob) return;
    if (!reason.trim()) {
      toast.error("Please provide a reason for the transfer");
      return;
    }

    setSubmitting(true);
    const result = submitTransferRequest({
      candidateId: candidate.id,
      candidateName: candidate.name,
      fromJobId: currentJob.id,
      fromJobTitle: currentJob.title,
      toJobId: targetJobId,
      toJobTitle: targetJob.title,
      reason: reason.trim(),
      requestedBy: getPreviewActorLabel(selectedRole),
    });
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Transfer request sent to Super Admin");
    onSubmitted?.();
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        overlayClassName="z-[220]"
        className="z-[220] flex max-h-[min(90dvh,600px)] w-[calc(100vw-2rem)] max-w-[480px] flex-col gap-0 overflow-hidden border-[rgba(15,23,42,0.06)] bg-white/95 p-0 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.18)] backdrop-blur-md"
      >
        <DialogHeader className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5">
          <DialogTitle className="text-[1rem] font-semibold tracking-[-0.02em]">
            Request applicant transfer
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-text-secondary/90">
            Submit a transfer request for Super Admin approval. You cannot move applicants directly.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB]/80 px-3.5 py-3">
            <p className="text-[13px] font-semibold text-text">{candidate.name}</p>
            <p className="mt-0.5 text-[12px] text-muted">Current job · {currentJob.title}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="transfer-job-search" className="text-[12px] font-medium text-text">
              Destination job
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
              <Input
                id="transfer-job-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs…"
                className="h-9 pl-9 text-[13px]"
              />
            </div>
            <ul className="max-h-[180px] space-y-1 overflow-y-auto pr-0.5" role="listbox" aria-label="Destination jobs">
              {filteredJobs.length === 0 ? (
                <li className="list-none">
                  <LineArtEmptyState
                    illustration="transfer"
                    message="No jobs match your search."
                    size="compact"
                    className="rounded-[10px] border border-dashed border-[rgba(15,23,42,0.08)]"
                  />
                </li>
              ) : (
                filteredJobs.map((j) => {
                  const selected = targetJobId === j.id;
                  return (
                    <li key={j.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => setTargetJobId(j.id)}
                        className={cn(
                          "w-full rounded-[10px] border px-3 py-2.5 text-left transition-colors",
                          selected
                            ? "border-forest/25 bg-forest/[0.04] ring-1 ring-forest/15"
                            : "border-[rgba(15,23,42,0.06)] bg-white hover:bg-[#FAFAFB]",
                        )}
                      >
                        <p className="text-[13px] font-medium text-text">{j.title}</p>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-muted">
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {j.department}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {j.location}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="transfer-reason" className="text-[12px] font-medium text-text">
              Reason for transfer
            </label>
            <Textarea
              id="transfer-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Better skill alignment, role mismatch, internal recommendation…"
              rows={3}
              className="min-h-[80px] resize-none text-[13px]"
            />
          </div>
        </div>

        <DialogFooter className="mt-0 shrink-0 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="h-9 rounded-[9px]" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="h-9 rounded-[9px] bg-forest text-white hover:bg-forest/90"
            disabled={submitting || !targetJobId || !reason.trim()}
            onClick={handleSubmit}
          >
            {submitting ? "Sending…" : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
