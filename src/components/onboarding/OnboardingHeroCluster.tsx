"use client";

import { cn } from "@/lib/utils";

function ClusterCard({
  className,
  delay,
  children,
}: {
  className?: string;
  delay?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-[14px] border border-white/70 bg-white/92 shadow-[0_16px_48px_-20px_rgba(15,23,42,0.25)] backdrop-blur-md dark:border-white/12 dark:bg-white/[0.1]",
        className,
      )}
      style={{
        animation: "nux-float 6s ease-in-out infinite",
        animationDelay: delay ?? "0s",
      }}
    >
      {children}
    </div>
  );
}

function Connector({ d }: { d: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-[rgb(var(--accent-rgb)/0.2)]"
      aria-hidden
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
    </svg>
  );
}

/** Premium operational visual cluster for the new-user dashboard hero. */
export function OnboardingHeroCluster({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        compact
          ? "h-[112px] max-w-[300px] sm:h-[132px] sm:max-w-[340px] max-h-[820px]:h-[96px]"
          : "h-[min(280px,38vw)] max-w-[520px] sm:h-[300px]",
      )}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(ellipse_at_50%_35%,rgba(var(--accent-rgb),0.16),rgba(192,132,252,0.06)_45%,transparent_72%)]" />

      <Connector d="M 140 150 Q 200 120 260 95" />
      <Connector d="M 260 200 Q 220 230 180 250" />
      <Connector d="M 180 250 Q 130 210 95 170" />

      <ClusterCard className="left-[6%] top-[14%] z-[2] w-[132px] px-3 py-2.5" delay="0s">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">Pipeline</p>
        <p className="mt-0.5 text-[11px] font-semibold text-text">Senior Designer</p>
        <div className="mt-2 flex gap-1">
          {["Screen", "Interview", "Offer"].map((s, i) => (
            <span
              key={s}
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[7px] font-medium",
                i === 1
                  ? "bg-accent/15 text-accent"
                  : "bg-black/[0.04] text-muted dark:bg-white/[0.06]",
              )}
            >
              {s}
            </span>
          ))}
        </div>
      </ClusterCard>

      <ClusterCard className="right-[4%] top-[10%] z-[3] w-[118px] px-2.5 py-2" delay="0.9s">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">Assessment</p>
        <div className="mt-1.5 h-8 rounded-[8px] bg-gradient-to-br from-violet-400/20 to-accent/25" />
        <div className="mt-1.5 flex justify-between text-[8px] text-muted">
          <span>92% match</span>
          <span className="font-semibold text-accent">Live</span>
        </div>
      </ClusterCard>

      <ClusterCard className="bottom-[18%] left-[14%] z-[2] w-[124px] px-2.5 py-2" delay="1.5s">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">Candidate</p>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-300/40 to-accent/30" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="h-1.5 w-full rounded-full bg-black/[0.08] dark:bg-white/10" />
            <div className="h-1 w-2/3 rounded-full bg-black/[0.05] dark:bg-white/[0.06]" />
          </div>
        </div>
      </ClusterCard>

      <ClusterCard className="bottom-[12%] right-[8%] z-[4] w-[140px] px-2.5 py-2" delay="0.4s">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">Interview</p>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-text">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] bg-accent/15 text-[9px] text-accent">
            10
          </span>
          <span>Panel · Thu 2:00 PM</span>
        </div>
        <div className="mt-2 flex -space-x-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br from-violet-300/50 to-accent/30 dark:border-[#1a1a1e]"
            />
          ))}
        </div>
      </ClusterCard>

      <div
        className="absolute left-1/2 top-1/2 z-[1] h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border border-white/60 bg-white/80 shadow-[0_20px_60px_-24px_rgba(var(--accent-rgb),0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]"
        style={{ animation: "nux-float 7s ease-in-out infinite", animationDelay: "0.2s" }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
          <span className="text-[10px] font-bold tracking-tight text-accent">ze[hire]</span>
          <span className="h-1 w-10 rounded-full bg-accent/30" />
          <span className="text-[8px] font-medium text-muted">Active</span>
        </div>
      </div>
    </div>
  );
}
