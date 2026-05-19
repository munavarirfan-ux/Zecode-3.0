"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, Star, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SKILL_QUICK_SIGNALS,
  type SkillFeedbackEntry,
} from "@/lib/hiring/interviewFeedback";
import { AutoGrowTextarea } from "./AutoGrowTextarea";
import {
  compactInput,
  expandLink,
  feedbackCardPad,
  feedbackCardRadius,
  inlineInput,
  signalChip,
  skillHasDetailedContent,
  skillModule,
  wsText,
} from "./feedbackWorkspaceTokens";

function MinimalStarRating({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex shrink-0 items-center gap-px"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = display >= star;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value >= star}
            aria-label={`${star} stars`}
            className="rounded p-0.5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.15)]"
            onMouseEnter={() => setHover(star)}
            onClick={() => onChange(star)}
          >
            <Star
              className="h-4 w-4"
              fill={active ? "currentColor" : "none"}
              strokeWidth={1.5}
              style={{
                color: active ? "rgb(var(--accent-rgb))" : "#D4D4D8",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

function CompactSignals({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) onChange(selected.filter((t) => t !== tag));
    else onChange([...selected, tag]);
  };

  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Quick signals">
      {options.map((tag) => (
        <button
          key={tag}
          type="button"
          aria-pressed={selected.includes(tag)}
          className={signalChip(selected.includes(tag))}
          onClick={() => toggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

function CompactListField({
  label,
  prefix,
  items,
  onChange,
  placeholder,
  readOnly,
}: {
  label: string;
  prefix: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  readOnly?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };

  return (
    <div>
      <p className={cn("mb-2 text-[11px] font-medium", wsText("muted"))}>{label}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className={cn("group flex items-start gap-2 text-[12px] leading-snug", wsText("body"))}
          >
            <span className={cn("shrink-0 tabular-nums", wsText("faint"))}>{prefix}</span>
            <span className="min-w-0 flex-1">{item}</span>
            {!readOnly ? (
              <button
                type="button"
                aria-label={`Remove ${item}`}
                className="shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#C4C4C8] hover:text-[#71717A]"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              >
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {!readOnly ? (
        <div className="mt-2 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className={cn(compactInput, "h-8 flex-1 py-1.5 text-[12px]")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function SkillModule({
  skill,
  onChange,
  onDelete,
  readOnly,
}: {
  skill: SkillFeedbackEntry;
  onChange: (next: SkillFeedbackEntry) => void;
  onDelete?: () => void;
  readOnly?: boolean;
}) {
  const signals = SKILL_QUICK_SIGNALS[skill.title] ?? ["Clear", "Structured", "Needs work", "Strong"];
  const titleSuffix = skill.custom ? "" : " Skills";
  const hasDetail = skillHasDetailedContent(skill);
  const [expanded, setExpanded] = useState(hasDetail);

  useEffect(() => {
    if (hasDetail) setExpanded(true);
  }, [hasDetail]);

  return (
    <article className={skillModule(expanded)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
          {skill.custom && !readOnly ? (
            <input
              value={skill.title}
              onChange={(e) => onChange({ ...skill, title: e.target.value })}
              placeholder="Skill name"
              className={cn(inlineInput, "min-w-[120px] flex-1")}
            />
          ) : (
            <h3 className={cn("text-[15px] font-semibold tracking-[-0.03em]", wsText("primary"))}>
              {skill.title}
              <span className={cn("font-normal", wsText("muted"))}>{titleSuffix}</span>
            </h3>
          )}
          <MinimalStarRating
            label={`Rating for ${skill.title}`}
            value={skill.rating}
            onChange={(rating) => onChange({ ...skill, rating })}
          />
        </div>
        {onDelete ? (
          <button
            type="button"
            aria-label={`Remove ${skill.title}`}
            className={cn("rounded-lg p-1 transition-colors", wsText("faint"), "hover:text-[#71717A]")}
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        ) : null}
      </div>

      <div className="mt-3 space-y-2.5">
        <CompactSignals
          options={signals}
          selected={skill.quickSignals}
          onChange={(quickSignals) => onChange({ ...skill, quickSignals })}
        />

        <AutoGrowTextarea
          value={skill.summary}
          onChange={(summary) => onChange({ ...skill, summary })}
          placeholder="Quick evaluation summary…"
          className={compactInput}
          readOnly={readOnly}
          minRows={1}
        />

        {expanded ? (
          <div className="space-y-4 border-t border-[rgba(15,23,42,0.05)] pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <CompactListField
                label="Strengths"
                prefix="+"
                items={skill.strengths}
                onChange={(strengths) => onChange({ ...skill, strengths })}
                placeholder="Add strength"
                readOnly={readOnly}
              />
              <CompactListField
                label="Concerns"
                prefix="–"
                items={skill.concerns}
                onChange={(concerns) => onChange({ ...skill, concerns })}
                placeholder="Add concern"
                readOnly={readOnly}
              />
            </div>
            <div>
              <p className={cn("mb-2 text-[11px] font-medium", wsText("muted"))}>Detailed notes</p>
              <AutoGrowTextarea
                value={skill.detailedNotes}
                onChange={(detailedNotes) => onChange({ ...skill, detailedNotes })}
                placeholder="Expanded observations…"
                className={compactInput}
                readOnly={readOnly}
                minRows={2}
              />
            </div>
          </div>
        ) : null}

        {!readOnly ? (
          <button
            type="button"
            className={cn("inline-flex items-center gap-1", expandLink)}
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
          >
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform duration-200", expanded && "rotate-180")}
              strokeWidth={2}
            />
            {expanded ? "Collapse detailed evaluation" : "Expand detailed evaluation"}
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function FeedbackEditorialSkills({
  skills,
  onChange,
  onAddField,
  readOnly,
}: {
  skills: SkillFeedbackEntry[];
  onChange: (skills: SkillFeedbackEntry[]) => void;
  onAddField: () => void;
  readOnly?: boolean;
}) {
  const updateSkill = (id: string, next: SkillFeedbackEntry) => {
    onChange(skills.map((s) => (s.id === id ? next : s)));
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <SkillModule
          key={skill.id}
          skill={skill}
          onChange={(next) => updateSkill(skill.id, next)}
          onDelete={!readOnly && skill.custom ? () => removeSkill(skill.id) : undefined}
          readOnly={readOnly}
        />
      ))}

      {!readOnly ? (
        <button
          type="button"
          onClick={onAddField}
          className={cn(
            feedbackCardRadius,
            feedbackCardPad,
            "flex w-full items-center justify-center gap-2",
            "text-[12px] font-medium text-[#A1A1AA]",
            "ring-1 ring-dashed ring-[rgba(15,23,42,0.08)]",
            "transition-colors hover:bg-[rgba(15,23,42,0.02)] hover:text-[#71717A]",
          )}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Add evaluation field
        </button>
      ) : null}
    </div>
  );
}
