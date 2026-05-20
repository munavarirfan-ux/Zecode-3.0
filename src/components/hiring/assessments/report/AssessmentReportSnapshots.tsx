"use client";

import { Camera, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CameraSnapshot } from "@/lib/hiring/assessments/types";
import { dashboardPanelInteractive } from "@/components/dashboard/dashboardTokens";

export function AssessmentReportSnapshots({ snapshots }: { snapshots: CameraSnapshot[] }) {
  if (snapshots.length === 0) {
    return (
      <section
        className={cn(
          dashboardPanelInteractive,
          "flex flex-col items-center justify-center px-6 py-16 text-center",
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] dark:bg-white/[0.03]">
          <Camera className="h-6 w-6 text-muted/60" strokeWidth={1.5} />
        </div>
        <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
          No camera snapshots
        </h3>
        <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[#71717A] dark:text-muted">
          Proctoring snapshots will appear here when the candidate completes an attempt with camera monitoring enabled.
        </p>
      </section>
    );
  }

  return (
    <section className={cn(dashboardPanelInteractive, "p-4 sm:p-5")}>
      <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
        Primary camera snapshots
      </h3>
      <p className="mt-1 text-[12px] text-[#71717A] dark:text-muted">
        Timestamped captures from the assessment session.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {snapshots.map((snap) => (
          <article
            key={snap.id}
            className={cn(
              "overflow-hidden rounded-[12px] border bg-[#FAFAFB] dark:bg-white/[0.02]",
              snap.hasAnomaly
                ? "border-violet-400/30 shadow-[0_0_0_1px_rgba(139,92,246,0.12)]"
                : "border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]",
            )}
          >
            <div
              className={cn(
                "relative flex aspect-[4/3] items-center justify-center",
                "bg-[linear-gradient(145deg,rgba(var(--accent-rgb),0.06),#F4F4F5)]",
              )}
            >
              <Camera className="h-8 w-8 text-[rgb(var(--accent-rgb)/0.35)]" strokeWidth={1.25} />
              {snap.hasAnomaly ? (
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-800 dark:text-violet-200">
                  <ShieldAlert className="h-3 w-3" />
                  Anomaly
                </span>
              ) : null}
            </div>
            <div className="border-t border-[rgba(15,23,42,0.05)] px-3 py-2 dark:border-white/[0.06]">
              <p className="text-[11px] font-medium text-[#18181B] dark:text-text">{snap.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-[#71717A] dark:text-muted">{snap.capturedAt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
