"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-white shadow-sm hover:bg-[rgb(var(--accent-hover-rgb))]",
        primary: "bg-primary text-white hover:bg-[rgb(var(--accent-hover-rgb))] shadow-sm",
        secondary:
          "border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] text-text hover:bg-[rgba(15,23,42,0.06)] dark:border-white/[0.08] dark:bg-white/[0.04]",
        outline:
          "border border-border-subtle bg-surface text-text shadow-none hover:bg-surface-2 dark:border-border-subtle dark:hover:bg-white/[0.04]",
        ghost: "text-text-secondary hover:bg-app-bg hover:text-text",
        /** Evaluate — review application (solid) */
        review:
          "bg-[var(--btn-review-bg)] text-[var(--btn-review-text)] shadow-sm hover:bg-[var(--btn-review-bg-hover)] focus-visible:ring-[var(--btn-review-bg)]",
        /** Review — surface blue */
        "review-surface":
          "bg-[var(--info-bg)] text-[var(--info)] shadow-none hover:bg-[rgb(var(--info-rgb)/0.14)] focus-visible:ring-[rgb(var(--info-rgb)/0.3)] dark:bg-[rgb(var(--info-rgb)/0.2)] dark:text-[rgb(var(--info-rgb))] dark:hover:bg-[rgb(var(--info-rgb)/0.28)]",
        /** Request feedback — surface yellow */
        "feedback-surface":
          "bg-[var(--warning-bg)] text-[rgb(133_77_14)] shadow-none hover:bg-[rgb(var(--warning-rgb)/0.2)] focus-visible:ring-[rgb(var(--warning-rgb)/0.35)] dark:bg-[rgb(var(--warning-rgb)/0.18)] dark:text-[rgb(var(--warning-rgb))] dark:hover:bg-[rgb(var(--warning-rgb)/0.26)]",
        /** Set up future activity — follows appearance primary accent (theme settings) */
        schedule:
          "bg-accent text-white shadow-sm hover:bg-[rgb(var(--accent-hover-rgb))] focus-visible:ring-accent/25",
        /** Move candidate forward — solid green */
        advance:
          "bg-[var(--btn-advance-bg)] text-[var(--btn-advance-text)] shadow-sm hover:bg-[var(--btn-advance-bg-hover)] focus-visible:ring-[var(--btn-advance-bg)]",
        /** Move to interview — surface accent (theme) */
        "advance-surface":
          "bg-[rgb(var(--accent-soft-rgb))] text-[rgb(var(--accent-deep-rgb))] shadow-none ring-1 ring-inset ring-[rgb(var(--accent-rgb)/0.14)] hover:bg-[rgb(var(--accent-100-rgb))] focus-visible:ring-accent/25 dark:ring-[rgb(var(--accent-rgb)/0.22)]",
        /** Move to next stage — surface green */
        "advance-green-surface":
          "bg-[var(--success-bg)] text-[var(--success)] shadow-none hover:bg-[rgb(var(--success-rgb)/0.16)] focus-visible:ring-[rgb(var(--success-rgb)/0.3)] dark:bg-[rgb(var(--success-rgb)/0.18)] dark:text-[rgb(var(--success-rgb))] dark:hover:bg-[rgb(var(--success-rgb)/0.26)]",
        /** Read-only or terminal — view schedule, view profile */
        view: "border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] shadow-none hover:bg-[var(--surface-2)] focus-visible:ring-[var(--border-strong)]",
        /** Low-emphasis text action — view offer on sent column */
        tertiary:
          "border-0 bg-transparent text-muted shadow-none hover:bg-[rgba(15,23,42,0.04)] hover:text-text dark:hover:bg-white/[0.04]",
        /** Soft accent fill — onboard on hired column */
        soft:
          "bg-[rgb(var(--accent-soft-rgb))] text-[rgb(var(--accent-deep-rgb))] shadow-none ring-1 ring-inset ring-[rgb(var(--accent-rgb)/0.12)] hover:bg-[rgb(var(--accent-100-rgb))] focus-visible:ring-accent/20 dark:ring-[rgb(var(--accent-rgb)/0.2)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4",
        lg: "h-11 px-6",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
