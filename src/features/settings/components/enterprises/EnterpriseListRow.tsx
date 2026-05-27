"use client";

import { format } from "date-fns";
import { Building2, ChevronRight, MoreHorizontal, Power, PowerOff } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import type { EnterpriseListItem } from "./EnterpriseCard";

const ROW_GRID = cn(
  "grid items-center gap-x-3 px-3",
  "grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_5rem_4.5rem_4.5rem_4.5rem_2.5rem]",
);

const HEADER = "text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/70";

function formatJoined(joined: string): string {
  const d = new Date(joined);
  if (Number.isNaN(d.getTime())) return joined;
  return format(d, "dd MMM yyyy");
}

function StatusPill({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        enabled
          ? "border-emerald-500/12 bg-emerald-500/[0.07] text-emerald-800/90 dark:text-emerald-300/90"
          : "border-amber-500/14 bg-amber-500/[0.08] text-amber-900/80 dark:text-amber-300/90",
      )}
    >
      {enabled ? "Active" : "Disabled"}
    </span>
  );
}

export function EnterpriseListHeader() {
  return (
    <header
      className={cn(
        ROW_GRID,
        "hidden border-b border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] py-2 lg:grid",
      )}
    >
      <span className={HEADER}>Enterprise</span>
      <span className={HEADER}>Plan</span>
      <span className={HEADER}>Joined</span>
      <span className={cn(HEADER, "text-right")}>Users</span>
      <span className={cn(HEADER, "text-right")}>Jobs</span>
      <span className={cn(HEADER, "text-right")}>Candidates</span>
      <span className="sr-only">Access</span>
    </header>
  );
}

export function EnterpriseListRow({
  enterprise,
  enabled,
  onEnabledChange,
}: {
  enterprise: EnterpriseListItem;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}) {
  const joined = formatJoined(enterprise.joined);

  const setEnabled = (next: boolean) => {
    onEnabledChange(next);
    toast.success(next ? `${enterprise.name} enabled` : `${enterprise.name} disabled`);
  };

  const openWorkspace = () => {
    if (!enabled) {
      toast.error(`${enterprise.name} is disabled`);
      return;
    }
    toast.message(`Open ${enterprise.name}`);
  };

  return (
    <>
      {/* Mobile row */}
      <article
        className={cn(
          "flex cursor-pointer items-center gap-2.5 border-b border-[rgba(15,23,42,0.05)] px-3 py-3 lg:hidden",
          hiringTransition,
          "hover:bg-[rgba(15,61,46,0.04)]",
          !enabled && "opacity-90",
        )}
        onClick={openWorkspace}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[rgb(var(--accent-rgb)/0.08)]">
          <Building2 className="h-4 w-4 text-accent" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-text">{enterprise.name}</p>
          <p className="truncate text-[11px] text-muted">
            {enterprise.plan} · {joined}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <StatusPill enabled={enabled} />
            <span className="text-[10px] tabular-nums text-muted">
              {enterprise.candidates.toLocaleString()} candidates
            </span>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Switch.Root
            checked={enabled}
            onCheckedChange={setEnabled}
            className="relative h-5 w-9 rounded-full bg-[rgba(15,23,42,0.12)] data-[state=checked]:bg-accent"
            aria-label={`Toggle ${enterprise.name}`}
          >
            <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
          </Switch.Root>
        </div>
      </article>

      {/* Desktop row */}
      <article
        className={cn(
          ROW_GRID,
          "hidden cursor-pointer border-b border-[rgba(15,23,42,0.05)] py-2.5 last:border-b-0 lg:grid",
          hiringTransition,
          "hover:bg-[rgba(15,61,46,0.04)]",
          !enabled && "opacity-90",
        )}
        onClick={openWorkspace}
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-text">{enterprise.name}</p>
          <p className="truncate text-[11px] text-muted">{enterprise.domain}</p>
        </div>
        <span className="text-[12px] font-medium text-text-secondary/85">{enterprise.plan}</span>
        <span className="text-[12px] tabular-nums text-text-secondary/80">{joined}</span>
        <span className="text-right text-[12px] tabular-nums font-medium text-text">
          {enterprise.users}
        </span>
        <span className="text-right text-[12px] tabular-nums font-medium text-text">
          {enterprise.jobs}
        </span>
        <span className="text-right text-[12px] tabular-nums font-medium text-text">
          {enterprise.candidates.toLocaleString()}
        </span>
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Switch.Root
            checked={enabled}
            onCheckedChange={setEnabled}
            className="relative h-5 w-9 rounded-full bg-[rgba(15,23,42,0.12)] data-[state=checked]:bg-accent"
            aria-label={`Toggle ${enterprise.name}`}
          >
            <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
          </Switch.Root>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="h-7 w-7 rounded-[8px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-none"
                aria-label="Actions"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={openWorkspace}>Open workspace</DropdownMenuItem>
              <DropdownMenuSeparator />
              {enabled ? (
                <DropdownMenuItem onSelect={() => setEnabled(false)}>
                  <PowerOff className="mr-2 h-3.5 w-3.5" />
                  Disable
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => setEnabled(true)}>
                  <Power className="mr-2 h-3.5 w-3.5" />
                  Enable
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ChevronRight className="h-4 w-4 text-text-secondary/25" aria-hidden />
        </div>
      </article>
    </>
  );
}

export function EnterpriseListView({
  enterprises,
  isEnabled,
  setEnabled,
}: {
  enterprises: EnterpriseListItem[];
  isEnabled: (domain: string) => boolean;
  setEnabled: (domain: string, enabled: boolean) => void;
}) {
  if (enterprises.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-[13px] text-muted">No enterprises match your filters.</div>
    );
  }
  return (
    <>
      <EnterpriseListHeader />
      {enterprises.map((e) => (
        <EnterpriseListRow
          key={e.domain}
          enterprise={e}
          enabled={isEnabled(e.domain)}
          onEnabledChange={(next) => setEnabled(e.domain, next)}
        />
      ))}
    </>
  );
}
