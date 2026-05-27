"use client";

import { format } from "date-fns";
import { settingsPanel } from "../settingsTokens";
import { cn } from "@/lib/utils";
import { SettingsPageHeader } from "./SettingsPageHeader";

export type AuditEventRow = {
  id: string;
  createdAt: string;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
};

export function AuditLogPanel({ events }: { events: AuditEventRow[] }) {
  return (
    <div className="space-y-4">
      <SettingsPageHeader
        scope="enterprise"
        scopeLabel="Enterprise · admins only"
        title="Audit log"
        description="Recent actions across your enterprise workspace for compliance and troubleshooting."
      />

      {events.length === 0 ? (
        <div className={cn(settingsPanel, "p-8 text-center text-[13px] text-muted")}>
          No audit events yet.
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <article key={e.id} className={cn(settingsPanel, "flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between")}>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-text">{e.action}</p>
                <p className="text-[12px] text-muted">
                  {e.entityType}
                  {e.entityId ? ` · ${e.entityId}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right text-[11px] text-text-secondary/80">
                <p>{format(new Date(e.createdAt), "dd MMM yyyy · h:mm a")}</p>
                <p>{e.actorEmail ?? "System"}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
