"use client";

import { useState } from "react";
import { Download, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  dialogCloseButtonSm,
} from "@/components/ui/dialog";
import { addAssessmentCandidate } from "@/lib/hiring/assessments/assessmentCandidates";
import { cn } from "@/lib/utils";

const TEMPLATE = "name,email,linkedin_url,phone,resume_link\nJane Doe,jane@corp.com,linkedin.com/in/janedoe,,,\n";

type PreviewRow = { name: string; email: string; error?: string };

export function BulkInviteDialog({
  open,
  onOpenChange,
  assessmentId,
  onInvited,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
  onInvited?: () => void;
}) {
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/).slice(1);
    const rows: PreviewRow[] = [];
    const emails = new Set<string>();
    lines.forEach((line, i) => {
      const [name, email] = line.split(",").map((s) => s.trim());
      if (!name || !email) {
        rows.push({ name: name || `Row ${i + 2}`, email: email || "—", error: "Missing name or email" });
        return;
      }
      if (emails.has(email.toLowerCase())) {
        rows.push({ name, email, error: "Duplicate email" });
        return;
      }
      emails.add(email.toLowerCase());
      rows.push({ name, email });
    });
    setPreview(rows);
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assessment-invite-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendBulk = () => {
    const valid = preview.filter((r) => !r.error);
    if (valid.length === 0) {
      toast.error("No valid rows to invite");
      return;
    }
    valid.forEach((r) => addAssessmentCandidate(assessmentId, { name: r.name, email: r.email }));
    toast.success(`Sent ${valid.length} invites`);
    setPreview([]);
    onInvited?.();
    onOpenChange(false);
  };

  const validCount = preview.filter((r) => !r.error).length;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setPreview([]);
        onOpenChange(o);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="z-[130]" />
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <DialogPanel
            className={cn(
              "flex max-h-[min(85vh,640px)] w-full max-w-[480px] flex-col overflow-hidden rounded-[20px]",
              "border border-white/60 bg-white/95 shadow-[0_24px_80px_-24px_rgba(var(--accent-rgb),0.35)] backdrop-blur-xl",
              "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
            )}
          >
            <div className="relative shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.08),transparent)] px-5 py-4">
              <DialogTitle className="pr-8 text-[1.0625rem] font-semibold tracking-[-0.03em]">
                Bulk invite
              </DialogTitle>
              <p className="mt-1 text-[12px] text-muted">
                Import candidates via CSV with validation and duplicate detection.
              </p>
              <DialogClose className={cn("absolute right-3 top-3", dialogCloseButtonSm)} aria-label="Close">
                <X className="h-4 w-4" strokeWidth={2} />
              </DialogClose>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center rounded-[12px] border-2 border-dashed px-4 py-8 text-center transition-colors",
                    dragOver
                      ? "border-accent/40 bg-accent/[0.05]"
                      : "border-[rgba(15,23,42,0.1)] bg-[rgba(15,23,42,0.02)]",
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) file.text().then(parseCsv);
                  }}
                >
                  <Upload className="h-6 w-6 text-accent/80" strokeWidth={1.5} />
                  <p className="mt-2 text-[12px] font-medium text-text">Drag & drop CSV</p>
                  <label className="mt-2 cursor-pointer text-[11px] font-semibold text-accent hover:underline">
                    Browse file
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) file.text().then(parseCsv);
                      }}
                    />
                  </label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 rounded-[10px] text-[12px]"
                  onClick={downloadTemplate}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CSV template
                </Button>
                {preview.length > 0 ? (
                  <div className="max-h-52 overflow-auto rounded-[10px] border border-[rgba(15,23,42,0.06)]">
                    <table className="w-full text-left text-[11px]">
                      <thead className="sticky top-0 bg-[#F8FAFC] text-[10px] font-semibold uppercase tracking-wide text-muted">
                        <tr>
                          <th className="px-2.5 py-1.5">Name</th>
                          <th className="px-2.5 py-1.5">Email</th>
                          <th className="px-2.5 py-1.5">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, i) => (
                          <tr key={i} className="border-t border-[rgba(15,23,42,0.04)]">
                            <td className="px-2.5 py-1.5 font-medium text-text">{row.name}</td>
                            <td className="px-2.5 py-1.5 text-muted">{row.email}</td>
                            <td
                              className={cn(
                                "px-2.5 py-1.5 font-medium",
                                row.error ? "text-amber-700" : "text-emerald-700",
                              )}
                            >
                              {row.error ?? "Valid"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
              <Button type="button" variant="outline" className="rounded-[10px]" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-[10px] bg-accent text-white hover:bg-accent-hover"
                disabled={validCount === 0}
                onClick={sendBulk}
              >
                Send {validCount > 0 ? `${validCount} ` : ""}invites
              </Button>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
