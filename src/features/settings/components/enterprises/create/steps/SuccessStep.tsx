"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { ROUTES } from "@/config/routes";
import type { CreatedEnterprise } from "../../../../store/createdEnterprisesStore";
import {
  settingsModalShadow,
  settingsPanel,
  settingsPrimaryBtn,
  settingsSecondaryBtn,
} from "../../../../settingsTokens";
import { cn } from "@/lib/utils";

export function SuccessStep({ enterprise }: { enterprise: CreatedEnterprise }) {
  return (
    <div
      className={cn(
        settingsPanel,
        "mx-auto max-w-lg p-8 text-center",
        settingsModalShadow,
      )}
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <Check className="h-7 w-7" strokeWidth={2} />
      </span>
      <h2 className="mt-4 text-[1.25rem] font-semibold tracking-[-0.02em] text-text">
        Enterprise created successfully
      </h2>
      <p className="mt-2 text-[13px] text-text-secondary/85">
        <span className="font-semibold text-text">{enterprise.name}</span> is ready on the platform.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href={ROUTES.settingsMyEnterprise} className={settingsPrimaryBtn}>
          Open Enterprise
        </Link>
        <Link href={ROUTES.settingsTeams} className={settingsSecondaryBtn}>
          Invite Team
        </Link>
        <Link href={ROUTES.settingsMyEnterprise} className={settingsSecondaryBtn}>
          Configure Branding
        </Link>
      </div>
    </div>
  );
}
