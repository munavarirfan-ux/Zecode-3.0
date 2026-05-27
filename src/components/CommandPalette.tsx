"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, LayoutDashboard, Mic2, Search, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { getNavigationForRole } from "@/config/navigationByRole";
import { useRole } from "@/context/RoleContext";

type CommandItem = { id: string; label: string; href: string; group: string; keywords: string };

const STATIC_ITEMS: CommandItem[] = [
  { id: "dash", label: "Dashboard", href: "/dashboard", group: "Navigate", keywords: "home overview" },
  { id: "jobs", label: "Jobs", href: "/hiring/jobs", group: "Navigate", keywords: "hiring roles" },
  { id: "candidates", label: "Candidates", href: "/candidates", group: "Navigate", keywords: "applicants people" },
  { id: "interviews", label: "Interviews", href: "/interviews", group: "Navigate", keywords: "panels schedule" },
];

const GROUP_ICONS: Record<string, typeof Search> = {
  Navigate: LayoutDashboard,
  Hiring: Briefcase,
  People: Users,
  Operations: Mic2,
};

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { selectedRole } = useRole();
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const nav = getNavigationForRole(selectedRole).flatMap((g) =>
      g.items.map((item) => ({
        id: item.href,
        label: item.label,
        href: item.href,
        group: g.label,
        keywords: `${g.label} ${item.label}`.toLowerCase(),
      })),
    );
    const merged = [...STATIC_ITEMS, ...nav.filter((n) => !STATIC_ITEMS.some((s) => s.href === n.href))];
    const q = query.trim().toLowerCase();
    if (!q) return merged.slice(0, 12);
    return merged.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        item.href.toLowerCase().includes(q),
    );
  }, [query, selectedRole]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of items) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return Array.from(map.entries());
  }, [items]);

  const run = useCallback(
    (href: string) => {
      onOpenChange(false);
      setQuery("");
      router.push(href);
    },
    [onOpenChange, router],
  );

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
          <DialogTitle className="sr-only">Command palette</DialogTitle>
          <DialogDescription className="sr-only">Search and jump to pages</DialogDescription>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search candidates, jobs, pages…"
              className="h-10 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              autoFocus
            />
          </div>
        </DialogHeader>
        <div className="max-h-[min(360px,50vh)] overflow-y-auto p-2" role="listbox">
          {grouped.length === 0 ? (
            <LineArtEmptyState illustration="search" message="No results" size="compact" className="py-4" />
          ) : (
            grouped.map(([group, groupItems]) => (
              <div key={group} className="mb-2 last:mb-0">
                <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted/70">{group}</p>
                <ul>
                  {groupItems.map((item) => {
                    const Icon = GROUP_ICONS[group] ?? Search;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[13px] font-medium text-text",
                            "transition-colors duration-[180ms] ease-out hover:bg-[rgba(15,23,42,0.04)]",
                            "focus-visible:bg-[rgba(15,23,42,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/15",
                            "dark:hover:bg-white/[0.06]",
                          )}
                          onClick={() => run(item.href)}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-[rgba(15,23,42,0.06)] px-4 py-2 text-[10px] text-muted dark:border-white/[0.06]">
          <kbd className="rounded border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)] px-1.5 py-0.5 font-medium">↵</kbd> to open ·{" "}
          <kbd className="rounded border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)] px-1.5 py-0.5 font-medium">esc</kbd> to close
        </div>
      </DialogContent>
    </Dialog>
  );
}
