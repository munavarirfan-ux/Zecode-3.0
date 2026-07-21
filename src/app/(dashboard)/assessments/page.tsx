import { Suspense } from "react";
import { AssessmentsDashboard } from "@/components/hiring/assessments/AssessmentsDashboard";
import { AssessmentsSkeleton } from "@/components/skeletons";

export default function AssessmentsPage() {
  return (
    <Suspense fallback={<AssessmentsSkeleton />}>
      <AssessmentsDashboard />
    </Suspense>
  );
}
