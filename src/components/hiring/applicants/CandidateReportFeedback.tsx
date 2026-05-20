"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/context/RoleContext";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import {
  canEditOwnSubmittedFeedback,
  canEditRecruiterFeedback,
  canRequestFeedback,
  canSubmitInterviewerFeedback,
  getPreviewActorLabel,
  isInterviewerFeedbackReadOnly,
} from "@/lib/hiring/feedbackPermissions";
import {
  getInterviewFeedback,
  openInterviewFeedback,
  persistInterviewFeedback,
  resolveWorkflowStatus,
  saveInterviewFeedback,
  submitFeedbackRequest,
  type InterviewFeedbackBundle,
} from "@/lib/hiring/interviewFeedback";
import type { InterviewerReportContext } from "@/lib/hiring/interviewerReportContext";
import { EvaluationSidebar } from "./feedback/EvaluationSidebar";
import { InterviewerFeedbackWorkspace } from "./feedback/InterviewerFeedbackWorkspace";
import { RecruiterFeedbackWorkspace } from "./feedback/RecruiterFeedbackWorkspace";
import { FeedbackStatusBadge } from "./feedback/FeedbackStatusBadge";
import { PriorRoundFeedbackPanel } from "./feedback/PriorRoundFeedbackPanel";
import { RequestFeedbackModal } from "./feedback/RequestFeedbackModal";

export function CandidateReportFeedback({
  candidate,
  job,
  interviewerContext = null,
}: {
  candidate: HiringCandidate;
  job?: HiringJob | null;
  interviewerContext?: InterviewerReportContext | null;
}) {
  const { selectedRole } = useRole();
  const { data: session } = useSession();
  const [bundle, setBundle] = useState<InterviewFeedbackBundle>(() => getInterviewFeedback(candidate));
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<"interviewer" | "recruiter">("interviewer");
  const [evaluationTab, setEvaluationTab] = useState<"feedback" | "code" | "notes">("feedback");
  const openedRef = useRef(false);

  const actorName = session?.user?.name ?? getPreviewActorLabel(selectedRole);
  const jobTitle = job?.title ?? bundle.roleTitle ?? "Role";
  const workflowStatus = resolveWorkflowStatus(bundle);
  /** Only lock request CTA when feedback was formally submitted, not merely rated in draft */
  const isSubmitted = bundle.status === "submitted" || workflowStatus === "submitted";

  const isInterviewerMode = Boolean(interviewerContext);
  const canSubmit = canSubmitInterviewerFeedback(selectedRole) && (!isInterviewerMode || interviewerContext!.showFeedbackTab);
  const canRequest = canRequestFeedback(selectedRole) && !isInterviewerMode;
  const interviewerReadOnly =
    isInterviewerFeedbackReadOnly(selectedRole) ||
    (isSubmitted && !canEditOwnSubmittedFeedback(selectedRole, bundle, actorName));
  const canEditRecruiter = canEditRecruiterFeedback(selectedRole);

  useEffect(() => {
    openedRef.current = false;
    setBundle(getInterviewFeedback(candidate));
  }, [candidate.id]);

  useEffect(() => {
    if (!canSubmit || openedRef.current) return;
    openedRef.current = true;
    setBundle((b) => openInterviewFeedback(candidate.id, b, actorName));
  }, [candidate.id, canSubmit, actorName]);

  useEffect(() => {
    if (!interviewerContext?.assignedRound) return;
    setBundle((b) => ({
      ...b,
      interviewer: {
        ...b.interviewer,
        interviewRound: interviewerContext.assignedRound!,
        interviewDate:
          interviewerContext.assignedInterview?.scheduledAt?.split("·")[0]?.trim() ??
          b.interviewer.interviewDate,
      },
    }));
  }, [interviewerContext?.assignedRound, interviewerContext?.assignedInterview?.scheduledAt]);

  const patchInterviewer = (interviewer: InterviewFeedbackBundle["interviewer"]) => {
    setBundle((b) => ({ ...b, interviewer }));
  };

  const patchRecruiter = (recruiter: InterviewFeedbackBundle["recruiter"]) => {
    setBundle((b) => persistInterviewFeedback(candidate.id, { ...b, recruiter }));
  };

  const activeInterview =
    candidate.interviews.find((i) => i.status === "Completed") ?? candidate.interviews[0];

  const handleSubmit = () => {
    if (!canSubmit || interviewerReadOnly) return;
    setSaving(true);
    const saved = saveInterviewFeedback(candidate.id, bundle, "submitted", actorName);
    setSaving(false);
    setBundle(saved);
    toast.success("Feedback submitted successfully");
  };

  const handleRequestFeedback = async (input: { message: string; sendEmail: boolean }) => {
    setRequesting(true);
    try {
      const saved = submitFeedbackRequest(candidate.id, bundle, {
        actorName,
        message: input.message,
        sendEmail: input.sendEmail,
        candidate,
        jobTitle,
      });
      setBundle(saved);
      setRequestOpen(false);
      toast.success(
        input.sendEmail
          ? `Request sent to ${saved.interviewer.interviewerName} · in-app + email notification`
          : `Request sent to ${saved.interviewer.interviewerName} · switch to Interviewer role to preview their inbox`,
      );
    } catch {
      toast.error("Could not send feedback request");
    } finally {
      setRequesting(false);
    }
  };

  const headerActions = useMemo(() => {
    if (canRequest) {
      if (isSubmitted) {
        return (
          <Button type="button" size="sm" className="h-9 rounded-[9px] px-4" disabled>
            Feedback Submitted
          </Button>
        );
      }
      return (
        <Button
          type="button"
          size="sm"
          className="h-9 rounded-[9px] px-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setRequestOpen(true);
          }}
        >
          Request Feedback
        </Button>
      );
    }

    if (canSubmit) {
      return (
        <>
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-[9px] px-4"
            disabled={saving || (isSubmitted && interviewerReadOnly)}
            onClick={handleSubmit}
          >
            Submit Feedback
          </Button>
        </>
      );
    }

    return null;
  }, [canRequest, canSubmit, isSubmitted, evaluationTab, interviewerReadOnly, saving]);

  return (
    <>
      <div className="relative -mx-1 min-w-0 px-1">
        {isInterviewerMode && interviewerContext ? (
          <PriorRoundFeedbackPanel rounds={interviewerContext.priorRoundFeedback} />
        ) : null}

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <FeedbackStatusBadge bundle={bundle} />
        </div>

        <Tabs value={workspaceTab} onValueChange={(v) => setWorkspaceTab(v as "interviewer" | "recruiter")}>
          {canEditRecruiter ? (
            <TabsList size="compact" className="mb-4">
              <TabsTrigger value="interviewer" size="compact">
                Interviewer feedback
              </TabsTrigger>
              <TabsTrigger value="recruiter" size="compact">
                Recruiter feedback
              </TabsTrigger>
            </TabsList>
          ) : null}

          <TabsContent value="interviewer" className="mt-0 focus-visible:ring-0">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-5">
              <EvaluationSidebar
                data={bundle.interviewer}
                onChange={patchInterviewer}
                readOnly={interviewerReadOnly}
              />

              <main className="min-w-0 flex-1">
                <div className="sticky top-0 z-10 -mx-1 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(15,23,42,0.06)] bg-white/95 px-1 py-3 backdrop-blur-md dark:border-white/[0.06] dark:bg-surface/95">
                  <h2 className="text-[16px] font-semibold tracking-[-0.03em] text-[#18181B] dark:text-text">
                    Interview Evaluation
                  </h2>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">{headerActions}</div>
                </div>

                <InterviewerFeedbackWorkspace
                  data={bundle.interviewer}
                  onChange={patchInterviewer}
                  activeTab={evaluationTab}
                  onActiveTabChange={setEvaluationTab}
                  readOnly={interviewerReadOnly}
                  interviewId={activeInterview?.id}
                />
              </main>
            </div>
          </TabsContent>

          {canEditRecruiter ? (
            <TabsContent value="recruiter" className="mt-0 focus-visible:ring-0">
              <RecruiterFeedbackWorkspace data={bundle.recruiter} onChange={patchRecruiter} />
            </TabsContent>
          ) : null}
        </Tabs>
      </div>

      <RequestFeedbackModal
        open={requestOpen}
        onOpenChange={setRequestOpen}
        candidate={candidate}
        interviewer={bundle.interviewer}
        jobTitle={jobTitle}
        sending={requesting}
        onSend={handleRequestFeedback}
      />
    </>
  );
}
