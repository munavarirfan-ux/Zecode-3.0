import { zeMock } from "@/features/demo/data/ze.mock";
import { isSlugAvailable, validateEnterpriseSlug } from "../../mock/enterpriseSettingsMock";

export function getTakenEnterpriseSlugs(extraSlugs: string[] = []): string[] {
  return [
    ...zeMock.enterprises.list.map((e) => e.domain.split(".")[0]),
    ...extraSlugs,
  ];
}

export function domainToSlug(domainName: string): string {
  return domainName
    .trim()
    .toLowerCase()
    .split(".")[0]
    .replace(/[^a-z0-9-]/g, "");
}

export function validateEnterpriseSlugFromDomain(
  domainName: string,
  takenSlugs: string[],
): string | null {
  const slug = domainToSlug(domainName);
  const err = validateEnterpriseSlug(slug);
  if (err) return err;
  if (!isSlugAvailable(slug, takenSlugs)) return "Domain is already in use";
  return null;
}
