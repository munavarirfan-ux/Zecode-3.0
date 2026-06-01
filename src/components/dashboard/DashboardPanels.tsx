"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiringHeroDecor } from "@/components/hiring/HiringHeroDecor";
import {
  hiringHeroReportStripShell,
  hiringHeroStripMetaLine,
  hiringHeroStripRow,
  hiringHeroStripTitle,
} from "@/components/hiring/hiringTokens";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  dialogCloseButtonLg,
  dialogCloseButtonPositionClass,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  assessmentQualification,
  dashboardGreeting,
  interviewerProductivityRows,
  malpracticeSignals,
  scheduleCalendarDays,
  topTechnologies,
  upcomingScheduleRows,
  evaluatorAvailability,
  globalInterviewFeedRows,
  interviewerOpsRows,
  feedbackDueItems as feedbackDueItemsSeed,
  type FeedbackDueStatus,
  type GlobalInterviewFeedRow,
  type GlobalInterviewStatus,
  type InterviewerOpsRow,
  type InterviewerWorkloadStatus,
} from "@/features/dashboard/data/dashboard.mock";
import type { ScheduleRow } from "@/features/dashboard/data/dashboard.mock";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import { useChartAccentColors } from "@/lib/useChartAccentColors";
import type {
  AssessmentsPanelMode,
  FeedbackDuePanelMode,
  InterviewsPanelMode,
  SchedulesPanelMode,
} from "@/config/dashboardWidgetsByRole";
import { InterviewerIntelligenceWorkspace } from "@/components/dashboard/InterviewerIntelligencePanels";
import { resolveLoggedInInterviewerName } from "@/lib/dashboard/interviewerContext";
import { ROUTES } from "@/config/routes";
import {
  dashboardBentoCell,
  dashboardBentoGrid,
  dashboardBentoSpan,
  dashboardPanel,
  dashboardPanelInteractive,
  dashboardRowSurface,
  dashboardSectionSub,
  dashboardSectionTitle,
} from "./dashboardTokens";
import {
  Activity,
  Bell,
  CalendarCheck,
  ChevronRight,
  CircleAlert,
  Clock,
  Dot,
  MessageSquare,
  Sparkles,
  Users2,
  X,
} from "lucide-react";

const rowSurface = dashboardRowSurface;
const insightCard = dashboardPanel;

// ---------------------------
// Feedback due in-memory store
// (shared between Feedback Due tab + interviewer report popup)
// ---------------------------
type FeedbackDueItem = (typeof feedbackDueItemsSeed)[number];

let feedbackDueStore: FeedbackDueItem[] = feedbackDueItemsSeed;
const feedbackDueListeners = new Set<() => void>();

function emitFeedbackDue() {
  feedbackDueListeners.forEach((l) => l());
}

function setFeedbackDueStore(next: FeedbackDueItem[]) {
  feedbackDueStore = next;
  emitFeedbackDue();
}

function feedbackNowLabel() {
  return "Reminder sent just now";
}

function requestFeedbackForItem(id: string) {
  setFeedbackDueStore(
    feedbackDueStore.map((i) =>
      i.id === id
        ? {
            ...i,
            status: "Request Sent",
            requestSentNote: feedbackNowLabel(),
          }
        : i,
    ),
  );
}

function remindFeedbackForItem(id: string) {
  setFeedbackDueStore(
    feedbackDueStore.map((i) =>
      i.id === id
        ? {
            ...i,
            status: i.status === "Completed" ? "Completed" : "Request Sent",
            requestSentNote: feedbackNowLabel(),
          }
        : i,
    ),
  );
}

function useFeedbackDueItems(): FeedbackDueItem[] {
  return useSyncExternalStore(
    (cb) => {
      feedbackDueListeners.add(cb);
      return () => feedbackDueListeners.delete(cb);
    },
    () => feedbackDueStore,
    () => feedbackDueStore,
  );
}

function PanelShell({
  title,
  subtitle,
  children,
  className,
  bodyClassName,
  density = "default",
  elevated = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  density?: "default" | "compact" | "dense";
  elevated?: boolean;
}) {
  const shell = elevated ? dashboardPanelInteractive : dashboardPanel;
  const pad = density === "dense" ? "p-2.5" : density === "compact" ? "p-3" : "p-3.5 sm:p-4";
  const titleClass =
    density === "dense"
      ? "text-[13px] font-medium tracking-[-0.02em] text-[#18181B] dark:text-text"
      : dashboardSectionTitle;

  return (
    <section className={cn("flex h-full min-w-0 flex-col", shell, pad, className)}>
      <header className={cn("shrink-0 px-0.5", density === "dense" ? "mb-2" : "mb-2.5")}>
        <h3 className={titleClass}>{title}</h3>
        {subtitle ? <p className={dashboardSectionSub}>{subtitle}</p> : null}
      </header>
      <div className={cn("min-h-0", bodyClassName)}>{children}</div>
    </section>
  );
}

function InterviewerProductivityPanel() {
  return (
    <PanelShell title="Interviewer workload" subtitle="Ranked load · completion" density="dense">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[200px] text-[13px]">
          <thead>
            <tr className="text-left text-[10px] font-medium uppercase tracking-wider text-muted/70">
              <th className="pb-2 pr-2 font-medium">Interviewer</th>
              <th className="pb-2 text-right font-medium">Done</th>
              <th className="pb-2 text-right font-medium">Hrs</th>
            </tr>
          </thead>
          <tbody>
            {interviewerProductivityRows.map((r) => (
              <tr key={r.name} className="border-t border-[rgba(15,23,42,0.04)] transition-colors hover:bg-[rgba(15,23,42,0.02)] dark:border-white/[0.04]">
                <td className="py-2 pr-2">
                  <span className="font-medium text-text">{r.name}</span>
                </td>
                <td className="py-2 text-right font-medium tabular-nums text-text">{r.conducted}</td>
                <td className="py-2 text-right tabular-nums text-muted/80">{r.totalHours}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}

const CHART_TOOLTIP = {
  cursor: { fill: "rgba(15, 61, 46, 0.028)" },
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #E6E6E2",
    fontSize: 12,
    padding: "11px 14px",
    boxShadow: "0 10px 36px rgb(15 23 42 / 0.07)",
    backgroundColor: "#FFFFFF",
  },
  labelStyle: { color: "#71717A", fontWeight: 600, fontSize: 11, marginBottom: 6 },
  itemStyle: { color: "#18181B", fontWeight: 600, fontSize: 13 },
};

const CHART_GRID = { stroke: "#EBEBE6", strokeOpacity: 0.38, strokeDasharray: "3 6" as const };

function statusChip(status: ScheduleRow["status"]) {
  switch (status) {
    case "Confirmed":
      return "bg-[#DCFCE7] text-[#166534]";
    case "Hold":
      return "bg-[#FEF3C7] text-[#A16207]";
    case "Rescheduled":
      return "bg-muted text-text-secondary";
    default:
      return "bg-secondary-fill text-text-secondary";
  }
}

function candidateInitials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function interviewerInitials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "??";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function AssignedInterviewSchedule({
  title = "Interview queue",
  subtitle = "Upcoming panels · timezone-aware",
  joinVariant = "allPrimary",
  showFooter = true,
  useCandidateAvatar = false,
  showStatusChip = true,
  limitRows,
  density = "default",
  elevated = false,
}: {
  title?: string;
  subtitle?: string;
  joinVariant?: "allPrimary" | "firstPrimary";
  showFooter?: boolean;
  useCandidateAvatar?: boolean;
  showStatusChip?: boolean;
  limitRows?: number;
  density?: "default" | "compact" | "dense";
  elevated?: boolean;
}) {
  const rows = limitRows ? upcomingScheduleRows.slice(0, limitRows) : upcomingScheduleRows;

  return (
    <PanelShell title={title} subtitle={subtitle} bodyClassName="flex flex-col gap-2" density={density} elevated={elevated}>
        {rows.map((row, index) => {
          const avatar = useCandidateAvatar ? candidateInitials(row.candidate) : row.interviewerInitials;
          const primaryJoin = joinVariant === "allPrimary" || (joinVariant === "firstPrimary" && index === 0);
          return (
            <div
              key={row.candidate}
              className={cn("flex cursor-pointer gap-2.5", rowSurface)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F4F4F5] to-white text-[11px] font-semibold text-[#18181B] ring-1 ring-[rgba(15,23,42,0.06)] dark:from-white/10 dark:to-white/5 dark:text-text">
                {avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold tabular-nums text-text">
                    <span>{row.timeLabel}</span>
                    <span className="text-text-secondary"> {row.timezone}</span>
                  </p>
                  {showStatusChip ? (
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", statusChip(row.status))}>
                      {row.status}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
                  <span className="text-text-secondary">{row.stage}</span>
                  <span className="text-muted"> · </span>
                  <span>{row.durationMin} min</span>
                </p>
                <p className="mt-2 truncate font-medium text-text">{row.candidate}</p>
                <p className="mt-0.5 truncate text-[11px] text-text-secondary">{row.role}</p>
                <p className="mt-1 text-[11px] text-text-secondary">
                  <span className="font-medium text-text-secondary/85">{row.interviewer}</span>
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 shrink-0 self-start rounded-[10px] px-3 text-[11px] font-medium",
                  primaryJoin
                    ? "border-transparent bg-accent text-white hover:bg-accent-hover"
                    : "border-border bg-surface text-text hover:bg-muted/25",
                )}
              >
                {row.join}
              </Button>
            </div>
          );
        })}
        {showFooter ? (
          <div className="pt-1">
            <Link href="/interviews" className="block">
              <Button variant="outline" className="h-9 w-full rounded-[12px] border-[rgba(15,23,42,0.06)] text-xs font-medium text-text hover:bg-[rgba(15,23,42,0.03)]">
                Open interviews
              </Button>
            </Link>
          </div>
        ) : null}
    </PanelShell>
  );
}

function BentoWorkspace({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(dashboardBentoGrid, className)} role="region" aria-label={label}>
      {children}
    </div>
  );
}

const bentoCard = cn(insightCard, "flex h-full min-h-0 flex-col");

function TechnologyBentoTile({ name, pct, assessments, barMuted }: (typeof topTechnologies)[number]) {
  return (
    <Card className={cn(dashboardBentoCell, dashboardBentoSpan.quarter, bentoCard)}>
      <CardContent className="flex flex-1 flex-col justify-between p-4 pt-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-text">{name}</p>
            <span className="text-sm font-medium tabular-nums text-forest">{pct}%</span>
          </div>
          <p className="mt-1 text-xs text-text-secondary">{assessments} assessments</p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted/40">
          <div
            className={cn("h-full rounded-full", barMuted ? "bg-[#A1A1AA]" : "bg-accent-deep")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatBentoTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Card className={cn(dashboardBentoCell, dashboardBentoSpan.third, bentoCard)}>
      <CardContent className="flex flex-1 flex-col justify-center p-4 pt-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 text-2xl font-medium tabular-nums text-text">{value}</p>
        <p className="mt-1 text-xs text-text-secondary">{note}</p>
      </CardContent>
    </Card>
  );
}

function globalStatusChip(status: GlobalInterviewStatus) {
  switch (status) {
    case "Live now":
      return "border-[rgb(var(--accent-rgb)/0.26)] bg-[rgb(var(--accent-rgb)/0.10)] text-[rgb(var(--accent-deep-rgb))] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[rgb(var(--accent-rgb))]";
    case "Starting soon":
      return "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#FDBA74]";
    case "Waiting room":
      return "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#93C5FD]";
    case "Feedback pending":
      return "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#FDBA74]";
    default:
      return "border-[rgba(15,23,42,0.08)] bg-white text-text-secondary dark:border-white/[0.08] dark:bg-white/[0.03]";
  }
}

function GlobalInterviewPanelCard({
  rows,
  canMonitor,
}: {
  rows: GlobalInterviewFeedRow[];
  canMonitor: boolean;
}) {
  const router = useRouter();
  return (
    <PanelShell
      title="Global interview panel"
      subtitle="Live + upcoming across the organization"
      density="compact"
      elevated
      className="group h-[560px]"
      bodyClassName="relative flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-surface/60" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-surface/60" aria-hidden />

      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1 scroll-smooth [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(15,23,42,0.18)] hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(15,23,42,0.26)] dark:[&::-webkit-scrollbar-thumb]:bg-white/[0.16] dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/[0.22]">
        {rows.map((r) => {
          const live = r.status === "Live now";
          const soon = r.status === "Starting soon";
          return (
            <div
              key={r.id}
              className={cn(
                "group relative overflow-hidden rounded-[16px] border p-3",
                "bg-white/65 backdrop-blur-sm dark:bg-white/[0.03]",
                "border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]",
                "transition-[transform,border-color,box-shadow] duration-200 ease-out",
                "hover:-translate-y-px hover:border-[rgb(var(--accent-rgb)/0.18)] hover:shadow-[0_12px_30px_-22px_rgb(var(--accent-rgb)/0.35)]",
              )}
            >
              {live ? (
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[rgb(var(--accent-rgb)/0.18)] blur-2xl"
                  aria-hidden
                />
              ) : null}

              <div className="relative flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold tracking-[-0.02em] tabular-nums text-text">
                    {r.scheduledTime}
                  </p>

                  <div className="mt-2.5 flex items-start gap-2">
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px]",
                        "bg-gradient-to-br from-white to-[#F8FAFC] ring-1 ring-[rgba(15,23,42,0.06)]",
                        "text-[11px] font-semibold text-text dark:from-white/[0.08] dark:to-white/[0.03] dark:ring-white/[0.08]",
                      )}
                      aria-hidden
                    >
                      {candidateInitials(r.candidateName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text">
                        {r.candidateName}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                        {r.jobRole} · <span className="font-medium text-text-secondary/85">{r.stage}</span>
                      </p>
                      <p className="mt-1 text-[11px] text-text-secondary">
                        <span className="font-medium text-text-secondary/85">{r.panelMembers.join(" • ")}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                      globalStatusChip(r.status),
                    )}
                  >
                    {live ? (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--accent-rgb))] opacity-35" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[rgb(var(--accent-rgb))]" />
                      </span>
                    ) : soon ? (
                      <Sparkles className="h-3.5 w-3.5 opacity-80" strokeWidth={2} aria-hidden />
                    ) : (
                      <Dot className="h-4 w-4 opacity-70" strokeWidth={3} aria-hidden />
                    )}
                    {r.status}
                  </span>

                  {canMonitor && (live || soon) ? (
                    <Button
                      size="sm"
                      className="h-8 rounded-[12px] bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent-hover"
                      onClick={() =>
                        router.push(ROUTES.meetRoom(r.roomId))
                      }
                    >
                      Join
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="relative mt-2 flex items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 opacity-70" strokeWidth={1.8} aria-hidden />
                  {r.meetingStatus}
                </span>
                <span className="text-text-secondary/70 normal-case tracking-normal">Interview ops</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA removed — panel behaves like a live feed */}
    </PanelShell>
  );
}

// (deprecated) old metric-only global queue removed in favor of GlobalInterviewPanelCard

function YourUpcomingInterviewsCard() {
  const router = useRouter();
  const next = upcomingScheduleRows[0];
  const list = upcomingScheduleRows.slice(0, 3);

  return (
    <PanelShell
      title="Your upcoming interviews"
      subtitle="Next panels · join from here"
      density="compact"
      elevated
      className="group h-[560px]"
      bodyClassName="relative flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-surface/60" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-surface/60" aria-hidden />

      {next ? (
        <div className="rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-gradient-to-br from-white to-[#F8FAFC] p-3 dark:border-white/[0.06] dark:from-white/[0.05] dark:to-white/[0.02]">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold tracking-[-0.02em] tabular-nums text-text">
                {next.timeLabel} <span className="text-text-secondary">{next.timezone}</span>
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                {next.stage}
                <span className="text-muted"> · </span>
                {next.durationMin}m
              </p>
              <p className="mt-2 truncate text-[13px] font-semibold tracking-[-0.02em] text-text">{next.candidate}</p>
              <p className="mt-0.5 truncate text-[11px] text-text-secondary">{next.role}</p>
              <p className="mt-1 text-[11px] text-text-secondary">
                <span className="font-medium text-text-secondary/85">{next.interviewer}</span>
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 rounded-[12px] bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent-hover"
              onClick={() => router.push(ROUTES.meetRoom(`zm-dashboard-${next.candidate.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 18)}`))}
            >
              Join
            </Button>
          </div>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1 scroll-smooth [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(15,23,42,0.18)] hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(15,23,42,0.26)] dark:[&::-webkit-scrollbar-thumb]:bg-white/[0.16] dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/[0.22]">
        {list.map((r) => (
          <div
            key={`${r.candidate}-${r.timeLabel}`}
            className="flex items-start justify-between gap-2 rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white/60 px-3 py-2.5 text-[12px] dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <div className="min-w-0 flex-1">
              <p className="tabular-nums text-[12px] font-semibold text-text">
                {r.timeLabel} <span className="text-text-secondary">{r.timezone}</span>
              </p>
              <p className="mt-1.5 truncate font-medium text-text">{r.candidate}</p>
              <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                {r.role} · <span className="font-medium text-text-secondary/80">{r.stage}</span>
              </p>
              <p className="mt-1 text-[11px] text-text-secondary">
                <span className="font-medium text-text-secondary/85">{r.interviewer}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA removed — panel behaves like a personal queue */}
    </PanelShell>
  );
}

function workloadDot(status: InterviewerWorkloadStatus) {
  switch (status) {
    case "Available":
      return "bg-[#22C55E]";
    case "Busy":
      return "bg-[#EF4444]";
  }
}

function InterviewerOperationalReportDialog({
  open,
  onOpenChange,
  interviewer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interviewer: InterviewerOpsRow | null;
}) {
  const allFeedbackDue = useFeedbackDueItems();

  if (!interviewer) return null;

  const sampleJobs = ["Staff Product Designer", "Senior Product Designer", "UX Researcher"];
  const sampleRounds = ["Technical", "Portfolio Review", "System Design"];
  const feedbackDueForInterviewer = allFeedbackDue.filter(
    (i) => i.interviewerName === interviewer.name && i.status !== "Completed",
  );

  const hours = Math.max(4, Math.round((interviewer.completed * 1.2 + interviewer.assignedThisWeek * 0.35) * 10) / 10);
  const completionRate = Math.min(100, Math.max(62, 100 - interviewer.pendingFeedback * 7));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[300]" />
        <div className="pointer-events-none fixed inset-0 z-[310] flex items-center justify-center p-4">
          <DialogPanel
            className={cn(
              "pointer-events-auto relative w-full max-w-[980px] overflow-hidden",
              "rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-surface shadow-[0_24px_64px_rgba(15,23,42,0.12)]",
              "dark:border-white/[0.08]",
            )}
          >
            <DialogClose
              className={cn(dialogCloseButtonPositionClass, "z-20", dialogCloseButtonLg)}
              aria-label="Close report"
            >
              <X className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            </DialogClose>

            <header className={cn(hiringHeroReportStripShell, "shrink-0 rounded-none")}>
              <HiringHeroDecor />
              <div className={cn(hiringHeroStripRow, "relative pr-12")}>
                <DialogHeader className="min-w-0 space-y-0.5 pr-0 text-left">
                  <DialogTitle className={hiringHeroStripTitle}>{interviewer.name}</DialogTitle>
                  <DialogDescription className={hiringHeroStripMetaLine}>
                    {interviewer.title} · Interview operations report
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
                      <span className={cn("h-2 w-2 rounded-full", workloadDot(interviewer.status))} aria-hidden />
                      {interviewer.status}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
                      {interviewer.assignedThisWeek} assigned
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
                      {interviewer.pendingFeedback} pending feedback
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="h-9 rounded-[12px] bg-white/[0.14] px-4 text-[12px] font-semibold text-white hover:bg-white/[0.2]"
                    disabled={feedbackDueForInterviewer.length === 0}
                    onClick={() =>
                      (feedbackDueForInterviewer.forEach((i) => requestFeedbackForItem(i.id)),
                      toast("Feedback requests sent", { description: interviewer.name }))
                    }
                  >
                    Request all
                  </Button>
                </div>
              </div>
            </header>

            <div className="max-h-[min(72vh,720px)] overflow-auto p-5 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-gradient-to-br from-white to-[#F8FAFC] p-4 dark:border-white/[0.08] dark:from-white/[0.05] dark:to-white/[0.02]">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">This week</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[18px] font-semibold tabular-nums tracking-[-0.03em] text-text">
                  {interviewer.assignedThisWeek}
                </p>
                <p className="text-[11px] text-text-secondary">interviews</p>
              </div>
              <div>
                <p className="text-[18px] font-semibold tabular-nums tracking-[-0.03em] text-text">
                  {interviewer.completed}
                </p>
                <p className="text-[11px] text-text-secondary">completed</p>
              </div>
              <div>
                <p className="text-[18px] font-semibold tabular-nums tracking-[-0.03em] text-text">
                  {interviewer.pendingFeedback}
                </p>
                <p className="text-[11px] text-text-secondary">feedback pending</p>
              </div>
              <div>
                <p className="text-[18px] font-semibold tabular-nums tracking-[-0.03em] text-text">{hours}</p>
                <p className="text-[11px] text-text-secondary">interview hours</p>
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">Workload trend</p>
            <p className="mt-2 text-[13px] font-medium text-text">Feedback completion rate</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-text-secondary">
              <span className="font-semibold tabular-nums text-text">{completionRate}%</span> trailing 30 days · avg completion ~{" "}
              <span className="font-semibold tabular-nums text-text">{Math.max(6, 24 - interviewer.pendingFeedback * 2)}h</span>
            </p>
          </div>

          <div className="rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">Most active</p>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-[12px] font-semibold text-text">Jobs</p>
                <ul className="mt-1 space-y-1 text-[11px] text-text-secondary">
                  {sampleJobs.map((j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent-rgb)/0.75)]" aria-hidden />
                      {j}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-text">Rounds</p>
                <ul className="mt-1 space-y-1 text-[11px] text-text-secondary">
                  {sampleRounds.map((r) => (
                    <li key={r} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted/60" aria-hidden />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-text">Feedback due</p>
              <p className="mt-0.5 text-[11px] text-text-secondary">
                All pending items for this interviewer (including requested + overdue)
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 rounded-[12px] bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent-hover"
              disabled={feedbackDueForInterviewer.length === 0}
              onClick={() =>
                (feedbackDueForInterviewer.forEach((i) => requestFeedbackForItem(i.id)),
                toast("Feedback requests sent", { description: interviewer.name }))
              }
            >
              Request all
            </Button>
          </div>
          <div className="mt-3 max-h-[320px] space-y-2 overflow-auto pr-0.5">
            {feedbackDueForInterviewer.length ? (
              feedbackDueForInterviewer.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between gap-2 rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] px-3 py-2 dark:border-white/[0.08] dark:bg-white/[0.04]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-text">{i.candidateName}</p>
                    <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                      {i.jobName} · <span className="font-medium text-text-secondary/85">{i.stage}</span>
                    </p>
                    {i.requestSentNote ? (
                      <p className="mt-1 text-[10px] font-medium text-text-secondary/70">✓ {i.requestSentNote}</p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-semibold text-[#9A3412] dark:text-[#FDBA74]">{i.status}</p>
                    <p className="text-[10px] text-text-secondary">Pending {i.pendingDuration}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[14px] border border-dashed border-[rgba(15,23,42,0.12)] bg-white/60 px-4 py-6 text-center text-[12px] text-text-secondary dark:border-white/[0.12] dark:bg-white/[0.03]">
                No pending feedback items for this interviewer.
              </div>
            )}
          </div>
        </div>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}

function InterviewerWorkloadAvailabilityCard({
  rows,
  onOpenInterviewer,
}: {
  rows: InterviewerOpsRow[];
  onOpenInterviewer: (row: InterviewerOpsRow) => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"workload" | "pending" | "slots" | "assigned">("workload");
  const [statusFilter, setStatusFilter] = useState<"all" | InterviewerWorkloadStatus>("all");

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!normalizedQuery) return true;
      const hay = [r.name, r.title].join(" ").toLowerCase();
      return hay.includes(normalizedQuery);
    });
  }, [rows, normalizedQuery, statusFilter]);

  const sorted = useMemo(() => {
    const rank: Record<InterviewerWorkloadStatus, number> = {
      Available: 0,
      Busy: 1,
    };
    const copy = [...filtered];
    copy.sort((a, b) => {
      if (sort === "pending") return b.pendingFeedback - a.pendingFeedback;
      if (sort === "slots") return b.availableSlotsToday - a.availableSlotsToday;
      if (sort === "assigned") return b.assignedThisWeek - a.assignedThisWeek;
      // workload
      return rank[b.status] - rank[a.status];
    });
    return copy;
  }, [filtered, sort]);

  function statusPillClass(s: InterviewerWorkloadStatus) {
    switch (s) {
      case "Available":
        return "border-[#BBF7D0]/70 bg-[#F0FDF4]/70 text-[#166534] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#86EFAC]";
      case "Busy":
        return "border-[#FECACA]/70 bg-[#FEF2F2]/70 text-[#991B1B] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#FCA5A5]";
    }
  }

  function workloadPct(r: InterviewerOpsRow) {
    // heuristic for a compact bar (0-100)
    const pendingWeight = r.pendingFeedback * 12;
    const assignedWeight = r.assignedThisWeek * 4;
    const slotsRelief = r.availableSlotsToday * 10;
    return Math.max(6, Math.min(100, pendingWeight + assignedWeight - slotsRelief));
  }

  return (
    <PanelShell
      title="Interviewer workload & availability"
      subtitle="Monitor interviewer capacity, workload, and pending evaluations."
      density="compact"
      elevated
      bodyClassName="flex min-h-0 flex-col gap-2.5"
    >
      <div className="flex flex-col gap-2">
        <div className="sticky top-0 z-10 -mx-1 bg-white/40 px-1 pb-2 backdrop-blur-md dark:bg-app-bg/30">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search interviewer…"
              className={cn(
                "h-8 w-full rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-[12px] text-text outline-none",
                "placeholder:text-muted/80 focus:border-[rgb(var(--accent-rgb)/0.35)] focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.18)]",
                "dark:border-white/[0.08] dark:bg-white/[0.03]",
              )}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 rounded-[12px] border-[rgba(15,23,42,0.08)] bg-white px-2.5 text-[12px] font-medium text-text hover:bg-[#F8FAFC] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
                >
                  Sort: {sort === "workload" ? "Workload" : sort === "pending" ? "Pending" : sort === "slots" ? "Slots" : "Assigned"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onSelect={() => setSort("workload")}>Workload</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("pending")}>Pending feedback</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("slots")}>Available slots</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("assigned")}>Assigned this week</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 rounded-[12px] border-[rgba(15,23,42,0.08)] bg-white px-2.5 text-[12px] font-medium text-text hover:bg-[#F8FAFC] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
                >
                  {statusFilter === "all" ? "All statuses" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onSelect={() => setStatusFilter("all")}>All statuses</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("Available")}>Available</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("Busy")}>Busy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-hidden rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-white/60 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
          <div
            className={cn(
              "hidden gap-2 px-2.5 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted/80 lg:grid",
              "[grid-template-columns:minmax(220px,1.6fr)_repeat(4,minmax(90px,0.8fr))_minmax(120px,1fr)]",
              "[&>*]:min-w-0",
            )}
          >
            <span className="min-w-0">Interviewer</span>
            <span className="min-w-0 text-right">Assigned</span>
            <span className="min-w-0 text-right">Completed</span>
            <span className="min-w-0 text-right">Pending</span>
            <span className="min-w-0 text-right">Slots</span>
            <span className="min-w-0 text-right">Status</span>
          </div>
          <div className="h-px bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]" />

          <div className="max-h-[360px] overflow-x-hidden overflow-y-auto">
            {sorted.map((r) => {
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onOpenInterviewer(r)}
                  className={cn(
                    "group w-full px-2.5 py-2 text-left",
                    "border-t border-[rgba(15,23,42,0.06)] dark:border-white/[0.06]",
                    "bg-transparent transition-[background-color,transform] duration-150 ease-out",
                    "hover:bg-[rgba(15,23,42,0.02)] hover:-translate-y-px dark:hover:bg-white/[0.04]",
                  )}
                >
                  {/* Mobile: compact two-line row */}
                  <div className="flex items-start justify-between gap-3 lg:hidden">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-white to-[#F8FAFC] text-[11px] font-semibold text-text ring-1 ring-[rgba(15,23,42,0.06)] dark:from-white/[0.08] dark:to-white/[0.03] dark:ring-white/[0.08]"
                        aria-hidden
                      >
                        {interviewerInitials(r.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text">{r.name}</p>
                        <p className="mt-0.5 truncate text-[11px] text-text-secondary">{r.title}</p>
                        <p className="mt-1 text-[11px] text-text-secondary">
                          <span className="font-semibold tabular-nums text-text">{r.assignedThisWeek}</span> Assigned
                          <span className="mx-2 text-muted/40">·</span>
                          <span className="font-semibold tabular-nums text-text">{r.pendingFeedback}</span> Pending
                          <span className="mx-2 text-muted/40">·</span>
                          <span className="font-semibold tabular-nums text-text">{r.availableSlotsToday}</span> Slots
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold", statusPillClass(r.status))}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", workloadDot(r.status))} aria-hidden />
                        {r.status}
                      </span>
                    </div>
                  </div>

                  {/* Desktop: true operational grid */}
                  <div
                    className={cn(
                      "hidden items-center gap-2 lg:grid",
                      "[grid-template-columns:minmax(220px,1.6fr)_repeat(4,minmax(90px,0.8fr))_minmax(120px,1fr)]",
                      "[&>*]:min-w-0",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-white to-[#F8FAFC] text-[11px] font-semibold text-text ring-1 ring-[rgba(15,23,42,0.06)] dark:from-white/[0.08] dark:to-white/[0.03] dark:ring-white/[0.08]"
                        aria-hidden
                      >
                        {interviewerInitials(r.name)}
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text">{r.name}</p>
                        <p className="mt-0.5 truncate text-[11px] text-text-secondary">{r.title}</p>
                      </div>
                    </div>

                    <div className="min-w-0 text-right text-[12px] font-semibold tabular-nums text-text whitespace-nowrap">
                      {r.assignedThisWeek} <span className="ml-1 text-[11px] font-medium text-text-secondary">Assigned</span>
                    </div>
                    <div className="min-w-0 text-right text-[12px] font-semibold tabular-nums text-text whitespace-nowrap">
                      {r.completed} <span className="ml-1 text-[11px] font-medium text-text-secondary">Completed</span>
                    </div>
                    <div className="min-w-0 text-right text-[12px] font-semibold tabular-nums text-text whitespace-nowrap">
                      {r.pendingFeedback} <span className="ml-1 text-[11px] font-medium text-text-secondary">Pending</span>
                    </div>
                    <div className="min-w-0 text-right text-[12px] font-semibold tabular-nums text-text whitespace-nowrap">
                      {r.availableSlotsToday} <span className="ml-1 text-[11px] font-medium text-text-secondary">Slots</span>
                    </div>

                    <div className="flex min-w-0 flex-col items-end gap-0.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
                          statusPillClass(r.status),
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", workloadDot(r.status))} aria-hidden />
                        {r.status}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {sorted.length === 0 ? (
              <LineArtEmptyState
                illustration="filters"
                message="No interviewers match your filters."
                size="compact"
              />
            ) : null}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

function FeedbackDueCenter() {
  const items = useFeedbackDueItems();
  const jobs = useMemo(() => {
    const set = new Set(items.map((i) => i.jobName));
    return ["All jobs", ...Array.from(set)];
  }, [items]);
  const [job, setJob] = useState<string>("All jobs");
  const [status, setStatus] = useState<"All" | FeedbackDueStatus>("All");

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (job !== "All jobs" && i.jobName !== job) return false;
      if (status !== "All" && i.status !== status) return false;
      return true;
    });
  }, [items, job, status]);

  function statusTone(s: FeedbackDueStatus) {
    switch (s) {
      case "Pending":
        return "bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]";
      case "Overdue":
        return "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]";
      case "Request Sent":
        return "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]";
      case "Completed":
        return "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]";
    }
  }

  const segments: Array<{ id: "All" | FeedbackDueStatus; label: string }> = [
    { id: "All", label: "All" },
    { id: "Pending", label: "Pending" },
    { id: "Request Sent", label: "Request sent" },
    { id: "Overdue", label: "Overdue" },
    { id: "Completed", label: "Completed" },
  ];

  return (
    <section className={cn(dashboardPanel, "p-3.5 sm:p-4")} aria-label="Feedback due">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className={dashboardSectionTitle}>Feedback due</h3>
          <p className={dashboardSectionSub}>Operational reminders that unblock pipeline progress</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 rounded-[12px] border-[rgba(15,23,42,0.08)] bg-white px-3 text-[12px] font-medium text-text hover:bg-[#F8FAFC]">
              {job}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px]">
            {jobs.map((j) => (
              <DropdownMenuItem key={j} onSelect={() => setJob(j)}>
                {j}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {segments.map((s) => {
          const active = status === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatus(s.id)}
              className={cn(
                "h-8 rounded-full border px-3 text-[12px] font-medium transition-colors",
                active
                  ? "border-[rgb(var(--accent-rgb)/0.35)] bg-[rgb(var(--accent-rgb)/0.10)] text-[rgb(var(--accent-deep-rgb))]"
                  : "border-[rgba(15,23,42,0.08)] bg-white text-text-secondary hover:bg-[#F8FAFC] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 space-y-2">
        {filtered.map((i) => (
          <div
            key={i.id}
            className="group flex flex-col gap-2 rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-white/60 p-3 transition-colors hover:bg-white dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-text">{i.candidateName}</p>
                <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                  {i.jobName} · <span className="font-medium text-text-secondary/85">{i.stage}</span>
                </p>
                <p className="mt-1 text-[11px] text-text-secondary">
                  <span className="font-medium text-text-secondary/80">{i.interviewerName}</span>
                  <span className="text-muted"> · </span>
                  Pending for <span className="font-medium tabular-nums text-text-secondary/85">{i.pendingDuration}</span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", statusTone(i.status))}>
                  {i.status}
                </span>
                <Button
                  size="sm"
                  className="h-8 rounded-[12px] bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent-hover"
                  disabled={i.status === "Completed" || i.status === "Request Sent"}
                  onClick={() => {
                    requestFeedbackForItem(i.id);
                    toast("Feedback requested", {
                      description: `Notified ${i.interviewerName} for ${i.candidateName} · ${i.stage}`,
                    });
                  }}
                >
                  {i.status === "Request Sent" ? "Request sent" : "Request feedback"}
                </Button>
                {i.status === "Request Sent" || i.status === "Overdue" ? (
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white text-text-secondary transition-colors hover:bg-[#F8FAFC] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
                    onClick={() => {
                      remindFeedbackForItem(i.id);
                      toast("Reminder sent", {
                        description: `Sent another reminder to ${i.interviewerName}`,
                      });
                    }}
                    title="Remind again"
                    aria-label="Remind again"
                  >
                    <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </button>
                ) : null}
              </div>
            </div>

            {i.requestSentNote ? (
              <div className="flex items-center gap-2 text-[11px] font-medium text-text-secondary/75">
                <span className="inline-flex h-5 items-center rounded-full bg-[rgba(15,23,42,0.04)] px-2 dark:bg-white/[0.05]">
                  ✓ {i.requestSentNote}
                </span>
              </div>
            ) : null}
          </div>
        ))}

        {filtered.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[rgba(15,23,42,0.12)] bg-white/50 dark:border-white/[0.12] dark:bg-white/[0.03]">
            <LineArtEmptyState
              illustration="filters"
              message="No feedback items match your filters."
              size="compact"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function FeedbackDueInsightPanel({ mode = "enterprise" }: { mode?: FeedbackDuePanelMode }) {
  if (mode === "interviewer") {
    return (
      <BentoWorkspace label="My feedback">
        <div className={cn(dashboardBentoCell, dashboardBentoSpan.wide)}>
          <MyFeedbackDuePanelPersonal />
        </div>
      </BentoWorkspace>
    );
  }

  return (
    <BentoWorkspace label="Feedback operations">
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.wide)}>
        <FeedbackDueCenter />
      </div>
    </BentoWorkspace>
  );
}

function MyFeedbackDuePanelPersonal() {
  const { data: session } = useSession();
  const interviewerName = resolveLoggedInInterviewerName(session?.user?.name);
  const items = useFeedbackDueItems().filter(
    (i) => i.interviewerName === interviewerName && i.status !== "Completed",
  );

  return (
    <section className={cn(dashboardPanelInteractive, "p-3.5 sm:p-4")} aria-label="My feedback due">
      <header className="mb-3">
        <h3 className={dashboardSectionTitle}>My feedback due</h3>
        <p className={dashboardSectionSub}>Scorecards waiting on you — submit after each panel</p>
      </header>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="list-none">
            <LineArtEmptyState
              illustration="feedback"
              message="You're caught up — no pending feedback."
              size="compact"
              className="rounded-[12px] border border-dashed border-[rgba(15,23,42,0.1)] dark:border-white/[0.1]"
            />
          </li>
        ) : (
          items.map((i) => (
            <li
              key={i.id}
              className={cn(
                "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                dashboardRowSurface,
                "p-3",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-text">{i.candidateName}</p>
                <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                  {i.jobName} · {i.stage}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-text-secondary">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
                  Pending {i.pendingDuration}
                  {i.status === "Overdue" ? (
                    <span className="rounded-full bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-semibold text-[#991B1B]">
                      Overdue
                    </span>
                  ) : i.status === "Request Sent" ? (
                    <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-semibold text-[#1D4ED8]">
                      Request sent
                    </span>
                  ) : null}
                </p>
              </div>
              <Button
                size="sm"
                className="h-8 shrink-0 rounded-[10px] bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent-hover"
                asChild
              >
                <Link href={ROUTES.interviews}>
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  Submit feedback
                </Link>
              </Button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export function InterviewsInsightPanel({
  mode = "enterprise",
  canMonitorLiveInterviews = false,
}: {
  mode?: InterviewsPanelMode;
  canMonitorLiveInterviews?: boolean;
}) {
  const [openInterviewer, setOpenInterviewer] = useState<InterviewerOpsRow | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  if (mode === "interviewer") {
    return (
      <BentoWorkspace label="Your interview workspace">
        <div className={cn(dashboardBentoCell, dashboardBentoSpan.wide)}>
          <InterviewerIntelligenceWorkspace />
        </div>
      </BentoWorkspace>
    );
  }

  return (
    <BentoWorkspace label="Interview operations">
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.wide)}>
        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="min-h-[320px]">
            <GlobalInterviewPanelCard rows={globalInterviewFeedRows} canMonitor={canMonitorLiveInterviews} />
          </div>
          <div className="min-h-[320px]">
            <YourUpcomingInterviewsCard />
          </div>
          <div className="lg:col-span-2">
            <InterviewerWorkloadAvailabilityCard
              rows={interviewerOpsRows}
              onOpenInterviewer={(r) => {
                setOpenInterviewer(r);
                setReportOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      <InterviewerOperationalReportDialog
        open={reportOpen}
        onOpenChange={(open) => {
          setReportOpen(open);
          if (!open) setOpenInterviewer(null);
        }}
        interviewer={openInterviewer}
      />
    </BentoWorkspace>
  );
}


export function AssessmentsInsightPanel({ mode = "enterprise" }: { mode?: AssessmentsPanelMode }) {
  const chart = useChartAccentColors();
  const qualTitle =
    mode === "curator" ? "Question pool health" : mode === "evaluator" ? "Ongoing assessment mix" : "Qualification distribution";
  const qualSub =
    mode === "curator"
      ? "Difficulty bands across live items"
      : mode === "evaluator"
        ? "Score bands for candidates in flight"
        : "Evidence-based score bands";

  const malpracticeTitle =
    mode === "curator" ? "Low quality / calibration signals" : mode === "evaluator" ? "Malpractice review" : "Malpractice monitoring";
  const malpracticeSub =
    mode === "curator"
      ? "Items pulled for curator review"
      : mode === "evaluator"
        ? "Evaluator lane — integrity without hiring noise"
        : "Session integrity signals for review";

  return (
    <BentoWorkspace label="Assessment intelligence">
      <Card className={cn(dashboardBentoCell, dashboardBentoSpan.hero, bentoCard)}>
        <CardHeader className="shrink-0 pb-2 pt-0">
          <CardTitle className="text-base font-medium text-text">{qualTitle}</CardTitle>
          <p className="text-xs font-normal text-text-secondary">{qualSub}</p>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 pt-3">
          <div className="h-[min(240px,100%)] min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentQualification} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid {...CHART_GRID} vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 80]} tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} formatter={(v: number) => [`${v} candidates`, "Count"]} />
                <Bar dataKey="count" fill={chart.primary} radius={[9, 9, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(dashboardBentoCell, dashboardBentoSpan.sideTall, bentoCard)}>
        <CardHeader className="shrink-0 pb-2 pt-0">
          <CardTitle className="text-base font-medium text-text">{malpracticeTitle}</CardTitle>
          <p className="text-xs font-normal text-text-secondary">{malpracticeSub}</p>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto pt-3">
          {malpracticeSignals.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-text">{m.label}</span>
                <span className="tabular-nums text-text-secondary">{m.pct}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-[#A1A1AA] transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.min(100, m.pct)}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">{m.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {mode !== "evaluator"
        ? topTechnologies.map((t) => <TechnologyBentoTile key={t.name} {...t} />)
        : (
          <>
            <StatBentoTile label="Last 30 days" value="312" note="+9% vs prior window" />
            <StatBentoTile label="Avg evaluation time" value="22m" note="Stable vs SLA target" />
            <StatBentoTile label="Integrity mix" value="6" note="Flagged sessions in calibration band" />
          </>
        )}

      {mode === "curator" ? (
        <>
          <StatBentoTile label="Archived" value="62" note="24-month retention window" />
          <StatBentoTile label="Assessment content quality" value="4.2" note="Weighted peer review score" />
          <StatBentoTile label="Coverage gaps" value="3" note="Tracks missing gold-standard items" />
        </>
      ) : null}
    </BentoWorkspace>
  );
}

function InterviewerAvailabilityPanel() {
  return (
    <PanelShell title="Interviewer availability" subtitle="Slots and capacity this week" density="dense">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[10px] font-medium uppercase tracking-wider text-muted/70">
            <th className="pb-2 pr-2">Interviewer</th>
            <th className="pb-2 text-right">Slots</th>
            <th className="pb-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {evaluatorAvailability.map((e) => (
            <tr key={e.name} className="border-t border-[rgba(15,23,42,0.04)] dark:border-white/[0.04]">
              <td className="py-2 pr-2 font-medium text-text">{e.name}</td>
              <td className="py-2 text-right tabular-nums text-muted/80">{e.slots}</td>
              <td className="py-2 text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                    e.status === "Available" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEF3C7] text-[#A16207]",
                  )}
                >
                  {e.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PanelShell>
  );
}

export function SchedulesInsightPanel({ mode = "enterprise" }: { mode?: SchedulesPanelMode }) {
  const chart = useChartAccentColors();

  if (mode === "interviewer") {
    return (
      <BentoWorkspace label="Schedule intelligence">
        <Card className={cn(dashboardBentoCell, dashboardBentoSpan.chart, bentoCard)}>
          <CardHeader className="pb-2 pt-0">
            <CardTitle className="text-base font-medium text-text">Your interview load</CardTitle>
            <p className="text-xs font-normal text-text-secondary">Scheduled panels by weekday</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scheduleCalendarDays} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid {...CHART_GRID} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Bar dataKey="interviews" name="Interviews" fill={chart.primary} radius={[9, 9, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(dashboardBentoCell, dashboardBentoSpan.sideWide, bentoCard)}>
          <CardHeader className="shrink-0 pb-2 pt-0">
            <CardTitle className="text-base font-medium text-text">Your upcoming panels</CardTitle>
            <p className="text-xs font-normal text-text-secondary">Assigned schedule · feedback prep</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <ul className="space-y-3">
              {upcomingScheduleRows.map((r) => (
                <li
                  key={r.candidate}
                  className="rounded-[12px] border border-border bg-surface px-3 py-2.5 text-xs shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-all duration-200 hover:border-muted hover:bg-muted/15"
                >
                  <p className="font-medium tabular-nums text-text">
                    {r.timeLabel}
                    <span className="font-medium text-text-secondary"> {r.timezone}</span>
                    <span className="text-muted"> · </span>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{r.stage}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    {r.durationMin} min panel · <span className="font-medium text-text">{r.candidate}</span>
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/schedules">
              <Button className="h-9 w-full rounded-[12px] bg-accent text-xs font-medium text-white hover:bg-accent-hover">
                Open schedules
              </Button>
            </Link>
          </CardContent>
        </Card>
      </BentoWorkspace>
    );
  }

  return (
    <BentoWorkspace label="Schedule intelligence">
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.hero, "min-h-[min(360px,48vh)]")}>
        <AssignedInterviewSchedule title="Global interview schedule" subtitle="Organization-wide panels" joinVariant="allPrimary" showFooter elevated />
      </div>
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.side)}>
        <AssignedInterviewSchedule
          title="Your next panel"
          subtitle="Starting soon"
          joinVariant="firstPrimary"
          showFooter={false}
          useCandidateAvatar
          showStatusChip={false}
          limitRows={2}
          density="compact"
        />
      </div>
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.side)}>
        <InterviewerAvailabilityPanel />
      </div>
    </BentoWorkspace>
  );
}

