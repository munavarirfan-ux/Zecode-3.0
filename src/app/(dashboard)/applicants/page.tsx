import { getServerSession } from "next-auth";
import { authOptions, getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoleFitForCandidate } from "@/lib/scoring-server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Reads live, org-scoped data from the database per request — never prerender
// at build time (there is no DB during the Vercel build; see deployment notes).
export const dynamic = "force-dynamic";

export default async function ApplicantsPage() {
  const orgId = await getAppOrgId();
  const session = await getServerSession(authOptions);
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const anonymize = session?.user?.role === "HR" && (org?.anonymizedScreening ?? false);

  const candidates = await prisma.candidate.findMany({
    where: { organizationId: orgId },
    include: { job: true, currentStage: true, role: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = await Promise.all(
    candidates.map(async (c) => {
      const fit = await getRoleFitForCandidate(c.id);
      return {
        id: c.id,
        name: anonymize ? "Applicant" : c.name,
        email: anonymize ? "" : c.email ?? "",
        jobTitle: c.job?.title ?? "—",
        stageName: c.currentStage?.name ?? "—",
        status: c.status,
        atsScore: c.atsScore ?? "—",
        roleFitScore: fit.roleFitScore,
        riskCount: fit.risks.length,
      };
    })
  );

  return (
    <div className="space-y-6">
      <h1 className="text-chrome-active">Applicants</h1>
      <Card className="border-chrome-border">
        <CardHeader>
          <CardTitle className="text-chrome-active">All applicants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-chrome-border">
                  <th className="pb-3 font-medium text-chrome-active">Name</th>
                  <th className="pb-3 font-medium text-chrome-active">Job</th>
                  <th className="pb-3 font-medium text-chrome-active">Stage</th>
                  <th className="pb-3 font-medium text-chrome-active">ATS %</th>
                  <th className="pb-3 font-medium text-chrome-active">Fit %</th>
                  <th className="pb-3 font-medium text-chrome-active">Risks</th>
                  <th className="pb-3 font-medium text-chrome-active"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-chrome-border/50 hover:bg-chrome-border/30 transition-subtle"
                  >
                    <td className="py-3">{r.name}</td>
                    <td className="py-3">{r.jobTitle}</td>
                    <td className="py-3">{r.stageName}</td>
                    <td className="py-3">{typeof r.atsScore === "number" ? `${r.atsScore}%` : r.atsScore}</td>
                    <td className="py-3">{r.roleFitScore}%</td>
                    <td className="py-3">{r.riskCount}</td>
                    <td className="py-3">
                      <Link href={`/applicants/${r.id}`} className="text-accent font-medium hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
