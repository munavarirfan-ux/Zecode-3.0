"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  createNoteEntry,
  type InterviewerFeedbackData,
} from "@/lib/hiring/interviewFeedback";
import {
  InterviewFeedbackForm,
  interviewTabToSection,
} from "./InterviewFeedbackForm";
import { NotesTimeline } from "./NotesTimeline";

const NESTED_TABS = [
  { id: "feedback", label: "Feedback" },
  { id: "code", label: "Code Challenge" },
  { id: "notes", label: "Notes" },
] as const;

type NestedTabId = (typeof NESTED_TABS)[number]["id"];

function EvaluationTabs({
  value,
  onChange,
}: {
  value: NestedTabId;
  onChange: (id: NestedTabId) => void;
}) {
  return (
    <div
      className="inline-flex max-w-full gap-0.5 rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[#F4F4F5]/80 p-0.5 dark:border-white/[0.06] dark:bg-white/[0.03]"
      role="tablist"
      aria-label="Evaluation sections"
    >
      {NESTED_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          className={cn(
            "relative rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
            value === tab.id
              ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(15,23,42,0.06)] dark:bg-surface dark:text-text"
              : "text-[#71717A] hover:text-[#52525B]",
          )}
          onClick={() => onChange(tab.id)}
        >
          {value === tab.id ? (
            <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-accent" aria-hidden />
          ) : null}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function InterviewerFeedbackWorkspace({
  data,
  onChange,
  activeTab,
  onActiveTabChange,
  readOnly,
  interviewId,
}: {
  data: InterviewerFeedbackData;
  onChange: (next: InterviewerFeedbackData) => void;
  activeTab?: NestedTabId;
  onActiveTabChange?: (tab: NestedTabId) => void;
  readOnly?: boolean;
  interviewId?: string;
}) {
  const [internalTab, setInternalTab] = useState<NestedTabId>("feedback");
  const nestedTab = activeTab ?? internalTab;
  const setNestedTab = onActiveTabChange ?? setInternalTab;

  const section = interviewTabToSection(nestedTab);

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-4">
        <EvaluationTabs value={nestedTab} onChange={setNestedTab} />
      </div>

      {nestedTab === "notes" ? (
        <NotesTimeline
          notes={data.notes}
          sessionStatus={data.interviewSessionStatus}
          readOnly={readOnly}
          onSessionStatusChange={(interviewSessionStatus) =>
            onChange({ ...data, interviewSessionStatus })
          }
          onAdd={(body, phase) =>
            onChange({
              ...data,
              notes: [
                ...data.notes,
                createNoteEntry({
                  author: data.interviewerName,
                  role: "Interviewer",
                  body,
                  phase,
                }),
              ],
            })
          }
        />
      ) : section ? (
        <InterviewFeedbackForm
          data={data}
          onChange={onChange}
          readOnly={readOnly}
          interviewId={interviewId}
          layout="section"
          activeSection={section}
          sections={[section]}
          showAddField={nestedTab === "feedback"}
        />
      ) : null}
    </div>
  );
}
