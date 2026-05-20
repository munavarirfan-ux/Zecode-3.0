"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { radixContent, radixOverlay } from "@/lib/radix-motion";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

/** App-wide modal dismiss — bright red surface, white icon, no border */
export const dialogCloseButtonClass = cn(
  "inline-flex shrink-0 items-center justify-center border-0 p-0",
  "bg-[#EF4444] text-white",
  "shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
  "transition-[color,background-color,box-shadow] duration-[180ms] ease-out",
  "hover:bg-[#DC2626] hover:text-white",
  "hover:shadow-[0_4px_14px_rgba(0,0,0,0.22),0_0_0_4px_rgba(239,68,68,0.22)]",
  "active:bg-[#B91C1C] active:text-white",
  "active:shadow-[0_2px_8px_rgba(0,0,0,0.24),0_0_0_4px_rgba(239,68,68,0.14)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
  "disabled:pointer-events-none disabled:opacity-50",
);

export const dialogCloseButtonSm = cn(dialogCloseButtonClass, "h-9 w-9 rounded-[10px]");
export const dialogCloseButtonMd = cn(dialogCloseButtonClass, "h-10 w-10 rounded-[10px]");
export const dialogCloseButtonLg = cn(dialogCloseButtonClass, "h-11 w-11 rounded-[10px]");

export const dialogCloseButtonPositionClass = "absolute right-4 top-4 z-10";

/** @deprecated Use dialogCloseButtonSm */
export const dialogCloseButtonOnDarkClass = dialogCloseButtonSm;

/** @deprecated Use dialogCloseButtonLg */
export const dialogCloseButtonReportHeroClass = dialogCloseButtonLg;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50", radixOverlay, className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  /** Optional z-index / overlay classes when stacking above another dialog */
  overlayClassName?: string;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, overlayClassName, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className={overlayClassName} />
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4",
        overlayClassName,
      )}
    >
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "pointer-events-auto relative z-50 w-full max-w-lg",
          "rounded-[16px] border border-[rgba(15,23,42,0.06)] bg-surface p-6 shadow-[0_24px_64px_rgba(15,23,42,0.12)]",
          "focus:outline-none dark:border-white/[0.08]",
          radixContent,
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(dialogCloseButtonPositionClass, dialogCloseButtonSm)}
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 pr-8 text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight text-text", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-text-secondary/80", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

/** Radix Dialog.Content without default modal chrome — for full-bleed / custom layouts. */
const DialogPanel = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn("focus:outline-none", className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
));
DialogPanel.displayName = "DialogPanel";

const DialogCloseIcon = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(dialogCloseButtonSm, className)}
    aria-label="Close"
    {...props}
  >
    <X className="h-4 w-4" strokeWidth={2} />
  </DialogPrimitive.Close>
));
DialogCloseIcon.displayName = "DialogCloseIcon";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogCloseIcon,
  DialogTrigger,
  DialogContent,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPrimitive,
};
