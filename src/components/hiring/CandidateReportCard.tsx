"use client";

import { useState } from "react";
import { ChevronDown, Download, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import type { HiringCandidate } from "@/lib/hiring/types";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open ? <div className="pb-4">{children}</div> : null}
    </div>
  );
}

export function CandidateReportCard({ candidate }: { candidate: HiringCandidate }) {
  const initials = candidate.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="rounded-[16px] border border-border bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <header className="flex flex-wrap items-start gap-4 border-b border-border p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-gradient-to-br from-secondary-fill to-surface text-sm font-semibold text-text">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-text">{candidate.name}</h3>
          <p className="text-sm text-text-secondary">
            {candidate.email} · {candidate.phone}
          </p>
          <p className="mt-1 text-xs text-muted">
            {candidate.location} · {candidate.source} · Applied {candidate.appliedAt}
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="font-semibold text-forest">{candidate.currentStage}</p>
          <p className="text-muted">{candidate.currentSubstage}</p>
          <p className="mt-1 text-text-secondary">Owner: {candidate.recruiterOwner}</p>
        </div>
      </header>

      <div className="px-4">
        <Section title="Profile summary">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">Experience</dt>
              <dd className="font-medium text-text">{candidate.experience}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Education</dt>
              <dd className="font-medium text-text">{candidate.education}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Notice period</dt>
              <dd className="font-medium text-text">{candidate.noticePeriod}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Expected salary</dt>
              <dd className="font-medium text-text">{candidate.expectedSalary}</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {candidate.skills.map((s) => (
              <span
                key={s}
                className="rounded-md border border-border bg-muted/10 px-2 py-0.5 text-[11px] font-medium text-text-secondary"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {candidate.portfolioUrl ? (
              <a href={candidate.portfolioUrl} className="font-medium text-forest hover:underline">
                Portfolio
              </a>
            ) : null}
            {candidate.github ? (
              <a href={`https://${candidate.github}`} className="font-medium text-forest hover:underline">
                GitHub
              </a>
            ) : null}
            {candidate.linkedin ? (
              <a href={`https://${candidate.linkedin}`} className="font-medium text-forest hover:underline">
                LinkedIn
              </a>
            ) : null}
          </div>
        </Section>

        <Section title="Resume">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-border bg-muted/10 p-3">
            <div>
              <p className="text-sm font-medium text-text">Resume on file</p>
              <p className="text-xs text-muted">
                Uploaded {candidate.resumeUploadedAt} · {candidate.resumeStatus}
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-[10px]">
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Download
            </Button>
          </div>
        </Section>

        <Section title="Emails" defaultOpen={candidate.emails.length > 0}>
          {candidate.emails.length === 0 ? (
            <LineArtEmptyState illustration="email" message="No email activity logged." size="compact" />
          ) : (
            <ul className="space-y-2">
              {candidate.emails.map((e) => (
                <li
                  key={e.id}
                  className="rounded-[12px] border border-border bg-app-bg/50 p-3 transition-colors hover:bg-muted/10"
                >
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text">{e.subject}</p>
                      <p className="text-xs text-muted">
                        {e.sender} · {e.timestamp} · {e.type}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary line-clamp-2">{e.preview}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Comments">
          <div className="space-y-3 text-sm">
            {candidate.recruiterNotes ? (
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted">Recruiter</p>
                <p className="mt-1 text-text-secondary">{candidate.recruiterNotes}</p>
              </div>
            ) : null}
            {candidate.hiringManagerNotes ? (
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted">Hiring manager</p>
                <p className="mt-1 text-text-secondary">{candidate.hiringManagerNotes}</p>
              </div>
            ) : null}
            {candidate.interviewerNotes ? (
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted">Interviewer</p>
                <p className="mt-1 text-text-secondary">{candidate.interviewerNotes}</p>
              </div>
            ) : null}
          </div>
        </Section>

        <Section title="Interviews">
          {candidate.interviews.length === 0 ? (
            <LineArtEmptyState illustration="interviews" message="No interviews scheduled." size="compact" />
          ) : (
            <ul className="space-y-2">
              {candidate.interviews.map((i) => (
                <li key={i.id} className="rounded-[12px] border border-border p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-text">{i.round}</p>
                    <span className="rounded-full bg-secondary-fill px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                      {i.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{i.interviewers.join(", ")} · {i.scheduledAt}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    Feedback: {i.feedbackStatus}
                    {i.result ? ` · ${i.result}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Timeline">
          <ol className="relative space-y-3 border-l border-border pl-4">
            {candidate.timeline.map((t) => (
              <li key={t.id} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-forest" />
                <p className="text-sm font-semibold text-text">{t.label}</p>
                <p className="text-xs text-text-secondary">{t.detail}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {t.at}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </article>
  );
}
