"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  ClipboardList,
  Copy,
  FileCheck,
  Link2,
  Lock,
  MoreHorizontal,
  Pause,
  Pencil,
  Plus,
  Rocket,
  Share2,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getJobHiringTeamForJob,
  isHiringTeamComplete,
  TEAM_UPDATED_EVENT,
} from "@/lib/hiring/jobHiringTeam";
import { publishPersistedJob } from "@/lib/hiring/persistedJobs";
import { HeroActionButton } from "../HeroActionButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { ROUTES } from "@/config/routes";
import {
  hiringHeroCollapsedIconBtn,
  hiringHeroStripMetaChips,
  hiringTransition,
} from "../hiringTokens";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { HiringHeroWorkspace } from "../HiringHeroWorkspace";
import type { JobWorkspaceMetrics } from "./jobWorkspaceUtils";
import { getActiveHiringStage } from "./jobWorkspaceUtils";

const glassMeta =
  "inline-flex items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/78 backdrop-blur-md";

const menuContentClass = cn(
  "z-[100] w-[232px] min-w-0 overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
);

const menuItemClass = cn(
  "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0 text-[12px] font-medium",
  "outline-none transition-colors duration-150 ease-out",
  "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
);

export function JobWorkspaceHero({
  job,
  metrics,
  candidates,
  onAddCandidate,
  addCandidateButtonRef,
}: {
  job: HiringJob;
  metrics: JobWorkspaceMetrics;
  candidates: HiringCandidate[];
  onAddCandidate?: () => void;
  addCandidateButtonRef?: React.Ref<HTMLButtonElement>;
}) {
  const searchParams = useSearchParams();
  const isInterviewMode = searchParams.get("mode") === "interview";
  const hiringStage = getActiveHiringStage(job, candidates);

  const isDraft = job.status === "Draft";
  const [teamComplete, setTeamComplete] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const check = () => {
      const team = getJobHiringTeamForJob(job);
      setTeamComplete(isHiringTeamComplete(team));
    };
    check();
    window.addEventListener(TEAM_UPDATED_EVENT, check);
    return () => window.removeEventListener(TEAM_UPDATED_EVENT, check);
  }, [job]);

  async function handlePublish() {
    setPublishing(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      publishPersistedJob(job.id);
      toast.success("Job published successfully");
      setPublishModalOpen(false);
      // Trigger a page refresh to reflect new status
      window.location.reload();
    } catch {
      toast.error("Could not publish job. Please try again.");
    } finally {
      setPublishing(false);
    }
  }

  const copyJobLink = () => {
    const url = `${window.location.origin}/hiring/jobs/${job.id}`;
    void navigator.clipboard.writeText(url);
  };

  const kpis = [
    {
      label: "Applicants",
      value: metrics.totalApplicants,
      icon: Users,
      subtitle: job.candidatesThisWeek > 0 ? `+${job.candidatesThisWeek} this week` : "In pipeline",
    },
    {
      label: "Screening",
      value: metrics.screening,
      icon: ClipboardList,
      subtitle: metrics.screening > 0 ? "In review" : "Queue clear",
    },
    {
      label: "Interviews",
      value: metrics.interviews,
      icon: Calendar,
      subtitle: job.interviewsToday > 0 ? `${job.interviewsToday} today` : "None scheduled",
    },
    {
      label: "Offers",
      value: metrics.offers,
      icon: FileCheck,
      subtitle: metrics.offers > 0 ? "Pending response" : "None active",
    },
    {
      label: "Hired",
      value: metrics.hired,
      icon: BadgeCheck,
      subtitle: job.openings > metrics.hired ? `${job.openings - metrics.hired} openings left` : "Role filled",
    },
  ] as const;

  return (
    <>
    <HiringHeroWorkspace
      aria-label="Job workspace header"
      heroCollapseStorageKey="job-detail"
      defaultHeroCollapsed
      collapsedMeta={[job.department, job.location, job.workMode]}
      backHref={isInterviewMode ? ROUTES.interviews : ROUTES.hiringJobs}
      backLabel={
        <>
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          {isInterviewMode ? "Back to interviews" : "Back to jobs"}
        </>
      }
      title={job.title}
      subtitle={
        <>
          {job.department}
          <span className="mx-2 text-white/20">·</span>
          {job.location}
          <span className="mx-2 text-white/20">·</span>
          {job.workMode}
        </>
      }
      meta={
        <div className={hiringHeroStripMetaChips}>
          <span className={glassMeta}>{job.employmentType}</span>
          {isDraft ? (
            <span className={cn(glassMeta, "border-amber-400/30 bg-amber-400/15 text-amber-200")}>
              Draft · Hiring team incomplete
            </span>
          ) : (
            <span className={cn(glassMeta, "text-white/88")}>{job.status}</span>
          )}
          <span className={glassMeta}>{hiringStage}</span>
          <span className={glassMeta}>Updated {job.lastUpdatedLabel}</span>
        </div>
      }
      decorExtra={
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-[0.35] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.04%22/%3E%3C/svg%3E')]"
          aria-hidden
        />
      }
      actions={
        <>
          <HeroActionButton variant="secondary" onClick={copyJobLink}>
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Share job
          </HeroActionButton>
          <HeroActionButton
            ref={addCandidateButtonRef}
            variant="primary"
            onClick={onAddCandidate}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add candidate
          </HeroActionButton>
          {isDraft ? (
            teamComplete ? (
              <HeroActionButton variant="primary" onClick={() => setPublishModalOpen(true)}>
                <Rocket className="h-3.5 w-3.5" strokeWidth={1.75} />
                Publish Job
              </HeroActionButton>
            ) : (
              <div title="Add recruiter, hiring manager, and panel member to publish this job.">
                <HeroActionButton variant="secondary" disabled>
                  <Lock className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Publish unavailable
                </HeroActionButton>
              </div>
            )
          ) : null}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(hiringHeroCollapsedIconBtn, hiringTransition)}
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" sideOffset={4} className={menuContentClass}>
              <DropdownMenuItem className={menuItemClass}>
                <Pencil className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                Edit job
              </DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass}>
                <Copy className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                Duplicate job
              </DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass} onSelect={copyJobLink}>
                <Link2 className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                Copy job link
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-0.5" />
              <DropdownMenuItem className={menuItemClass}>
                <Pause className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                Pause hiring
              </DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass}>
                <XCircle className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                Close job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
      metricsStorageKey="job-workspace-hero-metrics-collapsed"
      metrics={
        <HeroMetricsCollapsible
          id="job-workspace-hero-metrics"
          storageKey="job-workspace-hero-metrics-collapsed"
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        >
          {kpis.map((k) => (
            <HiringHeroGlassKpiCard
              key={k.label}
              label={k.label}
              value={k.value}
              subtitle={k.subtitle}
              icon={k.icon}
              padValue
            />
          ))}
        </HeroMetricsCollapsible>
      }
    />

      {isDraft ? (
        <Dialog open={publishModalOpen} onOpenChange={setPublishModalOpen}>
          <DialogPortal>
            <DialogOverlay className="z-[230] bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]" />
            <div className="fixed inset-0 z-[230] flex items-center justify-center px-4">
              <DialogPanel className="relative w-full max-w-[420px] rounded-[20px] border border-[rgba(15,23,42,0.06)] bg-white p-6 shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)] dark:bg-surface">
                <DialogTitle className="text-[18px] font-semibold text-[#18181B] dark:text-text">
                  Publish this job?
                </DialogTitle>
                <p className="mt-2 text-[14px] leading-relaxed text-[#71717A] dark:text-muted">
                  This job will become visible to candidates and start accepting applications.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPublishModalOpen(false)}
                    disabled={publishing}
                    className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[rgba(15,23,42,0.1)] bg-white px-4 text-[14px] font-medium text-[#3F3F46] transition-colors hover:bg-[#FAFAFB] disabled:opacity-50 dark:bg-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void handlePublish()}
                    disabled={publishing}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-accent px-5 text-[14px] font-medium text-white transition-colors hover:bg-[rgb(var(--accent-hover-rgb))] disabled:opacity-50"
                  >
                    {publishing ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Rocket className="h-4 w-4" strokeWidth={1.75} />
                    )}
                    Publish Job
                  </button>
                </div>
              </DialogPanel>
            </div>
          </DialogPortal>
        </Dialog>
      ) : null}
    </>
  );
}
