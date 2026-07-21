import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsSkeleton } from "@/components/skeletons";

function ReportsContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-chrome-active">Reports</h1>
      <Card className="border-chrome-border">
        <CardHeader>
          <CardTitle className="text-chrome-active">Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary">Candidate reports and comparison exports (use Export PDF from applicant or compare pages).</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsContent />
    </Suspense>
  );
}
