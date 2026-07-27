"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CandidateAssessmentView } from "@/features/candidate-assessment/CandidateAssessmentView";
import {
  FileText,
  BookOpen,
  LayoutDashboard,
  CheckSquare,
  Code2,
  MessageSquare,
  Library,
  Database,
  TextCursorInput,
  Bug,
  CheckCircle2,
  ArrowLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SCENARIOS = [
  { id: "invitation", label: "Invitation", icon: FileText, description: "Assessment landing page" },
  { id: "guidelines", label: "Guidelines", icon: BookOpen, description: "Test instructions & consent" },
  { id: "workspace", label: "Assessment Workspace", icon: LayoutDashboard, description: "Section overview" },
  { id: "mcq", label: "MCQ", icon: CheckSquare, description: "Multiple choice questions" },
  { id: "coding", label: "Coding", icon: Code2, description: "Code editor workspace" },
  { id: "open-ended", label: "Open-ended", icon: MessageSquare, description: "Free-form answer" },
  { id: "comprehension", label: "Comprehension", icon: Library, description: "Passage + questions" },
  { id: "database", label: "Database", icon: Database, description: "SQL query workspace" },
  { id: "fill-blank", label: "Fill in the Blank", icon: TextCursorInput, description: "Input-based answers" },
  { id: "debug", label: "Debug Snippet", icon: Bug, description: "Fix buggy code" },
  { id: "submission", label: "Submission confirmation", icon: CheckCircle2, description: "Success screen" },
] as const;

export default function CandidateAssessmentViewPage() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  if (activeScenario) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0E0E11]">
        <div className="flex shrink-0 items-center gap-3 border-b border-[rgba(15,23,42,0.06)] px-4 py-2 dark:border-white/[0.06]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveScenario(null)}
            className="gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
          <span className="text-xs text-muted">
            {SCENARIOS.find((s) => s.id === activeScenario)?.label}
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <CandidateAssessmentView initialScreen={activeScenario} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAFAFB] dark:bg-[#0E0E11]">
      <div className="flex shrink-0 items-center justify-between border-b border-[rgba(15,23,42,0.06)] px-5 py-3 dark:border-white/[0.06]">
        <div>
          <h1 className="text-[1.1rem] font-semibold tracking-[-0.025em] text-text">
            Candidate Assessment View
          </h1>
          <p className="mt-0.5 text-[12px] text-text-secondary/80">
            Preview the candidate-side assessment experience with mock data.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-text-secondary transition-colors hover:bg-[rgba(15,23,42,0.04)] hover:text-text dark:hover:bg-white/[0.04]"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setActiveScenario(scenario.id)}
                className={cn(
                  "flex items-start gap-3 rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-white p-4 text-left transition-all hover:border-[rgba(15,23,42,0.12)] hover:shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12]",
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent/8">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text">{scenario.label}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">{scenario.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
