import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoMock } from "@/features/demo/data/demo.mock";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-chrome-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
      {children}
    </span>
  );
}

function SignalPill({ label }: { label: string }) {
  const tone =
    label === "High Signal"
      ? "bg-accent/10 text-accent border-accent/20"
      : label === "Medium Risk"
        ? "bg-orange-500/10 text-orange-700 border-orange-500/20"
        : "bg-secondary-fill text-text-secondary border-chrome-border";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
      {label.toUpperCase()}
    </span>
  );
}

export default function SeniorProductDesignerJobPage() {
  const job = demoMock.jobSeniorProductDesigner;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs text-muted">
            <Link href="/jobs" className="hover:text-text-secondary transition-subtle">
              Jobs
            </Link>{" "}
            <span className="text-muted">›</span> <span className="text-text-secondary">{job.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-chrome-active">{job.title}</h1>
            <Badge>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {job.status}
              </span>
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full border-chrome-border">
            Edit Job
          </Button>
          <Button variant="outline" className="rounded-full border-chrome-border">
            Share
          </Button>
          <Button className="rounded-full bg-accent hover:bg-accent/90 text-white">
            Invite Candidates
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-chrome-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold tracking-wide text-text-secondary">TOTAL APPLICANTS</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-3xl font-semibold text-forest">{job.stats.totalApplicants}</p>
            <p className="text-xs text-accent">~ +5%</p>
          </CardContent>
        </Card>
        <Card className="border-chrome-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold tracking-wide text-text-secondary">IN WORK SIGNALS</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-3xl font-semibold text-forest">{job.stats.inWorkSignals}</p>
            <p className="text-xs text-muted">~ -2%</p>
          </CardContent>
        </Card>
        <Card className="border-chrome-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold tracking-wide text-text-secondary">AVG. EVIDENCE COVERAGE</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-3xl font-semibold text-forest">{job.stats.avgEvidenceCoveragePct}%</p>
            <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary-fill">
              <div className="h-full bg-emerald-600" style={{ width: `${job.stats.avgEvidenceCoveragePct}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-chrome-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold tracking-wide text-text-secondary">HIRING CONFIDENCE</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-2xl font-semibold text-forest">{job.stats.hiringConfidence}</p>
            <div className="h-8 w-16 rounded-xl bg-gradient-to-r from-sage/60 to-sage/10" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-chrome-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 rounded-2xl border border-chrome-border bg-surface px-4 py-3">
                <span className="text-muted text-sm">Search applicants by name, skill, or keyword…</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-full border-chrome-border">
                Filter
              </Button>
              <div className="flex items-center gap-2 rounded-full border border-chrome-border bg-surface px-3 py-2 text-sm">
                <span className="text-muted">Sort by:</span>
                <span className="font-medium text-text">Evidence Score</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-chrome-border">
        <CardHeader>
          <CardTitle className="text-chrome-active">High Confidence Candidates</CardTitle>
          <p className="text-xs text-muted -mt-1">Exceeding benchmarks</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-2xl border border-chrome-border">
            <div className="grid grid-cols-12 bg-parchment px-4 py-3 text-[11px] font-semibold tracking-wide text-muted">
              <div className="col-span-4">CANDIDATE</div>
              <div className="col-span-2">CURRENT STAGE</div>
              <div className="col-span-2">EVIDENCE SCORE</div>
              <div className="col-span-2">SIGNAL</div>
              <div className="col-span-2">LAST ACTIVITY</div>
            </div>

            <div className="divide-y divide-chrome-border bg-surface">
              {job.candidates.map((c) => (
                <div
                  key={c.name}
                  className="grid grid-cols-12 items-center px-4 py-4 text-sm hover:bg-parchment/60 transition-subtle"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-chrome flex items-center justify-center text-chrome-active font-semibold">
                      {c.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-text">{c.name}</p>
                      <p className="text-xs text-muted">{c.location}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="inline-flex rounded-full bg-secondary-fill px-3 py-1 text-xs font-semibold text-text-secondary">
                      {c.stage}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary-fill">
                        <div className="h-full bg-sage" style={{ width: `${c.evidenceScorePct}%` }} />
                      </div>
                      <span className="font-semibold text-text">{c.evidenceScorePct}%</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <SignalPill label={c.aiSignal} />
                  </div>

                  <div className="col-span-2 flex items-center justify-between gap-2">
                    <span className="text-muted">{c.lastActivity}</span>
                    <Link href="/applicants/emma-schneider">
                      <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

