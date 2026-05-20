"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ASSESSMENT_REPORT_TABS,
  type AssessmentQuestionResult,
  type AssessmentReportTab,
} from "@/lib/hiring/assessments/types";
import { dashboardPanelInteractive } from "@/components/dashboard/dashboardTokens";

const statusStyles: Record<AssessmentQuestionResult["status"], string> = {
  Passed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Partial: "bg-amber-500/10 text-amber-800 dark:text-amber-200",
  Failed: "bg-red-500/10 text-red-700 dark:text-red-300",
  Skipped: "bg-black/[0.04] text-muted",
};

export function AssessmentReportQuestions({
  questions,
  questionTab,
  onQuestionTabChange,
  onViewAnswer,
}: {
  questions: AssessmentQuestionResult[];
  questionTab: AssessmentReportTab;
  onQuestionTabChange: (tab: AssessmentReportTab) => void;
  onViewAnswer: (q: AssessmentQuestionResult) => void;
}) {
  return (
    <section className={cn(dashboardPanelInteractive, "overflow-hidden p-0")}>
      <Tabs value={questionTab} onValueChange={(v) => onQuestionTabChange(v as AssessmentReportTab)}>
        <div className="border-b border-[rgba(15,23,42,0.06)] px-4 pt-3 dark:border-white/[0.06]">
          <TabsList className="h-auto w-full justify-start gap-0 border-0 bg-transparent p-0">
            {ASSESSMENT_REPORT_TABS.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="rounded-none px-3 py-2 text-[13px]">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {ASSESSMENT_REPORT_TABS.map((t) => (
          <TabsContent key={t.id} value={t.id} className="m-0">
            {questions.filter((q) => q.tab === t.id).length === 0 ? (
              <p className="px-4 py-12 text-center text-[13px] text-muted">No questions in this section.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] text-[10px] font-semibold uppercase tracking-wide text-muted dark:border-white/[0.06] dark:bg-white/[0.03]">
                      <th className="px-4 py-2.5 font-semibold">Question</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">Language</th>
                      <th className="px-3 py-2.5">Test cases</th>
                      <th className="px-3 py-2.5 text-right">Score</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions
                      .filter((q) => q.tab === t.id)
                      .map((q) => (
                        <tr
                          key={q.id}
                          className="border-b border-[rgba(15,23,42,0.04)] transition-colors last:border-0 hover:bg-[rgba(var(--accent-rgb),0.03)] dark:border-white/[0.04]"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-[#18181B] dark:text-text">{q.title}</p>
                            <p className="mt-0.5 text-[11px] text-muted">{q.difficulty}</p>
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                statusStyles[q.status],
                              )}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-[#52525B] dark:text-text-secondary">
                            {q.language ?? "—"}
                          </td>
                          <td className="px-3 py-3 tabular-nums text-[#52525B] dark:text-text-secondary">
                            {q.testCasesPassed ?? "—"}
                          </td>
                          <td className="px-3 py-3 text-right font-semibold tabular-nums text-[#18181B] dark:text-text">
                            {q.score}/{q.maxScore}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1.5 rounded-[10px] border-[rgba(15,23,42,0.08)] text-[12px] font-medium"
                                  onClick={() => onViewAnswer(q)}
                                >
                                  <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                                  View answer
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">View candidate answer</TooltipContent>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
