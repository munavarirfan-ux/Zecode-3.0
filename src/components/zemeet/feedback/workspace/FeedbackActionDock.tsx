"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { feedbackFooterBtn } from "./feedbackWorkspaceTokens";

export function FeedbackActionDock({
  saving,
  submitting,
  onSaveDraft,
  onSubmit,
}: {
  saving: boolean;
  submitting: boolean;
  onSaveDraft: () => void;
  onSubmit: () => void;
}) {
  return (
    <footer
      className={cn(
        "sticky bottom-0 z-10 shrink-0 border-t border-[rgba(15,23,42,0.06)]",
        "bg-white/95 backdrop-blur-md",
        "px-4 pt-3 sm:px-6",
        "pb-[max(20px,env(safe-area-inset-bottom))]",
      )}
    >
      <div className="mx-auto flex w-full items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={saving || submitting}
          onClick={onSaveDraft}
          className={cn(
            feedbackFooterBtn,
            "border-[rgba(15,23,42,0.1)] bg-white text-[#3F3F46] hover:bg-[#FAFAFB] focus-visible:ring-forest/25",
          )}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save Draft"
          )}
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={submitting || saving}
          onClick={onSubmit}
          aria-busy={submitting}
          className={cn(
            feedbackFooterBtn,
            "min-w-[9.5rem] bg-forest text-white hover:bg-forest/90 focus-visible:ring-forest/30",
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Submitting…
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </div>
    </footer>
  );
}
