"use client";

import { MoreHorizontal, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { HeroActionButton } from "@/components/hiring/HeroActionButton";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { isEnterpriseAdmin } from "../../settingsAccess";
import { WORKSPACE_MEMBER_ROLES } from "../../lib/settingsRolePermissions";
import {
  MOCK_TEAM_MEMBERS,
  MOCK_TEAMS,
  type TeamMemberRow,
  type TeamMemberStatus,
} from "../../mock/teamsData";
import { SettingsCard } from "../SettingsCard";
import { SettingsGate } from "../SettingsGate";
import { SettingsPageHeader } from "../SettingsPageHeader";
import { settingsPanel } from "../../settingsTokens";
import { CreateTeamModal } from "./CreateTeamModal";
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

export function TeamsMembersPage() {
  const { selectedRole } = useRole();
  const [members, setMembers] = useState(MOCK_TEAM_MEMBERS);
  const [teams, setTeams] = useState(MOCK_TEAMS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);

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
          <div className="flex flex-wrap gap-2">
            <HeroActionButton type="button" onClick={() => setTeamOpen(true)}>
              <Users className="h-3.5 w-3.5" />
              Create team
            </HeroActionButton>
            <HeroActionButton type="button" variant="primary" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-3.5 w-3.5" />
              Invite member
            </HeroActionButton>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {teams.map((t) => (
          <div key={t.id} className={cn(settingsPanel, "p-4")}>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
              <p className="text-[13px] font-semibold text-text">{t.name}</p>
            </div>
            <p className="mt-1 text-[11px] text-muted">{t.memberCount} members · Lead: {t.lead}</p>
          </div>
        ))}
      </div>

      <SettingsCard title="Members" description="Workspace access by role and team.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-[rgba(15,23,42,0.06)] text-[10px] font-semibold uppercase tracking-[0.06em] text-muted dark:border-white/[0.06]">
                <th className="pb-3 pr-4">Member</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Team</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Last active</th>
                <th className="pb-3 pr-4">Permissions</th>
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
            team: payload.team,
            status: "pending",
            lastActive: "—",
            permissionsSummary: WORKSPACE_MEMBER_ROLES.find((r) => r.id === payload.role)?.label ?? payload.role,
          };
          setMembers((list) => [row, ...list]);
        }}
      />
      <CreateTeamModal
        open={teamOpen}
        onOpenChange={setTeamOpen}
        onCreate={(payload) => {
          setTeams((list) => [
            {
              id: `t-${Date.now()}`,
              name: payload.name,
              description: payload.description,
              lead: payload.lead,
              color: payload.color,
              memberCount: payload.memberIds.length,
            },
            ...list,
          ]);
        }}
      />
    </div>
  );
}

function MemberRow({ member }: { member: TeamMemberRow }) {
  const roleLabel = WORKSPACE_MEMBER_ROLES.find((r) => r.id === member.role)?.label ?? member.role;
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
      <td className="py-3 pr-4 font-medium text-text-secondary">{roleLabel}</td>
      <td className="py-3 pr-4 text-text-secondary">{member.team}</td>
      <td className="py-3 pr-4">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", statusPill(member.status))}>
          {member.status}
        </span>
      </td>
      <td className="py-3 pr-4 tabular-nums text-muted">{member.lastActive}</td>
      <td className="py-3 pr-4 text-[11px] text-text-secondary">{member.permissionsSummary}</td>
      <td className="py-3">
        <button type="button" className="rounded-[8px] p-1.5 text-muted hover:bg-[rgba(15,23,42,0.04)]" aria-label="Actions">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
