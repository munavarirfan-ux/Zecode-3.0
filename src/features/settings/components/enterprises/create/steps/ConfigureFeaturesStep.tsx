"use client";

import type { ReactNode } from "react";
import type { CreateEnterpriseFormState, FeatureId } from "../../../../lib/createEnterprise/types";
import {
  AssessmentDriveConfigCard,
  AssessmentsConfigCard,
  BrandingConfigCard,
  CandidateDirectoryConfigCard,
  GoogleMeetConfigCard,
  InterviewsConfigCard,
  JobsConfigCard,
  patchConfig,
  PlatformSettingsConfigCard,
  ProctoringConfigCard,
  QuestionPoolConfigCard,
  ReportsConfigCard,
  TeamsConfigCard,
  ZemeetConfigCard,
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

  if (features.jobs) {
    cards.push(
      <JobsConfigCard
        key="jobs"
        config={config.jobs}
        onChange={(patch) => onConfigChange(patchConfig(config, "jobs", patch))}
      />,
    );
  }

  if (features["candidate-directory"]) {
    cards.push(
      <CandidateDirectoryConfigCard
        key="candidate-directory"
        config={config.candidateDirectory}
        onChange={(patch) => onConfigChange(patchConfig(config, "candidateDirectory", patch))}
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
    );
  }

  if (features["google-meet-integration"]) {
    cards.push(
      <GoogleMeetConfigCard
        key="google-meet"
        config={config.googleMeet}
        onChange={(patch) => onConfigChange(patchConfig(config, "googleMeet", patch))}
      />,
    );
  }

  if (features["zemeet-workspace"]) {
    cards.push(
      <ZemeetConfigCard
        key="zemeet"
        config={config.zemeet}
        onChange={(patch) => onConfigChange(patchConfig(config, "zemeet", patch))}
      />,
    );
  }

  if (features.assessments) {
    cards.push(
      <AssessmentsConfigCard
        key="assessments"
        config={config.assessments}
        onChange={(patch) => onConfigChange(patchConfig(config, "assessments", patch))}
      />,
    );
  }

  if (features["assessment-drive"]) {
    cards.push(
      <AssessmentDriveConfigCard
        key="assessment-drive"
        config={config.assessmentDrive}
        onChange={(patch) => onConfigChange(patchConfig(config, "assessmentDrive", patch))}
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

  if (features["question-pool"]) {
    cards.push(
      <QuestionPoolConfigCard
        key="question-pool"
        config={config.questionPool}
        onChange={(patch) => onConfigChange(patchConfig(config, "questionPool", patch))}
      />,
    );
  }

  if (features.reports) {
    cards.push(
      <ReportsConfigCard
        key="reports"
        config={config.reports}
        onChange={(patch) => onConfigChange(patchConfig(config, "reports", patch))}
      />,
    );
  }

  if (features["manage-teams"]) {
    cards.push(
      <TeamsConfigCard
        key="teams"
        config={config.teams}
        onChange={(patch) => onConfigChange(patchConfig(config, "teams", patch))}
      />,
    );
  }

  if (features["theme-configuration"] || features["white-labelling"]) {
    cards.push(
      <BrandingConfigCard
        key="branding"
        config={config.branding}
        onChange={(patch) => onConfigChange(patchConfig(config, "branding", patch))}
      />,
    );
  }

  if (features.localization || features.migration) {
    cards.push(
      <PlatformSettingsConfigCard
        key="platform-settings"
        config={config.platformSettings}
        onChange={(patch) => onConfigChange(patchConfig(config, "platformSettings", patch))}
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
