export const JOB_FORM_STEPS = [
  { id: 1, key: "basic", label: "Basic Details" },
  { id: 2, key: "additional", label: "Additional Details" },
  { id: 3, key: "custom", label: "Custom Fields" },
  { id: 4, key: "hiring-stages", label: "Hiring Pipeline" },
] as const;

export type JobFormStepId = (typeof JOB_FORM_STEPS)[number]["id"];

export function hasJobWizardProgress(
  stepIndex: number,
  basic: { title: string },
  additional: {
    description: string;
    responsibilities: string;
    requiredSkills: string;
    niceToHave: string;
    salaryRange: string;
    openings: string;
    deadline: string;
  },
): boolean {
  if (stepIndex > 0) return true;
  if (basic.title.trim()) return true;
  if (additional.description.trim()) return true;
  if (additional.responsibilities.trim()) return true;
  if (additional.requiredSkills.trim()) return true;
  if (additional.niceToHave.trim()) return true;
  if (additional.salaryRange.trim()) return true;
  if (additional.deadline.trim()) return true;
  if (additional.openings !== "1") return true;
  return false;
}

export function isJobFormStepValid(
  stepIndex: number,
  data: { title: string },
  interviewRounds?: { title: string }[],
): boolean {
  const step = JOB_FORM_STEPS[stepIndex];
  if (!step) return false;
  if (step.key === "basic") return data.title.trim().length > 0;
  if (step.key === "hiring-stages") {
    if (!interviewRounds?.length) return false;
    const titles = interviewRounds.map((r) => r.title.trim());
    if (titles.some((t) => !t)) return false;
    return new Set(titles.map((t) => t.toLowerCase())).size === titles.length;
  }
  return true;
}
