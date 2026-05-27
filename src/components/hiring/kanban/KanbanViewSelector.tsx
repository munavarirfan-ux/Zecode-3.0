"use client";

import { ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { KanbanViewMode } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";

const VIEW_OPTIONS: { value: KanbanViewMode; label: string }[] = [
  { value: "all", label: "All candidates" },
  { value: "mine", label: "Just mine" },
  { value: "team", label: "Just team" },
];

const toolbarTriggerClass =
  "border-border-subtle bg-surface shadow-none hover:bg-surface-2 dark:border-border-subtle dark:hover:bg-white/[0.04]";

export function KanbanViewSelector({
  value,
  onValueChange,
}: {
  value: KanbanViewMode;
  onValueChange: (mode: KanbanViewMode) => void;
}) {
  const label = VIEW_OPTIONS.find((o) => o.value === value)?.label ?? "All candidates";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 gap-1 rounded-[9px] px-2.5 text-xs", toolbarTriggerClass)}
        >
          <Users className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
          <span className="max-w-[140px] truncate font-medium">{label}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
          Candidates
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onValueChange(v as KanbanViewMode)}>
          {VIEW_OPTIONS.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
