"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { JobWorkspace } from "@/components/hiring/JobWorkspace";
import { getJobById } from "@/lib/hiring/mockData";
import { JOBS_UPDATED_EVENT } from "@/lib/hiring/persistedJobs";
import type { HiringJob } from "@/lib/hiring/types";

export default function HiringJobWorkspacePage({
  params,
}: {
  params: { jobId: string };
}) {
  // undefined = still loading, null = not found, HiringJob = resolved
  const [job, setJob] = useState<HiringJob | null | undefined>(undefined);

  useEffect(() => {
    const load = () => {
      const found = getJobById(params.jobId);
      setJob(found ?? null);
    };
    load();
    // Re-check when any job is persisted/updated (e.g. publish, status change)
    window.addEventListener(JOBS_UPDATED_EVENT, load);
    return () => window.removeEventListener(JOBS_UPDATED_EVENT, load);
  }, [params.jobId]);

  if (job === undefined) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[13px] text-[#71717A]">
        Loading job workspace…
      </div>
    );
  }

  if (job === null) {
    notFound();
  }

  return <JobWorkspace job={job} />;
}
