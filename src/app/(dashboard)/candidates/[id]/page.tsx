import { notFound } from "next/navigation";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoleFitForCandidate } from "@/lib/scoring-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CandidateIntelligenceClient } from "./CandidateIntelligenceClient";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const orgId = await getAppOrgId();
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id, organizationId: orgId },
    include: {
      role: true,
      assessmentResults: { include: { trait: true } },
      notes: { include: { author: true } },
      interviewSessions: {
        include: {
          transcript: true,
          summary: true,
          scorecard: true,
          translationRecords: true,
        },
      },
      contentSubmissions: { include: { aiSignals: true } },
    },
  });

  if (!candidate) notFound();

  const fit = await getRoleFitForCandidate(candidate.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1>{candidate.name}</h1>
        <div className="flex gap-2">
          <a href={`/api/export/candidate/${candidate.id}`} download>
            <Button variant="outline">Export PDF</Button>
          </a>
          <Link href="/candidates">
            <Button variant="outline">Back to list</Button>
          </Link>
        </div>
      </div>

      {/* 1) Role Fit Score — largest */}
      <Card>
        <CardHeader>
          <CardTitle className="text-text-secondary">Role fit score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-big-number text-primary">{fit.roleFitScore}%</p>
          <p className="text-sm text-muted mt-1">
            vs role: {candidate.role?.name ?? "—"}
          </p>
        </CardContent>
      </Card>

      {/* 2) Strengths */}
      <Card>
        <CardHeader>
          <CardTitle>Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          {fit.alignedTraits.length === 0 ? (
            <p className="text-sm text-muted">No aligned traits above threshold.</p>
          ) : (
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
              {fit.alignedTraits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 3) Risks */}
      <Card>
        <CardHeader>
          <CardTitle>Risks</CardTitle>
        </CardHeader>
        <CardContent>
          {fit.risks.length === 0 ? (
            <p className="text-sm text-muted">No risk flags.</p>
          ) : (
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
              {fit.risks.map((r, i) => (
                <li key={i}>
                  {r.traitName ?? r.traitId}: {r.reason} (value: {r.value}, threshold: {r.threshold})
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 4) Trait breakdown table */}
      <Card>
        <CardHeader>
          <CardTitle>Trait breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-primary">Trait</th>
                <th className="text-right py-2 font-medium text-primary">Percentile</th>
              </tr>
            </thead>
            <tbody>
              {candidate.assessmentResults.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-2">{r.trait.name}</td>
                  <td className="py-2 text-right text-text-secondary">{r.percentile}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 5) Confidence */}
      <Card>
        <CardHeader>
          <CardTitle>Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-big-number text-primary">{fit.confidence}%</p>
        </CardContent>
      </Card>

      {/* 6) Interview Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle>Interview intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <CandidateIntelligenceClient
            sessions={candidate.interviewSessions}
            candidateId={candidate.id}
          />
        </CardContent>
      </Card>

      {/* 7) Notes + decision */}
      <Card>
        <CardHeader>
          <CardTitle>Notes & decision</CardTitle>
        </CardHeader>
        <CardContent>
          <CandidateIntelligenceClient
            sessions={[]}
            candidateId={candidate.id}
            notes={candidate.notes}
            role={candidate.role?.name}
          />
        </CardContent>
      </Card>

      {/* 8) Content submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Content submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {candidate.contentSubmissions.length === 0 ? (
            <p className="text-sm text-muted">No submissions yet.</p>
          ) : (
            <ul className="space-y-4">
              {candidate.contentSubmissions.map((sub) => (
                <li key={sub.id} className="border border-border rounded-2xl p-4">
                  <p className="text-xs text-muted mb-1">{sub.type}</p>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{sub.text.slice(0, 200)}{sub.text.length > 200 ? "…" : ""}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
