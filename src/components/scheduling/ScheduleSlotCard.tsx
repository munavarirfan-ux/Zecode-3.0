"use client";

import { cn } from "@/lib/utils";
import { formatTimeRange } from "@/lib/scheduling/time";
import type { ScheduleSlot } from "@/lib/scheduling/types";

const SLOT_STYLES = {
  booked: {
    wrap: "border-l-2 border-l-[#378ADD] bg-[rgb(var(--accent-rgb)/0.06)]",
    time: "text-[12px] font-semibold tabular-nums text-[#185FA5]",
    name: "text-[12px] font-medium text-text",
    meta: "text-[11px] text-text-secondary",
  },
  open: {
    wrap: "border border-[rgba(29,158,117,0.2)] bg-[rgba(29,158,117,0.04)]",
    time: "text-[12px] font-medium tabular-nums text-[#0F6E56]/90",
    label: "text-[11px] text-[#0F6E56]/70",
  },
  blocked: {
    wrap: "bg-[#F6F4F1] border border-[rgba(15,23,42,0.04)]",
    time: "text-[12px] font-medium tabular-nums text-[#78716C]",
    label: "text-[11px] text-[#A8A29E]",
  },
} as const;

export function ScheduleSlotCard({
  slot,
  selected,
  onSelect,
}: {
  slot: ScheduleSlot;
  selected?: boolean;
  onSelect: () => void;
}) {
  const booked = slot.type === "booked" ? SLOT_STYLES.booked : null;
  const open = slot.type === "open" ? SLOT_STYLES.open : null;
  const blocked = slot.type === "blocked" ? SLOT_STYLES.blocked : null;
  const wrap =
    booked?.wrap ?? open?.wrap ?? blocked?.wrap ?? SLOT_STYLES.open.wrap;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "group relative w-full rounded-[8px] px-2.5 py-2 text-left transition-colors",
        wrap,
        selected && "ring-1 ring-[rgb(var(--accent-rgb)/0.35)]",
        slot.type === "open" && "hover:bg-[rgba(29,158,117,0.07)]",
        slot.type === "booked" && "hover:bg-[rgb(var(--accent-rgb)/0.09)]",
      )}
    >
      <p className={booked?.time ?? open?.time ?? blocked?.time}>
        {formatTimeRange(slot.startMinutes, slot.endMinutes)}
      </p>
      {booked ? (
        <>
          <p className={cn("mt-0.5 truncate", booked.name)}>{slot.candidateName}</p>
          <p className={cn("mt-0.5 truncate", booked.meta)}>{slot.roundName}</p>
        </>
      ) : open ? (
        <p className={cn("mt-0.5", open.label)}>Open</p>
      ) : blocked ? (
        <p className={cn("mt-0.5", blocked.label)}>
          Blocked{slot.reason ? ` · ${slot.reason}` : ""}
        </p>
      ) : null}
    </button>
  );
}
