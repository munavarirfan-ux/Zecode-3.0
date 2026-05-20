"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DisableAssessmentDialog({
  open,
  onOpenChange,
  assessmentName,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentName: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[14px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Disable assessment?</AlertDialogTitle>
          <AlertDialogDescription>
            Candidates will not be able to access <span className="font-medium">{assessmentName}</span> while it is
            disabled. You can re-enable it anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-accent text-white hover:bg-accent-hover"
            onClick={onConfirm}
          >
            Disable
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
