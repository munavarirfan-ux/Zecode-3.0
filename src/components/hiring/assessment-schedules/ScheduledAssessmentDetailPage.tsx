"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import {
  getScheduledAssessmentById,
  SCHEDULED_ASSESSMENTS_UPDATED_EVENT,
} from "@/lib/hiring/assessments/scheduledAssessmentsData";
import { hiringCanvas } from "../hiringTokens";
import { ScheduledAssessmentDetailHero } from "./ScheduledAssessmentDetailHero";
import { ScheduledCandidateDirectory } from "./ScheduledCandidateDirectory";
import { ScheduleInviteCandidateDialog } from "./ScheduleInviteCandidateDialog";
import { ScheduleBulkInviteDialog } from "./ScheduleBulkInviteDialog";

export function ScheduledAssessmentDetailPage({ scheduleId }: { scheduleId: string }) {
  const [refresh, setRefresh] = useState(0);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  useEffect(() => {
    const bump = () => setRefresh((n) => n + 1);
    window.addEventListener(SCHEDULED_ASSESSMENTS_UPDATED_EVENT, bump);
    return () => window.removeEventListener(SCHEDULED_ASSESSMENTS_UPDATED_EVENT, bump);
  }, []);

  const record = useMemo(() => getScheduledAssessmentById(scheduleId), [scheduleId, refresh]);

  if (!record) {
    return (
      <div className={hiringCanvas}>
        <div className="w-full min-w-0 py-16 text-center">
          <p className="text-[15px] font-semibold text-text">Scheduled assessment not found</p>
          <Button asChild variant="outline" className="mt-3 rounded-[10px]">
            <Link href={ROUTES.schedules}>Back to Assessment Drive</Link>
          </Button>
        </div>
      </div>
    );
  }

  const bumpRefresh = () => setRefresh((n) => n + 1);

  return (
    <div className={hiringCanvas}>
      <div className="w-full min-w-0 space-y-5 pb-8 sm:space-y-6">
        <ScheduledAssessmentDetailHero
          record={record}
          onInvite={() => setInviteOpen(true)}
          onBulkInvite={() => setBulkOpen(true)}
          onShare={() => {
            void navigator.clipboard.writeText(record.shareLink);
            toast.success("Schedule link copied");
          }}
          onExport={() => toast.message("Export started", { description: "CSV export (demo)." })}
        />

        <ScheduledCandidateDirectory
          scheduleId={record.id}
          candidates={record.candidates}
          shareLink={record.shareLink}
          onRefresh={bumpRefresh}
        />
      </div>

      <ScheduleInviteCandidateDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        scheduleId={record.id}
        onInvited={bumpRefresh}
      />
      <ScheduleBulkInviteDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        scheduleId={record.id}
        onInvited={bumpRefresh}
      />
    </div>
  );
}
