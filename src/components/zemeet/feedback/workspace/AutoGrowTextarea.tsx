"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function AutoGrowTextarea({
  value,
  onChange,
  placeholder,
  className,
  readOnly,
  minRows = 1,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 21;
    const minH = lineHeight * minRows + 16;
    el.style.height = `${Math.max(minH, el.scrollHeight)}px`;
  }, [minRows]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={ref}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      rows={minRows}
      onChange={(e) => onChange(e.target.value)}
      onInput={resize}
      className={cn(className, readOnly && "cursor-default opacity-80")}
    />
  );
}
