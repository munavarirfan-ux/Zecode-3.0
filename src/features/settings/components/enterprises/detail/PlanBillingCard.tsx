"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionTitle, settingsPrimaryBtn, settingsSecondaryBtn } from "../../../settingsTokens";
import type { PlanBillingInfo } from "./enterpriseDetailMock";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <span className="text-[12px] font-medium text-muted">{label}</span>
      <span className="text-[13px] font-medium text-text">{value}</span>
    </div>
  );
}

export function PlanBillingCard({ billing }: { billing: PlanBillingInfo }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <div className="flex items-center justify-between gap-4">
        <h3 className={settingsSectionTitle}>Plan & Billing</h3>
        <span className="inline-flex rounded-full border border-accent/20 bg-accent/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-accent">
          {billing.plan}
        </span>
      </div>

      <div className="mt-3 divide-y divide-[rgba(15,23,42,0.05)] dark:divide-white/[0.05]">
        <Row label="Duration" value={billing.duration} />
        <Row label="Seats" value={String(billing.seats)} />
        <Row label="Expiry Date" value={billing.expiryDate} />
        <Row label="Payment Method" value={billing.paymentMethod === "None" ? "None" : `${billing.paymentMethod} ···· ${billing.lastFour}`} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={settingsPrimaryBtn} onClick={() => toast.message("Upgrade plan")}>
          Upgrade Plan
        </button>
        <button type="button" className={settingsSecondaryBtn} onClick={() => toast.message("Manage billing")}>
          Manage Billing
        </button>
      </div>
    </section>
  );
}
