"use client";

import { cn } from "@/lib/utils";

export type EmptyStateIllustrationId =
  | "jobs"
  | "interviews"
  | "assessments"
  | "candidates"
  | "questionPool"
  | "calendar"
  | "proctoring"
  | "feedback"
  | "network"
  | "permission"
  | "notFound"
  | "welcome";

function FloatCard({
  className,
  children,
  delay = "0s",
}: {
  className?: string;
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <div
      className={cn("absolute rounded-[12px] border border-white/60 bg-white/90 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.2)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.08]", className)}
      style={{ animation: `nux-float 6s ease-in-out infinite`, animationDelay: delay }}
    >
      {children}
    </div>
  );
}

export function EmptyStateIllustration({
  id,
  size = "default",
}: {
  id: EmptyStateIllustrationId;
  size?: "default" | "compact" | "medium";
}) {
  const isCompact = size === "compact";
  const isMedium = size === "medium";

  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden",
        isCompact && "h-[108px] max-w-[220px]",
        isMedium && "h-[120px] max-w-[240px]",
        !isCompact && !isMedium && "h-[168px] max-w-[280px]",
      )}
      aria-hidden
    >
      <div
        className={cn(
          "relative mx-auto h-[168px] w-full max-w-[280px]",
          isCompact && "origin-top scale-[0.62]",
          isMedium && "origin-top scale-[0.72]",
        )}
      >
      <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(ellipse_at_50%_30%,rgba(var(--accent-rgb),0.14),transparent_65%)]" />

      {id === "jobs" && (
        <>
          <FloatCard className="left-[8%] top-[18%] h-14 w-24 px-2 py-1.5" delay="0s">
            <div className="h-1.5 w-10 rounded-full bg-forest/30" />
            <div className="mt-2 h-1 w-16 rounded-full bg-[rgba(15,23,42,0.08)]" />
          </FloatCard>
          <FloatCard className="right-[6%] top-[28%] h-16 w-28 px-2.5 py-2" delay="0.8s">
            <div className="h-2 w-14 rounded-full bg-accent/25" />
            <div className="mt-2 flex gap-1">
              <span className="h-4 w-4 rounded-full bg-emerald-400/30" />
              <span className="h-1.5 flex-1 rounded-full bg-[rgba(15,23,42,0.06)]" />
            </div>
          </FloatCard>
          <FloatCard className="bottom-[12%] left-[22%] h-12 w-32 px-2 py-2" delay="1.4s">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 flex-1 rounded-[6px] bg-forest/[0.08]" />
              ))}
            </div>
          </FloatCard>
        </>
      )}

      {id === "interviews" && (
        <>
          <FloatCard className="left-[10%] top-[12%] h-[128px] w-[196px] p-2" delay="0s">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-red-600/90">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
                Live
              </span>
              <span className="text-[8px] font-medium tabular-nums text-muted">Technical · 24:08</span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1 overflow-hidden rounded-[10px] border border-[rgba(15,23,42,0.06)]">
              <div className="relative flex aspect-[5/4] flex-col items-center justify-center bg-gradient-to-br from-forest/12 via-forest/5 to-accent/10 p-1.5">
                <div
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(15,23,42,0.03) 5px, rgba(15,23,42,0.03) 6px)",
                  }}
                  aria-hidden
                />
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-forest/25 to-accent/20 text-[11px] font-bold text-forest/85 shadow-[0_4px_12px_-4px_rgba(15,61,46,0.25)]">
                  SJ
                </div>
                <span className="relative z-10 mt-1.5 rounded-[4px] bg-black/50 px-1.5 py-0.5 text-[7px] font-medium text-white">
                  Candidate
                </span>
                <span className="absolute bottom-1 left-1 flex gap-0.5" aria-hidden>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="w-0.5 rounded-full bg-accent/50"
                      style={{ height: `${6 + (i % 3) * 3}px` }}
                    />
                  ))}
                </span>
              </div>
              <div className="relative flex aspect-[5/4] flex-col items-center justify-center bg-gradient-to-br from-accent/10 via-forest/5 to-forest/12 p-1.5">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(15,23,42,0.03) 5px, rgba(15,23,42,0.03) 6px)",
                  }}
                  aria-hidden
                />
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-forest/25 text-[11px] font-bold text-forest/85 shadow-[0_4px_12px_-4px_rgba(15,61,46,0.2)]">
                  MC
                </div>
                <span className="relative z-10 mt-1.5 rounded-[4px] bg-black/50 px-1.5 py-0.5 text-[7px] font-medium text-white">
                  Interviewer
                </span>
                <span className="absolute bottom-1 right-1 h-3 w-3 rounded-[3px] border border-white/60 bg-forest/20" aria-hidden />
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-[rgba(15,23,42,0.06)]" aria-hidden />
              <span className="h-5 w-5 rounded-full bg-[rgba(15,23,42,0.06)]" aria-hidden />
              <span className="h-5 w-8 rounded-full bg-accent/15" aria-hidden />
              <span className="h-5 w-5 rounded-full bg-red-500/15" aria-hidden />
            </div>
          </FloatCard>
          <FloatCard className="right-[6%] top-[8%] h-10 w-10 p-1.5" delay="0.9s">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-forest/10">
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-forest/60" aria-hidden>
                <path
                  fill="currentColor"
                  d="M3 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5.5l2.5 1.67V5.33L11 3.67V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3.5v1H5a2 2 0 0 1-2-2V4Z"
                />
              </svg>
            </div>
          </FloatCard>
          <FloatCard className="bottom-[10%] left-[8%] h-9 w-[72px] px-2 py-1.5" delay="1.3s">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" aria-hidden />
              <span className="text-[8px] font-medium text-forest/70">Connected</span>
            </div>
          </FloatCard>
        </>
      )}

      {id === "assessments" && (
        <>
          <FloatCard className="left-[10%] top-[16%] h-[72px] w-[120px] p-2 font-mono text-[9px] text-forest/70" delay="0s">
            <span className="text-accent/80">{"const"}</span> solve = () =&gt; {"{}"}
            <div className="mt-1 h-1 w-full rounded bg-[rgba(15,23,42,0.05)]" />
          </FloatCard>
          <FloatCard className="right-[8%] bottom-[18%] h-14 w-24 px-2 py-1.5" delay="1.2s">
            <div className="text-[10px] font-semibold text-forest">92%</div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)]">
              <div className="h-full w-[72%] rounded-full bg-accent/50" />
            </div>
          </FloatCard>
        </>
      )}

      {id === "candidates" && (
        <>
          <FloatCard className="left-[4%] top-[10%] h-[92px] w-[118px] px-2.5 py-2" delay="0s">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest/20 to-accent/25 text-[10px] font-bold text-forest/80">
                SJ
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="h-2 w-14 rounded-full bg-[rgba(15,23,42,0.12)]" />
                <div className="h-1.5 w-10 rounded-full bg-[rgba(15,23,42,0.06)]" />
              </div>
            </div>
            <span className="mt-2 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[8px] font-semibold text-accent">
              Interview
            </span>
          </FloatCard>
          <FloatCard className="right-[4%] top-[18%] h-[92px] w-[118px] px-2.5 py-2" delay="0.7s">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/15 to-forest/25 text-[10px] font-bold text-forest/80">
                OG
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="h-2 w-12 rounded-full bg-[rgba(15,23,42,0.12)]" />
                <div className="h-1.5 w-16 rounded-full bg-[rgba(15,23,42,0.06)]" />
              </div>
            </div>
            <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-semibold text-emerald-700/80">
              Screening
            </span>
          </FloatCard>
          <FloatCard className="bottom-[8%] left-[18%] h-[100px] w-[148px] px-2.5 py-2" delay="1.2s">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-muted">Directory</p>
            <div className="mt-1.5 space-y-1.5">
              {[
                { initials: "MH", stage: "Offer" },
                { initials: "JF", stage: "Applied" },
              ].map((row) => (
                <div key={row.initials} className="flex items-center gap-2 rounded-[8px] bg-[rgba(15,23,42,0.03)] px-1.5 py-1">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest/10 text-[8px] font-bold text-forest/70">
                    {row.initials}
                  </div>
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-[rgba(15,23,42,0.08)]" />
                  <span className="shrink-0 text-[7px] font-medium text-muted">{row.stage}</span>
                </div>
              ))}
            </div>
          </FloatCard>
        </>
      )}

      {id === "calendar" && (
        <>
          <FloatCard className="left-[8%] top-[8%] h-[132px] w-[172px] p-2" delay="0s">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[9px] font-semibold tracking-tight text-forest">May 2026</span>
              <div className="flex gap-0.5" aria-hidden>
                <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[rgba(15,23,42,0.05)] text-[8px] text-muted">
                  ‹
                </span>
                <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[rgba(15,23,42,0.05)] text-[8px] text-muted">
                  ›
                </span>
              </div>
            </div>
            <div className="mt-1 grid grid-cols-7 gap-px text-center text-[6px] font-semibold uppercase text-muted">
              {["M", "T", "W", "T", "F", "S", "S"].map((label, i) => (
                <span key={`${label}-${i}`}>{label}</span>
              ))}
            </div>
            <div className="mt-0.5 grid grid-cols-7 gap-px">
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const isToday = day === 20;
                const isOpen = day === 11 || day === 18;
                const isBooked = day === 14 || day === 21;
                return (
                  <div
                    key={day}
                    className={cn(
                      "flex h-[15px] items-center justify-center rounded-[3px] text-[7px] font-medium tabular-nums",
                      isToday && "bg-accent/20 font-bold text-accent ring-1 ring-accent/30",
                      isOpen && !isToday && "bg-[rgba(29,158,117,0.12)] text-forest/80",
                      isBooked && !isToday && "bg-[rgba(55,138,221,0.12)] text-[#378ADD]",
                      !isToday && !isOpen && !isBooked && "text-muted/70",
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1 px-0.5">
              <span className="inline-flex items-center gap-0.5 text-[7px] text-muted">
                <span className="h-1.5 w-2 rounded-[2px] bg-[rgba(29,158,117,0.35)]" aria-hidden />
                Open
              </span>
              <span className="inline-flex items-center gap-0.5 text-[7px] text-muted">
                <span className="h-1.5 w-2 rounded-[2px] bg-[#378ADD]/40" aria-hidden />
                Booked
              </span>
            </div>
          </FloatCard>
          <FloatCard className="right-[4%] top-[14%] h-[88px] w-[88px] p-1.5" delay="0.8s">
            <p className="text-[7px] font-semibold uppercase tracking-wide text-muted">This week</p>
            <div className="mt-1 flex gap-0.5">
              {[
                { label: "T", slot: true, booked: false },
                { label: "W", slot: true, booked: true },
                { label: "T", slot: false, booked: false },
                { label: "F", slot: true, booked: false },
              ].map((col, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-1 flex-col items-center rounded-[5px] border px-0.5 py-1",
                    col.booked
                      ? "border-[#378ADD]/20 bg-[rgba(55,138,221,0.08)]"
                      : col.slot
                        ? "border-[rgba(29,158,117,0.2)] bg-[rgba(29,158,117,0.06)]"
                        : "border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.02)]",
                  )}
                >
                  <span className="text-[6px] font-semibold text-muted">{col.label}</span>
                  {col.slot ? (
                    <span
                      className={cn(
                        "mt-1 h-4 w-full rounded-[3px]",
                        col.booked ? "bg-[#378ADD]/25" : "bg-accent/15",
                      )}
                      aria-hidden
                    />
                  ) : (
                    <span className="mt-1 h-4 w-full" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </FloatCard>
          <FloatCard className="bottom-[8%] left-[10%] h-9 w-[84px] px-2 py-1.5" delay="1.2s">
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-medium text-forest/75">+ Add slot</span>
            </div>
          </FloatCard>
        </>
      )}

      {id === "proctoring" && (
        <>
          <FloatCard className="left-[6%] top-[6%] h-[136px] w-[188px] p-2" delay="0s">
            <div className="flex items-center justify-between gap-1 px-0.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-red-600/90">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
                Live proctoring
              </span>
              <span className="text-[8px] font-medium tabular-nums text-muted">18 active</span>
            </div>
            <div className="mt-1.5 grid grid-cols-[1fr_52px] gap-1 overflow-hidden rounded-[8px] border border-[rgba(15,23,42,0.06)]">
              <div className="relative bg-[#1a1f2e] p-1.5">
                <p className="text-[7px] font-medium text-white/50">Candidate screen</p>
                <div className="mt-1 space-y-0.5 font-mono text-[6px] leading-tight text-emerald-400/80">
                  <p>
                    <span className="text-violet-400/90">function</span> solve() {"{"}
                  </p>
                  <p className="pl-2 text-white/40">// assessment in progress</p>
                  <p className="pl-2">
                    return <span className="text-amber-400/80">result</span>;
                  </p>
                  <p>{"}"}</p>
                </div>
                <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/50 px-1 py-0.5 text-[6px] text-white/80">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" aria-hidden />
                  Focused
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-[rgba(15,23,42,0.03)] p-1">
                <div className="flex flex-1 flex-col items-center justify-center rounded-[6px] bg-gradient-to-br from-forest/15 to-accent/10 p-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest/15 text-[8px] font-bold text-forest/80">
                    PR
                  </div>
                  <span className="mt-0.5 text-[6px] font-medium text-muted">Proctor</span>
                </div>
                <div className="flex h-6 items-center justify-center rounded-[4px] bg-forest/10" aria-hidden>
                  <svg viewBox="0 0 16 16" className="h-3 w-3 text-forest/70">
                    <path
                      fill="currentColor"
                      d="M8 2.5a4.5 4.5 0 0 0-2.2 8.4v1.6H8v-1.6A4.5 4.5 0 1 0 8 2.5Zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1 px-0.5">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[7px] font-medium text-emerald-700/90">
                <span aria-hidden>✓</span> ID verified
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[7px] font-medium text-amber-800/80">
                <span className="h-1 w-1 rounded-full bg-amber-500" aria-hidden />
                Monitoring
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[rgba(15,23,42,0.05)] px-1.5 py-0.5 text-[7px] font-medium text-muted">
                Tab lock on
              </span>
            </div>
          </FloatCard>
          <FloatCard className="right-[4%] top-[12%] h-[72px] w-[80px] p-1.5" delay="0.75s">
            <p className="text-[7px] font-semibold uppercase tracking-wide text-muted">Alerts</p>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-1 rounded-[5px] bg-emerald-500/8 px-1 py-0.5 text-[7px] text-emerald-800/90">
                <span className="h-1 w-1 rounded-full bg-emerald-500" aria-hidden />2 cleared
              </div>
              <div className="flex items-center gap-1 rounded-[5px] bg-amber-500/10 px-1 py-0.5 text-[7px] text-amber-800/90">
                <span className="h-1 w-1 rounded-full bg-amber-500" aria-hidden />1 review
              </div>
            </div>
          </FloatCard>
          <FloatCard className="bottom-[6%] left-[8%] h-10 w-[96px] px-2 py-1.5" delay="1.2s">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/40 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500/80" />
              </span>
              <span className="text-[8px] font-medium text-forest/75">Recording session</span>
            </div>
          </FloatCard>
        </>
      )}

      {id === "questionPool" && (
        <>
          <FloatCard className="left-[8%] top-[20%] h-16 w-28 px-2 py-2" delay="0.3s">
            <div className="text-[10px] font-semibold">MCQ</div>
            <div className="mt-1 space-y-1">
              <div className="h-1 w-full rounded bg-[rgba(15,23,42,0.06)]" />
              <div className="h-1 w-4/5 rounded bg-[rgba(15,23,42,0.04)]" />
            </div>
          </FloatCard>
          <FloatCard className="right-[10%] top-[30%] h-14 w-24 px-2 py-1.5 font-mono text-[8px]" delay="1.1s">
            SELECT * FROM …
          </FloatCard>
        </>
      )}

      {id === "feedback" && (
        <>
          <FloatCard className="left-[16%] top-[18%] h-16 w-20 rotate-[-4deg] px-2 py-2" delay="0s">
            <div className="text-[9px] font-medium text-amber-800/80">Strengths</div>
            <div className="mt-1 h-1 w-full rounded bg-amber-200/50" />
          </FloatCard>
          <FloatCard className="right-[12%] top-[26%] h-14 w-24 rotate-[3deg] px-2 py-2" delay="0.9s">
            <div className="text-[9px] font-medium text-forest/80">Recommend</div>
            <div className="mt-1 h-4 w-4 rounded-full bg-emerald-400/30" />
          </FloatCard>
        </>
      )}

      {(id === "network" || id === "permission" || id === "notFound") && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-[22px] border border-[rgba(15,23,42,0.06)] bg-white/80 shadow-lg dark:bg-white/[0.06]",
              id === "network" && "text-muted",
              id === "permission" && "text-amber-600/80",
              id === "notFound" && "text-accent/70",
            )}
          >
            <span className="text-2xl font-light">{id === "network" ? "◎" : id === "permission" ? "◇" : "↗"}</span>
          </div>
        </div>
      )}

      {id === "welcome" && (
        <>
          <FloatCard className="left-[10%] top-[18%] h-[88px] w-[104px] px-2.5 py-2" delay="0s">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-muted">Jobs</p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-forest/20 to-accent/20" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="h-2 w-full rounded-full bg-[rgba(15,23,42,0.1)]" />
                <div className="h-1.5 w-2/3 rounded-full bg-[rgba(15,23,42,0.06)]" />
              </div>
            </div>
          </FloatCard>
          <FloatCard className="right-[8%] top-[14%] h-[80px] w-[96px] px-2 py-2" delay="0.6s">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-muted">Pipeline</p>
            <div className="mt-2 flex gap-1">
              {["Applied", "Interview", "Offer"].map((stage, i) => (
                <span
                  key={stage}
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[6px] font-semibold",
                    i === 1 ? "bg-accent/15 text-accent" : "bg-[rgba(15,23,42,0.05)] text-muted",
                  )}
                >
                  {stage}
                </span>
              ))}
            </div>
          </FloatCard>
          <FloatCard className="bottom-[12%] left-[22%] h-[72px] w-[128px] px-2.5 py-2" delay="1.1s">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold text-forest">Ze[hub]</span>
              <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[7px] font-semibold text-accent">
                Overview
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 rounded-[6px] bg-gradient-to-t from-accent/15 to-forest/5" />
              ))}
            </div>
          </FloatCard>
        </>
      )}
      </div>
    </div>
  );
}
