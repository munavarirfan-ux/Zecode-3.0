import type { CreateEnterpriseFormState, FeatureId } from "./types";
import { ENTERPRISE_FEATURES } from "./features";

const DEFAULT_ENABLED: FeatureId[] = [
  "jobs",
  "candidate-directory",
  "interviews",
  "interview-scheduling",
  "google-meet-integration",
  "interview-feedback",
  "assessments",
  "question-pool",
  "reports",
  "manage-teams",
  "settings",
];

function defaultFeatures(): Record<FeatureId, boolean> {
  return ENTERPRISE_FEATURES.reduce(
    (acc, f) => {
      acc[f.id] = DEFAULT_ENABLED.includes(f.id);
      return acc;
    },
    {} as Record<FeatureId, boolean>,
  );
}

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
    features: defaultFeatures(),
    config: {
      jobs: {
        maxActiveJobs: 25,
        defaultJobVisibility: "Public",
        requireApproval: false,
      },
      candidateDirectory: {
        maxCandidates: 5000,
        candidateVisibility: "All team",
        allowDuplicates: false,
      },
      interviews: {
        monthlyLimit: 100,
        defaultDuration: 60,
        allowReschedule: true,
        requireApproval: false,
      },
      googleMeet: {
        autoGenerateLink: true,
      },
      zemeet: {
        enableCodeChallenge: true,
        enableResume: true,
        enableLinkedIn: true,
        enablePrivateNotes: true,
      },
      assessments: {
        monthlyLimit: 500,
        defaultDuration: 60,
        defaultValidityDays: 7,
        qualifyingPercentage: 60,
      },
      assessmentDrive: {
        maxDrivesPerMonth: 10,
        maxCandidatesPerDrive: 500,
        enableLiveMonitoring: true,
      },
      proctoring: {
        cameraMonitoring: true,
        tabSwitchDetection: true,
        copyDetection: false,
        movementDetection: false,
      },
      questionPool: {
        maxQuestions: 1000,
        allowCustomQuestions: true,
        allowImportQuestions: true,
      },
      reports: {
        enableExportReports: true,
        enableCandidateReportSharing: true,
      },
      teams: {
        maxTeamMembers: 20,
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Recruiter",
          "Hiring Manager",
          "Interviewer",
          "Evaluator",
          "Curator",
          "Viewer",
        ],
      },
      branding: {
        allowLogoUpload: true,
        allowFaviconUpload: true,
        allowCustomThemeColors: false,
      },
      platformSettings: {
        enableLocalization: false,
        enableMigrationTools: false,
      },
    },
  };
}
