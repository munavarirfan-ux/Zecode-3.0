"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import { settingsPanel } from "../../settingsTokens";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { isPlatformSuperAdmin } from "../../settingsAccess";
import { MIGRATION_HISTORY } from "../../mock/migrationData";
import { SettingsGate } from "../SettingsGate";
import { SettingsPageHeader } from "../SettingsPageHeader";

type SortDir = "desc" | "asc";

export function MigrationPage() {
  const { selectedRole } = useRole();
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const allowed = isPlatformSuperAdmin(selectedRole);

  const rows = useMemo(() => {
    if (!allowed) return [];
    const list = [...MIGRATION_HISTORY];
    list.sort((a, b) => {
      const diff = new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime();
      return sortDir === "desc" ? -diff : diff;
    });
    return list;
  }, [sortDir, allowed]);

  if (!allowed) {
    return <SettingsGate title="Migration is restricted to Super Admins" />;
  }

  return (
    <div className="space-y-4">
      <SettingsPageHeader
        scope="platform"
        scopeLabel="Platform · Super Admin only"
        title="Migration"
        description="Migration scripts and execution history."
      />

      <section className="space-y-3">
        <h2 className="text-[14px] font-semibold text-text">Migration history</h2>

        <div className={cn(settingsPanel, "overflow-hidden p-0")}>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]">
                <th className="px-4 py-3 text-[12px] font-semibold text-text-secondary/85">
                  Migration Script
                </th>
                <th
                  className="cursor-pointer select-none px-4 py-3 text-right text-[12px] font-semibold text-text-secondary/85 hover:text-text"
                  onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                >
                  Executed On {sortDir === "desc" ? "↓" : "↑"}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-12 text-center text-[13px] text-muted"
                  >
                    No migration history available.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[rgba(15,23,42,0.04)] last:border-b-0 dark:border-white/[0.04]"
                  >
                    <td className="px-4 py-3 text-[13px] font-medium text-text">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-right text-[13px] text-text-secondary/85">
                      {format(new Date(item.executedAt), "dd/MM/yyyy, hh:mm:ss a")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
