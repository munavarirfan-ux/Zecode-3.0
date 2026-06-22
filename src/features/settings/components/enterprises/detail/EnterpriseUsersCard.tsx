"use client";

import { UserPlus, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionTitle, settingsPrimaryBtn } from "../../../settingsTokens";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import type { EnterpriseUser } from "./enterpriseDetailMock";

const ROLE_ACCENT: Record<string, string> = {
  "Super Admin": "border-accent/20 bg-accent/[0.08] text-accent",
  Admin: "border-violet-500/15 bg-violet-500/[0.07] text-violet-800/85 dark:text-violet-300/90",
  Recruiter: "border-sky-500/15 bg-sky-500/[0.07] text-sky-800/85 dark:text-sky-300/90",
  "Hiring Manager": "border-amber-500/15 bg-amber-500/[0.07] text-amber-800/85 dark:text-amber-300/90",
  Interviewer: "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-800/85 dark:text-emerald-300/90",
  Evaluator: "border-orange-500/15 bg-orange-500/[0.07] text-orange-800/85 dark:text-orange-300/90",
  Curator: "border-pink-500/15 bg-pink-500/[0.07] text-pink-800/85 dark:text-pink-300/90",
  Viewer: "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)] text-text-secondary/80",
};

const STATUS_DOT: Record<string, string> = {
  Active: "bg-emerald-500",
  Pending: "bg-amber-400",
  Inactive: "bg-zinc-400",
};

export function EnterpriseUsersCard({ users }: { users: EnterpriseUser[] }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <div className="flex items-center justify-between gap-4">
        <h3 className={settingsSectionTitle}>Enterprise Users</h3>
        <button
          type="button"
          className={cn(settingsPrimaryBtn, "h-8 px-3 text-[12px]")}
          onClick={() => toast.message("Invite user")}
        >
          <UserPlus className="h-3 w-3" strokeWidth={2} />
          Invite User
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]">
              <th className="pb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60">Name</th>
              <th className="pb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60">Role</th>
              <th className="hidden pb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60 sm:table-cell">Status</th>
              <th className="hidden pb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60 md:table-cell">Last Active</th>
              <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/60">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(15,23,42,0.04)] dark:divide-white/[0.04]">
            {users.map((u) => (
              <tr key={u.id} className="group">
                <td className="py-2.5 pr-3">
                  <p className="text-[12px] font-medium text-text">{u.name}</p>
                  <p className="text-[11px] text-muted">{u.email}</p>
                </td>
                <td className="py-2.5 pr-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em]",
                      ROLE_ACCENT[u.role] ?? ROLE_ACCENT.Viewer,
                    )}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="hidden py-2.5 pr-3 sm:table-cell">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-text-secondary">
                    <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[u.status] ?? STATUS_DOT.Inactive)} />
                    {u.status}
                  </span>
                </td>
                <td className="hidden py-2.5 pr-3 text-[11px] text-muted md:table-cell">{u.lastActive}</td>
                <td className="py-2.5 text-right">
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-[8px]",
                      hiringTransition,
                      "opacity-0 hover:bg-[rgba(15,23,42,0.04)] group-hover:opacity-100 dark:hover:bg-white/[0.04]",
                    )}
                    onClick={() => toast.message(`Manage ${u.name}`)}
                    aria-label={`Actions for ${u.name}`}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
