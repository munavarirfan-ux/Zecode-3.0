"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  dialogCloseButtonOnDarkClass,
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
import { cn } from "@/lib/utils";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { EmailFeed } from "./EmailFeed";
import { getCandidateEditProfile, type CandidateEditProfile } from "@/lib/hiring/candidateProfile";
import { moveCandidateToStage } from "@/lib/hiring/mockData";
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
import {
  dashboardLabel,
  dashboardPanelInteractive,
  dashboardRowSurface,
  dashboardSectionSub,
  dashboardSectionTitle,
} from "@/components/dashboard/dashboardTokens";
import { hiringHeroRadialOverlay, hiringHeroShell, hiringTransition } from "../hiringTokens";
import { HiringHeroTexture } from "../HiringHeroTexture";
import { AddTagsDialog } from "./AddTagsDialog";
import { EditCandidateDialog } from "./EditCandidateDialog";
import { MoveApplicantDialog } from "./MoveApplicantDialog";
import { RejectApplicantDialog } from "./RejectApplicantDialog";
import { useRole } from "@/context/RoleContext";
import { canScheduleInterview } from "@/lib/hiring/feedbackPermissions";
import { CandidateReportInterviewDialogs } from "./CandidateReportInterviewDialogs";
import { useCandidateInterviewScheduling } from "./useCandidateInterviewScheduling";

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
] as const;

/** Dashboard hero — contained card, aligned to report column */
const reportHeroShell = cn(
  hiringHeroShell,
  "shrink-0 rounded-[16px] border-b-0 shadow-none",
  "!px-7 !py-7 sm:!px-8 sm:!py-8 lg:!px-10 lg:!py-9",
  "min-h-[11.5rem] sm:min-h-[12.5rem]",
);

const heroGlassMeta =
  "inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-md [&_svg]:text-white";

const heroActionBtn = cn(
  "h-10 gap-1.5 rounded-[10px] px-3.5 text-[13px] font-medium",
  "border-white/[0.16] bg-white/[0.1] text-white/90 shadow-none backdrop-blur-sm",
  "hover:bg-white/[0.14] hover:text-white",
);

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
  onScheduleInterview,
}: {
  candidate: HiringCandidate;
  job: HiringJob;
  profile: CandidateEditProfile;
  initials: string;
  onClose: () => void;
  onMoveApplicant: () => void;
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
    <header className={reportHeroShell}>
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden style={hiringHeroRadialOverlay} />

      <div className="relative w-full">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-white/[0.16] bg-white/[0.1] text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:h-16 sm:w-16 sm:text-lg">
              {initials}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-[1.5rem] font-semibold tracking-[-0.035em] text-white sm:text-[1.75rem]">
                {displayCandidateName(profile, candidate.name)}
              </DialogTitle>
              <p className="mt-1.5 text-[14px] text-white/68 sm:text-[15px]">{job.title}</p>
              <DialogDescription asChild>
                <div className="mt-4 space-y-2">
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

          <div className="flex flex-wrap items-center gap-2 lg:shrink-0 lg:justify-end">
            <Button variant="outline" size="sm" className={heroActionBtn} onClick={onMoveApplicant}>
              <MoveRight className="h-4 w-4" strokeWidth={1.5} />
              Move Applicant
            </Button>
            {canSchedule ? (
              <Button variant="outline" size="sm" className={heroActionBtn} onClick={onScheduleInterview}>
                <Calendar className="h-4 w-4" strokeWidth={1.5} />
                Schedule
              </Button>
            ) : null}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn(heroActionBtn, "w-10 px-0")}>
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
                    onSelect={() => onMoveToStage("Hired & Offers", "Offer Draft")}
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
            <DialogClose
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/[0.16] bg-white/[0.08] backdrop-blur-sm",
                dialogCloseButtonOnDarkClass,
                hiringTransition,
              )}
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </DialogClose>
          </div>
        </div>
      </div>
    </header>
  );
}


export function CandidateReportDialog({
  candidate,
  job,
  open,
  onOpenChange,
  initialTab = "overview",
  onApplicantMoved,
  onCandidateUpdated,
}: {
  candidate: HiringCandidate | null;
  job: HiringJob;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: string;
  onApplicantMoved?: () => void;
  onCandidateUpdated?: (candidate: HiringCandidate) => void;
}) {
  const [moveOpen, setMoveOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [liveCandidate, setLiveCandidate] = useState<HiringCandidate | null>(candidate);
  const editReturnFocusRef = useRef<HTMLElement | null>(null);
  const { selectedRole } = useRole();
  const canSchedule = canScheduleInterview(selectedRole);

  useEffect(() => {
    setLiveCandidate(candidate);
    setActiveTab(initialTab);
  }, [candidate, initialTab]);

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
                  <CandidateReportHero
                    candidate={liveCandidate}
                    job={job}
                    profile={profile}
                    initials={initials}
                  onClose={() => onOpenChange(false)}
                  onMoveApplicant={() => setMoveOpen(true)}
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
                </div>

                <div
                  className={cn(
                    REPORT_COLUMN,
                    REPORT_PAD_X,
                    "sticky top-0 z-10 shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-white/95 backdrop-blur-md dark:border-white/[0.06] dark:bg-surface/95",
                  )}
                >
                  <TabsList className="h-auto w-full justify-start gap-0 border-0 bg-transparent p-0">
                    {REPORT_TABS.map(([id, label]) => (
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
                    <CandidateReportFeedback candidate={liveCandidate} job={job} />
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
                </div>
              </Tabs>
            </DialogPanel>
          </div>
        </DialogPortal>
      </Dialog>

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
