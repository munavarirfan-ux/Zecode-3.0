"use client";

import { Image, Globe, Palette } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionTitle, settingsSecondaryBtn } from "../../../settingsTokens";
import type { EnterpriseDetail } from "./enterpriseDetailMock";

export function BrandingCard({ enterprise }: { enterprise: EnterpriseDetail }) {
  const initials = enterprise.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <section className={cn(settingsPanel, "p-5")}>
      <h3 className={settingsSectionTitle}>Branding</h3>

      <div className="mt-4 flex flex-wrap items-start gap-4">
        {enterprise.logoUrl ? (
          <img src={enterprise.logoUrl} alt="Logo" className="h-14 max-w-[140px] rounded-[10px] border border-[rgba(15,23,42,0.06)] object-contain p-2" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-[10px] border border-dashed border-[rgba(15,23,42,0.12)] bg-[rgba(15,23,42,0.02)] text-[13px] font-semibold text-muted dark:border-white/[0.08]">
            {initials}
          </div>
        )}

        {enterprise.faviconUrl ? (
          <div className="flex items-center gap-2 rounded-[10px] border border-[rgba(15,23,42,0.06)] px-3 py-2">
            <img src={enterprise.faviconUrl} alt="Favicon" className="h-5 w-5 object-contain" />
            <span className="text-[11px] text-muted">Favicon</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-[10px] border border-dashed border-[rgba(15,23,42,0.12)] bg-[rgba(15,23,42,0.02)] px-3 py-2 dark:border-white/[0.08]">
            <Globe className="h-5 w-5 text-muted/50" strokeWidth={1.5} />
            <span className="text-[11px] text-muted">No favicon</span>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-[10px] border border-[rgba(15,23,42,0.06)] px-3 py-2 dark:border-white/[0.06]">
          <div className="h-5 w-5 rounded-full bg-accent" />
          <span className="text-[11px] text-muted">Theme color</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={cn(settingsSecondaryBtn, "h-8 px-3 text-[12px]")} onClick={() => toast.message("Change logo")}>
          <Image className="h-3 w-3" strokeWidth={2} />
          Change Logo
        </button>
        <button type="button" className={cn(settingsSecondaryBtn, "h-8 px-3 text-[12px]")} onClick={() => toast.message("Change favicon")}>
          <Globe className="h-3 w-3" strokeWidth={2} />
          Change Favicon
        </button>
        <button type="button" className={cn(settingsSecondaryBtn, "h-8 px-3 text-[12px]")} onClick={() => toast.message("Edit theme")}>
          <Palette className="h-3 w-3" strokeWidth={2} />
          Edit Theme
        </button>
      </div>
    </section>
  );
}
