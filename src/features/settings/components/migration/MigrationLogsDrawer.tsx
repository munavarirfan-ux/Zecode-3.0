"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { radixOverlay } from "@/lib/radix-motion";
import type { MigrationHistoryItem } from "../../settingsTypes";
import { settingsModalShadow } from "../../settingsTokens";
import { MigrationRunPill } from "./MigrationStatusPill";

export function MigrationLogsDrawer({
  item,
  open,
  onOpenChange,
}: {
  item: MigrationHistoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!item) return null;

  const executedOn = format(new Date(item.executedAt), "dd/MM/yyyy · h:mm a");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0 z-[130]", radixOverlay)} />
        <div className="fixed inset-0 z-[130] flex justify-end p-3 sm:p-4">
          <Dialog.Content
            className={cn(
              "flex h-full w-full max-w-[520px] flex-col overflow-hidden rounded-[20px]",
              cn(
                "border border-white/60 bg-white/95 backdrop-blur-xl",
                settingsModalShadow,
              ),
              "focus:outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right-8 data-[state=open]:fade-in-0",
              "dark:border-white/10 dark:bg-[#141416]/98",
            )}
          >
            <div className="relative shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
              <div className="flex items-center gap-2 pr-8">
                <MigrationRunPill status={item.status} />
                <span className="text-[11px] text-muted">{item.source}</span>
              </div>
              <Dialog.Title className="mt-2 text-[1rem] font-semibold tracking-[-0.02em] text-text">
                {item.name}
              </Dialog.Title>
              <Dialog.Close
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-muted hover:bg-[rgba(15,23,42,0.04)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
              <dl className="grid gap-3 text-[13px]">
                <Row label="Executed on" value={executedOn} />
                <Row label="Executed by" value={item.executedBy} />
                <Row label="Duration" value={item.duration ?? "—"} />
                <Row label="Affected records" value={String(item.affectedRecords)} />
              </dl>

              {item.logOutput ? (
                <div className="mt-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Log output
                  </p>
                  <pre className="max-h-48 overflow-auto rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.02)] p-3 font-mono text-[11px] leading-relaxed text-text-secondary/90 dark:border-white/[0.08]">
                    {item.logOutput}
                  </pre>
                </div>
              ) : null}

              {item.errors && item.errors.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-red-600">
                    Errors
                  </p>
                  <ul className="space-y-1.5">
                    {item.errors.map((err) => (
                      <li
                        key={err}
                        className="rounded-[10px] border border-red-400/20 bg-red-50/50 px-3 py-2 text-[12px] text-red-800 dark:bg-red-950/30 dark:text-red-300"
                      >
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="shrink-0 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
              <button
                type="button"
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] bg-accent text-[13px] font-semibold text-white hover:bg-accent-hover"
              >
                <Download className="h-4 w-4" />
                Download report
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-text">{value}</dd>
    </div>
  );
}
