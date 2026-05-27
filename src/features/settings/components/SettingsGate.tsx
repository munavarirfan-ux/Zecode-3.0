"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { settingsPanel } from "../settingsTokens";
import { cn } from "@/lib/utils";

export function SettingsGate({
  title = "You don’t have access to this settings area",
  description = "Switch your preview role or contact a platform administrator.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className={cn(settingsPanel, "mx-auto max-w-lg p-8 text-center")}>
      <h2 className="text-[1rem] font-semibold text-text">{title}</h2>
      <p className="mt-2 text-[13px] text-text-secondary/85">{description}</p>
      <Link
        href={ROUTES.settingsProfile}
        className="mt-5 inline-flex h-9 items-center rounded-[10px] bg-accent px-4 text-[13px] font-semibold text-white hover:bg-accent-hover"
      >
        Go to My Profile
      </Link>
    </div>
  );
}
