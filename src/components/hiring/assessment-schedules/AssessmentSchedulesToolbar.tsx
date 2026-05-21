"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  AssessmentSchedulesTab,
  SchedulesViewMode,
} from "@/lib/hiring/assessments/scheduledAssessmentTypes";
import { DirectoryViewSwitcher } from "../directories/DirectoryViewSwitcher";
import { hiringTransition } from "../hiringTokens";

const TABS: { id: AssessmentSchedulesTab; label: string }[] = [
  { id: "live", label: "Live Assessments" },
  { id: "scheduled", label: "Scheduled Assessments" },
];

export function AssessmentSchedulesToolbar({
  tab,
  onTabChange,
  liveCount,
  scheduledCount,
  view,
  onViewChange,
}: {
  tab: AssessmentSchedulesTab;
  onTabChange: (tab: AssessmentSchedulesTab) => void;
  liveCount: number;
  scheduledCount: number;
  view: SchedulesViewMode;
  onViewChange: (view: SchedulesViewMode) => void;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] border border-[rgba(15,23,42,0.06)]",
        "bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm dark:bg-surface/95",
      )}
    >
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as AssessmentSchedulesTab)} className="min-w-0">
        <TabsList className="h-10 w-full min-h-10 max-h-10 border-b border-[rgba(15,23,42,0.06)] px-1 dark:border-white/[0.08]">
          {TABS.map((t) => {
            const count = t.id === "live" ? liveCount : scheduledCount;
            return (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="gap-1.5 px-4 [&[data-state=active]_span]:font-semibold [&[data-state=active]_span]:text-accent"
              >
                {t.label}
                <span className="tabular-nums text-[11px] font-medium text-muted/70">{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center justify-end gap-2 px-2.5 py-2">
        <DirectoryViewSwitcher
          value={view}
          onChange={onViewChange}
          options={[
            { value: "grid", label: "Grid", icon: "grid" },
            { value: "list", label: "List", icon: "list" },
          ]}
        />
      </div>
    </div>
  );
}
