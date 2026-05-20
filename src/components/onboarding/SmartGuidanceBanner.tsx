"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/RoleContext";
import { getWorkspaceGuidance } from "@/lib/onboarding/smartGuidance";
import { cn } from "@/lib/utils";

export function SmartGuidanceBanner({ className }: { className?: string }) {
  const { selectedRole } = useRole();
  const [dismissed, setDismissed] = useState<string | null>(null);
  const hint = getWorkspaceGuidance(selectedRole);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(sessionStorage.getItem("zecode-guidance-dismissed"));
  }, []);

  if (!hint || dismissed === hint.id) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 rounded-[14px] border border-accent/15 bg-gradient-to-r from-accent/[0.06] to-transparent px-4 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-text">{hint.title}</p>
          <p className="mt-0.5 text-[12px] text-text-secondary/80">{hint.body}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {hint.ctaLabel && hint.ctaHref ? (
          <Button asChild size="sm" className="h-8 rounded-[10px] bg-accent text-white hover:bg-accent-hover">
            <Link href={hint.ctaHref}>{hint.ctaLabel}</Link>
          </Button>
        ) : null}
        <button
          type="button"
          className="rounded-full p-1 text-muted hover:bg-black/5 hover:text-text"
          aria-label="Dismiss"
          onClick={() => {
            sessionStorage.setItem("zecode-guidance-dismissed", hint.id);
            setDismissed(hint.id);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
