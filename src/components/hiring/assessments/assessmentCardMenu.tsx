import { cn } from "@/lib/utils";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { LucideIcon } from "lucide-react";

export const assessmentCardMenuContentClass = cn(
  "z-[100] w-[232px] min-w-0 max-h-none overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
  "dark:border-white/[0.08] dark:bg-surface",
);

export function AssessmentCardMenuItem({
  icon: Icon,
  label,
  destructive,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  destructive?: boolean;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className={cn(
        "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0",
        "text-[12px] font-medium text-text/90",
        "outline-none transition-colors duration-150 ease-out",
        "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
        "dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]",
        destructive &&
          "text-red-600 focus:text-red-600 data-[highlighted]:text-red-600 dark:text-red-400",
      )}
    >
      <Icon className={cn("h-3 w-3 shrink-0", destructive ? "opacity-80" : "opacity-55")} strokeWidth={1.75} />
      {label}
    </DropdownMenuItem>
  );
}

export function AssessmentCardMenuSeparator() {
  return <DropdownMenuSeparator className="-mx-0 my-0.5 h-px bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]" />;
}
