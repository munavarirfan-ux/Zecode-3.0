"use client";

import { ArrowLeft } from "lucide-react";
import {
  Calendar,
  ClipboardList,
  Users,
  Check,
  Flag,
  Edit3,
  Layers,
  Settings2,
  MoreHorizontal,
  Pause,
  Play,
  KeyRound,
  Download,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { HiringHeroWorkspace } from "@/components/hiring/HiringHeroWorkspace";
import { HeroActionButton } from "@/components/hiring/HeroActionButton";
import { HeroMetricsCollapsible } from "@/components/hiring/HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "@/components/hiring/HiringHeroGlassKpiCard";
import {
  hiringHeroCollapsedIconBtn,
  hiringHeroStripMetaChips,
  hiringTransition,
} from "@/components/hiring/hiringTokens";
import { useEnterpriseEnabledStore } from "../../../store/enterpriseEnabledStore";
import type { EnterpriseDetail, EnterpriseKpi } from "./enterpriseDetailMock";

const METRICS_STORAGE_KEY = "enterprise-detail-hero-metrics-collapsed";

const glassMeta =
  "inline-flex items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/78 backdrop-blur-md";

const menuContentClass = cn(
  "z-[100] w-[220px] min-w-0 overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
  "dark:border-white/[0.08] dark:bg-surface",
);

const menuItemClass = cn(
  "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0",
  "text-[12px] font-medium outline-none transition-colors duration-150 ease-out",
  "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
  "dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]",
);

const iconMap: Record<EnterpriseKpi["icon"], LucideIcon> = {
  calendar: Calendar,
  clipboard: ClipboardList,
  users: Users,
  check: Check,
  flag: Flag,
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function EnterpriseDetailHero({
  enterprise,
  kpis,
  onFeaturesOpen,
  onConfigureOpen,
}: {
  enterprise: EnterpriseDetail;
  kpis: EnterpriseKpi[];
  onFeaturesOpen: () => void;
  onConfigureOpen: () => void;
}) {
  const isEnabled = useEnterpriseEnabledStore((s) => s.isEnabled);
  const setEnabled = useEnterpriseEnabledStore((s) => s.setEnabled);
  const enabled = isEnabled(enterprise.domain);

  const handleSuspend = () => {
    setEnabled(enterprise.domain, false);
    toast.success(`${enterprise.name} suspended`);
  };

  const handleActivate = () => {
    setEnabled(enterprise.domain, true);
    toast.success(`${enterprise.name} activated`);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${enterprise.name}? This cannot be undone.`)) {
      toast.success(`${enterprise.name} deleted`);
    }
  };

  const metaChips = [
    enterprise.plan,
    enterprise.status,
    `${enterprise.seats} seats`,
    enterprise.industry,
    enterprise.baseDomain,
    `Created ${formatDate(enterprise.joined)}`,
    enterprise.location,
  ].filter(Boolean);

  return (
    <HiringHeroWorkspace
      aria-label="Enterprise workspace header"
      heroCollapseStorageKey="enterprise-detail"
      defaultHeroCollapsed={false}
      collapsedMeta={[enterprise.domain, enterprise.plan, enterprise.status]}
      backHref={ROUTES.settingsEnterprises}
      backLabel={
        <>
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          Back to all enterprises
        </>
      }
      title={enterprise.name}
      subtitle={
        <>
          {enterprise.domain}
          <span className="mx-2 text-white/20">·</span>
          {enterprise.location}
        </>
      }
      meta={
        <div className={hiringHeroStripMetaChips}>
          {metaChips.map((chip) => (
            <span key={chip} className={glassMeta}>
              {chip}
            </span>
          ))}
        </div>
      }
      actions={
        <>
          <HeroActionButton variant="primary" onClick={() => toast.message("Edit enterprise")}>
            <Edit3 className="h-3.5 w-3.5" strokeWidth={2} />
            Edit Enterprise
          </HeroActionButton>
          <HeroActionButton variant="secondary" onClick={onFeaturesOpen}>
            <Layers className="h-3.5 w-3.5" strokeWidth={2} />
            Features
          </HeroActionButton>
          <HeroActionButton variant="secondary" onClick={onConfigureOpen}>
            <Settings2 className="h-3.5 w-3.5" strokeWidth={2} />
            Configure
          </HeroActionButton>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  hiringHeroCollapsedIconBtn,
                  "h-9 w-9 rounded-[11px] p-0",
                  hiringTransition,
                )}
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={4}
              className={menuContentClass}
            >
              <DropdownMenuLabel className="px-2 pb-0.5 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/55">
                Actions
              </DropdownMenuLabel>
              {enabled ? (
                <DropdownMenuItem className={menuItemClass} onSelect={handleSuspend}>
                  <Pause className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
                  Suspend Enterprise
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className={menuItemClass} onSelect={handleActivate}>
                  <Play className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
                  Activate Enterprise
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className={menuItemClass}
                onSelect={() => toast.message("Passwords reset")}
              >
                <KeyRound className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
                Reset Passwords
              </DropdownMenuItem>
              <DropdownMenuItem
                className={menuItemClass}
                onSelect={() => toast.message("Export started")}
              >
                <Download className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuSeparator className="-mx-0 my-0.5 h-px bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]" />
              <DropdownMenuItem
                className={cn(menuItemClass, "text-red-700 dark:text-red-300")}
                onSelect={handleDelete}
              >
                <Trash2 className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
                Delete Enterprise
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
      metrics={
        <HeroMetricsCollapsible
          id="enterprise-detail-hero-metrics"
          storageKey={METRICS_STORAGE_KEY}
          withBorder={false}
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        >
          {kpis.map((kpi) => (
            <HiringHeroGlassKpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              subtitle={kpi.subtitle}
              icon={iconMap[kpi.icon]}
              padValue
            />
          ))}
        </HeroMetricsCollapsible>
      }
    />
  );
}
