"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import { createDefaultEnterpriseForm } from "../../../lib/createEnterprise/defaults";
import type { FeatureId, FeatureConfigState } from "../../../lib/createEnterprise/types";
import { useCreatedEnterprisesStore } from "../../../store/createdEnterprisesStore";
import {
  resolveEnterprise,
  generateKpis,
  generateUsers,
  generateActivity,
  generatePlanBilling,
  generateFeatureUsage,
  generateUsageLimits,
  generateWhitelistedDomains,
  generateIntegrations,
  generateStorage,
  generateHealth,
} from "./enterpriseDetailMock";
import { EnterpriseDetailHero } from "./EnterpriseDetailHero";
import { PlanBillingCard } from "./PlanBillingCard";
import { EnterpriseInfoCard } from "./EnterpriseInfoCard";
import { BrandingCard } from "./BrandingCard";
import { FeatureUsageCard } from "./FeatureUsageCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { EnterpriseUsersCard } from "./EnterpriseUsersCard";
import { EnabledFeaturesCard } from "./EnabledFeaturesCard";
import { UsageLimitsCard } from "./UsageLimitsCard";
import { WhitelistedDomainsCard, IntegrationsCard, StorageCard, HealthStatusCard } from "./SmallCards";
import { FeaturesDrawer } from "./FeaturesDrawer";
import { ConfigureDrawer } from "./ConfigureDrawer";

export function EnterpriseDetailPage({ slug }: { slug: string }) {
  const created = useCreatedEnterprisesStore((s) => s.created);
  const enterprise = useMemo(() => resolveEnterprise(slug, created), [slug, created]);

  const defaults = useMemo(() => createDefaultEnterpriseForm(), []);
  const [features, setFeatures] = useState<Record<FeatureId, boolean>>(defaults.features);
  const [config, setConfig] = useState<FeatureConfigState>(defaults.config);

  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [configureOpen, setConfigureOpen] = useState(false);

  if (!enterprise) {
    return (
      <div className={cn(dashboardCanvas, "flex flex-col items-center justify-center px-6 py-24 text-center")}>
        <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-text">
          Enterprise not found
        </h2>
        <p className="mt-2 max-w-sm text-[13px] text-text-secondary/85">
          The enterprise you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href={ROUTES.settingsEnterprises}
          className={cn(
            "mt-6 inline-flex items-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-surface/80 px-3 py-2 text-[13px] font-medium text-text-secondary",
            hiringTransition,
            "hover:bg-surface hover:text-text",
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to All Enterprises
        </Link>
      </div>
    );
  }

  const kpis = generateKpis(enterprise);
  const users = generateUsers(enterprise);
  const activity = generateActivity(enterprise);
  const billing = generatePlanBilling(enterprise);
  const featureUsage = generateFeatureUsage(enterprise);
  const usageLimits = generateUsageLimits(enterprise);
  const domains = generateWhitelistedDomains(enterprise);
  const integrations = generateIntegrations(enterprise);
  const storage = generateStorage(enterprise);
  const health = generateHealth();

  return (
    <div className={cn(dashboardCanvas, "px-4 py-6 sm:px-6 lg:px-8")}>
      <EnterpriseDetailHero
        enterprise={enterprise}
        kpis={kpis}
        onFeaturesOpen={() => setFeaturesOpen(true)}
        onConfigureOpen={() => setConfigureOpen(true)}
      />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_0.54fr]">
        {/* Left column */}
        <div className="space-y-5">
          <PlanBillingCard billing={billing} />
          <EnterpriseInfoCard enterprise={enterprise} />
          <BrandingCard enterprise={enterprise} />
          <FeatureUsageCard items={featureUsage} />
          <RecentActivityCard items={activity} />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <EnterpriseUsersCard users={users} />
          <EnabledFeaturesCard features={features} />
          <UsageLimitsCard items={usageLimits} />
          <WhitelistedDomainsCard domains={domains} />
          <IntegrationsCard integrations={integrations} />
          <StorageCard items={storage} />
          <HealthStatusCard items={health} />
        </div>
      </div>

      <FeaturesDrawer
        open={featuresOpen}
        onOpenChange={setFeaturesOpen}
        features={features}
        onSave={setFeatures}
      />

      <ConfigureDrawer
        open={configureOpen}
        onOpenChange={setConfigureOpen}
        features={features}
        config={config}
        onSave={setConfig}
      />
    </div>
  );
}
