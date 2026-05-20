"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Mic2,
  FileText,
  Settings,
  LogOut,
  Building2,
  Calendar,
  ClipboardList,
  DatabaseZap,
  Globe2,
  GraduationCap,
  Waypoints,
  Shield,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GlobalSearch } from "@/components/GlobalSearch";
import { useRole } from "@/context/RoleContext";
import { PREVIEW_ROLE_OPTIONS, type PreviewRole } from "@/config/previewRole";
import { useTheme } from "@/components/ThemeProvider";
import { navChromeClasses } from "@/lib/themeChrome";
import { rgbSpaceToCssRgb } from "@/lib/theme";
import { getNavigationForRole } from "@/config/navigationByRole";
import type { NavIconKey } from "@/config/navTypes";
import { readOnboardingState } from "@/lib/onboarding/onboardingStore";
import { getNewUserNavOnboardingHints } from "@/lib/onboarding/newUserSetupProgress";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";
import { APP_NAME, APP_TAGLINE, COMPANY_NAME } from "@/constants/app";
import { ROUTES } from "@/config/routes";
import { FeedbackNotificationsMenu } from "@/components/hiring/FeedbackNotificationsMenu";

const iconRegistry: Record<NavIconKey, LucideIcon> = {
  layoutDashboard: LayoutDashboard,
  briefcase: Briefcase,
  users: Users,
  waypoints: Waypoints,
  graduationCap: GraduationCap,
  mic2: Mic2,
  calendar: Calendar,
  databaseZap: DatabaseZap,
  building2: Building2,
  globe2: Globe2,
  clipboardList: ClipboardList,
  fileText: FileText,
  barChart3: BarChart3,
  shield: Shield,
  settings: Settings,
};

function initials(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ToolbarBrand() {
  return (
    <Link
      href={ROUTES.dashboard}
      aria-label={COMPANY_NAME}
      className="flex min-w-0 max-w-[min(100%,220px)] shrink-0 items-center gap-2.5 rounded-[10px] outline-none transition-opacity duration-[180ms] ease-out hover:opacity-90 focus-visible:ring-2 focus-visible:ring-forest/20"
    >
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent text-sm font-bold text-white shadow-[0_2px_8px_rgb(var(--accent-500-rgb)/0.35)]"
        aria-hidden
      >
        Z
      </span>
      <span className="min-w-0 flex flex-col leading-tight">
        <span className="truncate text-sm font-bold tracking-tight text-text">{APP_NAME}</span>
        <span className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
          {COMPANY_NAME}
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { selectedRole, setSelectedRole } = useRole();
  const { theme, toggleTheme, navTone, navRgb } = useTheme();
  const nc = navChromeClasses(navTone, null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("ze.sidebar.collapsed") : null;
    if (saved === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ze.sidebar.collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const visibleGroups = useMemo(() => getNavigationForRole(selectedRole), [selectedRole]);
  const workspaceRefresh = useWorkspaceRefresh();
  const navOnboardingHints = useMemo(
    () => getNewUserNavOnboardingHints(selectedRole),
    [selectedRole, workspaceRefresh],
  );

  const isNewUserDashboard =
    pathname === ROUTES.dashboard &&
    selectedRole === "newUser" &&
    readOnboardingState().completed;

  const sidebarWidth = collapsed ? 72 : 280;
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-app-bg text-text lg:h-[100dvh] lg:max-h-screen lg:flex-row lg:overflow-hidden">
      <aside
        className={cn(
          "shrink-0 transition-[width] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:flex lg:h-full lg:flex-col lg:overflow-hidden",
          "w-full lg:w-[var(--sidebar-px)]",
        )}
        style={{ ["--sidebar-px" as string]: `${sidebarWidth}px` } as Record<string, string>}
      >
        {mobileOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div
          className={cn(
            "flex h-full flex-col transition-[width,transform] duration-[180ms] ease-out",
            "max-lg:w-[min(calc(100vw_-_1rem),var(--sidebar-px))] lg:w-full",
            "max-lg:fixed max-lg:z-50 max-lg:top-2 max-lg:left-2 max-lg:bottom-2 sm:max-lg:left-3 sm:max-lg:top-3 sm:max-lg:bottom-3",
            mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-[120%]",
            "lg:relative lg:inset-auto lg:translate-x-0 lg:overflow-hidden",
          )}
        >
          <div
            className={cn("flex h-full min-h-0 flex-col overflow-hidden rounded-[16px]", nc.panel)}
            style={
              {
                backgroundColor: rgbSpaceToCssRgb(navRgb),
                ["--nav-bg-rgb" as string]: navRgb,
              } as CSSProperties
            }
          >
            <div className={cn("border-b", nc.hairline, collapsed ? "px-2 py-3" : "px-3 py-3.5")}>
              <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
                <Link href={ROUTES.dashboard} className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-accent text-sm font-semibold text-white shadow-sm">
                    Ze
                  </span>
                  {!collapsed ? (
                    <div className="leading-tight">
                      <p className={cn("text-sm font-medium tracking-tight", nc.brandTitle)}>{APP_NAME}</p>
                      <p className={cn("text-[11px] font-medium", nc.brandSub)}>{APP_TAGLINE}</p>
                    </div>
                  ) : null}
                </Link>

                {!collapsed ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(nc.ghostBtn, "h-8 w-8 shrink-0 px-0")}
                    onClick={() => setCollapsed(true)}
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                ) : null}
              </div>

              {collapsed ? (
                <div className="mt-2 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(nc.ghostBtn, "h-8 w-8 px-0")}
                    onClick={() => setCollapsed(false)}
                    aria-label="Expand sidebar"
                    title="Expand"
                  >
                    <PanelLeftOpen className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </div>
              ) : null}
            </div>

            <div className={cn("flex-1 overflow-auto", collapsed ? "px-1.5 py-3" : "px-2 py-3")}>
              {visibleGroups.map((group) => (
                <div key={group.label} className="mb-5 last:mb-2">
                  {!collapsed ? (
                    <p className={cn("px-2.5 pb-2 pt-1 text-[10px] font-medium uppercase tracking-[0.14em]", nc.groupLabel)}>
                      {group.label}
                    </p>
                  ) : (
                    <div className={cn("mx-2 my-2.5 h-px", nc.divider)} />
                  )}
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active =
                        pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                      const Icon = iconRegistry[item.icon];
                      const icon = (
                        <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? nc.iconActive : nc.iconIdle)} strokeWidth={1.5} />
                      );

                      const showOnboardingHint =
                        selectedRole === "newUser" && navOnboardingHints.has(item.href);

                      const link = (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "group relative flex items-center border font-medium",
                            collapsed ? "h-10 w-10 justify-center rounded-[10px] px-0" : "h-10 gap-2.5 rounded-[10px] px-2.5",
                            active ? nc.linkActive : nc.linkIdle,
                          )}
                        >
                          {icon}
                          {!collapsed ? (
                            <span className="truncate text-[13px] font-medium leading-none text-inherit">{item.label}</span>
                          ) : null}
                          {showOnboardingHint ? (
                            <span
                              className={cn(
                                "absolute rounded-full bg-[rgb(var(--accent-rgb))] shadow-[0_0_10px_2px_rgb(var(--accent-rgb)/0.45)]",
                                collapsed ? "right-1.5 top-1.5 h-2 w-2" : "right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2",
                              )}
                              aria-label="Setup suggested"
                            />
                          ) : null}
                        </Link>
                      );

                      if (!collapsed) return link;

                      return (
                        <Tooltip key={item.href} delayDuration={200}>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right" sideOffset={8}>
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className={cn("border-t", nc.hairline, collapsed ? "p-2" : "p-2.5")}>
              {collapsed ? (
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className={cn(
                        "mt-0.5 flex h-10 w-full items-center justify-center rounded-[10px] border border-transparent font-medium",
                        nc.settingsRow,
                      )}
                    >
                      <LogOut className={cn("h-[18px] w-[18px]", nc.settingsIconIdle)} strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    Logout
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className={cn(
                    "mt-0.5 flex h-10 w-full items-center gap-2.5 rounded-[10px] border border-transparent px-2.5 font-medium",
                    nc.settingsRow,
                  )}
                >
                  <LogOut className={cn("h-[18px] w-[18px]", nc.settingsIconIdle)} strokeWidth={1.5} />
                  <span className="text-[13px] font-medium text-inherit">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:overflow-hidden">
        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden p-3 sm:p-4 md:p-5",
            isNewUserDashboard ? "overflow-hidden" : "overflow-y-auto",
          )}
        >
          <header className="sticky top-0 z-[100] isolate mb-3 shrink-0 rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-surface py-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/[0.06] sm:mb-4">
            <div className="flex flex-col gap-2 px-2.5 py-2 sm:flex-row sm:items-center sm:gap-2.5 sm:px-3 sm:py-2.5 lg:gap-3">
              <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 shrink-0 rounded-[10px] border-[rgba(15,23,42,0.08)] px-0 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation"
                >
                  <Menu className="h-4 w-4" strokeWidth={1.5} />
                </Button>
                <ToolbarBrand />
              </div>

              <div className="flex min-w-0 w-full flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                <GlobalSearch className="sm:flex-[1.4] lg:flex-[2]" />

                <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5">
                  <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as PreviewRole)}>
                    <TabsList
                      size="compact"
                      className="max-w-full border-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      aria-label="Preview role"
                    >
                      {PREVIEW_ROLE_OPTIONS.map(({ value, label }) => (
                        <TabsTrigger key={value} value={value} size="compact">
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  <FeedbackNotificationsMenu />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                    className="h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.05)] bg-transparent px-0 transition-all duration-[180ms] ease-out hover:border-[rgba(15,23,42,0.08)] hover:bg-[rgba(15,23,42,0.03)]"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={1.5} /> : <Moon className="h-4 w-4" strokeWidth={1.5} />}
                  </Button>

                  <button
                    type="button"
                    title={session?.user?.name ?? "Profile"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.08)] bg-gradient-to-br from-accent-deep to-accent-900 text-xs font-semibold text-white shadow-sm"
                  >
                    {initials(session?.user?.name ?? session?.user?.email)}
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div
            className={cn(
              "relative z-0 min-w-0 flex-1 pt-1",
              isNewUserDashboard ? "flex min-h-0 flex-col overflow-hidden pb-0" : "pb-6 sm:pb-8",
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
