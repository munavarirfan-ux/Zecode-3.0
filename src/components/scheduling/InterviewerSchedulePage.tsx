"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { NewUserModuleEmptyState } from "@/components/onboarding/NewUserModuleEmptyState";
import { useRole } from "@/context/RoleContext";
import { isFreshNewUserWorkspace } from "@/lib/onboarding/workspaceMode";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";
import { getSlotsForWorkspace } from "@/lib/scheduling/scheduleForWorkspace";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dashboardIntelligenceBorder } from "@/components/dashboard/dashboardTokens";
import { HiringPageHero } from "@/components/hiring/HiringPageHero";
import { hiringCanvas, hiringCard, hiringTransition } from "@/components/hiring/hiringTokens";
import { cn } from "@/lib/utils";
import { AddSlotPanel } from "./AddSlotPanel";
import { ScheduleSlotCard } from "./ScheduleSlotCard";
import { SlotActionsPopover } from "./SlotActionsPopover";
import {
  cancelBookedInterview,
  deleteSlot,
  useScheduleStore,
} from "@/lib/scheduling/scheduleStore";
import {
  addDays,
  formatWeekRange,
  getWeekColumns,
  isSameWeek,
  isToday,
  startOfWeek,
} from "@/lib/scheduling/week";
import type { ScheduleSlot } from "@/lib/scheduling/types";

const LEGEND = [
  { label: "Booked", className: "border-l-2 border-l-[#378ADD] bg-[rgb(var(--accent-rgb)/0.08)]" },
  { label: "Open", className: "border border-[rgba(29,158,117,0.25)] bg-[rgba(29,158,117,0.06)]" },
  { label: "Blocked", className: "bg-[#F6F4F1] border border-[rgba(15,23,42,0.06)]" },
] as const;

export function InterviewerSchedulePage() {
  const { selectedRole } = useRole();
  const workspaceRefresh = useWorkspaceRefresh();
  const { slots: allSlots, timezone } = useScheduleStore();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelDayKey, setPanelDayKey] = useState<string | undefined>();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<ScheduleSlot | null>(null);

  const slots = useMemo(
    () => getSlotsForWorkspace(allSlots, selectedRole),
    [allSlots, selectedRole, workspaceRefresh],
  );

  const freshNewUser = useMemo(
    () => isFreshNewUserWorkspace(selectedRole),
    [selectedRole, workspaceRefresh],
  );

  const showNewUserScheduleEmpty = freshNewUser && slots.length === 0;

  const columns = useMemo(() => getWeekColumns(weekStart), [weekStart]);

  const weekSlots = useMemo(() => {
    const keys = new Set(columns.map((c) => c.dayKey));
    return slots
      .filter((s) => keys.has(s.dayKey))
      .sort((a, b) => a.startMinutes - b.startMinutes);
  }, [columns, slots]);

  const summary = useMemo(() => {
    const booked = weekSlots.filter((s) => s.type === "booked").length;
    const openHours = weekSlots
      .filter((s) => s.type === "open")
      .reduce((acc, s) => acc + (s.endMinutes - s.startMinutes) / 60, 0);
    return { booked, openHours: Math.round(openHours * 10) / 10 };
  }, [weekSlots]);

  const openAdd = useCallback((dayKey?: string) => {
    setPanelDayKey(dayKey);
    setPanelOpen(true);
  }, []);

  function shiftWeek(delta: number) {
    setWeekStart((w) => addDays(w, delta * 7));
    setSelectedSlotId(null);
    setPopoverOpen(false);
  }

  function goThisWeek() {
    setWeekStart(startOfWeek(new Date()));
  }

  const handleDelete = (slot: ScheduleSlot) => {
    const res = deleteSlot(slot.id);
    if (!res.ok) {
      toast.error("Cannot delete", { description: res.error });
      return;
    }
    toast.success("Slot removed");
    setPopoverOpen(false);
    setSelectedSlotId(null);
  };

  return (
    <div className={cn(hiringCanvas, "pb-10")}>
      <div className="mx-auto max-w-shell space-y-5">
        {showNewUserScheduleEmpty ? (
          <NewUserModuleEmptyState module="mySchedule" onPrimaryAction={() => openAdd()} />
        ) : (
        <>
          <HiringPageHero
            title="My schedule"
            subtitle={`${summary.booked} interview${summary.booked === 1 ? "" : "s"} booked · ${summary.openHours} open hours this week`}
            meta={`All times in ${timezone}`}
            aria-label="My schedule"
            action={
              <Button
                type="button"
                className="h-10 shrink-0 rounded-[12px] bg-accent px-5 text-sm font-semibold text-white shadow-[0_2px_10px_rgb(var(--accent-rgb)/0.4)] hover:bg-accent-hover"
                onClick={() => openAdd()}
              >
                <Plus className="mr-1.5 h-4 w-4" strokeWidth={2} aria-hidden />
                Add slot
              </Button>
            }
          />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-[8px]"
              onClick={() => shiftWeek(-1)}
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </Button>
            <span className="min-w-[180px] px-1 text-center text-[13px] font-semibold tracking-[-0.02em] text-text sm:min-w-[220px] sm:text-[14px]">
              {formatWeekRange(weekStart)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-[8px]"
              onClick={() => shiftWeek(1)}
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
            {!isSameWeek(weekStart, new Date()) ? (
              <button
                type="button"
                onClick={goThisWeek}
                className="ml-1 text-[11px] font-medium text-[rgb(var(--accent-deep-rgb))] hover:underline"
              >
                This week
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5">
            {LEGEND.map((l) => (
              <span key={l.label} className="inline-flex items-center gap-1 text-[10px] text-muted">
                <span className={cn("h-2 w-3 rounded-[3px]", l.className)} aria-hidden />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div
          className={cn(
            hiringCard,
            dashboardIntelligenceBorder,
            "grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 sm:gap-2 lg:grid-cols-7",
          )}
          role="grid"
          aria-label="Week schedule"
        >
          {columns.map((col) => {
            const daySlots = weekSlots
              .filter((s) => s.dayKey === col.dayKey)
              .sort((a, b) => a.startMinutes - b.startMinutes);
            const today = isToday(col.dayKey);
            const empty = daySlots.length === 0;

            return (
              <div
                key={col.dayKey}
                role="gridcell"
                className={cn(
                  "flex min-h-[260px] flex-col rounded-[12px] border px-2 py-2",
                  hiringTransition,
                  today
                    ? "border-[rgb(var(--accent-rgb)/0.18)] bg-[rgb(var(--accent-rgb)/0.04)] shadow-[0_1px_2px_rgb(var(--accent-rgb)/0.06)]"
                    : "border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] dark:border-white/[0.06] dark:bg-white/[0.02]",
                )}
              >
                <div
                  className={cn(
                    "mb-2 shrink-0 border-b pb-2 text-center",
                    today ? "border-[rgb(var(--accent-rgb)/0.12)]" : "border-[rgba(15,23,42,0.05)]",
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">{col.label}</p>
                  <p
                    className={cn(
                      "text-[14px] font-semibold tabular-nums",
                      today ? "text-[rgb(var(--accent-deep-rgb))]" : "text-text",
                    )}
                  >
                    {col.dateNum}
                  </p>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-1.5">
                  {daySlots.map((slot) => (
                    <SlotActionsPopover
                      key={slot.id}
                      slot={slot}
                      open={selectedSlotId === slot.id && popoverOpen}
                      onOpenChange={(o) => {
                        setPopoverOpen(o);
                        if (!o) setSelectedSlotId(null);
                      }}
                      anchor={
                        <ScheduleSlotCard
                          slot={slot}
                          selected={selectedSlotId === slot.id}
                          onSelect={() => {
                            setSelectedSlotId(slot.id);
                            setPopoverOpen(true);
                          }}
                        />
                      }
                      onDelete={() => handleDelete(slot)}
                      onCancelInterview={() => {
                        setPopoverOpen(false);
                        setCancelTarget(slot);
                      }}
                    />
                  ))}

                  {empty ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-2 py-6 text-center">
                      <p className="text-[11px] text-[#C4C4C4]">No slots</p>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => openAdd(col.dayKey)}
                  className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-[6px] py-1.5 text-[11px] font-medium text-muted transition-colors hover:bg-[rgba(15,23,42,0.03)] hover:text-[rgb(var(--accent-deep-rgb))]"
                >
                  <Plus className="h-3 w-3" strokeWidth={2} aria-hidden />
                  Add slot
                </button>
              </div>
            );
          })}
        </div>
        </>
        )}
      </div>

      <AddSlotPanel open={panelOpen} onOpenChange={setPanelOpen} weekStart={weekStart} initialDayKey={panelDayKey} />

      <Dialog open={cancelTarget !== null} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <DialogContent className="max-w-md rounded-[14px]">
          <DialogHeader>
            <DialogTitle>Cancel interview?</DialogTitle>
            <DialogDescription>
              This removes the booked slot for {cancelTarget?.candidateName}. The candidate will need to be
              rescheduled separately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              Keep interview
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (cancelTarget) {
                  cancelBookedInterview(cancelTarget.id);
                  toast.success("Interview cancelled");
                  setCancelTarget(null);
                  setSelectedSlotId(null);
                }
              }}
            >
              Cancel interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
