"use client";

import {
  Building2,
  UserPlus,
  ToggleRight,
  Globe,
  Upload,
  Shield,
  ClipboardList,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { settingsPanel, settingsSectionTitle } from "../../../settingsTokens";
import type { ActivityItem } from "./enterpriseDetailMock";

const activityIcons: Record<ActivityItem["icon"], LucideIcon> = {
  building: Building2,
  user: UserPlus,
  toggle: ToggleRight,
  globe: Globe,
  upload: Upload,
  shield: Shield,
  clipboard: ClipboardList,
  truck: Truck,
};

function formatDate(d: string): string {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function RecentActivityCard({ items }: { items: ActivityItem[] }) {
  return (
    <section className={cn(settingsPanel, "p-5")}>
      <h3 className={settingsSectionTitle}>Activity</h3>
      <div className="mt-4 space-y-0">
        {items.map((item, i) => {
          const Icon = activityIcons[item.icon];
          const isLast = i === items.length - 1;
          return (
            <div key={item.id} className="relative flex gap-3 pb-4">
              {!isLast && (
                <div className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-[rgba(15,23,42,0.08)] dark:bg-white/[0.06]" />
              )}
              <div className="relative z-[1] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08] dark:bg-surface">
                <Icon className="h-3 w-3 text-muted/70" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[12px] font-medium text-text">{item.action}</p>
                <p className="mt-0.5 text-[11px] text-muted">{formatDate(item.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
