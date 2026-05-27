"use client";

import { useState } from "react";
import { ChevronDown, Mail, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonPositionClass,
  dialogCloseButtonSm,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { resolveEmailBody } from "@/lib/hiring/resolveEmailBody";
import type { CandidateEmail, HiringCandidate } from "@/lib/hiring/types";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { dashboardRowSurface } from "@/components/dashboard/dashboardTokens";

function EmailViewDialog({
  email,
  open,
  onOpenChange,
}: {
  email: CandidateEmail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!email) return null;

  const body = resolveEmailBody(email);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[260] bg-[rgba(15,23,42,0.45)] backdrop-blur-[4px]" />
        <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 sm:p-6">
          <DialogPanel
            className={cn(
              "flex max-h-[min(85dvh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-[14px]",
              "border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.2)]",
              "dark:border-white/[0.08] dark:bg-surface",
              "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
            )}
          >
            <header className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 py-4 dark:border-white/[0.06]">
              <div className="flex items-start justify-between gap-3 pr-8">
                <DialogTitle className="text-left text-[16px] font-semibold leading-snug tracking-[-0.02em] text-[#18181B] dark:text-text">
                  {email.subject}
                </DialogTitle>
                <DialogClose
                  className={cn(dialogCloseButtonPositionClass, dialogCloseButtonSm)}
                  aria-label="Close email"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </DialogClose>
              </div>
              <DialogDescription className="sr-only">Full email message</DialogDescription>
              <dl className="mt-3 space-y-1 text-[12px]">
                <div className="flex gap-2">
                  <dt className="w-12 shrink-0 text-[#A1A1AA]">From</dt>
                  <dd className="text-[#52525B] dark:text-text-muted">{email.sender}</dd>
                </div>
                {email.recipient ? (
                  <div className="flex gap-2">
                    <dt className="w-12 shrink-0 text-[#A1A1AA]">To</dt>
                    <dd className="text-[#52525B] dark:text-text-muted">{email.recipient}</dd>
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <dt className="w-12 shrink-0 text-[#A1A1AA]">Date</dt>
                  <dd className="tabular-nums text-[#52525B] dark:text-text-muted">{email.timestamp}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-12 shrink-0 text-[#A1A1AA]">Type</dt>
                  <dd className="text-[#52525B] dark:text-text-muted">{email.type}</dd>
                </div>
              </dl>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#44403C] dark:text-[#E7E5E4]">
                {body}
              </p>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}

export function EmailFeed({ emails }: { emails: HiringCandidate["emails"] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = emails.find((e) => e.id === selectedId) ?? null;

  if (emails.length === 0) {
    return (
      <LineArtEmptyState illustration="email" message="No email activity." size="compact" className="py-6" />
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {emails.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => setSelectedId(e.id)}
              className={cn(
                dashboardRowSurface,
                "w-full text-left transition-colors hover:border-[rgba(15,23,42,0.1)] hover:bg-[#FAFAFA] dark:hover:bg-white/[0.03]",
              )}
            >
              <Mail className="h-4 w-4 shrink-0 text-[#A1A1AA]" strokeWidth={1.5} />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <p className="text-[13px] font-medium text-[#18181B] dark:text-text">{e.subject}</p>
                  <time className="shrink-0 text-[11px] tabular-nums text-[#A1A1AA]">{e.timestamp}</time>
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] text-[#52525B] dark:text-text-muted">{e.preview}</p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 -rotate-90 text-[#A1A1AA]" strokeWidth={1.5} aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <EmailViewDialog
        email={selected}
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </>
  );
}
