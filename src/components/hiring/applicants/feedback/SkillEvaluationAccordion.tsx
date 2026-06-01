"use client";

import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SKILL_RATING_OPTIONS,
  type SkillFeedbackEntry,
  type SkillRating,
} from "@/lib/hiring/interviewFeedback";
import { DeleteSkillAlertDialog } from "./DeleteSkillAlertDialog";
import { StrengthPills } from "./FeedbackUi";

// ── Segmented rating control ──────────────────────────────────

function SkillRatingControl({
  value,
  onChange,
  readOnly,
}: {
  value: SkillRating | undefined;
  onChange?: (v: SkillRating) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium text-[#71717A]">Rating</p>
      <div
        className="flex flex-wrap gap-1"
        role="radiogroup"
        aria-label="Skill rating"
      >
        {SKILL_RATING_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={readOnly}
              onClick={() => !readOnly && onChange?.(opt.value)}
              className={cn(
                "rounded-[8px] border px-2.5 py-1 text-[12px] font-medium transition-all duration-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
                "disabled:pointer-events-none",
                isSelected ? opt.activeClass : opt.pillClass,
                !isSelected && !readOnly && "hover:border-[rgba(15,23,42,0.16)] hover:bg-[rgba(15,23,42,0.04)]",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SkillCard({
  skill,
  onChange,
  onDelete,
  defaultOpen,
  readOnly,
}: {
  skill: SkillFeedbackEntry;
  onChange: (next: SkillFeedbackEntry) => void;
  onDelete?: () => void;
  defaultOpen?: boolean;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [showNotes, setShowNotes] = useState(Boolean(skill.detailedNotes.trim()));

  return (
    <article className="overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)] dark:border-white/[0.06] dark:bg-surface">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FAFAFA]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/25"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-[#A1A1AA] transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
          aria-hidden
        />
        {skill.custom && !readOnly ? (
          <input
            value={skill.title}
            onChange={(e) => onChange({ ...skill, title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="Skill name"
            className="min-w-0 flex-1 rounded-[6px] border border-transparent bg-transparent px-1 py-0.5 text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] outline-none focus:border-[rgba(15,23,42,0.12)] focus:bg-white dark:text-text"
            aria-label="Skill name"
          />
        ) : (
          <span className="min-w-0 flex-1 text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
            {skill.title}
          </span>
        )}
        <span
          className="flex shrink-0 items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* Rating badge in header */}
          {skill.skillRating ? (() => {
            const opt = SKILL_RATING_OPTIONS.find((o) => o.value === skill.skillRating);
            return opt ? (
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", opt.activeClass)}>
                {opt.label}
              </span>
            ) : null;
          })() : null}
          {onDelete ? (
            <button
              type="button"
              aria-label={`Remove ${skill.title}`}
              className="rounded-md p-1.5 text-[#A1A1AA] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          ) : null}
        </span>
      </button>

      {open ? (
        <div className="space-y-3 border-t border-[rgba(15,23,42,0.06)] px-4 pb-4 pt-3">
          <SkillRatingControl
            value={skill.skillRating}
            onChange={(skillRating) => onChange({ ...skill, skillRating })}
            readOnly={readOnly}
          />
          <StrengthPills
            items={skill.strengths}
            onChange={(strengths) => onChange({ ...skill, strengths })}
            readOnly={readOnly}
          />

          <div>
            <label htmlFor={`summary-${skill.id}`} className="mb-1 block text-[11px] font-medium text-[#71717A]">
              Summary
            </label>
            <input
              id={`summary-${skill.id}`}
              value={skill.summary}
              onChange={(e) => onChange({ ...skill, summary: e.target.value })}
              readOnly={readOnly}
              placeholder="One-line evaluation summary…"
              className="flex h-9 w-full rounded-[9px] border border-[rgba(15,23,42,0.08)] bg-[#FCFCFD] px-3 text-[13px] text-[#18181B] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 read-only:opacity-80"
            />
          </div>

          {!showNotes && !skill.detailedNotes.trim() && !readOnly ? (
            <button
              type="button"
              className="text-[12px] font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
              onClick={() => setShowNotes(true)}
            >
              Add detailed notes
            </button>
          ) : showNotes || skill.detailedNotes.trim() ? (
            <div>
              <label htmlFor={`notes-${skill.id}`} className="mb-1 block text-[11px] font-medium text-[#71717A]">
                Detailed notes
              </label>
              <textarea
                id={`notes-${skill.id}`}
                value={skill.detailedNotes}
                onChange={(e) => onChange({ ...skill, detailedNotes: e.target.value })}
                readOnly={readOnly}
                rows={3}
                className="w-full resize-y rounded-[9px] border border-[rgba(15,23,42,0.08)] bg-[#FCFCFD] px-3 py-2 text-[13px] leading-relaxed text-[#18181B] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 read-only:opacity-80"
                placeholder="Optional expanded evaluation…"
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function SkillEvaluationAccordion({
  skills,
  onChange,
  readOnly,
}: {
  skills: SkillFeedbackEntry[];
  onChange: (skills: SkillFeedbackEntry[]) => void;
  readOnly?: boolean;
}) {
  const [skillToDelete, setSkillToDelete] = useState<SkillFeedbackEntry | null>(null);

  const updateSkill = (id: string, next: SkillFeedbackEntry) => {
    onChange(skills.map((s) => (s.id === id ? next : s)));
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const confirmDelete = () => {
    if (!skillToDelete) return;
    removeSkill(skillToDelete.id);
    setSkillToDelete(null);
  };

  return (
    <>
      <div className="space-y-2">
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            defaultOpen={i === 0}
            onChange={(next) => updateSkill(skill.id, next)}
            onDelete={!readOnly && skill.custom ? () => setSkillToDelete(skill) : undefined}
            readOnly={readOnly}
          />
        ))}
      </div>

      <DeleteSkillAlertDialog
        open={skillToDelete !== null}
        skillTitle={skillToDelete?.title ?? ""}
        onOpenChange={(open) => {
          if (!open) setSkillToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
