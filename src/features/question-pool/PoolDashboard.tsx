"use client";

import { hiringCanvas } from "@/components/hiring/hiringTokens";
import { BulkActionBar } from "./components/BulkActionBar";
import { CreateTypeModal } from "./components/CreateTypeModal";
import { FilterBar } from "./components/FilterBar";
import { QuestionDrawer } from "./components/QuestionDrawer";
import { QuestionPoolHero } from "./components/QuestionPoolHero";
import { QuestionTable } from "./components/QuestionTable";
import { TypeTabs } from "./components/TypeTabs";
import { usePoolStore } from "./store/poolStore";

export function PoolDashboard() {
  const setCreateModalOpen = usePoolStore((s) => s.setCreateModalOpen);
  return (
    <div className={hiringCanvas}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(124,58,237,0.06),transparent)]"
        aria-hidden
      />
      <div className="relative w-full min-w-0 space-y-4 pb-16">
        <QuestionPoolHero onCreate={() => setCreateModalOpen(true)} />
        <TypeTabs />
        <FilterBar />
        <QuestionTable />
      </div>

      <QuestionDrawer />
      <CreateTypeModal />
      <BulkActionBar />
    </div>
  );
}
