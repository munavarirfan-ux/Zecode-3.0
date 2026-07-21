import { Suspense } from "react";
import { QuestionPoolWorkspace } from "@/components/question-pool/QuestionPoolWorkspace";
import { QuestionPoolSkeleton } from "@/components/skeletons";

export default function QuestionPoolPage() {
  return (
    <Suspense fallback={<QuestionPoolSkeleton />}>
      <QuestionPoolWorkspace />
    </Suspense>
  );
}
