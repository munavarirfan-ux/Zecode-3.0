"use client";

import { useMemo, useState } from "react";
import { FileText, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createEducationEntry,
  createEmptyEmployer,
  createEmptySocialLink,
  CANDIDATE_SOURCES,
  HIRING_STAGES,
  SOURCE_CATEGORIES,
  STAGE_SUBSTAGES,
  SUGGESTED_TAGS,
  type CandidateEditProfile,
  type ProfileFieldErrors,
} from "@/lib/hiring/candidateProfile";
import { defaultSubstageForStage, inferSourceCategory } from "@/lib/hiring/stages";
import type { CandidateSource, HiringStageName, SourceCategory } from "@/lib/hiring/stages";
import { dashboardLabel, dashboardSectionTitle } from "@/components/dashboard/dashboardTokens";
import {
  candidateFormInputClass,
  EducationBlock,
  EmployerBlock,
} from "./candidateFormBlocks";

export { candidateFormInputClass };

const bentoCardBase =
  "min-w-0 rounded-2xl border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_28px_-12px_rgba(15,23,42,0.08)] dark:border-white/[0.06] dark:bg-surface";

function BentoCard({
  title,
  description,
  children,
  variant = "default",
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: "default" | "primary" | "compact";
  className?: string;
}) {
  return (
    <section
      className={cn(
        bentoCardBase,
        variant === "primary" && "p-5 sm:p-6",
        variant === "default" && "p-4 sm:p-5",
        variant === "compact" && "p-3.5 sm:p-4",
        className,
      )}
    >
      <header className={cn("mb-4", variant === "compact" && "mb-3")}>
        <h3
          className={cn(
            dashboardSectionTitle,
            variant === "primary" && "text-[16px]",
            variant === "compact" && "text-[14px]",
          )}
        >
          {title}
        </h3>
        {description ? <p className="mt-1 text-[12px] leading-relaxed text-[#71717A]">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

export type CandidateFormMode = "create" | "edit";

export function CandidateForm({
  profile,
  onPatch,
  visibleErrors,
  showErrors,
  stageHelperText,
}: {
  mode?: CandidateFormMode;
  profile: CandidateEditProfile;
  onPatch: (next: Partial<CandidateEditProfile>) => void;
  visibleErrors: ProfileFieldErrors;
  showErrors: boolean;
  stageHelperText?: string;
}) {
  const [tagDraft, setTagDraft] = useState("");

  const substageOptions = useMemo(
    () => [...(STAGE_SUBSTAGES[profile.application.stage] ?? [])],
    [profile.application.stage],
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || profile.application.tags.includes(trimmed)) return;
    onPatch({
      application: {
        ...profile.application,
        tags: [...profile.application.tags, trimmed],
      },
    });
    setTagDraft("");
  };

  const removeTag = (tag: string) => {
    onPatch({
      application: {
        ...profile.application,
        tags: profile.application.tags.filter((t) => t !== tag),
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 sm:py-6">
      {showErrors && Object.keys(visibleErrors).length > 0 ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-[13px] text-[#991B1B]"
        >
          <p className="font-medium">Please fix the highlighted fields before saving.</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-5 lg:gap-6">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
          <BentoCard title="Resume upload" description="PDF, DOC, or DOCX — up to 10MB." variant="primary">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="resume-upload"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(15,23,42,0.1)]",
                  "bg-[#FAFAFB] px-4 py-10 text-center transition-colors hover:border-accent/30 hover:bg-accent/5 dark:bg-white/[0.02]",
                  "focus-within:border-accent/30 focus-within:ring-2 focus-within:ring-accent/20",
                )}
              >
                <Upload className="mb-2 h-7 w-7 text-muted" strokeWidth={1.5} aria-hidden />
                <span className="text-[13px] font-medium text-text">Drag and drop resume here</span>
                <span className="mt-0.5 text-[12px] text-muted">or click to browse</span>
                <input
                  id="resume-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onPatch({ resumeFileName: file.name });
                  }}
                />
              </label>
              {profile.resumeFileName ? (
                <div className="flex items-center gap-3 rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-3 py-2.5 dark:bg-white/[0.02]">
                  <FileText className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                  <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-text">{profile.resumeFileName}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 text-muted hover:text-red-600"
                    onClick={() => onPatch({ resumeFileName: "" })}
                    aria-label={`Remove resume file ${profile.resumeFileName}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  </Button>
                </div>
              ) : null}
            </div>
          </BentoCard>

          <BentoCard title="Basic details" description="Required contact information for this applicant.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="First name" htmlFor="first-name" required error={visibleErrors.firstName}>
                <Input
                  id="first-name"
                  name="firstName"
                  autoComplete="given-name"
                  value={profile.firstName}
                  onChange={(e) => onPatch({ firstName: e.target.value })}
                  className={candidateFormInputClass}
                  aria-invalid={visibleErrors.firstName ? true : undefined}
                />
              </FormField>
              <FormField label="Last name" htmlFor="last-name" required error={visibleErrors.lastName}>
                <Input
                  id="last-name"
                  name="lastName"
                  autoComplete="family-name"
                  value={profile.lastName}
                  onChange={(e) => onPatch({ lastName: e.target.value })}
                  className={candidateFormInputClass}
                  aria-invalid={visibleErrors.lastName ? true : undefined}
                />
              </FormField>
              <FormField label="Middle name" htmlFor="middle-name" className="sm:col-span-2">
                <Input
                  id="middle-name"
                  name="middleName"
                  autoComplete="additional-name"
                  value={profile.middleName}
                  onChange={(e) => onPatch({ middleName: e.target.value })}
                  className={candidateFormInputClass}
                />
              </FormField>
              <FormField label="Email" htmlFor="email" required error={visibleErrors.email}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={profile.email}
                  onChange={(e) => onPatch({ email: e.target.value })}
                  className={candidateFormInputClass}
                  aria-invalid={visibleErrors.email ? true : undefined}
                />
              </FormField>
              <FormField label="Mobile" htmlFor="mobile" required error={visibleErrors.mobile}>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  value={profile.mobile}
                  onChange={(e) => onPatch({ mobile: e.target.value })}
                  className={candidateFormInputClass}
                  aria-invalid={visibleErrors.mobile ? true : undefined}
                />
              </FormField>
            </div>
          </BentoCard>

          <BentoCard title="Social network">
            <div className="space-y-3">
              {profile.socialLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="space-y-3 rounded-xl border border-[rgba(15,23,42,0.05)] bg-[#FAFAFB] p-3 dark:bg-white/[0.02]"
                >
                  <FormField label="Hyperlink label" htmlFor={`link-label-${link.id}`}>
                    <Input
                      id={`link-label-${link.id}`}
                      value={link.label}
                      placeholder="LinkedIn"
                      onChange={(e) => {
                        const socialLinks = [...profile.socialLinks];
                        socialLinks[index] = { ...link, label: e.target.value };
                        onPatch({ socialLinks });
                      }}
                      className={candidateFormInputClass}
                    />
                  </FormField>
                  <div className="flex gap-2">
                    <FormField label="Hyperlink URL" htmlFor={`link-url-${link.id}`} className="min-w-0 flex-1">
                      <Input
                        id={`link-url-${link.id}`}
                        type="url"
                        value={link.url}
                        placeholder="https://"
                        onChange={(e) => {
                          const socialLinks = [...profile.socialLinks];
                          socialLinks[index] = { ...link, url: e.target.value };
                          onPatch({ socialLinks });
                        }}
                        className={candidateFormInputClass}
                      />
                    </FormField>
                    <div className="flex shrink-0 items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-10 text-muted hover:text-red-600"
                        onClick={() => onPatch({ socialLinks: profile.socialLinks.filter((l) => l.id !== link.id) })}
                        disabled={profile.socialLinks.length <= 1}
                        aria-label={`Remove link ${link.label || index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => onPatch({ socialLinks: [...profile.socialLinks, createEmptySocialLink()] })}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Add link
              </Button>
            </div>
          </BentoCard>

        </div>

        <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
          <BentoCard title="Education" description="10th, 12th, and Bachelors are required. Master's is optional — add other qualifications if needed.">
            <div className="space-y-4">
              {profile.education.map((entry, index) => (
                <EducationBlock
                  key={entry.id}
                  entry={entry}
                  error={visibleErrors[`education-${entry.id}`]}
                  titleEditable={!entry.required}
                  onChange={(next) => {
                    const education = [...profile.education];
                    education[index] = next;
                    onPatch({ education });
                  }}
                  onRemove={() => onPatch({ education: profile.education.filter((e) => e.id !== entry.id) })}
                  canRemove={!entry.required}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() =>
                  onPatch({
                    education: [...profile.education, createEducationEntry("", { required: false })],
                  })
                }
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Add qualification
              </Button>
            </div>
          </BentoCard>

          <BentoCard title="Experience" description="One details field per role — add more as needed.">
            <div className="space-y-4">
              {profile.employers.map((emp, index) => (
                <EmployerBlock
                  key={emp.id}
                  employer={emp}
                  index={index}
                  onChange={(next) => {
                    const employers = [...profile.employers];
                    employers[index] = next;
                    onPatch({ employers });
                  }}
                  onRemove={() => onPatch({ employers: profile.employers.filter((e) => e.id !== emp.id) })}
                  canRemove={profile.employers.length > 1}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => onPatch({ employers: [...profile.employers, createEmptyEmployer()] })}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Add employer
              </Button>
            </div>
          </BentoCard>

          <BentoCard title="Application" description={stageHelperText}>
            <div className="space-y-4">
              <FormField label="Stage" htmlFor="application-stage" required>
                <Select
                  value={profile.application.stage}
                  onValueChange={(v) => {
                    const stage = v as HiringStageName;
                    onPatch({
                      application: {
                        ...profile.application,
                        stage,
                        substage: defaultSubstageForStage(stage),
                      },
                    });
                  }}
                >
                  <SelectTrigger id="application-stage" className={candidateFormInputClass}>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {HIRING_STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Sub-stage" htmlFor="application-substage">
                <Select
                  value={profile.application.substage}
                  onValueChange={(v) => onPatch({ application: { ...profile.application, substage: v } })}
                >
                  <SelectTrigger id="application-substage" className={candidateFormInputClass}>
                    <SelectValue placeholder="Select sub-stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {substageOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Source" htmlFor="application-source" required>
                <Select
                  value={profile.application.source}
                  onValueChange={(v) => {
                    const source = v as CandidateSource;
                    onPatch({
                      application: {
                        ...profile.application,
                        source,
                        sourceCategory: inferSourceCategory(source),
                      },
                    });
                  }}
                >
                  <SelectTrigger id="application-source" className={candidateFormInputClass}>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {CANDIDATE_SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Source category" htmlFor="application-source-category" required>
                <Select
                  value={profile.application.sourceCategory}
                  onValueChange={(v) =>
                    onPatch({
                      application: {
                        ...profile.application,
                        sourceCategory: v as SourceCategory,
                      },
                    })
                  }
                >
                  <SelectTrigger id="application-source-category" className={candidateFormInputClass}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <div>
                <p className={dashboardLabel} id="application-tags-label">
                  Tags
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5" aria-labelledby="application-tags-label">
                  {profile.application.tags.length === 0 ? (
                    <p className="text-[12px] text-muted">No tags yet.</p>
                  ) : (
                    profile.application.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,23,42,0.08)] bg-[#F4F4F5] py-0.5 pl-2.5 pr-1 text-[12px] font-medium text-[#52525B]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="rounded-full p-0.5 text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <Trash2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <Input
                    id="application-tag-input"
                    value={tagDraft}
                    onChange={(e) => setTagDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(tagDraft);
                      }
                    }}
                    placeholder="Add tag…"
                    className={candidateFormInputClass}
                  />
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_TAGS.filter((t) => !profile.application.tags.includes(t)).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="rounded-full border border-dashed border-[rgba(15,23,42,0.12)] px-2 py-0.5 text-[11px] text-muted hover:border-accent/30"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </div>
  );
}
