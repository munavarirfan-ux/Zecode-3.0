"use client";

import { useMemo, useState } from "react";
import { FileText, Loader2, Plus, Trash2, Upload } from "lucide-react";
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
import { ADD_CANDIDATE_STEPS } from "@/lib/hiring/candidateFormSteps";
import { defaultSubstageForStage, inferSourceCategory } from "@/lib/hiring/stages";
import type { CandidateSource, HiringStageName, SourceCategory } from "@/lib/hiring/stages";
import { dashboardLabel } from "@/components/dashboard/dashboardTokens";
import {
  candidateFormInputClass,
  EducationBlock,
  EmployerBlock,
} from "./candidateFormBlocks";

export function CandidateFormStepContent({
  stepIndex,
  profile,
  onPatch,
  visibleErrors,
  showErrors,
  stageHelperText,
  parsingResume,
  resumeParsedHint,
  onResumeFile,
}: {
  stepIndex: number;
  profile: CandidateEditProfile;
  onPatch: (next: Partial<CandidateEditProfile>) => void;
  visibleErrors: ProfileFieldErrors;
  showErrors: boolean;
  stageHelperText?: string;
  parsingResume: boolean;
  resumeParsedHint: boolean;
  onResumeFile: (file: File) => void;
}) {
  const step = ADD_CANDIDATE_STEPS[stepIndex];
  const [skillDraft, setSkillDraft] = useState("");
  const [tagDraft, setTagDraft] = useState("");

  const substageOptions = useMemo(
    () => [...(STAGE_SUBSTAGES[profile.application.stage] ?? [])],
    [profile.application.stage],
  );

  const addSkill = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || profile.skills.includes(trimmed)) return;
    onPatch({ skills: [...profile.skills, trimmed] });
    setSkillDraft("");
  };

  const removeSkill = (skill: string) => {
    onPatch({ skills: profile.skills.filter((s) => s !== skill) });
  };

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
    <div role="group" aria-label={step.label}>
      {showErrors && Object.keys(visibleErrors).length > 0 ? (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-[13px] text-[#991B1B]"
        >
          <p className="font-medium">Please fix the highlighted fields to continue.</p>
        </div>
      ) : null}

      {step.key === "resume" ? (
        <StepResume
          profile={profile}
          onPatch={onPatch}
          visibleErrors={visibleErrors}
          parsingResume={parsingResume}
          resumeParsedHint={resumeParsedHint}
          onResumeFile={onResumeFile}
        />
      ) : null}

      {step.key === "basic" ? (
        <StepBasic
          profile={profile}
          onPatch={onPatch}
          visibleErrors={visibleErrors}
          skillDraft={skillDraft}
          setSkillDraft={setSkillDraft}
          addSkill={addSkill}
          removeSkill={removeSkill}
        />
      ) : null}

      {step.key === "education" ? (
        <StepEducation profile={profile} onPatch={onPatch} visibleErrors={visibleErrors} />
      ) : null}

      {step.key === "experience" ? (
        <StepExperience profile={profile} onPatch={onPatch} />
      ) : null}

      {step.key === "social" ? (
        <StepSocial profile={profile} onPatch={onPatch} />
      ) : null}

      {step.key === "application" ? (
        <StepApplication
          profile={profile}
          onPatch={onPatch}
          visibleErrors={visibleErrors}
          stageHelperText={stageHelperText}
          substageOptions={substageOptions}
          tagDraft={tagDraft}
          setTagDraft={setTagDraft}
          addTag={addTag}
          removeTag={removeTag}
        />
      ) : null}
    </div>
  );
}

function StepResume({
  profile,
  onPatch,
  visibleErrors,
  parsingResume,
  resumeParsedHint,
  onResumeFile,
}: {
  profile: CandidateEditProfile;
  onPatch: (next: Partial<CandidateEditProfile>) => void;
  visibleErrors: ProfileFieldErrors;
  parsingResume: boolean;
  resumeParsedHint: boolean;
  onResumeFile: (file: File) => void;
}) {
  return (
    <div className="space-y-4">
      <label
        htmlFor="resume-upload-step"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-12 text-center transition-colors",
          visibleErrors.resume
            ? "border-[#FCA5A5] bg-[#FEF2F2]/40"
            : "border-[rgba(15,23,42,0.1)] bg-[#FAFAFB] hover:border-accent/30 hover:bg-accent/5 dark:bg-white/[0.02]",
          "focus-within:border-accent/30 focus-within:ring-2 focus-within:ring-accent/20",
          parsingResume && "pointer-events-none opacity-70",
        )}
      >
        {parsingResume ? (
          <>
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-accent" aria-hidden />
            <span className="text-[14px] font-medium text-text">Parsing resume…</span>
          </>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted" strokeWidth={1.5} aria-hidden />
            <span className="text-[14px] font-medium text-text">Drag and drop resume here</span>
            <span className="mt-1 text-[12px] text-muted">PDF, DOC, or DOCX — up to 10MB</span>
          </>
        )}
        <input
          id="resume-upload-step"
          type="file"
          className="sr-only"
          accept=".pdf,.doc,.docx"
          disabled={parsingResume}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onResumeFile(file);
          }}
        />
      </label>
      {visibleErrors.resume ? (
        <p role="alert" className="text-[13px] font-medium text-[#B91C1C]">
          {visibleErrors.resume}
        </p>
      ) : null}
      {profile.resumeFileName && !parsingResume ? (
        <div className="flex items-center gap-3 rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-3 py-3 dark:bg-white/[0.02]">
          <FileText className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
          <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-text">{profile.resumeFileName}</p>
          <Button
            type="button"
            variant="ghost"
            className="h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 text-muted hover:text-red-600"
            onClick={() => onPatch({ resumeFileName: "" })}
            aria-label={`Remove resume file ${profile.resumeFileName}`}
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Button>
        </div>
      ) : null}
      {resumeParsedHint ? (
        <p className="rounded-xl border border-accent/15 bg-accent/5 px-3 py-2.5 text-[13px] leading-relaxed text-[#52525B]">
          Review the extracted details before adding the candidate.
        </p>
      ) : null}
    </div>
  );
}

function StepBasic({
  profile,
  onPatch,
  visibleErrors,
  skillDraft,
  setSkillDraft,
  addSkill,
  removeSkill,
}: {
  profile: CandidateEditProfile;
  onPatch: (next: Partial<CandidateEditProfile>) => void;
  visibleErrors: ProfileFieldErrors;
  skillDraft: string;
  setSkillDraft: (v: string) => void;
  addSkill: (v: string) => void;
  removeSkill: (v: string) => void;
}) {
  return (
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
      <div className="sm:col-span-2">
        <p className={dashboardLabel} id="skills-label">
          Skills
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5" aria-labelledby="skills-label">
          {profile.skills.length === 0 ? (
            <p className="text-[12px] text-muted">No skills yet — add from parsed resume or type below.</p>
          ) : (
            profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,23,42,0.08)] bg-[#F4F4F5] py-0.5 pl-2.5 pr-1 text-[12px] font-medium text-[#52525B]"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-full p-1 text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                  aria-label={`Remove skill ${skill}`}
                >
                  <Trash2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                </button>
              </span>
            ))
          )}
        </div>
        <Input
          id="skills-input"
          value={skillDraft}
          onChange={(e) => setSkillDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill(skillDraft);
            }
          }}
          placeholder="Type a skill and press Enter"
          className={cn(candidateFormInputClass, "mt-3")}
        />
      </div>
    </div>
  );
}

function StepEducation({
  profile,
  onPatch,
  visibleErrors,
}: {
  profile: CandidateEditProfile;
  onPatch: (next: Partial<CandidateEditProfile>) => void;
  visibleErrors: ProfileFieldErrors;
}) {
  return (
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
        className="h-11 min-h-[44px] gap-1.5"
        onClick={() =>
          onPatch({
            education: [...profile.education, createEducationEntry("", { required: false })],
          })
        }
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        Add qualification
      </Button>
    </div>
  );
}

function StepExperience({
  profile,
  onPatch,
}: {
  profile: CandidateEditProfile;
  onPatch: (next: Partial<CandidateEditProfile>) => void;
}) {
  return (
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
        className="h-11 min-h-[44px] gap-1.5"
        onClick={() => onPatch({ employers: [...profile.employers, createEmptyEmployer()] })}
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        Add employer
      </Button>
    </div>
  );
}

function StepSocial({
  profile,
  onPatch,
}: {
  profile: CandidateEditProfile;
  onPatch: (next: Partial<CandidateEditProfile>) => void;
}) {
  return (
    <div className="space-y-3">
      {profile.socialLinks.map((link, index) => (
        <div
          key={link.id}
          className="space-y-3 rounded-xl border border-[rgba(15,23,42,0.05)] bg-[#FAFAFB] p-4 dark:bg-white/[0.02]"
        >
          <FormField label="Label" htmlFor={`link-label-${link.id}`}>
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
            <FormField label="URL" htmlFor={`link-url-${link.id}`} className="min-w-0 flex-1">
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
                className="h-11 min-h-[44px] w-11 min-w-[44px] text-muted hover:text-red-600"
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
        className="h-11 min-h-[44px] gap-1.5"
        onClick={() => onPatch({ socialLinks: [...profile.socialLinks, createEmptySocialLink()] })}
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        Add link
      </Button>
    </div>
  );
}

function StepApplication({
  profile,
  onPatch,
  visibleErrors,
  stageHelperText,
  substageOptions,
  tagDraft,
  setTagDraft,
  addTag,
  removeTag,
}: {
  profile: CandidateEditProfile;
  onPatch: (next: Partial<CandidateEditProfile>) => void;
  visibleErrors: ProfileFieldErrors;
  stageHelperText?: string;
  substageOptions: string[];
  tagDraft: string;
  setTagDraft: (v: string) => void;
  addTag: (v: string) => void;
  removeTag: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      {stageHelperText ? (
        <p className="text-[13px] leading-relaxed text-[#71717A]">{stageHelperText}</p>
      ) : null}
      <FormField label="Stage" htmlFor="application-stage" required error={visibleErrors.stage}>
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
      <FormField label="Source" htmlFor="application-source" required error={visibleErrors.source}>
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
                  className="rounded-full p-1 text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                  aria-label={`Remove tag ${tag}`}
                >
                  <Trash2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                </button>
              </span>
            ))
          )}
        </div>
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
          className={cn(candidateFormInputClass, "mt-3")}
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {SUGGESTED_TAGS.filter((t) => !profile.application.tags.includes(t)).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="rounded-full border border-dashed border-[rgba(15,23,42,0.12)] px-2 py-1 text-[11px] text-muted hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
