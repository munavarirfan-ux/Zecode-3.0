"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Archive,
  ArrowUpRight,
  Copy,
  LayoutDashboard,
  Link2,
  MoreHorizontal,
  Pause,
  Pencil,
  Trash2,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { HiringJob, JobStatus } from "@/lib/hiring/types";
import { markJobDeleted } from "@/lib/hiring/persistedJobs";
import { hiringCard, hiringTransition } from "./hiringTokens";
import { StatusBadge } from "./StatusBadge";

const STATUS_ACCENT: Record<JobStatus, string> = {
  Published:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-emerald-500 before:shadow-[2px_0_12px_rgba(16,185,129,0.35)] before:content-['']",
  Internal:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-sky-500 before:shadow-[2px_0_12px_rgba(14,165,233,0.3)] before:content-['']",
  External:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-violet-500 before:shadow-[2px_0_12px_rgba(139,92,246,0.28)] before:content-['']",
  Draft:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-zinc-400/90 before:content-['']",
  "On Hold":
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-amber-500 before:shadow-[2px_0_12px_rgba(245,158,11,0.3)] before:content-['']",
  Closed:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-zinc-300/90 before:content-[''] opacity-[0.92]",
  Deleted:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-red-400/70 before:content-['']",
};

function MetaChip({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-tight",
        hiringTransition,
        accent
          ? "border-accent/15 bg-accent/[0.08] text-accent"
          : "border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.02)] text-text-secondary/75 dark:border-white/[0.06] dark:bg-white/[0.03]",
      )}
    >
      {children}
    </span>
  );
}

function PrimaryCandidatesMetric({ count }: { count: number }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-forest/12 bg-gradient-to-br from-forest/[0.08] to-forest/[0.04] px-3 py-2.5",
        "dark:border-emerald-500/15 dark:from-emerald-500/12 dark:to-emerald-500/5",
      )}
    >
      <p className="text-[1.625rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-[#0F3D2E] dark:text-emerald-300">
        {count}
      </p>
      <p className="mt-1 text-[11px] font-semibold tracking-tight text-forest/85 dark:text-emerald-400/90">
        Total Candidates
      </p>
    </div>
  );
}

function SecondaryMetricChip({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-transparent bg-[rgba(15,23,42,0.03)] px-2 py-1 text-[11px] text-muted/90 dark:bg-white/[0.04]">
      <span className="font-medium tabular-nums text-text-secondary/90">{value}</span>
      <span className="text-text-secondary/55">{label}</span>
    </span>
  );
}

function buildOperationalContext(job: HiringJob): { primary: string; secondary?: string } {
  const extras: string[] = [];
  if (job.interviewsToday > 0) {
    extras.push(`${job.interviewsToday} interview${job.interviewsToday === 1 ? "" : "s"} scheduled today`);
  }
  if (job.feedbackPending > 0) {
    extras.push(`${job.feedbackPending} feedback pending`);
  }

  const primary =
    job.candidatesThisWeek > 0
      ? `Last candidate applied ${job.lastUpdatedLabel}`
      : `Updated ${job.lastUpdatedLabel}`;

  return { primary, secondary: extras[0] };
}

function isJobCardAction(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-job-card-action]"));
}

const jobCardMenuContentClass = cn(
  "z-[100] w-[232px] min-w-0 max-h-none overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
  "dark:border-white/[0.08] dark:bg-surface",
);

function JobCardMenuSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <DropdownMenuLabel className="px-2 pb-0.5 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/55">
        {label}
      </DropdownMenuLabel>
      {children}
    </div>
  );
}

function JobCardMenuItem({
  icon: Icon,
  label,
  destructive,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  destructive?: boolean;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className={cn(
        "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0",
        "text-[12px] font-medium text-text/90",
        "outline-none transition-colors duration-150 ease-out",
        "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
        "dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]",
        destructive &&
          "text-red-600 focus:text-red-600 data-[highlighted]:text-red-600 dark:text-red-400 dark:focus:text-red-400 dark:data-[highlighted]:text-red-400",
      )}
    >
      <Icon
        className={cn("h-3 w-3 shrink-0", destructive ? "opacity-80" : "opacity-55")}
        strokeWidth={1.75}
      />
      {label}
    </DropdownMenuItem>
  );
}

function JobCardMenuSeparator() {
  return <DropdownMenuSeparator className="-mx-0 my-0.5 h-px bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]" />;
}

export function JobCard({ job }: { job: HiringJob }) {
  const router = useRouter();
  const workspaceHref = `/hiring/jobs/${job.id}`;
  const context = buildOperationalContext(job);

  const openWorkspace = () => router.push(workspaceHref);
  const openApplicants = () => router.push(`${workspaceHref}?tab=applicants`);
  const copyJobLink = () => {
    const url = `${window.location.origin}${workspaceHref}`;
    void navigator.clipboard.writeText(url);
  };

  const deleteJob = () => {
    markJobDeleted(job.id);
    toast.success("Job moved to Deleted", { description: job.title });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isJobCardAction(e.target)) return;
    openWorkspace();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (isJobCardAction(e.target)) return;
    e.preventDefault();
    openWorkspace();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`Open ${job.title} workspace`}
      className={cn(
        hiringCard,
        "group relative flex h-full flex-col overflow-hidden cursor-pointer",
        "hover:-translate-y-1",
        "hover:border-[rgba(15,61,46,0.14)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06),0_24px_48px_-16px_rgba(15,61,46,0.16),0_0_0_1px_rgba(15,61,46,0.1)]",
        "dark:hover:border-emerald-500/20 dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.18),0_24px_48px_-16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(167,243,208,0.12)]",
        hiringTransition,
        STATUS_ACCENT[job.status],
        "outline-none focus-visible:ring-2 focus-visible:ring-forest/25 focus-visible:ring-offset-2",
      )}
    >
      <ArrowUpRight
        className={cn(
          "pointer-events-none absolute right-4 top-4 z-[1] h-4 w-4 text-forest/0",
          hiringTransition,
          "group-hover:text-forest/60",
        )}
        strokeWidth={2}
        aria-hidden
      />

      <div className="relative z-[1] flex flex-1 flex-col gap-3 p-4 sm:p-[1.125rem]">
        {/* Top */}
        <div className="space-y-1.5 pr-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.03em] text-text transition-colors duration-[180ms] group-hover:text-forest">
              {job.title}
            </h3>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-[12px] font-medium text-text-secondary/70">
            {job.department}
            <span className="mx-1.5 text-muted/30">·</span>
            {job.location}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-1.5">
          <MetaChip>{job.workMode}</MetaChip>
          <MetaChip>{job.employmentType}</MetaChip>
          {job.priority === "High" ? <MetaChip accent>High priority</MetaChip> : null}
          {job.priority === "Low" ? <MetaChip>Low priority</MetaChip> : null}
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <PrimaryCandidatesMetric count={job.candidateCount} />
          <div className="flex flex-wrap gap-1.5">
            <SecondaryMetricChip value={job.interviewingCount} label="Interviewing" />
            <SecondaryMetricChip value={job.referralCount} label="Referrals" />
            <SecondaryMetricChip value={job.careersApplicants} label="Careers" />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[rgba(15,23,42,0.05)] pt-3 dark:border-white/[0.05]">
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-[11px] font-medium leading-snug text-text-secondary/85">{context.primary}</p>
            {context.secondary ? (
              <p className="text-[11px] leading-snug text-muted/75">{context.secondary}</p>
            ) : null}
          </div>

          <div data-job-card-action className="relative z-[2] shrink-0" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className={cn(
                    "h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-sm",
                    hiringTransition,
                    "hover:border-[rgba(15,61,46,0.12)] hover:bg-white dark:bg-surface",
                  )}
                  aria-label="Job actions"
                >
                  <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={4}
                collisionPadding={12}
                avoidCollisions={false}
                className={jobCardMenuContentClass}
              >
                <JobCardMenuSection label="Workspace">
                  <JobCardMenuItem icon={LayoutDashboard} label="Open Workspace" onSelect={openWorkspace} />
                  <JobCardMenuItem icon={Users} label="View Applicants" onSelect={openApplicants} />
                </JobCardMenuSection>
                <JobCardMenuSeparator />
                <JobCardMenuSection label="Job Actions">
                  <JobCardMenuItem icon={Pencil} label="Edit Job" onSelect={openWorkspace} />
                  <JobCardMenuItem icon={Copy} label="Duplicate Job" />
                  <JobCardMenuItem icon={Link2} label="Copy Job Link" onSelect={copyJobLink} />
                </JobCardMenuSection>
                <JobCardMenuSeparator />
                <JobCardMenuSection label="Status">
                  <JobCardMenuItem icon={Pause} label="Pause Hiring" />
                  <JobCardMenuItem icon={XCircle} label="Close Job" />
                </JobCardMenuSection>
                <JobCardMenuSeparator />
                <JobCardMenuSection label="Danger">
                  <JobCardMenuItem icon={Archive} label="Archive Job" destructive />
                  <JobCardMenuItem icon={Trash2} label="Delete Job" destructive onSelect={deleteJob} />
                </JobCardMenuSection>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  );
}
