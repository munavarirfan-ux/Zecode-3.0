"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { kanbanBoardTint } from "./hiringTokens";

export type InterviewRoundPill = {
  id: string;
  title: string;
  count: number;
};

export function InterviewRoundsFlow({
  rounds,
  onAddRound,
  onDeleteRound,
  onRoundClick,
  minRounds = 1,
  title = "Interview rounds",
  description = "Configure rounds for this job's interview pipeline.",
}: {
  rounds: InterviewRoundPill[];
  onAddRound: (title: string) => void;
  onDeleteRound: (id: string) => void;
  onRoundClick?: (id: string) => void;
  minRounds?: number;
  title?: string;
  description?: string;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoundTitle, setNewRoundTitle] = useState("");

  function handleAddRound() {
    const trimmed = newRoundTitle.trim();
    if (!trimmed) {
      toast.error("Enter a round name");
      return;
    }
    if (rounds.some((r) => r.title.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("A round with this name already exists");
      return;
    }
    onAddRound(trimmed);
    setNewRoundTitle("");
    setShowAddForm(false);
    toast.success(`Added ${trimmed}`);
  }

  function handleDelete(id: string) {
    if (rounds.length <= minRounds) {
      toast.error("At least one interview round is required");
      return;
    }
    onDeleteRound(id);
  }

  return (
    <div
      className={cn(
        // Match kanban board's light, accent-tinted gradient background
        kanbanBoardTint,
        "!rounded-[14px] p-3 sm:p-4",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">{title}</p>
          <p className="mt-0.5 text-[12px] text-text-secondary/70">{description}</p>
        </div>
        {!showAddForm ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1.5 rounded-[9px] border-[rgba(15,23,42,0.08)] bg-white/70 text-[12px] text-text shadow-sm hover:bg-white",
            )}
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Add round
          </Button>
        ) : null}
      </div>

      {rounds.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {rounds.map((round) => (
            <li
              key={round.id}
              className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,23,42,0.08)] bg-white/70 py-1 pl-3 pr-1 text-[12px] font-medium text-[#3F3F46] shadow-sm backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-text-secondary"
            >
              {onRoundClick ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full outline-none hover:text-forest focus-visible:ring-2 focus-visible:ring-forest/20"
                  onClick={() => onRoundClick(round.id)}
                >
                  <span>{round.title}</span>
                  <span className="tabular-nums text-[11px] text-muted">({round.count})</span>
                </button>
              ) : (
                <>
                  <span>{round.title}</span>
                  <span className="tabular-nums text-[11px] text-muted">({round.count})</span>
                </>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full text-muted hover:text-destructive"
                aria-label={`Delete ${round.title}`}
                onClick={() => handleDelete(round.id)}
              >
                <Trash2 className="h-3 w-3" strokeWidth={1.5} />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {showAddForm ? (
        <div className={cn("flex flex-wrap items-center gap-2", rounds.length > 0 ? "mt-3" : "mt-3")}>
          <Input
            value={newRoundTitle}
            onChange={(e) => setNewRoundTitle(e.target.value)}
            placeholder="e.g. Culture fit"
            className="h-9 max-w-xs rounded-[9px] text-[13px]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddRound();
              }
              if (e.key === "Escape") {
                setShowAddForm(false);
                setNewRoundTitle("");
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-[9px] bg-forest text-white hover:bg-forest/90"
            onClick={handleAddRound}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-[9px]"
            onClick={() => {
              setShowAddForm(false);
              setNewRoundTitle("");
            }}
          >
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  );
}
