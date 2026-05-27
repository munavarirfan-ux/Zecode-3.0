"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  settingsField,
  settingsFieldLabel,
  settingsPanel,
  settingsSectionDesc,
  settingsSectionTitle,
} from "../../../settingsTokens";

export function FormSectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(settingsPanel, "p-5", className)}>
      <h2 className={settingsSectionTitle}>{title}</h2>
      {description ? <p className={cn(settingsSectionDesc, "mt-1")}>{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Sub-section inside modal step card (replaces nested FormSectionCard). */
export function StepSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-[13px] font-semibold text-text">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-text-secondary/75">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function FormField({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className={settingsFieldLabel}>
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
      {children}
      {error ? <p className="text-[11px] text-red-600">{error}</p> : null}
    </label>
  );
}

export const formInputClass = settingsField;
