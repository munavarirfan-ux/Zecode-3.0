import { Suspense } from "react";
import { InterviewsDirectory } from "@/components/hiring/directories/InterviewsDirectory";
import { InterviewsSkeleton } from "@/components/skeletons";

export default function InterviewsPage() {
  return (
    <Suspense fallback={<InterviewsSkeleton />}>
      <InterviewsDirectory />
    </Suspense>
  );
}
