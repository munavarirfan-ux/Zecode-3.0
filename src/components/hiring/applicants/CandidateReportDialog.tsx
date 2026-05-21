"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  MoreHorizontal,
  MoveRight,
  ArrowRight,
  Pencil,
  Phone,
  Send,
  Sparkles,
  Tag,
  User,
  UserX,
  Users,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonLg,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { EmailFeed } from "./EmailFeed";
import { getCandidateEditProfile, type CandidateEditProfile } from "@/lib/hiring/candidateProfile";
import { getCandidateById, moveCandidateToStage } from "@/lib/hiring/mockData";
import {
  displayCandidateName,
  resumeDisplayStatus,
} from "@/lib/hiring/candidateReportView";
import { getCandidateStage, normalizeSource, type HiringStageName } from "@/lib/hiring/stages";
import { CandidateReportOverview } from "./CandidateReportOverview";
import { CandidateReportProfile } from "./CandidateReportProfile";
import { CandidateReportFeedback } from "./CandidateReportFeedback";
import { CandidateInterviewsTab } from "./CandidateInterviewsTab";
import { CandidateTimelineTab } from "./CandidateTimelineTab";
import { CandidateAssessmentReport } from "./CandidateAssessmentReport";
import { DirectoryViewSwitcher } from "../directories/DirectoryViewSwitcher";
import {
  getCandidateReportModes,
  normalizeReportTab,
  SHELL_MODE_LABELS,
  shellModeToInitialTab,
  type CandidateReportContext,
  type CandidateReportShellMode,
} from "@/lib/hiring/candidateReportModes";
import {
  dashboardLabel,
  dashboardPanelInteractive,
  dashboardRowSurface,
  dashboardSectionSub,
  dashboardSectionTitle,
} from "@/components/dashboard/dashboardTokens";
import {
  hiringHeroPrimaryBtn,
  hiringHeroSecondaryBtnSm,
  hiringHeroReportStripRow,
  hiringHeroReportStripShell,
  hiringHeroStripActions,
  hiringHeroStripMetaLine,
  hiringHeroStripTitle,
  hiringTransition,
} from "../hiringTokens";
import { HiringHeroDecor } from "../HiringHeroDecor";
import { AddTagsDialog } from "./AddTagsDialog";
import { EditCandidateDialog } from "./EditCandidateDialog";
import { MoveApplicantDialog } from "./MoveApplicantDialog";
import { RequestApplicantTransferDialog } from "./RequestApplicantTransferDialog";
import { RejectApplicantDialog } from "./RejectApplicantDialog";
import { useRole } from "@/context/RoleContext";
import { canScheduleInterview } from "@/lib/hiring/feedbackPermissions";
import {
  canDirectMoveApplicant,
  canRequestApplicantTransfer,
  canUseMoveApplicantAction,
} from "@/lib/hiring/moveApplicantPermissions";
import { CandidateReportInterviewDialogs } from "./CandidateReportInterviewDialogs";
import { useCandidateInterviewScheduling } from "./useCandidateInterviewScheduling";
import { InterviewerHeroInterviewNotes } from "./InterviewerHeroInterviewNotes";
import {
  buildInterviewerReportContext,
  interviewerVisibleTabIds,
  isInterviewerReportRole,
  type InterviewerAssignmentOverride,
  type InterviewerReportContext,
} from "@/lib/hiring/interviewerReportContext";

const reportMenuItem =
  "flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 text-[12px] font-medium outline-none focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]";

const reportMenuContent =
  "z-[210] w-48 rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-white p-1.5 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.14)] dark:bg-surface";

/** Shared column width for hero, tabs, and body */
const REPORT_COLUMN = "mx-auto w-full min-w-0 max-w-full";
const REPORT_PAD_X = "px-5 sm:px-6";

const REPORT_TABS = [
  ["overview", "Overview"],
  ["profile", "Profile"],
  ["feedback", "Feedback"],
  ["emails", "Emails"],
  ["interviews", "Interviews"],
  ["timeline", "Timeline"],
  ["assessment", "Assessment"],
] as const;

const TABS_BY_SHELL: Record<CandidateReportShellMode, Array<(typeof REPORT_TABS)[number][0]>> = {
  overview: ["overview", "profile", "emails", "timeline"],
  assessment: ["assessment"],
  /** Hiring / interview pipeline — never includes assessment */
  interview: ["overview", "profile", "feedback", "emails", "interviews", "timeline"],
};

/** Dashboard hero — contained card, aligned to report column */
const reportAvatar =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.16] bg-white/[0.1] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:h-14 sm:w-14 sm:text-base";

const heroPrimaryActionBtn = cn(hiringHeroPrimaryBtn, "h-9 gap-1.5 rounded-[11px] px-4 text-[13px]");

const heroSecondaryActionBtn = hiringHeroSecondaryBtnSm;

const heroKebabBtn = cn(
  "h-9 w-9 rounded-[11px] border-0 p-0 text-white shadow-none backdrop-blur-sm",
  hiringTransition,
  "bg-white/[0.14] hover:bg-white/[0.2]",
);

const heroGlassMeta =
  "inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-md [&_svg]:text-white";

function Panel({
  title,
  children,
  className,
  action,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={cn(dashboardPanelInteractive, "p-2 sm:p-2.5", className)}>
      {title ? (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <h3 className={dashboardSectionTitle}>{title}</h3>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function CandidateReportHero({
  candidate,
  job,
  profile,
  initials,
  onClose,
  onMoveApplicant,
  onEditCandidate,
  onAddTags,
  onMoveToStage,
  onRejectApplicant,
  canSchedule,
  canMoveApplicant,
  onScheduleInterview,
}: {
  candidate: HiringCandidate;
  job: HiringJob;
  profile: CandidateEditProfile;
  initials: string;
  onClose: () => void;
  onMoveApplicant: () => void;
  canMoveApplicant: boolean;
  onEditCandidate: () => void;
  onAddTags: () => void;
  onMoveToStage: (stage: HiringStageName, substage?: string) => void;
  onRejectApplicant: () => void;
  canSchedule: boolean;
  onScheduleInterview: () => void;
}) {
  const stage = getCandidateStage(candidate);
  const source = normalizeSource(profile.application.source);
  const resumeStatus = resumeDisplayStatus(profile, candidate);
  const location = candidate.location?.trim();

  return (
    <header className={hiringHeroReportStripShell}>
      <HiringHeroDecor />

      <div className={cn(hiringHeroReportStripRow, "relative w-full")}>
        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
          <div className={reportAvatar}>{initials}</div>
          <div className="min-w-0 space-y-2">
              <DialogTitle className={cn(hiringHeroStripTitle, "text-left")}>
                {displayCandidateName(profile, candidate.name)}
              </DialogTitle>
              <p className={hiringHeroStripMetaLine}>{job.title}</p>
              <DialogDescription asChild>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={heroGlassMeta}>
                      <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {profile.email || candidate.email}
                    </span>
                    <span className={heroGlassMeta}>
                      <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {profile.mobile || candidate.phone}
                    </span>
                    {location && location !== "—" ? (
                      <span className={heroGlassMeta}>
                        <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                        {location}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={heroGlassMeta}>
                      <Briefcase className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {stage}
                    </span>
                    <span className={heroGlassMeta}>
                      <Tag className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {source}
                    </span>
                    <span className={heroGlassMeta}>
                      <User className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {candidate.recruiterOwner}
                    </span>
                    <span className={heroGlassMeta}>
                      <FileText className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      Resume: {resumeStatus}
                    </span>
                  </div>
                </div>
              </DialogDescription>
            </div>
          </div>

          <div className={hiringHeroStripActions}>
            {canMoveApplicant ? (
              <Button type="button" size="sm" className={heroSecondaryActionBtn} onClick={onMoveApplicant}>
                <MoveRight className="h-4 w-4" strokeWidth={1.5} />
                Move Applicant
              </Button>
            ) : null}
            {canSchedule ? (
              <Button type="button" size="sm" className={heroPrimaryActionBtn} onClick={onScheduleInterview}>
                <Calendar className="h-4 w-4" strokeWidth={1.5} />
                Schedule
              </Button>
            ) : null}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="sm" className={heroKebabBtn} aria-label="More actions">
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={reportMenuContent}>
                <DropdownMenuItem className={reportMenuItem} onSelect={onEditCandidate}>
                  <Pencil className="h-3.5 w-3.5 shrink-0 opacity-55" strokeWidth={1.5} />
                  Edit Candidate
                </DropdownMenuItem>
                <DropdownMenuItem className={reportMenuItem} onSelect={onAddTags}>
                  <Tag className="h-3.5 w-3.5 shrink-0 opacity-55" strokeWidth={1.5} />
                  Add Tags
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                {stage !== "Screening" ? (
                  <DropdownMenuItem
                    className={reportMenuItem}
                    onSelect={() => onMoveToStage("Screening", "Applied")}
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-55" strokeWidth={1.5} />
                    Move to Screening
                  </DropdownMenuItem>
                ) : null}
                {stage !== "Interviews" ? (
                  <DropdownMenuItem
                    className={reportMenuItem}
                    onSelect={() => onMoveToStage("Interviews", "Technical Round 1")}
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-55" strokeWidth={1.5} />
                    Move to Interviews
                  </DropdownMenuItem>
                ) : null}
                {stage !== "Hired & Offers" ? (
                  <DropdownMenuItem
                    className={reportMenuItem}
                    onSelect={() => onMoveToStage("Hired & Offers", "Offer Sent")}
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-55" strokeWidth={1.5} />
                    Move to Hired & Offers
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  className={cn(reportMenuItem, "text-red-600 focus:text-red-600 data-[highlighted]:text-red-600")}
                  onSelect={onRejectApplicant}
                >
                  <UserX className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.5} />
                  Reject Applicant
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogClose
                  className={dialogCloseButtonLg}
                  onClick={onClose}
                  aria-label="Close report"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                </DialogClose>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                Close report
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
    </header>
  );
}

function InterviewerCandidateReportHero({
  candidate,
  job,
  profile,
  initials,
  ctx,
  onClose,
}: {
  candidate: HiringCandidate;
  job: HiringJob;
  profile: CandidateEditProfile;
  initials: string;
  ctx: InterviewerReportContext;
  onClose: () => void;
}) {
  const hasNotes = ctx.isAssignedCompleted && ctx.sessionNoteBullets.length > 0;

  return (
    <header
      className={cn(
        hiringHeroReportStripShell,
        "!overflow-visible",
        hasNotes && "pb-24 sm:pb-12 lg:pb-10",
      )}
    >
      <HiringHeroDecor />

      <div className={cn(hiringHeroReportStripRow, "relative w-full pr-12 lg:pr-14")}>
        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
          <div className={reportAvatar}>{initials}</div>
          <div className="min-w-0 space-y-2">
              <DialogTitle className={cn(hiringHeroStripTitle, "text-left")}>
                {displayCandidateName(profile, candidate.name)}
              </DialogTitle>
              <p className={hiringHeroStripMetaLine}>{job.title}</p>

              <div className="flex flex-wrap gap-2">
                {ctx.assignedRound ? (
                  <span className={heroGlassMeta}>{ctx.assignedRound}</span>
                ) : null}
                {ctx.scheduledLabel ? (
                  <span className={heroGlassMeta}>{ctx.scheduledLabel}</span>
                ) : null}
                {ctx.isAssignedCompleted ? (
                  <span className={heroGlassMeta}>
                    <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    Interview completed
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

      {ctx.isAssignedCompleted ? (
        <InterviewerHeroInterviewNotes
          bullets={ctx.sessionNoteBullets}
          capturedRound={ctx.sessionNotesRound}
        />
      ) : null}

      <Tooltip>
        <TooltipTrigger asChild>
          <DialogClose
            className={cn(
              "absolute right-4 top-4 z-30 sm:right-5 sm:top-5",
              dialogCloseButtonLg,
            )}
            onClick={onClose}
            aria-label="Close report"
          >
            <X className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </DialogClose>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          Close report
        </TooltipContent>
      </Tooltip>
    </header>
  );
}

export function CandidateReportDialog({
  candidate,
  job,
  open,
  onOpenChange,
  initialTab = "overview",
  reportContext = "job",
  focusRound,
  interviewerAssignment,
  onApplicantMoved,
  onCandidateUpdated,
}: {
  candidate: HiringCandidate | null;
  job: HiringJob;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: string;
  /** `directory` = global Candidates sidebar (may switch assessment + interview) */
  reportContext?: CandidateReportContext;
  /** Interviewer workspace: assigned panel round for tab + hero context */
  focusRound?: string;
  interviewerAssignment?: InterviewerAssignmentOverride;
  onApplicantMoved?: () => void;
  onCandidateUpdated?: (candidate: HiringCandidate) => void;
}) {
  const [moveOpen, setMoveOpen] = useState(false);
  const [transferRequestOpen, setTransferRequestOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [shellMode, setShellMode] = useState<CandidateReportShellMode>("overview");
  const [liveCandidate, setLiveCandidate] = useState<HiringCandidate | null>(candidate);
  const editReturnFocusRef = useRef<HTMLElement | null>(null);
  const { selectedRole } = useRole();
  const { data: session } = useSession();
  const canSchedule = canScheduleInterview(selectedRole);
  const canMoveApplicant = canUseMoveApplicantAction(selectedRole);
  const canDirectMove = canDirectMoveApplicant(selectedRole);
  const canRequestTransfer = canRequestApplicantTransfer(selectedRole);

  const reportModes = useMemo(
    () => (liveCandidate ? getCandidateReportModes(liveCandidate, reportContext) : null),
    [liveCandidate, reportContext],
  );

  const interviewerCtx = useMemo(
    () =>
      liveCandidate
        ? buildInterviewerReportContext(
            liveCandidate,
            selectedRole,
            session?.user?.name,
            focusRound,
            interviewerAssignment,
          )
        : null,
    [liveCandidate, selectedRole, session?.user?.name, focusRound, interviewerAssignment],
  );

  const isInterviewerMode = Boolean(interviewerCtx);

  const useShellModes = Boolean(reportModes?.showSwitcher) && !isInterviewerMode;

  const visibleReportTabs = useMemo(() => {
    if (isInterviewerMode && interviewerCtx) {
      const allowed = interviewerVisibleTabIds(interviewerCtx);
      return REPORT_TABS.filter(([id]) => allowed.includes(id));
    }
    const allowed = TABS_BY_SHELL[shellMode];
    return REPORT_TABS.filter(([id]) => allowed.includes(id));
  }, [shellMode, isInterviewerMode, interviewerCtx]);

  useEffect(() => {
    setLiveCandidate(candidate);
    if (!candidate) return;
    const modes = getCandidateReportModes(candidate, reportContext);
    const nextShell = isInterviewerReportRole(selectedRole) ? "interview" : modes.defaultShellMode;
    setShellMode(nextShell);
    const ctx = buildInterviewerReportContext(
      candidate,
      selectedRole,
      session?.user?.name,
      focusRound,
      interviewerAssignment,
    );
    const allowed = ctx ? interviewerVisibleTabIds(ctx) : TABS_BY_SHELL[nextShell];
    setActiveTab(normalizeReportTab(initialTab, allowed));
  }, [candidate, initialTab, reportContext, selectedRole, session?.user?.name, focusRound, interviewerAssignment]);

  useEffect(() => {
    if (!isInterviewerMode || !interviewerCtx) return;
    const allowed = interviewerVisibleTabIds(interviewerCtx);
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0] ?? "overview");
    }
  }, [isInterviewerMode, interviewerCtx, activeTab]);

  const profile = useMemo(
    () => (liveCandidate ? getCandidateEditProfile(liveCandidate, job) : null),
    [liveCandidate, job],
  );

  const handleCandidateUpdated = useCallback(
    (updated: HiringCandidate) => {
      setLiveCandidate(updated);
      onCandidateUpdated?.(updated);
    },
    [onCandidateUpdated],
  );

  const {
    scheduleTarget,
    cancelTarget,
    cancelling,
    openSchedule,
    openReschedule,
    openViewSchedule,
    openCancel,
    confirmCancel,
    handleScheduled,
    closeSchedule,
    closeCancel,
  } = useCandidateInterviewScheduling({
    candidate: liveCandidate,
    job,
    onCandidateUpdated: handleCandidateUpdated,
  });

  const interviewFlows = useMemo(
    () => ({
      canSchedule,
      openSchedule,
      openReschedule,
      openCancel,
      openViewSchedule,
    }),
    [canSchedule, openSchedule, openReschedule, openCancel, openViewSchedule],
  );

  if (!candidate || !liveCandidate || !profile) return null;

  const handleMoveToStage = (stage: HiringStageName, substage?: string) => {
    const result = moveCandidateToStage(liveCandidate.id, stage, { substage });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Moved to ${stage}`);
    handleCandidateUpdated(result.candidate);
  };

  const initials = displayCandidateName(profile, liveCandidate.name)
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[200] bg-[rgba(15,23,42,0.48)] backdrop-blur-[6px]" />
          <div
            className={cn(
              "fixed inset-0 z-[200] flex items-center justify-center max-sm:items-stretch",
              "px-4 pt-[max(20px,env(safe-area-inset-top))] pb-[max(20px,env(safe-area-inset-bottom))] sm:px-8 sm:py-8",
            )}
          >
            <DialogPanel
              className={cn(
                "relative flex h-[min(900px,calc(100dvh-4rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] flex-col overflow-hidden bg-white dark:bg-surface",
                "w-[calc(100vw-2rem)] max-w-[1400px]",
                "rounded-[16px] border border-[rgba(15,23,42,0.08)]",
                "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_80px_-24px_rgba(15,23,42,0.28)]",
                "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
                "max-sm:h-[100dvh] max-sm:max-h-none max-sm:w-full max-sm:rounded-none max-sm:border-0",
              )}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
              >
                <div className={cn("shrink-0", REPORT_COLUMN, REPORT_PAD_X, "pb-5 pt-5 sm:pb-6 sm:pt-6")}>
                  {isInterviewerMode && interviewerCtx ? (
                    <InterviewerCandidateReportHero
                      candidate={liveCandidate}
                      job={job}
                      profile={profile}
                      initials={initials}
                      ctx={interviewerCtx}
                      onClose={() => onOpenChange(false)}
                    />
                  ) : (
                    <CandidateReportHero
                      candidate={liveCandidate}
                      job={job}
                      profile={profile}
                      initials={initials}
                      onClose={() => onOpenChange(false)}
                      onMoveApplicant={() => {
                        if (canDirectMove) setMoveOpen(true);
                        else if (canRequestTransfer) setTransferRequestOpen(true);
                      }}
                      canMoveApplicant={canMoveApplicant}
                      onEditCandidate={() => {
                        editReturnFocusRef.current = document.activeElement as HTMLElement;
                        setEditOpen(true);
                      }}
                      onAddTags={() => setTagsOpen(true)}
                      onMoveToStage={handleMoveToStage}
                      onRejectApplicant={() => setRejectOpen(true)}
                      canSchedule={canSchedule}
                      onScheduleInterview={() => {
                        setActiveTab("interviews");
                        openSchedule();
                      }}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    REPORT_COLUMN,
                    REPORT_PAD_X,
                    "sticky top-0 z-10 shrink-0 space-y-3 border-b border-[rgba(15,23,42,0.06)] bg-white/95 py-2 backdrop-blur-md dark:border-white/[0.06] dark:bg-surface/95",
                  )}
                >
                  {useShellModes && reportModes ? (
                    <DirectoryViewSwitcher
                      value={shellMode}
                      onChange={(mode) => {
                        setShellMode(mode);
                        setActiveTab(shellModeToInitialTab(mode));
                      }}
                      options={reportModes.shellModes.map((mode) => ({
                        value: mode,
                        label: SHELL_MODE_LABELS[mode],
                      }))}
                      className="w-full max-w-full sm:w-auto"
                    />
                  ) : null}
                  <TabsList className="h-auto w-full justify-start gap-0 border-0 bg-transparent p-0">
                    {visibleReportTabs.map(([id, label]) => (
                      <TabsTrigger key={id} value={id} className="rounded-none">
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div
                  className={cn(
                    REPORT_COLUMN,
                    REPORT_PAD_X,
                    "relative min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 sm:py-5",
                  )}
                >
                  <TabsContent value="overview" className="mt-0 min-h-0 focus-visible:ring-0">
                    <CandidateReportOverview
                      candidate={liveCandidate}
                      job={job}
                      profile={profile}
                      variant={isInterviewerMode ? "interviewer" : "default"}
                      onCandidateUpdated={handleCandidateUpdated}
                    />
                  </TabsContent>

                  <TabsContent value="profile" className="mt-0 min-h-0 focus-visible:ring-0">
                    <CandidateReportProfile
                      candidate={liveCandidate}
                      profile={profile}
                      onCandidateUpdated={handleCandidateUpdated}
                    />
                  </TabsContent>

                  <TabsContent value="feedback" className="mt-0 min-h-0 focus-visible:ring-0">
                    <CandidateReportFeedback
                      candidate={liveCandidate}
                      job={job}
                      interviewerContext={interviewerCtx}
                    />
                  </TabsContent>

                  <TabsContent value="emails" className="mt-0 min-h-0 focus-visible:ring-0">
                    <Panel title="Email activity">
                      <EmailFeed emails={liveCandidate.emails} />
                    </Panel>
                  </TabsContent>

                  <TabsContent value="interviews" className="mt-0 min-h-0 focus-visible:ring-0">
                    <CandidateInterviewsTab
                      candidate={liveCandidate}
                      job={job}
                      onOpenFeedback={() => setActiveTab("feedback")}
                      interviewFlows={interviewFlows}
                    />
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-0 min-h-0 focus-visible:ring-0">
                    <CandidateTimelineTab candidate={liveCandidate} />
                  </TabsContent>

                  <TabsContent value="assessment" className="mt-0 min-h-0 focus-visible:ring-0">
                    <CandidateAssessmentReport candidate={liveCandidate} job={job} />
                  </TabsContent>
                </div>
              </Tabs>
            </DialogPanel>
          </div>
        </DialogPortal>
      </Dialog>

      {!isInterviewerMode && canDirectMove ? (
        <MoveApplicantDialog
          open={moveOpen}
          onOpenChange={setMoveOpen}
          candidate={liveCandidate}
          currentJob={job}
          onMoved={() => {
            onApplicantMoved?.();
            onOpenChange(false);
          }}
        />
      ) : null}

      {!isInterviewerMode && canRequestTransfer ? (
        <RequestApplicantTransferDialog
          open={transferRequestOpen}
          onOpenChange={setTransferRequestOpen}
          candidate={liveCandidate}
          currentJob={job}
          onSubmitted={() => {
            const refreshed = getCandidateById(liveCandidate.id);
            if (refreshed) handleCandidateUpdated(refreshed);
          }}
        />
      ) : null}

      {!isInterviewerMode ? (
        <>
          <EditCandidateDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            candidate={liveCandidate}
            job={job}
            onSaved={handleCandidateUpdated}
            returnFocusRef={editReturnFocusRef}
          />

          <AddTagsDialog
            open={tagsOpen}
            onOpenChange={setTagsOpen}
            candidate={liveCandidate}
            job={job}
            onSaved={handleCandidateUpdated}
          />

          <RejectApplicantDialog
            open={rejectOpen}
            onOpenChange={setRejectOpen}
            candidate={liveCandidate}
            onRejected={(updated) => {
              handleCandidateUpdated(updated);
              onOpenChange(false);
            }}
          />
        </>
      ) : null}

      <CandidateReportInterviewDialogs
        candidate={liveCandidate}
        scheduleTarget={scheduleTarget}
        cancelTarget={cancelTarget}
        cancelling={cancelling}
        onScheduleOpenChange={(open) => {
          if (!open) closeSchedule();
        }}
        onCancelOpenChange={(open) => {
          if (!open) closeCancel();
        }}
        onScheduled={handleScheduled}
        onConfirmCancel={confirmCancel}
      />
    </>
  );
}
