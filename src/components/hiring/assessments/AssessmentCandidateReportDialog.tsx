"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getQuestionResultsForCandidate } from "@/lib/hiring/assessments/assessmentCandidates";
import {
  getCameraSnapshots,
  getMalpracticeBreakdown,
  getSectionScores,
} from "@/lib/hiring/assessments/assessmentReportData";
import {
  ASSESSMENT_REPORT_MAIN_TABS,
  type AssessmentCandidateRecord,
  type AssessmentQuestionResult,
  type AssessmentRecord,
  type AssessmentReportMainTab,
  type AssessmentReportTab,
} from "@/lib/hiring/assessments/types";
import { AssessmentReportHero } from "./report/AssessmentReportHero";
import { AssessmentReportOverview } from "./report/AssessmentReportOverview";
import { AssessmentReportQuestions } from "./report/AssessmentReportQuestions";
import { AssessmentReportSnapshots } from "./report/AssessmentReportSnapshots";
import { ViewAnswerDialog } from "./ViewAnswerDialog";

const REPORT_COLUMN = "mx-auto w-full max-w-[1320px]";
const REPORT_PAD_X = "px-5 sm:px-6";

export function AssessmentCandidateReportDialog({
  open,
  onOpenChange,
  assessment,
  candidate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: AssessmentRecord;
  candidate: AssessmentCandidateRecord | null;
}) {
  const [mainTab, setMainTab] = useState<AssessmentReportMainTab>("overview");
  const [questionTab, setQuestionTab] = useState<AssessmentReportTab>("Coding");
  const [answerQuestion, setAnswerQuestion] = useState<AssessmentQuestionResult | null>(null);

  const questions = useMemo(
    () => (candidate ? getQuestionResultsForCandidate(candidate.id, assessment.id) : []),
    [candidate, assessment.id],
  );

  const malpractice = useMemo(
    () => (candidate ? getMalpracticeBreakdown(candidate) : { copying: 0, leavingTab: 0, movementDetection: 0 }),
    [candidate],
  );

  const sectionalScores = useMemo(() => getSectionScores(questions), [questions]);

  const snapshots = useMemo(
    () => (candidate ? getCameraSnapshots(candidate) : []),
    [candidate],
  );

  if (!candidate) return null;

  const initials = candidate.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogOverlay className="z-[200] bg-[rgba(15,23,42,0.48)] backdrop-blur-[6px] data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
          <div
            className={cn(
              "fixed inset-0 z-[200] flex items-center justify-center max-sm:items-stretch",
              "px-4 pt-[max(20px,env(safe-area-inset-top))] pb-[max(20px,env(safe-area-inset-bottom))] sm:px-8 sm:py-8",
            )}
          >
            <DialogPanel
              className={cn(
                "relative flex h-[min(900px,calc(100dvh-4rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] flex-col overflow-hidden bg-white dark:bg-surface",
                "w-[calc(100vw-2rem)] max-w-[1400px]",
                "rounded-[16px] border border-[rgba(15,23,42,0.08)]",
                "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_80px_-24px_rgba(15,23,42,0.28)]",
                "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
                "max-sm:h-[100dvh] max-sm:max-h-none max-sm:w-full max-sm:rounded-none max-sm:border-0",
              )}
            >
              <Tabs
                value={mainTab}
                onValueChange={(v) => setMainTab(v as AssessmentReportMainTab)}
                className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
              >
                <div className={cn("shrink-0", REPORT_COLUMN, REPORT_PAD_X, "pb-5 pt-5 sm:pb-6 sm:pt-6")}>
                  <AssessmentReportHero
                    assessment={assessment}
                    candidate={candidate}
                    initials={initials}
                    onClose={() => onOpenChange(false)}
                  />
                </div>

                <div
                  className={cn(
                    REPORT_COLUMN,
                    REPORT_PAD_X,
                    "sticky top-0 z-10 shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-white/95 py-2 backdrop-blur-md dark:border-white/[0.06] dark:bg-surface/95",
                  )}
                >
                  <TabsList className="h-auto w-full justify-start gap-0 border-0 bg-transparent p-0">
                    {ASSESSMENT_REPORT_MAIN_TABS.map((t) => (
                      <TabsTrigger key={t.id} value={t.id} className="rounded-none px-4 py-2 text-[13px]">
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div
                  className={cn(
                    REPORT_COLUMN,
                    REPORT_PAD_X,
                    "relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#F5F7FA] py-4 sm:py-5 dark:bg-app-bg",
                  )}
                >
                  <TabsContent value="overview" className="mt-0 focus-visible:ring-0">
                    <AssessmentReportOverview
                      candidate={candidate}
                      malpractice={malpractice}
                      sectionalScores={sectionalScores}
                    />
                  </TabsContent>
                  <TabsContent value="snapshots" className="mt-0 focus-visible:ring-0">
                    <AssessmentReportSnapshots snapshots={snapshots} />
                  </TabsContent>
                  <TabsContent value="questions" className="mt-0 focus-visible:ring-0">
                    <AssessmentReportQuestions
                      questions={questions}
                      questionTab={questionTab}
                      onQuestionTabChange={setQuestionTab}
                      onViewAnswer={setAnswerQuestion}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </DialogPanel>
          </div>
        </DialogPortal>
      </Dialog>

      <ViewAnswerDialog
        open={answerQuestion != null}
        onOpenChange={(o) => !o && setAnswerQuestion(null)}
        question={answerQuestion}
      />
    </>
  );
}
