"use client";

import {
  Braces,
  Code2,
  Database,
  FileSpreadsheet,
  Gauge,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hiringShadowHover, hiringTransition } from "@/components/hiring/hiringTokens";
import { settingsAccentBgHover, settingsIconTile, settingsPanel } from "../../settingsTokens";
import type { MigrationSource } from "../../settingsTypes";
import { MigrationConnectionPill } from "./MigrationStatusPill";

const ICONS = {
  hackerrank: Terminal,
  codesignal: Gauge,
  leetcode: Code2,
  mettl: Database,
  csv: FileSpreadsheet,
  api: Braces,
} as const;

function ctaForStatus(status: MigrationSource["status"]): string {
  switch (status) {
    case "connected":
      return "Import";
    case "not_connected":
      return "Connect";
    case "failed":
      return "Retry";
    case "in_progress":
      return "View logs";
  }
}

export function MigrationSourceCard({
  source,
  onAction,
}: {
  source: MigrationSource;
  onAction: (source: MigrationSource) => void;
}) {
  const Icon = ICONS[source.icon];
  return (
    <article
      className={cn(
        settingsPanel,
        hiringShadowHover,
        hiringTransition,
        "flex flex-col p-4",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(settingsIconTile, "h-10 w-10")}
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <MigrationConnectionPill status={source.status} />
      </div>
      <h3 className="mt-3 text-[14px] font-semibold text-text">{source.name}</h3>
      <p className="mt-1 flex-1 text-[12px] leading-relaxed text-text-secondary/80">
        {source.description}
      </p>
      {source.lastSync ? (
        <p className="mt-3 text-[11px] text-muted">Last sync · {source.lastSync}</p>
      ) : (
        <p className="mt-3 text-[11px] text-muted">Never synced</p>
      )}
      <button
        type="button"
        onClick={() => onAction(source)}
        className={cn(
          "mt-4 h-9 w-full rounded-[10px] border text-[12px] font-semibold",
          hiringTransition,
          source.status === "connected"
            ? "border-accent/30 bg-accent text-white hover:bg-accent-hover"
            : cn("border-[rgba(15,23,42,0.08)] text-text", settingsAccentBgHover),
        )}
      >
        {ctaForStatus(source.status)}
      </button>
    </article>
  );
}
