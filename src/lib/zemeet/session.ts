import { HIRING_CANDIDATES, HIRING_JOBS } from "@/lib/hiring/mockData";
import { getPrimaryInterviewForRound } from "@/lib/hiring/interviewKanbanOps";
import { parseZeMeetRoomId } from "./rooms";
import type { ZeMeetParticipant, ZeMeetSession } from "./types";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Resolve a ZeMeet session from room id (demo: in-memory hiring data) */
export function resolveZeMeetSession(
  roomId: string,
  viewerRole: ZeMeetSession["viewerRole"] = "interviewer",
): ZeMeetSession | null {
  const parsed = parseZeMeetRoomId(roomId, (id) =>
    HIRING_CANDIDATES.some((c) => c.id === id),
  );
  if (!parsed) return getDemoZeMeetSession(roomId, viewerRole);

  const candidate = HIRING_CANDIDATES.find((c) => c.id === parsed.candidateId);
  if (!candidate) return getDemoZeMeetSession(roomId, viewerRole);

  const job = HIRING_JOBS.find((j) => j.id === candidate.jobId);
  const roundTitle =
    candidate.currentSubstage ??
    parsed.roundSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const interview = getPrimaryInterviewForRound(candidate, roundTitle);

  const interviewerNames = interview?.interviewers ?? ["Elena Hoffmann", "Marcus Chen"];
  const participants: ZeMeetParticipant[] = [
    {
      id: candidate.id,
      name: candidate.name,
      role: "candidate",
      initials: initials(candidate.name),
      isMuted: false,
      isVideoOn: true,
    },
    ...interviewerNames.map((name, i) => ({
      id: `iv-${i}`,
      name,
      role: "interviewer" as const,
      title: i === 0 ? "Hiring Manager" : "Interviewer",
      initials: initials(name),
      isMuted: i > 0,
      isVideoOn: true,
    })),
  ];

  if (viewerRole === "observer") {
    participants.push({
      id: "observer-admin",
      name: "Admin Monitor",
      role: "observer",
      title: "Silent observer",
      initials: "AM",
      isMuted: true,
      isVideoOn: false,
      isObserver: true,
    });
  }

  const viewerId =
    viewerRole === "candidate"
      ? candidate.id
      : viewerRole === "observer"
        ? "observer-admin"
        : participants.find((p) => p.role === "interviewer")?.id ?? "iv-0";

  return {
    context: {
      roomId,
      jobTitle: job?.title ?? "Open Role",
      jobId: candidate.jobId,
      roundTitle,
      interviewType: interview?.interviewType ?? "Technical",
      scheduledAt: interview?.scheduledAt ?? "TBD",
      timezone: "Europe/Berlin (CET)",
      durationMinutes: interview?.durationMinutes ?? 45,
      candidateId: candidate.id,
      candidateName: candidate.name,
      interviewId: interview?.id ?? `i-${candidate.id}`,
      candidateIntel: {
        email: candidate.email,
        experience: candidate.experience,
        education: candidate.education,
        skills: candidate.skills,
        portfolioUrl: candidate.portfolioUrl,
        linkedin: candidate.linkedin,
        resumeUrl: candidate.resumeUrl,
        resumeStatus: candidate.resumeStatus,
      },
    },
    participants,
    viewerRole,
    viewerId,
    recordingEnabled: true,
    codeChallengeEnabled: interview?.hasCodeChallenge ?? interview?.interviewType === "Technical",
  };
}

/** Fallback demo session when room id is unknown */
function getDemoZeMeetSession(
  roomId: string,
  viewerRole: ZeMeetSession["viewerRole"],
): ZeMeetSession {
  return {
    context: {
      roomId,
      jobTitle: "Staff Product Designer",
      jobId: "staff-product-designer",
      roundTitle: "Technical Round 1",
      interviewType: "Technical",
      scheduledAt: "May 18 · 14:00 CET",
      timezone: "Europe/Berlin (CET)",
      durationMinutes: 45,
      candidateId: "demo-candidate",
      candidateName: "Emma Schneider",
      interviewId: "i-demo",
      candidateIntel: {
        email: "emma.schneider@email.com",
        experience: "7 years · Product Design · B2B SaaS",
        education: "M.A. Design — HfG Schwäbisch Gmünd",
        skills: ["Figma", "Design systems", "User research"],
        portfolioUrl: "https://emma.design",
        linkedin: "linkedin.com/in/emmaschneider",
        resumeUrl: "/resumes/emma-schneider.pdf",
        resumeStatus: "Reviewed",
      },
    },
    participants: [
      {
        id: "demo-candidate",
        name: "Emma Schneider",
        role: "candidate",
        initials: "ES",
        isMuted: false,
        isVideoOn: true,
      },
      {
        id: "iv-0",
        name: "Elena Hoffmann",
        role: "interviewer",
        title: "Hiring Manager",
        initials: "EH",
        isMuted: false,
        isVideoOn: true,
      },
    ],
    viewerRole,
    viewerId: viewerRole === "candidate" ? "demo-candidate" : "iv-0",
    recordingEnabled: true,
    codeChallengeEnabled: true,
  };
}
