"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import {
  ASSESSMENTS_UPDATED_EVENT,
  getAssessmentById,
  setAssessmentEnabled,
} from "@/lib/hiring/assessments/assessmentStore";
import {
  ASSESSMENT_CANDIDATES_UPDATED_EVENT,
  getAssessmentCandidateStats,
} from "@/lib/hiring/assessments/assessmentCandidates";
import type { AssessmentCandidateRecord } from "@/lib/hiring/assessments/types";
import { hiringCanvas } from "../hiringTokens";
import { AssessmentDetailHero } from "./AssessmentDetailHero";
import { AssessmentCandidateDirectory } from "./AssessmentCandidateDirectory";
import { AssessmentCandidateReportDialog } from "./AssessmentCandidateReportDialog";
import { InviteCandidateDialog } from "./InviteCandidateDialog";
import { BulkInviteDialog } from "./BulkInviteDialog";
import { ShareAssessmentDialog } from "./ShareAssessmentDialog";
import { DisableAssessmentDialog } from "./DisableAssessmentDialog";

export function AssessmentDetailPage({ assessmentId }: { assessmentId: string }) {
  const [refresh, setRefresh] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [reportCandidate, setReportCandidate] = useState<AssessmentCandidateRecord | null>(null);

  useEffect(() => {
    const bump = () => setRefresh((n) => n + 1);
    window.addEventListener(ASSESSMENTS_UPDATED_EVENT, bump);
    window.addEventListener(ASSESSMENT_CANDIDATES_UPDATED_EVENT, bump);
    return () => {
      window.removeEventListener(ASSESSMENTS_UPDATED_EVENT, bump);
      window.removeEventListener(ASSESSMENT_CANDIDATES_UPDATED_EVENT, bump);
    };
  }, []);

  const assessment = useMemo(() => getAssessmentById(assessmentId), [assessmentId, refresh]);
  const stats = useMemo(
    () => (assessment ? getAssessmentCandidateStats(assessment.id) : null),
    [assessment, refresh],
  );

  if (!assessment) {
    return (
      <div className={cn(hiringCanvas, "flex min-h-[50vh] flex-col items-center justify-center gap-3")}>
        <p className="text-[15px] font-semibold text-text">Assessment not found</p>
        <Button asChild variant="outline" className="rounded-[10px]">
          <Link href={ROUTES.assessments}>Back to assessments</Link>
        </Button>
      </div>
    );
  }

  const bumpRefresh = () => setRefresh((n) => n + 1);

  return (
    <div className={hiringCanvas}>
      <div className="mx-auto max-w-shell space-y-5 pb-8 sm:space-y-6">
        <AssessmentDetailHero
          assessment={assessment}
          stats={stats ?? { invited: 0, attempted: 0, qualified: 0, pending: 0, malpractice: 0 }}
          onInvite={() => setInviteOpen(true)}
          onBulkInvite={() => setBulkOpen(true)}
          onShare={() => setShareOpen(true)}
          onExport={() => toast.message("Export started", { description: "CSV export (demo)." })}
          onDisableRequest={() => setDisableOpen(true)}
          onEnable={() => {
            setAssessmentEnabled(assessment.id, true);
            bumpRefresh();
            toast.success("Assessment enabled");
          }}
        />

        <AssessmentCandidateDirectory
            assessmentId={assessment.id}
          onOpenReport={(c) => setReportCandidate(c)}
        />
      </div>

      <ShareAssessmentDialog open={shareOpen} onOpenChange={setShareOpen} assessment={assessment} />
      <DisableAssessmentDialog
        open={disableOpen}
        onOpenChange={setDisableOpen}
        assessmentName={assessment.name}
        onConfirm={() => {
          setAssessmentEnabled(assessment.id, false);
          bumpRefresh();
          toast.success("Assessment disabled");
          setDisableOpen(false);
        }}
      />
      <InviteCandidateDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        assessmentId={assessment.id}
        onInvited={bumpRefresh}
      />
      <BulkInviteDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        assessmentId={assessment.id}
        onInvited={bumpRefresh}
      />
      <AssessmentCandidateReportDialog
        open={reportCandidate != null}
        onOpenChange={(o) => !o && setReportCandidate(null)}
        assessment={assessment}
        candidate={reportCandidate}
      />
    </div>
  );
}
