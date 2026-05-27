"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Native input styled for use with Radix `Label` — standard Radix form pattern. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-10 w-full min-w-0 rounded-[10px] border border-border-subtle bg-surface px-3 py-2 text-base text-text shadow-none md:text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-subtle",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
