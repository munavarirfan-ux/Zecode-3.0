"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createSkillEntry,
  type InterviewerFeedbackData,
} from "@/lib/hiring/interviewFeedback";
import { SkillEvaluationAccordion } from "./SkillEvaluationAccordion";
import { CodeChallengeView } from "./CodeChallengeView";

export type InterviewFeedbackSection =
  | "skills"
  | "codeChallenge"
  | "additionalNotes";

const SECTION_LABELS: Record<InterviewFeedbackSection, string> = {
  skills: "Skill feedback",
  codeChallenge: "Code challenge feedback",
  additionalNotes: "Additional interview notes",
};

const TAB_TO_SECTION: Record<string, InterviewFeedbackSection> = {
  feedback: "skills",
  code: "codeChallenge",
  notes: "additionalNotes",
};

export function interviewTabToSection(tab: string): InterviewFeedbackSection | undefined {
  return TAB_TO_SECTION[tab];
}

export function InterviewFeedbackForm({
  data,
  onChange,
  readOnly,
  interviewId,
  layout = "stacked",
  activeSection,
  sections = ["skills", "codeChallenge", "additionalNotes"],
  showAddField = true,
  className,
}: {
  data: InterviewerFeedbackData;
  onChange: (next: InterviewerFeedbackData) => void;
  readOnly?: boolean;
  interviewId?: string;
  layout?: "stacked" | "section";
  activeSection?: InterviewFeedbackSection;
  sections?: InterviewFeedbackSection[];
  showAddField?: boolean;
  className?: string;
}) {
  const handleAddField = () => {
    if (readOnly) return;
    onChange({
      ...data,
      skills: [
        ...data.skills,
        createSkillEntry("Custom skill", { custom: true, rating: 0 }),
      ],
    });
  };

  const visible = (section: InterviewFeedbackSection) => {
    if (!sections.includes(section)) return false;
    if (layout === "section" && activeSection) return activeSection === section;
    return true;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {visible("skills") ? (
        <section aria-labelledby="feedback-skills-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3
              id="feedback-skills-heading"
              className="text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text"
            >
              {SECTION_LABELS.skills}
            </h3>
            {showAddField && !readOnly ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 rounded-[9px] px-3 text-[12px]"
                onClick={handleAddField}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Add Field
              </Button>
            ) : null}
          </div>
          <SkillEvaluationAccordion
            skills={data.skills}
            onChange={(skills) => onChange({ ...data, skills })}
            readOnly={readOnly}
          />
        </section>
      ) : null}

      {visible("codeChallenge") ? (
        <section aria-labelledby="feedback-code-heading">
          <h3
            id="feedback-code-heading"
            className="mb-3 text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text"
          >
            {SECTION_LABELS.codeChallenge}
          </h3>
          <CodeChallengeView data={data.codeChallenge} interviewId={interviewId} />
        </section>
      ) : null}

      {visible("additionalNotes") ? (
        <section aria-labelledby="feedback-notes-heading">
          <h3
            id="feedback-notes-heading"
            className="mb-3 text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text"
          >
            {SECTION_LABELS.additionalNotes}
          </h3>
          <label className="block">
            <span className="sr-only">Additional interview notes</span>
            <textarea
              value={data.additionalInterviewNotes}
              onChange={(e) =>
                onChange({ ...data, additionalInterviewNotes: e.target.value })
              }
              readOnly={readOnly}
              rows={5}
              placeholder="Summarize overall impressions, follow-ups, and hiring context…"
              className={cn(
                "w-full resize-y rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#FCFCFD] px-3.5 py-3 text-[13px] leading-relaxed text-[#3F3F46]",
                "placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
                "dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-text",
                readOnly && "opacity-80",
              )}
            />
          </label>
        </section>
      ) : null}
    </div>
  );
}
