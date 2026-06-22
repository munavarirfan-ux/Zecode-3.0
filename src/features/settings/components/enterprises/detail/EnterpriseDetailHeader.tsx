"use client";

import {
  Edit3,
  Layers,
  Settings2,
  MoreHorizontal,
  Pause,
  Play,
  KeyRound,
  Download,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { HiringPageHeader } from "@/components/hiring/HiringPageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hiringTransition } from "@/components/hiring/hiringTokens";
import { settingsPrimaryBtn, settingsSecondaryBtn } from "../../../settingsTokens";
import { useEnterpriseEnabledStore } from "../../../store/enterpriseEnabledStore";
import type { EnterpriseDetail } from "./enterpriseDetailMock";

const menuContentClass = cn(
  "z-[100] w-[220px] min-w-0 overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
  "dark:border-white/[0.08] dark:bg-surface",
);

function MenuItem({
  icon: Icon,
  label,
  destructive,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  destructive?: boolean;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className={cn(
        "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0",
        "text-[12px] font-medium outline-none transition-colors duration-150 ease-out",
        "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
        "dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]",
        destructive
          ? "text-red-700 dark:text-red-300"
          : "text-text/90",
      )}
    >
      <Icon className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} />
      {label}
    </DropdownMenuItem>
  );
}

export function EnterpriseDetailHeader({
  enterprise,
  onFeaturesOpen,
  onConfigureOpen,
}: {
  enterprise: EnterpriseDetail;
  onFeaturesOpen: () => void;
  onConfigureOpen: () => void;
}) {
  const isEnabled = useEnterpriseEnabledStore((s) => s.isEnabled);
  const setEnabled = useEnterpriseEnabledStore((s) => s.setEnabled);
  const enabled = isEnabled(enterprise.domain);

  const handleSuspend = () => {
    setEnabled(enterprise.domain, false);
    toast.success(`${enterprise.name} suspended`);
  };

  const handleActivate = () => {
    setEnabled(enterprise.domain, true);
    toast.success(`${enterprise.name} activated`);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${enterprise.name}? This cannot be undone.`)) {
      toast.success(`${enterprise.name} deleted`);
    }
  };

  return (
    <HiringPageHeader
      title={enterprise.name}
      subtitle={`${enterprise.domain} · ${enterprise.location}`}
      breadcrumb={[
        { label: "All Enterprises", href: ROUTES.settingsEnterprises },
        { label: enterprise.name, current: true },
      ]}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={settingsPrimaryBtn} onClick={() => toast.message("Edit enterprise")}>
            <Edit3 className="h-3.5 w-3.5" strokeWidth={2} />
            Edit Enterprise
          </button>
          <button type="button" className={settingsSecondaryBtn} onClick={onFeaturesOpen}>
            <Layers className="h-3.5 w-3.5" strokeWidth={2} />
            Features
          </button>
          <button type="button" className={settingsSecondaryBtn} onClick={onConfigureOpen}>
            <Settings2 className="h-3.5 w-3.5" strokeWidth={2} />
            Configure
          </button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white",
                  hiringTransition,
                  "hover:bg-[rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:bg-surface",
                )}
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" sideOffset={4} className={menuContentClass}>
              <DropdownMenuLabel className="px-2 pb-0.5 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/55">
                Actions
              </DropdownMenuLabel>
              {enabled ? (
                <MenuItem icon={Pause} label="Suspend Enterprise" onSelect={handleSuspend} />
              ) : (
                <MenuItem icon={Play} label="Activate Enterprise" onSelect={handleActivate} />
              )}
              <MenuItem icon={KeyRound} label="Reset Passwords" onSelect={() => toast.message("Passwords reset")} />
              <MenuItem icon={Download} label="Export Data" onSelect={() => toast.message("Export started")} />
              <DropdownMenuSeparator className="-mx-0 my-0.5 h-px bg-[rgba(15,23,42,0.06)] dark:bg-white/[0.06]" />
              <MenuItem icon={Trash2} label="Delete Enterprise" destructive onSelect={handleDelete} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    />
  );
}
