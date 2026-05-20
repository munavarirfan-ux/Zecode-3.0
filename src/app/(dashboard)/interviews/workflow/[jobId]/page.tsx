import { Suspense } from "react";
import { notFound } from "next/navigation";
import { JobWorkspace } from "@/components/hiring/JobWorkspace";
import { getJobById } from "@/lib/hiring/mockData";

export default function InterviewsWorkflowPage({ params }: { params: { jobId: string } }) {
  const job = getJobById(params.jobId);
  if (!job) notFound();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-[13px] text-[#71717A]">
          Loading interview workflow…
        </div>
      }
    >
      <JobWorkspace job={job} />
    </Suspense>
  );
}

