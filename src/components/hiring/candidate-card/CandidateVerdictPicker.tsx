"use client";

import { useState } from "react";
import { ChevronDown, Minus, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getVerdictStatus } from "@/lib/hiring/candidate-status";
import type { CandidateVerdict } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";
import { VerdictConfirmDialog } from "./VerdictConfirmDialog";

const menuItemClass = "gap-2 text-[12px]";

const filledTriggerIconClass = (compact: boolean) =>
  cn("shrink-0 fill-current", compact ? "h-[18px] w-[18px]" : "h-5 w-5");

export function CandidateVerdictPicker({
  candidateName,
  verdict,
  onVerdictChange,
  compact = false,
  className,
}: {
  candidateName: string;
  verdict: CandidateVerdict;
  onVerdictChange: (verdict: CandidateVerdict, reason?: string) => void;
  compact?: boolean;
  className?: string;
}) {
  const [confirmVerdict, setConfirmVerdict] = useState<"hire" | "no_hire" | null>(null);
  const [confirming, setConfirming] = useState(false);

  const activeStatus = getVerdictStatus(verdict);
  const TriggerIcon = activeStatus?.icon ?? ThumbsUp;
  const triggerColor = activeStatus?.iconColor ?? "text-[#A1A1AA] dark:text-muted";

  function applyVerdict(next: CandidateVerdict, reason?: string) {
    onVerdictChange(next, reason);
    toast.success(`Verdict updated for ${candidateName}`);
  }

  function handleSelect(next: CandidateVerdict) {
    if (next === "hire" || next === "no_hire") {
      setConfirmVerdict(next);
      return;
    }
    applyVerdict(next);
  }

  function handleConfirm(reason: string) {
    if (!confirmVerdict) return;
    setConfirming(true);
    applyVerdict(confirmVerdict, reason);
    setConfirming(false);
    setConfirmVerdict(null);
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "shrink-0 rounded-md hover:bg-[rgba(15,23,42,0.06)] dark:hover:bg-white/[0.06]",
              compact ? "h-7 w-7" : "h-8 w-8",
              className,
            )}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={
              activeStatus ? `Verdict: ${activeStatus.label}. Change verdict` : "Set verdict"
            }
          >
            <span
              className={cn(
                "relative inline-flex items-center justify-center",
                compact ? "h-[18px] w-[18px]" : "h-5 w-5",
              )}
            >
              <TriggerIcon
                className={cn(
                  filledTriggerIconClass(compact),
                  triggerColor,
                  verdict !== "neutral" && "fill-current",
                )}
                strokeWidth={verdict === "neutral" ? 2.5 : 0}
                aria-hidden
              />
              <ChevronDown
                className={cn(
                  "absolute -bottom-0.5 -right-1 rounded-full bg-white text-[#A1A1AA] ring-1 ring-white dark:bg-surface dark:text-muted dark:ring-surface",
                  compact ? "h-2 w-2" : "h-2.5 w-2.5",
                )}
                strokeWidth={2.5}
                aria-hidden
              />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem
            className={menuItemClass}
            onSelect={(e) => {
              e.preventDefault();
              handleSelect("hire");
            }}
          >
            <ThumbsUp className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={1.75} />
            Hire
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemClass}
            onSelect={(e) => {
              e.preventDefault();
              handleSelect("no_hire");
            }}
          >
            <ThumbsDown className="h-3.5 w-3.5 shrink-0 text-red-600" strokeWidth={1.75} />
            No hire
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemClass}
            onSelect={(e) => {
              e.preventDefault();
              handleSelect("neutral");
            }}
          >
            <Minus className="h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={1.75} />
            Neutral
          </DropdownMenuItem>
          {verdict !== "pending" ? (
            <DropdownMenuItem
              className={cn(menuItemClass, "text-muted")}
              onSelect={(e) => {
                e.preventDefault();
                applyVerdict("pending");
              }}
            >
              <Minus className="h-3.5 w-3.5 shrink-0 opacity-50" strokeWidth={1.75} />
              Clear verdict
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <VerdictConfirmDialog
        open={confirmVerdict !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmVerdict(null);
        }}
        candidateName={candidateName}
        verdict={confirmVerdict ?? "hire"}
        onConfirm={handleConfirm}
        confirming={confirming}
      />
    </>
  );
}
