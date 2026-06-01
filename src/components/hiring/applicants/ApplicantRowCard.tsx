"use client";

import {
  ArrowRight,
  CheckCheck,
  FileType2,
  Mail,
  MoreHorizontal,
  Phone,
  UserMinus,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { rejectCandidate } from "@/lib/hiring/candidateProfile";
import { moveCandidateToStage } from "@/lib/hiring/mockData";
import { getCandidateStage, normalizeSource, type HiringStageName } from "@/lib/hiring/stages";
import { cn } from "@/lib/utils";
import type { HiringCandidate } from "@/lib/hiring/types";
import { hiringTransition } from "../hiringTokens";
import { getContactStatus, markCandidateEngaged, type ContactStatus } from "@/lib/hiring/candidateContactStatus";

const menuItemClass = "gap-2 text-[12px] font-medium";

const iconBtnClass = cn(
  "h-8 w-8 shrink-0 rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-sm",
  hiringTransition,
  "hover:border-[rgba(15,61,46,0.14)] hover:bg-white hover:text-forest",
  "disabled:pointer-events-none disabled:opacity-35 dark:bg-surface",
);

function externalHref(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

function LinkedInBrandIcon({ disabled }: { disabled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path
        fill={disabled ? "#C4C4C4" : "#0A66C2"}
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 0 1 2.063-2.063 2.062 2.062 0 0 1 2.063 2.063 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function stageBadgeClass(stage: string, substage: string) {
  const sub = substage.toLowerCase();
  if (sub.includes("reject")) {
    return "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] text-[#71717A] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-muted";
  }
  const s = stage.toLowerCase();
  if (s.includes("applicant") || s.includes("applied")) {
    return "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
  }
  if (s.includes("screen")) {
    return "border-sky-500/15 bg-sky-500/[0.07] text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300";
  }
  if (s.includes("interview")) {
    return "border-orange-500/15 bg-orange-500/[0.08] text-orange-900 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-200";
  }
  if (s.includes("offer") || s.includes("hire")) {
    return "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
  }
  return "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] text-[#52525B] dark:border-white/[0.06] dark:bg-white/[0.03]";
}

function formatAppliedDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ApplicantRowCard({
  candidate,
  onOpenReport,
  onOpenResume,
  onStageChanged,
  contactedIds = new Set(),
  onMarkContacted,
}: {
  candidate: HiringCandidate;
  onOpenReport: () => void;
  onOpenResume: () => void;
  onStageChanged?: () => void;
  contactedIds?: Set<string>;
  onMarkContacted?: (id: string) => void;
}) {
  const stage = getCandidateStage(candidate);
  const contactStatus: ContactStatus = getContactStatus(candidate, contactedIds);
  const needsContact = contactStatus === "needs_contact";
  const isEngaged = contactStatus === "engaged";

  const moveTo = (toStage: HiringStageName, substage?: string) => {
    const result = moveCandidateToStage(candidate.id, toStage, { substage });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Moved to ${toStage}`);
    onStageChanged?.();
  };

  const handleReject = () => {
    const updated = rejectCandidate(candidate.id);
    if (!updated) {
      toast.error("Could not reject applicant");
      return;
    }
    toast.success("Applicant rejected");
    onStageChanged?.();
  };
  const linkedinUrl = candidate.linkedin ? externalHref(candidate.linkedin) : null;
  const resumeUrl = candidate.resumeUrl ?? null;

  const initials = candidate.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <article
      className={cn(
        "group relative flex cursor-pointer items-center gap-4 rounded-[16px] border border-[rgba(15,23,42,0.05)]",
        "bg-white/95 px-4 py-4 sm:gap-5 sm:px-5 sm:py-[1.125rem]",
        "shadow-[0_1px_2px_rgba(15,23,42,0.03)]",
        hiringTransition,
        "hover:-translate-y-px hover:border-[rgba(15,61,46,0.12)] hover:bg-white",
        "hover:shadow-[0_4px_20px_-6px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,61,46,0.06)]",
        "dark:border-white/[0.06] dark:bg-surface/95 dark:hover:border-emerald-500/15",
      )}
      onClick={onOpenReport}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenReport();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View report for ${candidate.name}`}
    >
      {/* Avatar */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] text-[12px] font-semibold tracking-tight text-[#3F3F46] dark:border-white/[0.08] dark:bg-white/[0.04]">
        {initials}
      </div>

      {/* Identity */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold tracking-[-0.03em] text-[#18181B] dark:text-text">
          {candidate.name}
        </h3>
        <p className="mt-1 truncate text-[13px] font-medium text-[#52525B] dark:text-text-secondary/85">
          {candidate.email}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[#A1A1AA]">
          {normalizeSource(candidate.source as string)} · {formatAppliedDate(candidate.appliedAt)}
        </p>
      </div>

      {/* Stage + date + actions */}
      <div
        className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-end gap-1.5 text-right">
          {needsContact ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-tight text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
              Needs Contact
            </span>
          ) : isEngaged ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-tight text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
              Engaged
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight",
                stageBadgeClass(stage, candidate.currentSubstage),
              )}
            >
              {stage}
            </span>
          )}
          <p className="text-[10px] text-[#A1A1AA]">{candidate.currentSubstage}</p>
          <p className="text-[11px] tabular-nums text-[#A1A1AA]">{formatAppliedDate(candidate.appliedAt)}</p>
        </div>

        <div className="flex items-center gap-1.5">
          {needsContact ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  className={cn(
                    "h-8 gap-1.5 rounded-[10px] border border-amber-400/40 bg-amber-50 px-3 text-[12px] font-medium text-amber-700 shadow-sm",
                    hiringTransition,
                    "hover:bg-amber-100 hover:border-amber-400/60 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Contact Candidate
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[210] w-48 rounded-[12px] p-1.5">
                <DropdownMenuItem
                  className={menuItemClass}
                  onSelect={() => {
                    toast.success("Email composer opened");
                  }}
                >
                  <Mail className="h-3.5 w-3.5 opacity-55" strokeWidth={1.5} />
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={menuItemClass}
                  onSelect={() => {
                    toast.success("Scheduling calendar opened");
                  }}
                >
                  <Phone className="h-3.5 w-3.5 opacity-55" strokeWidth={1.5} />
                  Schedule Call
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  className={menuItemClass}
                  onSelect={() => {
                    markCandidateEngaged(candidate.id);
                    onMarkContacted?.(candidate.id);
                    toast.success(`${candidate.name} marked as engaged`);
                  }}
                >
                  <CheckCheck className="h-3.5 w-3.5 opacity-55" strokeWidth={1.5} />
                  Mark as Engaged
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          {linkedinUrl ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className={iconBtnClass}
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${candidate.name} on LinkedIn`}
              >
                <LinkedInBrandIcon />
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={iconBtnClass}
              disabled
              aria-label="LinkedIn profile unavailable"
            >
              <LinkedInBrandIcon disabled />
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={iconBtnClass}
            aria-label="Open resume"
            onClick={(e) => {
              e.stopPropagation();
              if (resumeUrl?.startsWith("http")) {
                window.open(resumeUrl, "_blank", "noopener,noreferrer");
              } else {
                onOpenResume();
              }
            }}
          >
            <FileType2 className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.06)] bg-white px-0 shadow-sm dark:bg-surface"
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4 text-[#71717A]" strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[210] w-52 rounded-[12px] p-1.5">
              {stage !== "Screening" ? (
                <DropdownMenuItem
                  className={menuItemClass}
                  onSelect={() => moveTo("Screening", "Applied")}
                >
                  <ArrowRight className="h-3.5 w-3.5 opacity-55" strokeWidth={1.5} />
                  Move to Screening
                </DropdownMenuItem>
              ) : null}
              {stage !== "Interviews" ? (
                <DropdownMenuItem
                  className={menuItemClass}
                  onSelect={() => moveTo("Interviews", "Technical Round 1")}
                >
                  <ArrowRight className="h-3.5 w-3.5 opacity-55" strokeWidth={1.5} />
                  Move to Interviews
                </DropdownMenuItem>
              ) : null}
              {stage !== "Hired & Offers" ? (
                <DropdownMenuItem
                  className={menuItemClass}
                  onSelect={() => moveTo("Hired & Offers", "Offer Sent")}
                >
                  <ArrowRight className="h-3.5 w-3.5 opacity-55" strokeWidth={1.5} />
                  Move to Hired & Offers
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator className="my-1" />
              {stage !== "Rejected" ? (
                <DropdownMenuItem
                  className={cn(menuItemClass, "text-red-600 focus:text-red-600")}
                  onSelect={handleReject}
                >
                  <UserX className="h-3.5 w-3.5 opacity-70" strokeWidth={1.5} />
                  Mark as Rejected
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className={menuItemClass} disabled>
                  <UserMinus className="h-3.5 w-3.5 opacity-55" strokeWidth={1.5} />
                  Already rejected
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
