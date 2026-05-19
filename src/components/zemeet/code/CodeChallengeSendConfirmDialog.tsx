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
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";

export function CodeChallengeSendConfirmDialog() {
  const { sendCodeChallengeOpen, setSendCodeChallengeOpen, sendCodeChallengeRequest } = useZeMeet();

  return (
    <AlertDialog open={sendCodeChallengeOpen} onOpenChange={setSendCodeChallengeOpen}>
      <AlertDialogContent className="z-[320]">
        <AlertDialogHeader>
          <AlertDialogTitle>Send code challenge request?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to send a live coding challenge request to the candidate?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={sendCodeChallengeRequest}>Send Request</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
