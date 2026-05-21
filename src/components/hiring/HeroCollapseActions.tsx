"use client";

import * as React from "react";
import { isValidElement } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { hiringHeroCollapsedIconBtn } from "./hiringTokens";
import { useHeroCollapseContext } from "./HeroCollapseContext";

function extractButtonLabel(children: React.ReactNode): string | undefined {
  let label = "";
  React.Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      const t = String(child).trim();
      if (t) label = label ? `${label} ${t}` : t;
    }
  });
  return label || undefined;
}

function extractButtonIcon(children: React.ReactNode): React.ReactNode | null {
  let icon: React.ReactNode = null;
  React.Children.forEach(children, (child) => {
    if (isValidElement(child) && typeof child.type !== "string") {
      if (!icon) icon = child;
      return;
    }
    if (isValidElement(child) && child.props?.children) {
      const nested = extractButtonIcon(child.props.children);
      if (nested && !icon) icon = nested;
    }
  });
  return icon;
}

function compactButton(child: React.ReactElement) {
  const label = extractButtonLabel(child.props.children);
  const icon = extractButtonIcon(child.props.children);
  if (!icon) return child;

  return (
    <Tooltip key={child.key ?? label}>
      <TooltipTrigger asChild>
        <Button
          {...child.props}
          size="icon"
          className={cn(hiringHeroCollapsedIconBtn, child.props.className)}
          aria-label={child.props["aria-label"] ?? label}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      {label ? <TooltipContent side="bottom">{label}</TooltipContent> : null}
    </Tooltip>
  );
}

/** Wraps hero actions — auto icon-only for plain buttons when the hero is collapsed */
export function HeroCollapseActions({ children }: { children: React.ReactNode }) {
  const heroCollapsed = useHeroCollapseContext();
  if (!heroCollapsed) return <>{children}</>;

  return (
    <>
      {React.Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        // HeroActionButton handles collapsed UI itself
        const typeName =
          typeof child.type === "function"
            ? (child.type as { displayName?: string; name?: string }).displayName ??
              (child.type as { name?: string }).name
            : undefined;
        if (typeName === "HeroActionButton") {
          return child;
        }
        if (child.type === Button) return compactButton(child);
        return child;
      })}
    </>
  );
}
