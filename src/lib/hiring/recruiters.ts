/** Mock recruiter directory — maps preview actors to stable ids */

export type RecruiterProfile = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  teamId: string;
};

export const RECRUITERS: RecruiterProfile[] = [
  { id: "rec-marcus", name: "Marcus Chen", role: "Senior Talent Partner", teamId: "team-hiring-berlin" },
  { id: "rec-alex", name: "Alex Rivera", role: "Talent Partner", teamId: "team-hiring-berlin" },
  { id: "rec-ava", name: "Ava Patel", role: "Recruiter", teamId: "team-hiring-berlin" },
  { id: "rec-jordan", name: "Jordan Lee", role: "Recruiter", teamId: "team-hiring-berlin" },
  { id: "rec-irfan", name: "Irfan Hassan", role: "Interviewer", teamId: "team-hiring-berlin" },
  { id: "rec-raj", name: "Raj Mehta", role: "Recruiter", teamId: "team-hiring-berlin" },
  { id: "rec-kavya", name: "Kavya Menon", role: "Recruiter", teamId: "team-hiring-berlin" },
  { id: "rec-supriya", name: "Supriya Anand", role: "Recruiter", teamId: "team-hiring-berlin" },
];

const BY_NAME = new Map(RECRUITERS.map((r) => [r.name.toLowerCase(), r]));
const BY_ID = new Map(RECRUITERS.map((r) => [r.id, r]));

export function getRecruiterById(id: string): RecruiterProfile | undefined {
  return BY_ID.get(id);
}

export function getRecruiterByName(name: string): RecruiterProfile | undefined {
  return BY_NAME.get(name.trim().toLowerCase());
}

export function recruiterIdFromName(name: string): string {
  return getRecruiterByName(name)?.id ?? `rec-unknown-${name.replace(/\s+/g, "-").toLowerCase()}`;
}

export function getTeamRecruiterIds(teamId: string): string[] {
  return RECRUITERS.filter((r) => r.teamId === teamId).map((r) => r.id);
}

export const DEFAULT_HIRING_TEAM_ID = "team-hiring-berlin";
