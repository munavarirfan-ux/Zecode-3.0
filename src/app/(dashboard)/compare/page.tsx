import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoleFitForCandidate } from "@/lib/scoring-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompareClient } from "./CompareClient";

// Reads live, org-scoped data from the database per request — never prerender
// at build time (there is no DB during the Vercel build; see deployment notes).
export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const orgId = await getAppOrgId();
  const candidates = await prisma.candidate.findMany({
    where: { organizationId: orgId },
    include: { role: true },
    orderBy: { name: "asc" },
  });

  const withFit = await Promise.all(
    candidates.map(async (c) => {
      const fit = await getRoleFitForCandidate(c.id);
      return {
        id: c.id,
        name: c.name,
        roleName: c.role?.name ?? "—",
        roleFitScore: fit.roleFitScore,
        riskCount: fit.risks.length,
        confidence: fit.confidence,
        alignedTraits: fit.alignedTraits,
      };
    })
  );

  return (
    <div className="space-y-6">
      <h1>Compare candidates</h1>
      <CompareClient candidates={withFit} />
    </div>
  );
}
