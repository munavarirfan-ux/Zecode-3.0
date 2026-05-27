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
  HIRE_OFFERS_KANBAN_COLUMNS,
  HIRE_OFFERS_PIPELINE_COLUMNS,
  type HiringStageName,
} from "@/lib/hiring/stages";
import { AddCandidateDialog } from "./applicants/AddCandidateDialog";
import { CandidateReportDialog } from "./applicants/CandidateReportDialog";
import { JobApplicantsTab } from "./applicants/JobApplicantsTab";
import { HiringKanban } from "./HiringKanban";
import { InterviewKanbanBoard } from "./InterviewKanbanBoard";
import type { HiringCandidate } from "@/lib/hiring/types";
import { useRole } from "@/context/RoleContext";
import { getCurrentRecruiterFromRole } from "@/lib/hiring/candidateOwnership";
import { getDefaultKanbanViewMode } from "@/lib/hiring/ownership";
import {
  EMPTY_KANBAN_OWNERSHIP_FILTERS,
  filterApplicantsStatsKanban,
  loadKanbanViewMode,
  type KanbanOwnershipFilters,
} from "@/lib/hiring/kanbanOwnership";
import type { KanbanViewMode } from "@/lib/hiring/types";
import { KanbanOwnershipToolbar } from "./kanban/KanbanOwnershipToolbar";
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
  { id: "applicants-stats", label: "Applicants stats" },
  { id: "interviews", label: "Interviews" },
  { id: "hired-offers", label: "Hired & offers" },
  { id: "applicants", label: "Directory" },
] as const;

const INTERVIEW_MODE_TABS = [
  { id: "interviews", label: "Interviews" },
  { id: "hired", label: "Hired" },
  { id: "offers", label: "Offers" },
] as const;

type TabId = (typeof FULL_TABS)[number]["id"] | (typeof INTERVIEW_MODE_TABS)[number]["id"];

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
  const [kanbanReportInitialTab, setKanbanReportInitialTab] = useState("overview");
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const addCandidateButtonRef = useRef<HTMLButtonElement | null>(null);
  const showMoveToInterview = canMoveShortlistedToInterview(selectedRole);
  const currentRecruiter = getCurrentRecruiterFromRole(selectedRole);
  const [kanbanViewMode, setKanbanViewMode] = useState<KanbanViewMode>(() =>
    loadKanbanViewMode(getDefaultKanbanViewMode(selectedRole)),
  );
  const [kanbanFilters, setKanbanFilters] = useState<KanbanOwnershipFilters>(
    EMPTY_KANBAN_OWNERSHIP_FILTERS,
  );

  const openKanbanReport = useCallback((candidate: HiringCandidate, tab = "overview") => {
    setKanbanReportCandidate(candidate);
    setKanbanReportInitialTab(tab);
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

  const filteredScreeningCandidates = useMemo(
    () =>
      filterApplicantsStatsKanban(
        screeningCandidates,
        kanbanViewMode,
        currentRecruiter.id,
        kanbanFilters,
      ),
    [screeningCandidates, kanbanViewMode, currentRecruiter.id, kanbanFilters],
  );

  const kanbanOwnership = useMemo(
    () => ({
      currentUserId: currentRecruiter.id,
      currentUserName: currentRecruiter.name,
      previewRole: selectedRole,
      board: "applicants-stats" as const,
    }),
    [currentRecruiter.id, currentRecruiter.name, selectedRole],
  );

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
    () => hiredOffersCandidates.filter((c) => hireOffersKanbanColumnId(c) !== "hired"),
    [hiredOffersCandidates],
  );
  const hiredCandidates = useMemo(
    () => hiredOffersCandidates.filter((c) => hireOffersKanbanColumnId(c) === "hired"),
    [hiredOffersCandidates],
  );
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
    } else if (tabParam === "rejected") {
      setTab("interviews");
    } else if (tabParam && FULL_TABS.some((t) => t.id === tabParam)) {
      setTab(tabParam as TabId);
    }
    if (candidateParam) {
      setHighlightCandidateId(candidateParam);
    }
  }, [searchParams, isInterviewMode]);

  return (
    <div className={hiringCanvas}>
      <div className="w-full min-w-0 space-y-5 pb-8 sm:space-y-6">
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
          <TabsContent value="applicants-stats" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <KanbanOwnershipToolbar
              filters={kanbanFilters}
              onFiltersChange={setKanbanFilters}
              viewMode={kanbanViewMode}
              onViewModeChange={setKanbanViewMode}
            />
            <div className="kanban-board-area--tall">
              <HiringKanban
                columns={[...APPLICANTS_STATS_COLUMNS]}
                candidates={filteredScreeningCandidates}
                pipelineStage="Screening"
                columnResolver={applicantsStatsColumnId}
                jobId={job.id}
                job={job}
                allowMoveToInterview={showMoveToInterview}
                ownership={kanbanOwnership}
                onCardClick={openKanbanReport}
                onOpenEmails={(c) => openKanbanReport(c, "emails")}
                onCandidateMoved={refreshCandidates}
              />
            </div>
          </TabsContent>
          ) : null}

          <TabsContent value="interviews" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <InterviewKanbanBoard
              job={job}
              jobId={job.id}
              candidates={interviewCandidates}
              onCardClick={openKanbanReport}
              onOpenEmails={(c) => openKanbanReport(c, "emails")}
              onCandidateMoved={refreshCandidates}
              onScheduleCandidate={(c) => {
                setKanbanReportCandidate(c);
                setKanbanReportOpen(true);
              }}
            />
          </TabsContent>

          {isInterviewMode ? (
            <TabsContent value="offers" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
              <div className="kanban-board-area--tall">
                <HiringKanban
                  columns={[...HIRE_OFFERS_PIPELINE_COLUMNS]}
                  candidates={offerCandidates}
                  pipelineStage="Hired & Offers"
                  columnResolver={hireOffersKanbanColumnId}
                  job={job}
                  onCardClick={openKanbanReport}
                  onOpenEmails={(c) => openKanbanReport(c, "emails")}
                  onCandidateMoved={refreshCandidates}
                />
              </div>
            </TabsContent>
          ) : (
            <TabsContent value="hired-offers" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
              <div className="kanban-board-area--tall">
                <HiringKanban
                  columns={[...HIRE_OFFERS_KANBAN_COLUMNS]}
                  candidates={hiredOffersCandidates}
                  pipelineStage="Hired & Offers"
                  columnResolver={hireOffersKanbanColumnId}
                  job={job}
                  onCardClick={openKanbanReport}
                  onOpenEmails={(c) => openKanbanReport(c, "emails")}
                  onCandidateMoved={refreshCandidates}
                />
              </div>
            </TabsContent>
          )}

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

          {isInterviewMode ? (
            <TabsContent value="hired" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
              <div className="kanban-board-area--tall">
                <HiringKanban
                  columns={[{ id: "hired", title: "Hired" }]}
                  candidates={hiredCandidates}
                  pipelineStage="Hired & Offers"
                  columnResolver={hireOffersKanbanColumnId}
                  job={job}
                  onCardClick={openKanbanReport}
                  onOpenEmails={(c) => openKanbanReport(c, "emails")}
                  onCandidateMoved={refreshCandidates}
                />
              </div>
            </TabsContent>
          ) : null}
        </Tabs>
      </div>

      <CandidateReportDialog
        candidate={kanbanReportCandidate}
        job={job}
        reportContext="job"
        open={kanbanReportOpen}
        initialTab={kanbanReportInitialTab}
        onOpenChange={(open) => {
          setKanbanReportOpen(open);
          if (!open) {
            setKanbanReportCandidate(null);
            setKanbanReportInitialTab("overview");
          }
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
