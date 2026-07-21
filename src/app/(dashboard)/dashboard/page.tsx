import { Suspense } from "react";
import { DashboardExperience } from "@/components/dashboard/DashboardExperience";
import { DashboardSkeleton } from "@/components/skeletons";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardExperience />
    </Suspense>
  );
}
