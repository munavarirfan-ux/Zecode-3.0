"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionDesc, settingsSectionTitle } from "../settingsTokens";

export function SettingsCard({
  title,
  description,
  children,
  className,
  danger,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  danger?: boolean;
}) {
  return (
    <section
      className={cn(
        settingsPanel,
        "overflow-hidden",
        danger && "border-red-400/25 dark:border-red-400/20",
        className,
      )}
    >
      <div
        className={cn(
          "border-b border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]",
          danger && "border-red-400/15",
        )}
      >
        <h2 className={cn(settingsSectionTitle, danger && "text-red-700 dark:text-red-400")}>{title}</h2>
        {description ? <p className={cn("mt-1", settingsSectionDesc)}>{description}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
