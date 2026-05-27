"use client";

import { cn } from "@/lib/utils";
import { hiringCanvas, hiringCard } from "@/components/hiring/hiringTokens";
import { formatQuestionTypeLabel } from "../tokens";
import type { EditorStep } from "../editor/editorConfig";
import type { QuestionDraftFormValues } from "../editor/schemas";
import { AutosaveBar } from "./AutosaveBar";
import { CandidatePreview } from "./CandidatePreview";
import { QuestionPoolEditorHero } from "./QuestionPoolEditorHero";
import { Stepper } from "./Stepper";

export function EditorShell({
  title,
  steps,
  currentStep,
  onStepClick,
  children,
  draft,
  dirty,
  lastSavedAt,
  onDiscard,
  onSaveDraft,
  onPublish,
  onContinue,
  onBack,
  stepped,
}: {
  title: string;
  steps: EditorStep[] | null;
  currentStep: number;
  onStepClick?: (index: number) => void;
  children: React.ReactNode;
  draft: QuestionDraftFormValues;
  dirty: boolean;
  lastSavedAt: Date | null;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onContinue?: () => void;
  onBack?: () => void;
  stepped: boolean;
}) {
  const typeLabel = formatQuestionTypeLabel(
    draft.type as Parameters<typeof formatQuestionTypeLabel>[0],
    draft.subtype,
  );

  const stepLabel =
    steps && steps.length > 0
      ? `Step ${currentStep + 1} of ${steps.length} · ${steps[currentStep]?.label ?? ""}`
      : undefined;

  const isReviewStep = steps?.[currentStep]?.id === "review";
  const showBack = stepped && currentStep > 0;

  const primaryLabel = isReviewStep || !stepped
    ? "Publish"
    : steps && currentStep < steps.length - 2
      ? "Continue"
      : "Continue to review";

  return (
    <div className={cn(hiringCanvas, "relative pb-20")}>
      <div className="relative w-full min-w-0 space-y-4 sm:space-y-5">
        <QuestionPoolEditorHero
          title={title}
          typeLabel={typeLabel}
          difficulty={draft.difficulty}
          stepLabel={stepLabel}
          dirty={dirty}
        />

        <section className={cn(hiringCard, "overflow-hidden p-0")}>
          {steps && steps.length > 0 ? (
            <Stepper steps={steps} current={currentStep} onStepClick={onStepClick} />
          ) : null}

          <div className="flex min-h-[calc(100dvh-16rem)] flex-col lg:flex-row">
            <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">{children}</div>
            <aside className="w-full shrink-0 border-t border-[rgba(15,23,42,0.06)] lg:w-[480px] lg:border-l lg:border-t-0 dark:border-white/[0.06]">
              <div className="lg:min-h-[calc(100dvh-16rem)]">
                <CandidatePreview draft={draft} />
              </div>
            </aside>
          </div>
        </section>
      </div>

      <AutosaveBar
        dirty={dirty}
        lastSavedAt={lastSavedAt}
        onDiscard={onDiscard}
        onSaveDraft={onSaveDraft}
        showBack={showBack}
        onBack={onBack}
        primaryLabel={primaryLabel}
        onPrimary={isReviewStep || !stepped ? onPublish : onContinue!}
        primaryVariant={isReviewStep || !stepped ? "publish" : "continue"}
      />
    </div>
  );
}
