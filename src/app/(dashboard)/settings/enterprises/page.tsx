import { Suspense } from "react";
import { EnterprisesSettingsPage } from "@/features/settings/components/enterprises/EnterprisesSettingsPage";
import { EnterprisesSkeleton } from "@/components/skeletons";

export default function SettingsEnterprisesPage() {
  return (
    <Suspense fallback={<EnterprisesSkeleton />}>
      <EnterprisesSettingsPage />
    </Suspense>
  );
}
