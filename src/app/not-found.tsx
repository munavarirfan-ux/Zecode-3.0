import { PremiumErrorState } from "@/components/onboarding/PremiumErrorState";
import { ERROR_STATE_PRESETS } from "@/lib/onboarding/emptyStatePresets";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  const preset = ERROR_STATE_PRESETS.notFound;
  return (
    <PremiumErrorState
      illustration={preset.illustration}
      headline={preset.headline}
      subtext={preset.subtext}
      recoveryLabel={preset.recoveryLabel}
      recoveryHref={ROUTES.dashboard}
    />
  );
}
