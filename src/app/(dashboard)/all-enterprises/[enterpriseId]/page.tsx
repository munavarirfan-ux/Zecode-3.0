import { Suspense } from "react";
import { EnterpriseDetailPage } from "@/features/settings/components/enterprises/detail/EnterpriseDetailPage";
import { EnterpriseDetailsSkeleton } from "@/components/skeletons";

export default async function EnterpriseDetailRoute({
  params,
}: {
  params: Promise<{ enterpriseId: string }>;
}) {
  const { enterpriseId } = await params;
  return (
    <Suspense fallback={<EnterpriseDetailsSkeleton />}>
      <EnterpriseDetailPage slug={enterpriseId} />
    </Suspense>
  );
}
