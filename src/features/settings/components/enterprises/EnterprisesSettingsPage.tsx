"use client";

import { useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { HeroActionButton } from "@/components/hiring/HeroActionButton";
import { hiringCard } from "@/components/hiring/hiringTokens";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { zeMock } from "@/features/demo/data/ze.mock";
import { isPlatformSuperAdmin } from "../../settingsAccess";
import {
  countActiveFilters,
  countByAccessTab,
  EMPTY_ENTERPRISE_FILTERS,
  filterAndSortEnterprises,
  type EnterpriseAccessTab,
  type EnterpriseFilters,
  type EnterpriseSortKey,
  type EnterpriseViewMode,
} from "../../lib/enterpriseDirectoryFilters";
import { SettingsGate } from "../SettingsGate";
import { SettingsPageHeader } from "../SettingsPageHeader";
import { EnterpriseCard } from "./EnterpriseCard";
import { EnterpriseListView } from "./EnterpriseListRow";
import { EnterprisesDirectoryToolbar } from "./EnterprisesDirectoryToolbar";
import { useEnterpriseEnabledStore } from "../../store/enterpriseEnabledStore";
import { useCreatedEnterprisesStore } from "../../store/createdEnterprisesStore";
import { CreateEnterpriseModal, getTakenEnterpriseSlugs } from "./CreateEnterpriseModal";

const MOCK_ENTERPRISES = zeMock.enterprises.list;

export function EnterprisesSettingsPage() {
  const { selectedRole } = useRole();
  const isEnabled = useEnterpriseEnabledStore((s) => s.isEnabled);
  const setEnabled = useEnterpriseEnabledStore((s) => s.setEnabled);
  const created = useCreatedEnterprisesStore((s) => s.created);
  const [createOpen, setCreateOpen] = useState(false);
  const createButtonRef = useRef<HTMLButtonElement>(null);

  const takenSlugs = useMemo(
    () => getTakenEnterpriseSlugs(created.map((e) => e.slug)),
    [created],
  );

  const enterprises = useMemo(
    () => [
      ...created.map((e) => ({
        name: e.name,
        domain: e.domain,
        plan: e.plan,
        status: e.status,
        location: e.location,
        joined: e.joinedAt,
        users: e.seats,
        jobs: 0,
        candidates: 0,
      })),
      ...MOCK_ENTERPRISES,
    ],
    [created],
  );

  const [accessTab, setAccessTab] = useState<EnterpriseAccessTab>("all");
  const [view, setView] = useState<EnterpriseViewMode>("grid");
  const [sort, setSort] = useState<EnterpriseSortKey>("joined-desc");
  const [filters, setFilters] = useState<EnterpriseFilters>(EMPTY_ENTERPRISE_FILTERS);

  const tabCounts = useMemo(
    () => countByAccessTab(enterprises, filters, isEnabled),
    [enterprises, filters, isEnabled],
  );

  const filtered = useMemo(
    () =>
      filterAndSortEnterprises(enterprises, {
        filters,
        accessTab,
        isEnabled,
        sort,
      }),
    [filters, accessTab, isEnabled, sort],
  );

  const activeFilterCount = countActiveFilters(filters);

  if (!isPlatformSuperAdmin(selectedRole)) {
    return <SettingsGate title="All Enterprises is restricted to Super Admins" />;
  }

  return (
    <div className="space-y-4">
      <SettingsPageHeader
        scope="platform"
        scopeLabel="Platform · Super Admin only"
        title="All Enterprises"
        description="Manage workspaces, plans, and platform-wide enterprise configuration."
        action={
          <HeroActionButton
            ref={createButtonRef}
            type="button"
            variant="primary"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create enterprise
          </HeroActionButton>
        }
      />

      <CreateEnterpriseModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        takenSlugs={takenSlugs}
        returnFocusRef={createButtonRef}
      />

      <div className="space-y-3">
        <EnterprisesDirectoryToolbar
          accessTab={accessTab}
          onAccessTabChange={setAccessTab}
          tabCounts={tabCounts}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
          filters={filters}
          onFiltersChange={setFilters}
          activeFilterCount={activeFilterCount}
        />

        <div
          className={cn(
            hiringCard,
            "overflow-hidden !rounded-[14px] !p-0",
            "border-[rgba(15,23,42,0.05)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
          )}
        >
          {view === "grid" ? (
            filtered.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-muted">
                No enterprises match your filters.
              </div>
            ) : (
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 lg:p-5">
                {filtered.map((e) => (
                  <EnterpriseCard
                    key={e.domain}
                    enterprise={e}
                    enabled={isEnabled(e.domain)}
                    onEnabledChange={(next) => setEnabled(e.domain, next)}
                  />
                ))}
              </div>
            )
          ) : (
            <EnterpriseListView
              enterprises={filtered}
              isEnabled={isEnabled}
              setEnabled={setEnabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}
