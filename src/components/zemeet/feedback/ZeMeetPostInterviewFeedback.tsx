"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import {
  computeFeedbackCompletion,
  createSkillEntry,
  openInterviewFeedback,
  validateInterviewerFeedbackSubmit,
  type InterviewFeedbackBundle,
} from "@/lib/hiring/interviewFeedback";
import { buildPostCallFeedbackBundle } from "@/lib/zemeet/feedbackBridge";
import {
  codeChallengeArtifactFromState,
  saveZeMeetInterviewFeedbackDraft,
  submitZeMeetInterviewFeedback,
  syncZeMeetArtifactToCandidateReport,
} from "@/lib/zemeet/sync";
import type { ZeMeetNoteEntry, ZeMeetSessionArtifact } from "@/lib/zemeet/types";
import { cn } from "@/lib/utils";
import { FeedbackActionDock } from "./workspace/FeedbackActionDock";
import { FeedbackEditorialSkills } from "./workspace/FeedbackEditorialSkills";
import { FeedbackReviewHeader } from "./workspace/FeedbackReviewHeader";
import { FeedbackWorkspaceHeading } from "./workspace/FeedbackWorkspaceHeading";
import { FeedbackReviewSidebar } from "./workspace/FeedbackReviewSidebar";
import { SessionNotesBoard } from "./workspace/SessionNotesBoard";
import { AutoGrowTextarea } from "./workspace/AutoGrowTextarea";
import {
  compactInput,
  expandLink,
  feedbackCardShell,
  feedbackColumn,
  feedbackModalPanel,
  feedbackModalScroll,
  resolveSessionNotesForDisplay,
  workspaceContent,
  workspaceMain,
  workspaceOverlay,
  workspaceRail,
  wsText,
} from "./workspace/feedbackWorkspaceTokens";

export function ZeMeetPostInterviewFeedback({ onComplete }: { onComplete: () => void }) {
  const { session, phase, notes, codeChallenge, elapsedSeconds } = useZeMeet();
  const { data: authSession } = useSession();
  const actorName =
    authSession?.user?.name ??
    session.participants.find((p) => p.id === session.viewerId)?.name ??
    "Interviewer";

  const [bundle, setBundle] = useState<InterviewFeedbackBundle | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [showClosing, setShowClosing] = useState(false);
  const [notesBoardOpen, setNotesBoardOpen] = useState(false);

  useEffect(() => {
    if (phase !== "feedback") return;
    try {
      const initial = buildPostCallFeedbackBundle(
        session,
        notes,
        codeChallenge,
        elapsedSeconds,
      );
      setBundle(openInterviewFeedback(session.context.candidateId, initial, actorName));
      if (initial.interviewer.additionalInterviewNotes.trim()) {
        setShowClosing(true);
      }
    } catch {
      toast.error("Could not load feedback workspace");
    }
  }, [phase, session, notes, codeChallenge, elapsedSeconds, actorName]);

  const patchInterviewer = useCallback(
    (interviewer: InterviewFeedbackBundle["interviewer"]) => {
      setBundle((b) => (b ? { ...b, interviewer } : b));
      if (saveState === "saved") setSaveState("idle");
    },
    [saveState],
  );

  const buildArtifact = useCallback((): ZeMeetSessionArtifact => {
    return {
      roomId: session.context.roomId,
      candidateId: session.context.candidateId,
      interviewId: session.context.interviewId,
      notes,
      codeChallenge:
        codeChallenge.status === "completed" || codeChallenge.status === "active"
          ? codeChallengeArtifactFromState(codeChallenge)
          : undefined,
      endedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
    };
  }, [session, notes, codeChallenge, elapsedSeconds]);

  const handleSaveDraft = async () => {
    if (!bundle) return;
    setSaving(true);
    setSaveState("saving");
    try {
      const saved = saveZeMeetInterviewFeedbackDraft({
        candidateId: session.context.candidateId,
        bundle,
        actorName,
      });
      setBundle(saved);
      syncZeMeetArtifactToCandidateReport(buildArtifact());
      setSaveState("saved");
      toast.success("Draft saved");
    } catch {
      toast.error("Could not save draft");
      setSaveState("idle");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!bundle) return;
    const validation = validateInterviewerFeedbackSubmit(bundle.interviewer);
    if (!validation.valid) {
      validation.errors.forEach((e) => toast.error(e));
      return;
    }
    setSubmitting(true);
    try {
      submitZeMeetInterviewFeedback({
        candidateId: session.context.candidateId,
        interviewId: session.context.interviewId,
        bundle,
        actorName,
        artifact: buildArtifact(),
      });
      toast.success("Feedback submitted");
      onComplete();
    } catch {
      toast.error("Could not submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (phase !== "feedback" || !bundle) return null;

  const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
  const completion = computeFeedbackCompletion(bundle.interviewer);
  const sessionNotes = resolveSessionNotesForDisplay(notes, bundle.interviewer.notes);

  return (
    <div className={workspaceOverlay} data-zemeet-feedback-theme="light" role="presentation">
      <div
        className={cn(
          "flex w-full flex-col items-stretch justify-center gap-4",
          notesBoardOpen
            ? "max-w-[min(1380px,calc(100vw-1.5rem))] lg:flex-row lg:items-stretch"
            : "max-w-[960px]",
        )}
      >
      <div
        className={cn(feedbackModalPanel, "flex min-h-0 min-w-0 flex-1 flex-col")}
        role="dialog"
        aria-modal="true"
        aria-label="Submit feedback"
      >
        <div className={feedbackModalScroll}>
          <div className={feedbackColumn}>
            <FeedbackWorkspaceHeading />
            <FeedbackReviewHeader
              context={session.context}
              interviewerName={bundle.interviewer.interviewerName}
              durationMinutes={durationMinutes}
              saveState={saveState}
              completionPercent={completion}
              sessionNotes={sessionNotes}
              onOpenNotesBoard={() => setNotesBoardOpen(true)}
              notesBoardOpen={notesBoardOpen}
            />

            <div className={workspaceContent}>
              <main className={workspaceMain}>
                <FeedbackEditorialSkills
                  skills={bundle.interviewer.skills}
                  onChange={(skills) => patchInterviewer({ ...bundle.interviewer, skills })}
                  onAddField={() =>
                    patchInterviewer({
                      ...bundle.interviewer,
                      skills: [
                        ...bundle.interviewer.skills,
                        createSkillEntry("Custom skill", { custom: true, rating: 0 }),
                      ],
                    })
                  }
                />

                <div className="mt-6">
                  {!showClosing && !bundle.interviewer.additionalInterviewNotes.trim() ? (
                    <button
                      type="button"
                      className={expandLink}
                      onClick={() => setShowClosing(true)}
                    >
                      + Add closing thoughts
                    </button>
                  ) : (
                    <div className={cn(feedbackCardShell(), "space-y-3")}>
                      <p className={cn("text-[11px] font-medium", wsText("muted"))}>
                        Closing thoughts
                      </p>
                      <AutoGrowTextarea
                        value={bundle.interviewer.additionalInterviewNotes}
                        onChange={(additionalInterviewNotes) =>
                          patchInterviewer({ ...bundle.interviewer, additionalInterviewNotes })
                        }
                        placeholder="Overall impressions, panel context, follow-ups…"
                        className={compactInput}
                        minRows={2}
                      />
                    </div>
                  )}
                </div>
              </main>

              <div className={workspaceRail}>
                <FeedbackReviewSidebar
                  data={bundle.interviewer}
                  onChange={patchInterviewer}
                  interviewId={session.context.interviewId}
                  completionPercent={completion}
                />
              </div>
            </div>
          </div>
        </div>

        <FeedbackActionDock
          saving={saving}
          submitting={submitting}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
        />
      </div>

      {notesBoardOpen ? (
        <SessionNotesBoard notes={sessionNotes} onClose={() => setNotesBoardOpen(false)} />
      ) : null}
      </div>
    </div>
  );
}
