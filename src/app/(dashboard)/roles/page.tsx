import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Reads live, org-scoped data from the database per request — never prerender
// at build time (there is no DB during the Vercel build; see deployment notes).
export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const orgId = await getAppOrgId();
  const roles = await prisma.roleProfile.findMany({
    where: { organizationId: orgId },
    include: { traitConfigs: { include: { trait: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1>Roles</h1>
      <Card>
        <CardHeader>
          <CardTitle>Role profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {roles.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-xl px-4 py-3 bg-surface border border-border hover:bg-secondary/20 transition-colors"
              >
                <span className="font-medium text-primary">{r.name}</span>
                <Link href={`/roles/${r.id}`}>
                  <Button variant="ghost" size="sm">View / Edit</Button>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
