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
          <AlertDialogTitle>Move to completed?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to move <span className="font-medium">{assessmentName}</span> to completed? Candidates
            will no longer be able to access it. You can reopen it anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-accent text-white hover:bg-accent-hover"
            onClick={onConfirm}
          >
            Move to Completed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
