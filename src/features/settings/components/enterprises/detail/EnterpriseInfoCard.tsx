"use client";

import { Edit3 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionTitle, settingsSecondaryBtn } from "../../../settingsTokens";
import type { EnterpriseDetail } from "./enterpriseDetailMock";

const STATUS_BADGE: Record<string, string> = {
  Active: "border-emerald-500/12 bg-emerald-500/[0.07] text-emerald-800/90 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90",
  Trial: "border-sky-500/12 bg-sky-500/[0.07] text-sky-800/85 dark:border-sky-400/15 dark:bg-sky-400/10 dark:text-sky-300/90",
  Suspended: "border-amber-500/14 bg-amber-500/[0.08] text-amber-900/80 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300/90",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[11px] font-medium text-muted">{label}</dt>
      <dd className="text-[13px] font-medium text-text">{value || "—"}</dd>
    </>
  );
}

export function EnterpriseInfoCard({ enterprise }: { enterprise: EnterpriseDetail }) {
  const initials = enterprise.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className={cn(settingsPanel, "p-5")}>
      <div className="flex items-start justify-between gap-4">
        <h3 className={settingsSectionTitle}>Enterprise Details</h3>
        <button
          type="button"
          className={cn(settingsSecondaryBtn, "h-8 px-3 text-[12px]")}
          onClick={() => toast.message("Edit enterprise details")}
        >
          <Edit3 className="h-3 w-3" strokeWidth={2} />
          Edit
        </button>
      </div>

      <div className="mt-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-accent/[0.08] text-[1rem] font-semibold text-accent dark:border-white/[0.08]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-text">{enterprise.name}</p>
          <p className="mt-0.5 text-[12px] text-muted">{enterprise.domain}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.03em]",
            STATUS_BADGE[enterprise.status] ?? "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] text-text-secondary/80",
          )}
        >
          {enterprise.status}
        </span>
      </div>

      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        <Row label="Base Domain" value={enterprise.baseDomain} />
        <Row label="Industry" value={enterprise.industry} />
        <Row label="Location" value={enterprise.location} />
        <Row label="Employees" value={enterprise.numberOfEmployees} />
        <Row label="Monthly Assessments" value={enterprise.monthlyAssessments} />
        <Row label="Created" value={new Date(enterprise.joined).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
        <Row label="Subscription Plan" value={enterprise.plan} />
      </dl>
    </section>
  );
}
