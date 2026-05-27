"use client";

import type { ReactNode } from "react";
import type { CreateEnterpriseFormState, FeatureId } from "../../../../lib/createEnterprise/types";
import {
  AssessmentsConfigCard,
  AutoSubmitInterviewConfigCard,
  CountPlanCard,
  EndInterviewConfigCard,
  ImportQuestionsConfigCard,
  InterviewsConfigCard,
  patchConfig,
  ProctoringConfigCard,
  WhiteLabellingConfigCard,
} from "../config/FeatureConfigCards";
export function ConfigureFeaturesStep({
  features,
  config,
  onConfigChange,
}: {
  features: Record<FeatureId, boolean>;
  config: CreateEnterpriseFormState["config"];
  onConfigChange: (config: CreateEnterpriseFormState["config"]) => void;
  inModal?: boolean;
}) {
  const cards: ReactNode[] = [];

  if (features.assessments) {
    cards.push(
      <AssessmentsConfigCard
        key="assessments"
        config={config.assessments}
        onChange={(patch) => onConfigChange(patchConfig(config, "assessments", patch))}
      />,
      <CountPlanCard
        key="assessments-count"
        title="Assessments Count"
        description="Monthly throughput and concurrency limits."
        config={config.assessmentsCount}
        onChange={(patch) => onConfigChange(patchConfig(config, "assessmentsCount", patch))}
        monthlyLabel="Monthly assessment count"
        concurrentLabel="Max concurrent assessments"
      />,
    );
  }

  if (features.interviews) {
    cards.push(
      <InterviewsConfigCard
        key="interviews"
        config={config.interviews}
        onChange={(patch) => onConfigChange(patchConfig(config, "interviews", patch))}
      />,
      <CountPlanCard
        key="interviews-count"
        title="Interviews Count"
        description="Monthly throughput and concurrency limits."
        config={config.interviewsCount}
        onChange={(patch) => onConfigChange(patchConfig(config, "interviewsCount", patch))}
        monthlyLabel="Monthly interview count"
        concurrentLabel="Max concurrent interviews"
      />,
    );
  }

  if (features.proctoring) {
    cards.push(
      <ProctoringConfigCard
        key="proctoring"
        config={config.proctoring}
        onChange={(patch) => onConfigChange(patchConfig(config, "proctoring", patch))}
      />,
    );
  }

  if (features["white-labelling"]) {
    cards.push(
      <WhiteLabellingConfigCard
        key="white-labelling"
        config={config.whiteLabelling}
        onChange={(patch) => onConfigChange(patchConfig(config, "whiteLabelling", patch))}
      />,
    );
  }

  if (features["import-questions"]) {
    cards.push(
      <ImportQuestionsConfigCard
        key="import-questions"
        config={config.importQuestions}
        onChange={(patch) => onConfigChange(patchConfig(config, "importQuestions", patch))}
      />,
    );
  }

  if (features["end-interview"]) {
    cards.push(
      <EndInterviewConfigCard
        key="end-interview"
        config={config.endInterview}
        onChange={(patch) => onConfigChange(patchConfig(config, "endInterview", patch))}
      />,
    );
  }

  if (features["auto-submit-interview"]) {
    cards.push(
      <AutoSubmitInterviewConfigCard
        key="auto-submit"
        config={config.autoSubmitInterview}
        onChange={(patch) => onConfigChange(patchConfig(config, "autoSubmitInterview", patch))}
      />,
    );
  }

  if (cards.length === 0) {
    return (
      <p className="text-[13px] text-muted">
        No enabled features require configuration. Enable modules in the previous step.
      </p>
    );
  }

  return <div className="grid gap-4 sm:grid-cols-2">{cards}</div>;
}
