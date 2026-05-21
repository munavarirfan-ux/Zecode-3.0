import { ScheduledAssessmentDetailPage } from "@/components/hiring/assessment-schedules/ScheduledAssessmentDetailPage";

export default async function ScheduledAssessmentPage({
  params,
}: {
  params: Promise<{ scheduleId: string }>;
}) {
  const { scheduleId } = await params;
  return <ScheduledAssessmentDetailPage scheduleId={scheduleId} />;
}
