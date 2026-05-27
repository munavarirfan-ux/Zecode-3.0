import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoMock } from "@/features/demo/data/demo.mock";
import { InterviewIntelligenceClient } from "./InterviewIntelligenceClient";

function Marker({ leftPct }: { leftPct: number }) {
  return (
    <span
      className="absolute top-1/2 -translate-y-1/2 h-2.5 w-0.5 rounded-full bg-accent/90"
      style={{ left: `${Math.max(0, Math.min(100, leftPct))}%` }}
    />
  );
}

export default function InterviewIntelligencePage() {
  const i = demoMock.emma.interviewIntelligence;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-chrome-active">Interview Intelligence</h1>
          <p className="text-sm text-muted">Evidence-led transcript analysis · technical round</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/applicants/emma-schneider">
            <Button variant="outline" className="rounded-full border-chrome-border">
              Back to Candidate
            </Button>
          </Link>
          <Button className="rounded-full bg-accent hover:bg-accent/90 text-white">Generate Summary</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="border-chrome-border lg:col-span-7 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-forest text-white p-6 md:p-8">
              <div className="h-52 md:h-64 rounded-2xl bg-black/35 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/40" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-3 py-1 text-xs">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Live analysis
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white/90">
                    {i.quoteOverlay}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-black/25 border border-white/10 p-4">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>04:12 / 45:00</span>
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-surface/10 border border-white/10" />
                    <span className="h-8 w-8 rounded-full bg-surface/10 border border-white/10" />
                    <span className="h-8 w-8 rounded-full bg-surface/10 border border-white/10" />
                  </div>
                </div>
                <div className="mt-3 relative h-10 rounded-xl bg-surface/5 border border-white/10 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-[42%] bg-sage/50" />
                  <div className="absolute inset-y-0 left-0 w-[58%] bg-sage/10" />
                  <Marker leftPct={62} />
                  <Marker leftPct={79} />
                  <Marker leftPct={88} />
                  <div className="absolute inset-x-3 bottom-2 flex items-center justify-between text-[10px] text-white/50">
                    <span>Timeline</span>
                    <span>Markers</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-5 space-y-4">
          <Card className="border-chrome-border">
            <CardHeader>
              <CardTitle className="text-chrome-active">Evidence Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {i.evidenceSummary.map((b) => (
                <div key={b} className="text-sm text-text-secondary">
                  <span className="font-semibold">•</span> {b}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-chrome-border">
            <CardHeader>
              <CardTitle className="text-chrome-active">Competency Scorecard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-muted">PROBLEM SOLVING</p>
                <p className="text-sm font-semibold text-text">
                  {i.competencyScorecard.problemSolving.toFixed(1)}/{i.competencyScorecard.outOf.toFixed(1)}
                </p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary-fill">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${(i.competencyScorecard.problemSolving / i.competencyScorecard.outOf) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Card className="border-chrome-border">
            <CardHeader>
              <CardTitle className="text-chrome-active">Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <InterviewIntelligenceClient transcript={i.transcript} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="border-chrome-border">
            <CardHeader>
              <CardTitle className="text-chrome-active">Next actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full rounded-full bg-accent hover:bg-accent/90 text-white">
                Add evidence tag
              </Button>
              <Button variant="outline" className="w-full rounded-full border-chrome-border">
                Flag contradiction
              </Button>
              <Link href="/applicants/emma-schneider/decision">
                <Button variant="outline" className="w-full rounded-full border-chrome-border">
                  Open decision summary
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

