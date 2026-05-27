"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Briefcase, MapPin, Search, Users } from "lucide-react";
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
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { getActiveJobsForMove, moveApplicantToJob } from "@/lib/hiring/mockData";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";

type Step = "select" | "confirm";

export function MoveApplicantDialog({
  open,
  onOpenChange,
  candidate,
  currentJob,
  onMoved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate;
  currentJob: HiringJob;
  onMoved?: () => void;
}) {
  const [step, setStep] = useState<Step>("select");
  const [query, setQuery] = useState("");
  const [targetJobId, setTargetJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const availableJobs = useMemo(() => getActiveJobsForMove(currentJob.id), [currentJob.id]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableJobs;
    return availableJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.status.toLowerCase().includes(q),
    );
  }, [availableJobs, query]);

  const targetJob = useMemo(
    () => (targetJobId ? availableJobs.find((j) => j.id === targetJobId) : undefined),
    [availableJobs, targetJobId],
  );

  const reset = () => {
    setStep("select");
    setQuery("");
    setTargetJobId(null);
    setSubmitting(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleConfirm = () => {
    if (!targetJobId) return;
    setSubmitting(true);
    const result = moveApplicantToJob(candidate.id, targetJobId);
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Applicant moved successfully.");
    onMoved?.();
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        overlayClassName="z-[220]"
        className="z-[220] flex max-h-[min(90dvh,640px)] w-[calc(100vw-2rem)] max-w-[520px] flex-col gap-0 overflow-hidden p-0"
      >
        {step === "select" ? (
          <>
            <DialogHeader className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5 sm:px-6">
              <DialogTitle className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
                Move applicant
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-relaxed text-text-secondary/90">
                Move this applicant directly to another active job pipeline.
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
              <div className="rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-3.5 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
                <p className="text-[14px] font-semibold tracking-[-0.02em] text-text">{candidate.name}</p>
                <dl className="mt-2 space-y-1 text-[12px] text-text-secondary">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Current job</dt>
                    <dd className="text-right font-medium text-text">{currentJob.title}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Stage</dt>
                    <dd className="text-right font-medium text-text">
                      {candidate.currentStage} · {candidate.currentSubstage}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-2">
                <label htmlFor="move-job-search" className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Search jobs
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
                  <Input
                    id="move-job-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, department, or location…"
                    className="h-9 pl-9 text-[13px]"
                  />
                </div>
              </div>

              <ul className="max-h-[240px] space-y-1.5 overflow-y-auto pr-0.5" role="listbox" aria-label="Available jobs">
                {filteredJobs.length === 0 ? (
                  <li className="list-none">
                    <LineArtEmptyState
                      illustration="search"
                      message="No active jobs match your search."
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
                            "w-full rounded-[12px] border px-3.5 py-3 text-left transition-colors duration-150",
                            selected
                              ? "border-accent/30 bg-accent/5 ring-1 ring-accent/20"
                              : "border-[rgba(15,23,42,0.06)] bg-white hover:border-[rgba(15,23,42,0.1)] hover:bg-[#FAFAFB] dark:border-white/[0.06] dark:bg-surface dark:hover:bg-white/[0.03]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[13px] font-semibold text-text">{j.title}</p>
                            <span className="shrink-0 rounded-full border border-[rgba(15,23,42,0.06)] bg-[#F4F4F5] px-2 py-0.5 text-[10px] font-medium text-text-secondary dark:border-white/[0.06] dark:bg-white/[0.04]">
                              {j.status}
                            </span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted">
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="h-3 w-3" strokeWidth={1.5} />
                              {j.department}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" strokeWidth={1.5} />
                              {j.location}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3 w-3" strokeWidth={1.5} />
                              {j.candidateCount} applicants
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

            <DialogFooter className="mt-0 shrink-0 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 sm:px-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={!targetJobId} onClick={() => setStep("confirm")}>
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5 sm:px-6">
              <DialogTitle className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
                Confirm applicant move
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-relaxed text-text-secondary/90">
                Are you sure you want to move{" "}
                <span className="font-medium text-text">{candidate.name}</span> from &ldquo;
                {currentJob.title}&rdquo; to &ldquo;{targetJob?.title}&rdquo;?
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
              <div className="rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-white p-4 dark:border-white/[0.06] dark:bg-surface">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">From</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-text">{currentJob.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1 text-right">
                    <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">To</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-text">{targetJob?.title}</p>
                  </div>
                </div>
              </div>

              <p className="rounded-[10px] border border-amber-200/80 bg-amber-50/90 px-3.5 py-3 text-[12px] leading-relaxed text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100/90">
                This applicant will be removed from the current job workflow and added to the selected job&apos;s default
                applicant stage.
              </p>
            </div>

            <DialogFooter className="mt-0 shrink-0 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 sm:px-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setStep("select")} disabled={submitting}>
                Back
              </Button>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={submitting || !targetJobId}
                onClick={handleConfirm}
              >
                {submitting ? "Moving…" : "Confirm move"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
