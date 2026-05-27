import Link from "next/link";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function JobsPage() {
  const orgId = await getAppOrgId();
  const jobs = await prisma.job.findMany({
    where: { orgId },
    include: { _count: { select: { candidates: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-chrome-active">Jobs</h1>
        <Link href="/jobs/new">
          <Button className="bg-accent hover:bg-accent/90 text-white">Post Job</Button>
        </Link>
      </div>
      <Card className="border-chrome-border">
        <CardHeader>
          <CardTitle className="text-chrome-active">All jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <LineArtEmptyState
              illustration="jobs"
              message="No jobs yet."
              description="Create one to get started."
            />
          ) : (
            <ul className="space-y-2">
              {jobs.map((j) => (
                <li
                  key={j.id}
                  className="flex items-center justify-between rounded-2xl border border-chrome-border p-4 hover:bg-chrome-border/20 transition-subtle"
                >
                  <div>
                    <Link href={`/jobs/${j.id}`} className="font-medium text-chrome-active hover:underline">
                      {j.title}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">
                      {j.department ?? "—"} · {j.location ?? "—"} · {j.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">{j._count.candidates} applicants</span>
                    <Link href={`/jobs/${j.id}/pipeline`}>
                      <Button variant="outline" size="sm" className="border-chrome-active text-chrome-active">Pipeline</Button>
                    </Link>
                    <Link href={`/jobs/${j.id}/settings`}>
                      <Button variant="ghost" size="sm">Settings</Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
