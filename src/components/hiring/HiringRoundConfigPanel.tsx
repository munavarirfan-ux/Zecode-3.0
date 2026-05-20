"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonSm,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  JOB_EVALUATION_TYPES,
  JOB_INTERVIEW_TYPES,
  type JobHiringStageConfig,
} from "@/lib/hiring/jobHiringStages";
import { MOCK_INTERVIEWERS } from "@/lib/hiring/scheduleInterview";
import { jobFormInputClass } from "./JobFormStepContent";

const compactInput = cn(jobFormInputClass, "h-9 text-[13px]");

export function HiringRoundConfigPanel({
  open,
  onOpenChange,
  stage,
  onSave,
  isNew,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: JobHiringStageConfig | null;
  onSave: (stage: JobHiringStageConfig) => void;
  isNew?: boolean;
}) {
  const [draft, setDraft] = useState<JobHiringStageConfig | null>(stage);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    if (open && stage) {
      setDraft({ ...stage });
      setAdvancedOpen(Boolean(stage.notes.trim()));
    }
  }, [open, stage]);

  if (!draft) return null;

  function toggleInterviewer(name: string) {
    const has = draft!.interviewerNames.includes(name);
    setDraft({
      ...draft!,
      interviewerNames: has
        ? draft!.interviewerNames.filter((n) => n !== name)
        : [...draft!.interviewerNames, name],
    });
  }

  function handleSave() {
    if (!draft?.stageName.trim()) return;
    onSave(draft);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[240] bg-[rgba(15,23,42,0.25)] backdrop-blur-[2px]" />
        <div className="fixed inset-0 z-[240] flex justify-end p-0 sm:p-3">
          <DialogPanel
            className={cn(
              "flex h-[100dvh] w-full flex-col overflow-hidden rounded-none border-l border-[rgba(15,23,42,0.08)] bg-white shadow-[-12px_0_40px_-20px_rgba(15,23,42,0.12)]",
              "sm:h-auto sm:w-[400px] sm:max-h-[min(640px,calc(100dvh-1.5rem))] sm:rounded-[16px] sm:border",
              "animate-in slide-in-from-right-4 duration-200",
            )}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[rgba(15,23,42,0.06)] px-5 py-4">
              <div>
                <DialogTitle className="text-[15px] font-semibold tracking-[-0.02em] text-[#18181B]">
                  {isNew ? "Add round" : "Edit round"}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-[12px] text-[#71717A]">
                  Configure interview details for this step.
                </DialogDescription>
              </div>
              <DialogClose className={dialogCloseButtonSm} aria-label="Close">
                <X className="h-4 w-4" strokeWidth={2} />
              </DialogClose>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <FormField label="Round name">
                <Input
                  value={draft.stageName}
                  onChange={(e) => setDraft({ ...draft, stageName: e.target.value })}
                  className={compactInput}
                  placeholder="e.g. Technical Round"
                  autoFocus
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Interview type">
                  <Select
                    value={draft.interviewType}
                    onValueChange={(v) =>
                      setDraft({ ...draft, interviewType: v as JobHiringStageConfig["interviewType"] })
                    }
                  >
                    <SelectTrigger className={compactInput}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_INTERVIEW_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Duration">
                  <div className="relative">
                    <Input
                      type="number"
                      min={15}
                      max={240}
                      step={5}
                      value={draft.durationMinutes}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          durationMinutes: Math.max(15, parseInt(e.target.value, 10) || 45),
                        })
                      }
                      className={cn(compactInput, "pr-10")}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#A1A1AA]">
                      min
                    </span>
                  </div>
                </FormField>
              </div>
              <FormField label="Evaluation type">
                <Select
                  value={draft.evaluationType}
                  onValueChange={(v) =>
                    setDraft({ ...draft, evaluationType: v as JobHiringStageConfig["evaluationType"] })
                  }
                >
                  <SelectTrigger className={compactInput}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_EVALUATION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Assigned interviewers">
                <ul className="max-h-36 space-y-0.5 overflow-y-auto rounded-lg border border-[rgba(15,23,42,0.06)] bg-[#FAFAFA] p-1.5">
                  {MOCK_INTERVIEWERS.map((person) => (
                    <li key={person.id}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12px] hover:bg-white">
                        <Checkbox
                          checked={draft.interviewerNames.includes(person.name)}
                          onCheckedChange={() => toggleInterviewer(person.name)}
                        />
                        <span className="font-medium text-[#3F3F46]">{person.name}</span>
                        <span className="text-[#A1A1AA]">{person.role}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </FormField>

              <div>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-[12px] font-medium text-[#71717A] hover:text-[#3F3F46]"
                  onClick={() => setAdvancedOpen((o) => !o)}
                >
                  Advanced settings
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", advancedOpen && "rotate-180")}
                  />
                </button>
                {advancedOpen ? (
                  <div className="mt-2">
                    <Textarea
                      rows={2}
                      value={draft.notes}
                      onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                      placeholder="Internal notes (optional)"
                      className="min-h-[56px] resize-none text-[13px]"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
              <Button
                type="button"
                variant="outline"
                className="h-9 flex-1 rounded-lg text-[13px]"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-9 flex-1 rounded-lg bg-forest text-[13px] text-white hover:bg-forest/90"
                disabled={!draft.stageName.trim()}
                onClick={handleSave}
              >
                {isNew ? "Add round" : "Save"}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
