"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRight, GitBranch, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HiringJob } from "@/lib/hiring/types";
import {
  addTeamMember,
  directoryEntryToAssignee,
  getJobHiringTeamForJob,
  removeTeamMember,
  saveJobHiringTeam,
  type HiringTeamDirectoryEntry,
  type JobHiringTeamGroups,
  type JobHiringTeamRole,
  type JobTeamAssignee,
} from "@/lib/hiring/jobHiringTeam";
import { overviewGlassCard, overviewSectionLabel } from "../hiringTokens";
import { AddHiringTeamMemberDialog } from "./AddHiringTeamMemberDialog";
import { HiringTeamEmptyState } from "./HiringTeamEmptyIllustration";
import { ManageHiringProcessDialog } from "./ManageHiringProcessDialog";

const AVATAR_PALETTES = [
  "bg-[#E0E7FF] text-[#3730A3]",
  "bg-[#EDE9FE] text-[#5B21B6]",
  "bg-[#DBEAFE] text-[#1D4ED8]",
  "bg-[#FCE7F3] text-[#9D174D]",
] as const;

function avatarPalette(index: number) {
  return AVATAR_PALETTES[index % AVATAR_PALETTES.length];
}

function TeamAssigneeRow({
  person,
  index,
  onDelete,
}: {
  person: JobTeamAssignee;
  index: number;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center gap-3 py-2.5">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
          avatarPalette(index),
        )}
        aria-hidden
      >
        {person.initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[#18181B] dark:text-text">{person.name}</p>
        <p className="truncate text-[12px] text-[#71717A] dark:text-muted">{person.email}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 shrink-0 p-0 text-muted opacity-70 transition-opacity hover:text-red-600 group-hover:opacity-100"
        aria-label={`Remove ${person.name}`}
        onClick={onDelete}
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
      </Button>
    </div>
  );
}

function HiringTeamRoleCard({
  title,
  members,
  addLabel,
  onAdd,
  onDeleteMember,
}: {
  title: string;
  members: JobTeamAssignee[];
  addLabel: string;
  onAdd: () => void;
  onDeleteMember: (memberId: string) => void;
}) {
  return (
    <article
      className={cn(
        "flex min-h-[220px] flex-col rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white/90",
        "dark:border-white/[0.06] dark:bg-white/[0.03]",
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
        <h3 className="text-[13px] font-semibold text-[#18181B] dark:text-text">{title}</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 shrink-0 gap-1 px-2.5 text-[11px]"
          aria-label={addLabel}
          onClick={onAdd}
        >
          <Plus className="h-3 w-3" strokeWidth={2.25} aria-hidden />
          <span className="truncate">{addLabel}</span>
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        {members.length === 0 ? (
          <HiringTeamEmptyState />
        ) : (
          <div className="flex-1 space-y-1 divide-y divide-[rgba(15,23,42,0.05)] dark:divide-white/[0.05]">
            {members.map((person, i) => (
              <TeamAssigneeRow
                key={person.id}
                person={person}
                index={i}
                onDelete={() => onDeleteMember(person.id)}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function JobWorkspaceHiringSetup({ job }: { job: HiringJob }) {
  const [processOpen, setProcessOpen] = useState(false);
  const [addRole, setAddRole] = useState<JobHiringTeamRole | null>(null);
  const [team, setTeam] = useState<JobHiringTeamGroups>(() => getJobHiringTeamForJob(job));

  useEffect(() => {
    setTeam(getJobHiringTeamForJob(job));
  }, [job.id]);

  const handleDelete = useCallback(
    (role: JobHiringTeamRole, memberId: string, memberName: string) => {
      setTeam((prev) => {
        const next = removeTeamMember(prev, role, memberId);
        saveJobHiringTeam(job.id, next);
        return next;
      });
      const roleLabel =
        role === "panelMembers" ? "panel members" : role === "hiringManagers" ? "hiring managers" : "recruiters";
      toast.success(`${memberName} removed from ${roleLabel}`);
    },
    [job.id],
  );

  const handleAddMember = useCallback(
    (role: JobHiringTeamRole, entry: HiringTeamDirectoryEntry): boolean => {
      const member = directoryEntryToAssignee(entry);
      let added = false;
      setTeam((prev) => {
        const next = addTeamMember(prev, role, member);
        added = next[role].length > prev[role].length;
        if (added) saveJobHiringTeam(job.id, next);
        return next;
      });
      return added;
    },
    [job.id],
  );

  const openAddDialog = (role: JobHiringTeamRole) => setAddRole(role);

  return (
    <>
      <section className={cn(overviewGlassCard, "space-y-4")}>
        <div>
          <p className={overviewSectionLabel}>Hiring workflow</p>
          <button
            type="button"
            className="mt-3 flex w-full items-center gap-3 rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white/90 px-4 py-3.5 text-left transition-colors hover:border-[rgba(15,23,42,0.1)] hover:bg-white dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
            onClick={() => setProcessOpen(true)}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgb(var(--accent-soft-rgb))] text-accent">
              <GitBranch className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-[#18181B] dark:text-text">
                Manage Hiring Process
              </span>
              <span className="mt-0.5 block text-[12px] text-[#71717A] dark:text-muted">
                Configure stages, levels, and evaluation criteria.
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#A1A1AA]" strokeWidth={2} />
          </button>
        </div>

        <div>
          <p className={overviewSectionLabel}>Hiring team</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <HiringTeamRoleCard
              title="Recruiter"
              members={team.recruiters}
              addLabel="Add Recruiter(s)"
              onAdd={() => openAddDialog("recruiters")}
              onDeleteMember={(id) => {
                const person = team.recruiters.find((m) => m.id === id);
                if (person) handleDelete("recruiters", id, person.name);
              }}
            />
            <HiringTeamRoleCard
              title="Hiring Manager"
              members={team.hiringManagers}
              addLabel="Add Hiring Manager(s)"
              onAdd={() => openAddDialog("hiringManagers")}
              onDeleteMember={(id) => {
                const person = team.hiringManagers.find((m) => m.id === id);
                if (person) handleDelete("hiringManagers", id, person.name);
              }}
            />
            <HiringTeamRoleCard
              title="Panel Members"
              members={team.panelMembers}
              addLabel="Add Panel Member(s)"
              onAdd={() => openAddDialog("panelMembers")}
              onDeleteMember={(id) => {
                const person = team.panelMembers.find((m) => m.id === id);
                if (person) handleDelete("panelMembers", id, person.name);
              }}
            />
          </div>
        </div>
      </section>

      <ManageHiringProcessDialog open={processOpen} onOpenChange={setProcessOpen} job={job} />

      <AddHiringTeamMemberDialog
        open={addRole !== null}
        onOpenChange={(open) => {
          if (!open) setAddRole(null);
        }}
        role={addRole}
        job={job}
        team={team}
        onAddMember={handleAddMember}
      />
    </>
  );
}
