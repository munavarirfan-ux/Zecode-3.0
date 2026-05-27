import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuditLogPanel } from "@/features/settings/components/AuditLogPanel";

export default async function AuditPage() {
  const orgId = await getAppOrgId();
  const events = await prisma.auditEvent.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: true },
  });

  return (
    <AuditLogPanel
      events={events.map((e) => ({
        id: e.id,
        createdAt: e.createdAt.toISOString(),
        actorEmail: e.actor?.email ?? null,
        action: e.action,
        entityType: e.entityType,
        entityId: e.entityId,
      }))}
    />
  );
}
