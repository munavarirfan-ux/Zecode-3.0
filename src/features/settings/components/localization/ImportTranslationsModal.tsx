"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { radixOverlay } from "@/lib/radix-motion";
import { LOCALIZATION_LANGUAGES } from "../../constants/localizationLanguages";
import { settingsAccentBg, settingsAccentBorder, settingsModalShadow } from "../../settingsTokens";

export function ImportTranslationsModal({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: () => void;
}) {
  const [conflict, setConflict] = useState<"overwrite" | "keep" | "review">("review");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0 z-[130]", radixOverlay)} />
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <Dialog.Content
            className={cn(
              "w-full max-w-[440px] rounded-[20px] border border-white/60 bg-white/95 p-6 backdrop-blur-xl",
              "focus:outline-none dark:border-white/10 dark:bg-[#141416]/98",
              settingsModalShadow,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <Dialog.Title className="text-[1rem] font-semibold text-text">
                Import translations
              </Dialog.Title>
              <Dialog.Close
                className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-muted hover:bg-[rgba(15,23,42,0.04)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            <p className="mt-2 text-[13px] text-text-secondary/85">
              Upload a JSON or CSV file to merge into the selected language.
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-[12px] font-medium text-text">Language</span>
                <select className="mt-1.5 h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 text-[13px] dark:bg-white/[0.04]">
                  {LOCALIZATION_LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>

              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-[12px] border border-dashed",
                  settingsAccentBorder,
                  settingsAccentBg,
                  "px-4 py-8",
                )}
              >
                <Upload className="h-8 w-8 text-accent" strokeWidth={1.5} />
                <p className="mt-2 text-[13px] font-medium text-text">Drop JSON or CSV</p>
                <p className="text-[11px] text-muted">or click to browse</p>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-[12px] font-medium text-text">Conflict handling</legend>
                {(
                  [
                    { id: "overwrite", label: "Overwrite existing keys" },
                    { id: "keep", label: "Keep existing values" },
                    { id: "review", label: "Review changes before applying" },
                  ] as const
                ).map((opt) => (
                  <label key={opt.id} className="flex cursor-pointer items-center gap-2 text-[13px]">
                    <input
                      type="radio"
                      name="conflict"
                      checked={conflict === opt.id}
                      onChange={() => setConflict(opt.id)}
                      className="accent-accent"
                    />
                    {opt.label}
                  </label>
                ))}
              </fieldset>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close
                type="button"
                className="h-9 rounded-[10px] border border-[rgba(15,23,42,0.08)] px-4 text-[13px] font-medium"
              >
                Cancel
              </Dialog.Close>
              <button
                type="button"
                onClick={() => {
                  if (!fileName) return;
                  onImport();
                  onOpenChange(false);
                  setFileName(null);
                }}
                disabled={!fileName}
                className="h-9 rounded-[10px] bg-accent px-4 text-[13px] font-semibold text-white hover:bg-accent-hover"
              >
                Import
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
