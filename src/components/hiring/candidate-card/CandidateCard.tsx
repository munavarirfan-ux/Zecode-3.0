"use client";

import { useRef } from "react";
import { GripVertical, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CandidateVerdict, HiringCandidate } from "@/lib/hiring/types";
import type { InterviewOperationalStatus } from "@/lib/hiring/interviewKanbanOps";
import type { HiringStageName } from "@/lib/hiring/stages";
import {
  formatAppliedTooltip,
  formatRelativeApplied,
  getCandidateInitials,
  getKanbanActionLabels,
  getKanbanStageButtonVariant,
  getKebabMenuActions,
  getStageAction,
  getUnreadEmailCount,
  resolveCandidateCardStage,
  type KanbanMenuAction,
  type PrimaryActionId,
  type StageActionContext,
} from "@/lib/hiring/stage-actions";
import { enrichCandidateOwnership } from "@/lib/hiring/candidateOwnership";
import { kanbanCard, kanbanCardDragging } from "../hiringTokens";
import { CandidateSourceIcon, sourceShortLabel } from "./CandidateSourceIcon";
import { CandidateCardKebabMenu } from "./CandidateCardKebabMenu";
import { CandidateStatusLine } from "./CandidateStatusLine";
import { CandidateVerdictPicker } from "./CandidateVerdictPicker";
import { EngagedByPills } from "./EngagedByPills";

/** Avatar + gap — content column aligns with name block */
const CONTENT_INDENT = { default: "pl-[42px]", compact: "pl-[32px]" } as const;

export function CandidateCard({
  candidate,
  pipelineStage,
  interviewStatus,
  draggable,
  isDragging,
  highlight,
  actionDisabled,
  actionDisabledHint,
  onDragStart,
  onDragEnd,
  onCardClick,
  onPrimaryAction,
  onMenuAction,
  onVerdictChange,
  onOpenEmails,
  showDragHandle = true,
  showEngagedBy = true,
  showVerdictPicker = true,
  showStatusLine = true,
  compact = false,
  selectable = false,
  selected = false,
  selectionActive = false,
  onSelectedChange,
}: {
  candidate: HiringCandidate;
  pipelineStage: HiringStageName;
  interviewStatus?: InterviewOperationalStatus;
  draggable: boolean;
  isDragging: boolean;
  highlight?: boolean;
  actionDisabled?: boolean;
  actionDisabledHint?: string;
  onDragStart: () => void;
  onDragEnd: () => void;
  onCardClick: () => void;
  onPrimaryAction: (action: PrimaryActionId, candidate: HiringCandidate) => void;
  onMenuAction: (action: KanbanMenuAction, candidate: HiringCandidate) => void;
  onVerdictChange: (verdict: CandidateVerdict, reason?: string) => void;
  onOpenEmails?: (candidate: HiringCandidate) => void;
  showDragHandle?: boolean;
  showEngagedBy?: boolean;
  /** Thumbs verdict dropdown on card header */
  showVerdictPicker?: boolean;
  /** Status row (e.g. Awaiting review, Shortlisted) below candidate meta */
  showStatusLine?: boolean;
  /** Tighter layout for kanban columns — fits more cards per column */
  compact?: boolean;
  /** Bulk selection checkbox */
  selectable?: boolean;
  selected?: boolean;
  /** When any card is selected, show all checkboxes */
  selectionActive?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}) {
  const suppressClickRef = useRef(false);
  const enriched = enrichCandidateOwnership(candidate);
  const cardStage = resolveCandidateCardStage(enriched, pipelineStage);
  const verdict = enriched.verdict ?? "pending";
  const unread = getUnreadEmailCount(enriched);
  const appliedShort = formatRelativeApplied(enriched.appliedAt);
  const appliedFull = formatAppliedTooltip(enriched.appliedAt);
  const engagedBy = enriched.engagedBy ?? [];
  const ownerId = enriched.ownerId ?? "";

  const actionContext: StageActionContext = {
    cardStage,
    verdict,
    interviewStatus,
    pipelineStage,
  };
  const stageAction = getStageAction(actionContext);
  const { short: actionLabelShort, full: actionLabelFull } = getKanbanActionLabels(stageAction);
  const ActionIcon = stageAction.icon;
  const hasKebab = getKebabMenuActions(actionContext).length > 0;

  return (
    <article
      role={draggable ? "group" : "button"}
      tabIndex={0}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/candidate-id", enriched.id);
        e.dataTransfer.effectAllowed = "move";
        suppressClickRef.current = true;
        onDragStart();
      }}
      onDragEnd={() => {
        onDragEnd();
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (suppressClickRef.current) return;
        onCardClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick();
        }
      }}
      className={cn(
        kanbanCard,
        compact ? "rounded-[10px] p-2" : "p-3.5",
        "group transition-shadow hover:shadow-md",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDragging && kanbanCardDragging,
        highlight && "kanban-card-highlight",
        selected && "ring-2 ring-[rgb(var(--accent-rgb)/0.35)]",
      )}
      aria-label={`View ${enriched.name}`}
    >
      {/* Identity row — avatar + name block; kebab top-right of name */}
      <div className={cn("relative flex items-start", compact ? "gap-2" : "gap-2.5")}>
        {selectable ? (
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectedChange?.(checked === true)}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "mt-1 shrink-0",
              selected || selectionActive
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100",
            )}
            aria-label={selected ? `Deselect ${enriched.name}` : `Select ${enriched.name}`}
          />
        ) : null}
        {showDragHandle && !draggable && !selectable ? (
          <GripVertical
            className={cn(
              "absolute -left-0.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100",
              compact ? "top-0.5 h-3 w-3" : "top-1 h-3.5 w-3.5",
            )}
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
        <span
          className={cn(
            "mt-0.5 flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent/15 to-accent-deep/10 font-semibold text-accent-deep dark:text-accent",
            compact ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs",
          )}
          aria-hidden
        >
          {enriched.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={enriched.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            getCandidateInitials(enriched.name)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <p
              className={cn(
                "min-w-0 truncate font-semibold leading-tight text-text",
                compact ? "text-xs" : "text-sm",
              )}
            >
              {enriched.name}
            </p>
            <div className="flex shrink-0 items-center gap-0.5">
              {showVerdictPicker ? (
                <CandidateVerdictPicker
                  candidateName={enriched.name}
                  verdict={verdict}
                  compact={compact}
                  onVerdictChange={(next, reason) => onVerdictChange(next, reason)}
                />
              ) : null}
              {unread > 0 ? (
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center rounded-md text-accent hover:bg-accent/10",
                    compact ? "h-4 w-4" : "h-5 w-5",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEmails?.(enriched);
                  }}
                  aria-label={`${unread} unread emails`}
                >
                  <Mail className="h-3 w-3" strokeWidth={1.75} />
                </button>
              ) : null}
              {hasKebab ? (
                <CandidateCardKebabMenu
                  actionContext={actionContext}
                  onMenuAction={(action) => onMenuAction(action, enriched)}
                  triggerClassName={cn(
                    "shrink-0 opacity-0 transition-opacity group-hover:opacity-100",
                    compact ? "h-4 w-4" : "h-5 w-5",
                  )}
                />
              ) : null}
            </div>
          </div>
          <div
            className={cn(
              "mt-0.5 flex min-w-0 items-center gap-1 text-muted",
              compact ? "text-[10px]" : "gap-1.5 text-xs",
            )}
          >
            <CandidateSourceIcon
              source={enriched.source as string}
              className={cn("shrink-0", compact ? "h-2.5 w-2.5" : "h-3 w-3")}
            />
            <span className="truncate">{sourceShortLabel(enriched.source as string)}</span>
            <span className="opacity-50" aria-hidden>
              ·
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="shrink-0 tabular-nums">{appliedShort}</span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Applied {appliedFull}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {showStatusLine ? (
        <div className={cn(compact ? "mt-1.5" : "mt-2.5", CONTENT_INDENT[compact ? "compact" : "default"])}>
          <CandidateStatusLine
            cardStage={cardStage}
            verdict={verdict}
            interviewStatus={interviewStatus}
            compact
          />
        </div>
      ) : null}

      {/* Engaged by */}
      {showEngagedBy && engagedBy.length > 0 ? (
        <div
          className={cn(
            "flex items-center gap-1.5",
            compact ? "mt-1" : "mt-2 gap-2",
            CONTENT_INDENT[compact ? "compact" : "default"],
          )}
        >
          <span className={cn("shrink-0 text-muted", compact ? "text-[10px]" : "text-xs")}>
            Engaged:
          </span>
          <EngagedByPills recruiters={engagedBy} ownerId={ownerId} compact={compact} />
        </div>
      ) : null}

      {/* Action — separated by border */}
      <div
        className={cn(
          "flex flex-col items-center border-t border-border-subtle",
          compact ? "mt-2 pt-2" : "mt-3.5 pt-3",
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant={getKanbanStageButtonVariant(stageAction)}
              disabled={actionDisabled}
              className={cn(
                "w-full max-w-[85%] gap-1 rounded-[8px] font-semibold",
                stageAction.buttonVariant === "tertiary" ? "shadow-none" : "shadow-sm",
                compact
                  ? "h-7 min-h-7 min-w-[112px] px-2 text-[11px]"
                  : "h-8 min-h-8 min-w-[140px] px-3 text-xs gap-1.5 rounded-[9px]",
                actionDisabled && "opacity-60",
              )}
              onClick={(e) => {
                e.stopPropagation();
                onPrimaryAction(stageAction.action, enriched);
              }}
            >
              <ActionIcon
                className={cn("shrink-0", compact ? "h-2.5 w-2.5" : "h-3 w-3")}
                strokeWidth={1.75}
              />
              <span className="whitespace-nowrap">{actionLabelShort}</span>
            </Button>
          </TooltipTrigger>
          {actionLabelShort !== actionLabelFull ? (
            <TooltipContent side="bottom" className="text-xs">
              {actionLabelFull}
            </TooltipContent>
          ) : null}
        </Tooltip>
        {actionDisabled && actionDisabledHint ? (
          <p
            className={cn(
              "max-w-full px-1 text-center leading-snug text-muted",
              compact ? "mt-1 text-[9px]" : "mt-1.5 text-[10px]",
            )}
          >
            {actionDisabledHint}
          </p>
        ) : null}
      </div>
    </article>
  );
}
