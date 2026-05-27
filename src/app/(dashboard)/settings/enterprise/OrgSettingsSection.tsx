import { getServerSession } from "next-auth";
import { authOptions, getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "../SettingsClient";

export async function OrgSettingsSection() {
  const orgId = await getAppOrgId();
  const session = await getServerSession(authOptions);
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  return (
    <SettingsClient
      orgId={orgId}
      dataRetentionMonths={org?.dataRetentionMonths ?? null}
      anonymizedScreening={org?.anonymizedScreening ?? false}
      isHr={session?.user?.role === "HR"}
    />
  );
}
