"use client";

import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseJson } from "@/lib/json";
import type { Prisma } from "@prisma/client";

type Candidate = Prisma.CandidateGetPayload<{
  include: {
    job: true;
    currentStage: true;
    role: true;
    assessmentResults: { include: { trait: true } };
    notes: { include: { author: true } };
    interviewSessions: {
      include: { transcript: true; summary: true; scorecard: true; translationRecords: true };
    };
    contentSubmissions: { include: { aiSignals: true } };
  };
}>;

type Fit = {
  roleFitScore: number;
  alignedTraits: string[];
  risks: { traitName?: string; traitId: string; reason: string; value: number; threshold: number }[];
  confidence: number;
};

type Session = Candidate["interviewSessions"][number];

function InterviewVideoPlaceholder() {
  return (
    <div className="flex aspect-video w-full max-w-md shrink-0 items-center justify-center rounded-2xl border border-chrome-border bg-secondary-fill">
      <button
        type="button"
        className="flex h-16 w-16 items-center justify-center rounded-full border border-chrome-border bg-surface/90 text-chrome-active shadow-sm transition-subtle hover:scale-105 hover:bg-surface"
        aria-label="Play recording"
      >
        <Play className="ml-1 h-8 w-8" fill="currentColor" />
      </button>
      <span className="sr-only">Interview recording</span>
    </div>
  );
}

function InterviewTabContent({
  sessions,
  title,
  showVideo = false,
}: {
  sessions: Session[];
  title: string;
  showVideo?: boolean;
}) {
  return (
    <Card className="border-chrome-border">
      <CardHeader>
        <CardTitle className="text-forest">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-text-secondary">No sessions yet.</p>
        ) : (
          <ul className="space-y-6">
            {sessions.map((s) => (
              <li key={s.id} className="rounded-2xl border border-chrome-border p-4">
                <div className={`flex gap-6 ${showVideo ? "flex-row" : ""}`}>
                  {showVideo && (
                    <div className="shrink-0">
                      <InterviewVideoPlaceholder />
                      <p className="mt-1 text-center text-xs text-muted">Interview recording</p>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest">{s.title}</p>
                    {s.transcript && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted">Transcript</p>
                        <p className="mt-0.5 whitespace-pre-wrap text-sm text-text-secondary">
                          {s.transcript.text.slice(0, 300)}
                          {s.transcript.text.length > 300 ? "…" : ""}
                        </p>
                      </div>
                    )}
                    {s.summary && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted">Summary</p>
                        <p className="mt-0.5 text-sm text-text-secondary">{s.summary.summary}</p>
                        {s.summary.evidence && (
                          <ul className="mt-2 list-inside list-disc text-xs text-muted">
                            {parseJson<{ quote: string; timestamp: string }[]>(s.summary.evidence, []).map((e, i) => (
                              <li key={i}>
                                &quot;{e.quote}&quot; ({e.timestamp})
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {s.scorecard && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted">Scorecard</p>
                        <p className="mt-0.5 text-sm text-text-secondary">{s.scorecard.overallRecommendation}</p>
                        {s.scorecard.interviewerNotes && (
                          <p className="mt-1 text-xs text-muted">Notes: {s.scorecard.interviewerNotes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

const TABS = [
  { id: "cv", label: "CV Report" },
  { id: "ats", label: "ATS Screening" },
  { id: "skill", label: "Skill Report" },
  { id: "psychometric", label: "Psychometric Report" },
  { id: "interview", label: "One-way Interview" },
  { id: "technical", label: "Technical Interview" },
  { id: "hr", label: "HR Interview" },
];

export function ApplicantTabs({ candidate, fit }: { candidate: Candidate; fit: Fit }) {
  return (
    <Tabs defaultValue="psychometric" className="min-w-0">
      <TabsList>
        {TABS.map((t) => (
          <TabsTrigger key={t.id} value={t.id}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="cv" className="mt-6 report-content focus-visible:ring-0">
        <Card className="border-chrome-border">
          <CardHeader>
            <CardTitle className="text-forest">CV Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">CV content and parsed fields (placeholder).</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ats" className="mt-6 report-content focus-visible:ring-0">
        <Card className="border-chrome-border">
          <CardHeader>
            <CardTitle className="text-forest">ATS Screening</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">
              Knockout results, screening score, parsed fields. Decision: Proceed / Hold / Reject (editable).
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skill" className="mt-6 report-content focus-visible:ring-0">
        <Card className="border-chrome-border">
          <CardHeader>
            <CardTitle className="text-forest">Skill Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Skill assessment results (placeholder).</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="psychometric" className="mt-6 report-content focus-visible:ring-0">
        <Card className="border-chrome-border">
          <CardHeader>
            <CardTitle className="text-forest">Role fit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-big-number text-forest">{fit.roleFitScore}%</p>
          </CardContent>
        </Card>
        <Card className="mt-4 border-chrome-border">
          <CardHeader>
            <CardTitle className="text-forest">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc text-sm text-text-secondary">
              {fit.alignedTraits.length ? fit.alignedTraits.map((t) => <li key={t}>{t}</li>) : <li>None</li>}
            </ul>
          </CardContent>
        </Card>
        <Card className="mt-4 border-chrome-border">
          <CardHeader>
            <CardTitle className="text-forest">Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc text-sm text-text-secondary">
              {fit.risks.length ? (
                fit.risks.map((r, i) => (
                  <li key={i}>
                    {r.traitName ?? r.traitId}: {r.reason}
                  </li>
                ))
              ) : (
                <li>None</li>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card className="mt-4 border-chrome-border">
          <CardHeader>
            <CardTitle className="text-forest">Trait breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-chrome-border">
                  <th className="py-2 text-left text-forest">Trait</th>
                  <th className="py-2 text-right text-forest">Percentile</th>
                </tr>
              </thead>
              <tbody>
                {candidate.assessmentResults.map((r) => (
                  <tr key={r.id} className="border-b border-chrome-border/50">
                    <td className="py-2">{r.trait.name}</td>
                    <td className="py-2 text-right">{r.percentile}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="interview" className="mt-6 report-content focus-visible:ring-0">
        <InterviewTabContent
          sessions={candidate.interviewSessions.filter((s) => s.interviewType === "ONE_WAY")}
          title="One-way Interview"
          showVideo
        />
      </TabsContent>

      <TabsContent value="technical" className="mt-6 report-content focus-visible:ring-0">
        <InterviewTabContent
          sessions={candidate.interviewSessions.filter((s) => s.interviewType === "TECHNICAL")}
          title="Technical Interview"
          showVideo
        />
      </TabsContent>

      <TabsContent value="hr" className="mt-6 report-content focus-visible:ring-0">
        <InterviewTabContent
          sessions={candidate.interviewSessions.filter((s) => s.interviewType === "HR")}
          title="HR Interview"
        />
      </TabsContent>

      <Card className="mt-6 border-chrome-border">
        <CardHeader>
          <CardTitle className="text-forest">Content submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {candidate.contentSubmissions.length === 0 ? (
            <p className="text-sm text-text-secondary">No submissions.</p>
          ) : (
            candidate.contentSubmissions.map((sub) => (
              <div key={sub.id} className="mb-3 rounded-xl border border-chrome-border bg-parchment p-3">
                <p className="text-xs text-muted">{sub.type}</p>
                <p className="text-sm text-text-secondary">{sub.text.slice(0, 150)}…</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
}
