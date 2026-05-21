"use client";

import * as React from "react";
import { isValidElement } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  hiringHeroCollapsedIconBtn,
  hiringHeroPrimaryBtnSm,
  hiringHeroSecondaryBtnSm,
} from "./hiringTokens";
import { useHeroCollapseContext } from "./HeroCollapseContext";

function isIconElement(child: React.ReactNode): boolean {
  return isValidElement(child) && typeof child.type !== "string";
}

/** Split `[<Icon />, "Label"]` children when `icon` prop is omitted */
function parseActionChildren(children: React.ReactNode): {
  icon: React.ReactNode | null;
  label: React.ReactNode;
} {
  const nodes: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (child != null && child !== false) nodes.push(child);
  });

  if (nodes.length === 0) return { icon: null, label: null };
  if (nodes.length === 1) {
    return isIconElement(nodes[0])
      ? { icon: nodes[0], label: null }
      : { icon: null, label: nodes[0] };
  }

  const icon = nodes.find(isIconElement) ?? null;
  const labelParts = nodes.filter((n) => n !== icon);
  const label =
    labelParts.length === 0
      ? null
      : labelParts.length === 1
        ? labelParts[0]
        : labelParts;

  return { icon, label };
}

type HeroActionButtonProps = React.ComponentProps<typeof Button> & {
  /** Icon node — optional if the first child is a Lucide/icon element */
  icon?: React.ReactNode;
  /** Visible label when expanded; tooltip when collapsed */
  children?: React.ReactNode;
  tooltip?: string;
  variant?: "primary" | "secondary";
};

export const HeroActionButton = React.forwardRef<HTMLButtonElement, HeroActionButtonProps>(
  function HeroActionButton(
    { icon: iconProp, children, tooltip, variant = "secondary", className, size, ...props },
    ref,
  ) {
    const heroCollapsed = useHeroCollapseContext();
    const parsed = iconProp
      ? { icon: iconProp, label: children ?? null }
      : parseActionChildren(children);

    const labelText =
      tooltip ??
      (typeof parsed.label === "string" ? parsed.label : undefined) ??
      (typeof children === "string" ? children : undefined);

    if (heroCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              type="button"
              variant="outline"
              size="icon"
              className={cn(hiringHeroCollapsedIconBtn, className)}
              aria-label={labelText}
              {...props}
            >
              {parsed.icon}
            </Button>
          </TooltipTrigger>
          {labelText ? <TooltipContent side="bottom">{labelText}</TooltipContent> : null}
        </Tooltip>
      );
    }

    const styleClass = variant === "primary" ? hiringHeroPrimaryBtnSm : hiringHeroSecondaryBtnSm;

    return (
      <Button
        ref={ref}
        type="button"
        size={size ?? "sm"}
        className={cn(styleClass, className)}
        {...props}
      >
        {parsed.icon}
        {parsed.label}
      </Button>
    );
  },
);

HeroActionButton.displayName = "HeroActionButton";
