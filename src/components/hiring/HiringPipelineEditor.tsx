"use client";

import { useMemo, useState } from "react";
import { GripVertical, Lock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { candidateFormInputClass } from "@/components/hiring/applicants/candidateFormBlocks";
import {
  createInterviewRoundId,
  FIXED_APPLICANTS_STATS_STEPS,
  FIXED_HIRE_OFFER_STEPS,
  insertInterviewRoundBeforeHr,
  isHrInterviewRound,
  normalizeInterviewRoundOrder,
  partitionInterviewRounds,
  reorderMovableInterviewRounds,
} from "@/lib/hiring/customiseHiringProcess";
import type { InterviewRound } from "@/lib/hiring/interviewRounds";
import { cn } from "@/lib/utils";

const MIN_INTERVIEW_ROUNDS = 1;

function FixedStepRow({ name }: { name: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[40px] items-center gap-2 rounded-[10px] border border-[rgba(15,23,42,0.06)]",
        "bg-[#FAFAFB] px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.03]",
      )}
    >
      <Lock className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
      <span className="text-[13px] font-medium text-text-secondary/90">{name}</span>
    </div>
  );
}

function InterviewRoundRow({
  round,
  draggable,
  dragActive,
  dropTarget,
  onRename,
  onDelete,
  canDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  round: InterviewRound;
  draggable: boolean;
  dragActive?: boolean;
  dropTarget?: boolean;
  onRename: (title: string) => void;
  onDelete: () => void;
  canDelete: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
}) {
  const pinnedHr = isHrInterviewRound(round);

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => {
        if (!draggable) return;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", round.id);
        onDragStart?.();
      }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.();
      }}
      className={cn(
        "flex items-center gap-2 rounded-xl border bg-[#FAFAFB] p-2.5 transition-[border-color,box-shadow,opacity]",
        "dark:bg-white/[0.02]",
        dragActive && "opacity-50",
        dropTarget
          ? "border-accent ring-2 ring-[rgb(var(--accent-rgb)/0.2)]"
          : "border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]",
        draggable && "cursor-grab active:cursor-grabbing",
      )}
    >
      {draggable ? (
        <GripVertical
          className="h-4 w-4 shrink-0 text-[#94A3B8] dark:text-muted"
          strokeWidth={1.75}
          aria-hidden
        />
      ) : (
        <Lock className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
      )}
      <Input
        value={round.title}
        onChange={(e) => onRename(e.target.value)}
        className={cn(candidateFormInputClass, "min-w-0 flex-1")}
        aria-label={`Interview round name: ${round.title}`}
      />
      {pinnedHr ? (
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted">Last</span>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 shrink-0 gap-1 px-2 text-[12px] text-muted hover:text-red-600"
          aria-label={`Delete ${round.title}`}
          disabled={!canDelete}
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Delete
        </Button>
      )}
    </div>
  );
}

function SortableInterviewRoundsList({
  interviewRounds,
  onInterviewRoundsChange,
  onRenameInterviewRound,
  onDeleteInterviewRound,
}: {
  interviewRounds: InterviewRound[];
  onInterviewRoundsChange: (rounds: InterviewRound[]) => void;
  onRenameInterviewRound: (id: string, title: string) => void;
  onDeleteInterviewRound: (id: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const { movable, hr } = useMemo(
    () => partitionInterviewRounds(interviewRounds),
    [interviewRounds],
  );
  const canDeleteRound = interviewRounds.length > MIN_INTERVIEW_ROUNDS;

  function handleDrop(targetId: string) {
    if (!dragId) return;
    onInterviewRoundsChange(
      normalizeInterviewRoundOrder(reorderMovableInterviewRounds(interviewRounds, dragId, targetId)),
    );
    setDragId(null);
    setOverId(null);
  }

  return (
    <div className="space-y-2">
      {movable.map((round) => (
        <InterviewRoundRow
          key={round.id}
          round={round}
          draggable
          dragActive={dragId === round.id}
          dropTarget={overId === round.id && dragId !== round.id}
          canDelete={canDeleteRound}
          onRename={(title) => onRenameInterviewRound(round.id, title)}
          onDelete={() => onDeleteInterviewRound(round.id)}
          onDragStart={() => setDragId(round.id)}
          onDragEnd={() => {
            setDragId(null);
            setOverId(null);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setOverId(round.id);
          }}
          onDrop={() => handleDrop(round.id)}
        />
      ))}
      {hr ? (
        <InterviewRoundRow
          round={hr}
          draggable={false}
          canDelete={false}
          onRename={(title) => onRenameInterviewRound(hr.id, title)}
          onDelete={() => {}}
        />
      ) : null}
    </div>
  );
}

function ProcessStageBlock({
  title,
  steps,
  editable,
  interviewRounds,
  onInterviewRoundsChange,
  onAddInterviewRound,
  onRenameInterviewRound,
  onDeleteInterviewRound,
}: {
  title: string;
  steps?: { id: string; name: string }[];
  editable?: boolean;
  interviewRounds?: InterviewRound[];
  onInterviewRoundsChange?: (rounds: InterviewRound[]) => void;
  onAddInterviewRound?: () => void;
  onRenameInterviewRound?: (id: string, title: string) => void;
  onDeleteInterviewRound?: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">{title}</p>
          {!editable ? (
            <span className="rounded-full bg-[rgba(15,23,42,0.05)] px-2 py-0.5 text-[10px] font-medium text-muted">
              Fixed
            </span>
          ) : null}
        </div>
        {editable && onAddInterviewRound ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-[9px] border-[rgba(15,23,42,0.08)] bg-white text-[12px] shadow-sm hover:bg-[#FAFAFB] dark:bg-surface"
            onClick={onAddInterviewRound}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Add round
          </Button>
        ) : null}
      </div>

      <div className="space-y-2">
        {editable &&
        interviewRounds &&
        onInterviewRoundsChange &&
        onRenameInterviewRound &&
        onDeleteInterviewRound ? (
          <SortableInterviewRoundsList
            interviewRounds={interviewRounds}
            onInterviewRoundsChange={onInterviewRoundsChange}
            onRenameInterviewRound={onRenameInterviewRound}
            onDeleteInterviewRound={onDeleteInterviewRound}
          />
        ) : (
          steps?.map((step) => <FixedStepRow key={step.id} name={step.name} />)
        )}
      </div>
    </div>
  );
}

export function HiringPipelineEditor({
  interviewRounds,
  onInterviewRoundsChange,
  className,
  intro,
}: {
  interviewRounds: InterviewRound[];
  onInterviewRoundsChange: (rounds: InterviewRound[]) => void;
  className?: string;
  intro?: string;
}) {
  const orderedRounds = useMemo(
    () => normalizeInterviewRoundOrder(interviewRounds),
    [interviewRounds],
  );

  function setRounds(rounds: InterviewRound[]) {
    onInterviewRoundsChange(normalizeInterviewRoundOrder(rounds));
  }

  function addInterviewRound() {
    const title = `Interview round ${orderedRounds.length + 1}`;
    const newRound = { id: createInterviewRoundId(title, orderedRounds), title };
    setRounds(insertInterviewRoundBeforeHr(orderedRounds, newRound));
  }

  function renameInterviewRound(id: string, title: string) {
    setRounds(orderedRounds.map((round) => (round.id === id ? { ...round, title } : round)));
  }

  function deleteInterviewRound(id: string) {
    const round = orderedRounds.find((r) => r.id === id);
    if (round && isHrInterviewRound(round)) {
      toast.error("HR round stays last and cannot be removed");
      return;
    }
    if (orderedRounds.length <= MIN_INTERVIEW_ROUNDS) {
      toast.error("At least one interview round is required");
      return;
    }
    setRounds(orderedRounds.filter((round) => round.id !== id));
  }

  return (
    <div className={cn("space-y-6", className)}>
      {intro ? (
        <p className="text-[13px] leading-relaxed text-text-secondary/70">{intro}</p>
      ) : null}
      <ProcessStageBlock title="Applicants stats" steps={FIXED_APPLICANTS_STATS_STEPS} />
      <ProcessStageBlock
        title="Interviews"
        editable
        interviewRounds={orderedRounds}
        onInterviewRoundsChange={setRounds}
        onAddInterviewRound={addInterviewRound}
        onRenameInterviewRound={renameInterviewRound}
        onDeleteInterviewRound={deleteInterviewRound}
      />
      <ProcessStageBlock title="Hire and Offer" steps={FIXED_HIRE_OFFER_STEPS} />
    </div>
  );
}
