import type { AddedBy } from "./stages";
import type { CandidateEditProfile, EducationEntry, EmployerEntry } from "./candidateProfile";
import type { HiringCandidate } from "./types";

export function displayCandidateName(profile: CandidateEditProfile, fallback: string): string {
  const name = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
  return name || fallback;
}

export function addedByLabel(addedBy?: AddedBy): string {
  switch (addedBy) {
    case "admin":
      return "Admin";
    case "superAdmin":
      return "Super Admin";
    case "external":
      return "External applicant";
    default:
      return "—";
  }
}

export function formatMonthYear(value: string): string {
  if (!value.trim()) return "—";
  const [year, month] = value.split("-");
  if (!year) return value;
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatEmployerDates(employer: EmployerEntry): string {
  const from = formatMonthYear(employer.fromDate);
  const to = employer.current ? "Present" : formatMonthYear(employer.toDate);
  if (from === "—" && to === "—") return "—";
  return `${from} – ${to}`;
}

export function computeTotalExperience(employers: EmployerEntry[]): string {
  let months = 0;
  const now = new Date();

  for (const emp of employers) {
    if (!emp.fromDate) continue;
    const [y, m] = emp.fromDate.split("-").map(Number);
    if (!y || !m) continue;
    const start = new Date(y, m - 1, 1);
    let end = now;
    if (!emp.current && emp.toDate) {
      const [ey, em] = emp.toDate.split("-").map(Number);
      if (ey && em) end = new Date(ey, em - 1, 1);
    }
    if (end < start) continue;
    months += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  }

  if (months <= 0) return "—";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years > 0 && rem > 0) return `${years} yr ${rem} mo`;
  if (years > 0) return `${years} yr`;
  return `${rem} mo`;
}

export function currentRoleLabel(employers: EmployerEntry[]): string {
  const current = employers.find((e) => e.current && e.summary.trim());
  if (current) return current.summary.trim().split("\n")[0] ?? "—";
  const first = employers.find((e) => e.summary.trim());
  if (!first) return "—";
  return first.summary.trim().split("\n")[0] ?? "—";
}

export function profileSummary(profile: CandidateEditProfile, candidate: HiringCandidate, roleTitle: string): string {
  if (profile.recruiterNotes.trim()) return profile.recruiterNotes.trim();
  const role = currentRoleLabel(profile.employers);
  const exp = computeTotalExperience(profile.employers);
  const skills =
    profile.skills.length > 0 ? profile.skills.slice(0, 5).join(", ") : candidate.skills.slice(0, 5).join(", ");
  return [
    `Applicant for ${roleTitle}.`,
    role !== "—" ? `Current role: ${role}.` : null,
    exp !== "—" ? `Approx. ${exp} experience.` : null,
    skills ? `Key skills: ${skills}.` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export function hasEducationData(entry: EducationEntry): boolean {
  return Boolean(entry.details.trim());
}

export function hasEmployerData(employer: EmployerEntry): boolean {
  return Boolean(employer.summary.trim());
}

export function resumeFileName(profile: CandidateEditProfile, candidate: HiringCandidate): string {
  if (profile.resumeFileName.trim()) return profile.resumeFileName.trim();
  if (candidate.resumeUrl) return candidate.resumeUrl.split("/").pop() ?? "Resume on file";
  return "";
}

export function candidateHasResume(profile: CandidateEditProfile, candidate: HiringCandidate): boolean {
  return profile.resumeFileName.trim().length > 0 || Boolean(candidate.resumeUrl?.trim());
}

export function resumeDisplayStatus(profile: CandidateEditProfile, candidate: HiringCandidate): string {
  if (!candidateHasResume(profile, candidate)) return "No resume uploaded";
  return candidate.resumeStatus ?? "Uploaded";
}
