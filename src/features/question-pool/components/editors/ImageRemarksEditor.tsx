"use client";

import { useCallback, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownEditor } from "./MarkdownEditor";

const ACCEPTED = ".png,.jpg,.jpeg,.svg,.webp";

export function ImageRemarksEditor({
  referenceImage,
  uiRemarks,
  evaluationRemarks,
  onPatch,
}: {
  referenceImage: string;
  uiRemarks: string;
  evaluationRemarks: string;
  onPatch: (patch: {
    referenceImage?: string;
    uiRemarks?: string;
    evaluationRemarks?: string;
  }) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      onPatch({ referenceImage: url });
    },
    [onPatch],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="space-y-6">
      {/* Reference Image */}
      <div className="space-y-2">
        <h3 className="text-[12px] font-semibold text-text">
          Upload Reference Image
        </h3>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {referenceImage ? (
          <div className="relative inline-block">
            <img
              src={referenceImage}
              alt="Reference"
              className="max-h-52 rounded-[12px] border border-[rgba(15,23,42,0.08)] object-contain"
            />
            <button
              type="button"
              onClick={() => onPatch({ referenceImage: "" })}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[rgba(15,23,42,0.12)] py-10",
              "text-muted transition-colors hover:border-accent/40 hover:bg-[rgba(124,58,237,0.03)]",
            )}
          >
            <ImagePlus className="h-8 w-8 text-muted/60" />
            <span className="text-[12px] font-medium">
              Click or drag & drop to upload
            </span>
            <span className="text-[10px] text-muted/70">
              PNG, JPG, JPEG, SVG, WebP
            </span>
          </button>
        )}
      </div>

      {/* UI Remarks */}
      <MarkdownEditor
        label="UI Remarks / Requirements"
        value={uiRemarks}
        onChange={(v) => onPatch({ uiRemarks: v })}
        placeholder="Add layout notes, visual expectations, responsive behavior, or design constraints..."
      />

      {/* Evaluation Remarks */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-text">
          Evaluation Remarks
          <span className="ml-1 text-[10px] font-normal text-muted">
            (internal, not shown to candidate)
          </span>
        </label>
        <textarea
          value={evaluationRemarks}
          onChange={(e) => onPatch({ evaluationRemarks: e.target.value })}
          placeholder="Add internal evaluator notes or acceptance criteria..."
          className={cn(
            "min-h-[100px] w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 py-2 text-[13px] outline-none",
            "focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]",
          )}
        />
      </div>
    </div>
  );
}
