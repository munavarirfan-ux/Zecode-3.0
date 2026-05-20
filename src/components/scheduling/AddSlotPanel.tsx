"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addOpenSlot } from "@/lib/scheduling/scheduleStore";
import { formatMinutes, parseTimeLabel, timeOptions } from "@/lib/scheduling/time";
import { getWeekColumns } from "@/lib/scheduling/week";
import type { AddSlotDraft } from "@/lib/scheduling/types";

function defaultDraft(columns: ReturnType<typeof getWeekColumns>, initialDayKey?: string): AddSlotDraft {
  return {
    dayKey: initialDayKey ?? columns[0]?.dayKey ?? "",
    startMinutes: 10 * 60,
    endMinutes: 12 * 60,
  };
}

export function AddSlotPanel({
  open,
  onOpenChange,
  weekStart,
  initialDayKey,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekStart: Date;
  initialDayKey?: string;
}) {
  const columns = useMemo(() => getWeekColumns(weekStart), [weekStart]);
  const [draft, setDraft] = useState<AddSlotDraft>(() => defaultDraft(columns, initialDayKey));

  useEffect(() => {
    if (open) setDraft(defaultDraft(columns, initialDayKey));
  }, [open, initialDayKey, columns]);

  function handleSave() {
    if (!draft.dayKey) {
      toast.error("Select a day");
      return;
    }
    const res = addOpenSlot(draft);
    if (!res.ok) {
      toast.error("Could not save slot", { description: res.error });
      return;
    }
    toast.success("Slot saved");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] gap-0 rounded-[14px] border-[rgba(15,23,42,0.08)] p-0">
        <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 py-4">
          <DialogTitle className="text-[15px] font-semibold tracking-[-0.02em] text-text">
            Add slot
          </DialogTitle>
          <DialogDescription className="text-[12px] text-text-secondary">
            Set when you are available for interviews this week.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted">
              Day
            </label>
            <Select value={draft.dayKey} onValueChange={(v) => setDraft((d) => ({ ...d, dayKey: v }))}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((c) => (
                  <SelectItem key={c.dayKey} value={c.dayKey}>
                    {c.label} {c.dateNum}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted">
                Start time
              </label>
              <Select
                value={formatMinutes(draft.startMinutes)}
                onValueChange={(v) => setDraft((d) => ({ ...d, startMinutes: parseTimeLabel(v) }))}
              >
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions().map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted">
                End time
              </label>
              <Select
                value={formatMinutes(draft.endMinutes)}
                onValueChange={(v) => setDraft((d) => ({ ...d, endMinutes: parseTimeLabel(v) }))}
              >
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions().map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 sm:gap-2">
          <Button type="button" variant="outline" className="h-9 flex-1 rounded-[10px] text-[13px]" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="h-9 flex-1 rounded-[10px] text-[13px]"
            onClick={handleSave}
            disabled={!draft.dayKey}
          >
            Save slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
