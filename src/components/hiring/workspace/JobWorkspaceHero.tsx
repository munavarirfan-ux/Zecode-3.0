"use client";

import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  ClipboardList,
  Copy,
  FileCheck,
  Link2,
  MoreHorizontal,
  Pause,
  Pencil,
  Plus,
  Share2,
  Users,
  XCircle,
} from "lucide-react";
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
          <span className={cn(glassMeta, "text-white/88")}>{job.status}</span>
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
  );
}
