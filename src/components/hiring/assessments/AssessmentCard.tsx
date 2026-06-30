"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Copy, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { AssessmentRecord } from "@/lib/hiring/assessments/types";
import { hiringCard, hiringTransition } from "../hiringTokens";
import {
  AssessmentCardMenuItem,
  AssessmentCardMenuSeparator,
  assessmentCardMenuContentClass,
} from "./assessmentCardMenu";

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.02)] px-2 py-0.5 text-[10px] font-medium tracking-tight text-text-secondary/75 dark:border-white/[0.06] dark:bg-white/[0.03]">
      {children}
    </span>
  );
}

function PrimaryMetric({ value, label }: { value: number; label: string }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-forest/12 bg-gradient-to-br from-forest/[0.08] to-forest/[0.04] px-3 py-2.5",
        "dark:border-emerald-500/15 dark:from-emerald-500/12 dark:to-emerald-500/5",
      )}
    >
      <p className="text-[1.625rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-[#0F3D2E] dark:text-emerald-300">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-semibold tracking-tight text-forest/85 dark:text-emerald-400/90">
        {label}
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

function isCardAction(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-assessment-card-action]"));
}

export function AssessmentCard({
  assessment,
  onToggleEnabled,
  onShare,
  onDuplicate,
  onDelete,
}: {
  assessment: AssessmentRecord;
  onToggleEnabled: (enabled: boolean) => void;
  onShare: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const disabled = !assessment.enabled;
  const detailHref = ROUTES.assessment(assessment.id);

  const openDetail = () => router.push(detailHref);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={(e) => {
        if (isCardAction(e.target)) return;
        openDetail();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        if (isCardAction(e.target)) return;
        e.preventDefault();
        openDetail();
      }}
      className={cn(
        hiringCard,
        "group relative flex h-full flex-col overflow-visible cursor-pointer",
        hiringTransition,
        "hover:-translate-y-1",
        "hover:border-[rgba(15,61,46,0.14)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06),0_24px_48px_-16px_rgba(15,61,46,0.16),0_0_0_1px_rgba(15,61,46,0.1)]",
        "dark:hover:border-emerald-500/20",
        disabled && "opacity-[0.72] saturate-[0.88]",
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

      <div data-assessment-card-action className="absolute right-3 top-3 z-[3]">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-sm",
                hiringTransition,
                "hover:border-[rgba(15,61,46,0.12)] hover:bg-white dark:bg-surface",
              )}
              aria-label="Assessment actions"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={4}
            collisionPadding={12}
            className={assessmentCardMenuContentClass}
            onClick={(e) => e.stopPropagation()}
          >
            <AssessmentCardMenuItem icon={Pencil} label="Edit Assessment" onSelect={openDetail} />
            <AssessmentCardMenuItem icon={Copy} label="Duplicate Assessment" onSelect={onDuplicate} />
            <AssessmentCardMenuItem icon={Share2} label="Share Assessment" onSelect={onShare} />
            <AssessmentCardMenuSeparator />
            <AssessmentCardMenuItem icon={Trash2} label="Delete Assessment" destructive onSelect={onDelete} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative z-[1] flex flex-1 flex-col gap-3 p-4 sm:p-[1.125rem]">
        <div className="space-y-1.5 pr-10">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.03em] text-text transition-colors duration-[180ms] group-hover:text-forest line-clamp-2">
              {assessment.name}
            </h3>
          </div>
          <p className="text-[12px] font-medium text-text-secondary/70">
            {assessment.role}
            <span className="mx-1.5 text-muted/30">·</span>
            {assessment.createdBy}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <MetaChip>Created {assessment.createdOn}</MetaChip>
          <MetaChip>{assessment.enabled ? "Accepting candidates" : "Closed"}</MetaChip>
        </div>

        <div className="space-y-2">
          <PrimaryMetric value={assessment.invited} label="Invited" />
          <div className="flex flex-wrap gap-1.5">
            <SecondaryMetricChip value={assessment.notStarted} label="Not started" />
            <SecondaryMetricChip value={assessment.evaluated} label="Evaluated" />
            <SecondaryMetricChip value={assessment.qualified} label="Qualified" />
          </div>
        </div>

        <div
          data-assessment-card-action
          className="mt-auto flex items-center justify-between gap-2 border-t border-[rgba(15,23,42,0.05)] pt-3 dark:border-white/[0.05]"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[11px] font-medium text-muted">
            {assessment.enabled ? "Ongoing" : "Completed"}
          </span>
          <Switch
            checked={assessment.enabled}
            onCheckedChange={(v) => {
              if (!v) onToggleEnabled(false);
              else {
                onToggleEnabled(true);
                toast.success("Assessment enabled");
              }
            }}
            aria-label={assessment.enabled ? "Disable assessment" : "Enable assessment"}
          />
        </div>
      </div>
    </article>
  );
}
