"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  ClipboardList,
  Clock,
  Copy,
  Download,
  Link2,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  ShieldAlert,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";
import { assessmentTotals } from "@/lib/hiring/assessments/assessmentFormSteps";
import type { AssessmentRecord } from "@/lib/hiring/assessments/types";
import { cn } from "@/lib/utils";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HeroMetricsToggleButton } from "../HeroMetricsToggleButton";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { HiringHeroTexture } from "../HiringHeroTexture";
import { ASSESSMENT_DETAIL_METRICS_COLLAPSED_KEY } from "@/lib/hiring/assessments/types";
import {
  hiringHeroPrimaryBtnSm,
  hiringHeroRadialOverlay,
  hiringHeroSecondaryBtnSm,
  hiringHeroShell,
  hiringTransition,
} from "../hiringTokens";

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

export function AssessmentDetailHero({
  assessment,
  stats,
  onInvite,
  onBulkInvite,
  onShare,
  onExport,
  onDisableRequest,
  onEnable,
}: {
  assessment: AssessmentRecord;
  stats: {
    invited: number;
    attempted: number;
    qualified: number;
    pending: number;
    malpractice: number;
  };
  onInvite: () => void;
  onBulkInvite: () => void;
  onShare: () => void;
  onExport: () => void;
  onDisableRequest: () => void;
  onEnable: () => void;
}) {
  const totals = assessmentTotals(assessment.config);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(assessment.shareLink);
      toast.success("Assessment link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const kpis = [
    {
      label: "Invited",
      value: stats.invited,
      icon: Users,
      subtitle: stats.invited > 0 ? "With access" : "No invites yet",
    },
    {
      label: "Attempted",
      value: stats.attempted,
      icon: ClipboardList,
      subtitle: stats.attempted > 0 ? "Submissions started" : "Awaiting attempts",
    },
    {
      label: "Qualified",
      value: stats.qualified,
      icon: BadgeCheck,
      subtitle: stats.qualified > 0 ? "Met qualifying score" : "None qualified",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      subtitle: stats.pending > 0 ? "Invite sent" : "Queue clear",
    },
    {
      label: "Malpractice",
      value: stats.malpractice,
      icon: ShieldAlert,
      subtitle: stats.malpractice > 0 ? "Signals to review" : "No flags",
    },
  ] as const;

  return (
    <section className={cn(hiringHeroShell, "px-8 py-8")} aria-label="Assessment workspace header">
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-teal-200/[0.06] blur-3xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden style={hiringHeroRadialOverlay} />

      <div className="relative space-y-5">
        <Link
          href={ROUTES.assessments}
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.07] px-3 py-1 text-[11px] font-medium text-white/72 backdrop-blur-sm",
            hiringTransition,
            "hover:border-white/[0.26] hover:bg-white/[0.11] hover:text-white",
          )}
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          Back to assessments
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <header className="min-w-0 space-y-3">
            <h1 className="text-[1.5rem] font-medium leading-[1.15] tracking-[-0.04em] text-white sm:text-[1.75rem]">
              {assessment.name}
            </h1>
            <p className="text-[13px] font-normal text-white/[0.58]">
              {assessment.role}
              <span className="mx-2 text-white/20">·</span>
              {assessment.createdBy}
              <span className="mx-2 text-white/20">·</span>
              Created {assessment.createdOn}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={glassMeta}>{assessment.status}</span>
              <span className={cn(glassMeta, "text-white/88")}>
                {assessment.enabled ? "Active" : "Paused"}
              </span>
              <span className={glassMeta}>{assessment.config.durationMinutes} min</span>
              <span className={glassMeta}>{assessment.config.validityDays}d validity</span>
              <span className={glassMeta}>{assessment.config.languages.slice(0, 2).join(", ")}</span>
              {totals.count > 0 ? (
                <span className={glassMeta}>
                  {totals.count} questions · {totals.totalMarks} marks
                </span>
              ) : null}
            </div>
          </header>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <HeroMetricsToggleButton storageKey={ASSESSMENT_DETAIL_METRICS_COLLAPSED_KEY} />
            <Button type="button" size="sm" className={hiringHeroSecondaryBtnSm} onClick={onExport}>
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
              Export
            </Button>
            <Button type="button" size="sm" className={hiringHeroSecondaryBtnSm} onClick={onBulkInvite}>
              <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
              Bulk upload
            </Button>
            <Button type="button" size="sm" className={hiringHeroPrimaryBtnSm} onClick={onInvite}>
              <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
              Invite candidate
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 w-9 rounded-[11px] border-white/[0.18] bg-white/[0.08] p-0 text-white backdrop-blur-sm",
                    hiringTransition,
                    "hover:border-white/[0.28] hover:bg-white/[0.14]",
                  )}
                  aria-label="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" sideOffset={4} className={menuContentClass}>
                <DropdownMenuItem className={menuItemClass} onSelect={onShare}>
                  <Share2 className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClass} onSelect={onExport}>
                  <Download className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-0.5" />
                <DropdownMenuItem className={menuItemClass} onSelect={copyLink}>
                  <Link2 className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Copy assessment link
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClass} onSelect={() => toast.message("Duplicate (demo)")}>
                  <Copy className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Duplicate assessment
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-0.5" />
                {assessment.enabled ? (
                  <DropdownMenuItem className={menuItemClass} onSelect={onDisableRequest}>
                    <Pause className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                    Pause assessment
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className={menuItemClass} onSelect={onEnable}>
                    <Play className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                    Enable assessment
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <HeroMetricsCollapsible
          id="assessment-workspace-hero-metrics"
          storageKey={ASSESSMENT_DETAIL_METRICS_COLLAPSED_KEY}
          withBorder={false}
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        >
          {kpis.map((kpi) => (
            <HiringHeroGlassKpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              subtitle={kpi.subtitle}
              icon={kpi.icon}
              padValue
            />
          ))}
        </HeroMetricsCollapsible>
      </div>
    </section>
  );
}
