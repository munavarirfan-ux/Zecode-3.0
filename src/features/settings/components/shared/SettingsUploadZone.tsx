"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { settingsAccentBg, settingsAccentBorder } from "../../settingsTokens";

export function SettingsUploadZone({
  label,
  hint,
  accept,
  preview,
  onFile,
  className,
}: {
  label: string;
  hint: string;
  accept: string;
  preview?: React.ReactNode;
  onFile: (file: File, previewUrl: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onFile(file, url);
    },
    [onFile],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[12px] font-medium text-text">{label}</p>
      {preview ? <div className="mb-2">{preview}</div> : null}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed px-4 py-6 transition-colors duration-[180ms]",
          settingsAccentBorder,
          dragOver ? settingsAccentBg : "bg-white/50 dark:bg-white/[0.02]",
        )}
      >
        <Upload className="h-6 w-6 text-accent" strokeWidth={1.5} />
        <p className="mt-2 text-[12px] font-medium text-text">Drag & drop or click to upload</p>
        <p className="text-[11px] text-muted">{hint}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
