"use client";

import {
  Calendar,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Linkedin,
  Mail,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AssessmentCandidateRecord, AssessmentRecord } from "@/lib/hiring/assessments/types";
import { HiringHeroDecor } from "../../HiringHeroDecor";
import {
  hiringHeroFocusRing,
  hiringHeroGradient,
  hiringHeroPrimaryBtn,
  hiringHeroSecondaryBtnSm,
  hiringHeroStripMetaLine,
  hiringHeroStripTitle,
  hiringTransition,
} from "../../hiringTokens";
import { AssessmentCandidateStatusPill } from "../AssessmentCandidateStatusPill";

const reportSidebarShell = cn(
  "relative isolate flex h-full w-full flex-col overflow-hidden",
  "text-[rgb(var(--hero-fg-rgb))]",
  hiringHeroGradient,
  "border-b border-[rgb(var(--hero-border-rgb)/0.28)] lg:border-b-0 lg:border-r",
  "px-5 pb-5 pt-5 sm:px-6 sm:pb-6",
);

const reportAvatar =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.16] bg-white/[0.1] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:h-14 sm:w-14 sm:text-base";

/** Sidebar action buttons stack full width */
const heroPrimaryActionBtn = cn(
  hiringHeroPrimaryBtn,
  "h-9 w-full justify-center gap-1.5 rounded-[11px] px-4 text-[13px]",
);

const heroSecondaryActionBtn = cn(hiringHeroSecondaryBtnSm, "w-full justify-center");

const heroMoreBtn = cn(
  "h-9 w-full justify-center gap-1.5 rounded-[11px] border border-white/[0.2] px-4 text-[13px] font-medium text-white",
  hiringTransition,
  hiringHeroFocusRing,
  "bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-white/[0.28] hover:bg-white/[0.22]",
);

/** Vertical meta row inside the sidebar (email / date / duration …) */
const heroMetaRow =
  "flex min-w-0 items-center gap-2.5 rounded-[11px] border border-white/[0.14] bg-white/[0.08] px-3 py-2 text-[13px] font-medium text-white backdrop-blur-md [&_svg]:text-white";

const menuContentClass = cn(
  "z-[220] w-[220px] min-w-0 overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12)]",
);

const menuItemClass =
  "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 text-[12px] font-medium outline-none focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]";

export function AssessmentReportHero({
  assessment,
  candidate,
  initials,
}: {
  assessment: AssessmentRecord;
  candidate: AssessmentCandidateRecord;
  initials: string;
}) {
  const linkedinHref = candidate.linkedin
    ? candidate.linkedin.startsWith("http")
      ? candidate.linkedin
      : `https://${candidate.linkedin}`
    : null;

  return (
    <header className={reportSidebarShell}>
      <HiringHeroDecor />

      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Candidate profile — scrolls independently if the sidebar runs short */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 pt-2">
          <div className={reportAvatar}>{initials}</div>
          <h2 className={cn(hiringHeroStripTitle, "mt-4 text-left")}>{candidate.name}</h2>
          <p className={cn(hiringHeroStripMetaLine, "mt-1")}>{assessment.name}</p>

          <div className="mt-4 flex flex-col gap-2">
            <span className={heroMetaRow}>
              <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="min-w-0 break-words">{candidate.email}</span>
            </span>
            {candidate.attemptedAt ? (
              <span className={heroMetaRow}>
                <Calendar className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="min-w-0 break-words">{candidate.attemptedAt}</span>
              </span>
            ) : null}
            {candidate.durationMinutes != null ? (
              <span className={heroMetaRow}>
                <Clock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="min-w-0 break-words">{candidate.durationMinutes} min</span>
              </span>
            ) : null}
            {linkedinHref ? (
              <a
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(heroMetaRow, "hover:bg-white/[0.14]")}
              >
                <Linkedin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="min-w-0 break-words">LinkedIn profile</span>
              </a>
            ) : null}
            {candidate.resumeUrl ? (
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(heroMetaRow, "hover:bg-white/[0.14]")}
              >
                <FileText className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="min-w-0 break-words">Resume</span>
              </a>
            ) : null}
            <div className="pt-0.5">
              <AssessmentCandidateStatusPill
                status={candidate.status}
                className="border-white/20 bg-white/10 text-white"
              />
            </div>
          </div>
        </div>

        {/* Actions — anchored to the bottom of the sidebar */}
        <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-white/[0.14] pt-4">
          <Button
            type="button"
            size="sm"
            className={heroSecondaryActionBtn}
            onClick={() => toast.message("Share report (demo)")}
          >
            <Share2 className="h-4 w-4" strokeWidth={1.75} />
            Share report
          </Button>
          <Button
            type="button"
            size="sm"
            className={heroPrimaryActionBtn}
            onClick={() => toast.message("Export report (demo)")}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Export report
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="sm" className={heroMoreBtn} aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                More Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" sideOffset={8} className={menuContentClass}>
              <DropdownMenuItem className={menuItemClass} onSelect={() => toast.success("Link copied")}>
                <Copy className="h-3 w-3 opacity-55" />
                Copy report link
              </DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass} onSelect={() => toast.message("Download PDF (demo)")}>
                <Download className="h-3 w-3 opacity-55" />
                Download PDF
              </DropdownMenuItem>
              {linkedinHref ? (
                <DropdownMenuItem className={menuItemClass} asChild>
                  <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 opacity-55" />
                    Open LinkedIn
                  </a>
                </DropdownMenuItem>
              ) : null}
              {candidate.resumeUrl ? (
                <DropdownMenuItem className={menuItemClass} asChild>
                  <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-3 w-3 opacity-55" />
                    Open resume
                  </a>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
