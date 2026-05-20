"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { ScheduleSlot } from "@/lib/scheduling/types";

export function SlotActionsPopover({
  slot,
  open,
  onOpenChange,
  anchor,
  onDelete,
  onCancelInterview,
}: {
  slot: ScheduleSlot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: React.ReactNode;
  onDelete: () => void;
  onCancelInterview: () => void;
}) {
  const isBooked = slot.type === "booked";

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{anchor}</PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-1.5">
        {isBooked ? (
          <>
            <Button variant="ghost" className="h-8 w-full justify-start text-[12px]" onClick={onCancelInterview}>
              Cancel interview
            </Button>
            <p className="px-2 py-1 text-[10px] text-muted">Reschedule via interview flow</p>
          </>
        ) : (
          <Button
            variant="ghost"
            className="h-8 w-full justify-start text-[12px] text-red-600 hover:text-red-700"
            onClick={onDelete}
          >
            Delete slot
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
