import { LOCALIZATION_LANGUAGES } from "../constants/localizationLanguages";
import type { LocalizationCategory, LocalizationEntry } from "../settingsTypes";

export { LOCALIZATION_LANGUAGES };

export const LOCALIZATION_CATEGORIES: { id: LocalizationCategory; label: string }[] = [
  { id: "sidebar", label: "Sidebar" },
  { id: "dashboard", label: "Dashboard" },
  { id: "jobs", label: "Jobs" },
  { id: "interviews", label: "Interviews" },
  { id: "assessments", label: "Assessments" },
  { id: "question-pool", label: "Question Pool" },
  { id: "candidates", label: "Candidates" },
  { id: "enterprises", label: "All Enterprises" },
  { id: "settings", label: "Settings" },
  { id: "login", label: "Login" },
];

const SIDEBAR: LocalizationEntry[] = [
  { key: "nav.dashboard", label: "Dashboard", value: "Dashboard", defaultValue: "Dashboard" },
  { key: "nav.jobs", label: "Jobs", value: "Jobs", defaultValue: "Jobs" },
  { key: "nav.interviews", label: "Interviews", value: "Interviews", defaultValue: "Interviews" },
  { key: "nav.candidates", label: "Candidates", value: "Candidates", defaultValue: "Candidates" },
  { key: "nav.assessments", label: "Assessments", value: "Assessments", defaultValue: "Assessments" },
  { key: "nav.question_pool", label: "Question Pool", value: "Question Pool", defaultValue: "Question Pool" },
  { key: "nav.settings", label: "Settings", value: "Settings", defaultValue: "Settings" },
];

const DASHBOARD: LocalizationEntry[] = [
  {
    key: "dashboard.greeting",
    label: "Greeting title",
    value: "Good morning",
    defaultValue: "Good morning",
    helper: "Shown at top of dashboard hero",
  },
  {
    key: "dashboard.pipeline",
    label: "Pipeline label",
    value: "Hiring pipeline",
    defaultValue: "Hiring pipeline",
  },
  {
    key: "dashboard.insights",
    label: "Insights tab",
    value: "",
    defaultValue: "Insights",
    helper: "Missing in selected language",
  },
];

const JOBS: LocalizationEntry[] = [
  { key: "jobs.title", label: "Page title", value: "Jobs", defaultValue: "Jobs" },
  { key: "jobs.create", label: "Create job CTA", value: "Create job", defaultValue: "Create job" },
  { key: "jobs.pipeline", label: "Pipeline tab", value: "Pipeline", defaultValue: "Pipeline" },
];

const INTERVIEWS: LocalizationEntry[] = [
  { key: "interviews.title", label: "Page title", value: "Interviews", defaultValue: "Interviews" },
  { key: "interviews.schedule", label: "Schedule CTA", value: "Schedule interview", defaultValue: "Schedule interview" },
];

const ASSESSMENTS: LocalizationEntry[] = [
  { key: "assessments.title", label: "Page title", value: "Assessments", defaultValue: "Assessments" },
  { key: "assessments.invite", label: "Invite CTA", value: "Invite candidates", defaultValue: "Invite candidates" },
];

const QUESTION_POOL: LocalizationEntry[] = [
  { key: "qp.title", label: "Page title", value: "Question Pool", defaultValue: "Question Pool" },
  { key: "qp.create", label: "Create question", value: "Create Question", defaultValue: "Create Question" },
];

const CANDIDATES: LocalizationEntry[] = [
  { key: "candidates.title", label: "Page title", value: "Candidates", defaultValue: "Candidates" },
  { key: "candidates.add", label: "Add candidate", value: "Add candidate", defaultValue: "Add candidate" },
];

const ENTERPRISES: LocalizationEntry[] = [
  { key: "enterprises.title", label: "Page title", value: "All Enterprises", defaultValue: "All Enterprises" },
  { key: "enterprises.create", label: "Create enterprise", value: "Create enterprise", defaultValue: "Create enterprise" },
];

const SETTINGS_KEYS: LocalizationEntry[] = [
  { key: "settings.title", label: "Page title", value: "Settings", defaultValue: "Settings" },
  { key: "settings.migration", label: "Migration nav", value: "Migration", defaultValue: "Migration" },
  { key: "settings.localization", label: "Localization nav", value: "Localization", defaultValue: "Localization" },
];

const LOGIN: LocalizationEntry[] = [
  { key: "login.title", label: "Sign in title", value: "Sign in to Ze[code]", defaultValue: "Sign in to Ze[code]" },
  { key: "login.submit", label: "Submit button", value: "Continue", defaultValue: "Continue" },
  { key: "login.forgot", label: "Forgot password", value: "", defaultValue: "Forgot password?" },
];

export const LOCALIZATION_BY_CATEGORY: Record<LocalizationCategory, LocalizationEntry[]> = {
  sidebar: SIDEBAR,
  dashboard: DASHBOARD,
  jobs: JOBS,
  interviews: INTERVIEWS,
  assessments: ASSESSMENTS,
  "question-pool": QUESTION_POOL,
  candidates: CANDIDATES,
  enterprises: ENTERPRISES,
  settings: SETTINGS_KEYS,
  login: LOGIN,
};

function cloneState(): Record<LocalizationCategory, LocalizationEntry[]> {
  return Object.fromEntries(
    Object.entries(LOCALIZATION_BY_CATEGORY).map(([cat, entries]) => [
      cat,
      entries.map((e) => ({ ...e })),
    ]),
  ) as Record<LocalizationCategory, LocalizationEntry[]>;
}

const LANGUAGE_OVERRIDES: Record<string, Partial<Record<LocalizationCategory, Record<string, string>>>> = {
  de: {
    sidebar: {
      "nav.dashboard": "Übersicht",
      "nav.jobs": "Stellen",
      "nav.settings": "Einstellungen",
    },
    login: {
      "login.title": "Bei Ze[code] anmelden",
      "login.submit": "Weiter",
    },
  },
  ta: {
    sidebar: {
      "nav.dashboard": "டாஷ்போர்டு",
      "nav.jobs": "வேலைகள்",
      "nav.settings": "அமைப்புகள்",
    },
    login: {
      "login.title": "Ze[code]-இல் உள்நுழையவும்",
      "login.submit": "தொடரவும்",
    },
  },
  hi: {
    sidebar: {
      "nav.dashboard": "डैशबोर्ड",
      "nav.jobs": "नौकरियाँ",
      "nav.settings": "सेटिंग्स",
    },
    login: {
      "login.title": "Ze[code] में साइन इन करें",
      "login.submit": "जारी रखें",
    },
  },
  ar: {
    sidebar: {
      "nav.dashboard": "لوحة التحكم",
      "nav.jobs": "الوظائف",
      "nav.settings": "الإعدادات",
    },
    login: {
      "login.title": "تسجيل الدخول إلى Ze[code]",
      "login.submit": "متابعة",
    },
  },
};

export function getLocalizationStateForLanguage(langId: string): Record<LocalizationCategory, LocalizationEntry[]> {
  const base = cloneState();
  const overrides = LANGUAGE_OVERRIDES[langId];
  if (!overrides) return base;
  for (const [cat, keys] of Object.entries(overrides) as [LocalizationCategory, Record<string, string>][]) {
    base[cat] = base[cat].map((entry) =>
      keys[entry.key] !== undefined ? { ...entry, value: keys[entry.key] } : entry,
    );
  }
  return base;
}

export function getInitialLocalizationState(): Record<LocalizationCategory, LocalizationEntry[]> {
  return getLocalizationStateForLanguage("en");
}

export function buildAllLanguageStates(): Record<string, Record<LocalizationCategory, LocalizationEntry[]>> {
  return Object.fromEntries(
    LOCALIZATION_LANGUAGES.map((l) => [l.id, getLocalizationStateForLanguage(l.id)]),
  );
}
