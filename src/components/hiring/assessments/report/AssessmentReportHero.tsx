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
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { dialogCloseButtonLg } from "@/components/ui/dialog";
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
  hiringHeroPrimaryBtnSm,
  hiringHeroReportStripRow,
  hiringHeroReportStripShell,
  hiringHeroSecondaryBtnSm,
  hiringHeroStripActions,
  hiringHeroStripMetaLine,
  hiringHeroStripTitle,
  hiringTransition,
} from "../../hiringTokens";
import { AssessmentCandidateStatusPill } from "../AssessmentCandidateStatusPill";

const reportAvatar =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.16] bg-white/[0.1] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:h-14 sm:w-14 sm:text-base";

const glassMeta =
  "inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-md [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0";

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
  onClose,
}: {
  assessment: AssessmentRecord;
  candidate: AssessmentCandidateRecord;
  initials: string;
  onClose: () => void;
}) {
  const linkedinHref = candidate.linkedin
    ? candidate.linkedin.startsWith("http")
      ? candidate.linkedin
      : `https://${candidate.linkedin}`
    : null;

  return (
    <header className={hiringHeroReportStripShell}>
      <HiringHeroDecor />

      <div className={cn(hiringHeroReportStripRow, "relative")}>
        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
          <div className={reportAvatar}>{initials}</div>
          <div className="min-w-0 space-y-2">
            <h2 className={hiringHeroStripTitle}>{candidate.name}</h2>
            <p className={hiringHeroStripMetaLine}>{assessment.name}</p>
            <div className="flex flex-wrap gap-2">
              <span className={glassMeta}>
                <Mail className="opacity-90" strokeWidth={1.5} />
                {candidate.email}
              </span>
              {candidate.attemptedAt ? (
                <span className={glassMeta}>
                  <Calendar className="opacity-90" strokeWidth={1.5} />
                  {candidate.attemptedAt}
                </span>
              ) : null}
              {candidate.durationMinutes != null ? (
                <span className={glassMeta}>
                  <Clock className="opacity-90" strokeWidth={1.5} />
                  {candidate.durationMinutes} min
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {linkedinHref ? (
                <a
                  href={linkedinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(glassMeta, "hover:bg-white/[0.14]")}
                  aria-label="LinkedIn profile"
                >
                  <Linkedin strokeWidth={1.5} />
                </a>
              ) : null}
              {candidate.resumeUrl ? (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(glassMeta, "hover:bg-white/[0.14]")}
                  aria-label="Resume"
                >
                  <FileText strokeWidth={1.5} />
                  Resume
                </a>
              ) : null}
              <AssessmentCandidateStatusPill
                status={candidate.status}
                className="border-white/20 bg-white/10 text-white"
              />
            </div>
          </div>
        </div>

        <div className={hiringHeroStripActions}>
          <Button type="button" size="sm" className={hiringHeroSecondaryBtnSm} onClick={() => toast.message("Share report (demo)")}>
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Share report
          </Button>
          <Button type="button" size="sm" className={hiringHeroPrimaryBtnSm} onClick={() => toast.message("Export report (demo)")}>
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            Export report
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                className={cn(
                  "h-9 w-9 rounded-[11px] border-0 p-0 text-white shadow-none backdrop-blur-sm",
                  hiringTransition,
                  "bg-white/[0.14] hover:bg-white/[0.2]",
                )}
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={menuContentClass}>
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
          <button type="button" className={dialogCloseButtonLg} aria-label="Close report" onClick={onClose}>
            <X className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
