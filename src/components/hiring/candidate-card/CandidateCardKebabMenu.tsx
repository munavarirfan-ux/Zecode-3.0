"use client";

import {
  Calendar,
  Eye,
  Mail,
  MessageCircle,
  MoreHorizontal,
  MoveRight,
  StickyNote,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getKebabMenuActions,
  getMenuActionLabel,
  type KanbanMenuAction,
  type StageActionContext,
} from "@/lib/hiring/stage-actions";
import { cn } from "@/lib/utils";

const MENU_ICONS: Partial<Record<KanbanMenuAction, typeof Calendar>> = {
  viewProfile: Eye,
  schedule: Calendar,
  moveNext: MoveRight,
  sendEmail: Mail,
  requestFeedback: MessageCircle,
  addNote: StickyNote,
  reject: UserX,
};

const menuItemClass = "text-[12px]";

export function CandidateCardKebabMenu({
  actionContext,
  onMenuAction,
  triggerClassName,
}: {
  actionContext: StageActionContext;
  onMenuAction: (action: KanbanMenuAction) => void;
  triggerClassName?: string;
}) {
  const menuActions = getKebabMenuActions(actionContext).filter(
    (a) => !a.startsWith("setVerdict"),
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={triggerClassName ?? "h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Candidate actions"
        >
          <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {menuActions.map((action) => {
          if (action === "reject") return null;
          const Icon = MENU_ICONS[action];
          return (
            <DropdownMenuItem
              key={action}
              className={menuItemClass}
              onSelect={(e) => {
                e.preventDefault();
                onMenuAction(action);
              }}
            >
              {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} /> : null}
              {getMenuActionLabel(action)}
            </DropdownMenuItem>
          );
        })}

        {menuActions.includes("reject") ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn(menuItemClass, "text-red-700 focus:text-red-700 dark:text-red-300")}
              onSelect={(e) => {
                e.preventDefault();
                onMenuAction("reject");
              }}
            >
              <UserX className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              Reject
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
