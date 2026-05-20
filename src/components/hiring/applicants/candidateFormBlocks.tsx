"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { EducationEntry, EmployerEntry } from "@/lib/hiring/candidateProfile";

export const candidateFormInputClass =
  "h-10 text-[14px] focus-visible:ring-2 focus-visible:ring-accent/25 aria-[invalid=true]:border-[#FCA5A5] aria-[invalid=true]:ring-red-500/20";

const detailsTextareaClass =
  "min-h-[96px] resize-y text-[13px] leading-relaxed focus-visible:ring-2 focus-visible:ring-accent/25";

export function EducationBlock({
  entry,
  error,
  onChange,
  onRemove,
  canRemove,
  titleEditable,
}: {
  entry: EducationEntry;
  error?: string;
  onChange: (entry: EducationEntry) => void;
  onRemove: () => void;
  canRemove: boolean;
  /** When true, the qualification label (e.g. custom entries) can be edited. */
  titleEditable?: boolean;
}) {
  const detailsId = `education-${entry.id}-details`;

  return (
    <div
      className={cn(
        "rounded-xl border bg-[#FAFAFB] p-4 dark:bg-white/[0.02]",
        error ? "border-[#FCA5A5]" : "border-[rgba(15,23,42,0.06)]",
      )}
      aria-invalid={error ? true : undefined}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {titleEditable ? (
          <FormField
            label="Qualification"
            htmlFor={`education-${entry.id}-degree`}
            required={entry.required}
            className="mb-0 min-w-0 flex-1"
          >
            <Input
              id={`education-${entry.id}-degree`}
              value={entry.degree}
              onChange={(e) => onChange({ ...entry, degree: e.target.value })}
              placeholder="e.g. Diploma, Certification"
              className={candidateFormInputClass}
            />
          </FormField>
        ) : (
          <p className="text-[13px] font-semibold text-text">
            {entry.degree}
            {entry.required ? (
              <span className="ml-1 text-[#DC2626]" aria-hidden="true">
                *
              </span>
            ) : null}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 gap-1 px-2 text-[12px] text-muted hover:text-red-600"
          onClick={onRemove}
          disabled={!canRemove}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Remove
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mb-3 text-[12px] font-medium text-[#B91C1C]">
          {error}
        </p>
      ) : null}
      <FormField
        label="Details"
        htmlFor={detailsId}
        required={entry.required}
        description="Institution, dates, grades, honors — anything relevant."
      >
        <Textarea
          id={detailsId}
          value={entry.details}
          onChange={(e) => onChange({ ...entry, details: e.target.value })}
          placeholder="e.g. National Institute of Design, Ahmedabad · 2016 · 8.6 CGPA"
          rows={4}
          className={detailsTextareaClass}
        />
      </FormField>
    </div>
  );
}

export function EmployerBlock({
  employer,
  index = 0,
  onChange,
  onRemove,
  canRemove,
}: {
  employer: EmployerEntry;
  index?: number;
  onChange: (e: EmployerEntry) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const label = index > 0 ? `Experience ${index + 1}` : "Experience";

  return (
    <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] p-4 dark:bg-white/[0.02]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-text">{label}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 gap-1 px-2 text-[12px] text-muted hover:text-red-600"
          onClick={onRemove}
          disabled={!canRemove}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Remove
        </Button>
      </div>
      <FormField
        label="Details"
        htmlFor={`employer-${employer.id}-summary`}
        description="Role, company, dates, responsibilities, and outcomes."
      >
        <Textarea
          id={`employer-${employer.id}-summary`}
          value={employer.summary}
          onChange={(e) => onChange({ ...employer, summary: e.target.value })}
          placeholder={
            "e.g. Senior Product Designer — NovaTech (2021–Present)\nLed design system adoption across product squads…"
          }
          rows={4}
          className={detailsTextareaClass}
        />
      </FormField>
    </div>
  );
}
