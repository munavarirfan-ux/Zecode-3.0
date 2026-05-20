"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCandidatesForJob } from "@/lib/hiring/mockData";
import type { HiringJob } from "@/lib/hiring/types";
import {
  APPLICANTS_STATS_COLUMNS,
  applicantsStatsColumnId,
  filterCandidatesByStage,
  hireOffersKanbanColumnId,
  type HiringStageName,
} from "@/lib/hiring/stages";
import { AddCandidateDialog } from "./applicants/AddCandidateDialog";
import { CandidateReportDialog } from "./applicants/CandidateReportDialog";
import { JobApplicantsTab } from "./applicants/JobApplicantsTab";
import { HiringKanban } from "./HiringKanban";
import { InterviewKanbanBoard } from "./InterviewKanbanBoard";
import type { HiringCandidate } from "@/lib/hiring/types";
import { useRole } from "@/context/RoleContext";
import { canMoveShortlistedToInterview } from "@/lib/hiring/moveApplicantPermissions";
import {
  candidateVisibleToRole,
  isHiringAdminRole,
} from "@/lib/hiring/directoryAccess";
import { hiringCanvas } from "./hiringTokens";
import { JobWorkspaceHero } from "./workspace/JobWorkspaceHero";
import { JobWorkspaceOverview } from "./workspace/JobWorkspaceOverview";
import { getJobWorkspaceMetrics } from "./workspace/jobWorkspaceUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FULL_TABS = [
  { id: "overview", label: "Job overview" },
  { id: "applicants", label: "Applicants" },
  { id: "applicants-stats", label: "Applicants stats" },
  { id: "interviews", label: "Interviews" },
  { id: "hired-offers", label: "Hired & offers" },
  { id: "rejected", label: "Rejected" },
] as const;

const INTERVIEW_MODE_TABS = [
  { id: "interviews", label: "Interviews" },
  { id: "hired", label: "Hired" },
  { id: "offers", label: "Offers" },
] as const;

type TabId = (typeof FULL_TABS)[number]["id"] | (typeof INTERVIEW_MODE_TABS)[number]["id"];

const OFFER_COLS = [
  { id: "offer-sent", title: "Offer sent" },
  { id: "hired", title: "Hired" },
];

const REJECTED_COLS = [{ id: "rejected", title: "Rejected" }];

export function JobWorkspace({ job }: { job: HiringJob }) {
  const searchParams = useSearchParams();
  const isInterviewMode = searchParams.get("mode") === "interview";
  const visibleTabs = isInterviewMode ? INTERVIEW_MODE_TABS : FULL_TABS;
  const [tab, setTab] = useState<TabId>(isInterviewMode ? "interviews" : "overview");
  const [highlightCandidateId, setHighlightCandidateId] = useState<string | null>(null);
  const { selectedRole } = useRole();
  const loadCandidates = useCallback(() => {
    const all = getCandidatesForJob(job.id);
    if (!isInterviewMode || isHiringAdminRole(selectedRole)) return all;
    return all.filter((c) => candidateVisibleToRole(c, selectedRole));
  }, [job.id, isInterviewMode, selectedRole]);

  const [candidates, setCandidates] = useState<HiringCandidate[]>([]);
  const [kanbanReportCandidate, setKanbanReportCandidate] = useState<HiringCandidate | null>(null);
  const [kanbanReportOpen, setKanbanReportOpen] = useState(false);
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const addCandidateButtonRef = useRef<HTMLButtonElement | null>(null);
  const showMoveToInterview = canMoveShortlistedToInterview(selectedRole);

  const openKanbanReport = useCallback((candidate: HiringCandidate) => {
    setKanbanReportCandidate(candidate);
    setKanbanReportOpen(true);
  }, []);

  const refreshCandidates = useCallback(() => {
    setCandidates(loadCandidates());
  }, [loadCandidates]);

  useEffect(() => {
    setCandidates(loadCandidates());
  }, [loadCandidates]);

  const metrics = useMemo(() => getJobWorkspaceMetrics(job, candidates), [job, candidates]);

  const byStage = useCallback(
    (stage: HiringStageName) => filterCandidatesByStage(candidates, stage),
    [candidates],
  );

  const screeningCandidates = useMemo(() => byStage("Screening"), [byStage]);
  // Interviews tab should include completed / feedback-pending / cancelled interviews even if
  // the candidate has since moved to offers/rejected.
  const interviewStageCandidates = useMemo(() => byStage("Interviews"), [byStage]);
  const interviewCandidates = useMemo(
    () =>
      candidates.filter(
        (c) => interviewStageCandidates.includes(c) || (c.interviews?.length ?? 0) > 0,
      ),
    [candidates, interviewStageCandidates],
  );
  const hiredOffersCandidates = useMemo(() => byStage("Hired & Offers"), [byStage]);
  const offerCandidates = useMemo(
    () => hiredOffersCandidates.filter((c) => hireOffersKanbanColumnId(c) === "offer-sent"),
    [hiredOffersCandidates],
  );
  const hiredCandidates = useMemo(
    () => hiredOffersCandidates.filter((c) => hireOffersKanbanColumnId(c) === "hired"),
    [hiredOffersCandidates],
  );
  const rejectedCandidates = useMemo(() => byStage("Rejected"), [byStage]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const candidateParam = searchParams.get("candidate");
    if (isInterviewMode) {
      if (tabParam && INTERVIEW_MODE_TABS.some((t) => t.id === tabParam)) setTab(tabParam as TabId);
      else setTab("interviews");
    } else if (tabParam === "screening") {
      setTab("applicants-stats");
    } else if (tabParam === "offers") {
      setTab("hired-offers");
    } else if (tabParam && FULL_TABS.some((t) => t.id === tabParam)) {
      setTab(tabParam as TabId);
    }
    if (candidateParam) {
      setHighlightCandidateId(candidateParam);
    }
  }, [searchParams, isInterviewMode]);

  return (
    <div className={hiringCanvas}>
      <div className="mx-auto max-w-shell space-y-5 pb-8 sm:space-y-6">
        <JobWorkspaceHero
          job={job}
          metrics={metrics}
          candidates={candidates}
          onAddCandidate={() => setAddCandidateOpen(true)}
          addCandidateButtonRef={addCandidateButtonRef}
        />

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} className="min-w-0">
          <div className="sticky top-0 z-10 -mx-0.5 bg-[#F8FAFC]/90 px-0.5 pb-0 pt-1 backdrop-blur-md dark:bg-app-bg/90">
            <TabsList>
              {visibleTabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {!isInterviewMode ? (
            <TabsContent value="overview" className="mt-6 focus-visible:ring-0 data-[state=inactive]:hidden">
              <JobWorkspaceOverview job={job} candidates={candidates} />
            </TabsContent>
          ) : null}

          {!isInterviewMode ? (
          <TabsContent value="applicants" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <JobApplicantsTab
              job={job}
              candidates={candidates}
              variant="directory"
              onCandidatesChange={refreshCandidates}
              openCandidateId={highlightCandidateId}
              onOpenCandidateHandled={() => setHighlightCandidateId(null)}
            />
          </TabsContent>
          ) : null}

          {!isInterviewMode ? (
          <TabsContent value="applicants-stats" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <div className="mb-4">
              <p className="text-[13px] text-[#71717A]">
                <span className="text-[1.25rem] font-semibold tabular-nums tracking-[-0.03em] text-[#18181B] dark:text-text">
                  {screeningCandidates.length}
                </span>
                <span className="ml-1.5 font-medium text-[#52525B]">in screening</span>
              </p>
              <p className="mt-1 text-[12px] text-[#A1A1AA]">
                Track candidates under review and those shortlisted for the next step.
              </p>
            </div>
            <HiringKanban
              columns={[...APPLICANTS_STATS_COLUMNS]}
              candidates={screeningCandidates}
              pipelineStage="Screening"
              columnResolver={applicantsStatsColumnId}
              jobId={job.id}
              showMoveToInterview={showMoveToInterview}
              onCardClick={openKanbanReport}
              onCandidateMoved={refreshCandidates}
            />
          </TabsContent>
          ) : null}

          <TabsContent value="interviews" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <InterviewKanbanBoard
              job={job}
              jobId={job.id}
              candidates={interviewCandidates}
              onCardClick={openKanbanReport}
              onCandidateMoved={refreshCandidates}
              onScheduleCandidate={(c) => {
                setKanbanReportCandidate(c);
                setKanbanReportOpen(true);
              }}
            />
          </TabsContent>

          {isInterviewMode ? (
            <TabsContent value="offers" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
              <HiringKanban
                columns={[{ id: "offer-sent", title: "Offer sent" }]}
                candidates={offerCandidates}
                pipelineStage="Hired & Offers"
                columnResolver={hireOffersKanbanColumnId}
                onCardClick={openKanbanReport}
                onCandidateMoved={refreshCandidates}
              />
            </TabsContent>
          ) : (
            <TabsContent value="hired-offers" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
              <HiringKanban
                columns={OFFER_COLS}
                candidates={hiredOffersCandidates}
                pipelineStage="Hired & Offers"
                columnResolver={hireOffersKanbanColumnId}
                onCardClick={openKanbanReport}
                onCandidateMoved={refreshCandidates}
              />
            </TabsContent>
          )}

          {isInterviewMode ? (
            <TabsContent value="hired" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
              <HiringKanban
                columns={[{ id: "hired", title: "Hired" }]}
                candidates={hiredCandidates}
                pipelineStage="Hired & Offers"
                columnResolver={hireOffersKanbanColumnId}
                onCardClick={openKanbanReport}
                onCandidateMoved={refreshCandidates}
              />
            </TabsContent>
          ) : null}

          {!isInterviewMode ? (
            <TabsContent value="rejected" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
              <HiringKanban
                columns={REJECTED_COLS}
                candidates={rejectedCandidates}
                pipelineStage="Rejected"
                onCardClick={openKanbanReport}
                onCandidateMoved={refreshCandidates}
                enableDragDrop={false}
              />
            </TabsContent>
          ) : null}
        </Tabs>
      </div>

      <CandidateReportDialog
        candidate={kanbanReportCandidate}
        job={job}
        reportContext="job"
        open={kanbanReportOpen}
        onOpenChange={(open) => {
          setKanbanReportOpen(open);
          if (!open) setKanbanReportCandidate(null);
        }}
        onCandidateUpdated={(updated) => {
          setKanbanReportCandidate(updated);
          refreshCandidates();
        }}
      />

      <AddCandidateDialog
        open={addCandidateOpen}
        onOpenChange={setAddCandidateOpen}
        job={job}
        returnFocusRef={addCandidateButtonRef}
        onAdded={() => refreshCandidates()}
      />
    </div>
  );
}
