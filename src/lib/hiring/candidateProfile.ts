import { getCandidateById, registerCandidate } from "./mockData";
import type { HiringCandidate, HiringJob } from "./types";
import {
  CANDIDATE_SOURCES,
  SOURCE_CATEGORIES,
  STAGE_SUBSTAGES,
  getCandidateStage,
  getDefaultStageForAddedBy,
  getDefaultStageReason,
  getDefaultSubstageForAddedBy,
  inferSourceCategory,
  isCandidateInRejectedStage,
  normalizeSource,
  syncCandidateStageFields,
  type AddedBy,
  type CandidateSource,
  type HiringStageName,
  type SourceCategory,
} from "./stages";

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface EmployerEntry {
  id: string;
  designation: string;
  company: string;
  fromDate: string;
  toDate: string;
  current: boolean;
  summary: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  /** Free-form qualification details (institution, years, grades, etc.) */
  details: string;
  required: boolean;
  isHighest: boolean;
}

/** @deprecated Legacy shape — migrated to EducationEntry[] on read */
interface LegacyEducationDetails {
  masters: string;
  bachelors: string;
  twelfth: string;
  tenth: string;
}

export interface ApplicationDetails {
  stage: HiringStageName;
  substage: string;
  source: CandidateSource;
  sourceCategory: SourceCategory;
  tags: string[];
}

export interface CandidateEditProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  resumeFileName: string;
  skills: string[];
  socialLinks: SocialLink[];
  education: EducationEntry[];
  employers: EmployerEntry[];
  application: ApplicationDetails;
  recruiterNotes: string;
}

export type ProfileFieldErrors = Record<string, string>;

export const SUGGESTED_TAGS = [
  "Priority",
  "Full-stack",
  "Remote",
  "Design systems",
  "Senior",
  "Referral",
  "Fast track",
  "Portfolio reviewed",
] as const;

/** Fixed headings on add-candidate education step; not removable. */
export const PREDEFINED_EDUCATION_DEGREES = [
  { degree: "10th", required: true },
  { degree: "12th", required: true },
  { degree: "Bachelors", required: true },
  { degree: "Master's", required: true },
] as const;

const DEFAULT_EDUCATION_DEGREES = PREDEFINED_EDUCATION_DEGREES;

const profileStore = new Map<string, CandidateEditProfile>();

export function profileUid() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptySocialLink(): SocialLink {
  return { id: profileUid(), label: "", url: "" };
}

export function createEmptyEmployer(): EmployerEntry {
  return {
    id: profileUid(),
    designation: "",
    company: "",
    fromDate: "",
    toDate: "",
    current: false,
    summary: "",
  };
}

type LegacyEducationFields = {
  institution?: string;
  place?: string;
  yearOfPassing?: string;
  grade?: string;
  details?: string;
};

function legacyEducationDetails(seed?: LegacyEducationFields): string {
  if (!seed) return "";
  if (seed.details?.trim()) return seed.details.trim();
  return [seed.institution, seed.place, seed.yearOfPassing, seed.grade].filter(Boolean).join("\n").trim();
}

export function normalizeEducationEntry(
  entry: EducationEntry & LegacyEducationFields,
): EducationEntry {
  return {
    id: entry.id,
    degree: entry.degree,
    details: entry.details?.trim() ? entry.details : legacyEducationDetails(entry),
    required: entry.required ?? false,
    isHighest: entry.isHighest ?? false,
  };
}

export function createEducationEntry(
  degree: string,
  options?: {
    required?: boolean;
    isHighest?: boolean;
    seed?: LegacyEducationFields;
  },
): EducationEntry {
  return {
    id: profileUid(),
    degree,
    details: legacyEducationDetails(options?.seed),
    required: options?.required ?? false,
    isHighest: options?.isHighest ?? false,
  };
}

function parseName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], middleName: "", lastName: "" };
  if (parts.length === 2) return { firstName: parts[0], middleName: "", lastName: parts[1] };
  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

function defaultEmployers(candidate: HiringCandidate): EmployerEntry[] {
  const summary = candidate.experience?.trim() || "";
  return [
    {
      id: profileUid(),
      designation: "",
      company: "",
      fromDate: "",
      toDate: "",
      current: true,
      summary,
    },
  ];
}

function defaultSocialLinks(candidate: HiringCandidate): SocialLink[] {
  const links: SocialLink[] = [];
  if (candidate.linkedin) {
    links.push({
      id: profileUid(),
      label: "LinkedIn",
      url: candidate.linkedin.startsWith("http") ? candidate.linkedin : `https://${candidate.linkedin}`,
    });
  }
  if (candidate.github) {
    links.push({
      id: profileUid(),
      label: "GitHub",
      url: candidate.github.startsWith("http") ? candidate.github : `https://${candidate.github}`,
    });
  }
  if (candidate.portfolioUrl) {
    links.push({ id: profileUid(), label: "Portfolio", url: candidate.portfolioUrl });
  }
  if (links.length === 0) {
    links.push({ id: profileUid(), label: "LinkedIn", url: "" });
  }
  return links;
}

function seedFromLegacyText(text: string): LegacyEducationFields {
  if (!text.trim()) return {};
  return { details: text.trim() };
}

function defaultEducationEntries(candidate: HiringCandidate): EducationEntry[] {
  const bachelorsSeed = candidate.education?.trim() || "";
  const entries = DEFAULT_EDUCATION_DEGREES.map(({ degree, required }) =>
    createEducationEntry(degree, {
      required,
      seed: degree === "Bachelors" && bachelorsSeed ? seedFromLegacyText(bachelorsSeed) : undefined,
    }),
  );

  const highestIdx = entries.findIndex((e) => e.degree === "Master's" && e.details.trim());
  const fallbackHighest = entries.findIndex((e) => e.degree === "Bachelors");
  const highestIndex = highestIdx >= 0 ? highestIdx : fallbackHighest >= 0 ? fallbackHighest : 0;
  return entries.map((entry, index) => ({ ...entry, isHighest: index === highestIndex }));
}

function isLegacyEducation(value: unknown): value is LegacyEducationDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "bachelors" in value
  );
}

function migrateEducation(value: unknown): EducationEntry[] {
  if (Array.isArray(value)) {
    return (value as (EducationEntry & LegacyEducationFields)[]).map((entry) =>
      normalizeEducationEntry(entry),
    );
  }

  if (isLegacyEducation(value)) {
    const entries = DEFAULT_EDUCATION_DEGREES.map(({ degree, required }) =>
      createEducationEntry(degree, {
        required,
        seed: seedFromLegacyText(
          degree === "Master's"
            ? value.masters
            : degree === "Bachelors"
              ? value.bachelors
              : degree === "12th"
                ? value.twelfth
                : value.tenth,
        ),
      }),
    );
    const highestIdx = entries.findIndex((e) => e.details.trim());
    return entries.map((entry, index) => ({
      ...entry,
      isHighest: index === (highestIdx >= 0 ? highestIdx : 1),
    }));
  }

  return defaultEducationEntries({ education: "" } as HiringCandidate);
}

function normalizeStoredProfile(stored: CandidateEditProfile): CandidateEditProfile {
  const application = stored.application as ApplicationDetails & { stage?: HiringStageName };
  return {
    ...stored,
    recruiterNotes: stored.recruiterNotes ?? "",
    skills: stored.skills ?? [],
    education: migrateEducation(stored.education as unknown),
    application: {
      ...application,
      stage: application.stage ?? "Applied",
      source: normalizeSource(application.source as string),
      sourceCategory:
        application.sourceCategory ?? inferSourceCategory(normalizeSource(application.source as string)),
    },
  };
}

export function createEmptyCandidateProfile(_job: HiringJob, addedBy: AddedBy): CandidateEditProfile {
  const stage = getDefaultStageForAddedBy(addedBy);
  const substage = getDefaultSubstageForAddedBy(addedBy);
  const education = DEFAULT_EDUCATION_DEGREES.map(({ degree, required }) =>
    createEducationEntry(degree, {
      required,
      isHighest: degree === "Master's",
    }),
  );

  return {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    resumeFileName: "",
    skills: [],
    socialLinks: [createEmptySocialLink()],
    education,
    employers: [createEmptyEmployer()],
    application: {
      stage,
      substage,
      source: "Direct Upload",
      sourceCategory: inferSourceCategory("Direct Upload"),
      tags: [],
    },
    recruiterNotes: "",
  };
}

export function registerCandidateFromProfile(
  job: HiringJob,
  profile: CandidateEditProfile,
  addedBy: AddedBy,
): HiringCandidate {
  const name = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
  const currentEmployer = profile.employers.find((e) => e.current) ?? profile.employers[0];
  const experience =
    currentEmployer?.summary.trim().split("\n")[0] ||
    [currentEmployer?.company, currentEmployer?.designation].filter(Boolean).join(" · ") ||
    "—";

  const eduLines = profile.education.filter((entry) => entry.details.trim()).map(formatEducationEntry);

  const linkedIn = profile.socialLinks.find((l) => l.label.toLowerCase().includes("linkedin"));
  const github = profile.socialLinks.find((l) => l.label.toLowerCase().includes("github"));
  const portfolio = profile.socialLinks.find((l) => l.label.toLowerCase().includes("portfolio"));

  const candidate = registerCandidate({
    id: `c-${Date.now()}`,
    jobId: job.id,
    name: name || "New candidate",
    email: profile.email.trim(),
    phone: profile.mobile.trim(),
    location: job.location,
    addedBy,
    source: profile.application.source,
    appliedAt: new Date().toISOString().slice(0, 10),
    currentStage: profile.application.stage,
    currentSubstage: profile.application.substage,
    recruiterOwner: job.recruiterOwner,
    experience,
    skills: profile.skills.length > 0 ? [...profile.skills] : [],
    education: eduLines.join("\n") || "",
    linkedin: linkedIn?.url || undefined,
    github: github?.url || undefined,
    portfolioUrl: portfolio?.url || undefined,
    resumeUrl: profile.resumeFileName ? `/resumes/${profile.resumeFileName}` : undefined,
    noticePeriod: "—",
    expectedSalary: "—",
    resumeStatus: profile.resumeFileName ? "Parsed" : "Reviewed",
    resumeUploadedAt: profile.resumeFileName
      ? new Date().toISOString().slice(0, 10)
      : "",
    defaultStageReason: getDefaultStageReason(addedBy),
    recruiterNotes: profile.recruiterNotes.trim(),
  });

  syncCandidateStageFields(candidate, profile.application.stage, profile.application.substage);
  candidate.sourceCategory = profile.application.sourceCategory;
  saveCandidateEditProfile(candidate.id, profile);

  return candidate;
}

export function getCandidateEditProfile(candidate: HiringCandidate, job: HiringJob): CandidateEditProfile {
  const stored = profileStore.get(candidate.id);
  if (stored) return structuredClone(normalizeStoredProfile(stored));

  const { firstName, middleName, lastName } = parseName(candidate.name);
  const stage = getCandidateStage(candidate);
  const substage =
    candidate.currentSubstage ||
    STAGE_SUBSTAGES[stage][0] ||
    "New Application";
  const source = normalizeSource(candidate.source as string);
  const sourceCategory = candidate.sourceCategory ?? inferSourceCategory(source);

  return {
    firstName,
    middleName,
    lastName,
    email: candidate.email,
    mobile: candidate.phone,
    resumeFileName:
      candidate.resumeUrl?.split("/").pop() ??
      `${candidate.id.replace(/[^a-z0-9]/gi, "_")}_resume.pdf`,
    skills: [...(candidate.skills ?? [])],
    socialLinks: defaultSocialLinks(candidate),
    education: defaultEducationEntries(candidate),
    employers: defaultEmployers(candidate),
    application: {
      stage,
      substage,
      source,
      sourceCategory,
      tags: [],
    },
    recruiterNotes: candidate.recruiterNotes ?? "",
  };
}

export function saveCandidateEditProfile(candidateId: string, profile: CandidateEditProfile): HiringCandidate | null {
  profileStore.set(candidateId, structuredClone(profile));
  return applyProfileToCandidate(candidateId, profile);
}

function hiringTimelineAt(): string {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function prependTimelineEvent(
  candidate: HiringCandidate,
  label: string,
  detail?: string,
): HiringCandidate {
  return {
    ...candidate,
    timeline: [
      {
        id: `t-${Date.now()}`,
        label,
        detail: detail ?? label,
        at: hiringTimelineAt(),
      },
      ...candidate.timeline,
    ],
  };
}

/** Removes resume from profile; adds “Resume deleted” timeline event. */
export function deleteCandidateResume(
  candidateId: string,
  profile: CandidateEditProfile,
): HiringCandidate | null {
  const updated = saveCandidateEditProfile(candidateId, { ...profile, resumeFileName: "" });
  if (!updated) return null;
  return prependTimelineEvent(updated, "Resume deleted", "Resume removed from candidate profile");
}

/** Attaches a new resume after the previous one was deleted. */
export function uploadCandidateResume(
  candidateId: string,
  profile: CandidateEditProfile,
  fileName: string,
): HiringCandidate | null {
  const updated = saveCandidateEditProfile(candidateId, { ...profile, resumeFileName: fileName });
  if (!updated) return null;
  updated.resumeUploadedAt = new Date().toISOString().slice(0, 10);
  updated.resumeStatus = "Parsed";
  return prependTimelineEvent(updated, "Resume uploaded", fileName);
}

function formatEducationEntry(entry: EducationEntry): string {
  const details = entry.details.trim().replace(/\s+/g, " ");
  if (!details) return entry.degree;
  return `${entry.degree}: ${details}`;
}

export function applyProfileToCandidate(
  candidateId: string,
  profile: CandidateEditProfile,
): HiringCandidate | null {
  const candidate = getCandidateById(candidateId);
  if (!candidate) return null;

  const name = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
  candidate.name = name;
  candidate.email = profile.email;
  candidate.phone = profile.mobile;
  candidate.source = profile.application.source;
  candidate.sourceCategory = profile.application.sourceCategory;
  syncCandidateStageFields(candidate, profile.application.stage, profile.application.substage);

  const eduLines = profile.education.filter((entry) => entry.details.trim()).map(formatEducationEntry);
  candidate.education = eduLines.join("\n") || candidate.education;

  const currentEmployer = profile.employers.find((e) => e.current) ?? profile.employers[0];
  if (currentEmployer?.summary.trim()) {
    candidate.experience = currentEmployer.summary.trim().split("\n")[0] || candidate.experience;
  }

  const linkedIn = profile.socialLinks.find((l) => l.label.toLowerCase().includes("linkedin"));
  const github = profile.socialLinks.find((l) => l.label.toLowerCase().includes("github"));
  const portfolio = profile.socialLinks.find((l) => l.label.toLowerCase().includes("portfolio"));
  candidate.linkedin = linkedIn?.url;
  candidate.github = github?.url;
  candidate.portfolioUrl = portfolio?.url;
  candidate.recruiterNotes = profile.recruiterNotes.trim();
  candidate.skills = [...profile.skills];

  if (profile.resumeFileName.trim()) {
    candidate.resumeUrl = `/resumes/${profile.resumeFileName.trim()}`;
    candidate.resumeStatus = "Parsed";
    if (!candidate.resumeUploadedAt) {
      candidate.resumeUploadedAt = new Date().toISOString().slice(0, 10);
    }
  } else {
    candidate.resumeUrl = undefined;
    candidate.resumeUploadedAt = "";
    candidate.resumeStatus = "Reviewed";
  }

  return candidate;
}

export function getCandidateTags(candidateId: string, candidate: HiringCandidate): string[] {
  return profileStore.get(candidateId)?.application.tags ?? [];
}

export function saveCandidateTags(
  candidateId: string,
  tags: string[],
  candidate: HiringCandidate,
  job: HiringJob,
): HiringCandidate | null {
  const profile = getCandidateEditProfile(candidate, job);
  profile.application.tags = tags;
  profileStore.set(candidateId, profile);
  return applyProfileToCandidate(candidateId, profile);
}

export function getStoredProfile(candidateId: string): CandidateEditProfile | undefined {
  const stored = profileStore.get(candidateId);
  return stored ? normalizeStoredProfile(stored) : undefined;
}

export function isCandidateRejected(candidate: HiringCandidate): boolean {
  return isCandidateInRejectedStage(candidate);
}

export function rejectCandidate(
  candidateId: string,
  reason?: string,
  internalNote?: string,
): HiringCandidate | null {
  const candidate = getCandidateById(candidateId);
  if (!candidate) return null;

  syncCandidateStageFields(candidate, "Rejected", "Rejected");

  const detail = [
    reason ? `Reason: ${reason}` : null,
    internalNote ? `Note: ${internalNote}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  candidate.timeline = [
    {
      id: `t-reject-${Date.now()}`,
      label: "Applicant rejected",
      detail: detail || "Applicant rejected for this job",
      at: "May 15, 15:00",
    },
    ...candidate.timeline,
  ];

  return { ...candidate };
}

export function validateCandidateProfile(profile: CandidateEditProfile): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  if (!profile.firstName.trim()) errors.firstName = "First name is required";
  if (!profile.lastName.trim()) errors.lastName = "Last name is required";
  if (!profile.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!profile.mobile.trim()) errors.mobile = "Mobile number is required";

  profile.education.forEach((entry) => {
    if (!entry.required) return;
    if (!entry.details.trim()) {
      const label = entry.degree.trim() || "this qualification";
      errors[`education-${entry.id}`] = `Add details for ${label} (required)`;
    }
  });

  return errors;
}

export function hasProfileErrors(errors: ProfileFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export { CANDIDATE_SOURCES, SOURCE_CATEGORIES, STAGE_SUBSTAGES, HIRING_STAGES } from "./stages";
