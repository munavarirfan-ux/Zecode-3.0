"use client";

import { settingsAccentBgHover, settingsPanel } from "../../settingsTokens";
import { cn } from "@/lib/utils";
import type { LocalizationEntry } from "../../settingsTypes";

export function LocalizationPreview({
  entries,
  categoryLabel,
}: {
  entries: LocalizationEntry[];
  categoryLabel: string;
}) {
  const labels = entries
    .map((e) => e.value.trim() || e.defaultValue)
    .filter(Boolean);

  return (
    <aside className={cn(settingsPanel, "sticky top-4 p-4")}>
      <h3 className="text-[13px] font-semibold text-text">Live preview</h3>
      <p className="mt-1 text-[11px] text-muted">{categoryLabel} labels as candidates will see them</p>
      <div className="mt-4 space-y-1 rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] p-3 dark:border-white/[0.06]">
        {labels.length === 0 ? (
          <p className="text-[12px] text-muted">No labels to preview</p>
        ) : (
          labels.map((label) => (
            <div
              key={label}
              className={cn(
                "rounded-[8px] px-2.5 py-2 text-[13px] font-medium text-text",
                settingsAccentBgHover,
              )}
            >
              {label}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
