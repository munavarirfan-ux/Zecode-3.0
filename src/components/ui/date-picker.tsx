"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ISO_DATE = "yyyy-MM-dd";

export function parseIsoDateString(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, ISO_DATE, new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function toIsoDateString(date: Date): string {
  return format(date, ISO_DATE);
}

export type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Disallow dates before today */
  disablePast?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
};

export function DatePicker({
  value,
  onChange,
  disabled,
  disablePast,
  placeholder = "Pick a date",
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = parseIsoDateString(value);
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-start rounded-[10px] border-[rgba(15,23,42,0.08)] bg-surface px-3 text-left text-[14px] font-normal text-text shadow-sm hover:bg-surface",
            "focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.35)] focus-visible:ring-offset-0",
            !value && "text-muted",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" strokeWidth={1.5} aria-hidden />
          {selected ? format(selected, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[260] w-auto p-0"
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(day) => {
            if (!day) return;
            onChange(toIsoDateString(day));
            setOpen(false);
          }}
          defaultMonth={selected ?? (disablePast ? today : undefined)}
          disabled={disablePast ? { before: today } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
