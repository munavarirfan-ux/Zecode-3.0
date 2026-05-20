"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PremiumEmptyState } from "@/components/onboarding/PremiumEmptyState";
import { NewUserModuleEmptyState } from "@/components/onboarding/NewUserModuleEmptyState";
import { EMPTY_STATE_PRESETS } from "@/lib/onboarding/emptyStatePresets";
import { useRole } from "@/context/RoleContext";
import { getAssessmentsForRole } from "@/lib/onboarding/workspaceData";
import { isFreshNewUserWorkspace } from "@/lib/onboarding/workspaceMode";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";
import { cn } from "@/lib/utils";
import type { AssessmentRecord, AssessmentTab } from "@/lib/hiring/assessments/types";
import {
  applyAssessmentFilters,
  countByTab,
  EMPTY_ASSESSMENTS_FILTERS,
  filterByTab,
  GRID_PAGE_SIZE,
  LIST_PAGE_SIZE,
  sortAssessmentsList,
  uniqueCreators,
  uniqueDates,
  uniqueRoles,
  type AssessmentsFilterState,
  type AssessmentsSortKey,
  type AssessmentsViewMode,
} from "@/lib/hiring/assessments/assessmentFilters";
import {
  ASSESSMENTS_UPDATED_EVENT,
  deleteAssessment,
  duplicateAssessment,
  setAssessmentEnabled,
} from "@/lib/hiring/assessments/assessmentStore";
import { DirectoryPagination } from "../directories/DirectoryPagination";
import { hiringCanvas, hiringCard } from "../hiringTokens";
import { AssessmentsHero } from "./AssessmentsHero";
import { AssessmentsToolbar } from "./AssessmentsToolbar";
import { AssessmentCard } from "./AssessmentCard";
import { AssessmentListRow } from "./AssessmentListRow";
import { CreateAssessmentDialog } from "./CreateAssessmentDialog";
import { ShareAssessmentDialog } from "./ShareAssessmentDialog";
import { DisableAssessmentDialog } from "./DisableAssessmentDialog";

export function AssessmentsDashboard() {
  const { selectedRole } = useRole();
  const workspaceRefresh = useWorkspaceRefresh();
  const createRef = useRef<HTMLButtonElement>(null);
  const [refresh, setRefresh] = useState(0);
  const [tab, setTab] = useState<AssessmentTab>("active");
  const [view, setView] = useState<AssessmentsViewMode>("grid");
  const [filters, setFilters] = useState<AssessmentsFilterState>(EMPTY_ASSESSMENTS_FILTERS);
  const [sort, setSort] = useState<AssessmentsSortKey>("updated");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<AssessmentRecord | null>(null);
  const [disableTarget, setDisableTarget] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    const h = () => setRefresh((n) => n + 1);
    window.addEventListener(ASSESSMENTS_UPDATED_EVENT, h);
    return () => window.removeEventListener(ASSESSMENTS_UPDATED_EVENT, h);
  }, []);

  const freshNewUser = useMemo(
    () => isFreshNewUserWorkspace(selectedRole),
    [selectedRole, workspaceRefresh],
  );

  const all = useMemo(
    () => getAssessmentsForRole(selectedRole),
    [selectedRole, refresh, workspaceRefresh],
  );

  const showNewUserEmpty = freshNewUser && all.length === 0;
  const tabCounts = useMemo(() => countByTab(all), [all]);

  const filtered = useMemo(() => {
    const byTab = filterByTab(all, tab);
    const byFilters = applyAssessmentFilters(byTab, filters);
    return sortAssessmentsList(byFilters, sort);
  }, [all, tab, filters, sort]);

  const pageSize = view === "grid" ? GRID_PAGE_SIZE : LIST_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => setPage(1), [tab, filters, sort, view]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const heroStats = useMemo(() => {
    const active = filterByTab(all, "active");
    return {
      active: active.length,
      invited: active.reduce((s, a) => s + a.invited, 0),
      qualified: active.reduce((s, a) => s + a.qualified, 0),
    };
  }, [all]);

  const roles = useMemo(() => uniqueRoles(all), [all]);
  const creators = useMemo(() => uniqueCreators(all), [all]);
  const dates = useMemo(() => uniqueDates(all), [all]);

  function handleToggle(a: AssessmentRecord, enabled: boolean) {
    if (!enabled) {
      setDisableTarget(a);
      return;
    }
    setAssessmentEnabled(a.id, true);
    setRefresh((n) => n + 1);
  }

  const cardHandlers = (a: AssessmentRecord) => ({
    onToggleEnabled: (en: boolean) => handleToggle(a, en),
    onShare: () => setShareTarget(a),
    onDuplicate: () => {
      duplicateAssessment(a.id);
      toast.success("Assessment duplicated");
      setRefresh((n) => n + 1);
    },
    onDelete: () => {
      deleteAssessment(a.id);
      toast.success("Assessment deleted");
      setRefresh((n) => n + 1);
    },
  });

  return (
    <div className={hiringCanvas}>
      <div className="relative mx-auto max-w-shell space-y-5 pb-12">
        {showNewUserEmpty ? (
          <NewUserModuleEmptyState
            module="assessments"
            onPrimaryAction={() => setCreateOpen(true)}
            onDemoEnabled={() => setRefresh((n) => n + 1)}
          />
        ) : (
        <>
        <AssessmentsHero
          stats={heroStats}
          onCreate={() => setCreateOpen(true)}
          onShare={() => {
            const first = all[0];
            if (first) setShareTarget(first);
            else toast.message("No assessments yet", { description: "Create an assessment to share a link." });
          }}
          createButtonRef={createRef}
        />

        <AssessmentsToolbar
          tab={tab}
          onTabChange={setTab}
          tabCounts={tabCounts}
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          roles={roles}
          creators={creators}
          dates={dates}
          view={view}
          onViewChange={setView}
        />

        {paginated.length === 0 ? (
          <PremiumEmptyState
            {...EMPTY_STATE_PRESETS.assessments}
            ctaLabel="Create Assessment"
            onCtaClick={() => setCreateOpen(true)}
          />
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 [&>article]:overflow-visible">
            {paginated.map((a) => (
              <AssessmentCard key={a.id} assessment={a} {...cardHandlers(a)} />
            ))}
          </div>
        ) : (
          <div className={cn(hiringCard, "overflow-hidden rounded-[14px]")}>
            <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(8,minmax(0,0.7fr))_auto] gap-2 border-b bg-[#FAFAFB] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted dark:bg-white/[0.03]">
              <span>Name</span>
              <span>Role</span>
              <span>Created by</span>
              <span>Date</span>
              <span className="text-right">Invited</span>
              <span className="text-right">Not started</span>
              <span className="text-right">Evaluated</span>
              <span className="text-right">Qualified</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            {paginated.map((a) => (
              <AssessmentListRow key={a.id} assessment={a} {...cardHandlers(a)} />
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <DirectoryPagination
            page={page}
            totalPages={totalPages}
            totalCount={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="assessments"
          />
        ) : null}
        </>
        )}
      </div>

      <CreateAssessmentDialog open={createOpen} onOpenChange={setCreateOpen} returnFocusRef={createRef} />
      <ShareAssessmentDialog
        open={shareTarget !== null}
        onOpenChange={(o) => !o && setShareTarget(null)}
        assessment={shareTarget}
      />
      <DisableAssessmentDialog
        open={disableTarget !== null}
        onOpenChange={(o) => !o && setDisableTarget(null)}
        assessmentName={disableTarget?.name ?? ""}
        onConfirm={() => {
          if (disableTarget) {
            setAssessmentEnabled(disableTarget.id, false);
            toast.success("Assessment disabled");
            setRefresh((n) => n + 1);
          }
          setDisableTarget(null);
        }}
      />
    </div>
  );
}
