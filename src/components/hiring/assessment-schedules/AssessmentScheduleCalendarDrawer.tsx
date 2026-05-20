"use client";

import {
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Laptop,
  Linkedin,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ScheduleCalendarEvent } from "@/lib/hiring/assessments/scheduleTypes";
import { AssessmentModalDrawer } from "../assessments/AssessmentModalDrawer";
import { ScheduleStatusPill } from "./ScheduleStatusPill";

export function AssessmentScheduleCalendarDrawer({
  event,
  open,
  onOpenChange,
  onViewReport,
  onExtendTime,
}: {
  event: ScheduleCalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewReport: () => void;
  onExtendTime: () => void;
}) {
  if (!event) return null;
  const s = event.schedule;
  const linkedinHref = s.linkedin
    ? s.linkedin.startsWith("http")
      ? s.linkedin
      : `https://${s.linkedin}`
    : null;

  return (
    <AssessmentModalDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={s.name}
      description={s.assessmentName}
      className="max-w-[420px]"
      footer={
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1 rounded-[10px]" onClick={onExtendTime}>
            Extend time
          </Button>
          <Button type="button" className="flex-1 rounded-[10px] bg-accent text-white hover:bg-accent-hover" onClick={onViewReport}>
            View report
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <ScheduleStatusPill status={s.status} />
          <span className="rounded-full border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] px-2.5 py-0.5 text-[11px] font-medium text-muted">
            {s.progress}% complete
          </span>
        </div>

        <dl className="grid gap-3 text-[12px]">
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="font-medium text-text">{s.email}</dd>
          </div>
          <div>
            <dt className="text-muted">Role</dt>
            <dd className="font-medium text-text">{s.role}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted" />
            <span>
              Expires <strong>{s.expiryDate}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted" />
            <span>{s.attemptWindow}</span>
          </div>
          {s.tab === "ongoing" ? (
            <div className="flex items-center gap-2 rounded-[10px] border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-amber-900">
              <Timer className="h-4 w-4" strokeWidth={1.75} />
              <span className="font-semibold">Timer · ~{Math.max(5, s.durationMinutes - Math.round(s.progress * 0.4))} min remaining</span>
            </div>
          ) : null}
        </dl>

        <div className="flex flex-wrap gap-2">
          {linkedinHref ? (
            <Button type="button" variant="outline" size="sm" className="rounded-[10px] gap-1.5" asChild>
              <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            </Button>
          ) : null}
          {s.resumeUrl ? (
            <Button type="button" variant="outline" size="sm" className="rounded-[10px] gap-1.5" asChild>
              <a href={s.resumeUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-3.5 w-3.5" />
                Resume
              </a>
            </Button>
          ) : null}
        </div>

        <div className="rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] p-3 dark:bg-white/[0.03]">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Session environment</p>
          <ul className="space-y-1.5 text-[12px] text-text-secondary">
            <li className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted" />
              Chrome 124 · macOS Sonoma
            </li>
            <li className="flex items-center gap-2">
              <Laptop className="h-3.5 w-3.5 text-muted" />
              MacBook Pro · 1920×1080
            </li>
            <li className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-muted" />
              IP 104.28.42.18 · San Francisco, US
            </li>
          </ul>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-[10px]"
          onClick={() => toast.message("Copy invite link (demo)")}
        >
          Copy invite link
        </Button>
      </div>
    </AssessmentModalDrawer>
  );
}
