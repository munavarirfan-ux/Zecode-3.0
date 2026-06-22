"use client";

import {
  Calendar,
  ClipboardList,
  Users,
  Check,
  Flag,
  type LucideIcon,
} from "lucide-react";
import { dashboardKpiCard, dashboardKpiIcon, dashboardLabel } from "@/components/dashboard/dashboardTokens";
import { cn } from "@/lib/utils";
import type { EnterpriseKpi } from "./enterpriseDetailMock";

const iconMap: Record<EnterpriseKpi["icon"], LucideIcon> = {
  calendar: Calendar,
  clipboard: ClipboardList,
  users: Users,
  check: Check,
  flag: Flag,
};

function KpiCard({ kpi }: { kpi: EnterpriseKpi }) {
  const Icon = iconMap[kpi.icon];
  return (
    <article className={dashboardKpiCard}>
      <div className={dashboardKpiIcon}>
        <Icon className="h-[18px] w-[18px] text-accent-deep dark:text-accent-200" strokeWidth={1.75} />
      </div>
      <p className={cn(dashboardLabel, "mt-3")}>{kpi.label}</p>
      <p className="mt-1 text-[1.75rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-[#18181B] dark:text-text">
        {kpi.value.toLocaleString()}
      </p>
      <p className="mt-1.5 text-[12px] font-medium leading-snug text-[#3F3F46] dark:text-text-secondary/90">
        {kpi.subtitle}
      </p>
    </article>
  );
}

export function EnterpriseDetailKpiStrip({ kpis }: { kpis: EnterpriseKpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {kpis.map((k) => (
        <KpiCard key={k.label} kpi={k} />
      ))}
    </div>
  );
}
