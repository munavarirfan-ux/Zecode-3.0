export type PlanType = "Standard" | "Professional" | "Custom";

export type NatureOfBusiness =
  | "IT Services"
  | "Product Company"
  | "Consulting"
  | "Education"
  | "Healthcare"
  | "Finance"
  | "Manufacturing"
  | "Retail"
  | "Other";

export type FeatureId =
  | "interviews"
  | "assessments"
  | "manage-teams"
  | "theme-configuration"
  | "interview-platform"
  | "assessment-platform"
  | "assessment-edit"
  | "assessment-delete"
  | "assessment-share-report"
  | "create-assessment"
  | "question-pool"
  | "candidate-directory"
  | "reports"
  | "settings"
  | "assessment-drive"
  | "live-monitoring"
  | "proctoring"
  | "white-labelling"
  | "import-questions"
  | "end-interview"
  | "auto-submit-interview";

export type FeatureCategory = "Core" | "Assessments" | "Interviews" | "Platform" | "Admin";

export type EnterpriseDetailsForm = {
  organisationName: string;
  domainName: string;
  defaultBaseDomain: string;
  natureOfBusiness: NatureOfBusiness | "";
  monthlyAssessments: string;
  numberOfEmployees: string;
  location: string;
  spocName: string;
  spocEmail: string;
  spocPhoneCountry: string;
  spocPhone: string;
  logoUrl: string | null;
  faviconUrl: string | null;
};

export type LimitPlanConfig = {
  planType: PlanType;
  candidatesIncluded: number;
  additionallyAdded: number;
};

export type ProctoringConfig = {
  planType: PlanType;
  cameraMonitoring: boolean;
  tabSwitchDetection: boolean;
  copyDetection: boolean;
  movementDetection: boolean;
};

export type WhiteLabellingConfig = {
  planType: PlanType;
  enabled: boolean;
  customLogo: boolean;
  customFavicon: boolean;
  customTheme: boolean;
};

export type ImportQuestionsConfig = {
  planType: PlanType;
  sources: {
    csv: boolean;
    hackerRank: boolean;
    codeSignal: boolean;
    mettl: boolean;
    customApi: boolean;
  };
};

export type CountPlanConfig = {
  planType: PlanType;
  monthlyCount: number;
  maxConcurrent: number;
};

export type EndInterviewConfig = {
  planType: PlanType;
  interviewerCanEnd: boolean;
  adminForcedEnd: boolean;
};

export type AutoSubmitInterviewConfig = {
  planType: PlanType;
  autoSubmitMinutes: number;
};

export type FeatureConfigState = {
  assessments: LimitPlanConfig;
  interviews: LimitPlanConfig;
  proctoring: ProctoringConfig;
  whiteLabelling: WhiteLabellingConfig;
  importQuestions: ImportQuestionsConfig;
  assessmentsCount: CountPlanConfig;
  interviewsCount: CountPlanConfig;
  endInterview: EndInterviewConfig;
  autoSubmitInterview: AutoSubmitInterviewConfig;
};

export type CreateEnterpriseFormState = {
  details: EnterpriseDetailsForm;
  features: Record<FeatureId, boolean>;
  config: FeatureConfigState;
};

export type CreateEnterpriseStep = 0 | 1 | 2 | 3;

export type CreateEnterpriseFieldErrors = Partial<Record<keyof EnterpriseDetailsForm, string>>;
