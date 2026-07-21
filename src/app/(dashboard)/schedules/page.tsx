import { Suspense } from "react";
import { AssessmentSchedulesPage } from "@/components/hiring/assessment-schedules/AssessmentSchedulesPage";
import { AssessmentDriveSkeleton } from "@/components/skeletons";

/** Live assessments dashboard — monitor exams in progress. */
export default function SchedulesPage() {
  return (
    <Suspense fallback={<AssessmentDriveSkeleton />}>
      <AssessmentSchedulesPage />
    </Suspense>
  );
}
