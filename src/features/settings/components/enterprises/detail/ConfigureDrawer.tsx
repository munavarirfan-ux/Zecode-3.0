"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AssessmentModalDrawer } from "@/components/hiring/assessments/AssessmentModalDrawer";
import { settingsPrimaryBtn, settingsSecondaryBtn } from "../../../settingsTokens";
import { ConfigureFeaturesStep } from "../create/steps/ConfigureFeaturesStep";
import type { FeatureId, FeatureConfigState } from "../../../lib/createEnterprise/types";

export function ConfigureDrawer({
  open,
  onOpenChange,
  features,
  config,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: Record<FeatureId, boolean>;
  config: FeatureConfigState;
  onSave: (config: FeatureConfigState) => void;
}) {
  const [local, setLocal] = useState(config);

  const handleOpen = (next: boolean) => {
    if (next) setLocal(config);
    onOpenChange(next);
  };

  const handleSave = () => {
    onSave(local);
    onOpenChange(false);
    toast.success("Configuration updated");
  };

  return (
    <AssessmentModalDrawer
      open={open}
      onOpenChange={handleOpen}
      title="Configure Features"
      description="Adjust limits and settings for enabled features."
      className="!max-w-[640px]"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" className={settingsSecondaryBtn} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button type="button" className={settingsPrimaryBtn} onClick={handleSave}>
            Save Changes
          </button>
        </div>
      }
    >
      <ConfigureFeaturesStep
        features={features}
        config={local}
        onConfigChange={setLocal}
      />
    </AssessmentModalDrawer>
  );
}
