"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { hiringCanvas } from "@/components/hiring/hiringTokens";
import { cn } from "@/lib/utils";
import {
  settingsCanvasGlow,
  settingsNavIcon,
  settingsNavLink,
  settingsNavRail,
} from "../settingsTokens";
import { canAccessSettingsItem } from "../settingsAccess";
import { SETTINGS_NAV_GROUPS } from "../settingsNav";

export function SettingsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedRole } = useRole();

  return (
    <div className={cn(hiringCanvas, "relative min-h-full")}>
      <div
        className={cn("pointer-events-none absolute inset-x-0 top-0 h-56", settingsCanvasGlow)}
        aria-hidden
      />
      <div className="relative flex w-full min-w-0 flex-col gap-4 pb-16 lg:flex-row lg:gap-5">
        <aside className="w-full shrink-0 lg:w-[232px]">
          <div className={settingsNavRail}>
            <div className="mb-4 flex items-center gap-2 border-b border-[rgba(15,23,42,0.06)] pb-3 dark:border-white/[0.06]">
              <span className={settingsNavIcon}>
                <Settings className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.02em] text-text">Settings</p>
                <p className="text-[10px] text-muted">Workspace preferences</p>
              </div>
            </div>
            <nav className="flex gap-4 overflow-x-auto lg:flex-col lg:overflow-visible">
              {SETTINGS_NAV_GROUPS.map((group) => {
                const visibleItems = group.items.filter((item) =>
                  canAccessSettingsItem(selectedRole, item),
                );
                if (visibleItems.length === 0) return null;
                return (
                  <div key={group.id} className="min-w-[9rem] shrink-0 lg:min-w-0">
                    <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted/80">
                      {group.label}
                    </p>
                    <ul className="space-y-0.5">
                      {visibleItems.map((item) => {
                        const active =
                          pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                          <li key={item.id}>
                            <Link href={item.href} className={settingsNavLink(active)}>
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="min-w-0 flex-1 space-y-4">{children}</div>
      </div>
    </div>
  );
}
