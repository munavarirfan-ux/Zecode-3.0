import { Suspense } from "react";
import { InterviewerSchedulePage } from "@/components/scheduling/InterviewerSchedulePage";
import { MyScheduleSkeleton } from "@/components/skeletons";

export default function MySchedulePage() {
  return (
    <Suspense fallback={<MyScheduleSkeleton />}>
      <InterviewerSchedulePage />
    </Suspense>
  );
}
