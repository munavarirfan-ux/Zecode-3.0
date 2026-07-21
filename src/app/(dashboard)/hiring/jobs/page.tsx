import { Suspense } from "react";
import { JobsDashboard } from "@/components/hiring/JobsDashboard";
import { JobsSkeleton } from "@/components/skeletons";

export default function HiringJobsPage() {
  return (
    <Suspense fallback={<JobsSkeleton />}>
      <JobsDashboard />
    </Suspense>
  );
}
