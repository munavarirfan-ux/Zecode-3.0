"use client";

import { useState } from "react";
import { Check, Minus, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HireRecommendation } from "@/lib/hiring/interviewFeedback";
import { RECOMMENDATION_OPTIONS } from "@/lib/hiring/interviewFeedback";
import {
  dashboardLabel,
  dashboardPanelInteractive,
  dashboardSectionSub,
  dashboardSectionTitle,
} from "@/components/dashboard/dashboardTokens";

export function SidebarCard({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(dashboardPanelInteractive, "p-3.5", className)}>
      {title ? <h3 className="text-[13px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">{title}</h3> : null}
      {subtitle ? <p className={cn("text-[11px] leading-snug text-[#71717A]", title && "mt-0.5")}>{subtitle}</p> : null}
      <div className={cn(title || subtitle ? "mt-2.5" : "")}>{children}</div>
    </section>
  );
}

function RecommendationIcon({ type }: { type: (typeof RECOMMENDATION_OPTIONS)[number]["icon"] }) {
  const cls = "h-3.5 w-3.5 shrink-0";
  if (type === "x") return <X className={cls} strokeWidth={2} aria-hidden />;
  if (type === "minus") return <Minus className={cls} strokeWidth={2} aria-hidden />;
  if (type === "tilde") return <span className="text-[13px] font-semibold leading-none" aria-hidden>~</span>;
  if (type === "check") return <Check className={cls} strokeWidth={2.5} aria-hidden />;
  return <Star className={cls} fill="currentColor" strokeWidth={0} aria-hidden />;
}

export function RecommendationPills({
  value,
  onChange,
  compact,
}: {
  value: HireRecommendation | null;
  onChange: (value: HireRecommendation) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Hiring recommendation">
      {RECOMMENDATION_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          data-selected={value === opt.value}
          className={cn(
            "flex w-full items-center gap-2 rounded-[10px] border px-2.5 py-2 text-left text-[12px] font-medium transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
            compact ? "py-1.5" : "py-2",
            opt.className,
          )}
          onClick={() => onChange(opt.value)}
        >
          <RecommendationIcon type={opt.icon} />
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export function CompletionProgress({ value }: { value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[12px] font-medium text-[#18181B] dark:text-text">Feedback completion</span>
        <span className="text-[12px] font-semibold tabular-nums text-accent">{value}%</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-[#F4F4F5] dark:bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Feedback completion"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function StarRating({
  value,
  onChange,
  label,
  size = "md",
  readOnly,
}: {
  value: number;
  onChange?: (rating: number) => void;
  label: string;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const starClass =
    size === "lg" ? "h-5 w-5" : size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const display = hover || value;

  if (readOnly) {
    return (
      <div className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(starClass, value >= star ? "text-amber-500" : "text-[#E4E4E7]")}
            fill={value >= star ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => setHover(0)}
      onKeyDown={(e) => {
        if (!onChange) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(Math.min(5, value + 1));
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onChange(Math.max(1, value - 1));
        }
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value >= star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={cn(
            "rounded p-0.5 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
            display >= star ? "scale-105 text-amber-500" : "text-[#D4D4D8] hover:text-amber-400",
          )}
          onMouseEnter={() => setHover(star)}
          onClick={() => onChange?.(star)}
          onFocus={() => setHover(star)}
          onBlur={() => setHover(0)}
        >
          <Star className={starClass} fill={display >= star ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

export function StrengthPills({
  items,
  onChange,
  readOnly,
  placeholder = "Add strength…",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value || items.includes(value)) return;
    onChange([...items, value]);
    setDraft("");
  };

  const pillClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
      active
        ? "border border-accent/30 bg-accent/[0.08] text-accent"
        : "border border-[rgba(15,23,42,0.08)] bg-white text-[#52525B]",
    );

  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium text-[#71717A]">Strengths</p>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Strengths">
        {items.map((tag) =>
          readOnly ? (
            <span key={tag} className={pillClass(true)}>
              {tag}
            </span>
          ) : (
            <button
              key={tag}
              type="button"
              aria-label={`Remove ${tag}`}
              className={cn(
                pillClass(true),
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
              )}
              onClick={() => onChange(items.filter((t) => t !== tag))}
            >
              {tag}
              <X className="h-3 w-3 shrink-0 opacity-70" strokeWidth={2} aria-hidden />
            </button>
          ),
        )}
        {!readOnly ? (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "min-w-[120px] flex-1 rounded-full border border-dashed border-[rgba(15,23,42,0.12)] bg-transparent px-2.5 py-1 text-[11px] text-[#18181B] placeholder:text-[#A1A1AA]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            onBlur={() => {
              if (draft.trim()) add();
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export function QuickSignalTags({
  options,
  selected,
  onChange,
  variant = "default",
  isLight = true,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  variant?: "default" | "editorial";
  isLight?: boolean;
}) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) onChange(selected.filter((t) => t !== tag));
    else onChange([...selected, tag]);
  };

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick signals">
      {options.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={active}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
              variant === "editorial"
                ? active
                  ? isLight
                    ? "bg-[#E4E4E7] text-[#18181B]"
                    : "bg-white/15 text-white"
                  : isLight
                    ? "text-[#71717A] hover:bg-[rgba(15,23,42,0.05)] hover:text-[#3F3F46]"
                    : "text-[#A1A1AA] hover:bg-white/[0.06] hover:text-[#E4E4E7]"
                : cn(
                    "border",
                    active
                      ? "border-accent/30 bg-accent/[0.08] text-accent"
                      : "border-[rgba(15,23,42,0.08)] bg-white text-[#52525B] hover:border-[rgba(15,23,42,0.14)] hover:bg-[#FAFAFA]",
                  ),
            )}
            onClick={() => toggle(tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn(dashboardLabel, "normal-case tracking-[0.04em]")}>{label}</dt>
      <dd className="text-right text-[12px] font-medium text-[#18181B] dark:text-text">{value}</dd>
    </div>
  );
}

export function BenchmarkBar({ percent }: { percent: number }) {
  const filled = Math.round(percent / 10);
  return (
    <div className="flex gap-0.5 font-mono text-[11px] tracking-tight text-[#71717A]" aria-hidden>
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className={i < filled ? "text-accent" : "text-[#E4E4E7]"}>
          █
        </span>
      ))}
      <span className="ml-1 tabular-nums">{percent}%</span>
    </div>
  );
}

/** @deprecated use SidebarCard */
export function FeedbackCard({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(dashboardPanelInteractive, "p-4 sm:p-5", className)}>
      {title ? <h3 className={dashboardSectionTitle}>{title}</h3> : null}
      {subtitle ? <p className={cn(dashboardSectionSub, title && "mt-1")}>{subtitle}</p> : null}
      <div className={cn(title || subtitle ? "mt-3" : "")}>{children}</div>
    </section>
  );
}

/** @deprecated use RecommendationPills */
export const RecommendationChips = RecommendationPills;
