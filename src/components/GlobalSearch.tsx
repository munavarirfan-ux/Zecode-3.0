"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, LayoutDashboard, Mic2, Search, Users, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { filterGlobalSearchItems, groupGlobalSearchItems } from "@/lib/globalSearch";
import { useRole } from "@/context/RoleContext";

const GROUP_ICONS: Record<string, LucideIcon> = {
  Navigate: LayoutDashboard,
  Candidates: Users,
  Hiring: Briefcase,
  People: Users,
  Operations: Mic2,
};

export function GlobalSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { selectedRole } = useRole();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const items = useMemo(() => filterGlobalSearchItems(selectedRole, query, 14), [query, selectedRole]);
  const grouped = useMemo(() => groupGlobalSearchItems(items), [items]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setFocused(false);
      setQuery("");
      inputRef.current?.blur();
      router.push(href);
    },
    [router],
  );

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const showSuggestions = open && focused;

  return (
    <div ref={containerRef} className={cn("relative min-w-0 w-full flex-1 max-w-none sm:min-w-[280px] md:min-w-[360px] lg:min-w-[420px]", className)}>
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted/80"
        strokeWidth={1.5}
      />
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setFocused(true);
          setOpen(true);
        }}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
          }
          if (e.key === "Enter" && items[0]) {
            e.preventDefault();
            navigate(items[0].href);
          }
        }}
        placeholder="Search candidates, jobs, interviews…"
        aria-label="Search"
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
        aria-controls="global-search-suggestions"
        className={cn(
          "h-9 w-full border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] py-1.5 pl-8 pr-2 text-sm shadow-none",
          "transition-all duration-[180ms] ease-out placeholder:text-muted/70",
          "hover:border-[rgba(15,23,42,0.08)] hover:bg-[#F1F5F9]",
          "focus-visible:border-forest/30 focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-forest/15",
          "dark:border-white/[0.08] dark:bg-[#1c1c1f] dark:hover:bg-[#252528]",
        )}
      />

      {showSuggestions ? (
        <div
          id="global-search-suggestions"
          role="listbox"
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+6px)] z-[200] overflow-hidden rounded-[12px]",
            "border border-[rgba(15,23,42,0.08)] bg-surface shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)]",
            "dark:border-white/[0.08]",
          )}
        >
          <div className="max-h-[min(320px,45vh)] overflow-y-auto p-1">
            {grouped.length === 0 ? (
              <LineArtEmptyState
                illustration="search"
                message={`No results for "${query}"`}
                size="compact"
                className="py-4"
              />
            ) : (
              grouped.map(([group, groupItems]) => (
                <div key={group} className="mb-1 last:mb-0">
                  <p className="px-1.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted/70">
                    {group}
                  </p>
                  <ul>
                    {groupItems.map((item) => {
                      const Icon = GROUP_ICONS[group] ?? Search;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            role="option"
                            className={cn(
                              "flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] font-medium text-text",
                              "transition-colors duration-[180ms] ease-out hover:bg-[rgba(15,23,42,0.04)]",
                              "focus-visible:bg-[rgba(15,23,42,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/15",
                              "dark:hover:bg-white/[0.06]",
                            )}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => navigate(item.href)}
                            aria-selected={false}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{item.label}</span>
                              {item.subtitle ? (
                                <span className="block truncate text-[11px] font-normal text-muted">
                                  {item.subtitle}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
