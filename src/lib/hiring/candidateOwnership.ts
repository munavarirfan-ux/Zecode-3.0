import type { PreviewRole } from "@/config/previewRole";
import { getPreviewActorLabel } from "./feedbackPermissions";
import type { EngagementRecord, HiringCandidate } from "./types";
import { getRecruiterById, getRecruiterByName, recruiterIdFromName } from "./recruiters";

function isoDaysAgo(days: number): string {
  const d = new Date("2026-05-15");
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/** Seed ownership fields from legacy `recruiterOwner` + optional multi-recruiter demo rows */
export function enrichCandidateOwnership(candidate: HiringCandidate): HiringCandidate {
  if (candidate.ownerId && candidate.engagedBy?.length) {
    return {
      ...candidate,
      ownerName: candidate.ownerName ?? candidate.recruiterOwner,
    };
  }

  const ownerName = candidate.ownerName ?? candidate.recruiterOwner;
  const ownerProfile = getRecruiterByName(ownerName);
  const ownerId = candidate.ownerId ?? ownerProfile?.id ?? recruiterIdFromName(ownerName);

  const ownerRecord: EngagementRecord = {
    recruiterId: ownerId,
    recruiterName: ownerName,
    recruiterAvatarUrl: ownerProfile?.avatarUrl,
    firstEngagedAt: candidate.appliedAt,
    lastEngagedAt: candidate.lastActivity ? isoDaysAgo(1) : candidate.appliedAt,
    engagementType: candidate.emails.length > 0 ? "emailed" : "commented",
  };

  let engagedBy = candidate.engagedBy ?? [ownerRecord];

  if (
    engagedBy.length === 1 &&
    (candidate.id.endsWith("-2") ||
      candidate.name.includes("Patel") ||
      candidate.kanbanColumn === "shortlisted")
  ) {
    const second = getRecruiterByName("Alex Rivera");
    if (second && second.id !== ownerId) {
      engagedBy = [
        ownerRecord,
        {
          recruiterId: second.id,
          recruiterName: second.name,
          firstEngagedAt: isoDaysAgo(4),
          lastEngagedAt: isoDaysAgo(2),
          engagementType: "viewed",
        },
      ];
    }
  }

  return {
    ...candidate,
    ownerId,
    ownerName,
    ownerAvatarUrl: ownerProfile?.avatarUrl,
    engagedBy,
  };
}

export function getCurrentRecruiterFromRole(role: PreviewRole): {
  id: string;
  name: string;
} {
  const name = getPreviewActorLabel(role);
  const profile = getRecruiterByName(name);
  return {
    id: profile?.id ?? recruiterIdFromName(name),
    name,
  };
}
