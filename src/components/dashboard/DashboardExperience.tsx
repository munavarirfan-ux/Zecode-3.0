"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import {
  dashboardKpisByRole,
  dashboardContextLineForRole,
  defaultInsightTabForRole,
  getInsightTabsForRole,
  type DashboardInsightTabId,
} from "@/config/dashboardByRole";
import {
  assessmentsPanelMode,
  interviewsPanelMode,
  feedbackDuePanelMode,
} from "@/config/dashboardWidgetsByRole";
import { GreetingHero } from "@/components/dashboard/GreetingHero";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import {
  AssessmentsInsightPanel,
  InterviewsInsightPanel,
  FeedbackDueInsightPanel,
} from "@/components/dashboard/DashboardPanels";
import { dashboardGreeting } from "@/features/dashboard/data/dashboard.mock";
import { dashboardCanvas, dashboardLabel, dashboardWorkspaceShell } from "./dashboardTokens";
import { NewUserDashboard } from "@/components/onboarding/NewUserDashboard";
import { readOnboardingState } from "@/lib/onboarding/onboardingStore";

export function DashboardExperience() {
  const { selectedRole } = useRole();
  const { data: session } = useSession();
  const [ready, setReady] = useState(false);

  const displayFirstName =
    session?.user?.name?.trim().split(/\s+/)[0] ??
    session?.user?.name?.trim() ??
    dashboardGreeting.fallbackName;

  const tabs = useMemo(() => getInsightTabsForRole(selectedRole), [selectedRole]);
  const [tab, setTab] = useState<DashboardInsightTabId>("interviews");

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const allowed = new Set(tabs.map((t) => t.id));
    const def = defaultInsightTabForRole(selectedRole);
    setTab((prev) => (allowed.has(prev) ? prev : def));
  }, [selectedRole, tabs]);

  const isEvaluator = selectedRole === "evaluator";
  const showKpiStrip = !isEvaluator;
  const kpis = showKpiStrip ? dashboardKpisByRole[selectedRole] : [];
  const iMode = interviewsPanelMode(selectedRole);
  const aMode = assessmentsPanelMode(selectedRole);
  const fdMode = feedbackDuePanelMode(selectedRole);
  const showOrgActivity = selectedRole === "superAdmin" || selectedRole === "admin";
  const activeTabMeta = tabs.find((t) => t.id === tab);
  const contextLine = dashboardContextLineForRole(selectedRole);

  if (selectedRole === "newUser" && readOnboardingState().completed) {
    return (
      <div className={cn(dashboardCanvas, "relative flex h-full min-h-0 flex-col overflow-hidden")}>
        <NewUserDashboard />
      </div>
    );
  }

  return (
    <div className={cn(dashboardCanvas, "relative")}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_70%_45%_at_50%_-4%,rgba(15,61,46,0.04),transparent)]"
        aria-hidden
      />

      {!ready ? (
        <div className="relative space-y-3 animate-pulse">
          <div className="h-[min(280px,42vh)] rounded-[28px] bg-[rgba(15,23,42,0.05)] sm:h-72" />
          {!isEvaluator ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[118px] rounded-xl bg-[rgba(15,23,42,0.05)]" />
              ))}
            </div>
          ) : null}
          <div className="h-[min(400px,52vh)] rounded-[18px] bg-[rgba(15,23,42,0.05)]" />
        </div>
      ) : null}

      <div className={cn(!ready && "hidden", "relative mx-auto max-w-shell space-y-4 pb-1")}>
        <GreetingHero role={selectedRole} name={displayFirstName} organizationName={session?.user?.organizationName} />

        {showKpiStrip ? (
          <section aria-labelledby="operational-kpis" className="space-y-2.5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 id="operational-kpis" className="text-[13px] font-medium tracking-[-0.02em] text-[#18181B] dark:text-text">
                  Operational signals
                </h2>
                <p className="mt-0.5 text-[12px] text-[#52525B]/90 dark:text-muted/80">
                  Live hiring metrics across your workspace
                </p>
              </div>
              <p className={cn(dashboardLabel, "normal-case tracking-normal text-[11px]")}>Updated moments ago</p>
            </div>
            <KpiStrip items={kpis} />
          </section>
        ) : null}

        <section className={cn(dashboardWorkspaceShell, "min-w-0 px-4 py-4 sm:px-5 sm:py-5")} aria-label="Intelligence workspace">
          <header className="mb-3.5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 space-y-0.5">
              <h2 className="text-[1.1875rem] font-semibold tracking-[-0.035em] text-[#18181B] dark:text-text sm:text-[1.25rem]">
                {isEvaluator ? "Your evaluator workspace" : "Intelligence workspace"}
              </h2>
              <p className="text-[11px] font-medium text-[#71717A] dark:text-muted/80">
                {isEvaluator ? (
                  "Personal · focused · action-oriented"
                ) : (
                  <>
                    Pipeline health <span className="mx-1.5 text-muted/40">•</span> hiring operations
                  </>
                )}
              </p>
              <p className="max-w-xl text-[13px] leading-relaxed text-[#52525B]/90 dark:text-muted/80">
                {activeTabMeta?.description ?? contextLine}
              </p>
            </div>
            {showOrgActivity ? (
              <p className="shrink-0 text-[10px] font-medium uppercase tracking-[0.08em] text-[#71717A]">Org-wide</p>
            ) : null}
          </header>

          <Tabs value={tab} onValueChange={(v) => setTab(v as DashboardInsightTabId)} className="min-w-0">
            <TabsList className="mb-3.5" size="default">
              {tabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id} size="default">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="interviews" className="mt-0 min-w-0 focus-visible:ring-0">
              <InterviewsInsightPanel mode={iMode} canMonitorLiveInterviews={showOrgActivity} />
            </TabsContent>
            <TabsContent value="assessments" className="mt-0 min-w-0 focus-visible:ring-0">
              <AssessmentsInsightPanel mode={aMode} />
            </TabsContent>
            <TabsContent value="feedback-due" className="mt-0 min-w-0 focus-visible:ring-0">
              <FeedbackDueInsightPanel mode={fdMode} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
