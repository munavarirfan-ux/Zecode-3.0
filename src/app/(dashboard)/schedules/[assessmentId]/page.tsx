import { LiveAssessmentMonitorPage } from "@/components/hiring/assessment-schedules/LiveAssessmentMonitorPage";

export default async function ScheduleAssessmentPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  return <LiveAssessmentMonitorPage assessmentId={assessmentId} />;
}
