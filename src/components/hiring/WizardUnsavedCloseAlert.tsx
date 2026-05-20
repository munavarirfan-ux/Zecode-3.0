"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actionBtn =
  "h-10 w-full rounded-[11px] text-[13px] font-medium sm:w-auto sm:min-w-[9.5rem]";

export function WizardUnsavedCloseAlert({
  open,
  onOpenChange,
  entityLabel,
  onSaveDraft,
  savingDraft = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** e.g. "assessment" or "job" */
  entityLabel: string;
  onSaveDraft: () => void | Promise<void>;
  savingDraft?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !savingDraft && onOpenChange(next)}>
      <AlertDialogContent className="z-[240] max-w-md rounded-[16px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            Your {entityLabel} isn&apos;t finished yet. If you close now, your progress will be lost unless
            you save it as a draft.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            disabled={savingDraft}
            className={cn(actionBtn, "mt-0 border-[rgba(15,23,42,0.1)]")}
          >
            Continue editing
          </AlertDialogCancel>
          <Button
            type="button"
            disabled={savingDraft}
            className={cn(actionBtn, "bg-forest text-white hover:bg-forest/92")}
            onClick={() => void onSaveDraft()}
          >
            {savingDraft ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden />
                Saving draft…
              </>
            ) : (
              "Save as draft"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
