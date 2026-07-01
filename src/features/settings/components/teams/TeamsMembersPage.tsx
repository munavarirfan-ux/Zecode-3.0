"use client";

import { MoreHorizontal, UserPlus } from "lucide-react";
import { useState } from "react";
import { HeroActionButton } from "@/components/hiring/HeroActionButton";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { isEnterpriseAdmin } from "../../settingsAccess";
import { WORKSPACE_MEMBER_ROLES } from "../../lib/settingsRolePermissions";
import {
  MOCK_TEAM_MEMBERS,
  ROLE_REFERENCES,
  type TeamMemberRow,
  type TeamMemberStatus,
} from "../../mock/teamsData";
import { SettingsCard } from "../SettingsCard";
import { SettingsGate } from "../SettingsGate";
import { SettingsPageHeader } from "../SettingsPageHeader";
import { InviteMemberModal } from "./InviteMemberModal";
import type { WorkspaceMemberRole } from "../../lib/settingsRolePermissions";

function memberInitials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length < 2) return (p[0] ?? "?").slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function statusPill(status: TeamMemberStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    case "pending":
      return "bg-amber-500/10 text-amber-800 dark:text-amber-400";
    case "expired":
      return "bg-[rgba(15,23,42,0.06)] text-muted";
  }
}

const ROLE_CARD_COLORS: Record<WorkspaceMemberRole, string> = {
  superAdmin: "border-purple-200 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-500/10",
  admin: "border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10",
  recruiter: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
  interviewer: "border-orange-200 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/10",
  evaluator: "border-teal-200 bg-teal-50 dark:border-teal-500/20 dark:bg-teal-500/10",
  curator: "border-pink-200 bg-pink-50 dark:border-pink-500/20 dark:bg-pink-500/10",
  viewer: "border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04]",
};

const ROLE_PILL_COLORS: Record<WorkspaceMemberRole, string> = {
  superAdmin: "bg-purple-100 text-purple-700 dark:bg-purple-500/25 dark:text-purple-300",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300",
  recruiter: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300",
  interviewer: "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300",
  evaluator: "bg-teal-100 text-teal-700 dark:bg-teal-500/25 dark:text-teal-300",
  curator: "bg-pink-100 text-pink-700 dark:bg-pink-500/25 dark:text-pink-300",
  viewer: "bg-slate-100 text-slate-600 dark:bg-white/[0.1] dark:text-slate-400",
};

function RolePill({ role }: { role: WorkspaceMemberRole }) {
  const label = WORKSPACE_MEMBER_ROLES.find((r) => r.id === role)?.label ?? role;
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
        ROLE_PILL_COLORS[role],
      )}
    >
      {label}
    </span>
  );
}

export { ROLE_PILL_COLORS, RolePill };

export function TeamsMembersPage() {
  const { selectedRole } = useRole();
  const [members, setMembers] = useState(MOCK_TEAM_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);

  if (!isEnterpriseAdmin(selectedRole)) {
    return <SettingsGate title="Teams & Members requires an admin role" />;
  }

  return (
    <div className="space-y-4">
      <SettingsPageHeader
        scope="enterprise"
        scopeLabel="Enterprise · admins only"
        title="Teams & Members"
        description="Manage recruiters, interviewers, evaluators, and workspace access."
        action={
          <HeroActionButton type="button" variant="primary" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" />
            Invite Member
          </HeroActionButton>
        }
      />

      <SettingsCard
        title="User Roles"
        description="Understand what each role can access inside the workspace."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ROLE_REFERENCES.map((ref) => (
            <div
              key={ref.role}
              className={cn(
                "flex flex-col rounded-[14px] border p-4",
                ROLE_CARD_COLORS[ref.role],
              )}
            >
              <span className="text-[13px] font-semibold text-text">{ref.label}</span>
              <p className="mt-2 text-[13px] font-medium leading-snug text-text">{ref.description}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary/75">{ref.subtext}</p>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="All Members" description="Workspace members and their assigned roles.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-[rgba(15,23,42,0.06)] text-[10px] font-semibold uppercase tracking-[0.06em] text-muted dark:border-white/[0.06]">
                <th className="pb-3 pr-4">Member</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Last active</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <MemberRow key={m.id} member={m} />
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={(payload) => {
          const row: TeamMemberRow = {
            id: `m-${Date.now()}`,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            status: "pending",
            lastActive: "—",
          };
          setMembers((list) => [row, ...list]);
        }}
      />
    </div>
  );
}

function MemberRow({ member }: { member: TeamMemberRow }) {
  return (
    <tr className="border-b border-[rgba(15,23,42,0.04)] last:border-0 dark:border-white/[0.04]">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(var(--accent-rgb)/0.12)] to-[rgb(var(--accent-rgb)/0.04)] text-[11px] font-semibold text-accent">
            {memberInitials(member.name)}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-text">{member.name}</p>
            <p className="truncate text-[11px] text-muted">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4">
        <RolePill role={member.role} />
      </td>
      <td className="py-3 pr-4">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", statusPill(member.status))}>
          {member.status}
        </span>
      </td>
      <td className="py-3 pr-4 tabular-nums text-muted">{member.lastActive}</td>
      <td className="py-3">
        <button type="button" className="rounded-[8px] p-1.5 text-muted hover:bg-[rgba(15,23,42,0.04)]" aria-label="Actions">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
