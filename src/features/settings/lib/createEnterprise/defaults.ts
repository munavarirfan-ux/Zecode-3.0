import type { CreateEnterpriseFormState, FeatureId } from "./types";
import { ENTERPRISE_FEATURES } from "./features";

function allFeatures(defaultOn = true): Record<FeatureId, boolean> {
  return ENTERPRISE_FEATURES.reduce(
    (acc, f) => {
      acc[f.id] = defaultOn;
      return acc;
    },
    {} as Record<FeatureId, boolean>,
  );
}

const defaultLimit = {
  planType: "Standard" as const,
  candidatesIncluded: 100,
  additionallyAdded: 0,
};

const defaultCount = {
  planType: "Standard" as const,
  monthlyCount: 50,
  maxConcurrent: 10,
};

export function createDefaultEnterpriseForm(): CreateEnterpriseFormState {
  return {
    details: {
      organisationName: "",
      domainName: "",
      defaultBaseDomain: "",
      natureOfBusiness: "",
      monthlyAssessments: "",
      numberOfEmployees: "",
      location: "",
      spocName: "",
      spocEmail: "",
      spocPhoneCountry: "+91",
      spocPhone: "",
      logoUrl: null,
      faviconUrl: null,
    },
    features: allFeatures(true),
    config: {
      assessments: { ...defaultLimit },
      interviews: { ...defaultLimit },
      proctoring: {
        planType: "Standard",
        cameraMonitoring: true,
        tabSwitchDetection: true,
        copyDetection: false,
        movementDetection: true,
      },
      whiteLabelling: {
        planType: "Standard",
        enabled: true,
        customLogo: true,
        customFavicon: true,
        customTheme: false,
      },
      importQuestions: {
        planType: "Standard",
        sources: { csv: true, hackerRank: true, codeSignal: false, mettl: false, customApi: false },
      },
      assessmentsCount: { ...defaultCount },
      interviewsCount: { ...defaultCount },
      endInterview: {
        planType: "Standard",
        interviewerCanEnd: true,
        adminForcedEnd: true,
      },
      autoSubmitInterview: {
        planType: "Standard",
        autoSubmitMinutes: 30,
      },
    },
  };
}

export function totalLimit(config: { candidatesIncluded: number; additionallyAdded: number }): number {
  return Math.max(0, config.candidatesIncluded + config.additionallyAdded);
}
