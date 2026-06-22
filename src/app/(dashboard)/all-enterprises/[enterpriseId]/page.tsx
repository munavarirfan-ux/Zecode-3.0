import { EnterpriseDetailPage } from "@/features/settings/components/enterprises/detail/EnterpriseDetailPage";

export default async function EnterpriseDetailRoute({
  params,
}: {
  params: Promise<{ enterpriseId: string }>;
}) {
  const { enterpriseId } = await params;
  return <EnterpriseDetailPage slug={enterpriseId} />;
}
