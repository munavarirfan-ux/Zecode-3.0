"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonLg,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import {
  directoryEntryToAssignee,
  getHiringTeamQuickSuggestions,
  searchHiringTeamDirectory,
  type HiringTeamDirectoryEntry,
  type JobHiringTeamGroups,
  type JobHiringTeamRole,
} from "@/lib/hiring/jobHiringTeam";
import type { HiringJob } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";

const ROLE_COPY: Record<
  JobHiringTeamRole,
  { title: string; searchPlaceholder: string; quickLabel: string; emptySearch: string }
> = {
  recruiters: {
    title: "Add Recruiter",
    searchPlaceholder: "Search recruiters…",
    quickLabel: "Suggested recruiters",
    emptySearch: "Type a name or role to search all recruiters.",
  },
  hiringManagers: {
    title: "Add Hiring Manager",
    searchPlaceholder: "Search hiring managers…",
    quickLabel: "Suggested hiring managers",
    emptySearch: "Type a name to search all hiring managers.",
  },
  panelMembers: {
    title: "Add Panel Member",
    searchPlaceholder: "Search panel members…",
    quickLabel: "Suggested panel members",
    emptySearch: "Type a name or discipline to search the panel directory.",
  },
};

const inputClass =
  "h-10 rounded-[10px] border-[rgba(15,23,42,0.08)] text-[14px] focus-visible:ring-2 focus-visible:ring-forest/25";

const AVATAR_PALETTES = [
  "bg-[#E0E7FF] text-[#3730A3]",
  "bg-[#EDE9FE] text-[#5B21B6]",
  "bg-[#DBEAFE] text-[#1D4ED8]",
  "bg-[#FCE7F3] text-[#9D174D]",
] as const;

function avatarPalette(index: number) {
  return AVATAR_PALETTES[index % AVATAR_PALETTES.length];
}

function DirectoryPersonRow({
  entry,
  index,
  onAdd,
  compact,
}: {
  entry: HiringTeamDirectoryEntry;
  index: number;
  onAdd: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className={cn(
        "flex w-full items-center gap-3 rounded-[12px] border text-left transition-colors",
        "border-[rgba(15,23,42,0.06)] bg-white hover:border-[rgba(15,23,42,0.12)] hover:bg-[#FAFAFA]",
        "dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
        compact ? "px-2.5 py-2" : "px-3 py-2.5",
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-semibold",
          avatarPalette(index),
          compact ? "h-8 w-8 text-[10px]" : "h-9 w-9 text-[11px]",
        )}
        aria-hidden
      >
        {entry.initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-[#18181B] dark:text-text">
          {entry.name}
        </span>
        <span className="block truncate text-[12px] text-[#71717A] dark:text-muted">{entry.subtitle}</span>
      </span>
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--accent-soft-rgb))] text-accent">
        <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
      </span>
    </button>
  );
}

function QuickSuggestionChip({
  entry,
  index,
  onAdd,
}: {
  entry: HiringTeamDirectoryEntry;
  index: number;
  onAdd: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-full border px-2.5 py-1.5 text-left transition-colors",
        "border-[rgba(15,23,42,0.08)] bg-white hover:border-forest/25 hover:bg-forest/[0.04]",
        "dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-forest/[0.08]",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
          avatarPalette(index),
        )}
        aria-hidden
      >
        {entry.initials}
      </span>
      <span className="min-w-0 truncate text-[12px] font-medium text-[#18181B] dark:text-text">{entry.name}</span>
      <Plus className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

export function AddHiringTeamMemberDialog({
  open,
  onOpenChange,
  role,
  job,
  team,
  onAddMember,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: JobHiringTeamRole | null;
  job: HiringJob;
  team: JobHiringTeamGroups;
  onAddMember: (role: JobHiringTeamRole, entry: HiringTeamDirectoryEntry) => boolean;
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setSearch("");
  }, [open, role]);

  const copy = role ? ROLE_COPY[role] : null;

  const suggestions = useMemo(() => {
    if (!role || !open) return [];
    return getHiringTeamQuickSuggestions(role, job, team);
  }, [role, job, team, open]);

  const searchResults = useMemo(() => {
    if (!role || !search.trim()) return [];
    return searchHiringTeamDirectory(role, search, team);
  }, [role, search, team]);

  function handleAdd(entry: HiringTeamDirectoryEntry) {
    if (!role) return;
    const added = onAddMember(role, entry);
    if (!added) {
      toast.message(`${entry.name} is already on this job`);
      return;
    }
    toast.success(`${entry.name} added`);
  }

  if (!role || !copy) return null;

  const isSearching = search.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[240] bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]" />
        <div
          className={cn(
            "fixed inset-0 z-[240] flex items-center justify-center",
            "px-4 pt-[max(20px,env(safe-area-inset-top))]",
            "pb-[max(20px,env(safe-area-inset-bottom))] sm:px-6",
          )}
        >
          <DialogPanel
            className={cn(
              dashboardCanvas,
              "relative flex w-full max-w-[480px] flex-col overflow-hidden",
              "max-h-[min(384px,calc((100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))*0.6))]",
              "rounded-[20px] border border-[rgba(15,23,42,0.06)]",
              "shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)]",
            )}
          >
            <DialogTitle className="sr-only">{copy.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Search and add {copy.title.toLowerCase()} for {job.title}.
            </DialogDescription>

            <DialogClose
              className={cn("absolute right-4 top-4 z-10", dialogCloseButtonLg)}
              aria-label={`Close ${copy.title}`}
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden />
            </DialogClose>

            <header className="border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5 pr-16 dark:border-white/[0.06]">
              <h2 className="text-[16px] font-semibold text-[#18181B] dark:text-text">{copy.title}</h2>
              <p className="mt-1 text-[12px] text-[#71717A] dark:text-muted">{job.title}</p>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className={cn(inputClass, "pl-9")}
                  autoFocus
                />
              </div>

              {!isSearching ? (
                <section className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA] dark:text-muted">
                    {copy.quickLabel}
                  </p>
                  {suggestions.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {suggestions.map((entry, i) => (
                        <QuickSuggestionChip
                          key={entry.id}
                          entry={entry}
                          index={i}
                          onAdd={() => handleAdd(entry)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[12px] text-[#71717A] dark:text-muted">
                      Everyone in this directory is already on the team.
                    </p>
                  )}
                  <p className="mt-4 text-[12px] text-[#A1A1AA] dark:text-muted">{copy.emptySearch}</p>
                </section>
              ) : (
                <section className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA] dark:text-muted">
                    Search results
                  </p>
                  {searchResults.length > 0 ? (
                    <ul className="mt-2.5 space-y-2">
                      {searchResults.map((entry, i) => (
                        <li key={entry.id}>
                          <DirectoryPersonRow entry={entry} index={i} onAdd={() => handleAdd(entry)} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-[13px] text-[#71717A] dark:text-muted">
                      No matches for &ldquo;{search.trim()}&rdquo;. Try another name or role.
                    </p>
                  )}
                </section>
              )}
            </div>

            <footer className="flex justify-end border-t border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
              <Button type="button" variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </footer>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
