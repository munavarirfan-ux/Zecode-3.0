"use client";

import {
  ArrowUpRight,
  Building2,
  Copy,
  LayoutDashboard,
  MoreHorizontal,
  Power,
  PowerOff,
  Users,
  type LucideIcon,
} from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { hiringCard, hiringTransition } from "@/components/hiring/hiringTokens";

export type EnterpriseListItem = {
  name: string;
  domain: string;
  location: string;
  plan: string;
  status: string;
  joined: string;
  users: number;
  jobs: number;
  candidates: number;
};

type EnterpriseStatus = "Active" | "Trial" | string;

const STATUS_ACCENT: Record<string, string> = {
  Active:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-emerald-500 before:shadow-[2px_0_12px_rgba(16,185,129,0.35)] before:content-['']",
  Trial:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-sky-500 before:shadow-[2px_0_12px_rgba(14,165,233,0.3)] before:content-['']",
  Disabled:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-amber-500 before:shadow-[2px_0_12px_rgba(245,158,11,0.3)] before:content-['']",
  Inactive:
    "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-zinc-400/90 before:content-['']",
};

const STATUS_BADGE: Record<string, string> = {
  Active:
    "border-emerald-500/12 bg-emerald-500/[0.07] text-emerald-800/90 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90",
  Trial:
    "border-sky-500/12 bg-sky-500/[0.07] text-sky-800/85 dark:border-sky-400/15 dark:bg-sky-400/10 dark:text-sky-300/90",
  Disabled:
    "border-amber-500/14 bg-amber-500/[0.08] text-amber-900/80 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300/90",
};

const menuContentClass = cn(
  "z-[100] w-[232px] min-w-0 max-h-none overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
  "dark:border-white/[0.08] dark:bg-surface",
);

function MetaChip({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-tight",
        hiringTransition,
        accent
          ? "border-accent/15 bg-accent/[0.08] text-accent"
          : "border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.02)] text-text-secondary/75 dark:border-white/[0.06] dark:bg-white/[0.03]",
      )}
    >
      {children}
    </span>
  );
}

function PrimaryCandidatesMetric({ count, muted }: { count: number; muted?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border px-3 py-2.5",
        muted
          ? "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] dark:border-white/[0.06] dark:bg-white/[0.03]"
          : "border-forest/12 bg-gradient-to-br from-forest/[0.08] to-forest/[0.04] dark:border-emerald-500/15 dark:from-emerald-500/12 dark:to-emerald-500/5",
      )}
    >
      <p
        className={cn(
          "text-[1.625rem] font-semibold tabular-nums leading-none tracking-[-0.04em]",
          muted ? "text-text-secondary/50" : "text-[#0F3D2E] dark:text-emerald-300",
        )}
      >
        {count.toLocaleString()}
      </p>
      <p
        className={cn(
          "mt-1 text-[11px] font-semibold tracking-tight",
          muted ? "text-muted/70" : "text-forest/85 dark:text-emerald-400/90",
        )}
      >
        Total Candidates
      </p>
    </div>
  );
}

function SecondaryMetricChip({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-transparent bg-[rgba(15,23,42,0.03)] px-2 py-1 text-[11px] text-muted/90 dark:bg-white/[0.04]">
      <span className="font-medium tabular-nums text-text-secondary/90">{value}</span>
      <span className="text-text-secondary/55">{label}</span>
    </span>
  );
}

function EnterpriseStatusBadge({ status }: { status: EnterpriseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.03em]",
        STATUS_BADGE[status] ??
          "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] text-text-secondary/80 dark:border-white/[0.08] dark:bg-white/[0.04]",
      )}
    >
      {status}
    </span>
  );
}

function MenuSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <DropdownMenuLabel className="px-2 pb-0.5 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/55">
        {label}
      </DropdownMenuLabel>
      {children}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className={cn(
        "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0",
        "text-[12px] font-medium text-text/90 outline-none transition-colors duration-150 ease-out",
        "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
        "dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]",
      )}
    >
      <Icon className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
      {label}
    </DropdownMenuItem>
  );
}

function formatJoined(joined: string): string {
  const d = new Date(joined);
  if (Number.isNaN(d.getTime())) return `Joined ${joined}`;
  return `Joined ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
}

function isCardAction(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-enterprise-card-action]"));
}

export function EnterpriseCard({
  enterprise,
  enabled,
  onEnabledChange,
}: {
  enterprise: EnterpriseListItem;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}) {
  const router = useRouter();
  const displayStatus = enabled ? enterprise.status : "Disabled";
  const accent = enabled
    ? (STATUS_ACCENT[enterprise.status] ?? STATUS_ACCENT.Inactive)
    : STATUS_ACCENT.Disabled;
  const joinedLabel = formatJoined(enterprise.joined);
  const slug = enterprise.domain.trim().toLowerCase().split(".")[0].replace(/[^a-z0-9-]/g, "");

  const openWorkspace = () => {
    if (!enabled) {
      toast.error(`${enterprise.name} is disabled`, {
        description: "Enable the workspace before opening.",
      });
      return;
    }
    router.push(ROUTES.allEnterprise(slug));
  };

  const setEnabled = (next: boolean) => {
    onEnabledChange(next);
    toast.success(
      next ? `${enterprise.name} enabled` : `${enterprise.name} disabled`,
      {
        description: next
          ? "Users can sign in and access this workspace."
          : "Workspace access is suspended for all users.",
      },
    );
  };
  const copyDomain = () => {
    void navigator.clipboard.writeText(enterprise.domain);
    toast.success("Domain copied");
  };

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isCardAction(e.target)) return;
    openWorkspace();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (isCardAction(e.target)) return;
    e.preventDefault();
    openWorkspace();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`${enterprise.name} — ${enabled ? "enabled" : "disabled"}`}
      className={cn(
        hiringCard,
        "group relative flex h-full flex-col overflow-hidden cursor-pointer",
        enabled &&
          "hover:-translate-y-1 hover:border-[rgba(15,61,46,0.14)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06),0_24px_48px_-16px_rgba(15,61,46,0.16),0_0_0_1px_rgba(15,61,46,0.1)] dark:hover:border-emerald-500/20 dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.18),0_24px_48px_-16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(167,243,208,0.12)]",
        !enabled && "opacity-[0.88] saturate-[0.92]",
        hiringTransition,
        accent,
        "outline-none focus-visible:ring-2 focus-visible:ring-forest/25 focus-visible:ring-offset-2",
      )}
    >
      <ArrowUpRight
        className={cn(
          "pointer-events-none absolute right-4 top-4 z-[1] h-4 w-4 text-forest/0",
          hiringTransition,
          "group-hover:text-forest/60",
        )}
        strokeWidth={2}
        aria-hidden
      />

      <div className="relative z-[1] flex flex-1 flex-col gap-3 p-4 sm:p-[1.125rem]">
        <div className="space-y-1.5 pr-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.03em] text-text transition-colors duration-[180ms] group-hover:text-forest">
              {enterprise.name}
            </h3>
            <EnterpriseStatusBadge status={displayStatus} />
          </div>
          <p className="text-[12px] font-medium text-text-secondary/70">
            {enterprise.domain}
            <span className="mx-1.5 text-muted/30">·</span>
            {enterprise.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <MetaChip>{enterprise.plan}</MetaChip>
          <MetaChip accent={enterprise.plan === "Enterprise"}>Workspace</MetaChip>
        </div>

        <div className="space-y-2">
          <PrimaryCandidatesMetric count={enterprise.candidates} muted={!enabled} />
          <div className="flex flex-wrap gap-1.5">
            <SecondaryMetricChip value={enterprise.users} label="Users" />
            <SecondaryMetricChip value={enterprise.jobs} label="Jobs" />
          </div>
        </div>

        <div
          data-enterprise-card-action
          className="flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.03]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-text">Workspace access</p>
            <p className="text-[10px] text-muted">
              {enabled ? "Users can sign in" : "Access suspended"}
            </p>
          </div>
          <Switch.Root
            checked={enabled}
            onCheckedChange={setEnabled}
            className="relative h-5 w-9 shrink-0 rounded-full bg-[rgba(15,23,42,0.12)] data-[state=checked]:bg-accent"
            aria-label={`${enabled ? "Disable" : "Enable"} ${enterprise.name}`}
          >
            <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
          </Switch.Root>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[rgba(15,23,42,0.05)] pt-3 dark:border-white/[0.05]">
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-[11px] font-medium leading-snug text-text-secondary/85">{joinedLabel}</p>
            <p className="flex items-center gap-1 text-[11px] leading-snug text-muted/75">
              <Building2 className="h-3 w-3 shrink-0 opacity-60" strokeWidth={1.75} aria-hidden />
              {enterprise.domain}
            </p>
          </div>

          <div
            data-enterprise-card-action
            className="relative z-[2] shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className={cn(
                    "h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-sm",
                    hiringTransition,
                    "hover:border-[rgba(15,61,46,0.12)] hover:bg-white dark:bg-surface",
                  )}
                  aria-label="Enterprise actions"
                >
                  <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={4}
                collisionPadding={12}
                avoidCollisions={false}
                className={menuContentClass}
              >
                <MenuSection label="Workspace">
                  <MenuItem icon={LayoutDashboard} label="Open workspace" onSelect={openWorkspace} />
                  <MenuItem icon={Users} label="Manage members" onSelect={openWorkspace} />
                </MenuSection>
                <DropdownMenuSeparator className="-mx-0 my-0.5 h-px bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]" />
                <MenuSection label="Access">
                  {enabled ? (
                    <MenuItem
                      icon={PowerOff}
                      label="Disable enterprise"
                      onSelect={() => setEnabled(false)}
                    />
                  ) : (
                    <MenuItem
                      icon={Power}
                      label="Enable enterprise"
                      onSelect={() => setEnabled(true)}
                    />
                  )}
                </MenuSection>
                <DropdownMenuSeparator className="-mx-0 my-0.5 h-px bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]" />
                <MenuSection label="Enterprise">
                  <MenuItem icon={Copy} label="Copy domain" onSelect={copyDomain} />
                </MenuSection>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  );
}
