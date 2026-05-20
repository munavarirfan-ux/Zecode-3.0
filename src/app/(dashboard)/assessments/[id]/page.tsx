import { AssessmentDetailPage } from "@/components/hiring/assessments/AssessmentDetailPage";

export default function AssessmentDetailRoute({
  params,
}: {
  params: { id: string };
}) {
  return <AssessmentDetailPage assessmentId={params.id} />;
}
