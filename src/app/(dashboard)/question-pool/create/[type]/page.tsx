import { CreateQuestionEditor } from "@/features/question-pool/CreateQuestionEditor";

export default function QuestionPoolCreatePage({
  params,
  searchParams,
}: {
  params: { type: string };
  searchParams: { subtype?: string };
}) {
  return (
    <CreateQuestionEditor typeParam={params.type} subtypeParam={searchParams.subtype} />
  );
}
