"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
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
import {
  AssessmentCardMenuItem,
  AssessmentCardMenuSeparator,
  assessmentCardMenuContentClass,
} from "./assessmentCardMenu";

export function AssessmentListRow({
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
  const edit = () => router.push(ROUTES.assessment(assessment.id));

  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1.6fr)_repeat(8,minmax(0,0.7fr))_auto] items-center gap-2 border-b border-[rgba(15,23,42,0.05)] px-3 py-2.5 text-[12px] hover:bg-[#FAFAFB] dark:hover:bg-white/[0.02]",
        !assessment.enabled && "opacity-70",
      )}
    >
      <Link
        href={ROUTES.assessment(assessment.id)}
        className="min-w-0 font-semibold text-text hover:text-forest"
      >
        <span className="line-clamp-1">{assessment.name}</span>
      </Link>
      <span className="truncate text-muted">{assessment.role}</span>
      <span className="truncate text-muted">{assessment.createdBy}</span>
      <span className="tabular-nums text-muted">{assessment.createdOn}</span>
      <span className="tabular-nums text-right">{assessment.invited}</span>
      <span className="tabular-nums text-right">{assessment.notStarted}</span>
      <span className="tabular-nums text-right">{assessment.evaluated}</span>
      <span className="tabular-nums text-right font-medium text-text">{assessment.qualified}</span>
      <span className="text-[11px] font-medium">{assessment.status}</span>
      <div className="flex items-center justify-end gap-2">
        <Switch checked={assessment.enabled} onCheckedChange={onToggleEnabled} aria-label="Toggle enabled" />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-[10px] p-0">
              <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={4}
            collisionPadding={12}
            className={assessmentCardMenuContentClass}
          >
            <AssessmentCardMenuItem icon={Pencil} label="Edit Assessment" onSelect={edit} />
            <AssessmentCardMenuItem icon={Copy} label="Duplicate Assessment" onSelect={onDuplicate} />
            <AssessmentCardMenuItem icon={Share2} label="Share Assessment" onSelect={onShare} />
            <AssessmentCardMenuSeparator />
            <AssessmentCardMenuItem icon={Trash2} label="Delete Assessment" destructive onSelect={onDelete} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
