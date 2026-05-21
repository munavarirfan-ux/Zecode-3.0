"use client";

import {
  ArrowLeft,
  CalendarClock,
  Clock,
  Download,
  Link2,
  MoreHorizontal,
  Share2,
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
import { EXPIRY_WINDOW_OPTIONS } from "@/lib/hiring/assessments/scheduledAssessmentsData";
import type { ScheduledAssessmentRecord } from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { cn } from "@/lib/utils";
import { HiringHeroWorkspace } from "../HiringHeroWorkspace";
import {
  hiringHeroPrimaryBtnSm,
  hiringHeroSecondaryBtnSm,
  hiringHeroStripMetaChips,
  hiringTransition,
} from "../hiringTokens";
import { ScheduledAssessmentStatusPill } from "./ScheduledAssessmentStatusPill";

const glassMeta =
  "inline-flex items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/78 backdrop-blur-md";

const menuContentClass = cn(
  "z-[100] w-[232px] min-w-0 overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
);

const menuItemClass = cn(
  "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0 text-[12px] font-medium",
  "outline-none transition-colors duration-150 ease-out",
  "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
);

export function ScheduledAssessmentDetailHero({
  record,
  onInvite,
  onBulkInvite,
  onShare,
  onExport,
}: {
  record: ScheduledAssessmentRecord;
  onInvite: () => void;
  onBulkInvite: () => void;
  onShare: () => void;
  onExport: () => void;
}) {
  const expiry =
    EXPIRY_WINDOW_OPTIONS.find((o) => o.value === record.expiryWindowHours)?.label ??
    `${record.expiryWindowHours}h`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(record.shareLink);
      toast.success("Schedule link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <HiringHeroWorkspace
      aria-label="Scheduled assessment header"
      heroCollapseStorageKey="scheduled-assessment-detail"
      defaultHeroCollapsed
      collapsedMeta={[record.role, `Created by ${record.createdBy}`, expiry]}
      backHref={ROUTES.schedules}
      backLabel={
        <>
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          Assessment Drive
        </>
      }
      title={record.assessmentName}
      subtitle={
        <>
          {record.role}
          <span className="mx-2 text-white/20">·</span>
          Created by {record.createdBy}
        </>
      }
      meta={
        <div className={hiringHeroStripMetaChips}>
          <ScheduledAssessmentStatusPill status={record.status} />
          <span className={glassMeta}>
            <CalendarClock className="h-3 w-3 opacity-80" strokeWidth={1.75} />
            {record.scheduledDate} · {record.scheduledTime}
          </span>
          <span className={glassMeta}>
            <Clock className="h-3 w-3 opacity-80" strokeWidth={1.75} />
            {expiry} expiry
          </span>
          <span className={glassMeta}>
            <Users className="h-3 w-3 opacity-80" strokeWidth={1.75} />
            {record.candidatesInvited} invited
          </span>
          <span className={glassMeta}>{record.reminderStatusLabel}</span>
        </div>
      }
      actions={
        <>
          <Button type="button" size="sm" className={hiringHeroSecondaryBtnSm} onClick={onExport}>
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            Export
          </Button>
          <Button type="button" size="sm" className={hiringHeroSecondaryBtnSm} onClick={onShare}>
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Share
          </Button>
          <Button type="button" size="sm" className={hiringHeroSecondaryBtnSm} onClick={onBulkInvite}>
            <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
            Invite Bulk
          </Button>
          <Button type="button" size="sm" className={hiringHeroPrimaryBtnSm} onClick={onInvite}>
            <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
            Invite Candidate
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
              <DropdownMenuItem className={menuItemClass} onSelect={() => toast.message("Reschedule (demo)")}>
                Reschedule assessment
              </DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass} onSelect={() => toast.message("Duplicate (demo)")}>
                Duplicate schedule
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-0.5 h-px bg-[rgba(15,23,42,0.06)]" />
              <DropdownMenuItem className={menuItemClass} onSelect={copyLink}>
                <Link2 className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass} onSelect={() => toast.message("Cancel (demo)")}>
                Cancel assessment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    />
  );
}
