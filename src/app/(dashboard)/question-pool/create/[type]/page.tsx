import { Suspense } from "react";
import { CreateQuestionEditor } from "@/features/question-pool/CreateQuestionEditor";
import { QuestionEditorSkeleton } from "@/components/skeletons";

export default function QuestionPoolCreatePage({
  params,
  searchParams,
}: {
  params: { type: string };
  searchParams: { subtype?: string };
}) {
  return (
    <Suspense fallback={<QuestionEditorSkeleton />}>
      <CreateQuestionEditor typeParam={params.type} subtypeParam={searchParams.subtype} />
    </Suspense>
  );
}
