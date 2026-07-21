import { Suspense } from "react";
import { CandidatesDirectory } from "@/components/hiring/directories/CandidatesDirectory";
import { CandidatesSkeleton } from "@/components/skeletons";

export default function CandidatesPage() {
  return (
    <Suspense fallback={<CandidatesSkeleton />}>
      <CandidatesDirectory />
    </Suspense>
  );
}
