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
import {
  CSV_TEMPLATE_CONTENT,
  addScheduledCandidatesBulk,
  parseCandidatesCsv,
} from "@/lib/hiring/assessments/scheduledAssessmentsData";
import { cn } from "@/lib/utils";

type PreviewRow = { name: string; email: string; error?: string };

export function ScheduleBulkInviteDialog({
  open,
  onOpenChange,
  scheduleId,
  onInvited,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: string;
  onInvited?: () => void;
}) {
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [parsedRows, setParsedRows] = useState<{ name: string; email: string; linkedinUrl?: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleCsv = (text: string) => {
    const { candidates, errors } = parseCandidatesCsv(text);
    if (errors.length && candidates.length === 0) {
      toast.error(errors[0]);
      return;
    }
    setParsedRows(candidates);
    setPreview(
      candidates.map((c) => ({ name: c.name, email: c.email })),
    );
    if (errors.length) toast.message(errors[0]);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE_CONTENT], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assessment-candidates-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendBulk = () => {
    if (parsedRows.length === 0) {
      toast.error("Upload a CSV with valid candidates");
      return;
    }
    const n = addScheduledCandidatesBulk(scheduleId, parsedRows);
    toast.success(`Sent ${n} invites`);
    setPreview([]);
    setParsedRows([]);
    onInvited?.();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setPreview([]);
          setParsedRows([]);
        }
        onOpenChange(o);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="z-[130]" />
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <DialogPanel
            className={cn(
              "flex max-h-[min(85vh,640px)] w-full max-w-[528px] flex-col overflow-hidden rounded-[20px]",
              "border border-white/60 bg-white/95 shadow-[0_24px_80px_-24px_rgba(var(--accent-rgb),0.35)] backdrop-blur-xl",
              "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
            )}
          >
            <div className="relative shrink-0 border-b border-[rgba(15,23,42,0.06)] bg-[linear-gradient(135deg,rgba(var(--accent-rgb),0.08),transparent)] px-5 py-4">
              <DialogTitle className="pr-8 text-[1.0625rem] font-semibold tracking-[-0.03em]">
                Invite bulk
              </DialogTitle>
              <p className="mt-1 text-[12px] text-muted">Upload CSV, preview candidates, and send invites.</p>
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
                    if (file) file.text().then(handleCsv);
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
                        if (file) file.text().then(handleCsv);
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
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, i) => (
                          <tr key={i} className="border-t border-[rgba(15,23,42,0.04)]">
                            <td className="px-2.5 py-1.5 font-medium text-text">{row.name}</td>
                            <td className="px-2.5 py-1.5 text-muted">{row.email}</td>
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
                disabled={parsedRows.length === 0}
                onClick={sendBulk}
              >
                Send Bulk Invite
              </Button>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
