import type { WorkspaceMemberRole } from "../lib/settingsRolePermissions";

export type TeamMemberStatus = "active" | "pending" | "expired";

export type TeamMemberRow = {
  id: string;
  name: string;
  email: string;
  role: WorkspaceMemberRole;
  status: TeamMemberStatus;
  lastActive: string;
};

export type RoleReference = {
  role: WorkspaceMemberRole;
  label: string;
  description: string;
  subtext: string;
};

export const ROLE_REFERENCES: RoleReference[] = [
  {
    role: "superAdmin",
    label: "Super Admin",
    description: "Takes complete control of the account",
    subtext:
      "Assumes full authority over the account, overseeing team management, interviews, assessments, and question pool",
  },
  {
    role: "admin",
    label: "Admin",
    description: "Platform Owner",
    subtext:
      "Administer users, oversees assessments and interviews, including scheduling and candidate invitations, and contribute to the question pool",
  },
  {
    role: "curator",
    label: "Curator",
    description: "Curates Questions",
    subtext:
      "Administer the question pool by contributing towards adding, editing, or removing the questions",
  },
  {
    role: "evaluator",
    label: "Evaluator",
    description: "Interviewer and Assessment Evaluator",
    subtext:
      "Evaluate assessments and interviews, by submitting feedback and scores",
  },
];

export const MOCK_TEAM_MEMBERS: TeamMemberRow[] = [
  {
    id: "m1",
    name: "Marcus Chen",
    email: "marcus@company.com",
    role: "superAdmin",
    status: "active",
    lastActive: "2m ago",
  },
  {
    id: "m2",
    name: "Ava Patel",
    email: "ava@company.com",
    role: "admin",
    status: "active",
    lastActive: "18m ago",
  },
  {
    id: "m3",
    name: "Noah Singh",
    email: "noah@company.com",
    role: "recruiter",
    status: "active",
    lastActive: "1h ago",
  },
  {
    id: "m4",
    name: "Lina Hoffmann",
    email: "lina@company.com",
    role: "evaluator",
    status: "active",
    lastActive: "3h ago",
  },
  {
    id: "m5",
    name: "Maya Torres",
    email: "maya@company.com",
    role: "curator",
    status: "active",
    lastActive: "Yesterday",
  },
  {
    id: "m6",
    name: "James Okonkwo",
    email: "james@company.com",
    role: "interviewer",
    status: "active",
    lastActive: "2d ago",
  },
  {
    id: "m7",
    name: "Elena Rossi",
    email: "elena@company.com",
    role: "viewer",
    status: "active",
    lastActive: "5d ago",
  },
  {
    id: "m8",
    name: "Sofia Martins",
    email: "sofia@company.com",
    role: "recruiter",
    status: "pending",
    lastActive: "—",
  },
];
