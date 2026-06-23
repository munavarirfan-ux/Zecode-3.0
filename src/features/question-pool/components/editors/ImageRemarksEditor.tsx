"use client";

import { useCallback, useRef } from "react";
import { ImagePlus, Link2, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FrontendLink } from "../../types";
import { MarkdownEditor } from "./MarkdownEditor";

const ACCEPTED = ".png,.jpg,.jpeg,.svg,.webp";

function newLinkId() {
  return `l-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ImageRemarksEditor({
  referenceImage,
  uiRemarks,
  evaluationRemarks,
  frontendLinks,
  onPatch,
}: {
  referenceImage: string;
  uiRemarks: string;
  evaluationRemarks: string;
  frontendLinks: FrontendLink[];
  onPatch: (patch: {
    referenceImage?: string;
    uiRemarks?: string;
    evaluationRemarks?: string;
    frontendLinks?: FrontendLink[];
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

  const updateLink = (id: string, patch: Partial<FrontendLink>) => {
    onPatch({
      frontendLinks: frontendLinks.map((l) =>
        l.id === id ? { ...l, ...patch } : l,
      ),
    });
  };

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

      {/* Links */}
      <div className="space-y-3">
        <h3 className="text-[12px] font-semibold text-text">
          Assets / Reference Links
          <span className="ml-1 text-[10px] font-normal text-muted">
            (optional)
          </span>
        </h3>
        {frontendLinks.length > 0 && (
          <div className="space-y-2">
            {frontendLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-2 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/80 p-2.5 dark:bg-white/[0.03]"
              >
                <Link2 className="h-3.5 w-3.5 shrink-0 text-muted" />
                <input
                  value={link.label}
                  onChange={(e) =>
                    updateLink(link.id, { label: e.target.value })
                  }
                  placeholder="Label (e.g. Figma link)"
                  className={cn(
                    "h-8 w-36 shrink-0 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-surface px-2.5 text-[12px] outline-none",
                    "focus-visible:ring-2 focus-visible:ring-accent/20",
                  )}
                />
                <input
                  value={link.url}
                  onChange={(e) =>
                    updateLink(link.id, { url: e.target.value })
                  }
                  placeholder="https://..."
                  className={cn(
                    "h-8 flex-1 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-surface px-2.5 text-[12px] outline-none",
                    "focus-visible:ring-2 focus-visible:ring-accent/20",
                  )}
                />
                <button
                  type="button"
                  onClick={() =>
                    onPatch({
                      frontendLinks: frontendLinks.filter(
                        (l) => l.id !== link.id,
                      ),
                    })
                  }
                  className="rounded-[8px] p-1.5 text-muted hover:text-red-600"
                  aria-label="Remove link"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            onPatch({
              frontendLinks: [
                ...frontendLinks,
                { id: newLinkId(), url: "", label: "" },
              ],
            })
          }
          className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-dashed border-[rgba(15,23,42,0.12)] px-3 text-[12px] font-medium text-accent hover:bg-[rgba(124,58,237,0.06)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Link
        </button>
      </div>
    </div>
  );
}
