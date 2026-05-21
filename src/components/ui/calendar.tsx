"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-text",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-7 w-7 p-0 text-text-secondary hover:text-text",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "w-9 rounded-md text-[0.75rem] font-normal text-muted",
        row: "flex w-full mt-2",
        cell: cn(
          "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-9 w-9 p-0 font-normal text-text aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[rgb(var(--accent-rgb))] text-white hover:bg-[rgb(var(--accent-rgb))] hover:text-white focus:bg-[rgb(var(--accent-rgb))] focus:text-white",
        day_today: "bg-[rgba(15,23,42,0.06)] text-text font-medium dark:bg-white/[0.08]",
        day_outside:
          "day-outside text-muted opacity-50 aria-selected:bg-[rgb(var(--accent-rgb)/0.5)] aria-selected:text-white aria-selected:opacity-80",
        day_disabled: "text-muted opacity-50",
        day_range_middle: "aria-selected:bg-[rgba(15,23,42,0.06)] aria-selected:text-text",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
        IconRight: () => <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
