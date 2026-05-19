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

export function CodeChallengeEndConfirmDialog() {
  const { endCodeChallengeOpen, setEndCodeChallengeOpen, confirmEndCodeChallenge } = useZeMeet();

  return (
    <AlertDialog open={endCodeChallengeOpen} onOpenChange={setEndCodeChallengeOpen}>
      <AlertDialogContent className="z-[320]">
        <AlertDialogHeader>
          <AlertDialogTitle>End code challenge?</AlertDialogTitle>
          <AlertDialogDescription>
            Both participants will return to the interview room. Challenge code, test results, and
            notes will be saved to the candidate report when the session ends.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmEndCodeChallenge}>End challenge</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
