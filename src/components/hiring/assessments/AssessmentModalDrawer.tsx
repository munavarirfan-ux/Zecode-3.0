"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  dialogCloseButtonSm,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function AssessmentModalDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  placement = "drawer",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
  /** Right drawer (default) or centered modal */
  placement?: "drawer" | "center";
}) {
  const isCentered = placement === "center";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[120]" />
        <div
          className={cn(
            "fixed inset-0 z-[120] flex p-3 sm:p-5",
            isCentered ? "items-center justify-center" : "items-stretch justify-end",
          )}
        >
          <DialogPanel
            className={cn(
              "flex w-full flex-col overflow-hidden rounded-[20px]",
              "border border-white/60 bg-white/90 shadow-[0_24px_80px_-24px_rgba(var(--accent-rgb),0.35)]",
              "backdrop-blur-[24px] dark:border-white/10 dark:bg-[#141416]/95",
              isCentered
                ? "max-h-[min(90dvh,720px)] max-w-[480px] data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0"
                : "h-full max-w-[440px] data-[state=open]:animate-in data-[state=open]:slide-in-from-right-8 data-[state=open]:fade-in-0 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-8 data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
              className,
            )}
          >
            <div className="relative shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.08),transparent)] px-5 py-4 dark:border-white/[0.06]">
              <DialogTitle className="pr-8 text-[1.0625rem] font-semibold tracking-[-0.03em] text-text">
                {title}
              </DialogTitle>
              {description ? (
                <p className="mt-1 text-[12px] leading-snug text-muted">{description}</p>
              ) : null}
              <DialogClose
                className={cn("absolute right-3 top-3", dialogCloseButtonSm)}
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </DialogClose>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-5 py-4">{children}</div>
            <div className="shrink-0 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
              {footer}
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
