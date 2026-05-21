"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAssessmentById } from "@/lib/hiring/assessments/assessmentStore";
import {
  buildLiveCameraSnapshots,
  buildLiveQuestionResults,
  liveSessionToCandidateRecord,
} from "@/lib/hiring/assessments/liveCandidateReport";
import {
  getRuntimeLiveCandidate,
  subscribeLiveSessions,
} from "@/lib/hiring/assessments/liveSessionRuntime";
import { getMalpracticeBreakdown, getSectionScores } from "@/lib/hiring/assessments/assessmentReportData";
import {
  ASSESSMENT_REPORT_MAIN_TABS,
  type AssessmentQuestionResult,
  type AssessmentReportMainTab,
  type AssessmentReportTab,
} from "@/lib/hiring/assessments/types";
import { cn } from "@/lib/utils";
import { AssessmentReportOverview } from "../assessments/report/AssessmentReportOverview";
import { AssessmentReportQuestions } from "../assessments/report/AssessmentReportQuestions";
import { AssessmentReportSnapshots } from "../assessments/report/AssessmentReportSnapshots";
import { ViewAnswerDialog } from "../assessments/ViewAnswerDialog";
import { LiveAssessmentReportHero } from "./LiveAssessmentReportHero";
import { LiveSessionStatusBar } from "./LiveSessionStatusBar";

const REPORT_COLUMN = "mx-auto w-full max-w-[1320px]";
const REPORT_PAD_X = "px-5 sm:px-6";

export function LiveAssessmentCandidateReportDialog({
  open,
  onOpenChange,
  assessmentId,
  candidateId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
  candidateId: string | null;
}) {
  const [mainTab, setMainTab] = useState<AssessmentReportMainTab>("overview");
  const [questionTab, setQuestionTab] = useState<AssessmentReportTab>("Coding");
  const [answerQuestion, setAnswerQuestion] = useState<AssessmentQuestionResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    return subscribeLiveSessions(() => {
      setTick((n) => n + 1);
      setLastUpdated(new Date());
    });
  }, [open]);

  const assessment = getAssessmentById(assessmentId);
  const session = candidateId ? getRuntimeLiveCandidate(assessmentId, candidateId) : undefined;

  const candidate = useMemo(
    () => (session ? liveSessionToCandidateRecord(session) : null),
    [session],
  );

  const questions = useMemo(
    () => (session ? buildLiveQuestionResults(session) : []),
    [session],
  );

  const malpractice = useMemo(
    () => (candidate ? getMalpracticeBreakdown(candidate) : { copying: 0, leavingTab: 0, movementDetection: 0 }),
    [candidate],
  );

  const sectionalScores = useMemo(() => getSectionScores(questions), [questions]);

  const snapshots = useMemo(() => (session ? buildLiveCameraSnapshots(session) : []), [session]);

  if (!assessment || !session || !candidate) return null;

  const initials = session.name
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
                  <LiveAssessmentReportHero
                    assessment={assessment}
                    session={session}
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
                  <div className="mb-4">
                    <LiveSessionStatusBar session={session} lastUpdated={lastUpdated} />
                  </div>

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
