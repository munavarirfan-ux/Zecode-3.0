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
  | "jobs"
  | "candidate-directory"
  | "interviews"
  | "assessments"
  | "assessment-drive"
  | "question-pool"
  | "reports"
  | "settings"
  | "interview-scheduling"
  | "google-meet-integration"
  | "zemeet-workspace"
  | "code-challenge"
  | "private-notes"
  | "interview-feedback"
  | "end-interview"
  | "auto-submit-interview"
  | "create-assessment"
  | "assessment-edit"
  | "assessment-delete"
  | "assessment-share-report"
  | "live-monitoring"
  | "proctoring"
  | "import-questions"
  | "manage-teams"
  | "theme-configuration"
  | "white-labelling"
  | "localization"
  | "migration";

export type FeatureCategory = "Core" | "Interview" | "Assessment" | "Enterprise";

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

export type JobsConfig = {
  maxActiveJobs: number;
  defaultJobVisibility: "Public" | "Private" | "Internal";
  requireApproval: boolean;
};

export type CandidateDirectoryConfig = {
  maxCandidates: number;
  candidateVisibility: "All team" | "Assigned users only";
  allowDuplicates: boolean;
};

export type InterviewsConfig = {
  monthlyLimit: number;
  defaultDuration: 30 | 45 | 60 | 90;
  allowReschedule: boolean;
  requireApproval: boolean;
};

export type GoogleMeetConfig = {
  autoGenerateLink: boolean;
};

export type ZemeetConfig = {
  enableCodeChallenge: boolean;
  enableResume: boolean;
  enableLinkedIn: boolean;
  enablePrivateNotes: boolean;
};

export type AssessmentConfig = {
  monthlyLimit: number;
  defaultDuration: number;
  defaultValidityDays: number;
  qualifyingPercentage: number;
};

export type AssessmentDriveConfig = {
  maxDrivesPerMonth: number;
  maxCandidatesPerDrive: number;
  enableLiveMonitoring: boolean;
};

export type ProctoringConfig = {
  cameraMonitoring: boolean;
  tabSwitchDetection: boolean;
  copyDetection: boolean;
  movementDetection: boolean;
};

export type QuestionPoolConfig = {
  maxQuestions: number;
  allowCustomQuestions: boolean;
  allowImportQuestions: boolean;
};

export type ReportsConfig = {
  enableExportReports: boolean;
  enableCandidateReportSharing: boolean;
};

export type TeamsConfig = {
  maxTeamMembers: number;
  allowedRoles: string[];
};

export type BrandingConfig = {
  allowLogoUpload: boolean;
  allowFaviconUpload: boolean;
  allowCustomThemeColors: boolean;
};

export type PlatformSettingsConfig = {
  enableLocalization: boolean;
  enableMigrationTools: boolean;
};

export type FeatureConfigState = {
  jobs: JobsConfig;
  candidateDirectory: CandidateDirectoryConfig;
  interviews: InterviewsConfig;
  googleMeet: GoogleMeetConfig;
  zemeet: ZemeetConfig;
  assessments: AssessmentConfig;
  assessmentDrive: AssessmentDriveConfig;
  proctoring: ProctoringConfig;
  questionPool: QuestionPoolConfig;
  reports: ReportsConfig;
  teams: TeamsConfig;
  branding: BrandingConfig;
  platformSettings: PlatformSettingsConfig;
};

export type CreateEnterpriseFormState = {
  details: EnterpriseDetailsForm;
  features: Record<FeatureId, boolean>;
  config: FeatureConfigState;
};

export type CreateEnterpriseStep = 0 | 1 | 2 | 3;

export type CreateEnterpriseFieldErrors = Partial<Record<keyof EnterpriseDetailsForm, string>>;
