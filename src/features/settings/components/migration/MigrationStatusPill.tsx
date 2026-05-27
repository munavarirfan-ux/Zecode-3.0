"use client";

import { cn } from "@/lib/utils";
import type { MigrationConnectionStatus, MigrationRunStatus } from "../../settingsTypes";

const CONNECTION_STYLES: Record<MigrationConnectionStatus, string> = {
  connected: "border-emerald-400/30 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  not_connected: "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)] text-muted",
  failed: "border-red-400/30 bg-red-50/80 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  in_progress:
    "border-[rgb(var(--accent-rgb)/0.3)] bg-[rgb(var(--accent-rgb)/0.08)] text-accent animate-pulse",
};

const RUN_STYLES: Record<MigrationRunStatus, string> = {
  success: "border-emerald-400/30 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  failed: "border-red-400/30 bg-red-50/80 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  running: "border-[rgb(var(--accent-rgb)/0.3)] bg-[rgb(var(--accent-rgb)/0.08)] text-accent",
  queued: "border-amber-400/30 bg-amber-50/80 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400",
};

const CONNECTION_LABELS: Record<MigrationConnectionStatus, string> = {
  connected: "Connected",
  not_connected: "Not connected",
  failed: "Failed",
  in_progress: "In progress",
};

const RUN_LABELS: Record<MigrationRunStatus, string> = {
  success: "Success",
  failed: "Failed",
  running: "Running",
  queued: "Queued",
};

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function MigrationConnectionPill({ status }: { status: MigrationConnectionStatus }) {
  return <Pill className={CONNECTION_STYLES[status]}>{CONNECTION_LABELS[status]}</Pill>;
}

export function MigrationRunPill({ status }: { status: MigrationRunStatus }) {
  return <Pill className={RUN_STYLES[status]}>{RUN_LABELS[status]}</Pill>;
}
