"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AssessmentModalDrawer } from "@/components/hiring/assessments/AssessmentModalDrawer";
import { settingsPrimaryBtn, settingsSecondaryBtn } from "../../../settingsTokens";
import { FeaturesStep } from "../create/steps/FeaturesStep";
import type { FeatureId } from "../../../lib/createEnterprise/types";

export function FeaturesDrawer({
  open,
  onOpenChange,
  features,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: Record<FeatureId, boolean>;
  onSave: (features: Record<FeatureId, boolean>) => void;
}) {
  const [local, setLocal] = useState(features);

  const handleOpen = (next: boolean) => {
    if (next) setLocal(features);
    onOpenChange(next);
  };

  const handleSave = () => {
    onSave(local);
    onOpenChange(false);
    toast.success("Features updated");
  };

  return (
    <AssessmentModalDrawer
      open={open}
      onOpenChange={handleOpen}
      title="Enterprise Features"
      description="Toggle features for this enterprise."
      className="!max-w-[520px]"
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
      <FeaturesStep
        inModal
        features={local}
        onChange={setLocal}
      />
    </AssessmentModalDrawer>
  );
}
