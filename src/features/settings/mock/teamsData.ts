import type { WorkspaceMemberRole } from "../lib/settingsRolePermissions";

export type TeamMemberStatus = "active" | "pending" | "expired";

export type TeamMemberRow = {
  id: string;
  name: string;
  email: string;
  role: WorkspaceMemberRole;
  team: string;
  status: TeamMemberStatus;
  lastActive: string;
  permissionsSummary: string;
};

export type TeamGroup = {
  id: string;
  name: string;
  description: string;
  lead: string;
  color: string;
  memberCount: number;
};

export const MOCK_TEAMS: TeamGroup[] = [
  {
    id: "t1",
    name: "Product hiring",
    description: "Design and product roles",
    lead: "Ava Patel",
    color: "#7C3AED",
    memberCount: 6,
  },
  {
    id: "t2",
    name: "Engineering",
    description: "Technical interviews and assessments",
    lead: "Marcus Chen",
    color: "#2563EB",
    memberCount: 8,
  },
  {
    id: "t3",
    name: "Operations",
    description: "Scheduling and coordination",
    lead: "Noah Singh",
    color: "#059669",
    memberCount: 4,
  },
];

export const MOCK_TEAM_MEMBERS: TeamMemberRow[] = [
  {
    id: "m1",
    name: "Ava Patel",
    email: "ava@novatech.io",
    role: "recruiter",
    team: "Product hiring",
    status: "active",
    lastActive: "2m ago",
    permissionsSummary: "Jobs · Candidates · Interviews",
  },
  {
    id: "m2",
    name: "Marcus Chen",
    email: "marcus@novatech.io",
    role: "interviewer",
    team: "Engineering",
    status: "active",
    lastActive: "18m ago",
    permissionsSummary: "Interviews · Feedback",
  },
  {
    id: "m3",
    name: "Lina Hoffmann",
    email: "lina@novatech.io",
    role: "evaluator",
    team: "Engineering",
    status: "active",
    lastActive: "1h ago",
    permissionsSummary: "Assessments · Reviews",
  },
  {
    id: "m4",
    name: "Maya Torres",
    email: "maya@novatech.io",
    role: "curator",
    team: "Engineering",
    status: "active",
    lastActive: "3h ago",
    permissionsSummary: "Question pool",
  },
  {
    id: "m5",
    name: "Jamie Fox",
    email: "jamie@novatech.io",
    role: "viewer",
    team: "Operations",
    status: "active",
    lastActive: "Yesterday",
    permissionsSummary: "Read-only",
  },
  {
    id: "m6",
    name: "Elena Hoffmann",
    email: "elena@novatech.io",
    role: "recruiter",
    team: "Product hiring",
    status: "pending",
    lastActive: "—",
    permissionsSummary: "Invite pending",
  },
];
